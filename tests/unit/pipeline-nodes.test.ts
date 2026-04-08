import { describe, expect, it } from "vitest";
import { PIPELINE_NODES } from "@/lib/constants/pipeline-nodes";

describe("PIPELINE_NODES", () => {
  it("has exactly 8 entries", () => {
    expect(PIPELINE_NODES).toHaveLength(8);
  });

  it("contains the verbatim labels in order", () => {
    expect(PIPELINE_NODES).toEqual([
      "SPECIFY",
      "PLAN",
      "TASKS",
      "IMPLEMENT",
      "PR",
      "CI",
      "PREVIEW",
      "DEPLOY",
    ]);
  });
});
