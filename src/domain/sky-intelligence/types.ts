import { ObserverLocation } from "../observer/types";
import { EpistemicStatus } from "../mission/types";
import { ProvenanceRecord } from "../provenance/types";

export type SkyTwilightPhase =
  "DAYLIGHT" | "CIVIL_TWILIGHT" | "NAUTICAL_TWILIGHT" | "ASTRONOMICAL_TWILIGHT" | "TRUE_NIGHT";

export type TargetObservationQuality = "BEST" | "GOOD" | "FAIR" | "POOR" | "NOT_VISIBLE";

export interface TargetObservationRecommendation {
  targetSlug: string;
  name: string;
  domain: "SOLAR_SYSTEM" | "STELLAR" | "DEEP_SKY" | "GALACTIC";
  category: string;
  apparentMagnitudeV?: number;
  altitudeDeg: number;
  azimuthDeg: number;
  airmass: number;
  altitudeTrend: "RISING" | "CULMINATING" | "SETTING";
  quality: TargetObservationQuality;
  score: number; // 0 to 100
  bestObservationTime?: string;
  reason: string;
  limitations: string[];
  epistemicStatus: EpistemicStatus;
  provenance: ProvenanceRecord;
}

export interface CurrentSkySummary {
  observer: ObserverLocation;
  timestamp: string; // ISO 8601
  julianDate: number;
  sunAltitudeDeg: number;
  sunState: "ABOVE_HORIZON" | "SETTING" | "BELOW_HORIZON" | "RISING";
  twilightPhase: SkyTwilightPhase;
  skyDarknessScore: number; // 0 (bright daylight) to 100 (pristine dark sky)
  moonPhaseName: string;
  moonIlluminationFraction: number;
  moonAltitudeDeg: number;
  moonInterferenceRating: "NONE" | "LOW" | "MODERATE" | "HIGH" | "DOMINANT";
  visiblePlanetsCount: number;
  visibleBrightStarsCount: number;
  visibleDeepSkyCount: number;
  topTargetsRightNow: TargetObservationRecommendation[];
  spaceWeatherImpactSummary?: string;
  epistemicStatus: EpistemicStatus;
  provenance: ProvenanceRecord;
}
