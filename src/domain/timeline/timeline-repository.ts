import { TemporalEvent, TemporalRelation, TemporalQueryOptions } from "./types";
import { BASELINE_TEMPORAL_EVENTS, BASELINE_TEMPORAL_RELATIONS } from "./timeline-data";
import { missionRepo } from "@/lib/data/mission-repository";
import { astronomicalEventRepo } from "@/lib/data/astronomical-event-repository";
import { cosmicEpochRepo } from "@/lib/data/cosmic-epoch-repository";
import { datasetRepo } from "@/lib/data/dataset-repository";
import { EventNormalizer } from "./event-normalizer";

export class TimelineRepository {
  private readonly eventsById: Map<string, TemporalEvent> = new Map();
  private readonly eventsBySlug: Map<string, TemporalEvent> = new Map();
  private readonly relations: TemporalRelation[] = [];

  // Secondary Indexes for rapid querying
  private readonly targetIndex: Map<string, Set<string>> = new Map();
  private readonly missionIndex: Map<string, Set<string>> = new Map();
  private readonly organizationIndex: Map<string, Set<string>> = new Map();

  constructor() {
    this.populateBaseline();
    this.ingestCrossDomainEntities();
  }

  private populateBaseline(): void {
    for (const ev of BASELINE_TEMPORAL_EVENTS) {
      this.indexEvent(ev);
    }
    for (const rel of BASELINE_TEMPORAL_RELATIONS) {
      this.relations.push(rel);
    }
  }

  /**
   * Ingests and adapts existing CELESTIAL domain entities into the temporal graph without duplicating data
   */
  private ingestCrossDomainEntities(): void {
    // 1. Mission Events & Discoveries
    try {
      const missions = missionRepo.getAll();
      for (const m of missions) {
        const mEvents = missionRepo.getEventsForMission(m.id);
        for (const me of mEvents) {
          this.indexEvent(EventNormalizer.fromMissionEvent(me, m));
        }
        const mDiscoveries = missionRepo.getDiscoveriesForMission(m.id);
        for (const disc of mDiscoveries) {
          this.indexEvent(EventNormalizer.fromScientificDiscovery(disc, m));
        }
      }
    } catch {
      // Mission repo initialization safety
    }

    // 2. Astronomical Events
    try {
      const astroEvents = astronomicalEventRepo.getAll();
      for (const ae of astroEvents) {
        this.indexEvent(EventNormalizer.fromAstronomicalEvent(ae));
      }
    } catch {
      // Astronomical event safety
    }

    // 3. Cosmic Epochs
    try {
      const epochs = cosmicEpochRepo.getAll();
      for (const ep of epochs) {
        this.indexEvent(EventNormalizer.fromCosmicEpoch(ep));
      }
    } catch {
      // Cosmic epoch safety
    }

    // 4. Scientific Datasets
    try {
      const datasets = datasetRepo.getAll();
      for (const ds of datasets) {
        this.indexEvent(EventNormalizer.fromDataset(ds));
      }
    } catch {
      // Dataset repo safety
    }
  }

  private indexEvent(event: TemporalEvent): void {
    this.eventsById.set(event.id, event);
    this.eventsBySlug.set(event.slug, event);

    // Index targets
    if (event.targetIds) {
      for (const t of event.targetIds) {
        if (!this.targetIndex.has(t)) this.targetIndex.set(t, new Set());
        this.targetIndex.get(t)!.add(event.id);
      }
    }

    // Index missions
    if (event.missionIds) {
      for (const m of event.missionIds) {
        if (!this.missionIndex.has(m)) this.missionIndex.set(m, new Set());
        this.missionIndex.get(m)!.add(event.id);
      }
    }

    // Index organizations
    if (event.organizationIds) {
      for (const org of event.organizationIds) {
        if (!this.organizationIndex.has(org)) this.organizationIndex.set(org, new Set());
        this.organizationIndex.get(org)!.add(event.id);
      }
    }
  }

  public getById(id: string): TemporalEvent | undefined {
    return this.eventsById.get(id);
  }

  public getBySlug(slug: string): TemporalEvent | undefined {
    return this.eventsBySlug.get(slug);
  }

  public getAll(): TemporalEvent[] {
    return Array.from(this.eventsById.values()).sort((a, b) => {
      // Chronological sort ascending
      return a.startTime.localeCompare(b.startTime);
    });
  }

  public query(options: TemporalQueryOptions = {}): TemporalEvent[] {
    let result = this.getAll();

    if (options.domain) {
      result = result.filter((e) => e.domain === options.domain);
    }
    if (options.eventType) {
      result = result.filter((e) => e.eventType === options.eventType);
    }
    if (options.targetId) {
      const matchIds = this.targetIndex.get(options.targetId) || new Set();
      result = result.filter((e) => matchIds.has(e.id));
    }
    if (options.missionId) {
      const matchIds = this.missionIndex.get(options.missionId) || new Set();
      result = result.filter((e) => matchIds.has(e.id));
    }
    if (options.organizationId) {
      const matchIds = this.organizationIndex.get(options.organizationId) || new Set();
      result = result.filter((e) => matchIds.has(e.id));
    }
    if (options.epistemicStatus) {
      result = result.filter((e) => e.epistemicStatus === options.epistemicStatus);
    }
    if (options.temporalStatus) {
      result = result.filter((e) => e.temporalStatus === options.temporalStatus);
    }
    if (options.startDate) {
      result = result.filter((e) => e.startTime >= options.startDate!);
    }
    if (options.endDate) {
      result = result.filter((e) => e.startTime <= options.endDate!);
    }
    if (options.searchQuery) {
      const q = options.searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (options.offset !== undefined) {
      result = result.slice(options.offset);
    }
    if (options.limit !== undefined) {
      result = result.slice(0, options.limit);
    }

    return result;
  }

  public getRelationsForEvent(eventId: string): TemporalRelation[] {
    return this.relations.filter((r) => r.sourceEventId === eventId || r.targetEventId === eventId);
  }
}

export const timelineRepo = new TimelineRepository();
