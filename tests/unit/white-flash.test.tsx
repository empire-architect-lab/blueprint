import { describe, expect, it, vi, afterEach, beforeEach } from "vitest";
import { createRef } from "react";
import { render, cleanup } from "@testing-library/react";

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});
import {
  WhiteFlash,
  type WhiteFlashHandle,
  CINEMATIC_COMPLETE_EVENT,
} from "@/components/cursor/white-flash";

afterEach(() => cleanup());

describe("<WhiteFlash />", () => {
  it("dispatches blueprint:cinematic-complete exactly once on trigger", async () => {
    const handler = vi.fn();
    window.addEventListener(CINEMATIC_COMPLETE_EVENT, handler);

    const ref = createRef<WhiteFlashHandle>();
    render(<WhiteFlash ref={ref} />);

    ref.current?.trigger();
    ref.current?.trigger(); // second call must be a no-op (re-fire guard)

    // Wait for the GSAP timeline (60ms in + 60ms out = 120ms) to settle.
    await new Promise((r) => setTimeout(r, 250));

    expect(handler).toHaveBeenCalledTimes(1);
    window.removeEventListener(CINEMATIC_COMPLETE_EVENT, handler);
  });
});
