import { describe, it, expect } from "vitest";
import {
  calculatePlanetaryEphemeris,
  calculatePlanetaryApparentMagnitude,
} from "@/lib/astronomy/ephemeris/planetary-ephemeris";

describe("Planetary Ephemeris Engine", () => {
  it("calculates geocentric ephemeris for the Sun", () => {
    const sunEphem = calculatePlanetaryEphemeris("sun");
    expect(sunEphem.bodySlug).toBe("sun");
    expect(sunEphem.apparentMagnitudeV).toBeCloseTo(-26.74, 1);
    expect(sunEphem.distanceAu).toBeGreaterThan(0.98);
    expect(sunEphem.distanceAu).toBeLessThan(1.02);
    expect(sunEphem.angularDiameterArcsec).toBeGreaterThan(1800); // ~31-32 arcmin
    expect(sunEphem.illuminationPercentage).toBe(100);
  });

  it("calculates geocentric ephemeris for Jupiter", () => {
    const jupiterEphem = calculatePlanetaryEphemeris("jupiter");
    expect(jupiterEphem.bodyName).toBe("Jupiter");
    expect(jupiterEphem.distanceAu).toBeGreaterThan(3.9);
    expect(jupiterEphem.distanceAu).toBeLessThan(6.5);
    expect(jupiterEphem.apparentMagnitudeV).toBeLessThan(0); // Bright negative magnitude
    expect(jupiterEphem.angularDiameterArcsec).toBeGreaterThan(25);
    expect(jupiterEphem.illuminationPercentage).toBeGreaterThan(95); // Superior planet
  });

  it("calculates geocentric ephemeris for Venus", () => {
    const venusEphem = calculatePlanetaryEphemeris("venus");
    expect(venusEphem.bodyName).toBe("Venus");
    expect(venusEphem.distanceAu).toBeGreaterThan(0.25);
    expect(venusEphem.distanceAu).toBeLessThan(1.75);
    expect(venusEphem.apparentMagnitudeV).toBeLessThan(-3.5); // Very bright
    expect(venusEphem.elongationFromSunDeg).toBeLessThanOrEqual(48.0); // Greatest elongation constraint
  });

  it("calculates apparent visual magnitude within physical bounds", () => {
    // Mars at 1 AU heliocentric and 0.5 AU geocentric
    const magMars = calculatePlanetaryApparentMagnitude("mars", 1.5, 0.5, 10.0);
    expect(magMars).toBeGreaterThan(-3.0);
    expect(magMars).toBeLessThan(2.0);
  });
});
