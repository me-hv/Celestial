import { CelestialObject } from "../celestial-object/types";
import { ProvenanceRecord } from "../provenance/types";

export type StellarSystemArchitecture =
  "SINGLE_STAR" | "BINARY_STAR" | "MULTIPLE_STAR" | "COMPACT_SYSTEM" | "CIRCUMBINARY";

/**
 * Circumstellar Habitable Zone Boundaries (in AU)
 */
export interface HabitableZoneBoundaries {
  // Conservative HZ (Moist Greenhouse to Maximum Greenhouse)
  conservativeInnerAu: number;
  conservativeOuterAu: number;
  // Optimistic HZ (Recent Venus to Early Mars)
  optimisticInnerAu: number;
  optimisticOuterAu: number;
  // Host star effective temperature and luminosity used in calculation
  stellarLuminositySolar: number;
  stellarEffectiveTemperatureK: number;
  calculationModel: string; // e.g. "Kopparapu et al. (2013/2014)"
}

/**
 * Multi-Star Barycentric Coordinate & Orbital Hierarchy
 */
export interface BarycentricModel {
  isBarycentric: boolean;
  barycenterName?: string;
  centralStars: Array<{
    starId: string;
    starName: string;
    massSolar: number;
    semiMajorAxisAu?: number;
    orbitalPeriodYears?: number;
  }>;
  approximationDescription?: string;
}

/**
 * Stellar System Model (e.g. Solar System, TRAPPIST-1, Alpha Centauri, Kepler-90)
 *
 * Distinct from CelestialObject: A StellarSystem is a relational container describing
 * a gravitationally bound star system, its host stars, planets, and habitable zone.
 */
export interface StellarSystem {
  id: string; // UUID v4 or canonical slug identifier
  slug: string;
  name: string;
  hostGalaxyId?: string;

  // System Architecture & Hierarchy
  architecture: StellarSystemArchitecture;
  centralBodyIds: string[]; // Host star(s) IDs e.g. [Sun] or [Alpha Centauri A, Alpha Centauri B]
  planetaryBodyIds: string[]; // Confirmed exoplanets / planets
  minorBodyIds?: string[];

  // Spatial & Astronomical Properties
  distanceLightYears?: number;
  distanceParsecs?: number;
  spectralTypeSummary?: string; // e.g. "M8V", "G2V", "G2V + K1V"
  numberOfStars: number;
  numberOfPlanets: number;

  // Circumstellar Habitable Zone
  habitableZone?: HabitableZoneBoundaries;

  // Binary/Barycentric approximation details
  barycentricModel?: BarycentricModel;

  // Discovery & Scientific Context
  discoveryFacility?: string;
  discoveryYear?: number;
  summary?: string;
  provenance: ProvenanceRecord;
}

export interface SystemHierarchyNode {
  object: CelestialObject;
  children: SystemHierarchyNode[];
}
