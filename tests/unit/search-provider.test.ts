import { describe, it, expect, beforeEach } from "vitest";
import { InMemorySearchProvider } from "@/features/search/in-memory-search.provider";
import { CelestialObject } from "@/domain/celestial-object/types";
import {
  CelestialCategory,
  CelestialClassificationCode,
} from "@/domain/celestial-object/classification";

const mockObjects: CelestialObject[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    slug: "earth",
    canonicalName: "Earth",
    standardDesignation: "Sol III",
    classification: {
      category: CelestialCategory.PLANETARY,
      code: CelestialClassificationCode.TERRESTRIAL_PLANET,
    },
    aliases: [
      { name: "Terra", type: "HISTORICAL" },
      { name: "The Blue Planet", type: "COMMON" },
    ],
    physical: {},
    positional: {},
    provenance: {
      sourceId: "src-1",
      authoritativeBody: "NASA",
      catalogName: "Planetary Fact Sheet",
      recordIdentifier: "EARTH",
      confidenceScore: 1,
      retrievedAt: new Date().toISOString(),
    },
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    slug: "sirius",
    canonicalName: "Sirius",
    standardDesignation: "Alpha Canis Majoris",
    classification: {
      category: CelestialCategory.STELLAR,
      code: CelestialClassificationCode.STAR,
    },
    aliases: [
      { name: "Dog Star", type: "COMMON" },
      { name: "HD 48915", type: "CATALOG" },
    ],
    physical: {},
    positional: {},
    provenance: {
      sourceId: "src-2",
      authoritativeBody: "SIMBAD",
      catalogName: "SIMBAD Astronomical Database",
      recordIdentifier: "NAME Sirius",
      confidenceScore: 0.99,
      retrievedAt: new Date().toISOString(),
    },
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    slug: "andromeda",
    canonicalName: "Andromeda Galaxy",
    standardDesignation: "Messier 31",
    classification: {
      category: CelestialCategory.DEEP_SKY,
      code: CelestialClassificationCode.GALAXY,
    },
    aliases: [
      { name: "M31", type: "CATALOG" },
      { name: "NGC 224", type: "CATALOG" },
    ],
    physical: {},
    positional: {},
    provenance: {
      sourceId: "src-3",
      authoritativeBody: "ESO",
      catalogName: "Messier Catalog",
      recordIdentifier: "M31",
      confidenceScore: 1,
      retrievedAt: new Date().toISOString(),
    },
  },
];

describe("InMemorySearchProvider", () => {
  let provider: InMemorySearchProvider;

  beforeEach(() => {
    provider = new InMemorySearchProvider(mockObjects);
  });

  it("finds exact canonical name matches with maximum score", async () => {
    const response = await provider.search({ query: "earth" });
    expect(response.totalMatches).toBe(1);
    expect(response.results[0].canonicalName).toBe("Earth");
    expect(response.results[0].matchScore).toBe(1.0);
  });

  it("resolves multi-catalog aliases correctly (e.g. 'Terra' -> Earth)", async () => {
    const response = await provider.search({ query: "terra" });
    expect(response.totalMatches).toBe(1);
    expect(response.results[0].canonicalName).toBe("Earth");
    expect(response.results[0].matchedAlias).toBe("Terra");
  });

  it("resolves catalog designation codes (e.g. 'M31' -> Andromeda Galaxy)", async () => {
    const response = await provider.search({ query: "M31" });
    expect(response.totalMatches).toBe(1);
    expect(response.results[0].canonicalName).toBe("Andromeda Galaxy");
  });

  it("filters search results by category", async () => {
    const response = await provider.search({
      query: "s",
      categories: [CelestialCategory.PLANETARY],
    });
    // Sirius is stellar, so it should be filtered out
    expect(response.results.every((r) => r.category === CelestialCategory.PLANETARY)).toBe(true);
  });

  it("returns empty result for empty query", async () => {
    const response = await provider.search({ query: "   " });
    expect(response.results).toEqual([]);
    expect(response.totalMatches).toBe(0);
  });
});
