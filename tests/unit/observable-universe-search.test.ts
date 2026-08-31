import { describe, it, expect } from "vitest";
import { InMemorySearchProvider } from "@/features/search/in-memory-search.provider";

describe("Observable Universe Universal Search Indexation Tests", () => {
  const searchProvider = new InMemorySearchProvider();

  it("finds GN-z11 when searching for 'GN-z11'", async () => {
    const res = await searchProvider.search({ query: "GN-z11" });
    expect(res.results.length).toBeGreaterThan(0);
    const match = res.results.find((r) => r.slug === "galaxy-gn-z11");
    expect(match).toBeDefined();
    expect(match?.objectType).toBe("OBSERVABLE_LANDMARK");
  });

  it("finds JADES-GS-z14-0 when searching for 'JADES'", async () => {
    const res = await searchProvider.search({ query: "JADES" });
    expect(res.results.length).toBeGreaterThan(0);
    const match = res.results.find((r) => r.slug === "galaxy-jades-gs-z14-0");
    expect(match).toBeDefined();
  });

  it("finds Particle Horizon when searching for 'Particle Horizon'", async () => {
    const res = await searchProvider.search({ query: "Particle Horizon" });
    expect(res.results.length).toBeGreaterThan(0);
    const match = res.results.find((r) => r.slug === "particle-horizon");
    expect(match).toBeDefined();
    expect(match?.objectType).toBe("COSMIC_HORIZON");
  });

  it("finds CMB when searching for 'CMB'", async () => {
    const res = await searchProvider.search({ query: "CMB" });
    expect(res.results.length).toBeGreaterThan(0);
    const match = res.results.find((r) => r.slug === "cosmic-microwave-background");
    expect(match).toBeDefined();
    expect(match?.objectType).toBe("CMB");
  });
});
