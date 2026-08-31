import { describe, it, expect } from "vitest";
import {
  galacticCartesianToSupergalacticCartesian,
  supergalacticCartesianToGalacticCartesian,
  supergalacticCartesianToSpherical,
  galacticToCosmicCoordinates,
  equatorialToCosmicCoordinates,
  calculateInterStructureSeparation,
  computeCosmicBarycenter,
} from "@/lib/astronomy/coordinates/cosmic-coordinates";

describe("Cosmic Coordinates Engine", () => {
  it("converts Galactic Cartesian to Supergalactic Cartesian with exact reversibility", () => {
    const xG = 12.5;
    const yG = -8.3;
    const zG = 4.2;

    const sg = galacticCartesianToSupergalacticCartesian(xG, yG, zG);
    const revG = supergalacticCartesianToGalacticCartesian(sg.sgxMpc, sg.sgyMpc, sg.sgzMpc);

    expect(revG.xMpc).toBeCloseTo(xG, 4);
    expect(revG.yMpc).toBeCloseTo(yG, 4);
    expect(revG.zMpc).toBeCloseTo(zG, 4);
  });

  it("converts Supergalactic Cartesian to Spherical coordinates correctly", () => {
    const sgx = 10.0;
    const sgy = 10.0;
    const sgz = 0.0;

    const sph = supergalacticCartesianToSpherical(sgx, sgy, sgz);
    expect(sph.sglDeg).toBeCloseTo(45.0, 4);
    expect(sph.sgbDeg).toBeCloseTo(0.0, 4);
    expect(sph.distanceMpc).toBeCloseTo(Math.sqrt(200), 4);
  });

  it("transforms Galactic spherical (l, b, d) to Galactocentric and Supergalactic frame", () => {
    // Structure at l = 0, b = 0, d = 10 Mpc
    const coords = galacticToCosmicCoordinates(0, 0, 10);

    // X is approx 10 - R_0/1000 ~ 9.9918 Mpc
    expect(coords.xMpc).toBeCloseTo(9.9918, 2);
    expect(coords.yMpc).toBeCloseTo(0, 4);
    expect(coords.distanceMpc).toBeCloseTo(10, 1);
    expect(coords.supergalactic.sglDeg).toBeGreaterThanOrEqual(0);
    expect(coords.supergalactic.sglDeg).toBeLessThanOrEqual(360);
  });

  it("transforms Equatorial J2000 coordinates to cosmic coordinates", () => {
    // Virgo Cluster: RA = 187.706°, Dec = +12.391°, d = 16.5 Mpc
    const virgo = equatorialToCosmicCoordinates(187.706, 12.391, 16.5);
    expect(virgo.distanceMpc).toBeCloseTo(16.5, 1);
    expect(Math.abs(virgo.supergalactic.sgbDeg)).toBeLessThan(5.0); // Virgo is near Supergalactic Plane SGB ~ -2.4°
  });

  it("calculates accurate 3D spatial separation between structures", () => {
    const posA = { xMpc: 0, yMpc: 0, zMpc: 0 };
    const posB = { xMpc: 3, yMpc: 4, zMpc: 0 };

    const sep = calculateInterStructureSeparation(posA, posB);
    expect(sep.separationMpc).toBeCloseTo(5.0, 4);
    expect(sep.separationLy).toBeGreaterThan(1.6e7);
  });

  it("computes mass-weighted cosmic barycenter correctly", () => {
    const members = [
      { posMpc: { xMpc: 0, yMpc: 0, zMpc: 0 }, massSolar: 1e12 },
      { posMpc: { xMpc: 10, yMpc: 0, zMpc: 0 }, massSolar: 1e12 },
    ];

    const bary = computeCosmicBarycenter(members);
    expect(bary.xMpc).toBeCloseTo(5.0, 4);
    expect(bary.yMpc).toBeCloseTo(0.0, 4);
    expect(bary.totalMassSolar).toBe(2e12);
  });
});
