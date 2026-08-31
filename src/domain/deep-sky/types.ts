import { ScientificMeasurement } from "../measurement/types";

/**
 * Multi-wavelength observational measurement (Optical, Infrared, Radio, X-ray, UV)
 */
export interface MultiWavelengthObservation {
  id: string;
  wavelengthBand: "OPTICAL" | "INFRARED" | "RADIO" | "X_RAY" | "ULTRAVIOLET" | "GAMMA_RAY";
  filterOrFrequency?: string; // e.g. "V (551nm)", "2MASS Ks (2.16um)", "Chandra 0.5-7.0 keV"
  apparentMagnitude?: number;
  fluxDensityJy?: number; // Jansky for radio
  telescopeOrSurvey: string; // e.g. "Hubble Space Telescope", "JWST", "Chandra", "VLA", "Gaia"
  instrument?: string;
  epoch?: string; // e.g. "J2000.0"
  observationDate?: string; // ISO date string
  citationOrCredit?: string;
  referenceUrl?: string;
}

/**
 * Galaxy-specific intrinsic and morphological characteristics
 */
export interface GalaxyProperties {
  morphologicalType: string; // Hubble-de Vaucouleurs type e.g. "SA(s)b", "SB(s)cd", "E0", "Irr"
  galaxySubtype?: "SPIRAL" | "ELLIPTICAL" | "LENTICULAR" | "IRREGULAR" | "DWARF";
  redshiftZ?: number; // Measured spectroscopic redshift z
  radialVelocityKmS?: number;
  majorAxisArcmin?: number;
  minorAxisArcmin?: number;
  positionAngleDeg?: number;
  inclinationDeg?: number;
  estimatedStellarMassSolar?: number;
  starFormationRateSolarMassPerYr?: number;
  galaxyGroupOrCluster?: string; // e.g. "Local Group", "Virgo Cluster"
  measurementsWithUncertainty?: {
    redshiftZ?: ScientificMeasurement<number>;
    distanceMpc?: ScientificMeasurement<number>;
  };
}

/**
 * Nebula-specific intrinsic and physical characteristics
 */
export interface NebulaProperties {
  nebulaSubtype: "EMISSION" | "REFLECTION" | "DARK" | "DIFFUSE" | "STAR_FORMING";
  angularDiameterArcmin?: number;
  majorAxisArcmin?: number;
  minorAxisArcmin?: number;
  associatedIonizingStar?: string; // Canonical name or slug of ionizing star
  associatedCluster?: string;
  chemicalComposition?: string[]; // e.g. ["H-II", "O-III", "N-II", "S-II"]
}

/**
 * Planetary Nebula specific properties
 */
export interface PlanetaryNebulaProperties {
  centralStarName?: string;
  centralStarMagnitudeV?: number;
  expansionVelocityKmS?: number;
  angularDiameterArcsec?: number;
  distanceMethod?: string;
}

/**
 * Supernova Remnant specific properties
 */
export interface SupernovaRemnantProperties {
  explosionYearEstimate?: number; // e.g. 1054 for Crab Nebula
  progenitorType?: "TYPE_IA" | "CORE_COLLAPSE" | "UNKNOWN";
  expansionVelocityKmS?: number;
  remnantCoreType?: "PULSAR" | "NEUTRON_STAR" | "BLACK_HOLE" | "NONE";
  centralCompactObject?: string; // e.g. "Crab Pulsar (PSR B0531+21)"
}

/**
 * Star Cluster (Open vs Globular) characteristics
 */
export interface StarClusterProperties {
  clusterSubtype: "OPEN_CLUSTER" | "GLOBULAR_CLUSTER" | "STELLAR_ASSOCIATION";
  estimatedAgeGyr?: number;
  metallicityFeH?: number;
  estimatedMemberCount?: number;
  coreRadiusArcmin?: number;
  halfLightRadiusArcmin?: number;
  totalLuminositySolar?: number;
  trumplerClass?: string; // e.g. "II,2,r" for Pleiades
}

/**
 * Discriminated / Unified Deep Sky Properties Extension
 */
export interface DeepSkyProperties {
  type: "GALAXY" | "NEBULA" | "PLANETARY_NEBULA" | "SUPERNOVA_REMNANT" | "STAR_CLUSTER";
  galaxy?: GalaxyProperties;
  nebula?: NebulaProperties;
  planetaryNebula?: PlanetaryNebulaProperties;
  supernovaRemnant?: SupernovaRemnantProperties;
  starCluster?: StarClusterProperties;
  cosmicHierarchy?: {
    supercluster?: string; // e.g. "Laniakea Supercluster"
    clusterOrGroup?: string; // e.g. "Local Group"
    hostStructure?: string; // e.g. "Milky Way", "Orion Arm"
  };
  distanceMethod?:
    | "TRIGONOMETRIC_PARALLAX"
    | "CEPHEID_VARIABLE"
    | "TIP_OF_RED_GIANT_BRANCH"
    | "TYPE_IA_SUPERNOVA"
    | "SURFACE_BRIGHTNESS_FLUCTUATIONS"
    | "REDSHIFT_HUBBLE_FLOW"
    | "CLUSTER_MAIN_SEQUENCE_FITTING"
    | "LITERATURE_CONSENSUS";
}
