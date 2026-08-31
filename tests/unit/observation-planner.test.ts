import { describe, it, expect } from "vitest";
import { generateObservationPlan } from "@/lib/astronomy/planner/observation-planner";
import { PRESET_OBSERVER_LOCATIONS } from "@/domain/observer/types";

describe("Observation Planner Engine", () => {
  const maunaKea = PRESET_OBSERVER_LOCATIONS[1]; // Mauna Kea

  it("generates observation plan matching altitude and magnitude criteria", () => {
    const plan = generateObservationPlan({
      location: maunaKea,
      date: new Date(),
      minAltitudeDeg: 25.0,
      maxMagnitudeV: 6.0,
    });

    expect(plan.targets).toBeDefined();
    expect(plan.totalVisibleTargets).toBe(plan.targets.length);

    for (const target of plan.targets) {
      expect(target.transitAltitudeDeg).toBeGreaterThanOrEqual(25.0);
      if (target.apparentMagnitudeV !== undefined) {
        expect(target.apparentMagnitudeV).toBeLessThanOrEqual(6.0);
      }
      expect(target.observingScore).toBeGreaterThanOrEqual(0);
      expect(target.observingScore).toBeLessThanOrEqual(100);
      expect(target.recommendedEquipment).toBeDefined();
    }
  });
});
