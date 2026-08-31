import { describe, it, expect } from "vitest";
import {
  ObservableUniverseRepository,
  observableUniverseRepo,
} from "@/lib/data/observable-universe-repository";

describe("ObservableUniverseRepository Unit Tests", () => {
  it("retrieves all horizons, shells, and landmarks", () => {
    const repo = new ObservableUniverseRepository();
    expect(repo.getAllHorizons().length).toBeGreaterThanOrEqual(4);
    expect(repo.getAllShells().length).toBe(9);
    expect(repo.getAllLandmarks().length).toBe(12);
  });

  it("finds horizons and landmarks by slug", () => {
    const particleHorizon = observableUniverseRepo.getHorizonBySlug("particle-horizon");
    expect(particleHorizon).toBeDefined();
    expect(particleHorizon?.horizonType).toBe("PARTICLE_HORIZON");

    const gnz11 = observableUniverseRepo.getLandmarkBySlug("galaxy-gn-z11");
    expect(gnz11).toBeDefined();
    expect(gnz11?.redshiftZ).toBeCloseTo(10.6, 1);
  });

  it("resolves the correct RedshiftShell for any cosmological redshift", () => {
    const local = observableUniverseRepo.getShellForRedshift(0.005);
    expect(local.type).toBe("LOCAL_UNIVERSE");

    const cosmicNoon = observableUniverseRepo.getShellForRedshift(2.0);
    expect(cosmicNoon.type).toBe("EARLY_GALAXIES");

    const jades = observableUniverseRepo.getShellForRedshift(14.32);
    expect(jades.type).toBe("COSMIC_DAWN");

    const cmb = observableUniverseRepo.getShellForRedshift(1089.0);
    expect(cmb.type).toBe("CMB_LAST_SCATTERING");
  });

  it("searches landmarks, horizons, and shells with full-text queries", () => {
    const gnResults = observableUniverseRepo.search("GN-z11");
    expect(gnResults.length).toBeGreaterThan(0);
    expect(gnResults[0].slug).toBe("galaxy-gn-z11");

    const cmbResults = observableUniverseRepo.search("Last-Scattering");
    expect(cmbResults.length).toBeGreaterThan(0);
  });
});
