// Tiny typed wrapper around the Plausible inline script global. SSR-safe and
// no-ops when the global is missing (script blocked, ad-blocker, etc.). No PII
// payloads — only the closed event-name union below.

export type CinematicEvent =
  | "cinematic_completed"
  | "cinematic_skipped"
  | "cinematic_crashed";

type PlausibleFn = (event: string) => void;

declare global {
  interface Window {
    plausible?: PlausibleFn;
  }
}

export function track(event: CinematicEvent): void {
  if (typeof window === "undefined") return;
  window.plausible?.(event);
}
