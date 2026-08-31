import { describe, it, expect } from "vitest";
import {
  createLightTravelObservation,
  createCosmologicalLookbackObservation,
  deriveObservationTimeForObject,
} from "@/domain/cosmic-time/observation";

describe("ObservationTimeModel & Scientific Separation", () => {
  it("creates LIGHT_TRAVEL_TIME observation for nearby stellar objects", () => {
    const proximaObs = createLightTravelObservation(4.24);
    expect(proximaObs.timeType).toBe("LIGHT_TRAVEL_TIME");
    expect(proximaObs.isCosmological).toBe(false);
    expect(proximaObs.lookbackYears).toBe(4.24);
    expect(proximaObs.scientificExplanation).toContain("4.2 years ago");
  });

  it("creates COSMOLOGICAL_LOOKBACK_TIME observation for high-redshift targets", () => {
    const distantObs = createCosmologicalLookbackObservation(2.0);
    expect(distantObs.timeType).toBe("COSMOLOGICAL_LOOKBACK_TIME");
    expect(distantObs.isCosmological).toBe(true);
    expect(distantObs.redshiftZ).toBe(2.0);
    expect(distantObs.scaleFactorA).toBeCloseTo(0.3333, 2);
    expect(distantObs.lookbackGyr).toBeGreaterThan(9.0);
    expect(distantObs.cosmicAgeGyr).toBeLessThan(5.0);
    expect(distantObs.scientificExplanation).toContain("Cosmological redshift z = 2.0000");
  });

  it("safely distinguishes nearby stars from extragalactic objects in deriveObservationTimeForObject", () => {
    // Star Sirius (8.6 ly)
    const sirius = deriveObservationTimeForObject({
      distanceLy: 8.6,
      isExtragalactic: false,
    });
    expect(sirius.timeType).toBe("LIGHT_TRAVEL_TIME");
    expect(sirius.isCosmological).toBe(false);

    // Distant Galaxy (z = 6.0, d ~ 28 Gly)
    const distantGalaxy = deriveObservationTimeForObject({
      distanceLy: 2.8e10,
      redshiftZ: 6.0,
      isExtragalactic: true,
    });
    expect(distantGalaxy.timeType).toBe("COSMOLOGICAL_LOOKBACK_TIME");
    expect(distantGalaxy.isCosmological).toBe(true);
  });
});
