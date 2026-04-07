import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/head-commit/route";
import { FALLBACK_COMMIT } from "@/content/fallback-commit";

describe("GET /api/head-commit", () => {
  const realFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = realFetch;
  });

  it("returns fallback shape when fetch throws", async () => {
    globalThis.fetch = vi.fn(() => {
      throw new Error("network down");
    }) as unknown as typeof fetch;

    const res = await GET();
    const body = await res.json();

    expect(body.source).toBe("fallback");
    expect(body.sha).toBe(FALLBACK_COMMIT.sha);
    expect(body.shortSha).toBe(FALLBACK_COMMIT.shortSha);
    expect(body.message).toBe(FALLBACK_COMMIT.message);
  });

  it("returns fallback when GitHub returns a non-2xx status", async () => {
    globalThis.fetch = vi.fn(
      async () => new Response("boom", { status: 500 }),
    ) as unknown as typeof fetch;

    const res = await GET();
    const body = await res.json();

    expect(body.source).toBe("fallback");
    expect(body.sha).toBe(FALLBACK_COMMIT.sha);
  });

  it("returns github source with truncation on a successful fetch", async () => {
    const longMessage =
      "feat(cursor): a very very very very very very very very very very very very long commit subject line that definitely exceeds seventy-two characters\n\nbody of the commit that should be ignored";
    const payload = {
      sha: "abcdef1234567890abcdef1234567890abcdef12",
      commit: { message: longMessage },
    };
    globalThis.fetch = vi.fn(
      async () =>
        new Response(JSON.stringify(payload), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
    ) as unknown as typeof fetch;

    const res = await GET();
    const body = await res.json();

    expect(body.source).toBe("github");
    expect(body.sha).toBe(payload.sha);
    expect(body.shortSha).toBe("abcdef1");
    // First line only, truncated to 72 code points plus ellipsis.
    expect(body.message.endsWith("…")).toBe(true);
    expect([...body.message.replace("…", "")]).toHaveLength(72);
    expect(body.message.includes("\n")).toBe(false);
  });
});
