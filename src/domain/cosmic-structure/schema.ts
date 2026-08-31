import { z } from "zod";
import { ProvenanceRecordSchema } from "../provenance/types";
import { ScientificMeasurementSchema } from "../celestial-object/schema";
import { AssociationConfidenceSchema } from "../galactic-structure/schema";

export const CosmicStructureTypeSchema = z.enum([
  "GALAXY_GROUP",
  "GALAXY_CLUSTER",
  "SUPERCLUSTER",
  "FILAMENT",
  "VOID",
  "WALL",
  "SHEET",
  "LARGE_SCALE_STRUCTURE",
  "COSMIC_WEB_REGION",
]);

export const StructureObservationStatusSchema = z.enum([
  "OBSERVED",
  "INFERRED",
  "MODEL_DERIVED",
  "ILLUSTRATIVE",
]);

export const HierarchyRelationshipTypeSchema = z.enum([
  "MEMBER",
  "SATELLITE",
  "SUBGROUP",
  "SUBCLUSTER",
  "CORE_CLUSTER",
  "ASSOCIATED",
  "PART_OF",
  "WITHIN",
  "NEAR",
  "MODEL_DERIVED",
]);

export const CosmicStructureDimensionsSchema = z.object({
  majorAxisMpc: ScientificMeasurementSchema,
  minorAxisMpc: ScientificMeasurementSchema.optional(),
  depthMpc: ScientificMeasurementSchema.optional(),
  approximateVolumeMpc3: z.number().positive().optional(),
  characteristicRadiusMpc: z.number().positive().optional(),
});

export const CosmicStructurePhysicalSchema = z.object({
  estimatedMassSolar: ScientificMeasurementSchema.optional(),
  baryonicMassSolar: ScientificMeasurementSchema.optional(),
  galaxyCountEstimated: ScientificMeasurementSchema.optional(),
  richnessClass: z.string().optional(),
  bautzMorganType: z.string().optional(),
  meanVelocityDispersionKmS: ScientificMeasurementSchema.optional(),
  densityContrastDelta: z.number().optional(),
  centralDominantGalaxy: z
    .object({
      name: z.string(),
      slug: z.string().optional(),
      catalogId: z.string().optional(),
    })
    .optional(),
});

export const SupergalacticCoordinatesSchema = z.object({
  sglDeg: z.number().min(0).max(360),
  sgbDeg: z.number().min(-90).max(90),
  sgxMpc: z.number(),
  sgyMpc: z.number(),
  sgzMpc: z.number(),
});

export const CosmicStructureCoordinatesSchema = z.object({
  raDeg: z.number().min(0).max(360),
  decDeg: z.number().min(-90).max(90),
  distanceMpc: ScientificMeasurementSchema,
  distanceLy: ScientificMeasurementSchema,
  spectroscopicRedshiftZ: ScientificMeasurementSchema.optional(),
  heliocentricRadialVelocityKmS: ScientificMeasurementSchema.optional(),
  galactocentricCartesianMpc: z.object({
    xMpc: z.number(),
    yMpc: z.number(),
    zMpc: z.number(),
  }),
  supergalactic: SupergalacticCoordinatesSchema.optional(),
  lookbackTimeYears: z.number().min(0),
});

export const SpinePathNodeSchema = z.object({
  xMpc: z.number(),
  yMpc: z.number(),
  zMpc: z.number(),
  thicknessMpc: z.number().positive().optional(),
});

export const CosmicStructureGeometrySchema = z.object({
  geometryType: z.enum(["ELLIPSOID", "CYLINDRICAL_TUBE", "PLANAR_SLAB", "IRREGULAR_HULL"]),
  boundingRadiusMpc: z.number().positive(),
  ellipsoidRadiiMpc: z
    .object({
      rxMpc: z.number().positive(),
      ryMpc: z.number().positive(),
      rzMpc: z.number().positive(),
    })
    .optional(),
  spinePath: z.array(SpinePathNodeSchema).optional(),
  planarNormal: z
    .object({
      x: z.number(),
      y: z.number(),
      z: z.number(),
    })
    .optional(),
  isModelDerived: z.boolean(),
  notes: z.string().optional(),
});

export const ParentCosmicStructureSchema = z.object({
  slug: z.string(),
  name: z.string(),
  relationshipType: HierarchyRelationshipTypeSchema,
  confidence: AssociationConfidenceSchema,
});

export const MemberCosmicStructureSchema = z.object({
  slug: z.string(),
  name: z.string(),
  structureType: CosmicStructureTypeSchema,
  relationshipType: HierarchyRelationshipTypeSchema,
  confidence: AssociationConfidenceSchema.optional(),
});

export const MemberGalaxyRecordSchema = z.object({
  name: z.string(),
  slug: z.string().optional(),
  catalogId: z.string().optional(),
  isPrimaryMember: z.boolean().optional(),
});

export const CosmicStructureDiscoverySchema = z.object({
  discoveredBy: z.string().optional(),
  discoveryYear: z.number().optional(),
  catalogDesignation: z.string().optional(),
  surveyName: z.string().optional(),
  bibcode: z.string().optional(),
});

export const CosmicStructureSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  standardDesignation: z.string().optional(),
  aliases: z.array(z.string()).optional(),
  type: CosmicStructureTypeSchema,
  summary: z.string(),
  description: z.string(),

  coordinates: CosmicStructureCoordinatesSchema,
  dimensions: CosmicStructureDimensionsSchema,
  physical: CosmicStructurePhysicalSchema,
  geometry: CosmicStructureGeometrySchema,

  parentStructure: ParentCosmicStructureSchema.optional(),
  memberStructures: z.array(MemberCosmicStructureSchema).optional(),
  memberGalaxies: z.array(MemberGalaxyRecordSchema).optional(),

  observationStatus: StructureObservationStatusSchema,
  geometryStatus: StructureObservationStatusSchema,

  discovery: CosmicStructureDiscoverySchema.optional(),
  provenance: ProvenanceRecordSchema,

  scientificNotes: z.string().optional(),
  uncertaintyCaveats: z.string().optional(),
});

export type CosmicStructureParsed = z.infer<typeof CosmicStructureSchema>;
