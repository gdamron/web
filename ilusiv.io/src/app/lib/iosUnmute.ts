// Routes Web Audio output through the iOS "media" channel so it stays
// audible when the hardware silent switch is on. Works by playing a
// silent, looping <audio> element with playsinline set, from a user
// gesture. WebKit then classifies the page as media playback and the
// AudioContext piggybacks on that routing.

let unmuteEl: HTMLAudioElement | null = null;

// 0.04s of silence as a WAV data URL.
const SILENT_WAV =
  "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";

export function unmuteIosAudio(): void {
  if (typeof window === "undefined") return;
  if (unmuteEl) {
    void unmuteEl.play().catch(() => {});
    return;
  }

  const el = document.createElement("audio");
  el.setAttribute("playsinline", "");
  el.setAttribute("webkit-playsinline", "");
  (el as HTMLAudioElement & { playsInline?: boolean }).playsInline = true;
  el.loop = true;
  el.preload = "auto";
  el.src = SILENT_WAV;
  unmuteEl = el;

  void el.play().catch(() => {});
}
