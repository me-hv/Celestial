import { EpistemicStatus } from "../mission/types";
import { ProvenanceRecord } from "../provenance/types";

export interface CrossDomainIntelligenceResult {
  id: string;
  topic:
    | "SPACE_WEATHER_EARTH_COUPLING"
    | "MISSION_TARGET_EXPLORATION"
    | "OBSERVATION_QUALITY_ASSESSMENT"
    | "SOLAR_ACTIVITY_FORECAST";
  statement: string;
  basis: string;
  inputs: Record<string, unknown>;
  epistemicStatus: EpistemicStatus;
  confidenceScore: number;
  generatedAt: string; // ISO 8601
  sourceReferences: string[];
  limitations: string[];
  provenance: ProvenanceRecord;
}

export interface UnifiedScientificSnapshot {
  timestamp: string;
  solarActivitySummary: string;
  geomagneticStormScale: string;
  activeDeepSpaceMissionsCount: number;
  topObservableTargetsCount: number;
  spaceWeatherAlertsActive: number;
  intelligenceInsights: CrossDomainIntelligenceResult[];
  epistemicStatus: EpistemicStatus;
  provenance: ProvenanceRecord;
}
