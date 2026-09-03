import { describe, it, expect } from "vitest";
import { TemporalDiffEngine } from "@/domain/timeline/temporal-diff-engine";

describe("Temporal Diff Engine (What Changed?)", () => {
  it("calculates meaningful physical and trajectory differences between two epochs", () => {
    const dateA = new Date("1977-09-05T00:00:00Z"); // Launch
    const dateB = new Date("1979-03-05T00:00:00Z"); // Jupiter flyby

    const diff = TemporalDiffEngine.diffStates("voyager-1", dateA, dateB);

    expect(diff.targetId).toBe("voyager-1");
    expect(diff.timeDeltaDays).toBeGreaterThan(500);
    expect(diff.scientificSummary).toContain("Voyager 1");
  });
});
