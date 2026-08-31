import { describe, it, expect } from "vitest";
import { computeAngularSeparation } from "@/lib/astronomy/coordinates/angular-separation";

describe("Celestial Angular Separation Mathematics", () => {
  it("calculates zero angular separation for identical coordinates", () => {
    const coord = { raDeg: 83.8221, decDeg: -5.3911 };
    const result = computeAngularSeparation(coord, coord);
    expect(result.degrees).toBe(0);
    expect(result.arcminutes).toBe(0);
    expect(result.arcseconds).toBe(0);
  });

  it("calculates 180 degrees separation for antipodal celestial points", () => {
    const northPole = { raDeg: 0, decDeg: 90 };
    const southPole = { raDeg: 0, decDeg: -90 };
    const result = computeAngularSeparation(northPole, southPole);
    expect(result.degrees).toBeCloseTo(180, 4);
  });

  it("calculates angular separation between known nearby stars/objects (e.g. M42 and Horsehead Nebula in Orion)", () => {
    // M42: RA = 83.8221, Dec = -5.3911
    // Horsehead (IC 434): RA = 85.2458, Dec = -2.4583
    const m42 = { raDeg: 83.8221, decDeg: -5.3911 };
    const horsehead = { raDeg: 85.2458, decDeg: -2.4583 };

    const result = computeAngularSeparation(m42, horsehead);
    // Separation between M42 and Horsehead is ~3.26 degrees (195.5 arcmin)
    expect(result.degrees).toBeCloseTo(3.26, 1);
    expect(result.arcminutes).toBeCloseTo(195.5, 0);
  });
});
