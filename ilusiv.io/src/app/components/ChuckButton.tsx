"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FuguePlayerInstance } from "@ilusiv/fugue-js";
import PlayButton, { PlayState } from "./PlayButton";
import { getMediaAudioContext, getMediaSinkNode } from "../lib/iosUnmute";

const MUSIC_BOX_URL = "/fugue/music_box.json";

const ChuckButton = () => {
  const playerRef = useRef<FuguePlayerInstance | null>(null);
  const loadPromiseRef = useRef<Promise<FuguePlayerInstance> | null>(null);
  const [btnState, setBtnState] = useState<PlayState>(PlayState.NOT_PLAYING);

  const loadPlayer = useCallback(async () => {
    if (playerRef.current) {
      return playerRef.current;
    }

    if (loadPromiseRef.current) {
      return loadPromiseRef.current;
    }

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

    const controlFugue = async () => {
      if (btnState === PlayState.PLAYING) {
        const player = await loadPlayer();
        if (!cancelled) {
          await player.play();
        }
        return;
      }

      if (playerRef.current) {
        playerRef.current.stop();
      }
    };

    controlFugue().catch((error) => {
      console.error("Unable to control Fugue player", error);
      setBtnState(PlayState.NOT_PLAYING);
    });

    return () => {
      cancelled = true;
    };
  }, [btnState, loadPlayer]);

  useEffect(() => {
    return () => {
      const player = playerRef.current;
      playerRef.current = null;
      loadPromiseRef.current = null;
      void player?.dispose();
    };
  }, []);

  return <PlayButton onStateChanged={setBtnState} />;
};

export default ChuckButton;
