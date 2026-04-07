import { describe, expect, it } from "vitest";
import { latLngToXYZ } from "@/lib/three/geo";

describe("latLngToXYZ", () => {
  it("north pole maps to (0, r, 0)", () => {
    const [x, y, z] = latLngToXYZ(90, 0, 2);
    expect(x).toBeCloseTo(0, 5);
    expect(y).toBeCloseTo(2, 5);
    expect(z).toBeCloseTo(0, 5);
  });

  it("equator + prime meridian maps to (r, 0, 0) per the inbox formula", () => {
    // NOTE: inbox prose said "(-r, 0, 0)" but the formula it cites
    // (theta = (lng+180)*π/180) puts theta at π for prime meridian, so
    // cos(theta) = -1 and x = -r * 1 * -1 = +r. The formula is canonical;
    // see the reply for the discrepancy callout.
    const [x, y, z] = latLngToXYZ(0, 0, 2);
    expect(x).toBeCloseTo(2, 5);
    expect(y).toBeCloseTo(0, 5);
    expect(z).toBeCloseTo(0, 5);
  });

  it("Casablanca (33.5731, -7.5898, 2.02) regression triple", () => {
    const [x, y, z] = latLngToXYZ(33.5731, -7.5898, 2.02);
    // Locked-in triple computed once from the formula above; protects
    // against any future drift in the projection.
    expect(x).toBeCloseTo(1.66828, 4);
    expect(y).toBeCloseTo(1.11706, 4);
    expect(z).toBeCloseTo(0.22229, 4);
  });
});
