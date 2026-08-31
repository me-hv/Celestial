import { describe, it, expect } from "vitest";
import { GalaxyRepository } from "@/lib/data/galaxy-repository";
import { LOCAL_GROUP_GALAXIES_DATA } from "@/lib/data/galaxy-data";

describe("GalaxyRepository & Comparison Engine", () => {
  const repo = new GalaxyRepository(LOCAL_GROUP_GALAXIES_DATA);

  it("should retrieve galaxies by slug and alias", () => {
    const mw = repo.getBySlug("milky-way-galaxy");
    expect(mw).toBeDefined();
    expect(mw?.name).toBe("Milky Way Galaxy");

    const m31ByAlias = repo.getById("m31");
    expect(m31ByAlias).toBeDefined();
    expect(m31ByAlias?.slug).toBe("andromeda-galaxy");

    const m33ByCatalog = repo.getById("ngc598");
    expect(m33ByCatalog).toBeDefined();
    expect(m33ByCatalog?.slug).toBe("triangulum-galaxy");
  });

  it("should filter galaxies by morphology and group membership", () => {
    const spirals = repo.filter({ morphologyClass: "BARRED_SPIRAL" });
    expect(spirals.some((g) => g.slug === "andromeda-galaxy")).toBe(true);
    expect(spirals.some((g) => g.slug === "milky-way-galaxy")).toBe(true);

    const satellites = repo.filter({ membershipType: "SATELLITE" });
    expect(satellites.some((g) => g.slug === "large-magellanic-cloud")).toBe(true);
    expect(satellites.some((g) => g.slug === "small-magellanic-cloud")).toBe(true);
  });

  it("should retrieve satellites by parent galaxy slug", () => {
    const mwSatellites = repo.getSatellites("milky-way-galaxy");
    expect(mwSatellites.length).toBeGreaterThanOrEqual(2);
    expect(mwSatellites.map((s) => s.slug)).toContain("large-magellanic-cloud");
    expect(mwSatellites.map((s) => s.slug)).toContain("small-magellanic-cloud");

    const m31Satellites = repo.getSatellites("andromeda-galaxy");
    expect(m31Satellites.map((s) => s.slug)).toContain("m32-galaxy");
    expect(m31Satellites.map((s) => s.slug)).toContain("m110-galaxy");
  });

  it("should execute side-by-side galaxy comparison", () => {
    const comparison = repo.compare("milky-way-galaxy", "andromeda-galaxy");
    expect(comparison).not.toBeNull();
    if (!comparison) return;

    expect(comparison.galaxyA.slug).toBe("milky-way-galaxy");
    expect(comparison.galaxyB.slug).toBe("andromeda-galaxy");
    expect(comparison.diameterRatio).toBeDefined();
    expect(comparison.massRatio).toBeDefined();
    // Andromeda diameter (~46.6 kpc) is larger than Milky Way (~26.8 kpc)
    expect(comparison.diameterRatio!).toBeLessThan(1.0);
  });
});
