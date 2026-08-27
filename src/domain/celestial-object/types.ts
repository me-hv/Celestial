import { CelestialCategory, CelestialClassificationCode } from "./classification";
import { ProvenanceRecord } from "../provenance/types";
import { ScientificMeasurement } from "../measurement/types";

/**
 * Common Physical Properties of a Celestial Object (Stars, Planets, Exoplanets, Moons)
 */
export interface PhysicalProperties {
  // Mass
  massKg?: number;
  massSolar?: number;
  massEarth?: number;
  massJupiter?: number;

  // Radius
  meanRadiusKm?: number;
  radiusEarth?: number;
  radiusJupiter?: number;
  radiusSolar?: number;

  // Mechanics & Dynamics
  surfaceGravityMs2?: number;
  densityGcm3?: number;

  // Stellar & Thermal
  meanTemperatureK?: number;
  effectiveTemperatureK?: number;
  luminositySolar?: number;
  spectralClass?: string;
  metallicityDex?: number;
  surfaceGravityLogG?: number; // log(g) in cgs

  // Morphology & Composition
  morphologicalType?: string;
  atmosphereComposition?: Array<{
    molecule: string;
    percentage: number;
  }>;

  // Explicit Uncertainty Records for Scientific Honesty
  measurementsWithUncertainty?: {
    massEarth?: ScientificMeasurement<number>;
    radiusEarth?: ScientificMeasurement<number>;
    massJupiter?: ScientificMeasurement<number>;
    radiusJupiter?: ScientificMeasurement<number>;
    effectiveTemperatureK?: ScientificMeasurement<number>;
    luminositySolar?: ScientificMeasurement<number>;
    stellarRadiusSolar?: ScientificMeasurement<number>;
    stellarMassSolar?: ScientificMeasurement<number>;
  };
}

/**
 * Positional Properties in Equatorial / Astrometric Coordinates (J2000)
 */
export interface PositionalProperties {
  rightAscensionDeg?: number;
  declinationDeg?: number;
  distanceLightYears?: number;
  distanceParsecs?: number;
  distanceAu?: number;
  distanceKm?: number;
  epoch?: string;
  distanceUncertainty?: {
    upper?: number;
    lower?: number;
  };
}

/**
 * Keplerian Orbital Elements
 */
export interface OrbitalProperties {
  semiMajorAxisAu?: number;
  semiMajorAxisKm?: number;
  eccentricity?: number;
  orbitalPeriodDays?: number;
  orbitalPeriodYears?: number;
  inclinationDeg?: number;
  longitudeAscendingNodeDeg?: number;
  argumentPeriapsisDeg?: number;
  meanAnomalyDeg?: number;
  epochJulianDate?: number;
  transitMidpointJulianDate?: number; // BJD_TDB

  // Explicit Uncertainty Records
  orbitalPeriodUncertainty?: { upper?: number; lower?: number };
  semiMajorAxisUncertainty?: { upper?: number; lower?: number };
  eccentricityUncertainty?: { upper?: number; lower?: number };
  inclinationUncertainty?: { upper?: number; lower?: number };
}

/**
 * Object Identity and Multi-Catalog Alias Designation
 */
export interface ObjectAlias {
  name: string;
  type: "COMMON" | "BAYER" | "FLAMSTEED" | "CATALOG" | "HISTORICAL" | "EXOPLANET_LETTER";
  sourceCatalog?: string; // e.g. "NASA_EXOPLANET_ARCHIVE", "SIMBAD", "GAIA", "KEPLER", "TESS", "HIPPARCOS"
}

/**
 * Discovery Metadata for Exoplanets and Astronomical Objects
 */
export interface DiscoveryInfo {
  year?: number;
  discoveredBy?: string;
  method?:
    | "DIRECT_IMAGING"
    | "TRANSIT"
    | "RADIAL_VELOCITY"
    | "ASTROMETRY"
    | "MICROLENSING"
    | "TRANSIT_TIMING_VARIATION"
    | "ANTIQUITY"
    | "OTHER";
  facility?: string; // e.g. "La Silla Observatory", "Kepler", "TESS", "Paranal Observatory", "W. M. Keck Observatory"
  telescope?: string; // e.g. "0.6 m TRAPPIST-South", "10 m Keck I", "Kepler Space Telescope"
  instrument?: string; // e.g. "HARPS", "ESPRESSO", "HIRES"
  referenceCitation?: string; // DOI or Bibcode
}

/**
 * Media and Visual Assets
 */
export interface MediaAssets {
  thumbnailUrl?: string;
  textureUrl?: string;
  credit?: string;
}

/**
 * Canonical Celestial Object Domain Model
 */
export interface CelestialObject {
  id: string; // UUID v4
  slug: string; // URL-safe slug e.g. "jupiter", "proxima-centauri", "trappist-1-e"
  canonicalName: string;
  standardDesignation?: string;
  classification: {
    category: CelestialCategory;
    code: CelestialClassificationCode;
  };
  aliases: ObjectAlias[];

  // Hierarchical Relationships
  parentId?: string; // e.g. Earth's parent is Sun; TRAPPIST-1 e's parent is TRAPPIST-1
  hostSystemId?: string; // e.g. "solar-system", "trappist-1-system", "alpha-centauri-system"
  hostGalaxyId?: string; // e.g. "milky-way"
  childObjectIds?: string[]; // e.g. planets of a star, or moons of a planet

  // Scientific Characteristics
  physical: PhysicalProperties;
  positional: PositionalProperties;
  orbital?: OrbitalProperties;

  // Metadata & Provenance
  discovery?: DiscoveryInfo;
  provenance: ProvenanceRecord;
  media?: MediaAssets;
  summary?: string;
  isFeatured?: boolean;
}
