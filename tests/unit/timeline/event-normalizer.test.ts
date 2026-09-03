import { describe, it, expect } from "vitest";
import { EventNormalizer } from "@/domain/timeline/event-normalizer";
import { MissionEvent } from "@/domain/mission/types";
import { AstronomicalEvent } from "@/domain/astronomical-event/types";

describe("Event Normalizer (Zero Data Duplication Adapter)", () => {
  it("normalizes a MissionEvent into a TemporalEvent reference", () => {
    const me: MissionEvent = {
      id: "me-test-01",
      timestamp: "2023-08-23T12:33:00Z",
      eventType: "LANDING",
      title: "Lunar Landing",
      description: "Soft landing achieved.",
      missionId: "chandrayaan-3",
      targetId: "moon",
      targetName: "Moon",
      scientificSignificance: "Polar landing.",
      provenance: {
        authoritativeBody: "ISRO",
        catalogName: "ISRO Mission Archive",
        citationUrl: "https://isro.gov.in",
        confidenceScore: 0.999,
        recordIdentifier: "ISRO-CH3",
        retrievedAt: "2026-09-03T00:00:00Z",
      },
    };

    const norm = EventNormalizer.fromMissionEvent(me);
    expect(norm.id).toBe("te-me-me-test-01");
    expect(norm.domain).toBe("SPACE_MISSIONS");
    expect(norm.eventType).toBe("LANDING");
    expect(norm.timePrecision).toBe("EXACT");
    expect(norm.missionIds).toContain("chandrayaan-3");
    expect(norm.epistemicStatus).toBe("OBSERVED");
  });

  it("normalizes an AstronomicalEvent into a TemporalEvent reference", () => {
    const ae: AstronomicalEvent = {
      id: "ae-test-01",
      slug: "perseids-meteor-shower",
      title: "Perseids Meteor Shower Peak",
      eventType: "METEOR_SHOWER",
      description: "Annual meteor shower.",
      eventDate: "2030-08-12",
      targetSlugs: ["swift-tuttle"],
      primaryTargetName: "109P/Swift-Tuttle",
      visibilityDescription: "Visible in Northern Hemisphere",
      nakedEyeVisible: true,
      recommendedOptics: "NAKED_EYE",
      scientificSignificance: "Cometary debris stream entry.",
      epistemicStatus: "MODEL_DERIVED",
      provenance: {
        authoritativeBody: "IAU",
        catalogName: "IAU Meteor Data Center",
        citationUrl: "https://www.ta3.sk/IAUC22DB/MDC2007/",
        confidenceScore: 0.99,
        recordIdentifier: "MDC-PER",
        retrievedAt: "2026-09-03T00:00:00Z",
      },
      tags: ["meteors", "perseids"],
    };

    const norm = EventNormalizer.fromAstronomicalEvent(ae);
    expect(norm.domain).toBe("ASTRONOMY");
    expect(norm.eventType).toBe("ASTRONOMICAL_EVENT");
    expect(norm.timePrecision).toBe("DAY");
    expect(norm.temporalStatus).toBe("PREDICTED");
  });
});
