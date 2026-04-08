import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ALL_CURSOR_ACTION_TYPES,
  ALL_CURSOR_STATES,
  cursorReducer,
  initialCursorState,
  type CursorAction,
  type CursorState,
} from "@/lib/animations/cursor-state";

// Ground-truth legal transitions. Must match the reducer exactly.
const LEGAL: ReadonlyArray<[CursorState, CursorAction["type"], CursorState]> = [
  ["IDLE", "TICK_TYPING", "TYPING"],
  ["TYPING", "START_PAUSE_1", "PAUSE_1"],
  ["PAUSE_1", "PRESS_ENTER", "ENTER"],
  ["ENTER", "REVEAL_COMMIT", "COMMIT_REVEAL"],
  ["COMMIT_REVEAL", "START_DISSOLVE", "PAUSE_2"],
  ["PAUSE_2", "START_DISSOLVE", "DISSOLVE"],
  ["DISSOLVE", "EARTH_READY", "EARTH"],
  ["EARTH", "PIPELINE_PROGRESS", "PIPELINE_SCROLL"],
  ["PIPELINE_SCROLL", "PIPELINE_PROGRESS", "PIPELINE_SCROLL"],
  ["PIPELINE_SCROLL", "TRIGGER_FLASH", "WHITE_FLASH"],
  ["WHITE_FLASH", "REVEAL_HERO", "HERO_REVEALED"],
  ["HERO_REVEALED", "REPLAY", "IDLE"],
  // SKIP from every state.
  ...ALL_CURSOR_STATES.map(
    (s) =>
      [s, "SKIP", "HERO_REVEALED"] as [
        CursorState,
        CursorAction["type"],
        CursorState,
      ],
  ),
];

function makeAction(type: CursorAction["type"]): CursorAction {
  if (type === "PIPELINE_PROGRESS") return { type, value: 0 };
  return { type } as CursorAction;
}

function isLegal(state: CursorState, type: CursorAction["type"]): boolean {
  return LEGAL.some(([s, a]) => s === state && a === type);
}

describe("cursorReducer", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("starts in IDLE", () => {
    expect(initialCursorState).toBe("IDLE");
  });

  describe("legal transitions (asserted positively)", () => {
    for (const [from, action, to] of LEGAL) {
      it(`${from} + ${action} → ${to}`, () => {
        vi.stubEnv("NODE_ENV", "development");
        expect(cursorReducer(from, makeAction(action))).toBe(to);
      });
    }
  });

  describe("full 11×11 transition matrix — illegal pairs", () => {
    for (const state of ALL_CURSOR_STATES) {
      for (const type of ALL_CURSOR_ACTION_TYPES) {
        if (isLegal(state, type)) continue;

        it(`dev: ${state} + ${type} throws`, () => {
          vi.stubEnv("NODE_ENV", "development");
          expect(() => cursorReducer(state, makeAction(type))).toThrowError(
            `Illegal transition: ${state} + ${type}`,
          );
        });

        it(`prod: ${state} + ${type} is a no-op`, () => {
          vi.stubEnv("NODE_ENV", "production");
          expect(cursorReducer(state, makeAction(type))).toBe(state);
        });
      }
    }
  });

  it("REPLAY only legal from HERO_REVEALED", () => {
    vi.stubEnv("NODE_ENV", "development");
    for (const state of ALL_CURSOR_STATES) {
      if (state === "HERO_REVEALED") {
        expect(cursorReducer(state, { type: "REPLAY" })).toBe("IDLE");
      } else {
        expect(() => cursorReducer(state, { type: "REPLAY" })).toThrow();
      }
    }
  });
});
