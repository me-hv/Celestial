import { describe, it, expect } from "vitest";
import {
  CosmologyCalculator,
  defaultCosmology,
} from "@/lib/astronomy/cosmology/cosmology-calculator";

describe("CosmologyCalculator", () => {
  it("initializes with default Planck 2018 parameters", () => {
    const config = defaultCosmology.getConfig();
    expect(config.hubbleConstantKmSPerMpc).toBe(70.0);
    expect(config.omegaMatter).toBe(0.315);
    expect(config.omegaLambda).toBe(0.685);
    expect(config.omegaCurvature).toBe(0.0);
  });

  it("allows custom cosmology parameter instantiation", () => {
    const custom = new CosmologyCalculator({
      hubbleConstantKmSPerMpc: 73.0,
      omegaMatter: 0.30,
      omegaLambda: 0.70,
    });
    const config = custom.getConfig();
    expect(config.hubbleConstantKmSPerMpc).toBe(73.0);
    expect(config.omegaMatter).toBe(0.30);
    expect(config.omegaLambda).toBe(0.70);
  });

  it("calculates dimensionless Hubble parameter E(z=0) equal to 1.0", () => {
    const ez0 = defaultCosmology.getEz(0);
    expect(ez0).toBeCloseTo(1.0, 4);
  });

  it("calculates monotonic expansion rate E(z) for positive redshifts", () => {
    const ez0 = defaultCosmology.getEz(0);
    const ez1 = defaultCosmology.getEz(0.1);
    const ez2 = defaultCosmology.getEz(1.0);

    expect(ez1).toBeGreaterThan(ez0);
    expect(ez2).toBeGreaterThan(ez1);
  });

  it("calculates comoving, luminosity, and angular diameter distances correctly", () => {
    const z = 0.05; // Low-to-moderate cosmological redshift (e.g. Boötes / Shapley scale)
    const dc = defaultCosmology.calculateComovingDistanceMpc(z);
    const dm = defaultCosmology.calculateTransverseComovingDistanceMpc(z);
    const dl = defaultCosmology.calculateLuminosityDistanceMpc(z);
    const da = defaultCosmology.calculateAngularDiameterDistanceMpc(z);

    // In flat Universe, DM = DC
    expect(dm).toBeCloseTo(dc, 4);

    // D_L = (1 + z) * D_M > D_M
    expect(dl).toBeCloseTo((1 + z) * dm, 4);
    expect(dl).toBeGreaterThan(dm);

    // D_A = D_M / (1 + z) < D_M
    expect(da).toBeCloseTo(dm / (1 + z), 4);
    expect(da).toBeLessThan(dm);

    // For z = 0.05, D_C is roughly (c * z / H_0) ~ (299792 * 0.05 / 70) ~ 214 Mpc
    expect(dc).toBeGreaterThan(200);
    expect(dc).toBeLessThan(230);
  });

  it("calculates lookback time with proper physical scaling", () => {
    const t0 = defaultCosmology.calculateLookbackTimeGyr(0);
    expect(t0).toBe(0);

    const t1 = defaultCosmology.calculateLookbackTimeGyr(0.01); // ~140 Myr
    expect(t1).toBeGreaterThan(0.1);
    expect(t1).toBeLessThan(0.2);

    const t2 = defaultCosmology.calculateLookbackTimeGyr(1.0);
    expect(t2).toBeGreaterThan(7.0); // Roughly ~7.8 Gyr at z = 1
    expect(t2).toBeLessThan(9.0);
  });

  it("converts angular size to physical diameter accurately", () => {
    // A structure of 60 arcminutes (1 degree) at z = 0.01 (DA ~ 42.4 Mpc)
    // Physical diameter ~ (1 * pi / 180) * 42400 kpc ~ 740 kpc
    const diameterKpc = defaultCosmology.angularSizeToPhysicalDiameterKpc(60, 0.01);
    expect(diameterKpc).toBeGreaterThan(700);
    expect(diameterKpc).toBeLessThan(800);
  });

  it("calculates comprehensive metrics package across regimes", () => {
    // Local Group regime (z <= 0.001)
    const bound = defaultCosmology.calculateAll(0.0005);
    expect(bound.isLocalGroupBound).toBe(true);

    // Cosmological regime
    const cosmic = defaultCosmology.calculateAll(0.0231); // Coma Cluster redshift
    expect(cosmic.isLocalGroupBound).toBe(false);
    expect(cosmic.comovingDistanceMpc).toBeGreaterThan(90);
    expect(cosmic.comovingDistanceMpc).toBeLessThan(110);
    expect(cosmic.lookbackTimeYears).toBeGreaterThan(3e8); // >300 Million years
  });

  it("decomposes observed velocity into cosmological expansion and peculiar velocity", () => {
    // Virgo Cluster: observed v_r = 1307 km/s, true distance = 16.5 Mpc
    // Cosmic Hubble velocity = 70 * 16.5 = 1155 km/s
    // Peculiar velocity = 1307 - 1155 = +152 km/s (or infalling towards supercluster center)
    const flow = defaultCosmology.calculatePeculiarVelocity(1307, 16.5);
    expect(flow.cosmicHubbleVelocityKmS).toBeCloseTo(1155, 1);
    expect(flow.peculiarVelocityKmS).toBeCloseTo(152, 1);
  });
});
