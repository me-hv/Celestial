import { ProvenanceRecord } from "../provenance/types";
import {
  OrganizationParticipation,
  DataArchive,
  PublicSource,
  GeographicRegion,
} from "../organization/types";

export type EpistemicStatus = "OBSERVED" | "INFERRED" | "MODEL_DERIVED";

export type MissionStatus =
  | "PROPOSED"
  | "PLANNED"
  | "APPROVED"
  | "DEVELOPING"
  | "LAUNCHED"
  | "ACTIVE"
  | "EXTENDED"
  | "COMPLETED"
  | "PARTIALLY_SUCCESSFUL"
  | "FAILED"
  | "LOST"
  | "LOST_CONTACT"
  | "CANCELLED"
  | "DECOMMISSIONED"
  | "UNKNOWN";

export type MissionType =
  | "ORBITER"
  | "LANDER"
  | "ROVER"
  | "FLYBY"
  | "ATMOSPHERIC_PROBE"
  | "SAMPLE_RETURN"
  | "SPACE_TELESCOPE"
  | "SOLAR_OBSERVATORY"
  | "HUMAN_SPACEFLIGHT"
  | "INTERSTELLAR"
  | "PLANETARY_EXPLORATION"
  | "LUNAR_EXPLORATION"
  | "MARS_EXPLORATION"
  | "SMALL_BODY_EXPLORATION"
  | "SOLAR_PHYSICS"
  | "ASTROPHYSICS"
  | "COSMOLOGY"
  | "EARTH_OBSERVATION"
  | "SPACE_WEATHER"
  | "HELIOPHYSICS"
  | "ASTROMETRY"
  | "RADIO_ASTRONOMY"
  | "X_RAY_ASTRONOMY"
  | "GAMMA_RAY_ASTRONOMY"
  | "INFRARED_ASTRONOMY"
  | "ULTRAVIOLET_ASTRONOMY"
  | "OPTICAL_ASTRONOMY"
  | "GRAVITATIONAL_WAVE_ASTRONOMY"
  | "COSMIC_RAY_RESEARCH"
  | "ASTROBIOLOGY"
  | "SPACE_TECHNOLOGY"
  | "SPACE_STATION"
  | "TECHNOLOGY_DEMONSTRATION"
  | "DEFENSE_RESEARCH"
  | "EARTH_SCIENCE"
  | "ATMOSPHERIC_SCIENCE"
  | "OTHER_SCIENTIFIC";

export type SpacecraftType =
  | "ORBITER"
  | "LANDER"
  | "ROVER"
  | "FLYBY_PROBE"
  | "ATMOSPHERIC_PROBE"
  | "SPACE_TELESCOPE"
  | "SOLAR_OBSERVATORY"
  | "CREW_CAPSULE"
  | "LUNAR_MODULE"
  | "SERVICE_MODULE"
  | "SAMPLE_RETURN_CAPSULE"
  | "HELICOPTER_DRONE";

export type InstrumentType =
  | "OPTICAL_IMAGER"
  | "INFRARED_SPECTROMETER"
  | "UV_SPECTROMETER"
  | "XRAY_SPECTROMETER"
  | "GAMMA_RAY_SPECTROMETER"
  | "MASS_SPECTROMETER"
  | "MAGNETOMETER"
  | "PLASMA_WAVE_DETECTOR"
  | "RADAR_ALTIMETER"
  | "RADIO_SCIENCE"
  | "DUST_DETECTOR"
  | "MICROWAVE_RADIOMETER"
  | "SEISMOMETER"
  | "PARTICLE_DETECTOR";

export type DiscoveryType =
  | "WATER_EVIDENCE"
  | "ORGANIC_MOLECULES"
  | "ATMOSPHERIC_DISCOVERY"
  | "GEOLOGICAL_DISCOVERY"
  | "MAGNETIC_FIELD"
  | "RING_STRUCTURE"
  | "EXOPLANET_DETECTION"
  | "COSMOLOGICAL_DISCOVERY"
  | "SOLAR_PHYSICS"
  | "PLASMA_PHYSICS";

export type MissionEventType =
  | "MISSION_LAUNCH"
  | "TRAJECTORY_CORRECTION_MANEUVER"
  | "GRAVITY_ASSIST"
  | "ORBIT_INSERTION"
  | "LANDING"
  | "SAMPLE_COLLECTION"
  | "SAMPLE_RETURN_EARTH"
  | "PRIMARY_MISSION_COMPLETE"
  | "EXTENDED_MISSION_START"
  | "COMMUNICATION_LOSS"
  | "MISSION_END"
  | "HELIOPAUSE_CROSSING"
  | "TARGET_ARRIVAL"
  | "DISCOVERY";

export type TrajectoryAccuracy = "HISTORICAL_RECONSTRUCTED" | "MODEL_DERIVED" | "ILLUSTRATIVE";

export interface TrajectoryWaypoint {
  timestamp: string;
  positionAu: [number, number, number];
  velocityKmS?: number;
  distanceFromSunAu?: number;
  distanceFromEarthAu?: number;
  targetEncounter?: {
    targetId: string;
    targetName: string;
    flybyDistanceKm?: number;
  };
  eventDescription?: string;
  isKeyMilestone?: boolean;
}

