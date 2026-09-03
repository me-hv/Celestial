import { TemporalEvent } from "./types";
import { MissionEvent, ScientificDiscovery, SpaceMission } from "../mission/types";
import { AstronomicalEvent } from "../astronomical-event/types";
import { CosmicEpoch } from "../cosmic-time/types";
import { ScientificDataset } from "../data-provider/types";

export class EventNormalizer {
  /**
   * Normalizes a MissionEvent into a TemporalEvent reference
   */
  public static fromMissionEvent(event: MissionEvent, mission?: SpaceMission): TemporalEvent {
    const targetIds: string[] = [];
    if (event.targetId) targetIds.push(event.targetId);
    if (mission?.primaryTargetId && !targetIds.includes(mission.primaryTargetId)) {
      targetIds.push(mission.primaryTargetId);
    }
    if (mission?.secondaryTargetIds) {
      for (const t of mission.secondaryTargetIds) {
        if (!targetIds.includes(t)) targetIds.push(t);
      }
    }

    const citation = event.provenance?.citationUrl || "https://nasa.gov";

    return {
      id: `te-me-${event.id}`,
      slug: `mission-event-${event.id}`,
      title: event.title,
      description: event.description,
      domain: "SPACE_MISSIONS",
      eventType: event.eventType as TemporalEvent["eventType"],
      startTime: event.timestamp,
      timePrecision: event.timestamp.includes("T") ? "EXACT" : "DAY",
      temporalStatus: new Date(event.timestamp) > new Date() ? "SCHEDULED" : "PAST",
      missionIds: [event.missionId],
      targetIds: targetIds.length > 0 ? targetIds : undefined,
      targetNames: event.targetName ? [event.targetName] : undefined,
      organizationIds: mission?.agency ? [mission.agency] : [],
      sourceReferences: [citation],
      epistemicStatus: "OBSERVED",
      confidenceScore: event.provenance?.confidenceScore || 0.999,
      provenance: event.provenance || {
        authoritativeBody: "NASA",
        catalogName: "CELESTIAL Mission Archives",
        citationUrl: citation,
        confidenceScore: 0.999,
        recordIdentifier: `ME-${event.id}`,
        retrievedAt: new Date().toISOString(),
      },
      scientificSignificance: event.scientificSignificance,
      tags: ["mission", event.eventType.toLowerCase()],
    };
  }

  /**
   * Normalizes an AstronomicalEvent into a TemporalEvent reference
   */
  public static fromAstronomicalEvent(event: AstronomicalEvent): TemporalEvent {
    const citation = event.provenance?.citationUrl || "https://iau.org";
    return {
      id: `te-ae-${event.id}`,
      slug: `astro-event-${event.slug}`,
      title: event.title,
      description: event.description,
      domain: "ASTRONOMY",
      eventType: "ASTRONOMICAL_EVENT",
      startTime: event.eventDate,
      timePrecision: event.peakTime ? "EXACT" : "DAY",
      temporalStatus: new Date(event.eventDate) > new Date() ? "PREDICTED" : "PAST",
      targetIds: event.targetSlugs,
      targetNames: [
        event.primaryTargetName,
        ...(event.secondaryTargetName ? [event.secondaryTargetName] : []),
      ],
      missionIds: event.missionSlug ? [event.missionSlug] : undefined,
      discoveryIds: event.discoverySlug ? [event.discoverySlug] : undefined,
      sourceReferences: [citation],
      epistemicStatus: event.epistemicStatus,
      confidenceScore: event.provenance?.confidenceScore || 0.999,
      provenance: event.provenance || {
        authoritativeBody: "IAU",
        catalogName: "CELESTIAL Astronomical Events",
        citationUrl: citation,
        confidenceScore: 0.999,
        recordIdentifier: `AE-${event.id}`,
        retrievedAt: new Date().toISOString(),
      },
      scientificSignificance: event.scientificSignificance,
      tags: ["astronomy", event.eventType.toLowerCase(), ...event.tags],
    };
  }

