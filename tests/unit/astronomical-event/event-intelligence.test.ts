import { describe, it, expect } from "vitest";
import { AstronomicalEventIntelligence } from "@/domain/astronomical-event/astronomical-event-intelligence";
import { astronomicalEventRepo } from "@/lib/data/astronomical-event-repository";
import { PRESET_OBSERVER_LOCATIONS } from "@/domain/observer/types";

describe("Astronomical Event Observer-Aware Intelligence", () => {
  const maunaKea = PRESET_OBSERVER_LOCATIONS[1];

  it("evaluates local observer visibility for landmark events", () => {
    const events = astronomicalEventRepo.getAll();
    expect(events.length).toBeGreaterThan(0);

    const saturnOpposition = events.find((e) => e.eventType === "OPPOSITION");
    expect(saturnOpposition).toBeDefined();
    if (!saturnOpposition) return;

    const evaluation = AstronomicalEventIntelligence.evaluateEventForObserver(
      saturnOpposition,
      maunaKea
    );

    expect(evaluation.event.id).toBe(saturnOpposition.id);
    expect(evaluation.observer).toEqual(maunaKea);
    expect(evaluation.recommendedOptics).toBeDefined();
    expect(evaluation.observationQuality).toBeDefined();
    expect(evaluation.summary).toBeDefined();
  });
});
