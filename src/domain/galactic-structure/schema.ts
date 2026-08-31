import { z } from "zod";
import { ProvenanceRecordSchema } from "../provenance/types";
import { ScientificMeasurementSchema } from "../celestial-object/schema";

export const GalacticStructureTypeSchema = z.enum([
  "GALAXY_STRUCTURE",
  "GALACTIC_DISK",
  "GALACTIC_BULGE",
  "GALACTIC_BAR",
  "GALACTIC_HALO",
  "SPIRAL_ARM",
  "GALACTIC_CENTER",
  "LOCAL_GROUP",
]);

export const AssociationConfidenceSchema = z.enum([
  "CONFIRMED",
  "PROBABLE",
  "MODEL_DEPENDENT",
  "CANDIDATE",
]);

export const GalacticStructureAssociationSchema = z.object({
  structureId: z.string(),
  structureSlug: z.string(),
  structureName: z.string(),
  associationType: z.enum(["MEMBER", "BOUNDED_BY", "INTERACTING_WITH", "ORBITING"]),
  confidence: AssociationConfidenceSchema,
  modelSource: z.string().optional(),
  modelNotes: z.string().optional(),
});

export const GalacticDiskPropertiesSchema = z.object({
  thinDiskScaleHeightPc: z.number().positive(),
  thickDiskScaleHeightPc: z.number().positive(),
  scaleLengthPc: z.number().positive(),
  radialCutoffKpc: z.number().positive(),
  stellarMassSolar: z.number().positive().optional(),
  gasMassSolar: z.number().positive().optional(),
  estimatedRotationSpeedKmS: z.number().positive().optional(),
});

export const GalacticBulgePropertiesSchema = z.object({
  effectiveRadiusKpc: z.number().positive(),
  stellarMassSolar: z.number().positive().optional(),
  morphology: z.enum(["BOXY_PEANUT", "SPHEROIDAL", "PSEUDO_BULGE"]),
  metallicityFeHRange: z
    .object({
      min: z.number(),
      max: z.number(),
    })
    .optional(),
});

export const GalacticBarPropertiesSchema = z.object({
  halfLengthKpc: z.number().positive(),
  axisRatio: z.number().min(0).max(1),
  patternSpeedKmSPerKpc: z.number().positive().optional(),
  orientationAngleDeg: z.number(),
});

export const GalacticHaloPropertiesSchema = z.object({
  innerRadiusKpc: z.number().nonnegative(),
  outerRadiusKpc: z.number().positive(),
  stellarHaloMassSolar: z.number().positive().optional(),
  darkMatterHaloMassSolar: z.number().positive().optional(),
  globularClusterCountEstimated: z.number().int().nonnegative().optional(),
});

export const SpiralArmPropertiesSchema = z.object({
  armName: z.enum([
    "ORION_SPUR",
    "PERSEUS",
    "SAGITTARIUS",
    "SCUTUM_CENTAURUS",
    "OUTER_NORMA",
    "OTHER",
  ]),
  pitchAngleDeg: z.number(),
  referenceRadiusKpc: z.number().positive(),
  referenceAngleDeg: z.number(),
  angleRangeDeg: z.object({
    start: z.number(),
    end: z.number(),
  }),
  widthKpc: z.number().positive().optional(),
  isSpurOrSegment: z.boolean().optional(),
});

export const GalacticCenterPropertiesSchema = z.object({
  distanceFromSunPc: ScientificMeasurementSchema,
  centralBlackHoleName: z.string(),
  centralBlackHoleMassSolar: ScientificMeasurementSchema,
  equatorialCoordinates: z.object({
    raDeg: z.number().min(0).max(360),
    decDeg: z.number().min(-90).max(90),
  }),
  galacticCoordinates: z.object({
    lDeg: z.number().min(0).max(360),
    bDeg: z.number().min(-90).max(90),
  }),
});

export const LocalGroupPropertiesSchema = z.object({
  majorGalaxies: z.array(z.string()),
  approximateDiameterMpc: z.number().positive(),
  totalGalaxyCountEstimated: z.number().int().positive(),
  barycenterOffsetKpc: z
    .object({
      x: z.number(),
      y: z.number(),
      z: z.number(),
    })
    .optional(),
});

export const GalacticStructureSpatialExtentSchema = z.object({
  minGalactocentricRadiusKpc: z.number().nonnegative(),
  maxGalactocentricRadiusKpc: z.number().positive(),
  minZHeightPc: z.number().optional(),
  maxZHeightPc: z.number().optional(),
  angularSpanDeg: z
    .object({
      start: z.number(),
      end: z.number(),
    })
    .optional(),
});

export const GalacticStructureSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  standardDesignation: z.string().optional(),
  type: GalacticStructureTypeSchema,
  aliases: z.array(z.string()).optional(),
  summary: z.string(),
  isModelDerived: z.boolean(),
  modelConfidence: AssociationConfidenceSchema,
  spatialExtent: GalacticStructureSpatialExtentSchema,

  disk: GalacticDiskPropertiesSchema.optional(),
  bulge: GalacticBulgePropertiesSchema.optional(),
  bar: GalacticBarPropertiesSchema.optional(),
  halo: GalacticHaloPropertiesSchema.optional(),
  spiralArm: SpiralArmPropertiesSchema.optional(),
  galacticCenter: GalacticCenterPropertiesSchema.optional(),
  localGroup: LocalGroupPropertiesSchema.optional(),

  provenance: ProvenanceRecordSchema,
});
