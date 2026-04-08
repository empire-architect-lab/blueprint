import { describe, expect, it } from "vitest";
import {
  createParticleMaterial,
  tweenProgress,
} from "@/components/cursor/particles";

describe("particles shader material", () => {
  it("starts with uProgress = 0", () => {
    const mat = createParticleMaterial();
    expect(mat.uniforms.uProgress.value).toBe(0);
  });

  it("tweenProgress drives uProgress to the target value", async () => {
    const mat = createParticleMaterial();
    const tween = tweenProgress(mat, 1, 0.01);
    await tween;
    expect(mat.uniforms.uProgress.value).toBeCloseTo(1, 5);
  });

  it("tween back to 0 (reform)", async () => {
    const mat = createParticleMaterial();
    mat.uniforms.uProgress.value = 1;
    await tweenProgress(mat, 0, 0.01);
    expect(mat.uniforms.uProgress.value).toBeCloseTo(0, 5);
  });
});
