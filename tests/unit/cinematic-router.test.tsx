import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup, act } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import en from "../../messages/en.json";
import {
  CinematicRouter,
  CINEMATIC_SKIP_EVENT,
} from "@/components/cursor/cinematic-router";
import { CINEMATIC_COMPLETE_EVENT } from "@/components/cursor/white-flash";
import { CINEMATIC_REPLAY_EVENT } from "@/components/hero/replay-button";

let reducedMotionValue = false;
let mobileValue = false;

vi.mock("framer-motion", () => ({
  useReducedMotion: () => reducedMotionValue,
}));

vi.mock("@/lib/hooks/use-is-mobile", () => ({
  useIsMobile: () => mobileValue,
}));

vi.mock("next/dynamic", () => ({
  default: () => () => <div data-testid="cinematic-stub">cinematic</div>,
}));

vi.mock("@/components/hero/hero", () => ({
  Hero: () => <div data-testid="hero-stub">hero</div>,
}));

beforeEach(() => {
  reducedMotionValue = false;
  mobileValue = false;
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

afterEach(() => {
  cleanup();
});

const renderRouter = () =>
  render(
    <NextIntlClientProvider
      locale="en"
      messages={en as unknown as Record<string, unknown>}
    >
      <CinematicRouter />
    </NextIntlClientProvider>,
  );

describe("<CinematicRouter />", () => {
  it("reduced motion → renders Hero + notice", () => {
    reducedMotionValue = true;
    const { getByTestId, getByRole } = renderRouter();
    expect(getByTestId("hero-stub")).toBeTruthy();
    expect(getByRole("status").textContent).toBe(
      "Cinematic intro disabled per your motion preferences.",
    );
  });

  it("desktop motion → renders cinematic; skip event swaps to Hero", () => {
    const { getByTestId, queryByTestId } = renderRouter();
    expect(getByTestId("cinematic-stub")).toBeTruthy();
    act(() => {
      window.dispatchEvent(new CustomEvent(CINEMATIC_SKIP_EVENT));
    });
    expect(queryByTestId("cinematic-stub")).toBeNull();
    expect(getByTestId("hero-stub")).toBeTruthy();
  });

  it("complete event swaps to Hero", () => {
    const { getByTestId } = renderRouter();
    act(() => {
      window.dispatchEvent(new CustomEvent(CINEMATIC_COMPLETE_EVENT));
    });
    expect(getByTestId("hero-stub")).toBeTruthy();
  });

  it("replay event re-mounts the cinematic after a skip", () => {
    const { getByTestId, queryByTestId } = renderRouter();
    act(() => {
      window.dispatchEvent(new CustomEvent(CINEMATIC_SKIP_EVENT));
    });
    expect(queryByTestId("cinematic-stub")).toBeNull();
    act(() => {
      window.dispatchEvent(new CustomEvent(CINEMATIC_REPLAY_EVENT));
    });
    expect(getByTestId("cinematic-stub")).toBeTruthy();
  });
});
