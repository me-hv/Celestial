import { EpistemicStatus } from "../mission/types";
import { ProvenanceRecord } from "../provenance/types";

export type TemporalPrecision =
  | "EXACT" // Exact timestamp to second/minute (e.g. 2023-08-23T12:33:00Z)
  | "DAY" // Calendar date without exact second (e.g. 1969-07-20)
  | "MONTH" // Month and year (e.g. 1977-09)
  | "YEAR" // Year only (e.g. 1990)
  | "APPROXIMATE" // Estimated epoch (e.g. ~4.5 billion years ago)
  | "INTERVAL" // Spanning duration (e.g. 1977-present)
  | "COSMOLOGICAL" // Redshift / lookback time / scale factor regime
  | "UNKNOWN";

export type TemporalStatus =
  "PAST" | "ONGOING" | "UPCOMING" | "PREDICTED" | "SCHEDULED" | "UNKNOWN";

export type TemporalEventType =
  | "ASTRONOMICAL_EVENT"
  | "MISSION_EVENT"
  | "LAUNCH"
  | "ARRIVAL"
  | "FLYBY"
  | "ORBIT_INSERTION"
  | "LANDING"
  | "SAMPLE_RETURN"
  | "OBSERVATION"
  | "DISCOVERY"
  | "DATA_RELEASE"
  | "INSTRUMENT_ACTIVATION"
  | "SOLAR_EVENT"
  | "SPACE_WEATHER_EVENT"
  | "SCIENTIFIC_MILESTONE"
  | "ORGANIZATION_EVENT"
  | "COSMIC_EPOCH"
  | "CUSTOM";

export type TemporalDomain =
  "COSMOS" | "ASTRONOMY" | "SPACE_MISSIONS" | "SCIENCE" | "SPACE_WEATHER" | "OBSERVATIONS" | "DATA";

export type TemporalRelationType =
  | "BEFORE"
  | "AFTER"
  | "DURING"
  | "OVERLAPS"
  | "STARTS"
  | "ENDS"
  | "CONCURRENT_WITH"
  | "CAUSED_BY"
  | "RESULTED_IN"
  | "FOLLOWED_BY"
  | "PRECEDED_BY"
  | "OBSERVED_DURING"
  | "DISCOVERED_DURING"
  | "DATA_RELEASED_DURING"
  | "MISSION_ACTIVE_DURING"
  | "VISIBLE_DURING";

export interface TemporalConflict {
  id: string;
  claimA: string;
  sourceA: string;
  claimB: string;
  sourceB: string;
  differenceDescription: string;
  resolutionStatus: "RESOLVED" | "UNRESOLVED" | "CONTEXT_DEPENDENT";
  resolutionRationale?: string;
}

export interface TemporalEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  domain: TemporalDomain;
  eventType: TemporalEventType;
  startTime: string; // ISO 8601 or cosmic age string
  endTime?: string; // ISO 8601 or cosmic age string
  timePrecision: TemporalPrecision;
  temporalStatus: TemporalStatus;

  // Relational entity references (Zero-duplication)
  targetIds?: string[];
  targetNames?: string[];
  missionIds?: string[];
  organizationIds?: string[];
  datasetIds?: string[];
  discoveryIds?: string[];
  observationIds?: string[];
  sourceReferences: string[];

  // Epistemic classification & Provenance
  epistemicStatus: EpistemicStatus;
  confidenceScore: number; // 0 to 1
  provenance: ProvenanceRecord;
  conflicts?: TemporalConflict[];

  // Scientific Metadata
  scientificSignificance?: string;
  cosmologicalRedshift?: number;
  cosmologicalScaleFactor?: number;
  lookbackTimeGyr?: number;
  tags: string[];
}

export interface TemporalRelation {
  id: string;
  sourceEventId: string;
  targetEventId: string;
  relationType: TemporalRelationType;
  description?: string;
  confidenceScore: number;
  epistemicStatus: EpistemicStatus;
  provenance: ProvenanceRecord;
}

export interface TemporalState {
  targetId: string;
  targetName: string;
  timestamp: string; // ISO 8601
  timePrecision: TemporalPrecision;

  // Physical / Orbital Parameters
  distanceFromSunAu?: number;
  distanceFromEarthKm?: number;
  heliocentricVelocityKmS?: number;
  apparentMagnitudeV?: number;
  phaseAngleDeg?: number;
  lightTimeMinutes?: number;

  // Operational Status
  operationalStatus: string;
  missionPhase?: string;
  communicationState?: string;
  activeInstruments?: string[];

  // Environmental Conditions
  spaceWeatherCondition?: {
    kpIndex: number;
    solarWindSpeedKmS: number;
    imfBzNanotesla: number;
  };

  // Epistemic Status & Provenance
  epistemicStatus: EpistemicStatus;
  stateDerivationMethod:
    | "DIRECT_OBSERVATION"
    | "HISTORICAL_RECORD_RECONSTRUCTION"
    | "KEPLERIAN_EPHEMERIS"
    | "ASTRODYNAMIC_PROPAGATION"
    | "MODEL_ESTIMATE";
  confidenceScore: number;
  provenance: ProvenanceRecord;
}

export interface TemporalStateExplanation {
  targetId: string;
  timestamp: string;
  method: string;
  inputs: Record<string, unknown>;
  sources: string[];
  assumptions: string[];
  uncertaintyDescription: string;
  epistemicStatus: EpistemicStatus;
  generatedAt: string;
}

export interface StateDiffResult {
  targetId: string;
  timestampA: string;
  timestampB: string;
  timeDeltaDays: number;
  distanceDeltaAu?: number;
  velocityDeltaKmS?: number;
  statusChanged: boolean;
  previousStatus?: string;
  currentStatus?: string;
  phaseChanged: boolean;
  previousPhase?: string;
  currentPhase?: string;
  scientificSummary: string;
}

export interface TemporalQueryOptions {
  domain?: TemporalDomain;
  eventType?: TemporalEventType;
  targetId?: string;
  missionId?: string;
  organizationId?: string;
  epistemicStatus?: EpistemicStatus;
  temporalStatus?: TemporalStatus;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
  limit?: number;
  offset?: number;
}

export interface TemporalCluster {
  clusterId: string;
  timeLabel: string;
  startDate: string;
  endDate: string;
  eventsCount: number;
  primaryDomain: TemporalDomain;
  sampleTitles: string[];
}

export type TemporalScale =
  | "MINUTES"
  | "HOURS"
  | "DAYS"
  | "MONTHS"
  | "YEARS"
  | "DECADES"
  | "CENTURIES"
  | "MILLENNIA"
  | "MILLIONS_OF_YEARS"
  | "BILLIONS_OF_YEARS";
