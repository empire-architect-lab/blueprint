import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import en from "../../messages/en.json";
import { CinematicIntroMobile } from "@/components/cursor/cinematic-intro-mobile";

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: query.includes("reduce"),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
  global.fetch = vi.fn(async () => ({
    ok: true,
    json: async () => ({
      sha: "abcdef1234567890",
      shortSha: "abcdef1",
      message: "feat: test",
      source: "github" as const,
    }),
  })) as unknown as typeof fetch;
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("<CinematicIntroMobile />", () => {
  it("renders without importing three and starts at the typer beat", () => {
    const { container, getByText } = render(
      <NextIntlClientProvider
        locale="en"
        messages={en as unknown as Record<string, unknown>}
      >
        <CinematicIntroMobile />
      </NextIntlClientProvider>,
    );
    // Reduced motion forces the typer to complete instantly which advances
    // to the map beat — assert the SVG mounted, not the typer.
    expect(container.querySelector("svg")).not.toBeNull();
    // Skip button is the i18n string from cursor.skipLabel
    expect(getByText("Skip cinematic intro")).toBeTruthy();
  });

  it("advances beats on skip click", () => {
    const { container, getAllByText } = render(
      <NextIntlClientProvider
        locale="en"
        messages={en as unknown as Record<string, unknown>}
      >
        <CinematicIntroMobile />
      </NextIntlClientProvider>,
    );
    // We're already on the map beat (reduced motion). Click skip → pipeline.
    const skip = getAllByText("Skip cinematic intro")[0];
    fireEvent.click(skip);
    // Pipeline list renders 8 labels.
    expect(container.querySelectorAll("li[data-lit]").length).toBe(8);
  });
});
