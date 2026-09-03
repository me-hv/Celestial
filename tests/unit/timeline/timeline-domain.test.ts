import { describe, it, expect } from "vitest";
import { TemporalEventSchema, TemporalConflictSchema } from "@/domain/timeline/schema";
import { TemporalEvent, TemporalConflict } from "@/domain/timeline/types";

describe("Temporal Domain Models & Schemas", () => {
  it("validates compliant TemporalEvent schema with exact precision", () => {
    const validEvent: TemporalEvent = {
      id: "te-test-01",
      slug: "test-event-01",
      title: "Test Astrophysical Milestone",
      description: "A test event with complete epistemic provenance.",
      domain: "ASTRONOMY",
      eventType: "ASTRONOMICAL_EVENT",
      startTime: "2024-05-10T16:00:00Z",
      timePrecision: "EXACT",
      temporalStatus: "PAST",
      targetIds: ["earth", "sun"],
      sourceReferences: ["https://swpc.noaa.gov"],
      epistemicStatus: "OBSERVED",
      confidenceScore: 0.99,
      provenance: {
        authoritativeBody: "NOAA",
        catalogName: "SWPC Event Registry",
        citationUrl: "https://swpc.noaa.gov",
        confidenceScore: 0.99,
        recordIdentifier: "TEST-01",
        retrievedAt: "2026-09-03T00:00:00Z",
      },
      tags: ["astronomy", "solar"],
    };

    const parsed = TemporalEventSchema.safeParse(validEvent);
    expect(parsed.success).toBe(true);
  });

  it("validates non-exact precision (YEAR / APPROXIMATE / COSMOLOGICAL) without manufactured dates", () => {
    const deepTimeEvent: TemporalEvent = {
      id: "te-test-02",
      slug: "test-deep-time",
      title: "Solar System Formation",
      description: "Nebular accretion epoch.",
      domain: "ASTRONOMY",
      eventType: "SCIENTIFIC_MILESTONE",
      startTime: "~4.567 Billion Years Ago",
      timePrecision: "APPROXIMATE",
      temporalStatus: "PAST",
      sourceReferences: ["Allende meteorite radiometric dating"],
      epistemicStatus: "INFERRED",
      confidenceScore: 0.98,
      provenance: {
        authoritativeBody: "IAU",
        catalogName: "IAU Solar System Chronology",
        citationUrl: "https://iau.org",
        confidenceScore: 0.98,
        recordIdentifier: "TEST-02",
        retrievedAt: "2026-09-03T00:00:00Z",
      },
      tags: ["solar-system", "accretion"],
    };

    const parsed = TemporalEventSchema.safeParse(deepTimeEvent);
    expect(parsed.success).toBe(true);
  });

  it("validates TemporalConflict schema for conflicting authoritative claims", () => {
    const conflict: TemporalConflict = {
      id: "tc-01",
      claimA: "Encounter time 12:05:00 UTC",
      sourceA: "NASA PDS Summary",
      claimB: "Encounter time 12:04:30 UTC",
      sourceB: "JPL Trajectory Reconstruction",
      differenceDescription: "30-second timing offset between Doppler telemetry and optical navigation solution.",
      resolutionStatus: "RESOLVED",
      resolutionRationale: "Optical navigation solution updated in 1985 post-flight analysis.",
    };

    const parsed = TemporalConflictSchema.safeParse(conflict);
    expect(parsed.success).toBe(true);
  });
});
