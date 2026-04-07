/** @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import axe from "axe-core";
import { SkipLink } from "@/components/cursor/skip-link";

const messages = {
  cursor: {
    skipLabel: "Skip cinematic intro",
    replayLabel: "Replay cinematic intro",
    typedCommand: "$ git log --oneline | head -1",
    reducedMotionSubtitle:
      "Cinematic intro disabled per your motion preferences.",
  },
  hero: {
    headline: "Built by the process it teaches.",
    metadata: "commit {sha} · {specs} specs · {tasks} tasks · {lies} lies",
  },
};

afterEach(() => cleanup());

describe("SkipLink", () => {
  it("has zero axe violations", async () => {
    const { container } = render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SkipLink />
      </NextIntlClientProvider>,
    );
    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });

  it("dispatches blueprint:cinematic-skip on click", () => {
    const listener = vi.fn();
    window.addEventListener("blueprint:cinematic-skip", listener);
    const { getByRole } = render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SkipLink />
      </NextIntlClientProvider>,
    );
    fireEvent.click(getByRole("button", { name: "Skip cinematic intro" }));
    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener("blueprint:cinematic-skip", listener);
  });

  it("renders a focus ring class", () => {
    const { getByRole } = render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <SkipLink />
      </NextIntlClientProvider>,
    );
    const btn = getByRole("button", { name: "Skip cinematic intro" });
    expect(btn.className).toContain("focus-visible:ring-2");
  });
});
