"use client";

import { useEffect, useRef } from "react";
import P5 from "p5";

type P5SketchProps = {
  setup: (p: P5) => void;
  // Advances the sketch by one frame, without drawing.
  step: (p: P5) => void;
  // Draws the sketch as it stands.
  render: (p: P5) => void;
  // Frames to advance up front when the visitor prefers reduced motion; the
  // sketch is then drawn once and holds still instead of animating.
  stillFrames?: number;
};

// Runs a p5 sketch on a canvas that fills its parent element.
const P5Sketch = ({ setup, step, render, stillFrames = 0 }: P5SketchProps) => {
  const renderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = renderRef.current;
    if (!host) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Starts the sketch from the beginning. Under reduced motion it is run
    // ahead and drawn once.
    const start = (p: P5) => {
      setup(p);
      if (!reduceMotion) return;
      for (let i = 0; i < stillFrames; i++) step(p);
      render(p);
    };

    const sketch = new P5((p: P5) => {
      p.setup = () => {
        p.createCanvas(host.clientWidth, host.clientHeight).parent(host);
        start(p);
        if (reduceMotion) p.noLoop();
      };
      p.draw = () => {
        if (reduceMotion) return;
        step(p);
        render(p);
      };
    });

    // A resize clears the canvas, so ignore height-only changes (mobile
    // browsers fire those as the address bar hides).
    let width = host.clientWidth;
    const observer = new ResizeObserver(() => {
      if (host.clientWidth === width) return;
      width = host.clientWidth;
      sketch.resizeCanvas(host.clientWidth, host.clientHeight);
      start(sketch);
    });
    observer.observe(host);

    // A sketch may pick its colors from the color scheme in setup.
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => {
      start(sketch);
    };
    scheme.addEventListener("change", onScheme);

    // Stop drawing while the canvas is scrolled out of view.
    const visibility = new IntersectionObserver(([entry]) => {
      if (reduceMotion) return;
      if (entry.isIntersecting) sketch.loop();
      else sketch.noLoop();
    });
    visibility.observe(host);

    return () => {
      scheme.removeEventListener("change", onScheme);
      visibility.disconnect();
      observer.disconnect();
      sketch.remove();
    };
  }, [setup, step, render, stillFrames]);

  return <div ref={renderRef} className="h-full w-full" />;
};

export default P5Sketch;
