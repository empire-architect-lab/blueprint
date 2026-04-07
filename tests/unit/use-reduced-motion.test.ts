/** @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import {
  useReducedMotion,
  getServerSnapshot,
} from "@/lib/hooks/use-reduced-motion";

type Listener = (e: { matches: boolean }) => void;

function installMatchMedia(initial: boolean) {
  const listeners = new Set<Listener>();
  const mql = {
    matches: initial,
    media: "(prefers-reduced-motion: reduce)",
    addEventListener: (_: string, cb: Listener) => listeners.add(cb),
    removeEventListener: (_: string, cb: Listener) => listeners.delete(cb),
    dispatchEvent: () => false,
  };
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn().mockReturnValue(mql),
  });
  return {
    set(matches: boolean) {
      mql.matches = matches;
      listeners.forEach((cb) => cb({ matches }));
    },
  };
}

describe("useReducedMotion", () => {
  afterEach(() => {
    // @ts-expect-error cleanup
    delete window.matchMedia;
  });

  it("returns the initial mql.matches value on the client", () => {
    installMatchMedia(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it("updates when the media query change event fires", () => {
    const ctrl = installMatchMedia(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
    act(() => ctrl.set(true));
    expect(result.current).toBe(true);
  });

  it("getServerSnapshot returns false for SSR", () => {
    expect(getServerSnapshot()).toBe(false);
  });
});
