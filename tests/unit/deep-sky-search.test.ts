import { describe, it, expect } from "vitest";
import { celestialRepo } from "@/lib/data/celestial-repository";

describe("Deep Sky Multi-Catalog Search Resolution", () => {
  it("resolves M31, NGC 224, and Andromeda Galaxy to the identical canonical object", async () => {
    const searchM31 = await celestialRepo.search({ query: "M31" });
    const searchNGC224 = await celestialRepo.search({ query: "NGC 224" });
    const searchAndromeda = await celestialRepo.search({ query: "Andromeda Galaxy" });

    expect(searchM31.results.length).toBeGreaterThan(0);
    expect(searchNGC224.results.length).toBeGreaterThan(0);
    expect(searchAndromeda.results.length).toBeGreaterThan(0);

    const m31Obj = searchM31.results[0];
    const ngcObj = searchNGC224.results[0];
    const andromedaObj = searchAndromeda.results[0];

    expect(m31Obj.id).toBe(ngcObj.id);
    expect(m31Obj.id).toBe(andromedaObj.id);
    expect(m31Obj.canonicalName).toBe("Andromeda Galaxy");
    expect(m31Obj.objectType).toBe("GALAXY");
  });

  it("resolves M42 and Orion Nebula with NEBULA object type", async () => {
    const searchM42 = await celestialRepo.search({ query: "M42" });
    const searchOrion = await celestialRepo.search({ query: "Orion Nebula" });

    expect(searchM42.results[0].id).toBe(searchOrion.results[0].id);
    expect(searchM42.results[0].canonicalName).toBe("Orion Nebula");
    expect(searchM42.results[0].objectType).toBe("NEBULA");
  });

  it("resolves M45 and Pleiades with STAR_CLUSTER object type", async () => {
    const searchM45 = await celestialRepo.search({ query: "M45" });
    const searchPleiades = await celestialRepo.search({ query: "Pleiades" });

    expect(searchM45.results[0].id).toBe(searchPleiades.results[0].id);
    expect(searchM45.results[0].canonicalName).toBe("Pleiades");
    expect(searchM45.results[0].objectType).toBe("STAR_CLUSTER");
  });

  it("resolves M57 and Ring Nebula with PLANETARY_NEBULA object type", async () => {
    const searchM57 = await celestialRepo.search({ query: "M57" });
    const searchRing = await celestialRepo.search({ query: "Ring Nebula" });

    expect(searchM57.results[0].id).toBe(searchRing.results[0].id);
    expect(searchM57.results[0].canonicalName).toBe("Ring Nebula");
    expect(searchM57.results[0].objectType).toBe("PLANETARY_NEBULA");
  });

  it("resolves Crab Nebula and Cassiopeia A with SUPERNOVA_REMNANT object type", async () => {
    const searchM1 = await celestialRepo.search({ query: "M1" });
    const searchCasA = await celestialRepo.search({ query: "Cassiopeia A" });

    expect(searchM1.results[0].canonicalName).toBe("Crab Nebula");
    expect(searchM1.results[0].objectType).toBe("SUPERNOVA_REMNANT");

    expect(searchCasA.results[0].canonicalName).toBe("Cassiopeia A");
    expect(searchCasA.results[0].objectType).toBe("SUPERNOVA_REMNANT");
  });
});
