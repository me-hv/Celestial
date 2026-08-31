import { ObserverLocation } from "@/domain/observer/types";
import { skyObjectRepo } from "@/lib/data/sky-object-repository";

export interface ObservationPlannerQuery {
  location: ObserverLocation;
  date?: Date;
  minAltitudeDeg?: number;
  maxMagnitudeV?: number;
  targetTypes?: string[];
  constellation?: string;
}

export type RecommendedEquipment =
  "NAKED_EYE" | "BINOCULARS" | "SMALL_TELESCOPE" | "LARGE_TELESCOPE";

export interface PlannedObservationTarget {
  objectId: string;
  objectSlug: string;
  canonicalName: string;
  standardDesignation?: string;
  category: string;
  type: string;
  constellation: string;
  apparentMagnitudeV?: number;
  currentAltitudeDeg: number;
  currentAzimuthDeg: number;
  transitAltitudeDeg: number;
  transitTime: Date | null;
  riseTime: Date | null;
  setTime: Date | null;
  recommendedEquipment: RecommendedEquipment;
  observingScore: number; // 0 to 100
  summaryNotes: string;
}

export interface ObservationPlanResult {
  location: ObserverLocation;
  planDate: Date;
  totalVisibleTargets: number;
  targets: PlannedObservationTarget[];
}

/**
 * Plans tonight's optimal astronomical observation session based on observer constraints
 */
export function generateObservationPlan(query: ObservationPlannerQuery): ObservationPlanResult {
  const {
    location,
    date = new Date(),
    minAltitudeDeg = 15.0,
    maxMagnitudeV = 8.5,
    targetTypes = [],
    constellation,
  } = query;

  // Retrieve observable objects for the location and date
  const objects = skyObjectRepo.getVisibleSkyObjects(location, date, {
    maxMagnitudeV,
    categories: targetTypes.length > 0 ? targetTypes : undefined,
    constellationIauCode: constellation,
  });

  const targets: PlannedObservationTarget[] = [];

  for (const obs of objects) {
    const transitAlt = obs.riseTransitSet.transitAltitudeDeg;

    // Must reach at least the minimum altitude threshold during the night
    if (transitAlt < minAltitudeDeg) {
      continue;
    }

    const mag = obs.apparentMagnitudeV ?? 6.0;
    const equipment = determineRecommendedEquipment(mag, obs.type);
    const score = calculateObservingScore(transitAlt, mag, obs.type);

    let notes = "";
    if (obs.type === "PLANET") {
      notes = `High planetary contrast with transit altitude of ${transitAlt.toFixed(1)}°`;
    } else if (obs.type === "GALAXY") {
      notes = "Extended deep-sky spiral structure best observed during true astronomical darkness";
    } else if (obs.type === "NEBULA") {
      notes = "Emission/dark nebula features benefit from O-III or UHC narrowband filters";
    } else {
      notes = `Bright stellar anchor in ${obs.constellation}`;
    }

    targets.push({
      objectId: obs.objectId,
      objectSlug: obs.objectSlug,
      canonicalName: obs.canonicalName,
      standardDesignation: obs.standardDesignation,
      category: obs.category,
      type: obs.type,
      constellation: obs.constellation,
      apparentMagnitudeV: obs.apparentMagnitudeV,
      currentAltitudeDeg: obs.horizontal.apparentAltitudeDeg,
      currentAzimuthDeg: obs.horizontal.azimuthDeg,
      transitAltitudeDeg: Number(transitAlt.toFixed(1)),
      transitTime: obs.riseTransitSet.transitDate,
      riseTime: obs.riseTransitSet.riseDate,
      setTime: obs.riseTransitSet.setDate,
      recommendedEquipment: equipment,
      observingScore: score,
      summaryNotes: notes,
    });
  }

  // Sort targets by observing score descending
  targets.sort((a, b) => b.observingScore - a.observingScore);

  return {
    location,
    planDate: date,
    totalVisibleTargets: targets.length,
    targets,
  };
}

function determineRecommendedEquipment(magnitudeV: number, type: string): RecommendedEquipment {
  if (magnitudeV <= 4.5 && type !== "GALAXY") {
    return "NAKED_EYE";
  }
  if (magnitudeV <= 7.0) {
    return "BINOCULARS";
  }
  if (magnitudeV <= 10.5) {
    return "SMALL_TELESCOPE";
  }
  return "LARGE_TELESCOPE";
}

function calculateObservingScore(
  transitAltitudeDeg: number,
  magnitudeV: number,
  type: string
): number {
  // Altitude factor: Higher culmination gives superior seeing (0 to 50 pts)
  const altScore = Math.min(50, Math.max(0, (transitAltitudeDeg / 90.0) * 50.0));

  // Brightness factor: Lower magnitude is easier to spot (0 to 40 pts)
  const brightnessScore = Math.min(40, Math.max(0, (12.0 - magnitudeV) * 3.33));

  // Type bonus (10 pts for planets & major deep sky)
  const typeBonus = type === "PLANET" || type === "MOON" ? 10 : 5;

  return Math.min(100, Math.round(altScore + brightnessScore + typeBonus));
}
