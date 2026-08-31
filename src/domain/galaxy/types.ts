import { ProvenanceRecord } from "../provenance/types";
import { ScientificMeasurement } from "../measurement/types";
import { CatalogIdentifiers, PositionalProperties } from "../celestial-object/types";
import { MultiWavelengthObservation } from "../deep-sky/types";

export type GalaxyMorphologyClass =
  | "SPIRAL"
  | "BARRED_SPIRAL"
  | "ELLIPTICAL"
  | "LENTICULAR"
  | "IRREGULAR"
  | "DWARF_SPHEROIDAL"
  | "DWARF_IRREGULAR"
  | "DWARF_ELLIPTICAL";

export interface GalaxyMorphology {
  class: GalaxyMorphologyClass;
  hubbleDeVaucouleurs: string; // e.g. "SA(s)b", "SB(s)m", "E2", "dE0", "dIrr"
  isModelDerived?: boolean;
  notes?: string;
}

export interface GalaxyPhysicalProperties {
  diameterLy: ScientificMeasurement<number>;
  diameterKpc: ScientificMeasurement<number>;
  stellarMassSolar?: ScientificMeasurement<number>;
  totalMassSolar?: ScientificMeasurement<number>; // Total dynamical / virial halo mass including dark matter
  neutralHydrogenMassSolar?: ScientificMeasurement<number>; // M_HI
  starFormationRateSolarMassPerYr?: number;
  metallicityFeH?: number;
  absoluteMagnitudeV?: number;
  apparentMagnitudeV?: number;
}

export interface GalaxyKinematics {
  heliocentricRadialVelocityKmS: ScientificMeasurement<number>; // Observed Doppler velocity (v_r)
  galactocentricRadialVelocityKmS?: ScientificMeasurement<number>; // Velocity corrected for Solar rotation
  spectroscopicRedshiftZ?: ScientificMeasurement<number>; // z = delta lambda / lambda
  rotationalVelocityKmS?: ScientificMeasurement<number>; // V_max or V_rot
  velocityDispersionKmS?: number; // sigma_v for spheroids
}

export interface GalaxyOrientation {
  inclinationDeg: number; // 0° = face-on, 90° = edge-on
  positionAngleDeg: number; // Major axis orientation angle relative to North (0° to 180°)
  majorAxisArcmin: number;
  minorAxisArcmin: number;
  axisRatio: number; // b / a (0.0 to 1.0)
}

export type GalaxyDistanceMethod =
  | "TRGB" // Tip of the Red Giant Branch
  | "CEPHEID" // Classical Cepheid Period-Luminosity relation
  | "SURFACE_BRIGHTNESS_FLUCTUATIONS"
  | "TYPE_IA_SUPERNOVA"
  | "TULLY_FISHER"
  | "REDSHIFT_HUBBLE_FLOW"
  | "LITERATURE_CONSENSUS";

export interface GalaxyDistance {
  distanceLy: ScientificMeasurement<number>;
  distanceKpc: ScientificMeasurement<number>;
  distanceMpc: ScientificMeasurement<number>;
  primaryMethod: GalaxyDistanceMethod;
  derivedLookbackTimeYears: number; // Light travel time: t = d / c
  cosmologicalAssumptions?: {
    hubbleConstantKmSPerMpc: number; // e.g. 70.0 km/s/Mpc
    approximationModel: string;
  };
}

export type GroupMembershipType = "PRIMARY_MEMBER" | "SATELLITE" | "DWARF_MEMBER" | "CANDIDATE";

export interface GalaxyGroupMembership {
  groupId: string; // e.g. "local-group"
  groupName: string; // e.g. "Local Group"
  membershipType: GroupMembershipType;
  subgroupId?:
    "MILKY_WAY_SUBGROUP" | "ANDROMEDA_SUBGROUP" | "TRIANGULUM_SUBGROUP" | "LOCAL_GROUP_ISOLATED";
  parentGalaxySlug?: string; // Host galaxy slug if satellite (e.g. "milky-way-galaxy" for LMC)
}

export type GalaxyRelationshipType =
  | "SATELLITE_OF"
  | "HOST_TO"
  | "INTERACTING_WITH"
  | "APPROACHING"
  | "PAIR_WITH"
  | "GRAVITATIONAL_ASSOCIATION";

export interface GalaxyRelationship {
  targetGalaxySlug: string;
  targetGalaxyName: string;
  relationshipType: GalaxyRelationshipType;
  relativeVelocityKmS?: number; // Negative = approaching, Positive = receding
  separationKpc?: number;
  description: string;
  isFutureInteraction?: boolean;
}

export interface Galaxy {
  id: string;
  slug: string;
  name: string;
  standardDesignation?: string;
  aliases?: string[];
  summary: string;

  morphology: GalaxyMorphology;
  physical: GalaxyPhysicalProperties;
  kinematics: GalaxyKinematics;
  orientation: GalaxyOrientation;
  distance: GalaxyDistance;
  positional: PositionalProperties;
  catalogIdentifiers?: CatalogIdentifiers;

  groupMembership?: GalaxyGroupMembership;
  relationships?: GalaxyRelationship[];
  observations?: MultiWavelengthObservation[];

  provenance: ProvenanceRecord;
}
