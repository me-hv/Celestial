import { describe, it, expect } from "vitest";
import { timelineRepo } from "@/domain/timeline/timeline-repository";

describe("Timeline Repository & Multi-Index Query Engine", () => {
  it("indexes baseline and cross-domain events on initialization", () => {
    const all = timelineRepo.getAll();
    expect(all.length).toBeGreaterThanOrEqual(10);
  });

  it("queries events filtered by domain", () => {
    const cosmosEvents = timelineRepo.query({ domain: "COSMOS" });
    expect(cosmosEvents.length).toBeGreaterThan(0);
    cosmosEvents.forEach((e) => expect(e.domain).toBe("COSMOS"));

    const missionEvents = timelineRepo.query({ domain: "SPACE_MISSIONS" });
    expect(missionEvents.length).toBeGreaterThan(0);
    missionEvents.forEach((e) => expect(e.domain).toBe("SPACE_MISSIONS"));
  });

  it("queries events by target ID across multiple domains", () => {
    const jupiterEvents = timelineRepo.query({ targetId: "jupiter" });
    expect(jupiterEvents.length).toBeGreaterThan(0);
    jupiterEvents.forEach((e) => {
      expect(e.targetIds).toContain("jupiter");
    });
  });

  it("queries events by text search with pagination limit and offset", () => {
    const voyagerEvents = timelineRepo.query({ searchQuery: "Voyager", limit: 2, offset: 0 });
    expect(voyagerEvents.length).toBeLessThanOrEqual(2);
    voyagerEvents.forEach((e) => {
      const match = e.title.includes("Voyager") || e.description.includes("Voyager") || e.tags.includes("voyager");
      expect(match).toBe(true);
    });
  });

  it("retrieves relational graph connections for an event", () => {
    const relations = timelineRepo.getRelationsForEvent("te-voyager-1-launch");
    expect(relations.length).toBeGreaterThan(0);
    expect(relations[0].relationType).toBe("PRECEDED_BY");
  });
});
