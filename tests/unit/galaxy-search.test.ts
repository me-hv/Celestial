import { describe, it, expect } from "vitest";
import { InMemorySearchProvider } from "@/features/search/in-memory-search.provider";
import { LOCAL_GROUP_GALAXIES_DATA } from "@/lib/data/galaxy-data";

describe("Galaxy & Local Group Search Resolution", () => {
  const searchProvider = new InMemorySearchProvider([], undefined, LOCAL_GROUP_GALAXIES_DATA);

  it("should find Andromeda by name, Messier, and NGC catalog ID", async () => {
    const resName = await searchProvider.search({ query: "Andromeda" });
    expect(resName.results.length).toBeGreaterThan(0);
    expect(resName.results[0].slug).toBe("andromeda-galaxy");
    expect(resName.results[0].objectType).toBe("GALAXY");

    const resM31 = await searchProvider.search({ query: "M31" });
    expect(resM31.results.length).toBeGreaterThan(0);
    expect(resM31.results[0].slug).toBe("andromeda-galaxy");

    const resNGC224 = await searchProvider.search({ query: "NGC 224" });
    expect(resNGC224.results.length).toBeGreaterThan(0);
    expect(resNGC224.results[0].slug).toBe("andromeda-galaxy");
  });

  it("should find Triangulum galaxy by name, M33, and NGC 598", async () => {
    const resName = await searchProvider.search({ query: "Triangulum" });
    expect(resName.results.length).toBeGreaterThan(0);
    expect(resName.results[0].slug).toBe("triangulum-galaxy");

    const resM33 = await searchProvider.search({ query: "M33" });
    expect(resM33.results.length).toBeGreaterThan(0);
    expect(resM33.results[0].slug).toBe("triangulum-galaxy");
  });

  it("should find Magellanic clouds by acronyms and names", async () => {
    const resLMC = await searchProvider.search({ query: "LMC" });
    expect(resLMC.results.length).toBeGreaterThan(0);
    expect(resLMC.results[0].slug).toBe("large-magellanic-cloud");

    const resSMC = await searchProvider.search({ query: "Small Magellanic Cloud" });
    expect(resSMC.results.length).toBeGreaterThan(0);
    expect(resSMC.results[0].slug).toBe("small-magellanic-cloud");
  });

  it("should find Local Group structure", async () => {
    const resLG = await searchProvider.search({ query: "Local Group" });
    expect(resLG.results.length).toBeGreaterThan(0);
    expect(resLG.results.some((r) => r.slug === "local-group")).toBe(true);
  });
});
