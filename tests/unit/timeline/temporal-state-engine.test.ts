import { describe, it, expect } from "vitest";
import { TemporalStateEngine } from "@/domain/timeline/temporal-state-engine";

describe("Temporal State Engine & Historical State Reconstruction", () => {
  it("reconstructs historical spacecraft state for Voyager 1", () => {
    const historicalDate = new Date("1980-11-12T00:00:00Z"); // Saturn encounter epoch
    const state = TemporalStateEngine.getStateAt("voyager-1", historicalDate);

    expect(state.targetId).toBe("voyager-1");
    expect(state.epistemicStatus).toBe("OBSERVED");
    expect(state.stateDerivationMethod).toBe("HISTORICAL_RECORD_RECONSTRUCTION");
    expect(state.distanceFromSunAu).toBeGreaterThan(0);
    expect(state.heliocentricVelocityKmS).toBeGreaterThan(0);
  });

  it("reconstructs live propagated state for Voyager 1", () => {
    const liveDate = new Date();
    const state = TemporalStateEngine.getStateAt("voyager-1", liveDate);

    expect(state.targetId).toBe("voyager-1");
    expect(state.epistemicStatus).toBe("MODEL_DERIVED");
    expect(state.stateDerivationMethod).toBe("ASTRODYNAMIC_PROPAGATION");
    expect(state.distanceFromSunAu).toBeGreaterThan(160);
  });

  it("reconstructs planetary state using Keplerian ephemeris solver", () => {
    const date = new Date("2026-09-03T00:00:00Z");
    const state = TemporalStateEngine.getStateAt("jupiter", date);

    expect(state.targetId).toBe("jupiter");
    expect(state.operationalStatus).toBe("NATURAL_CELESTIAL_BODY");
    expect(state.stateDerivationMethod).toBe("KEPLERIAN_EPHEMERIS");
    expect(state.distanceFromSunAu).toBeCloseTo(5.2, 0.5);
  });

  it("provides transparent scientific state explanation with inputs and assumptions", () => {
    const explanation = TemporalStateEngine.explainState("voyager-1", new Date());

    expect(explanation.targetId).toBe("voyager-1");
    expect(explanation.method).toBeDefined();
    expect(explanation.inputs).toBeDefined();
    expect(explanation.sources.length).toBeGreaterThan(0);
    expect(explanation.assumptions.length).toBeGreaterThan(0);
    expect(explanation.uncertaintyDescription).toBeDefined();
  });
});
