import { describe, expect, it, afterEach, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";

vi.mock("next-intl/server", () => ({
  getTranslations: async () => {
    const t = (key: string) => key;
    t.raw = (_key: string) => [] as unknown[];
    return t;
  },
}));

afterEach(() => cleanup());

describe("LocaleHomePage", () => {
  it("renders <main> as the cinematic landing composition", async () => {
    const { default: LocaleHomePage } = await import("@/app/[locale]/page");
    const element = await LocaleHomePage({
      params: Promise.resolve({ locale: "en" }),
    });
    const { container } = render(element);
    const main = container.querySelector("main");
    expect(main).not.toBeNull();
    expect(main?.className).toContain("bg-black");
  });

  it("exports the expected metadata", async () => {
    const mod = await import("@/app/[locale]/page");
    expect(mod.metadata.title).toBe("Blueprint Lab");
    expect(typeof mod.metadata.description).toBe("string");
  });
});
