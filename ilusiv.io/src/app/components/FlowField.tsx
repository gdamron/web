"use client";

import { useCallback, useEffect, useMemo } from "react";
import P5Sketch from "./P5Sketch";
import { PLAY_EVENT } from "./MusicPlayer";
import P5 from "p5";

class Grain {
  pos: P5.Vector;
  prev: P5.Vector;
  vel: P5.Vector;
  acc: P5.Vector;
  maxSpeed: number;
  color: P5.Color;

  constructor(p5: P5, col: P5.Color) {
    this.pos = p5.createVector(p5.random(p5.width), p5.random(p5.height));
    this.prev = p5.createVector(this.pos.x, this.pos.y);
    this.vel = p5.createVector(0, 0);
    this.acc = p5.createVector(0, 0);
    this.maxSpeed = Math.random() * 3 + 2;
    this.color = col;
  }

  update(p5: P5) {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.edges(p5);
  }

  apply(force: P5.Vector) {
    this.acc.add(force);
  }

  show(p5: P5) {
    p5.stroke(this.color);
    p5.strokeWeight(1);
    p5.line(this.pos.x, this.pos.y, this.prev.x, this.prev.y);
    this.updatePrev();
  }

  edges(p5: P5) {
    const x = this.pos.x;
    const y = this.pos.y;
    if (x < 0) {
      this.pos.x = p5.width;
      this.updatePrev();
    }

    if (x > p5.width) {
      this.pos.x = 0;
      this.updatePrev();
    }

    if (y < 0) {
      this.pos.y = p5.height;
      this.updatePrev();
    }

    if (y > p5.height) {
      this.pos.y = 0;
      this.updatePrev();
    }
  }

  updatePrev() {
    this.prev.x = this.pos.x;
    this.prev.y = this.pos.y;
  }
}

const CALM_T_INCR = 0.0002;
const PLAYING_T_INCR = 0.0009;

// Each stroke is nearly transparent and the lines build up over time. On a
// white page they need a different weight to read as they do on black.
const STROKE_ON_DARK = "#ff33ff03";
const STROKE_ON_LIGHT = "#e633e602";

const strokeColor = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? STROKE_ON_DARK
    : STROKE_ON_LIGHT;

const createFlowState = () => ({
  rad: 15.5,
  grainCount: 1024,
  grains: new Array<Grain>(),
  tNoise: 0,
  currentNoise: 0,
  xyIncr: 0.025,
  tIncr: CALM_T_INCR,
  circleDiv: 3.5,
  flowMag: 1,
});

const FlowField = () => {
  const FLOW_STATE = useMemo(createFlowState, []);

  // The field shifts faster while the music plays, so the lines wander more.
  useEffect(() => {
    const onPlay = (event: Event) => {
      const playing = (event as CustomEvent<boolean>).detail;
      FLOW_STATE.tIncr = playing ? PLAYING_T_INCR : CALM_T_INCR;
    };
    window.addEventListener(PLAY_EVENT, onPlay);
    return () => window.removeEventListener(PLAY_EVENT, onPlay);
  }, [FLOW_STATE]);

  const setup = useCallback(
    (p: P5) => {
      FLOW_STATE.grains.length = 0;
      const color = p.color(strokeColor());
      for (let i = 0; i < FLOW_STATE.grainCount; i++) {
        FLOW_STATE.grains.push(new Grain(p, color));
      }
    },
    [FLOW_STATE],
  );

  const draw = useCallback(
    (p: P5) => {
      FLOW_STATE.tNoise += FLOW_STATE.tIncr;
      const { circleDiv, flowMag, grains, rad, tNoise, xyIncr } = FLOW_STATE;

      for (const grain of grains) {
        const row = p.floor(grain.pos.x / rad);
        const col = p.floor(grain.pos.y / rad);

        FLOW_STATE.currentNoise = p.noise(col * xyIncr, row * xyIncr, tNoise);

        const angle = FLOW_STATE.currentNoise * p.TWO_PI * circleDiv;
        const vec = P5.Vector.fromAngle(angle);
        vec.setMag(flowMag);

        grain.apply(vec);
        grain.update(p);
        grain.show(p);
      }
    },
    [FLOW_STATE],
  );

  return <P5Sketch setup={setup} draw={draw} stillFrames={500} />;
};

export default FlowField;
