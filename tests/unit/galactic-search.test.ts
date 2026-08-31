import { describe, it, expect } from "vitest";
import { celestialRepo } from "@/lib/data/celestial-repository";
import { galacticStructureRepo } from "@/lib/data/galactic-structure-repository";

describe("Galactic Structures & Sagittarius A* Search Resolution", () => {
  it("resolves Milky Way to GALACTIC_STRUCTURE", async () => {
    const res = await celestialRepo.search({ query: "Milky Way" });
    expect(res.results.length).toBeGreaterThan(0);
    const mw = res.results.find((r) => r.slug === "milky-way");
    expect(mw).toBeDefined();
    expect(mw?.objectType).toBe("GALACTIC_STRUCTURE");
    expect(mw?.canonicalName).toBe("Milky Way Galaxy");
  });

  it("resolves Galactic Center as a structural entity", async () => {
    const res = await celestialRepo.search({ query: "Galactic Center" });
    expect(res.results.length).toBeGreaterThan(0);
    const gc = res.results.find((r) => r.slug === "galactic-center");
    expect(gc).toBeDefined();
    expect(gc?.objectType).toBe("GALACTIC_STRUCTURE");
  });

  it("resolves Sagittarius A* as a BLACK_HOLE celestial object, distinct from the Galactic Center structure", async () => {
    const res = await celestialRepo.search({ query: "Sagittarius A*" });
    expect(res.results.length).toBeGreaterThan(0);

    const sgrA = res.results.find((r) => r.slug === "sagittarius-a-star");
    expect(sgrA).toBeDefined();
    expect(sgrA?.objectType).toBe("BLACK_HOLE");
    expect(sgrA?.canonicalName).toBe("Sagittarius A*");

    // Galactic Center is a separate structure in GalacticStructureRepository
    const gcStructure = galacticStructureRepo.getGalacticCenter();
    expect(gcStructure).toBeDefined();
    expect(gcStructure.slug).toBe("galactic-center");
    expect(sgrA?.id).not.toBe(gcStructure.id);
  });

  it("resolves Orion Spur to GALACTIC_STRUCTURE", async () => {
    const res = await celestialRepo.search({ query: "Orion Spur" });
    expect(res.results.length).toBeGreaterThan(0);
    const orion = res.results[0];
    expect(orion.slug).toBe("orion-spur");
    expect(orion.objectType).toBe("GALACTIC_STRUCTURE");
  });

  it("resolves Local Group to GALACTIC_STRUCTURE or COSMIC_STRUCTURE", async () => {
    const res = await celestialRepo.search({ query: "Local Group" });
    expect(res.results.length).toBeGreaterThan(0);
    const lg = res.results.find((r) => r.slug === "local-group");
    expect(lg).toBeDefined();
    expect(["GALACTIC_STRUCTURE", "COSMIC_STRUCTURE"]).toContain(lg?.objectType);
  });
});
