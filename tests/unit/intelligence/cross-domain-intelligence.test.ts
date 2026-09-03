import { describe, it, expect } from "vitest";
import { IntelligenceEngine } from "@/domain/intelligence/intelligence-engine";
import { PRESET_OBSERVER_LOCATIONS } from "@/domain/observer/types";

describe("Cross-Domain Scientific Intelligence Engine", () => {
  it("synthesizes multi-domain scientific snapshot and insight statements", () => {
    const snapshot = IntelligenceEngine.evaluateCrossDomainInsights(PRESET_OBSERVER_LOCATIONS[0]);

    expect(snapshot.solarActivitySummary).toBeDefined();
    expect(snapshot.activeDeepSpaceMissionsCount).toBeGreaterThan(0);
    expect(snapshot.intelligenceInsights.length).toBeGreaterThanOrEqual(2);

    snapshot.intelligenceInsights.forEach((insight) => {
      expect(insight.statement).toBeDefined();
      expect(insight.basis).toBeDefined();
      expect(insight.epistemicStatus).toMatch(/OBSERVED|INFERRED|MODEL_DERIVED/);
      expect(insight.confidenceScore).toBeGreaterThanOrEqual(0.9);
      expect(insight.provenance).toBeDefined();
    });
  });
});
