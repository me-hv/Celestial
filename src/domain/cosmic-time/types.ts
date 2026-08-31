import { ProvenanceRecord } from "../provenance/types";
import { ScientificMeasurement } from "../measurement/types";

/**
 * Standard Cosmological Epoch Types in Lambda-CDM Big Bang Cosmology
 */
export type CosmicEpochType =
  | "PLANCK_EPOCH"
  | "INFLATION"
  | "ELECTROWEAK_EPOCH"
  | "QUARK_EPOCH"
  | "HADRON_EPOCH"
  | "LEPTON_EPOCH"
  | "NUCLEOSYNTHESIS"
  | "RECOMBINATION"
  | "DARK_AGES"
  | "FIRST_STARS"
  | "REIONIZATION"
  | "EARLY_GALAXIES"
  | "GALAXY_ASSEMBLY"
  | "MODERN_UNIVERSE";

export type CosmicEpochCategory =
  | "VERY_EARLY_UNIVERSE" // Planck through Lepton Epoch (t < 10 s)
  | "EARLY_UNIVERSE" // Nucleosynthesis, Recombination, Dark Ages (10 s to 100 Myr)
  | "STRUCTURE_FORMATION" // First Stars, Reionization, Early Galaxies, Galaxy Assembly (100 Myr to 9 Gyr)
  | "MODERN_UNIVERSE"; // Cosmic Acceleration to Present (9 Gyr to 13.8 Gyr)

export type EpochObservationStatus =
  | "OBSERVED" // Direct observational evidence (e.g. CMB Planck, JWST z>10 spectroscopy)
  | "INFERRED" // Strong theoretical/empirical inference (e.g. Primordial Nucleosynthesis light element abundances)
  | "MODEL_DERIVED" // Standard model numerical extrapolation (e.g. Inflation, Quark-Gluon plasma)
  | "THEORETICAL"; // Pre-electroweak / quantum gravity regimes (e.g. Planck Epoch)

export type EpochBoundaryConfidence =
  | "SHARP_PHYSICAL" // Exact physical phase transition (e.g. Recombination T ~ 3000 K, z ~ 1100)
  | "OBSERVED_WINDOW" // Direct observational band (e.g. Reionization z ~ 15 to 6)
  | "MODEL_DEPENDENT" // Model-dependent smooth astrophysical crossover (e.g. Galaxy Assembly)
  | "THEORETICAL_EXTRAPOLATION"; // Extrapolated from high-energy physics

export interface CosmicTimeRange {
  minYears: number; // Cosmic time since Big Bang
  maxYears: number;
  minDisplay: string; // e.g. "380,000 years"
  maxDisplay: string; // e.g. "100 Million years"
}

export interface RedshiftRange {
  minZ: number;
  maxZ: number;
  minDisplay: string;
  maxDisplay: string;
}

export interface ScaleFactorRange {
  minA: number;
  maxA: number;
}

export interface LookbackTimeRangeGyr {
  minGyr: number;
  maxGyr: number;
}

export interface PhysicalProcessRecord {
  title: string;
  description: string;
  temperatureKelvin?: ScientificMeasurement<number>;
  energyScaleGev?: ScientificMeasurement<number>;
}

export interface ObservationalEvidenceRecord {
  technique: string;
  observatoryOrMission?: string; // e.g. "Planck Space Telescope", "JWST NIRSpec", "ALMA", "SDSS"
  primarySignature: string; // e.g. "Cosmic Microwave Background acoustic peaks", "Lyman-alpha forest transmission gap"
  bibcode?: string;
}

export interface MilestoneEvent {
  id: string;
  name: string;
  cosmicAgeYears: number;
  redshiftZ?: number;
  scaleFactorA?: number;
  description: string;
  isCosmologicalMilestone: boolean;
}

export interface CosmicEpoch {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  type: CosmicEpochType;
  category: CosmicEpochCategory;
  orderIndex: number; // 1 to 14 chronological order

  ageRange: CosmicTimeRange;
  redshiftRange?: RedshiftRange;
  scaleFactorRange?: ScaleFactorRange;
  lookbackTimeRangeGyr: LookbackTimeRangeGyr;

  summary: string;
  description: string;
  physicalProcesses: PhysicalProcessRecord[];
  observationalEvidence: ObservationalEvidenceRecord[];
  keyMilestones: MilestoneEvent[];

  observationStatus: EpochObservationStatus;
  boundaryConfidence: EpochBoundaryConfidence;
  provenance: ProvenanceRecord;

  scientificNotes?: string;
  uncertaintyCaveats?: string;
}

/**
 * Spacetime Coordinates: Unified Spatial + Temporal Coordinates
 */
export interface SpacetimeCoordinates {
  raDeg: number;
  decDeg: number;
  distanceMpc: number;
  distanceLy: number;
  redshiftZ: number;
  scaleFactorA: number;
  lookbackTimeGyr: number;
  lookbackTimeYears: number;
  cosmicAgeGyr: number;
  cosmicAgeYears: number;
  epochType: CosmicEpochType;
  epochSlug: string;
}

/**
 * Distinguishes Light-Travel Time from Cosmological Lookback Time
 */
export type TimeType =
  | "LIGHT_TRAVEL_TIME" // Kinematic: t = d / c for stars and nearby objects (d < 1 Mpc)
  | "COSMOLOGICAL_LOOKBACK_TIME"; // Spacetime expansion: derived from FLRW metric for z > 0.001

export interface ObservationTimeModel {
  timeType: TimeType;
  distanceMpc: number;
  distanceLy: number;
  lookbackYears: number;
  lookbackGyr: number;
  redshiftZ?: number;
  scaleFactorA?: number;
  cosmicAgeGyr?: number;
  cosmicAgeYears?: number;
  epochSlug?: string;
  epochName?: string;
  isCosmological: boolean;
  scientificExplanation: string;
}
