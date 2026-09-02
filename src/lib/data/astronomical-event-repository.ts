import { AstronomicalEvent, AstronomicalEventType } from "@/domain/astronomical-event/types";
import { ObserverLocation } from "@/domain/observer/types";
import { ASTRONOMICAL_EVENTS } from "./astronomical-event-data";

export interface AstronomicalEventFilterOptions {
  eventType?: AstronomicalEventType;
  targetSlug?: string;
  nakedEyeOnly?: boolean;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

export class AstronomicalEventRepository {
  private readonly events: Map<string, AstronomicalEvent> = new Map();

  constructor(initialEvents: AstronomicalEvent[] = ASTRONOMICAL_EVENTS) {
    initialEvents.forEach((evt) => {
      this.events.set(evt.id, evt);
      this.events.set(evt.slug, evt);
    });
  }

  public getAll(): AstronomicalEvent[] {
    const uniqueMap = new Map<string, AstronomicalEvent>();
    this.events.forEach((evt) => uniqueMap.set(evt.id, evt));
    return Array.from(uniqueMap.values()).sort(
      (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
    );
  }

  public getById(id: string): AstronomicalEvent | undefined {
    return this.events.get(id);
  }

  public getBySlug(slug: string): AstronomicalEvent | undefined {
    return this.events.get(slug);
  }

  public getByTarget(targetSlug: string): AstronomicalEvent[] {
    const slug = targetSlug.toLowerCase();
    return this.getAll().filter((evt) =>
      evt.targetSlugs.some((t) => t.toLowerCase() === slug || t.toLowerCase().includes(slug))
    );
  }

  public getByType(type: AstronomicalEventType): AstronomicalEvent[] {
    return this.getAll().filter((evt) => evt.eventType === type);
  }

  public getUpcoming(fromDate: Date = new Date(), limit = 10): AstronomicalEvent[] {
    const fromTime = fromDate.getTime();
    return this.getAll()
      .filter((evt) => new Date(evt.eventDate).getTime() >= fromTime)
      .slice(0, limit);
  }

  public getForObserver(
    location: ObserverLocation,
    fromDate: Date = new Date()
  ): AstronomicalEvent[] {
    return this.getUpcoming(fromDate, 20).filter((evt) => {
      if (!evt.observerLatitudeRange) return true;
      const { minLatDeg, maxLatDeg } = evt.observerLatitudeRange;
      return location.latitudeDeg >= minLatDeg && location.latitudeDeg <= maxLatDeg;
    });
  }

  public filter(options: AstronomicalEventFilterOptions): AstronomicalEvent[] {
    return this.getAll().filter((evt) => {
      if (options.eventType && evt.eventType !== options.eventType) {
        return false;
      }
      if (
        options.targetSlug &&
        !evt.targetSlugs.some((t) => t.toLowerCase() === options.targetSlug?.toLowerCase())
      ) {
        return false;
      }
      if (options.nakedEyeOnly && !evt.nakedEyeVisible) {
        return false;
      }
      if (options.startDate) {
        if (new Date(evt.eventDate).getTime() < options.startDate.getTime()) {
          return false;
        }
      }
      if (options.endDate) {
        if (new Date(evt.eventDate).getTime() > options.endDate.getTime()) {
          return false;
        }
      }
      if (options.search && options.search.trim()) {
        const q = options.search.toLowerCase();
        const matchesTitle = evt.title.toLowerCase().includes(q);
        const matchesDesc = evt.description.toLowerCase().includes(q);
        const matchesTarget = evt.primaryTargetName.toLowerCase().includes(q);
        const matchesConstellation = evt.constellation?.toLowerCase().includes(q) || false;
        const matchesTags = evt.tags.some((t) => t.toLowerCase().includes(q));
        if (
          !matchesTitle &&
          !matchesDesc &&
          !matchesTarget &&
          !matchesConstellation &&
          !matchesTags
        ) {
          return false;
        }
      }
      return true;
    });
  }
}

export const astronomicalEventRepo = new AstronomicalEventRepository();
