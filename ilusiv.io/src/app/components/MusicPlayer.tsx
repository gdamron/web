"use client";

import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { FuguePlayerInstance } from "@ilusiv/fugue-js";
import {
  getMediaAudioContext,
  getMediaSinkNode,
  primeMediaAudio,
} from "../lib/iosUnmute";

const MUSIC_BOX_URL = "/fugue/music_box.json";
const TRACK = { title: "Music Box", artist: "ilusiv" };

export type PlayerStatus = "idle" | "loading" | "playing" | "error";

type MusicPlayer = {
  // What the visitor asked for; `status` says how far it has got.
  playing: boolean;
  status: PlayerStatus;
  toggle: () => void;
};

const STATUS_NEWS: Record<PlayerStatus, string> = {
  idle: "",
  loading: "Loading Music Box…",
  playing: "Playing Music Box",
  error: "The audio couldn't start. Try again.",
};

const MusicPlayerContext = createContext<MusicPlayer | null>(null);

export const useMusicPlayer = (): MusicPlayer => {
  const player = useContext(MusicPlayerContext);
  if (!player) {
    throw new Error("useMusicPlayer must be used inside MusicPlayerProvider");
  }
  return player;
};

export const MusicPlayerProvider = ({ children }: PropsWithChildren) => {
  const playerRef = useRef<FuguePlayerInstance | null>(null);
  const loadPromiseRef = useRef<Promise<FuguePlayerInstance> | null>(null);
  const queueRef = useRef<Promise<void>>(Promise.resolve());
  const [playing, setPlaying] = useState(false);
  const [sounding, setSounding] = useState(false);
  const [failed, setFailed] = useState(false);

  // Must run inside the click handler: iOS only unlocks audio on a gesture.
  const toggle = useCallback(() => {
    primeMediaAudio();
    setFailed(false);
    setPlaying((p) => !p);
  }, []);

  const loadPlayer = useCallback(async () => {
    if (playerRef.current) return playerRef.current;
    if (loadPromiseRef.current) return loadPromiseRef.current;

    loadPromiseRef.current = (async () => {
      try {
        const mediaCtx = getMediaAudioContext();
        const sinkNode = getMediaSinkNode();
        const [{ FuguePlayer }, invention] = await Promise.all([
          import("@ilusiv/fugue-js"),
          fetch(MUSIC_BOX_URL).then((response) => {
            if (!response.ok) {
              throw new Error(`Unable to load ${MUSIC_BOX_URL}`);
            }
            return response.text();
          }),
        ]);

        const player = await FuguePlayer.create({
          ...(mediaCtx ? { audioContext: mediaCtx } : {}),
          ...(sinkNode ? { destination: sinkNode } : {}),
          onError(error) {
            console.error("fyūg player error", error);
            setFailed(true);
            setSounding(false);
            setPlaying(false);
          },
        });

        await player.loadInvention(invention);
        playerRef.current = player;
        return player;
      } catch (error) {
        loadPromiseRef.current = null;
        throw error;
      }
    })();

    return loadPromiseRef.current;
  }, []);

  useEffect(() => {
    let cancelled = false;

    // One request at a time: a stop waits for the play before it, so a quick
    // play-then-stop can never leave audio sounding behind an idle button.
    const control = async () => {
      if (cancelled) return;
      if (playing) {
        const player = await loadPlayer();
        if (cancelled) return;
        await player.play();
        if (!cancelled) setSounding(true);
        return;
      }
      setSounding(false);
      await playerRef.current?.stop();
    };

    queueRef.current = queueRef.current.then(control).catch((error) => {
      console.error("Unable to control fyūg player", error);
      setFailed(true);
      setSounding(false);
      setPlaying(false);
    });

    if ("mediaSession" in navigator) {
      navigator.mediaSession.playbackState = playing ? "playing" : "paused";
    }

    return () => {
      cancelled = true;
    };
  }, [playing, loadPlayer]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    ms.metadata = new window.MediaMetadata(TRACK);
    try {
      ms.setActionHandler("play", () => {
        primeMediaAudio();
        setFailed(false);
        setPlaying(true);
      });
      ms.setActionHandler("pause", () => setPlaying(false));
    } catch {
      // unsupported action
    }
    return () => {
      try {
        ms.setActionHandler("play", null);
        ms.setActionHandler("pause", null);
      } catch {
        // ignore
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      const player = playerRef.current;
      playerRef.current = null;
      loadPromiseRef.current = null;
      void player?.dispose();
    };
  }, []);

  const status: PlayerStatus = failed
    ? "error"
    : !playing
      ? "idle"
      : sounding
        ? "playing"
        : "loading";

  const value = useMemo(
    () => ({
      playing,
      status,
      toggle,
    }),
    [playing, status, toggle],
  );

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
      {/* Every play control reports its progress here, wherever it sits. */}
      <p role="status" className="sr-only">
        {STATUS_NEWS[status]}
      </p>
    </MusicPlayerContext.Provider>
  );
};
