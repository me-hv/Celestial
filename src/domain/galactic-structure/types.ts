import { ProvenanceRecord } from "../provenance/types";
import { ScientificMeasurement } from "../measurement/types";

export type GalacticStructureType =
  | "GALAXY_STRUCTURE"
  | "GALACTIC_DISK"
  | "GALACTIC_BULGE"
  | "GALACTIC_BAR"
  | "GALACTIC_HALO"
  | "SPIRAL_ARM"
  | "GALACTIC_CENTER"
  | "LOCAL_GROUP";

export type AssociationConfidence = "CONFIRMED" | "PROBABLE" | "MODEL_DEPENDENT" | "CANDIDATE";

export interface GalacticStructureAssociation {
  structureId: string;
  structureSlug: string;
  structureName: string;
  associationType: "MEMBER" | "BOUNDED_BY" | "INTERACTING_WITH" | "ORBITING";
  confidence: AssociationConfidence;
  modelSource?: string;
  modelNotes?: string;
}

export interface GalacticDiskProperties {
  thinDiskScaleHeightPc: number; // ~300 pc
  thickDiskScaleHeightPc: number; // ~900 pc
  scaleLengthPc: number; // ~2,600 pc
  radialCutoffKpc: number; // ~15-25 kpc
  stellarMassSolar?: number; // ~5-6 x 10^10 M_sun
  gasMassSolar?: number; // ~1 x 10^10 M_sun
  estimatedRotationSpeedKmS?: number; // ~220-240 km/s
}

export interface GalacticBulgeProperties {
  effectiveRadiusKpc: number; // ~1.5 - 2.0 kpc
  stellarMassSolar?: number; // ~1.5 - 2.0 x 10^10 M_sun
  morphology: "BOXY_PEANUT" | "SPHEROIDAL" | "PSEUDO_BULGE";
  metallicityFeHRange?: { min: number; max: number };
}

export interface GalacticBarProperties {
  halfLengthKpc: number; // ~5.0 kpc
  axisRatio: number; // ~0.4 - 0.5
  patternSpeedKmSPerKpc?: number; // ~40 km/s/kpc
  orientationAngleDeg: number; // ~28° - 33° relative to Sun-GC line
}

export interface GalacticHaloProperties {
  innerRadiusKpc: number;
  outerRadiusKpc: number; // ~100-200 kpc (virial radius)
  stellarHaloMassSolar?: number; // ~10^9 M_sun
  darkMatterHaloMassSolar?: number; // ~1.0 - 1.5 x 10^12 M_sun
  globularClusterCountEstimated?: number; // ~150-160
}

export interface SpiralArmProperties {
  armName: "ORION_SPUR" | "PERSEUS" | "SAGITTARIUS" | "SCUTUM_CENTAURUS" | "OUTER_NORMA" | "OTHER";
  pitchAngleDeg: number; // e.g. 12° for Orion, 10° for Perseus
  referenceRadiusKpc: number; // r_0
  referenceAngleDeg: number; // theta_0
  angleRangeDeg: { start: number; end: number };
  widthKpc?: number;
  isSpurOrSegment?: boolean;
}

export interface GalacticCenterProperties {
  distanceFromSunPc: ScientificMeasurement<number>; // ~8,178 pc ± 26 pc (GRAVITY 2019)
  centralBlackHoleName: string; // Sagittarius A*
  centralBlackHoleMassSolar: ScientificMeasurement<number>; // ~4.154 x 10^6 M_sun
  equatorialCoordinates: {
    raDeg: number; // ~266.4168° (17h 45m 40s)
    decDeg: number; // -29.0078° (-29° 00' 28'')
  };
  galacticCoordinates: {
    lDeg: number; // 0.0° / 359.94°
    bDeg: number; // -0.05°
  };
}

export interface LocalGroupProperties {
  majorGalaxies: string[]; // Milky Way, Andromeda (M31), Triangulum (M33)
  approximateDiameterMpc: number; // ~3.0 Mpc (~10 Mly)
  totalGalaxyCountEstimated: number; // ~80+ dwarf galaxies
  barycenterOffsetKpc?: { x: number; y: number; z: number };
}

export interface GalacticStructureSpatialExtent {
  minGalactocentricRadiusKpc: number;
  maxGalactocentricRadiusKpc: number;
  minZHeightPc?: number;
  maxZHeightPc?: number;
  angularSpanDeg?: { start: number; end: number };
}

export interface GalacticStructure {
  id: string;
  slug: string;
  name: string;
  standardDesignation?: string;
  type: GalacticStructureType;
  aliases?: string[];
  summary: string;
  isModelDerived: boolean;
  modelConfidence: AssociationConfidence;
  spatialExtent: GalacticStructureSpatialExtent;

  // Type-specific properties
  disk?: GalacticDiskProperties;
  bulge?: GalacticBulgeProperties;
  bar?: GalacticBarProperties;
  halo?: GalacticHaloProperties;
  spiralArm?: SpiralArmProperties;
  galacticCenter?: GalacticCenterProperties;
  localGroup?: LocalGroupProperties;

  provenance: ProvenanceRecord;
}
