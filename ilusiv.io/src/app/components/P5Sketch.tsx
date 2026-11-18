"use client";

import { useEffect, useRef } from "react";
import P5 from "p5";

type P5SketchProps = {
  setup: (p: P5) => void;
  draw: (p: P5) => void;
  // Frames to draw up front when the visitor prefers reduced motion; the
  // sketch then holds still instead of animating.
  stillFrames?: number;
};

// Runs a p5 sketch on a canvas that fills its parent element.
const P5Sketch = ({ draw, setup, stillFrames = 0 }: P5SketchProps) => {
  const renderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = renderRef.current;
    if (!host) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const sketch = new P5((p: P5) => {
      p.setup = () => {
        p.createCanvas(host.clientWidth, host.clientHeight).parent(host);
        setup(p);
        if (reduceMotion) {
          for (let i = 0; i < stillFrames; i++) draw(p);
          p.noLoop();
        }
      };
      p.draw = () => {
        if (!reduceMotion) draw(p);
      };
    });

    // A resize clears the canvas, so ignore height-only changes (mobile
    // browsers fire those as the address bar hides).
    let width = host.clientWidth;
    const observer = new ResizeObserver(() => {
      if (host.clientWidth === width) return;
      width = host.clientWidth;
      sketch.resizeCanvas(host.clientWidth, host.clientHeight);
      if (reduceMotion) {
        for (let i = 0; i < stillFrames; i++) draw(sketch);
      }
    });
    observer.observe(host);

    // Stop drawing while the canvas is scrolled out of view.
    const visibility = new IntersectionObserver(([entry]) => {
      if (reduceMotion) return;
      if (entry.isIntersecting) sketch.loop();
      else sketch.noLoop();
    });
    visibility.observe(host);

    return () => {
      visibility.disconnect();
      observer.disconnect();
      sketch.remove();
    };
  }, [draw, setup, stillFrames]);

  return <div ref={renderRef} className="h-full w-full" />;
};

export default P5Sketch;
