/** @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render, cleanup } from "@testing-library/react";
import { TerminalTyper } from "@/components/cursor/terminal-typer";

vi.mock("@/lib/hooks/use-reduced-motion", () => ({
  useReducedMotion: vi.fn(() => false),
}));

import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
const useReducedMotionMock = vi.mocked(useReducedMotion);

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  useReducedMotionMock.mockReturnValue(false);
});

describe("TerminalTyper", () => {
  it("types one character per interval and calls onComplete once", () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    const { container } = render(
      <TerminalTyper command="abc" charDelayMs={50} onComplete={onComplete} />,
    );

    const pre = () => container.querySelector("pre")!;
    // Initial state has only the caret, no typed chars yet.
    expect(pre().textContent).not.toContain("a");

    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(pre().textContent).toContain("a");

    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(pre().textContent).toContain("ab");

    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(pre().textContent).toContain("abc");
    expect(onComplete).toHaveBeenCalledTimes(1);

    // Subsequent ticks should not call onComplete again.
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("reduced-motion path renders full command immediately and calls onComplete", () => {
    useReducedMotionMock.mockReturnValue(true);
    const onComplete = vi.fn();
    const { container } = render(
      <TerminalTyper
        command="hello"
        charDelayMs={50}
        onComplete={onComplete}
      />,
    );
    expect(container.querySelector("pre")!.textContent).toContain("hello");
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("clears its interval on unmount and never calls onComplete after", () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    const { unmount } = render(
      <TerminalTyper
        command="hello"
        charDelayMs={50}
        onComplete={onComplete}
      />,
    );
    act(() => {
      vi.advanceTimersByTime(50); // 1 char in
    });
    unmount();
    act(() => {
      vi.advanceTimersByTime(10_000); // way past full duration
    });
    expect(onComplete).not.toHaveBeenCalled();
  });
});
