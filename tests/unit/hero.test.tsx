import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import en from "../../messages/en.json";
import { Hero } from "@/components/hero/hero";

vi.mock("@/content/build-metadata", () => ({
  BUILD_METADATA: {
    sha: "abcdef1234567890abcdef1234567890abcdef12",
    shortSha: "abcdef1",
    specCount: 7,
    taskCount: 42,
    lieCount: 0,
  },
}));

vi.mock("@/content/fallback-commit", () => ({
  FALLBACK_COMMIT: {
    sha: "0000000000000000000000000000000000000000",
    shortSha: "0000000",
    message: "fallback",
  },
}));

beforeEach(() => {
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

describe("<Hero />", () => {
  it("renders headline, metadata, and data-spec-id", async () => {
    const { container, getByRole, findByText } = render(
      <NextIntlClientProvider
        locale="en"
        messages={en as unknown as Record<string, unknown>}
      >
        <Hero />
      </NextIntlClientProvider>,
    );

    const root = container.querySelector('[data-spec-id="001-the-cursor"]');
    expect(root).not.toBeNull();

    const h1 = getByRole("heading", { level: 1 });
    expect(h1.textContent).toBe("Built by the process it teaches.");
    expect(h1.className).toContain("font-display");
    expect(h1.className).toContain("text-[220px]");

    await waitFor(async () => {
      await findByText("commit abcdef1 · 7 specs · 42 tasks · 0 lies");
    });
  });
});
