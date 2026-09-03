import { AstronomicalEvent } from "./types";
import { ObserverLocation } from "../observer/types";
import {
  equatorialToHorizontal,
  calculateLocalMeanSiderealTimeHours,
} from "@/lib/astronomy/coordinates/horizontal";
import { getJulianDate } from "@/lib/astronomy/time/astronomical-time";
import { TargetIntelligenceEngine } from "@/lib/astronomy/research/target-intelligence-engine";

export interface ObserverEventEvaluation {
  event: AstronomicalEvent;
  observer: ObserverLocation;
  isLocallyVisible: boolean;
  peakAltitudeDeg?: number;
  localTransitTime?: string;
  recommendedOptics: AstronomicalEvent["recommendedOptics"];
  observationQuality: "EXCELLENT" | "GOOD" | "CHALLENGING" | "BELOW_HORIZON";
  summary: string;
  scientificNotes: string;
}

export class AstronomicalEventIntelligence {
  /**
   * Calculates observer-specific local visibility metrics for a landmark astronomical event
   */
  public static evaluateEventForObserver(
    event: AstronomicalEvent,
    observer: ObserverLocation,
    date = new Date(event.eventDate)
  ): ObserverEventEvaluation {
    const jd = getJulianDate(date);
    const lmst = calculateLocalMeanSiderealTimeHours(jd, observer.longitudeDeg);

    // 1. Resolve primary target coordinates if available
    let peakAlt: number | undefined = undefined;
    if (event.targetSlugs && event.targetSlugs.length > 0) {
      const targetRef = TargetIntelligenceEngine.resolveTarget(event.targetSlugs[0]);
      if (targetRef?.equatorialCoordinates) {
        const hor = equatorialToHorizontal(
          targetRef.equatorialCoordinates.raDeg,
          targetRef.equatorialCoordinates.decDeg,
          observer.latitudeDeg,
          lmst
        );
        peakAlt = Number(hor.apparentAltitudeDeg.toFixed(1));
      }
    }

    // 2. Latitude Range check if specified
    let withinLatRange = true;
    if (event.observerLatitudeRange) {
      const lat = observer.latitudeDeg;
      withinLatRange =
        lat >= event.observerLatitudeRange.minLatDeg &&
        lat <= event.observerLatitudeRange.maxLatDeg;
    }

    // 3. Compute Local Observation Quality
    let isLocallyVisible = withinLatRange;
    let quality: ObserverEventEvaluation["observationQuality"] = "GOOD";

    if (peakAlt !== undefined) {
      if (peakAlt <= 0) {
        isLocallyVisible = false;
        quality = "BELOW_HORIZON";
      } else if (peakAlt < 15.0) {
        quality = "CHALLENGING";
      } else if (peakAlt > 35.0 && withinLatRange) {
        quality = "EXCELLENT";
      }
    }

    let summary = `Event is visible from latitude ${observer.latitudeDeg.toFixed(1)}°.`;
    if (!isLocallyVisible) {
      summary = `Target is below local horizon or outside optimal latitude band (${event.observerLatitudeRange?.optimalRegion || "optimal zone"}).`;
    } else if (quality === "EXCELLENT") {
      summary = `Superb observing geometry (Peak Altitude: ${peakAlt ?? "high"}°).`;
    }

    return {
      event,
      observer,
      isLocallyVisible,
      peakAltitudeDeg: peakAlt,
      recommendedOptics: event.recommendedOptics,
      observationQuality: quality,
      summary,
      scientificNotes: event.scientificSignificance,
    };
  }
}
