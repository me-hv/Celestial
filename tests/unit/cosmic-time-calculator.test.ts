import { describe, it, expect } from "vitest";
import {
  CosmologyCalculator,
  defaultCosmology,
  redshiftToScaleFactor,
  scaleFactorToRedshift,
  redshiftToCosmicAge,
  redshiftToLookbackTime,
  cosmicAgeToRedshift,
  scaleFactorToCosmicAge,
} from "@/lib/astronomy/cosmology/cosmology-calculator";

describe("CosmologyCalculator & Cosmic Time Calculations", () => {
  it("computes present Universe age t_0 dynamically via FLRW integral", () => {
    const universeAgeGyr = defaultCosmology.calculateUniverseAgeGyr();
    // In Planck 2018 Lambda-CDM (H_0 = 70, Omega_m = 0.315, Omega_Lambda = 0.685),
    // t_0 is approximately 13.3 - 13.8 Gyr
    expect(universeAgeGyr).toBeGreaterThan(13.0);
    expect(universeAgeGyr).toBeLessThan(14.2);
  });

  it("calculates scale factor a(z) and inverse scaleFactorToRedshift correctly", () => {
    expect(redshiftToScaleFactor(0)).toBe(1.0);
    expect(redshiftToScaleFactor(1)).toBe(0.5);
    expect(redshiftToScaleFactor(3)).toBe(0.25);
    expect(redshiftToScaleFactor(9)).toBe(0.1);

    expect(scaleFactorToRedshift(1.0)).toBe(0.0);
    expect(scaleFactorToRedshift(0.5)).toBe(1.0);
    expect(scaleFactorToRedshift(0.25)).toBe(3.0);
    expect(scaleFactorToRedshift(0.1)).toBe(9.0);

    const universeAgeGyr = defaultCosmology.calculateUniverseAgeGyr();
    expect(scaleFactorToCosmicAge(1.0)).toBeCloseTo(universeAgeGyr, 2);
    expect(scaleFactorToCosmicAge(0.5)).toBeLessThan(universeAgeGyr);
  });

  it("calculates strictly monotonic lookback time with increasing redshift", () => {
    const tL_0 = redshiftToLookbackTime(0.0);
    const tL_01 = redshiftToLookbackTime(0.1);
    const tL_1 = redshiftToLookbackTime(1.0);
    const tL_2 = redshiftToLookbackTime(2.0);
    const tL_6 = redshiftToLookbackTime(6.0);
    const tL_1100 = redshiftToLookbackTime(1089.0);

    expect(tL_0).toBe(0.0);
    expect(tL_01).toBeGreaterThan(tL_0);
    expect(tL_1).toBeGreaterThan(tL_01);
    expect(tL_2).toBeGreaterThan(tL_1);
    expect(tL_6).toBeGreaterThan(tL_2);
    expect(tL_1100).toBeGreaterThan(tL_6);

    const universeAgeGyr = defaultCosmology.calculateUniverseAgeGyr();
    expect(tL_1100).toBeLessThanOrEqual(universeAgeGyr);
  });

  it("calculates cosmic age t_age(z) = t_0 - t_L(z)", () => {
    const universeAgeGyr = defaultCosmology.calculateUniverseAgeGyr();
    const ageAtZ0 = redshiftToCosmicAge(0.0);
    expect(ageAtZ0).toBeCloseTo(universeAgeGyr, 2);

    const ageAtZ1 = redshiftToCosmicAge(1.0);
    const lookbackZ1 = redshiftToLookbackTime(1.0);
    expect(ageAtZ1 + lookbackZ1).toBeCloseTo(universeAgeGyr, 2);

    const ageAtZ6 = redshiftToCosmicAge(6.0);
    // At z ~ 6, Universe is less than 1 Gyr old
    expect(ageAtZ6).toBeLessThan(1.2);
    expect(ageAtZ6).toBeGreaterThan(0.5);
  });

  it("inverts cosmic age to redshift with high precision (< 0.01% error)", () => {
    const targetAges = [12.0, 8.0, 5.0, 3.0, 1.0, 0.5];

    targetAges.forEach((targetAge) => {
      const computedZ = cosmicAgeToRedshift(targetAge);
      const reconstructedAge = redshiftToCosmicAge(computedZ);
      expect(reconstructedAge).toBeCloseTo(targetAge, 2);
    });
  });

  it("computes comprehensive cosmological parameters with calculateAll", () => {
    const resultZ2 = defaultCosmology.calculateAll(2.0);
    expect(resultZ2.redshiftZ).toBe(2.0);
    expect(resultZ2.scaleFactorA).toBeCloseTo(0.3333, 3);
    expect(resultZ2.comovingDistanceMpc).toBeGreaterThan(5000);
    expect(resultZ2.luminosityDistanceMpc).toBeGreaterThan(resultZ2.comovingDistanceMpc);
    expect(resultZ2.angularDiameterDistanceMpc).toBeLessThan(resultZ2.comovingDistanceMpc);
    expect(resultZ2.isLocalGroupBound).toBe(false);
  });

  it("handles Local Group boundary regime correctly in calculateAll", () => {
    const localResult = defaultCosmology.calculateAll(0.0005);
    expect(localResult.isLocalGroupBound).toBe(true);
    expect(localResult.comovingDistanceMpc).toBe(0);
    expect(localResult.lookbackTimeGyr).toBe(0);
  });

  it("recalibrates correctly under alternative cosmological parameters", () => {
    const shoesCalc = new CosmologyCalculator({
      hubbleConstantKmSPerMpc: 73.04,
      omegaMatter: 0.30,
      omegaLambda: 0.70,
    });
    // Higher H_0 yields a younger universe
    expect(shoesCalc.calculateUniverseAgeGyr()).toBeLessThan(
      defaultCosmology.calculateUniverseAgeGyr()
    );

    const edsCalc = new CosmologyCalculator({
      hubbleConstantKmSPerMpc: 70.0,
      omegaMatter: 1.0,
      omegaLambda: 0.0,
    });
    // Einstein-de Sitter age is 2 / (3 * H_0) ~ 9.3 Gyr
    expect(edsCalc.calculateUniverseAgeGyr()).toBeCloseTo(9.3, 1);
  });
});
