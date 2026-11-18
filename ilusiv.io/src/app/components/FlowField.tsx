"use client";

import { useCallback, useEffect, useMemo } from "react";
import P5Sketch from "./P5Sketch";
import { PLAY_EVENT } from "./MusicPlayer";
import P5 from "p5";

// Each grain draws a line that trails behind it and fades along its length,
// so every line comes and goes on its own.
const TRAIL = 150;
// The trail is stroked in bands, each fainter than the one before it.
const BANDS = 10;
const BAND = TRAIL / BANDS;

// Grains per pixel of canvas, so a phone's field is as open as a desktop's.
const GRAIN_DENSITY = 1 / 1800;
const MIN_GRAINS = 200;
const MAX_GRAINS = 800;

// A grain lives this many frames, then starts again somewhere else. Without
// that, the field gathers every grain into a few places and empties the rest.
const MIN_LIFE = 400;
const MAX_LIFE = 1100;

// Grains set off a few at a time, so the field arrives gradually.
const ENTRANCE_FRAMES = 150;

const MIN_SPEED = 1.4;
const MAX_SPEED = 3.5;

const CALM_T_INCR = 0.00014;
const PLAYING_T_INCR = 0.00063;

// The lines read differently on white than on black, so each has its own
// color and strength (the alpha at the head of a line).
const ON_DARK = { rgb: "255, 51, 255", alpha: 0.3 };
const ON_LIGHT = { rgb: "221, 34, 221", alpha: 0.26 };

const palette = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? ON_DARK
    : ON_LIGHT;

class Grain {
  // The last TRAIL positions, newest at `head`.
  xs = new Float32Array(TRAIL);
  ys = new Float32Array(TRAIL);
  head = 0;
  count = 0;
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  maxSpeed = MIN_SPEED;
  // Frames to wait before setting off.
  wait = 0;
  life = 0;
  // Once a grain stops, its line keeps aging by this many frames until it is
  // gone.
  aged = 0;
  stopped = false;

  start(width: number, height: number, wait: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = 0;
    this.vy = 0;
    this.maxSpeed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
    this.wait = wait;
    this.life = MIN_LIFE + Math.random() * (MAX_LIFE - MIN_LIFE);
    this.count = 0;
    this.aged = 0;
    this.stopped = false;
  }

  move(ax: number, ay: number) {
    this.vx += ax;
    this.vy += ay;
    const speed = Math.hypot(this.vx, this.vy);
    if (speed > this.maxSpeed) {
      this.vx *= this.maxSpeed / speed;
      this.vy *= this.maxSpeed / speed;
    }
    this.x += this.vx;
    this.y += this.vy;
    this.head = (this.head + 1) % TRAIL;
    this.xs[this.head] = this.x;
    this.ys[this.head] = this.y;
    if (this.count < TRAIL) this.count += 1;
  }
}

const createFlowState = () => ({
  rad: 15.5,
  grains: new Array<Grain>(),
  tNoise: 0,
  xyIncr: 0.025,
  tIncr: CALM_T_INCR,
  circleDiv: 3.5,
  flowMag: 0.7,
  palette: ON_LIGHT,
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
      FLOW_STATE.palette = palette();
      const count = Math.min(
        MAX_GRAINS,
        Math.max(MIN_GRAINS, Math.round(p.width * p.height * GRAIN_DENSITY)),
      );
      FLOW_STATE.grains.length = 0;
      for (let i = 0; i < count; i++) {
        const grain = new Grain();
        grain.start(p.width, p.height, Math.random() * ENTRANCE_FRAMES);
        FLOW_STATE.grains.push(grain);
      }
    },
    [FLOW_STATE],
  );

  // Moves every grain one frame along the field.
  const step = useCallback(
    (p: P5) => {
      FLOW_STATE.tNoise += FLOW_STATE.tIncr;
      const { circleDiv, flowMag, grains, rad, tNoise, xyIncr } = FLOW_STATE;

      for (const grain of grains) {
        if (grain.wait > 0) {
          grain.wait -= 1;
          continue;
        }
        if (grain.stopped) {
          grain.aged += 1;
          if (grain.aged >= TRAIL) grain.start(p.width, p.height, 0);
          continue;
        }

        const row = Math.floor(grain.x / rad);
        const col = Math.floor(grain.y / rad);
        const angle =
          p.noise(col * xyIncr, row * xyIncr, tNoise) * p.TWO_PI * circleDiv;
        grain.move(Math.cos(angle) * flowMag, Math.sin(angle) * flowMag);

        grain.life -= 1;
        const gone =
          grain.x < 0 || grain.x > p.width || grain.y < 0 || grain.y > p.height;
        if (gone || grain.life <= 0) grain.stopped = true;
      }
    },
    [FLOW_STATE],
  );

  // Redraws every line from scratch: one stroke per band of the trail, each
  // band fainter than the one nearer the grain.
  const render = useCallback(
    (p: P5) => {
      const context = p.drawingContext as CanvasRenderingContext2D;
      const { grains, palette } = FLOW_STATE;
      context.clearRect(0, 0, p.width, p.height);
      context.lineWidth = 1;

      for (let band = 0; band < BANDS; band++) {
        const strength = Math.pow(1 - band / BANDS, 1.6);
        context.strokeStyle = `rgba(${palette.rgb}, ${palette.alpha * strength})`;
        context.beginPath();
        for (const grain of grains) {
          // Positions are numbered from the newest; a stopped grain's are
          // older by `aged`. Bands share their end points so the line joins.
          const from = Math.max(0, band * BAND - grain.aged);
          const to = Math.min(grain.count - 1, (band + 1) * BAND - grain.aged);
          if (to - from < 1) continue;
          for (let k = from; k <= to; k++) {
            const i = (grain.head - k + TRAIL) % TRAIL;
            if (k === from) context.moveTo(grain.xs[i], grain.ys[i]);
            else context.lineTo(grain.xs[i], grain.ys[i]);
          }
        }
        context.stroke();
      }
    },
    [FLOW_STATE],
  );

  return (
    <P5Sketch setup={setup} step={step} render={render} stillFrames={300} />
  );
};

export default FlowField;
