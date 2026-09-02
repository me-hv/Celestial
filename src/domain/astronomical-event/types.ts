import { EpistemicStatus } from "../mission/types";
import { ProvenanceRecord } from "../provenance/types";

export type AstronomicalEventType =
  | "CONJUNCTION"
  | "OPPOSITION"
  | "OCCULTATION"
  | "SOLAR_ECLIPSE"
  | "LUNAR_ECLIPSE"
  | "METEOR_SHOWER"
  | "PLANETARY_TRANSIT"
  | "LUNAR_PHASE"
  | "COMET_APPROACH"
  | "ASTEROID_CLOSE_APPROACH"
  | "ROCKET_LAUNCH"
  | "SPACECRAFT_ENCOUNTER"
  | "SCIENTIFIC_DISCOVERY";

export interface AstronomicalEvent {
  id: string;
  slug: string;
  title: string;
  eventType: AstronomicalEventType;
  description: string;
  eventDate: string; // ISO 8601 string
  peakTime?: string; // ISO 8601 string
  durationHours?: number;
  targetSlugs: string[];
  primaryTargetName: string;
  secondaryTargetName?: string;
  constellation?: string;
  visibilityDescription: string;
  nakedEyeVisible: boolean;
  recommendedOptics:
    "NAKED_EYE" | "BINOCULARS" | "SMALL_TELESCOPE" | "LARGE_TELESCOPE" | "PROFESSIONAL_OBSERVATORY";
  observerLatitudeRange?: {
    minLatDeg: number;
    maxLatDeg: number;
    optimalRegion: string;
  };
  angularSeparationDeg?: number;
  apparentMagnitudeV?: number;
  lunarIlluminationFraction?: number;
  missionSlug?: string;
  observatorySlug?: string;
  discoverySlug?: string;
  scientificSignificance: string;
  epistemicStatus: EpistemicStatus;
  provenance: ProvenanceRecord;
  tags: string[];
}
