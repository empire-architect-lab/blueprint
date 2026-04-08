import { describe, expect, it } from "vitest";
import { truncate } from "@/lib/text/truncate";

describe("truncate", () => {
  it("returns ASCII strings unchanged when under max", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("returns the original string at the exact boundary", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });

  it("truncates ASCII strings longer than max and appends ellipsis", () => {
    expect(truncate("hello world", 5)).toBe("hello…");
  });

  it("counts Unicode emoji as single code points (no mid-surrogate split)", () => {
    // 4 emoji, each is a surrogate pair in UTF-16.
    const input = "😀😃😄😁";
    // Under max → unchanged.
    expect(truncate(input, 4)).toBe(input);
    // Over max → cut on code points, not UTF-16 units.
    const result = truncate(input, 2);
    expect(result).toBe("😀😃…");
    expect([...result.replace("…", "")]).toHaveLength(2);
  });

  it("treats multiline input as a single string (caller splits first line)", () => {
    const input = "line one\nline two\nline three";
    // Make sure nothing crashes and total code-point length is respected.
    expect(truncate(input, 8)).toBe("line one…");
  });
});