export interface MissionTrajectory {
  id: string;
  missionId: string;
  spacecraftId?: string;
  accuracy: TrajectoryAccuracy;
  referenceFrame: "HELIOCENTRIC_ECLIPTIC" | "GEOCENTRIC" | "PLANETOCENTRIC";
  waypoints: TrajectoryWaypoint[];
  provenance: ProvenanceRecord;
}

export interface SpacecraftState {
  currentDistanceAu?: number;
  heliocentricDistanceAu?: number;
  apparentConstellation?: string;
  isInterstellar?: boolean;
  communicationDelayMinutes?: number;
  speedKmS?: number;
  lastContactDate?: string;
  notes?: string;
}

export interface MissionTelemetry {
  currentStatus:
    | "ACTIVE_CRUISE"
    | "IN_ORBIT"
    | "SURFACE_OPERATIONS"
    | "FLYBY_APPROACH"
    | "DEEP_SPACE_TRANSIT"
    | "EXTENDED_MISSION"
    | "MISSION_COMPLETE"
    | "STANDBY";
  distanceFromEarthKm?: number;
  distanceFromSunAu?: number;
  velocityKmS?: number;
  lightTimeMinutes?: number;
  missionPhase: string;
  telemetryEpistemicStatus: EpistemicStatus;
  lastTelemetryTimestamp: string;
  sourceStation?: string;
  payloadHealth?: "OPTIMAL" | "NOMINAL" | "DEGRADED" | "STANDBY" | "OFFLINE";
  activeInstrumentIds?: string[];
  subsystemSummary?: string;
}

export interface Spacecraft {
  id: string;
  slug: string;
  missionId: string;
  name: string;
  type: SpacecraftType;
  status: MissionStatus;
  launchDate: string;
  endDate?: string;
  massKg?: number;
  dryMassKg?: number;
  dimensionsMeters?: {
    length?: number;
    width?: number;
    height?: number;
    span?: number;
  };
  powerWatts?: number;
  powerSource?: "SOLAR_ARRAYS" | "RTG" | "BATTERY" | "FUEL_CELL";
  propulsionSystem?: string;
  communicationSystem?: string;
  instrumentIds: string[];
  targetIds: string[];
  currentState?: SpacecraftState;
  telemetry?: MissionTelemetry;
  summary: string;
  provenance: ProvenanceRecord;
}

export interface MissionInstrument {
  id: string;
  slug: string;
  name: string;
  acronym?: string;
  type: InstrumentType;
  wavelengthRange?: string;
  observingModes?: string[];
  missionId: string;
  spacecraftId?: string;
  targetCapabilities?: string[];
  scientificPurpose: string;
  description?: string;
  provenance: ProvenanceRecord;
}

export interface ScientificDiscovery {
  id: string;
  slug: string;
  title: string;
  date: string;
  missionId: string;
  spacecraftId?: string;
  instrumentId?: string;
  targetId?: string;
  targetName?: string;
  discoveryType: DiscoveryType;
  epistemicStatus: EpistemicStatus;
  description: string;
  scientificSignificance: string;
  citationUrl?: string;
  provenance: ProvenanceRecord;
}

export interface MissionEvent {
  id: string;
  timestamp: string;
  eventType: MissionEventType;
  title: string;
  description: string;
  targetId?: string;
  targetName?: string;
  missionId: string;
  spacecraftId?: string;
  scientificSignificance?: string;
  provenance: ProvenanceRecord;
}

export interface SpaceMission {
  id: string;
  slug: string;
  name: string;
  agency: string;
  type: MissionType;
  status: MissionStatus;
  launchDate: string;
  endDate?: string;
  leadOrganizationId?: string;
  leadOrganizationSlug?: string;
  country?: string;
  region?: GeographicRegion;
  participatingOrganizations?: OrganizationParticipation[];
  cosparId?: string;
  noradId?: string;
  nssdcId?: string;
  launchVehicle?: string;
  launchSite?: string;
  primaryTargetId?: string;
  secondaryTargetIds?: string[];
  spacecraftIds: string[];
  instrumentIds: string[];
  discoveryIds: string[];
  eventIds: string[];
  trajectoryId?: string;
  destination: string;
  objective: string;
  summary: string;
  scientificResults?: string[];
  dataArchives?: DataArchive[];
  officialSources?: PublicSource[];
  heroImageUrl?: string;
  telemetry?: MissionTelemetry;
  provenance: ProvenanceRecord;
}

export interface MissionStatistics {
  totalMissions: number;
  activeMissions: number;
  completedMissions: number;
  humanSpaceflightMissions: number;
  planetaryMissions: number;
  spaceObservatories: number;
  interstellarMissions: number;
  totalDiscoveries: number;
  mostExploredTarget: {
    targetName: string;
    count: number;
  };
  longestMission: {
    name: string;
    durationYears: number;
  };
  mostDistantSpacecraft: {
    name: string;
    distanceAu: number;
  };
}
