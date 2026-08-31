import { describe, it, expect } from "vitest";
import {
  equatorialToGalactic,
  galacticToEquatorial,
} from "@/lib/astronomy/coordinates/equatorial-to-galactic";

describe("Equatorial <-> Galactic Coordinate Transformations (IAU Standard)", () => {
  it("accurately transforms the North Galactic Pole (b = +90 deg)", () => {
    // NGP is defined at RA = 192.85948 deg, Dec = +27.12825 deg
    const gal = equatorialToGalactic(192.85948, 27.12825);
    expect(gal.bDeg).toBeCloseTo(90.0, 3);
  });

  it("accurately transforms the Galactic Center region (l ≈ 0 deg, b ≈ 0 deg)", () => {
    // Sgr A* region in equatorial: RA ≈ 266.417 deg (17h 45m 40s), Dec ≈ -29.008 deg (-29° 00' 28'')
    const gal = equatorialToGalactic(266.4168, -29.0078);
    expect(gal.lDeg).toBeCloseTo(359.94, 0); // Near 0/360 deg
    expect(gal.bDeg).toBeCloseTo(-0.05, 1); // Close to Galactic Plane (b ≈ 0)
  });

  it("accurately transforms Andromeda Galaxy (M31) coordinates", () => {
    // M31: RA = 10.6847 deg, Dec = +41.2687 deg -> Galactic l ≈ 121.17 deg, b ≈ -21.57 deg
    const gal = equatorialToGalactic(10.6847, 41.2687);
    expect(gal.lDeg).toBeCloseTo(121.17, 1);
    expect(gal.bDeg).toBeCloseTo(-21.57, 1);
  });

  it("accurately transforms Orion Nebula (M42) coordinates", () => {
    // M42: RA = 83.8221 deg, Dec = -5.3911 deg -> Galactic l ≈ 209.01 deg, b ≈ -19.38 deg
    const gal = equatorialToGalactic(83.8221, -5.3911);
    expect(gal.lDeg).toBeCloseTo(209.01, 1);
    expect(gal.bDeg).toBeCloseTo(-19.38, 1);
  });

  it("guarantees round-trip mathematical consistency (Equatorial -> Galactic -> Equatorial)", () => {
    const testPoints = [
      { ra: 45.0, dec: 30.0 },
      { ra: 180.0, dec: -45.0 },
      { ra: 270.0, dec: 60.0 },
      { ra: 330.0, dec: -10.0 },
    ];

    for (const pt of testPoints) {
      const gal = equatorialToGalactic(pt.ra, pt.dec);
      const eq = galacticToEquatorial(gal.lDeg, gal.bDeg);
      expect(eq.raDeg).toBeCloseTo(pt.ra, 2);
      expect(eq.decDeg).toBeCloseTo(pt.dec, 2);
    }
  });
});
