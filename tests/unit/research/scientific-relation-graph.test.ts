import { describe, it, expect } from "vitest";
import { relationGraph } from "@/lib/astronomy/research/scientific-relation-graph";

describe("ScientificRelationGraph", () => {
  it("builds multi-domain relations between targets, missions, and discoveries", () => {
    const allRelations = relationGraph.getAll();
    expect(allRelations.length).toBeGreaterThan(10);
  });

  it("finds relations and neighbors for specific targets", () => {
    const sunNeighbors = relationGraph.getNeighbors("sun");
    expect(sunNeighbors.length).toBeGreaterThan(0);
    expect(sunNeighbors.some((n) => n.neighborDomain === "SOLAR_SYSTEM")).toBe(true);

    const voyagerRelations = relationGraph.getRelationsForTarget("voyager-1");
    expect(voyagerRelations.length).toBeGreaterThan(0);
  });
});
