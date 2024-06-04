"use client";

import P5Sketch from "./P5Sketch";
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

const FlowField = () => {
  const FLOW_STATE = {
    rad: 15.5,
    grainCount: 1024,
    grains: new Array<Grain>(),
    color: "#cc00cc01",
    tNoise: 0,
    currentNoise: 0,
    xyIncr: 0.025,
    tIncr: 0.0002,
    circleDiv: 3.5,
    flowMag: 1,
  };

  return (
    <P5Sketch
      setup={(p) => {
        for (let i = 0; i < FLOW_STATE.grainCount; i++) {
          const grainColor = p.color(FLOW_STATE.color);
          const grain = new Grain(p, grainColor);
          FLOW_STATE.grains.push(grain);
        }
      }}
      draw={(p) => {
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
      }}
    />
  );
};

export default FlowField;
