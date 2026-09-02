import { describe, it, expect } from "vitest";
import { TargetIntelligenceEngine } from "@/lib/astronomy/research/target-intelligence-engine";
import { PRESET_OBSERVER_LOCATIONS } from "@/domain/observer/types";

describe("TargetIntelligenceEngine", () => {
  it("resolves targets from multiple canonical astronomical domains", () => {
    const mars = TargetIntelligenceEngine.resolveTarget("mars");
    expect(mars).toBeDefined();
    expect(mars?.domain).toBe("SOLAR_SYSTEM");
    expect(mars?.canonicalName).toBe("Mars");

    const m31 = TargetIntelligenceEngine.resolveTarget("m31-andromeda-galaxy");
    expect(m31).toBeDefined();
    expect(m31?.domain).toBe("DEEP_SKY");

    const galaxy = TargetIntelligenceEngine.resolveTarget("andromeda-galaxy");
    expect(galaxy).toBeDefined();
    expect(galaxy?.domain).toBe("GALACTIC");

    const jwst = TargetIntelligenceEngine.resolveTarget("james-webb-space-telescope");
    expect(jwst).toBeDefined();
    expect(jwst?.domain).toBe("MISSION");

    const keck = TargetIntelligenceEngine.resolveTarget("w-m-keck-observatory");
    expect(keck).toBeDefined();
    expect(keck?.domain).toBe("OBSERVATORY");
  });

  it("returns null for non-existent target", () => {
    const unknown = TargetIntelligenceEngine.resolveTarget("non-existent-galaxy-9999");
    expect(unknown).toBeNull();
  });

  it("generates comprehensive target intelligence report with provenance and epistemic integrity", () => {
    const observer = PRESET_OBSERVER_LOCATIONS[0];
    const report = TargetIntelligenceEngine.generateReport("mars", observer);

    expect(report).toBeDefined();
    expect(report?.target.canonicalName).toBe("Mars");
    expect(report?.provenance).toBeDefined();
    expect(report?.provenance.confidenceScore).toBeGreaterThan(0.9);
    expect(report?.context3DRoute).toContain("/explore");
    expect(report?.scientificEvidence.length).toBeGreaterThan(0);
    expect(report?.scientificEvidence[0].epistemicStatus).toBeDefined();
  });
});
