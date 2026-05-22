// Routes Web Audio output through a MediaStream piped into an
// <audio playsinline> element. iOS classifies that as media playback,
// so output stays audible when the hardware silent switch is on.
//
// Usage:
//   1. Call primeMediaAudio() synchronously from the user gesture (e.g. click).
//   2. Pass getMediaAudioContext() to Chuck.init as the AudioContext.
//   3. Connect Chuck to getMediaSinkNode() instead of ctx.destination.

type Sink = {
  ctx: AudioContext;
  dest: MediaStreamAudioDestinationNode;
  el: HTMLAudioElement;
};

let sink: Sink | null = null;

function ensureSink(): Sink | null {
  if (typeof window === "undefined") return null;
  if (sink) return sink;

  const Ctor: typeof AudioContext =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;

  const ctx = new Ctor();
  const dest = ctx.createMediaStreamDestination();

  const el = document.createElement("audio");
  el.setAttribute("playsinline", "");
  el.setAttribute("webkit-playsinline", "");
  (el as HTMLAudioElement & { playsInline?: boolean }).playsInline = true;
  el.autoplay = true;
  el.srcObject = dest.stream;

  sink = { ctx, dest, el };
  return sink;
}

// Must be called from a synchronous user-gesture handler.
export function primeMediaAudio(): void {
  const s = ensureSink();
  if (!s) return;
  void s.ctx.resume().catch(() => {});
  void s.el.play().catch(() => {});
}

export function getMediaAudioContext(): AudioContext | null {
  return ensureSink()?.ctx ?? null;
}

export function getMediaSinkNode(): MediaStreamAudioDestinationNode | null {
  return ensureSink()?.dest ?? null;
}
