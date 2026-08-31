import { describe, it, expect } from "vitest";
import {
  galacticToLocalGroup,
  equatorialToLocalGroup,
  calculateInterGalaxyVector,
  computeLocalGroupBarycenter,
  LocalGroupCoordinates,
} from "@/lib/astronomy/coordinates/local-group";
import { calculateCosmologicalDistance } from "@/lib/astronomy/cosmology/distance";

describe("Local Group Coordinate Transformations & Spatial Models", () => {
  it("should transform Galactic coordinates to Galactocentric Local Group Cartesian frame", () => {
    // Test Andromeda (M31): l = 121.1743°, b = -21.5733°, d_helio = 778 kpc
    const m31Coord = galacticToLocalGroup(121.1743, -21.5733, 778.0);

    // With Sun offset at R_0 = 8.18 kpc, Galactocentric distance from (0,0,0) is ~782 kpc
    expect(m31Coord.distanceKpc).toBeCloseTo(782.0, 0);
    expect(m31Coord.distanceMpc).toBeCloseTo(0.782, 2);
    expect(m31Coord.lookbackTimeYears).toBeCloseTo(2537000, -4);

    // Negative X in Galactocentric Cartesian
    expect(m31Coord.xKpc).toBeLessThan(0);
    // Positive Y (in direction of rotation l ~ 121°)
    expect(m31Coord.yKpc).toBeGreaterThan(0);
    // Negative Z (b = -21.57°)
    expect(m31Coord.zKpc).toBeLessThan(0);
  });

  it("should transform Equatorial coordinates (RA, Dec) to Local Group space", () => {
    // M31: RA = 10.6847°, Dec = 41.2687°, d_helio = 778 kpc
    const m31FromEquatorial = equatorialToLocalGroup(10.6847, 41.2687, 778.0);
    expect(m31FromEquatorial.distanceKpc).toBeCloseTo(782.0, 0);
    expect(m31FromEquatorial.distanceMpc).toBeCloseTo(0.782, 2);
  });

  it("should calculate exact 3D separation between Milky Way and Andromeda", () => {
    const mwCenter: LocalGroupCoordinates = {
      xKpc: 0,
      yKpc: 0,
      zKpc: 0,
      distanceKpc: 0,
      distanceMpc: 0,
      distanceLy: 0,
      lookbackTimeYears: 0,
    };
    const m31Pos = galacticToLocalGroup(121.1743, -21.5733, 778.0);

    const vector = calculateInterGalaxyVector(mwCenter, m31Pos, 110.0);
    expect(vector.separationKpc).toBeCloseTo(782.0, 0);
    expect(vector.separationMpc).toBeCloseTo(0.782, 2);
    expect(vector.relativeRadialVelocityKmS).toBe(110.0);
    expect(vector.approachTimeYears).toBeDefined();
    // Time to collision at ~110 km/s over ~782 kpc is ~6-7 Gyr in simple straight-line kinematics
    expect(vector.approachTimeYears!).toBeGreaterThan(4e9);
  });

  it("should calculate Local Group barycenter between MW and M31", () => {
    const barycenter = computeLocalGroupBarycenter();
    expect(barycenter.distanceFromMilkyWayKpc).toBeGreaterThan(300);
    expect(barycenter.distanceFromMilkyWayKpc).toBeLessThan(500);
  });

  it("should distinguish Local Group bound systems from cosmic Hubble expansion in cosmological distance calculator", () => {
    // Andromeda blueshift (z = -0.001001)
    const localRes = calculateCosmologicalDistance(-0.001001);
    expect(localRes.isLocalGroupBound).toBe(true);
    expect(localRes.cosmologicalDistanceMpc).toBe(0.0);
    expect(localRes.limitations).toContain("Local Group gravitationally bound object");

    // Distant galaxy (z = 0.05)
    const distantRes = calculateCosmologicalDistance(0.05);
    expect(distantRes.isLocalGroupBound).toBe(false);
    expect(distantRes.cosmologicalDistanceMpc).toBeGreaterThan(150);
    expect(distantRes.lookbackTimeYears).toBeGreaterThan(5e8);
  });
});
