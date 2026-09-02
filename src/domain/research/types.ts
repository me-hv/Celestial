import { ProvenanceRecord } from "../provenance/types";
import { ObserverLocation } from "../observer/types";
import { EpistemicStatus } from "../mission/types";

export type ResearchDomainType =
  | "PLANET"
  | "MOON"
  | "STAR"
  | "EXOPLANET"
  | "STELLAR_SYSTEM"
  | "DEEP_SKY"
  | "GALAXY"
  | "GALACTIC_STRUCTURE"
  | "COSMIC_STRUCTURE"
  | "CMB"
  | "COSMIC_TIME"
  | "OBSERVABLE_UNIVERSE"
  | "MISSION"
  | "SPACECRAFT"
  | "INSTRUMENT"
  | "ORGANIZATION"
  | "DISCOVERY"
  | "OBSERVATORY"
  | "SOLAR_SYSTEM"
  | "STELLAR"
  | "GALACTIC"
  | "COSMIC_WEB";

export interface EquatorialCoordinates {
  raDeg: number;
  decDeg: number;
  rightAscensionHours?: number;
  declinationDegrees?: number;
}

export interface ResearchTargetReference {
  id: string;
  slug: string;
  domain: ResearchDomainType;
  canonicalName: string;
  standardDesignation?: string;
  category: string;
  type: string;
  summary: string;
  equatorialCoordinates?: EquatorialCoordinates;
  distanceLy?: number;
  apparentMagnitudeV?: number;
  constellation?: string;
  badgeColor?: "cyan" | "violet" | "amber" | "emerald" | "default";
}

export type ObservationQuality = "BEST" | "GOOD" | "FAIR" | "POOR" | "NOT_VISIBLE";

export interface ObservationWindow {
  start: string; // ISO string
  end: string; // ISO string
  durationMinutes: number;
  maxAltitudeDeg: number;
  transitTime: string | null; // ISO string
  minAirmass: number;
  twilightState: "DAYLIGHT" | "CIVIL" | "NAUTICAL" | "ASTRONOMICAL" | "NIGHT";
  moonSeparationDeg: number;
  moonIlluminationFraction: number;
  quality: ObservationQuality;
  visibilityScore: number; // 0 to 100 heuristic
  limitingFactors: string[];
}

export interface ObservationConstraint {
  minAltitudeDeg?: number;
  preferredAltitudeDeg?: number;
  maxAirmass?: number;
  maxMoonIllumination?: number;
  minMoonSeparationDeg?: number;
  minSolarElongationDeg?: number;
  twilightRequirement?: "CIVIL" | "NAUTICAL" | "ASTRONOMICAL" | "ANY";
  minDurationMinutes?: number;
  horizonObstructionDeg?: number;
}

export interface ObservingList {
  id: string;
  name: string;
  description: string;
  targetSlugs: string[];
  createdAt: string;
  updatedAt: string;
  observerLocation?: ObserverLocation;
  constraints?: ObservationConstraint;
}

export interface ScientificEvidence {
  id: string;
  claim: string;
  source: string;
  sourceType:
    | "NASA"
    | "ESA"
    | "JPL"
    | "SIMBAD"
    | "GAIA"
    | "EXOPLANET_ARCHIVE"
    | "NED"
    | "PEER_REVIEWED_PAPER"
    | "MISSION_ARCHIVE"
    | "CALCULATED_DERIVATION";
  publication?: string;
  authors?: string[];
  year?: number;
  identifier?: string;
  doi?: string;
  url?: string;
  epistemicStatus: EpistemicStatus;
  confidenceScore: number;
  notes?: string;
}

export type ScientificRelationType =
  | "LOCATED_IN"
  | "ORBITING"
  | "MEMBER_OF"
  | "VISITED_BY"
  | "OBSERVED_BY"
  | "STUDIED_BY"
  | "DISCOVERED_BY"
  | "DISCOVERY_ABOUT"
  | "INSTRUMENT_ON"
  | "PART_OF"
  | "OPERATED_BY"
  | "BUILT_BY"
  | "DATA_ARCHIVE_OF"
  | "DERIVED_FROM"
  | "RELATED_TO";

export interface ResearchNote {
  id: string;
  targetSlug: string;
  author?: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ResearchCollection {
  id: string;
  name: string;
  description: string;
  targetSlugs: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ResearchProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  hypothesis?: string;
  discipline: string;
  tags: string[];
  targetSlugs: string[];
  datasetSlugs: string[];
  missionSlugs: string[];
  observatorySlugs: string[];
  observingListIds: string[];
  notes: ResearchNote[];
  findings?: string;
  status: "DRAFT" | "ACTIVE" | "PUBLISHED" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
}

export interface ResearchQuery {
  query: string;
  domain?: ResearchDomainType;
  category?: string;
  limit?: number;
  minDistanceLy?: number;
  maxDistanceLy?: number;
  epistemicStatus?: EpistemicStatus;
}

export interface ObservationRecord {
  id: string;
  targetSlug: string;
  observerLocation: ObserverLocation;
  timestamp: string;
  durationMinutes: number;
  altitudeDeg: number;
  azimuthDeg: number;
  airmass: number;
  telescopeApertureMm?: number;
  eyepieceFocalLengthMm?: number;
  filter?: string;
  seeingConditions?: "EXCELLENT" | "GOOD" | "AVERAGE" | "POOR";
  notes?: string;
}

export interface ResearchRelation {
  id: string;
  sourceId: string;
  sourceSlug: string;
  sourceName: string;
  sourceDomain: ResearchDomainType;
  targetId: string;
  targetSlug: string;
  targetName: string;
  targetDomain: ResearchDomainType;
  relationType: ScientificRelationType;
  epistemicStatus: EpistemicStatus;
  description: string;
}

export interface TargetIntelligenceReport {
  target: ResearchTargetReference;
  context3DRoute: string;
  physicalProperties: Array<{
    name: string;
    value: string;
    unit?: string;
    epistemicStatus: EpistemicStatus;
    method?: string;
    source?: string;
  }>;
  positionalProperties: Array<{
    frame: string;
    coordinates: string;
    epistemicStatus: EpistemicStatus;
  }>;
  observationSummary?: {
    isObservableTonight: boolean;
    currentAltitudeDeg?: number;
    currentAzimuthDeg?: number;
    transitAltitudeDeg?: number;
    transitTime?: string;
    riseTime?: string;
    setTime?: string;
    airmass?: number;
    bestWindow?: ObservationWindow;
    windows: ObservationWindow[];
  };
  associatedMissions: Array<{
    id: string;
    slug: string;
    name: string;
    agency: string;
    status: string;
    role: string;
  }>;
  associatedSpacecraft: Array<{
    id: string;
    slug: string;
    name: string;
    type: string;
    status: string;
  }>;
  associatedInstruments: Array<{
    id: string;
    slug: string;
    name: string;
    type: string;
    purpose: string;
  }>;
  associatedDiscoveries: Array<{
    id: string;
    slug: string;
    title: string;
    date: string;
    epistemicStatus: EpistemicStatus;
    significance: string;
    citationUrl?: string;
  }>;
  scientificEvidence: ScientificEvidence[];
  relations: ResearchRelation[];
  relatedTargets: ResearchTargetReference[];
  provenance: ProvenanceRecord;
}
