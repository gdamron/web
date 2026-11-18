"use client";

import { useCallback, useEffect, useRef } from "react";
import P5Sketch from "./P5Sketch";
import { useMusicPlayer } from "./MusicPlayer";
import P5 from "p5";

// Each grain leaves a faint stroke as it moves. The strokes build up on a
// hidden canvas, so paths that many grains share become currents.
//
// The build-up fades, or it would fill in. An 8-bit canvas cannot fade by a
// little every frame (the faintest strokes round back to where they were), so
// it fades by a lot every FADE_EVERY frames, and in between the picture is
// shown dimmed by however much of that fade is due. The two meet exactly, so
// what is seen fades continuously.
const FADE_EVERY = 90;
const FADE_AMOUNT = 0.3;

// Grains per pixel of canvas, so a phone's field is as open as a desktop's.
const GRAIN_DENSITY = 1 / 1400;
const MIN_GRAINS = 220;
const MAX_GRAINS = 1024;

// A grain lives this many frames, then starts again somewhere else. Without
// that, the field gathers every grain into a few places and empties the rest.
const MIN_LIFE = 300;
const MAX_LIFE = 900;

// Grains set off a few at a time, so the field arrives gradually.
const ENTRANCE_FRAMES = 120;

// A grain's stroke comes in over its first frames and goes out over its
// last, in this many steps of strength, so no line starts or stops abruptly.
const EASE_FRAMES = 90;
const EASE_LEVELS = 6;

const MIN_SPEED = 1.4;
const MAX_SPEED = 3.5;

const CALM_T_INCR = 0.00014;
const PLAYING_T_INCR = 0.00063;

// The strokes read differently on white than on black, so each has its own
// color and strength.
const STROKE_ON_DARK = "rgba(255, 51, 255, 0.06)";
const STROKE_ON_LIGHT = "rgba(221, 34, 221, 0.1)";

const strokeColor = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? STROKE_ON_DARK
    : STROKE_ON_LIGHT;

class Grain {
  x = 0;
  y = 0;
  // Where it was a frame ago; each frame strokes from there to here.
  px = 0;
  py = 0;
  vx = 0;
  vy = 0;
  maxSpeed = MIN_SPEED;
  // Frames to wait before setting off.
  wait = 0;
  life = 0;
  age = 0;
  // How strongly it strokes this frame, from 0 to EASE_LEVELS.
  level = 0;

  start(width: number, height: number, wait: number) {
    this.x = this.px = Math.random() * width;
    this.y = this.py = Math.random() * height;
    this.vx = 0;
    this.vy = 0;
    this.maxSpeed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
    this.wait = wait;
    this.life = MIN_LIFE + Math.random() * (MAX_LIFE - MIN_LIFE);
    this.age = 0;
    this.level = 0;
  }

  move(ax: number, ay: number) {
    this.px = this.x;
    this.py = this.y;
    this.vx += ax;
    this.vy += ay;
    const speed = Math.hypot(this.vx, this.vy);
    if (speed > this.maxSpeed) {
      this.vx *= this.maxSpeed / speed;
      this.vy *= this.maxSpeed / speed;
    }
    this.x += this.vx;
    this.y += this.vy;
    this.age += 1;
    this.life -= 1;
    const ease = Math.min(1, this.age / EASE_FRAMES, this.life / EASE_FRAMES);
    this.level = Math.ceil(Math.max(0, ease) * EASE_LEVELS);
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
  frame: 0,
  // Where the strokes build up; `render` copies it to the visible canvas.
  layer: null as CanvasRenderingContext2D | null,
});

const FlowField = ({ paused = false }: { paused?: boolean }) => {
  const stateRef = useRef<ReturnType<typeof createFlowState>>();
  stateRef.current ??= createFlowState();
  const FLOW_STATE = stateRef.current;

  // The field shifts faster while the music sounds, so the lines wander more.
  const { status } = useMusicPlayer();
  useEffect(() => {
    FLOW_STATE.tIncr = status === "playing" ? PLAYING_T_INCR : CALM_T_INCR;
  }, [FLOW_STATE, status]);

  const setup = useCallback(
    (p: P5) => {
      const visible = (p.drawingContext as CanvasRenderingContext2D).canvas;
      const canvas = document.createElement("canvas");
      canvas.width = visible.width;
      canvas.height = visible.height;
      const layer = canvas.getContext("2d");
      if (layer) {
        layer.scale(visible.width / p.width, visible.height / p.height);
        layer.lineWidth = 1;
        layer.strokeStyle = strokeColor();
      }
      FLOW_STATE.layer = layer;
      FLOW_STATE.frame = 0;

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

  // Moves every grain one frame along the field and strokes where it went.
  const step = useCallback(
    (p: P5) => {
      const { layer } = FLOW_STATE;
      if (!layer) return;

      FLOW_STATE.frame += 1;
      if (FLOW_STATE.frame % FADE_EVERY === 0) {
        layer.save();
        layer.globalCompositeOperation = "destination-out";
        layer.fillStyle = `rgba(0, 0, 0, ${FADE_AMOUNT})`;
        layer.fillRect(0, 0, p.width, p.height);
        layer.restore();
      }

      FLOW_STATE.tNoise += FLOW_STATE.tIncr;
      const { circleDiv, flowMag, grains, rad, tNoise, xyIncr } = FLOW_STATE;

      for (const grain of grains) {
        if (grain.wait > 0) {
          grain.wait -= 1;
          continue;
        }

        const row = Math.floor(grain.x / rad);
        const col = Math.floor(grain.y / rad);
        const angle =
          p.noise(col * xyIncr, row * xyIncr, tNoise) * p.TWO_PI * circleDiv;
        grain.move(Math.cos(angle) * flowMag, Math.sin(angle) * flowMag);
      }

      // One stroke per level of strength, each holding every grain at it.
      for (let level = 1; level <= EASE_LEVELS; level++) {
        layer.globalAlpha = level / EASE_LEVELS;
        layer.beginPath();
        for (const grain of grains) {
          if (grain.wait > 0 || grain.level !== level) continue;
          layer.moveTo(grain.px, grain.py);
          layer.lineTo(grain.x, grain.y);
        }
        layer.stroke();
      }
      layer.globalAlpha = 1;

      for (const grain of grains) {
        if (grain.wait > 0) continue;
        const gone =
          grain.x < 0 || grain.x > p.width || grain.y < 0 || grain.y > p.height;
        if (gone || grain.life <= 0) grain.start(p.width, p.height, 0);
      }
    },
    [FLOW_STATE],
  );

  // Shows the build-up, dimmed by the share of the next fade that is due.
  const render = useCallback(
    (p: P5) => {
      const { frame, layer } = FLOW_STATE;
      if (!layer) return;
      const context = p.drawingContext as CanvasRenderingContext2D;
      const due = (frame % FADE_EVERY) / FADE_EVERY;
      context.clearRect(0, 0, p.width, p.height);
      context.save();
      context.globalAlpha = Math.pow(1 - FADE_AMOUNT, due);
      context.drawImage(layer.canvas, 0, 0, p.width, p.height);
      context.restore();
    },
    [FLOW_STATE],
  );

  return (
    <P5Sketch
      setup={setup}
      step={step}
      render={render}
      stillFrames={400}
      paused={paused}
    />
  );
};

export default FlowField;
