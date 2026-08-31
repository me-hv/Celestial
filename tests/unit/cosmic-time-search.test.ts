import { describe, it, expect } from "vitest";
import { celestialRepo } from "@/lib/data/celestial-repository";

describe("Cosmic Epoch & Timeline Search Integration", () => {
  it("indexes and retrieves Cosmic Epochs in search", async () => {
    const response = await celestialRepo.search({ query: "recombination" });
    expect(response.results.length).toBeGreaterThan(0);
    const recomb = response.results.find((r) => r.slug === "recombination");
    expect(recomb).toBeDefined();
    expect(recomb?.objectType).toBe("COSMIC_EPOCH");
    expect(recomb?.canonicalName).toBe("Recombination & Photon Decoupling");
  });

  it("finds epochs by alternate scientific terms like Dark Ages and Reionization", async () => {
    const darkAgesResp = await celestialRepo.search({ query: "dark ages" });
    expect(darkAgesResp.results.some((r) => r.slug === "dark-ages")).toBe(true);

    const reionResp = await celestialRepo.search({ query: "reionization" });
    expect(reionResp.results.some((r) => r.slug === "reionization")).toBe(true);

    const inflationResp = await celestialRepo.search({ query: "inflation" });
    expect(inflationResp.results.some((r) => r.slug === "inflation")).toBe(true);
  });
});
