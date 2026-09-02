import { describe, it, expect } from "vitest";
import { astronomicalEventRepo } from "@/lib/data/astronomical-event-repository";
import { PRESET_OBSERVER_LOCATIONS } from "@/domain/observer/types";

describe("Phase 13: Astronomical Events Repository", () => {
  it("retrieves all landmark astronomical events", () => {
    const events = astronomicalEventRepo.getAll();
    expect(events.length).toBeGreaterThanOrEqual(6);

    const saturnOpp = astronomicalEventRepo.getBySlug("saturn-at-opposition-2026");
    expect(saturnOpp).toBeDefined();
    expect(saturnOpp?.eventType).toBe("OPPOSITION");
    expect(saturnOpp?.targetSlugs).toContain("saturn");
  });

  it("filters events by event type and naked-eye visibility", () => {
    const eclipses = astronomicalEventRepo.filter({ eventType: "SOLAR_ECLIPSE" });
    expect(eclipses.length).toBeGreaterThan(0);
    expect(eclipses[0].primaryTargetName).toBe("Sun");

    const nakedEye = astronomicalEventRepo.filter({ nakedEyeOnly: true });
    expect(nakedEye.every((e) => e.nakedEyeVisible)).toBe(true);
  });

  it("filters upcoming events for observer location", () => {
    const maunaKea = PRESET_OBSERVER_LOCATIONS[0];
    const events = astronomicalEventRepo.getForObserver(maunaKea, new Date("2024-01-01T00:00:00Z"));
    expect(events.length).toBeGreaterThan(0);
  });
});
