import { describe, it, expect } from "vitest";
import { calculateAstronomicalEvents } from "@/lib/astronomy/events/astronomical-events";
import { PRESET_OBSERVER_LOCATIONS } from "@/domain/observer/types";

describe("Astronomical Events & Ephemeris Schedule Engine", () => {
  const greenwich = PRESET_OBSERVER_LOCATIONS[0];

  it("calculates solar events and twilights for Greenwich", () => {
    const report = calculateAstronomicalEvents(greenwich, new Date());
    expect(report.solar).toBeDefined();
    expect(report.solar.dayLengthHours).toBeGreaterThan(0);
    expect(report.solar.dayLengthHours).toBeLessThanOrEqual(24);

    expect(report.lunar).toBeDefined();
    expect(report.lunar.phaseDisplayName).toBeDefined();
    expect(report.lunar.illuminationPercentage).toBeGreaterThanOrEqual(0);

    expect(report.planets.length).toBeGreaterThan(0);
  });
});
