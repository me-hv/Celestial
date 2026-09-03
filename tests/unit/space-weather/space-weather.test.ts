import { describe, it, expect } from "vitest";
import { spaceWeatherRepo } from "@/lib/data/space-weather-repository";
import {
  calculateGeomagneticStormScale,
  calculateAuroralBoundaryLatitude,
  classifySolarActivityLevel,
  deriveObservationImplications,
} from "@/domain/space-weather/space-weather-intelligence";

describe("Space Weather Domain & Intelligence", () => {
  it("classifies solar activity level correctly from GOES X-ray flux", () => {
    expect(classifySolarActivityLevel(5e-9)).toBe("VERY_LOW");
    expect(classifySolarActivityLevel(5e-8)).toBe("LOW");
    expect(classifySolarActivityLevel(3e-7)).toBe("MODERATE");
    expect(classifySolarActivityLevel(2e-6)).toBe("HIGH");
    expect(classifySolarActivityLevel(5e-5)).toBe("VERY_HIGH");
    expect(classifySolarActivityLevel(2e-4)).toBe("EXTREME");
  });

  it("calculates geomagnetic storm scales and auroral equatorward boundaries accurately", () => {
    expect(calculateGeomagneticStormScale(2.3)).toBe("NONE");
    expect(calculateGeomagneticStormScale(5.0)).toBe("G1_MINOR");
    expect(calculateGeomagneticStormScale(6.7)).toBe("G2_MODERATE");
    expect(calculateGeomagneticStormScale(7.3)).toBe("G3_STRONG");
    expect(calculateGeomagneticStormScale(8.0)).toBe("G4_SEVERE");
    expect(calculateGeomagneticStormScale(9.0)).toBe("G5_EXTREME");

    // Empirical formula: 66 - 2.1 * Kp
    expect(calculateAuroralBoundaryLatitude(0)).toBe(66);
    expect(calculateAuroralBoundaryLatitude(5)).toBe(55.5);
    expect(calculateAuroralBoundaryLatitude(9)).toBe(47.1);
  });

  it("derives observation implications with explicit scientific rationale", () => {
    const impQuiet = deriveObservationImplications(2.0, 1e-7, 400, 1.0);
    expect(impQuiet.auroralVisibilityRecommendation).toContain("restricted to polar latitudes");
    expect(impQuiet.radioPropagationCondition).toContain("nominal");

    const impStorm = deriveObservationImplications(7.5, 3e-5, 750, -8.0);
    expect(impStorm.auroralVisibilityRecommendation).toContain("displays probable");
    expect(impStorm.radioPropagationCondition).toContain("radio blackout");
  });

  it("retrieves baseline space weather observation with strict provenance", () => {
    const sw = spaceWeatherRepo.getCurrent();
    expect(sw.provenance.authoritativeBody).toBe("NOAA");
    expect(sw.provenance.catalogName).toContain("NOAA");
    expect(sw.epistemicStatus).toBe("OBSERVED");
  });
});
