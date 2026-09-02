import { describe, it, expect } from "vitest";
import { InMemorySearchProvider } from "@/features/search/in-memory-search.provider";

describe("Phase 11 Search Provider Missions & Scientific Discovery Indexing", () => {
  const searchProvider = new InMemorySearchProvider();

  it("should index and find space missions by name and abbreviation", async () => {
    const res = await searchProvider.search({ query: "james webb" });
    expect(res.results.some((r) => r.objectType === "MISSION" && r.slug === "james-webb-space-telescope")).toBe(true);

    const voyagerRes = await searchProvider.search({ query: "voyager 1" });
    expect(voyagerRes.results.some((r) => r.objectType === "MISSION" && r.slug === "voyager-1")).toBe(true);
  });

  it("should find spacecraft and instruments", async () => {
    const nircamRes = await searchProvider.search({ query: "nircam" });
    expect(nircamRes.results.some((r) => r.objectType === "INSTRUMENT")).toBe(true);

    const roverRes = await searchProvider.search({ query: "perseverance" });
    expect(roverRes.results.some((r) => r.objectType === "SPACECRAFT" || r.objectType === "MISSION")).toBe(true);
  });

  it("should find scientific discoveries by topic", async () => {
    const enceladusRes = await searchProvider.search({ query: "enceladus" });
    expect(enceladusRes.results.some((r) => r.objectType === "DISCOVERY")).toBe(true);
  });
});
