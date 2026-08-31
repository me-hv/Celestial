import { describe, it, expect } from "vitest";
import { calculateLunarEphemeris } from "@/lib/astronomy/ephemeris/lunar-ephemeris";

describe("Lunar Ephemeris Engine", () => {
  it("calculates lunar geocentric position within physically verified bounds", () => {
    const lunar = calculateLunarEphemeris(new Date());

    // Distance must lie within lunar perigee and apogee bounds (~356,000 to 406,700 km)
    expect(lunar.distanceKm).toBeGreaterThan(350000);
    expect(lunar.distanceKm).toBeLessThan(410000);
    expect(lunar.distanceEarthRadii).toBeGreaterThan(55);
    expect(lunar.distanceEarthRadii).toBeLessThan(65);

    // Angular diameter must lie within 29 to 34 arcminutes
    expect(lunar.angularDiameterArcmin).toBeGreaterThan(29.0);
    expect(lunar.angularDiameterArcmin).toBeLessThan(34.5);

    // Illumination must lie between 0 and 100%
    expect(lunar.illuminationPercentage).toBeGreaterThanOrEqual(0);
    expect(lunar.illuminationPercentage).toBeLessThanOrEqual(100);

    // RA and Dec bounds
    expect(lunar.raDeg).toBeGreaterThanOrEqual(0);
    expect(lunar.raDeg).toBeLessThan(360);
    expect(lunar.decDeg).toBeGreaterThanOrEqual(-30);
    expect(lunar.decDeg).toBeLessThanOrEqual(30);
  });

  it("identifies next upcoming major lunar phase", () => {
    const lunar = calculateLunarEphemeris(new Date());
    expect(lunar.nextMajorPhase.name).toBeDefined();
    expect(lunar.nextMajorPhase.daysUntil).toBeGreaterThanOrEqual(0);
    expect(lunar.nextMajorPhase.daysUntil).toBeLessThanOrEqual(30);
  });
});