  /**
   * Normalizes a ScientificDiscovery into a TemporalEvent reference
   */
  public static fromScientificDiscovery(
    discovery: ScientificDiscovery,
    mission?: SpaceMission
  ): TemporalEvent {
    const citation =
      discovery.citationUrl || discovery.provenance?.citationUrl || "https://iau.org";
    return {
      id: `te-sd-${discovery.id}`,
      slug: `discovery-${discovery.slug}`,
      title: discovery.title,
      description: discovery.description,
      domain: "SCIENCE",
      eventType: "DISCOVERY",
      startTime: discovery.date,
      timePrecision: discovery.date.includes("T") ? "EXACT" : "DAY",
      temporalStatus: "PAST",
      discoveryIds: [discovery.id],
      missionIds: [discovery.missionId],
      targetIds: discovery.targetId ? [discovery.targetId] : undefined,
      targetNames: discovery.targetName ? [discovery.targetName] : undefined,
      organizationIds: mission?.agency ? [mission.agency] : [],
      sourceReferences: [citation],
      epistemicStatus: discovery.epistemicStatus,
      confidenceScore: discovery.provenance?.confidenceScore || 0.999,
      provenance: discovery.provenance || {
        authoritativeBody: "IAU",
        catalogName: "CELESTIAL Discoveries Archive",
        citationUrl: citation,
        confidenceScore: 0.999,
        recordIdentifier: `SD-${discovery.id}`,
        retrievedAt: new Date().toISOString(),
      },
      scientificSignificance: discovery.scientificSignificance,
      tags: ["science", "discovery", discovery.discoveryType.toLowerCase()],
    };
  }

  /**
   * Normalizes a CosmicEpoch into a TemporalEvent reference
   */
  public static fromCosmicEpoch(epoch: CosmicEpoch): TemporalEvent {
    const citation = epoch.provenance?.citationUrl || "https://iau.org";
    return {
      id: `te-ce-${epoch.id}`,
      slug: `epoch-${epoch.slug}`,
      title: epoch.name,
      description: epoch.description,
      domain: "COSMOS",
      eventType: "COSMIC_EPOCH",
      startTime: epoch.ageRange.minDisplay,
      endTime: epoch.ageRange.maxDisplay,
      timePrecision: "COSMOLOGICAL",
      temporalStatus: "PAST",
      cosmologicalRedshift: epoch.redshiftRange?.minZ,
      lookbackTimeGyr: epoch.lookbackTimeRangeGyr.maxGyr,
      sourceReferences: [citation],
      epistemicStatus:
        epoch.observationStatus === "THEORETICAL"
          ? "MODEL_DERIVED"
          : (epoch.observationStatus as TemporalEvent["epistemicStatus"]),
      confidenceScore: epoch.provenance?.confidenceScore || 0.99,
      provenance: epoch.provenance || {
        authoritativeBody: "IAU",
        catalogName: "CELESTIAL Cosmic Epochs",
        citationUrl: citation,
        confidenceScore: 0.99,
        recordIdentifier: `CE-${epoch.id}`,
        retrievedAt: new Date().toISOString(),
      },
      scientificSignificance: epoch.physicalProcesses.map((p) => p.title).join("; "),
      tags: ["cosmos", "epoch", epoch.category.toLowerCase()],
    };
  }

  /**
   * Normalizes a ScientificDataset into a TemporalEvent reference
   */
  public static fromDataset(dataset: ScientificDataset): TemporalEvent {
    const citation = dataset.provenance?.citationUrl || "https://iau.org";
    return {
      id: `te-ds-${dataset.id}`,
      slug: `dataset-${dataset.slug}`,
      title: `Dataset: ${dataset.title}`,
      description: dataset.description,
      domain: "DATA",
      eventType: "DATA_RELEASE",
      startTime: dataset.provenance?.retrievedAt || new Date().toISOString(),
      timePrecision: "DAY",
      temporalStatus: "PAST",
      datasetIds: [dataset.id],
      targetIds: dataset.targetSlugs,
      missionIds: dataset.missionSlug ? [dataset.missionSlug] : undefined,
      organizationIds: [dataset.organizationId],
      sourceReferences: [citation],
      epistemicStatus: "OBSERVED",
      confidenceScore: dataset.provenance?.confidenceScore || 0.999,
      provenance: dataset.provenance || {
        authoritativeBody: "IAU",
        catalogName: "CELESTIAL Scientific Datasets",
        citationUrl: citation,
        confidenceScore: 0.999,
        recordIdentifier: `DS-${dataset.id}`,
        retrievedAt: new Date().toISOString(),
      },
      scientificSignificance: `Discipline: ${dataset.discipline.replace(/_/g, " ")}. Wavelength: ${dataset.wavelengthBand}.`,
      tags: ["dataset", dataset.discipline.toLowerCase(), dataset.dataType.toLowerCase()],
    };
  }
}
