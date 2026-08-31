import { describe, it, expect } from "vitest";
import {
  defaultCosmology,
  calculateParticleHorizonGly,
  calculateHubbleRadiusGly,
  comovingDistanceToRedshift,
} from "@/lib/astronomy/cosmology/cosmology-calculator";

describe("Observable Universe Cosmology & Horizon Calculations", () => {
  it("computes Particle Horizon comoving radius in the ~46.0 - 47.0 Gly range", () => {
    const horizonGly = defaultCosmology.calculateParticleHorizonGly();
    expect(horizonGly).toBeGreaterThan(45.0);
    expect(horizonGly).toBeLessThan(48.0);

    const horizonMpc = defaultCosmology.calculateParticleHorizonComovingMpc();
    expect(horizonMpc).toBeGreaterThan(13800);
    expect(horizonMpc).toBeLessThan(14600);
  });

  it("computes Hubble Radius R_H = c/H_0 in the ~13.8 - 14.2 Gly range (~4283 Mpc)", () => {
    const hubbleRadiusMpc = defaultCosmology.calculateHubbleRadiusMpc();
    expect(hubbleRadiusMpc).toBeCloseTo(4282.75, 0);

    const hubbleRadiusGly = defaultCosmology.calculateHubbleRadiusGly();
    expect(hubbleRadiusGly).toBeGreaterThan(13.8);
    expect(hubbleRadiusGly).toBeLessThan(14.2);
  });

  it("computes Cosmological Event Horizon in the ~16.5 - 17.5 Gly range (~5200 Mpc)", () => {
    const eventHorizonMpc = defaultCosmology.calculateEventHorizonComovingMpc();
    expect(eventHorizonMpc).toBeGreaterThan(4800);
    expect(eventHorizonMpc).toBeLessThan(5600);
  });

  it("computes CMB last-scattering comoving distance at z = 1089 (~43.0 - 46.5 Gly)", () => {
    const cmbDistanceMpc = defaultCosmology.calculateCMBComovingDistanceMpc();
    const cmbDistanceGly = cmbDistanceMpc * 0.003261563777;

    expect(cmbDistanceMpc).toBeGreaterThan(13000);
    expect(cmbDistanceMpc).toBeLessThan(14500);
    expect(cmbDistanceGly).toBeGreaterThan(42.0);
    expect(cmbDistanceGly).toBeLessThan(47.0);
  });

  it("inverts comoving distance to redshift accurately via comovingDistanceToRedshift", () => {
    const testRedshifts = [0.1, 0.5, 1.0, 2.0, 5.0, 10.0];

    for (const expectedZ of testRedshifts) {
      const distMpc = defaultCosmology.calculateComovingDistanceMpc(expectedZ);
      const solvedZ = defaultCosmology.comovingDistanceToRedshift(distMpc);
      expect(solvedZ).toBeCloseTo(expectedZ, 1);
    }
  });

  it("demonstrates Angular Diameter Distance (D_A) turnover at z ≈ 1.6", () => {
    const daAt1 = defaultCosmology.calculateAngularDiameterDistanceMpc(1.0);
    const daAt1_6 = defaultCosmology.calculateAngularDiameterDistanceMpc(1.6);
    const daAt5 = defaultCosmology.calculateAngularDiameterDistanceMpc(5.0);
    const daAt10 = defaultCosmology.calculateAngularDiameterDistanceMpc(10.0);

    // Peak occurs near z ≈ 1.6
    expect(daAt1_6).toBeGreaterThan(daAt1);
    expect(daAt1_6).toBeGreaterThan(daAt5);
    expect(daAt5).toBeGreaterThan(daAt10);
  });

  it("calculates CMB photon bath temperature scaling T(z) = T_0 * (1 + z)", () => {
    const t0 = 2.7255;
    expect(defaultCosmology.calculateCMBTemperatureK(0)).toBeCloseTo(t0, 4);

    const tAtZ1 = defaultCosmology.calculateCMBTemperatureK(1.0);
    expect(tAtZ1).toBeCloseTo(t0 * 2.0, 3);

    const tAtCMB = defaultCosmology.calculateCMBTemperatureK(1089.0);
    expect(tAtCMB).toBeCloseTo(t0 * 1090.0, 1);
    expect(tAtCMB).toBeGreaterThan(2960);
    expect(tAtCMB).toBeLessThan(2980);
  });

  it("exposes standalone pure calculation helpers", () => {
    expect(calculateParticleHorizonGly()).toBeGreaterThan(45.0);
    expect(calculateHubbleRadiusGly()).toBeGreaterThan(13.8);
    expect(comovingDistanceToRedshift(0)).toBe(0);
  });
});
