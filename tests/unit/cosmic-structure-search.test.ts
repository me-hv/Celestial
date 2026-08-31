import { describe, it, expect } from "vitest";
import { InMemorySearchProvider } from "@/features/search/in-memory-search.provider";
import { COSMIC_STRUCTURES_DATA } from "@/lib/data/cosmic-structure-data";

describe("Cosmic Structure Search Integration", () => {
  const searchProvider = new InMemorySearchProvider([], [], [], COSMIC_STRUCTURES_DATA);

  it("finds cosmic structure by exact name", async () => {
    const res = await searchProvider.search({ query: "Virgo Cluster" });
    expect(res.results.length).toBeGreaterThan(0);
    expect(res.results[0].slug).toBe("virgo-cluster");
    expect(res.results[0].objectType).toBe("COSMIC_STRUCTURE");
  });

  it("finds cosmic structure by Abell designation", async () => {
    const res = await searchProvider.search({ query: "Abell 1656" });
    expect(res.results.length).toBeGreaterThan(0);
    expect(res.results[0].slug).toBe("coma-cluster");
  });

  it("finds cosmic structure by alias", async () => {
    const res = await searchProvider.search({ query: "The Great Nothing" });
    expect(res.results.length).toBeGreaterThan(0);
    expect(res.results[0].slug).toBe("bootes-void");
  });

  it("finds Laniakea Supercluster", async () => {
    const res = await searchProvider.search({ query: "Laniakea" });
    expect(res.results.length).toBeGreaterThan(0);
    expect(res.results[0].slug).toBe("laniakea-supercluster");
  });
});
