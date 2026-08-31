import { ProvenanceRecord } from "../provenance/types";

/**
 * Scientific Observation Status
 */
export type ScientificObservationStatus =
  | "OBSERVED" // Directly detected with telescopes/instruments (e.g. CMB photons, GN-z11)
  | "INFERRED" // Deduced through astrophysical modeling + observational proxies
  | "MODEL_DERIVED" // Calculated from FLRW Lambda-CDM spacetime metric
  | "ILLUSTRATIVE"; // Visual aid / non-exact reference representation

/**
 * Classification of Cosmic Horizons
 */
export type HorizonType =
  | "PARTICLE_HORIZON" // Boundary of the Observable Universe (comoving ~46.5 Gly)
  | "HUBBLE_SPHERE" // Surface where recession speed equals c (v = H_0 * d = c, ~14.0 Gly)
  | "COSMOLOGICAL_EVENT_HORIZON" // Future boundary of communication (~17.0 Gly)
  | "CMB_LAST_SCATTERING" // Surface of photon decoupling (z ~ 1089, ~45.7 Gly)
  | "LIGHT_TRAVEL_HORIZON"; // Naive c * t_0 (~13.8 Gly)

/**
 * Cosmic Horizon Domain Model
 */
export interface CosmicHorizon {
  id: string;
  slug: string;
  name: string;
  horizonType: HorizonType;
  comovingRadiusMpc: number;
  comovingRadiusGly: number;
  redshiftZ?: number;
  lookbackTimeGyr: number;
  cosmicAgeGyr: number;
  scaleFactorA: number;
  status: ScientificObservationStatus;
  summary: string;
  physicalMeaning: string;
  commonMisconception?: string;
  citation?: string;
}

/**
 * Redshift Shell Classification
 */
export type RedshiftShellType =
  | "LOCAL_UNIVERSE" // z < 0.01 (d < ~43 Mpc)
  | "NEARBY_GALAXIES" // z ~ 0.01 - 0.1 (d ~ 43 - 420 Mpc)
  | "INTERMEDIATE_UNIVERSE" // z ~ 0.1 - 1.0 (d ~ 0.42 - 3.4 Gpc)
  | "EARLY_GALAXIES" // z ~ 1.0 - 3.0 (d ~ 3.4 - 6.5 Gpc, Cosmic Noon)
  | "HIGH_REDSHIFT_UNIVERSE" // z ~ 3.0 - 10.0 (d ~ 6.5 - 9.8 Gpc)
  | "COSMIC_DAWN" // z ~ 10.0 - 30.0 (d ~ 9.8 - 11.5 Gpc, First Stars)
  | "DARK_AGES" // z ~ 30.0 - 1050.0 (d ~ 11.5 - 13.9 Gpc)
  | "CMB_LAST_SCATTERING" // z ~ 1050 - 1150 (d ~ 14.0 Gpc)
  | "PARTICLE_HORIZON"; // z -> infinity (d ~ 14.25 Gpc)

/**
 * Redshift Distance Shell Model
 */
export interface RedshiftShell {
  id: string;
  slug: string;
  name: string;
  type: RedshiftShellType;
  orderIndex: number;
  minRedshiftZ: number;
  maxRedshiftZ: number;
  minComovingDistanceMpc: number;
  maxComovingDistanceMpc: number;
  minLookbackTimeGyr: number;
  maxLookbackTimeGyr: number;
  minCosmicAgeGyr: number;
  maxCosmicAgeGyr: number;
  minScaleFactorA: number;
  maxScaleFactorA: number;
  status: ScientificObservationStatus;
  colorHex: string;
  description: string;
  representativeObjects: string[];
}

/**
 * Landmark High-Redshift & Observational Target
 */
export interface ObservationalLandmark {
  id: string;
  slug: string;
  name: string;
  standardDesignation?: string;
  category: "LOCAL" | "GALAXY" | "QUASAR" | "HIGH_Z_GALAXY" | "HORIZON" | "CMB";
  redshiftZ: number;
  scaleFactorA: number;
  comovingDistanceMpc: number;
  comovingDistanceGly: number;
  luminosityDistanceMpc: number;
  angularDiameterDistanceMpc: number;
  properDistanceEmissionMpc: number;
  lookbackTimeGyr: number;
  cosmicAgeAtEmissionGyr: number;
  status: ScientificObservationStatus;
  observationalSource?: string;
  coordinates?: {
    rightAscensionDeg?: number;
    declinationDeg?: number;
  };
  summary: string;
  provenance: ProvenanceRecord;
}

/**
 * Acoustic Peak of the Cosmic Microwave Background
 */
export interface CMBAcousticPeak {
  peakNumber: number;
  multipoleL: number;
  angularScaleDeg: number;
  physicalMeaning: string;
}

/**
 * Observational Mission Record for CMB
 */
export interface CMBMissionRecord {
  name: string;
  agency: string;
  launchYear: number;
  orbitOrLocation: string;
  keyDiscovery: string;
  citation: string;
}

/**
 * First-Class Cosmic Microwave Background (CMB) Last-Scattering Model
 */
export interface CMBLastScatteringSurface {
  id: string;
  slug: string;
  name: string;
  redshiftZ: number; // 1089.0
  scaleFactorA: number; // 0.000917
  cosmicAgeYears: number; // 379,000 years
  lookbackTimeGyr: number; // 13.7996 Gyr
  comovingDistanceMpc: number; // ~14,000 Mpc
  comovingDistanceGly: number; // ~45.7 Gly
  temperatureKelvinToday: number; // 2.7255 K
  temperatureKelvinDecoupling: number; // ~2,970 K
  dipoleVelocityKmS: number; // 369.0 km/s towards (l = 264°, b = +48°)
  anisotropyScaleRmsMicroKelvin: number; // ~18 microKelvin (Delta T / T ~ 10^-5)
  acousticPeaks: CMBAcousticPeak[];
  missions: CMBMissionRecord[];
  status: "OBSERVED";
  summary: string;
  physicalProcesses: string;
  provenance: ProvenanceRecord;
}
