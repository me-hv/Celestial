import { CelestialCategory, CelestialClassificationCode } from "./classification";
import { ProvenanceRecord } from "../provenance/types";

/**
 * Common Physical Properties of a Celestial Object
 */
export interface PhysicalProperties {
  massKg?: number;
  massSolar?: number;
  massEarth?: number;
  meanRadiusKm?: number;
  surfaceGravityMs2?: number;
  densityGcm3?: number;
  meanTemperatureK?: number;
  spectralClass?: string;
  morphologicalType?: string;
  atmosphereComposition?: Array<{
    molecule: string;
    percentage: number;
  }>;
}

/**
 * Positional Properties in Equatorial / Astrometric Coordinates (J2000)
 */
export interface PositionalProperties {
  rightAscensionDeg?: number;
  declinationDeg?: number;
  distanceLightYears?: number;
  distanceAu?: number;
  distanceKm?: number;
  epoch?: string;
}

/**
 * Keplerian Orbital Elements
 */
export interface OrbitalProperties {
  semiMajorAxisAu?: number;
  semiMajorAxisKm?: number;
  eccentricity?: number;
  orbitalPeriodDays?: number;
  inclinationDeg?: number;
  longitudeAscendingNodeDeg?: number;
  argumentPeriapsisDeg?: number;
  meanAnomalyDeg?: number;
  epochJulianDate?: number;
}

/**
 * Object Identity and Multi-Catalog Alias Designation
 */
export interface ObjectAlias {
  name: string;
  type: "COMMON" | "BAYER" | "FLAMSTEED" | "CATALOG" | "HISTORICAL";
  sourceCatalog?: string;
}

/**
 * Discovery Metadata
 */
export interface DiscoveryInfo {
  year?: number;
  discoveredBy?: string;
  method?: "DIRECT_IMAGING" | "TRANSIT" | "RADIAL_VELOCITY" | "ASTROMETRY" | "ANTIQUITY" | "OTHER";
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
  slug: string; // URL-safe slug e.g. "jupiter", "proxima-centauri"
  canonicalName: string;
  standardDesignation?: string;
  classification: {
    category: CelestialCategory;
    code: CelestialClassificationCode;
  };
  aliases: ObjectAlias[];

  // Hierarchical Relationships
  parentId?: string; // e.g. Earth's parent is Sun (Sol)
  hostSystemId?: string; // e.g. Solar System
  hostGalaxyId?: string; // e.g. Milky Way
  childObjectIds?: string[]; // e.g. moons of Jupiter

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
