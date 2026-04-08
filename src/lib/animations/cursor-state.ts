export type CursorState =
  | "IDLE"
  | "TYPING"
  | "PAUSE_1"
  | "ENTER"
  | "COMMIT_REVEAL"
  | "PAUSE_2"
  | "DISSOLVE"
  | "EARTH"
  | "PIPELINE_SCROLL"
  | "WHITE_FLASH"
  | "HERO_REVEALED";

export type CursorAction =
  | { type: "TICK_TYPING" }
  | { type: "START_PAUSE_1" }
  | { type: "PRESS_ENTER" }
  | { type: "REVEAL_COMMIT" }
  | { type: "START_DISSOLVE" }
  | { type: "EARTH_READY" }
  | { type: "PIPELINE_PROGRESS"; value: number }
  | { type: "TRIGGER_FLASH" }
  | { type: "REVEAL_HERO" }
  | { type: "SKIP" }
  | { type: "REPLAY" };

export const initialCursorState: CursorState = "IDLE";

export const ALL_CURSOR_STATES: readonly CursorState[] = [
  "IDLE",
  "TYPING",
  "PAUSE_1",
  "ENTER",
  "COMMIT_REVEAL",
  "PAUSE_2",
  "DISSOLVE",
  "EARTH",
  "PIPELINE_SCROLL",
  "WHITE_FLASH",
  "HERO_REVEALED",
] as const;

export const ALL_CURSOR_ACTION_TYPES: readonly CursorAction["type"][] = [
  "TICK_TYPING",
  "START_PAUSE_1",
  "PRESS_ENTER",
  "REVEAL_COMMIT",
  "START_DISSOLVE",
  "EARTH_READY",
  "PIPELINE_PROGRESS",
  "TRIGGER_FLASH",
  "REVEAL_HERO",
  "SKIP",
  "REPLAY",
] as const;

function legalNext(
  state: CursorState,
  action: CursorAction,
): CursorState | null {
  // SKIP from any state → HERO_REVEALED (no-op from HERO_REVEALED).
  if (action.type === "SKIP") return "HERO_REVEALED";

  switch (state) {
    case "IDLE":
      if (action.type === "TICK_TYPING") return "TYPING";
      return null;
    case "TYPING":
      if (action.type === "START_PAUSE_1") return "PAUSE_1";
      return null;
    case "PAUSE_1":
      if (action.type === "PRESS_ENTER") return "ENTER";
      return null;
    case "ENTER":
      if (action.type === "REVEAL_COMMIT") return "COMMIT_REVEAL";
      return null;
    case "COMMIT_REVEAL":
      if (action.type === "START_DISSOLVE") return "PAUSE_2";
      return null;
    case "PAUSE_2":
      if (action.type === "START_DISSOLVE") return "DISSOLVE";
      return null;
    case "DISSOLVE":
      if (action.type === "EARTH_READY") return "EARTH";
      return null;
    case "EARTH":
      if (action.type === "PIPELINE_PROGRESS") return "PIPELINE_SCROLL";
      return null;
    case "PIPELINE_SCROLL":
      if (action.type === "PIPELINE_PROGRESS") return "PIPELINE_SCROLL";
      if (action.type === "TRIGGER_FLASH") return "WHITE_FLASH";
      return null;
    case "WHITE_FLASH":
      if (action.type === "REVEAL_HERO") return "HERO_REVEALED";
      return null;
    case "HERO_REVEALED":
      if (action.type === "REPLAY") return "IDLE";
      return null;
  }
}

export function cursorReducer(
  state: CursorState,
  action: CursorAction,
): CursorState {
  const next = legalNext(state, action);
  if (next !== null) return next;
  if (process.env.NODE_ENV !== "production") {
    throw new Error(`Illegal transition: ${state} + ${action.type}`);
  }
  return state;
}
