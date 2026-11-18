"use client";

import { useEffect, useRef } from "react";
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

const PlayButton = ({ className = "w-16" }: { className?: string }) => {
  const { playing, toggle } = useMusicPlayer();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? "Stop Music Box" : "Play Music Box"}
      className={`play-button flex shrink-0 items-center justify-center rounded-full aspect-square ${className}`}
    >
      {playing ? <StopIcon /> : <PlayIcon />}
    </button>
  );
};

// The landing page's own control: the button with the piece named beside it.
export const HeroPlayer = ({
  title,
  caption,
}: {
  title: string;
  caption: string;
}) => {
  const { playing, setHeroControlVisible } = useMusicPlayer();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) =>
      setHeroControlVisible(entry.isIntersecting),
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      setHeroControlVisible(false);
    };
  }, [setHeroControlVisible]);

  return (
    <div ref={ref} className="flex items-center gap-5">
      <PlayButton className="w-20" />
      <p className="leading-snug">
        <span className="block font-headline text-xl">
          {playing ? `Playing ${title}` : `Play ${title}`}
        </span>
        <span className="block text-sm text-muted max-w-[26ch]">{caption}</span>
      </p>
    </div>
  );
};

// Follows the visitor around the site so the music can be stopped anywhere.
export const DockedPlayer = () => {
  const { heroControlVisible } = useMusicPlayer();

  return (
    <div
      className={`fixed bottom-0 right-0 z-20 p-6 sm:p-8 transition-opacity duration-300 ${heroControlVisible ? "invisible opacity-0" : "opacity-100"}`}
      aria-hidden={heroControlVisible}
    >
      <PlayButton />
    </div>
  );
};

export default PlayButton;
