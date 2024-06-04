"use client";

import { useEffect, useRef } from "react";
import P5 from "p5";

type P5SketchProps = {
  setup: (p: P5) => void;
  draw: (p: P5) => void;
};

const P5Sketch = ({ draw, setup }: P5SketchProps) => {
  const renderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    new P5((p: P5) => {
      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight).parent(
          renderRef.current || {},
        );
        setup(p);
      };
      p.draw = () => draw(p);

      window.onresize = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    });
  }, [draw, setup]);

  return <div ref={renderRef}></div>;
};

export default P5Sketch;
