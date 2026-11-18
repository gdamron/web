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

// Fired on window whenever playback starts or stops, so visuals outside the
// React tree (the flow field) can follow the music.
export const PLAY_EVENT = "ilusiv:playing";

type MusicPlayer = {
  playing: boolean;
  toggle: () => void;
  // The landing page shows its own control; the docked one steps aside for it.
  heroControlVisible: boolean;
  setHeroControlVisible: (visible: boolean) => void;
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
  const [playing, setPlaying] = useState(false);
  const [heroControlVisible, setHeroControlVisible] = useState(false);

  // Must run inside the click handler: iOS only unlocks audio on a gesture.
  const toggle = useCallback(() => {
    primeMediaAudio();
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
            console.error("Fugue player error", error);
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

    const control = async () => {
      if (playing) {
        const player = await loadPlayer();
        if (!cancelled) await player.play();
        return;
      }
      playerRef.current?.stop();
    };

    control().catch((error) => {
      console.error("Unable to control Fugue player", error);
      setPlaying(false);
    });

    window.dispatchEvent(new CustomEvent(PLAY_EVENT, { detail: playing }));
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
      ms.setActionHandler("play", toggle);
      ms.setActionHandler("pause", toggle);
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
  }, [toggle]);

  useEffect(() => {
    return () => {
      const player = playerRef.current;
      playerRef.current = null;
      loadPromiseRef.current = null;
      void player?.dispose();
    };
  }, []);

  const value = useMemo(
    () => ({ playing, toggle, heroControlVisible, setHeroControlVisible }),
    [playing, toggle, heroControlVisible],
  );

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
};
