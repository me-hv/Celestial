import { describe, it, expect } from "vitest";
import {
  equatorialToCartesian,
  cartesianToEquatorial,
  parallaxToDistance,
  computeSpatialDistance,
  parsecsToLightYears,
  lightYearsToParsecs,
} from "@/lib/astronomy/coordinates/astrometric-coordinates";

describe("Astrometric Coordinate Transformations", () => {
  it("converts parallax to physical distance with error propagation", () => {
    // Proxima Centauri: parallax ~ 768.07 mas, error ~ 0.05 mas
    const result = parallaxToDistance(768.0665, 0.0499);

    // d ≈ 1000 / 768.0665 ≈ 1.30198 pc ≈ 4.2464 ly
    expect(result.distancePc).toBeCloseTo(1.302, 3);
    expect(result.distanceLy).toBeCloseTo(4.246, 2);
    expect(result.distanceErrorPc).toBeDefined();
    expect(result.distanceErrorPc!).toBeLessThan(0.001);
  });

  it("throws error for non-positive parallax values", () => {
    expect(() => parallaxToDistance(0)).toThrow();
    expect(() => parallaxToDistance(-10)).toThrow();
  });

  it("transforms Equatorial coordinates (RA, Dec, Distance) to ICRS Cartesian (X, Y, Z)", () => {
    // Star along Vernal Equinox (RA = 0, Dec = 0, d = 10 pc) -> X = 10, Y = 0, Z = 0
    const pointEquinox = equatorialToCartesian(0, 0, 10);
    expect(pointEquinox.x).toBeCloseTo(10, 3);
    expect(pointEquinox.y).toBeCloseTo(0, 3);
    expect(pointEquinox.z).toBeCloseTo(0, 3);

    // Star at North Celestial Pole (Dec = 90, d = 10 pc) -> X = 0, Y = 0, Z = 10
    const pointPole = equatorialToCartesian(0, 90, 10);
    expect(pointPole.x).toBeCloseTo(0, 3);
    expect(pointPole.y).toBeCloseTo(0, 3);
    expect(pointPole.z).toBeCloseTo(10, 3);

    // Star at RA = 90 deg, Dec = 0, d = 10 pc -> X = 0, Y = 10, Z = 0
    const point90 = equatorialToCartesian(90, 0, 10);
    expect(point90.x).toBeCloseTo(0, 3);
    expect(point90.y).toBeCloseTo(10, 3);
    expect(point90.z).toBeCloseTo(0, 3);
  });

  it("correctly converts Cartesian back to Equatorial coordinates", () => {
    const original = { raDeg: 120.5, decDeg: -35.25, distancePc: 15.75 };
    const cartesian = equatorialToCartesian(
      original.raDeg,
      original.decDeg,
      original.distancePc
    );
    const converted = cartesianToEquatorial(cartesian.x, cartesian.y, cartesian.z);

    expect(converted.raDeg).toBeCloseTo(original.raDeg, 2);
    expect(converted.decDeg).toBeCloseTo(original.decDeg, 2);
    expect(converted.distancePc).toBeCloseTo(original.distancePc, 2);
  });

  it("calculates 3D Euclidean spatial distance between stars", () => {
    const starA = { x: 0, y: 0, z: 0 }; // Sun
    const starB = { x: 3, y: 4, z: 0 }; // 5 pc away (3-4-5 triangle)

    const dist = computeSpatialDistance(starA, starB);
    expect(dist.distancePc).toBe(5);
    expect(dist.distanceLy).toBeCloseTo(5 * 3.26156, 3);
  });

  it("accurately converts parsecs to light-years and vice-versa", () => {
    expect(parsecsToLightYears(1.0)).toBeCloseTo(3.26156, 4);
    expect(lightYearsToParsecs(3.26156)).toBeCloseTo(1.0, 4);
  });
});
