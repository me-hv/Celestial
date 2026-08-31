import { describe, it, expect } from "vitest";
import { celestialRepo } from "@/lib/data/celestial-repository";
import { SOLAR_SYSTEM_IDS } from "@/lib/data/solar-system-data";

describe("CelestialObjectRepository & Solar System Data Model", () => {
  it("contains the Sun, 8 planets, and Earth's Moon", () => {
    const all = celestialRepo.getAll();
    expect(all.length).toBeGreaterThanOrEqual(10);

    const slugs = all.map((o) => o.slug);
    expect(slugs).toContain("sun");
    expect(slugs).toContain("mercury");
    expect(slugs).toContain("venus");
    expect(slugs).toContain("earth");
    expect(slugs).toContain("moon");
    expect(slugs).toContain("mars");
    expect(slugs).toContain("jupiter");
    expect(slugs).toContain("saturn");
    expect(slugs).toContain("uranus");
    expect(slugs).toContain("neptune");
  });

  it("accurately models the Earth -> Moon hierarchical parent-child relationship", () => {
    const earth = celestialRepo.getBySlug("earth");
    const moon = celestialRepo.getBySlug("moon");

    expect(earth).toBeDefined();
    expect(moon).toBeDefined();

    expect(moon?.parentId).toBe(earth?.id);
    expect(earth?.childObjectIds).toContain(moon?.id);

    const earthChildren = celestialRepo.getChildrenOf(earth!.id);
    expect(earthChildren.map((c) => c.slug)).toContain("moon");
  });

  it("accurately models Sun -> 8 Planets relationships", () => {
    const sun = celestialRepo.getById(SOLAR_SYSTEM_IDS.SUN);
    expect(sun).toBeDefined();
    expect(sun?.childObjectIds?.length).toBe(8);

    const solarPlanets = celestialRepo.getChildrenOf(SOLAR_SYSTEM_IDS.SUN);
    expect(solarPlanets.length).toBe(8);
  });

  it("resolves multi-catalog search aliases (e.g. 'Terra', 'Luna', 'Red Planet')", async () => {
    const terraResult = await celestialRepo.search({ query: "terra" });
    expect(terraResult.results[0].canonicalName).toBe("Earth");

    const lunaResult = await celestialRepo.search({ query: "luna" });
    expect(lunaResult.results[0].canonicalName).toBe("Moon");

    const redPlanetResult = await celestialRepo.search({ query: "red planet" });
    expect(redPlanetResult.results[0].canonicalName).toBe("Mars");
  });

  it("retains scientific provenance across all objects", () => {
    const all = celestialRepo.getAll();
    for (const obj of all) {
      expect(["NASA", "GAIA", "SIMBAD"]).toContain(obj.provenance.authoritativeBody);
      expect(obj.provenance.confidenceScore).toBeGreaterThanOrEqual(0.95);
      expect(obj.provenance.recordIdentifier).toBeDefined();
    }
  });
});
