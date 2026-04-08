import { describe, expect, it, vi, afterEach } from "vitest";
import { track } from "@/lib/analytics/plausible";

afterEach(() => {
  delete (window as { plausible?: unknown }).plausible;
});

describe("plausible track helper", () => {
  it("no-ops when window.plausible is undefined", () => {
    expect(() => track("cinematic_completed")).not.toThrow();
  });

  it("calls window.plausible with the event name when defined", () => {
    const spy = vi.fn();
    (window as { plausible?: (e: string) => void }).plausible = spy;
    track("cinematic_skipped");
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("cinematic_skipped");
  });
});
