import { describe, it, expect } from "vitest";
import { HabitableZoneCalculator } from "@/lib/astronomy/habitable-zone";

describe("HabitableZoneCalculator (Kopparapu Model)", () => {
  it("calculates accurate Habitable Zone bounds for the Sun (G2V, 5778 K, 1.0 L_sun)", () => {
    const hz = HabitableZoneCalculator.calculate(5778, 1.0, 1.0);

    // Sun conservative HZ is approximately 0.95 AU to 1.68 AU
    expect(hz.conservativeInnerAu).toBeGreaterThanOrEqual(0.94);
    expect(hz.conservativeInnerAu).toBeLessThanOrEqual(1.0);

    expect(hz.conservativeOuterAu).toBeGreaterThanOrEqual(1.65);
    expect(hz.conservativeOuterAu).toBeLessThanOrEqual(1.75);

    // Optimistic boundaries enclose conservative boundaries
    expect(hz.optimisticInnerAu).toBeLessThan(hz.conservativeInnerAu);
    expect(hz.optimisticOuterAu).toBeGreaterThan(hz.conservativeOuterAu);

    // Earth at 1.0 AU is strictly within the conservative Habitable Zone
    expect(1.0).toBeGreaterThan(hz.conservativeInnerAu);
    expect(1.0).toBeLessThan(hz.conservativeOuterAu);
  });

  it("calculates compact Habitable Zone bounds for TRAPPIST-1 (M8V, 2566 K, 0.000553 L_sun)", () => {
    const hz = HabitableZoneCalculator.calculate(2566, 0.000553, 0.1192);

    // TRAPPIST-1 conservative HZ is in the range ~0.025 to ~0.05 AU
    expect(hz.conservativeInnerAu).toBeGreaterThanOrEqual(0.02);
    expect(hz.conservativeInnerAu).toBeLessThanOrEqual(0.035);

    expect(hz.conservativeOuterAu).toBeGreaterThanOrEqual(0.045);
    expect(hz.conservativeOuterAu).toBeLessThanOrEqual(0.06);

    // TRAPPIST-1 e (0.029 AU) and TRAPPIST-1 f (0.038 AU) reside within the Habitable Zone
    const trappist1e_semiMajorAxis = 0.02925;
    const trappist1f_semiMajorAxis = 0.03849;

    expect(trappist1e_semiMajorAxis).toBeGreaterThan(hz.conservativeInnerAu);
    expect(trappist1e_semiMajorAxis).toBeLessThan(hz.conservativeOuterAu);

    expect(trappist1f_semiMajorAxis).toBeGreaterThan(hz.conservativeInnerAu);
    expect(trappist1f_semiMajorAxis).toBeLessThan(hz.conservativeOuterAu);
  });
});
