class Drone {

  SinOsc osc => Gain g;
  0.0 => osc.gain;
  0.1 => g.gain;

  Math.random2(1,3) => int octave;
  55.0 * octave => osc.freq;
  Math.random2f(0.0,1.0) => osc.phase;

  fun setup(int note) {
    Std.mtof(note) => osc.freq;
  }

  fun void play() {
    g => dac;
    while (true) {
      if (osc.gain() < 1.0) {
        osc.gain() + 0.1 => osc.gain;
      }

      1::second => now;
    }
  }
}

class PadConfig {
  // time
  1000::ms => dur beat;
  16 => int pulseFactor;

  // notes
  0.2 => float gain;
  60 => int baseNote;
  4::beat => dur attack;
  0::beat => dur decay;
  1.0 => float sustain;
  32::beat => dur release;
  [-2, 0, 2] @=> int bottoms[];
  [7, 5, 10 ] @=> int mids[];
  [10, 12, 14, 14, 17] @=> int tops[];
  
  // lfo
  0.1 => float vibratoFreq;
  2 => int lfoMode;

  // fx
  0.5 => float reverbMix;
  14000 => float filterFreq;
  1.0 => float filterQ;

}

class Pad {
  PadConfig config;
  SinOsc vibrato;
  SinOsc s1, s2, s3;
  
  ADSR e => ResonZ f => NRev r => Gain g;
  
  vibrato => s1 => e;
  vibrato => s2 => e;
  vibrato => s3 => e;

  fun void setup(PadConfig c) {
    c @=> config;

    // lfo
    config.lfoMode => s1.sync => s2.sync => s3.sync;
    config.vibratoFreq => vibrato.freq;

    // reverb settings
    config.reverbMix => r.mix;

    // filter
    config.filterFreq => f.freq;
    config.filterQ => f.Q;

    e.set(config.attack, config.decay, config.sustain, config.release);
    config.gain => s1.gain => s2.gain => s3.gain;
  }

  fun void play() {
    g => dac;

    setup(config);

    while(true)
    {
        config.baseNote + config.bottoms[Math.random2(0, config.bottoms.cap() - 1)] => float freq1;
        config.baseNote + config.mids[Math.random2(0, config.mids.cap() - 1)] => float freq2;
        config.baseNote + config.tops[Math.random2(0, config.tops.cap() - 1)] => float freq3;

        Std.mtof(freq1) => s1.freq;
        Std.mtof(freq2) => s2.freq;
        Std.mtof(freq3) => s3.freq;

        e.keyOn();
        e.attackTime() + e.decayTime() => now;
        e.keyOff();

        Math.min((config.pulseFactor::config.beat - e.decayTime() - e.attackTime())/1::ms, e.releaseTime()/1::ms) => float step;
        Math.max(0, step)::ms => now;
    }
  }
}

38 => int base;
7 => int interval;
4 => int count;

Drone drone;
Pad pads[count];

if (me.args() > 0) {
    Std.atoi(me.arg(0)) => base;
}

if (me.args() > 1) {
    Std.atoi(me.arg(1)) => interval;
}

if (me.args() > 2) {
    Std.atoi(me.arg(2)) => count;
}

for (0 => int i; i < pads.size() - 1; i++) {
  pads[i] @=> Pad pad;
  base + i * interval => pad.config.baseNote;
  spork ~ pad.play();
}

drone.setup(base);
spork ~ drone.play();

while (true) {
  1::second => now;
}
