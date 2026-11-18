"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useInverseAt } from "../lib/useInverseAt";
import { useMusicPlayer } from "./MusicPlayer";

const PlayIcon = () => (
  <svg
    className="ml-[12%] w-[30%] fill-current"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
    aria-hidden="true"
  >
    <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
  </svg>
);

const StopIcon = () => (
  <svg
    className="w-[30%] fill-current"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
    aria-hidden="true"
  >
    <path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z" />
  </svg>
);

type PlayButtonProps = {
  // Sizes and styles the circle.
  className?: string;
  // Sizes the clickable area when it should be larger than the circle.
  hitClassName?: string;
  // Extra content inside the button, such as a label beside the circle.
  children?: ReactNode;
};

const PlayButton = ({
  className = "w-16",
  hitClassName = "",
  children,
}: PlayButtonProps) => {
  const { playing, status, toggle } = useMusicPlayer();
  // The name starts with the words shown beside the button, for voice control.
  const label = {
    idle: "Play Music Box",
    loading: "Loading Music Box, press to cancel",
    playing: "Playing Music Box, press to stop",
    error: "Play Music Box",
  }[status];

  return (
    <button
      type="button"
      onClick={toggle}
      aria-busy={status === "loading"}
      aria-label={label}
      title="Music Box, a Fugue invention"
      className={`group/play flex shrink-0 items-center justify-center rounded-full ${hitClassName}`}
    >
      <span
        data-playing={playing}
        data-status={status}
        className={`play-button relative flex aspect-square shrink-0 items-center justify-center rounded-full ${className}`}
      >
        {playing ? <StopIcon /> : <PlayIcon />}
      </span>
      {children}
    </button>
  );
};

// A page's own control: one button holding the circle and the piece's name,
// with a line that reports loading and failure.
export const InlinePlayer = ({
  title,
  caption,
}: {
  title: string;
  caption: string;
}) => {
  const { status, setInlineControlVisible } = useMusicPlayer();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) =>
      setInlineControlVisible(entry.isIntersecting),
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      setInlineControlVisible(false);
    };
  }, [setInlineControlVisible]);

  const heading = {
    idle: `Play ${title}`,
    loading: `Loading ${title}…`,
    playing: `Playing ${title}`,
    error: `Play ${title}`,
  }[status];

  return (
    <div ref={ref}>
      <PlayButton
        className="play-button-solid w-16 sm:w-20"
        hitClassName="gap-5 rounded-none text-left"
      >
        <span className="leading-snug">
          <span className="block font-headline text-2xl">{heading}</span>
          <span className="mt-1 block max-w-[28ch] opacity-80">
            {status === "error"
              ? "The audio couldn't start. Try again."
              : caption}
          </span>
        </span>
      </PlayButton>
    </div>
  );
};

// What the roaming controls need to decide whether to show. They wait for
// hydration (so the server render never shows two controls) and step aside
// while a page's own control is in view.
const useRoamingState = () => {
  const { inlineControlVisible } = useMusicPlayer();
  const [ready, setReady] = useState(false);
  const [atFooter, setAtFooter] = useState(false);
  const pathname = usePathname();

  useEffect(() => setReady(true), []);

  // It also steps aside at the foot of the page, clear of the footer links.
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) =>
      setAtFooter(entry.isIntersecting),
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, [pathname]);

  return { ready, inlineControlVisible, atFooter };
};

const ROAMING_NOTE = {
  idle: "Play Music Box",
  loading: "Loading Music Box…",
  playing: "",
  error: "The audio couldn't start. Try again.",
};

// Follows the visitor around the site so the music can be stopped anywhere.
// On small screens the nav bar carries the control instead (NavPlayer).
export const DockedPlayer = () => {
  const { ready, inlineControlVisible, atFooter } = useRoamingState();
  const { playing, status } = useMusicPlayer();
  const inverse = useInverseAt("bottom", 48);
  // It clears the footer's links, unless music is playing and needs a stop.
  const visible = ready && !inlineControlVisible && (!atFooter || playing);

  const [introduced, setIntroduced] = useState(false);
  useEffect(() => {
    if (status === "playing") setIntroduced(true);
  }, [status]);
  // Until the visitor has played it once, a note over the hero says what the
  // button is. Loading and failure are always reported.
  const note =
    status === "idle" && (introduced || inverse) ? "" : ROAMING_NOTE[status];

  return (
    <div
      className={`docked-player pointer-events-none fixed bottom-0 right-0 z-20 hidden p-5 transition-opacity xl:p-8 duration-300 sm:block ${inverse ? "theme-inverse" : ""} ${visible ? "opacity-100" : "invisible opacity-0"}`}
      aria-hidden={!visible}
    >
      <PlayButton
        className="w-16"
        hitClassName="pointer-events-auto flex-col-reverse !items-end gap-3 rounded-none"
      >
        {note && (
          <span className="play-note hidden min-[1360px]:block">{note}</span>
        )}
      </PlayButton>
    </div>
  );
};

export const NavPlayer = () => {
  const { ready, inlineControlVisible } = useRoamingState();
  const visible = ready && !inlineControlVisible;

  return (
    <div
      className={`transition-opacity duration-300 sm:hidden ${visible ? "opacity-100" : "invisible opacity-0"}`}
      aria-hidden={!visible}
    >
      <PlayButton className="w-9 shadow-none" hitClassName="h-11 w-11" />
    </div>
  );
};

export default PlayButton;
