import { ProvenanceRecord } from "../provenance/types";

export type MissionStatus = "PLANNED" | "ACTIVE" | "COMPLETED" | "FAILED";

export type SpacecraftType =
  | "ORBITER"
  | "LANDER"
  | "ROVER"
  | "FLYBY_PROBE"
  | "SPACE_TELESCOPE"
  | "CREWED_VEHICLE"
  | "SAMPLE_RETURN";

export interface Spacecraft {
  id: string;
  missionId: string;
  name: string;
  type: SpacecraftType;
  status: MissionStatus;
  massKg?: number;
  instruments?: string[];
}

export interface SpaceMission {
  id: string;
  slug: string;
  name: string;
  agency: string; // e.g. "NASA", "ESA", "JAXA", "ISRO"
  status: MissionStatus;
  launchDate?: string; // ISO 8601 Date
  endDate?: string;
  primaryTargetId?: string; // Target CelestialObject UUID
  secondaryTargetIds?: string[];
  spacecraft: Spacecraft[];
  objective?: string;
  summary?: string;
  provenance: ProvenanceRecord;
}
