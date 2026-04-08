import { describe, expect, it, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";

vi.mock("@/components/cursor/cinematic-router", () => ({
  CinematicRouter: () => <div data-testid="router-stub">router</div>,
}));

afterEach(() => cleanup());

describe("HomePage", () => {
  it("renders <main> with the cinematic router mounted", async () => {
    const { default: HomePage } = await import("@/app/page");
    const { container, getByTestId } = render(<HomePage />);
    const main = container.querySelector("main");
    expect(main).not.toBeNull();
    expect(main?.className).toContain("min-h-screen");
    expect(main?.className).toContain("bg-black");
    expect(main?.className).toContain("text-white");
    expect(getByTestId("router-stub")).toBeTruthy();
  });

  it("exports the expected metadata", async () => {
    const mod = await import("@/app/page");
    expect(mod.metadata.title).toBe("Blueprint Lab");
    expect(typeof mod.metadata.description).toBe("string");
  });
});
