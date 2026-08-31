import { describe, it, expect } from "vitest";
import {
  galacticToGalactocentric,
  equatorialToGalactocentric,
  galactocentricToGalactic,
  getSunGalactocentricPosition,
  GALACTOCENTRIC_CONSTANTS,
} from "@/lib/astronomy/coordinates/galactocentric";

describe("Galactocentric Coordinate Transformations", () => {
  it("calculates canonical Solar position at (-R_0, 0, +z_0)", () => {
    const sunPos = getSunGalactocentricPosition();
    expect(sunPos.xPc).toBeCloseTo(-8178.0, 1);
    expect(sunPos.yPc).toBeCloseTo(0.0, 1);
    expect(sunPos.zPc).toBeCloseTo(20.8, 1);
    expect(sunPos.rGalactocentricPc).toBeCloseTo(8178.026, 1);
    expect(sunPos.inPlaneRadiusPc).toBeCloseTo(8178.0, 1);
  });

  it("transforms Galactic Center (l = 0°, b = 0°, d = R_0) to Galactocentric origin (0, 0, z_0)", () => {
    const gc = galacticToGalactocentric(0.0, 0.0, GALACTOCENTRIC_CONSTANTS.SUN_DISTANCE_TO_GC_PC);
    expect(gc.xPc).toBeCloseTo(0.0, 1);
    expect(gc.yPc).toBeCloseTo(0.0, 1);
    expect(gc.zPc).toBeCloseTo(GALACTOCENTRIC_CONSTANTS.SUN_HEIGHT_ABOVE_MIDPLANE_PC, 1);
  });

  it("transforms an object in the direction of Galactic rotation (l = 90°, b = 0°)", () => {
    const dPc = 1000.0;
    const rotObj = galacticToGalactocentric(90.0, 0.0, dPc);
    expect(rotObj.xPc).toBeCloseTo(-8178.0, 1);
    expect(rotObj.yPc).toBeCloseTo(1000.0, 1);
  });

  it("transforms equatorial coordinates directly to Galactocentric space", () => {
    // Sgr A* coordinates: RA = 266.4168°, Dec = -29.0078°, d = 8,178 pc
    // Lies at l = 359.944°, b = -0.046° (offset from 1958 IAU origin by ~8 pc in Y)
    const sgrA = equatorialToGalactocentric(266.4168, -29.0078, 8178.0);
    expect(sgrA.xPc).toBeCloseTo(0.0, 0);
    expect(Math.abs(sgrA.yPc)).toBeLessThan(10.0);
  });

  it("guarantees round-trip mathematical consistency (Galactic -> Galactocentric -> Galactic)", () => {
    const testPoints = [
      { l: 45.0, b: 15.0, d: 2500.0 },
      { l: 120.0, b: -10.0, d: 5000.0 },
      { l: 270.0, b: 30.0, d: 1500.0 },
      { l: 330.0, b: -5.0, d: 8000.0 },
    ];

    for (const pt of testPoints) {
      const gc = galacticToGalactocentric(pt.l, pt.b, pt.d);
      const back = galactocentricToGalactic(gc.xPc, gc.yPc, gc.zPc);
      expect(back.lDeg).toBeCloseTo(pt.l, 2);
      expect(back.bDeg).toBeCloseTo(pt.b, 2);
      expect(back.distancePc).toBeCloseTo(pt.d, 1);
    }
  });
});
