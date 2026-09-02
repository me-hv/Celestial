import { describe, it, expect } from "vitest";
import { observatoryRepo } from "@/lib/data/observatory-repository";

describe("ObservatoryRepository", () => {
  it("retrieves all curated world observatories", () => {
    const all = observatoryRepo.getAll();
    expect(all.length).toBeGreaterThanOrEqual(10);
  });

  it("finds observatory by slug with complete telescope specs and discoveries", () => {
    const keck = observatoryRepo.getBySlug("w-m-keck-observatory");
    expect(keck).toBeDefined();
    expect(keck?.primaryTelescopes.length).toBeGreaterThan(0);
    expect(keck?.primaryTelescopes[0].apertureMeters).toBe(10.0);
    expect(keck?.keyDiscoveries.length).toBeGreaterThan(0);
  });

  it("computes tonight's visible targets for an observatory", () => {
    const vlt = observatoryRepo.getBySlug("paranal-observatory-vlt");
    expect(vlt).toBeDefined();
    if (vlt) {
      const targets = observatoryRepo.getVisibleTargetsTonight(vlt);
      expect(targets.length).toBeGreaterThan(0);
    }
  });
});
