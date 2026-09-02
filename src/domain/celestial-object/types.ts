import { CelestialCategory, CelestialClassificationCode } from "./classification";
import { ProvenanceRecord } from "../provenance/types";
import { ScientificMeasurement } from "../measurement/types";
import { DeepSkyProperties, MultiWavelengthObservation } from "../deep-sky/types";

/**
 * Standard Catalog Identifiers for Astronomical Bodies across Catalogs
 */
export interface CatalogIdentifiers {
  gaiaDr3?: string; // e.g. "Gaia DR3 5853498713190525696"
  hip?: string; // Hipparcos Catalog ID e.g. "HIP 70890"
  hd?: string; // Henry Draper Catalog ID e.g. "HD 128620"
  gliese?: string; // Gliese-Jahreiss Catalog e.g. "GJ 551", "Gl 699"
  bayer?: string; // Bayer Designation e.g. "Alpha Centauri C", "Alpha Canis Majoris"
  flamsteed?: string; // Flamsteed Designation e.g. "61 Cygni"
  sao?: string; // Smithsonian Astrophysical Observatory e.g. "SAO 252838"
  hr?: string; // Harvard Revised / Bright Star Catalog e.g. "HR 5459"
  twoMass?: string; // 2MASS All-Sky Catalog e.g. "2MASS J14294291-6240465"
  messier?: string; // Messier Catalog e.g. "M31", "M42", "M45"
  ngc?: string; // New General Catalogue e.g. "NGC 224", "NGC 1976"
  ic?: string; // Index Catalogue e.g. "IC 434"
  caldwell?: string; // Caldwell Catalog e.g. "C14"
  pgc?: string; // Principal Galaxies Catalogue e.g. "PGC 2557"
  ugc?: string; // Uppsala General Catalogue e.g. "UGC 454"
}

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

  // Stellar, Thermal & Photometric
  meanTemperatureK?: number;
  effectiveTemperatureK?: number;
  luminositySolar?: number;
  spectralClass?: string;
  metallicityDex?: number;
  surfaceGravityLogG?: number; // log(g) in cgs

  // Photometry (Apparent & Absolute Magnitudes)
  apparentMagnitudeV?: number; // Visual Johnson V band
  apparentMagnitudeG?: number; // Gaia G band
  absoluteMagnitudeV?: number; // Absolute V magnitude M_V
  absoluteMagnitudeG?: number; // Absolute Gaia G magnitude
  colorIndexBMinusV?: number; // B - V color index
  colorIndexBpMinusRp?: number; // Gaia BP - RP color

  // Stellar Evolution & Multiplicity
  stellarAgeGyr?: number;
  variabilityType?: string; // e.g. "BY Draconis", "Flare Star", "Delta Scuti"
  isMultipleStarMember?: boolean;
  multipleStarSystemSlug?: string;
  constellation?: string; // IAU 3-letter or Latin constellation name e.g. "Centaurus", "Andromeda", "Orion"

  // Morphology & Composition
  morphologicalType?: string;
  atmosphereComposition?: Array<{
    molecule: string;
    percentage: number;
  }>;

  // Planetary Ring System
  hasRingSystem?: boolean;
  ringSystem?: {
    innerRadiusKm?: number;
    outerRadiusKm?: number;
    opacity?: number;
    color?: string;
    inclinationDeg?: number;
  };

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
    parallaxMas?: ScientificMeasurement<number>;
    distanceParsecs?: ScientificMeasurement<number>;
    apparentMagnitudeV?: ScientificMeasurement<number>;
  };
}

/**
 * Positional Properties in Astrometric / ICRS Coordinates (J2000 / J2016.5) & Galactic Coordinates
 */
export interface PositionalProperties {
  rightAscensionDeg?: number; // alpha [0, 360)
  declinationDeg?: number; // delta [-90, +90]
  distanceLightYears?: number;
  distanceParsecs?: number;
  distanceKpc?: number; // Kiloparsecs (for Milky Way / globular clusters)
  distanceMpc?: number; // Megaparsecs (for extragalactic galaxies)
  distanceAu?: number;
  distanceKm?: number;
  epoch?: string; // e.g. "J2000.0", "J2016.5"
  referenceFrame?: "ICRS" | "FK5";

  // Galactic Coordinates (IAU J2000 / System II)
  galacticCoordinates?: {
    lDeg: number; // Galactic longitude l [0, 360)
    bDeg: number; // Galactic latitude b [-90, +90]
  };

  // Astrometric Parameters (Gaia DR3 / Hipparcos)
  parallaxMas?: number; // Trigonometric parallax (varpi) in milliarcseconds
  parallaxErrorMas?: number;
  properMotionRaMasYr?: number; // mu_alpha * cos(delta) in mas/yr
  properMotionDecMasYr?: number; // mu_delta in mas/yr
  radialVelocityKmS?: number; // Line-of-sight radial velocity in km/s

  // 3D Cartesian Coordinates relative to Sun (0, 0, 0) in parsecs
  cartesianCoordinatesPc?: {
    x: number;
    y: number;
    z: number;
  };

  distanceUncertainty?: {
    upper?: number;
    lower?: number;
    percentage?: number;
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
  type:
    | "COMMON"
    | "BAYER"
    | "FLAMSTEED"
    | "CATALOG"
    | "HISTORICAL"
    | "EXOPLANET_LETTER"
    | "GAIA"
    | "HIP"
    | "HD"
    | "GLIESE"
    | "MESSIER"
    | "NGC"
    | "IC"
    | "CALDWELL";
  sourceCatalog?: string; // e.g. "GAIA_DR3", "SIMBAD", "HIPPARCOS", "NASA_EXOPLANET_ARCHIVE", "MESSIER", "OPEN_NGC", "NED"
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
    | "TELESCOPIC_OBSERVATION"
    | "ANTIQUITY"
    | "OTHER";
  facility?: string;
  telescope?: string;
  instrument?: string;
  referenceCitation?: string;
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
  slug: string; // URL-safe slug e.g. "sirius-a", "m31-andromeda-galaxy", "m42-orion-nebula"
  canonicalName: string;
  standardDesignation?: string;
  classification: {
    category: CelestialCategory;
    code: CelestialClassificationCode;
  };
  aliases: ObjectAlias[];
  catalogIdentifiers?: CatalogIdentifiers;

  // Hierarchical Relationships
  parentId?: string; // e.g. Earth's parent is Sun
  hostSystemId?: string; // e.g. "solar-system", "trappist-1-system", "alpha-centauri-system"
  hostGalaxyId?: string; // e.g. "milky-way", "andromeda-galaxy"
  childObjectIds?: string[]; // e.g. planets of a star, or moons of a planet

  // Scientific Characteristics
  physical: PhysicalProperties;
  positional: PositionalProperties;
  orbital?: OrbitalProperties;

  // Deep Sky Specific Domain Extensions
  deepSky?: DeepSkyProperties;
  observations?: MultiWavelengthObservation[];

  // Metadata & Provenance
  discovery?: DiscoveryInfo;
  provenance: ProvenanceRecord;
  media?: MediaAssets;
  summary?: string;
  isFeatured?: boolean;
}
