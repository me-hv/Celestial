import { describe, it, expect } from "vitest";
import { SkyIntelligenceEngine } from "@/domain/sky-intelligence/sky-intelligence-engine";
import { PRESET_OBSERVER_LOCATIONS } from "@/domain/observer/types";

describe("Real-Time Sky Intelligence Engine", () => {
  const greenwich = PRESET_OBSERVER_LOCATIONS[0];

  it("computes current sky summary with twilight and darkness scores", () => {
    const summary = SkyIntelligenceEngine.getCurrentSkySummary(greenwich);

    expect(summary.observer).toEqual(greenwich);
    expect(summary.julianDate).toBeGreaterThan(2460000);
    expect(summary.skyDarknessScore).toBeGreaterThanOrEqual(0);
    expect(summary.skyDarknessScore).toBeLessThanOrEqual(100);
    expect(summary.moonPhaseName).toBeDefined();
    expect(summary.moonIlluminationFraction).toBeGreaterThanOrEqual(0);
    expect(summary.moonIlluminationFraction).toBeLessThanOrEqual(1);
    expect(summary.epistemicStatus).toBe("MODEL_DERIVED");
  });

  it("ranks observable targets with explicit scientific reasons and airmass constraints", () => {
    const summary = SkyIntelligenceEngine.getCurrentSkySummary(greenwich);

    expect(summary.topTargetsRightNow).toBeDefined();
    summary.topTargetsRightNow.forEach((target) => {
      expect(target.targetSlug).toBeDefined();
      expect(target.altitudeDeg).toBeGreaterThan(0);
      expect(target.airmass).toBeGreaterThanOrEqual(1.0);
      expect(target.score).toBeGreaterThanOrEqual(0);
      expect(target.score).toBeLessThanOrEqual(100);
      expect(target.epistemicStatus).toBe("MODEL_DERIVED");
    });
  });
});
