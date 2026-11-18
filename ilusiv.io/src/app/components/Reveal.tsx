"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  // Seconds to wait after entering the viewport, for staggering siblings.
  delay?: number;
};

// Fades and lifts its children into place the first time they scroll into
// view. Content already on screen at load, and everything under reduced
// motion, is left alone.
const Reveal = ({ children, className = "", delay = 0 }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"hidden" | "shown" | undefined>();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setState("hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setState("shown");
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      data-reveal={state}
      style={{ transitionDelay: state === "shown" ? `${delay}s` : undefined }}
    >
      {children}
    </div>
  );
};

export default Reveal;
