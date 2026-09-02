import { describe, it, expect } from "vitest";
import { ObservationIntelligenceEngine } from "@/lib/astronomy/research/observation-intelligence";
import { PRESET_OBSERVER_LOCATIONS } from "@/domain/observer/types";

describe("ObservationIntelligenceEngine", () => {
  const maunaKea = PRESET_OBSERVER_LOCATIONS[0];

  it("calculates realistic observation windows and limits", () => {
    // Andromeda Galaxy coordinates (RA ~ 0.7h = 10.68°, Dec ~ 41.2°)
    const windows = ObservationIntelligenceEngine.calculateWindows({
      equatorial: {
        raDeg: 10.6847,
        decDeg: 41.2687,
        rightAscensionHours: 0.7123,
        declinationDegrees: 41.2687,
      },
      observer: maunaKea,
      date: new Date("2026-09-15T00:00:00Z"),
      constraints: {
        minAltitudeDeg: 20.0,
        maxAirmass: 2.5,
      },
    });

    expect(windows.length).toBeGreaterThan(0);
    const primaryWindow = windows[0];
    expect(primaryWindow.maxAltitudeDeg).toBeGreaterThan(0);
    expect(primaryWindow.minAirmass).toBeGreaterThanOrEqual(1.0);
    expect(["BEST", "GOOD", "FAIR", "POOR", "NOT_VISIBLE"]).toContain(primaryWindow.quality);
  });

  it("generates chronological heuristic schedule for multiple targets", () => {
    const targets = [
      {
        slug: "mars",
        name: "Mars",
        coordinates: {
          raDeg: 67.5,
          decDeg: 22.0,
          rightAscensionHours: 4.5,
          declinationDegrees: 22.0,
        },
      },
      {
        slug: "m31",
        name: "Andromeda Galaxy",
        coordinates: {
          raDeg: 10.68,
          decDeg: 41.2,
          rightAscensionHours: 0.7,
          declinationDegrees: 41.2,
        },
      },
    ];

    const schedule = ObservationIntelligenceEngine.scheduleTargets(targets, maunaKea);
    expect(schedule.length).toBe(2);
    expect(schedule[0].recommendedTime.getTime()).toBeLessThanOrEqual(schedule[1].recommendedTime.getTime());
    expect(schedule[0].reasoning.length).toBeGreaterThan(0);
  });
});
