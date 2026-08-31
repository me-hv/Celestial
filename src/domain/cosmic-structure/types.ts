import { ProvenanceRecord } from "../provenance/types";
import { ScientificMeasurement } from "../measurement/types";
import { AssociationConfidence } from "../galactic-structure/types";

export type CosmicStructureType =
  | "GALAXY_GROUP"
  | "GALAXY_CLUSTER"
  | "SUPERCLUSTER"
  | "FILAMENT"
  | "VOID"
  | "WALL"
  | "SHEET"
  | "LARGE_SCALE_STRUCTURE"
  | "COSMIC_WEB_REGION";

export type StructureObservationStatus =
  | "OBSERVED" // Direct spectroscopic / photometric cataloged overdensity
  | "INFERRED" // Derived from peculiar velocity flows / reconstruction (e.g. Cosmicflows)
  | "MODEL_DERIVED" // Parametric gravitational potential / basin boundary (e.g. Laniakea watershed)
  | "ILLUSTRATIVE"; // Conceptual or bounding representation

export type HierarchyRelationshipType =
  | "MEMBER"
  | "SATELLITE"
  | "SUBGROUP"
  | "SUBCLUSTER"
  | "CORE_CLUSTER"
  | "ASSOCIATED"
  | "PART_OF"
  | "WITHIN"
  | "NEAR"
  | "MODEL_DERIVED";

export interface CosmicStructureDimensions {
  majorAxisMpc: ScientificMeasurement<number>;
  minorAxisMpc?: ScientificMeasurement<number>;
  depthMpc?: ScientificMeasurement<number>;
  approximateVolumeMpc3?: number;
  characteristicRadiusMpc?: number;
}

export interface CosmicStructurePhysical {
  estimatedMassSolar?: ScientificMeasurement<number>; // Total gravitational mass (virial/dynamical)
  baryonicMassSolar?: ScientificMeasurement<number>;
  galaxyCountEstimated?: ScientificMeasurement<number>;
  richnessClass?: string; // e.g. Abell Richness Class 0-5
  bautzMorganType?: string; // e.g. "I", "I-II", "II", "III"
  meanVelocityDispersionKmS?: ScientificMeasurement<number>; // sigma_v (e.g. ~800-1000 km/s for Coma/Virgo)
  densityContrastDelta?: number; // delta = (rho - rho_bar) / rho_bar (e.g. delta > 10 for clusters, delta < -0.8 for voids)
  centralDominantGalaxy?: {
    name: string;
    slug?: string;
    catalogId?: string; // e.g. "M87" in Virgo, "NGC 4889" in Coma
  };
}

export interface SupergalacticCoordinates {
  sglDeg: number; // Supergalactic Longitude (0° to 360°)
  sgbDeg: number; // Supergalactic Latitude (-90° to +90°)
  sgxMpc: number;
  sgyMpc: number;
  sgzMpc: number;
}

export interface CosmicStructureCoordinates {
  raDeg: number;
  decDeg: number;
  distanceMpc: ScientificMeasurement<number>;
  distanceLy: ScientificMeasurement<number>;
  spectroscopicRedshiftZ?: ScientificMeasurement<number>;
  heliocentricRadialVelocityKmS?: ScientificMeasurement<number>;
  galactocentricCartesianMpc: {
    xMpc: number;
    yMpc: number;
    zMpc: number;
  };
  supergalactic?: SupergalacticCoordinates;
  lookbackTimeYears: number; // Light travel time: t = d / c
}

export interface SpinePathNode {
  xMpc: number;
  yMpc: number;
  zMpc: number;
  thicknessMpc?: number;
}

export interface CosmicStructureGeometry {
  geometryType: "ELLIPSOID" | "CYLINDRICAL_TUBE" | "PLANAR_SLAB" | "IRREGULAR_HULL";
  boundingRadiusMpc: number;
  ellipsoidRadiiMpc?: {
    rxMpc: number;
    ryMpc: number;
    rzMpc: number;
  };
  spinePath?: SpinePathNode[]; // For filaments (curvilinear path nodes)
  planarNormal?: { x: number; y: number; z: number }; // For sheets/walls
  isModelDerived: boolean;
  notes?: string;
}

export interface ParentCosmicStructure {
  slug: string;
  name: string;
  relationshipType: HierarchyRelationshipType;
  confidence: AssociationConfidence;
}

export interface MemberCosmicStructure {
  slug: string;
  name: string;
  structureType: CosmicStructureType;
  relationshipType: HierarchyRelationshipType;
  confidence?: AssociationConfidence;
}

export interface MemberGalaxyRecord {
  name: string;
  slug?: string;
  catalogId?: string; // e.g. "Messier 87", "NGC 4889", "IC 342"
  isPrimaryMember?: boolean;
}

export interface CosmicStructureDiscovery {
  discoveredBy?: string;
  discoveryYear?: number;
  catalogDesignation?: string; // e.g. "Abell 1656", "ACO 426", "Tully 2014"
  surveyName?: string;
  bibcode?: string;
}

export interface CosmicStructure {
  id: string;
  slug: string;
  name: string;
  standardDesignation?: string;
  aliases?: string[];
  type: CosmicStructureType;
  summary: string;
  description: string;

  coordinates: CosmicStructureCoordinates;
  dimensions: CosmicStructureDimensions;
  physical: CosmicStructurePhysical;
  geometry: CosmicStructureGeometry;

  parentStructure?: ParentCosmicStructure;
  memberStructures?: MemberCosmicStructure[];
  memberGalaxies?: MemberGalaxyRecord[];

  observationStatus: StructureObservationStatus;
  geometryStatus: StructureObservationStatus;

  discovery?: CosmicStructureDiscovery;
  provenance: ProvenanceRecord;

  scientificNotes?: string;
  uncertaintyCaveats?: string;
}
