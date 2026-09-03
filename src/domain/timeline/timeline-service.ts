import { timelineRepo } from "./timeline-repository";
import { TemporalEvent, TemporalCluster, TemporalQueryOptions, TemporalScale } from "./types";

export class TimelineService {
  /**
   * Retrieves timeline events for a given target entity (planet, star, mission, etc.)
   */
  public getTargetTimeline(targetId: string): TemporalEvent[] {
    return timelineRepo.query({ targetId });
  }

  /**
   * Retrieves timeline events for a given space mission
   */
  public getMissionTimeline(missionId: string): TemporalEvent[] {
    return timelineRepo.query({ missionId });
  }

  /**
   * Returns aggregated event clusters for coarse chronological views (e.g. decades, centuries, eons)
   */
  public getClusteredTimeline(
    events: TemporalEvent[],
    scale: TemporalScale = "YEARS"
  ): TemporalCluster[] {
    const clusters: Map<string, TemporalEvent[]> = new Map();

    for (const ev of events) {
      let key = "Cosmic / Unspecified";
      if (ev.timePrecision === "COSMOLOGICAL") {
        key = "Early Universe & Primordial Epoch";
      } else if (ev.startTime.startsWith("~")) {
        key = "Deep Time (Pre-Space Age)";
      } else {
        const year = parseInt(ev.startTime.slice(0, 4), 10);
        if (!isNaN(year)) {
          if (scale === "DECADES") {
            const decade = Math.floor(year / 10) * 10;
            key = `${decade}s CE`;
          } else if (scale === "CENTURIES") {
            const century = Math.floor(year / 100) + 1;
            key = `${century}th Century CE`;
          } else {
            key = `${year} CE`;
          }
        }
      }

      if (!clusters.has(key)) {
        clusters.set(key, []);
      }
      clusters.get(key)!.push(ev);
    }

    return Array.from(clusters.entries()).map(([label, clusterEvents], idx) => ({
      clusterId: `cluster-${idx}-${label.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      timeLabel: label,
      startDate: clusterEvents[0].startTime,
      endDate:
        clusterEvents[clusterEvents.length - 1].endTime ||
        clusterEvents[clusterEvents.length - 1].startTime,
      eventsCount: clusterEvents.length,
      primaryDomain: clusterEvents[0].domain,
      sampleTitles: clusterEvents.slice(0, 3).map((e) => e.title),
    }));
  }

  public queryEvents(options: TemporalQueryOptions): {
    total: number;
    events: TemporalEvent[];
  } {
    const all = timelineRepo.query({ ...options, limit: undefined, offset: undefined });
    const paginated = timelineRepo.query(options);
    return {
      total: all.length,
      events: paginated,
    };
  }
}

export const timelineService = new TimelineService();
