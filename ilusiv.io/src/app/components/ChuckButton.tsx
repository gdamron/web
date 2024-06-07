"use client";

import { useEffect, useState } from "react";
import PlayButton, { PlayState } from "./PlayButton";
import { Chuck } from "webchuck";

type ChuckButtonProps = {
  code: string;
};

const ChuckButton = ({ code }: ChuckButtonProps) => {
  const [chuck, setChuck] = useState<Chuck | null>(null);
  const [shreds, setShreds] = useState<number[]>([]);
  const [btnState, setBtnState] = useState<PlayState>(PlayState.NOT_PLAYING);
  const [prevBtnState, setPrevBtnState] = useState<PlayState>(
    PlayState.NOT_PLAYING,
  );

  useEffect(() => {
    if (btnState === prevBtnState) {
      return;
    }

    setPrevBtnState(btnState);

    const controlChuck = async () => {
      let chuckRef = chuck ?? (await Chuck.init([]));
      if (!chuck) {
        setChuck(chuckRef);
      }

      if (btnState === PlayState.PLAYING) {
        const shred = await chuckRef.runCode(code);
        setShreds([...shreds, shred]);
      } else {
        for (const shred of shreds) {
          try {
            await chuckRef.removeShred(shred);
          } catch (err) {
            console.warn(
              `Unable to remove shred ${shred}. It may have exited on its own.`,
            );
          }
        }

        setShreds([]);
      }
    };

    controlChuck();
  }, [btnState, prevBtnState, chuck, code, shreds]);

  return <PlayButton onStateChanged={setBtnState} />;
};

export default ChuckButton;
