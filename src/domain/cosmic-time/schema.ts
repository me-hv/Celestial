import { z } from "zod";
import { ProvenanceRecordSchema } from "../provenance/types";
import { ScientificMeasurementSchema } from "../celestial-object/schema";

export const CosmicEpochTypeSchema = z.enum([
  "PLANCK_EPOCH",
  "INFLATION",
  "ELECTROWEAK_EPOCH",
  "QUARK_EPOCH",
  "HADRON_EPOCH",
  "LEPTON_EPOCH",
  "NUCLEOSYNTHESIS",
  "RECOMBINATION",
  "DARK_AGES",
  "FIRST_STARS",
  "REIONIZATION",
  "EARLY_GALAXIES",
  "GALAXY_ASSEMBLY",
  "MODERN_UNIVERSE",
]);

export const CosmicEpochCategorySchema = z.enum([
  "VERY_EARLY_UNIVERSE",
  "EARLY_UNIVERSE",
  "STRUCTURE_FORMATION",
  "MODERN_UNIVERSE",
]);

export const EpochObservationStatusSchema = z.enum([
  "OBSERVED",
  "INFERRED",
  "MODEL_DERIVED",
  "THEORETICAL",
]);

export const EpochBoundaryConfidenceSchema = z.enum([
  "SHARP_PHYSICAL",
  "OBSERVED_WINDOW",
  "MODEL_DEPENDENT",
  "THEORETICAL_EXTRAPOLATION",
]);

export const CosmicTimeRangeSchema = z.object({
  minYears: z.number().min(0),
  maxYears: z.number().min(0),
  minDisplay: z.string().min(1),
  maxDisplay: z.string().min(1),
});

export const RedshiftRangeSchema = z.object({
  minZ: z.number().min(0),
  maxZ: z.number().min(0),
  minDisplay: z.string().min(1),
  maxDisplay: z.string().min(1),
});

export const ScaleFactorRangeSchema = z.object({
  minA: z.number().min(0).max(1.0),
  maxA: z.number().min(0).max(1.0),
});

export const LookbackTimeRangeGyrSchema = z.object({
  minGyr: z.number().min(0),
  maxGyr: z.number().min(0),
});

export const PhysicalProcessRecordSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  temperatureKelvin: ScientificMeasurementSchema.optional(),
  energyScaleGev: ScientificMeasurementSchema.optional(),
});

export const ObservationalEvidenceRecordSchema = z.object({
  technique: z.string().min(1),
  observatoryOrMission: z.string().optional(),
  primarySignature: z.string().min(1),
  bibcode: z.string().optional(),
});

export const MilestoneEventSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  cosmicAgeYears: z.number().min(0),
  redshiftZ: z.number().min(0).optional(),
  scaleFactorA: z.number().min(0).max(1.0).optional(),
  description: z.string().min(1),
  isCosmologicalMilestone: z.boolean(),
});

export const CosmicEpochSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  tagline: z.string().min(1),
  type: CosmicEpochTypeSchema,
  category: CosmicEpochCategorySchema,
  orderIndex: z.number().int().min(1).max(14),

  ageRange: CosmicTimeRangeSchema,
  redshiftRange: RedshiftRangeSchema.optional(),
  scaleFactorRange: ScaleFactorRangeSchema.optional(),
  lookbackTimeRangeGyr: LookbackTimeRangeGyrSchema,

  summary: z.string().min(1),
  description: z.string().min(1),
  physicalProcesses: z.array(PhysicalProcessRecordSchema),
  observationalEvidence: z.array(ObservationalEvidenceRecordSchema),
  keyMilestones: z.array(MilestoneEventSchema),

  observationStatus: EpochObservationStatusSchema,
  boundaryConfidence: EpochBoundaryConfidenceSchema,
  provenance: ProvenanceRecordSchema,

  scientificNotes: z.string().optional(),
  uncertaintyCaveats: z.string().optional(),
});

export const TimeTypeSchema = z.enum(["LIGHT_TRAVEL_TIME", "COSMOLOGICAL_LOOKBACK_TIME"]);

export const ObservationTimeModelSchema = z.object({
  timeType: TimeTypeSchema,
  distanceMpc: z.number().min(0),
  distanceLy: z.number().min(0),
  lookbackYears: z.number().min(0),
  lookbackGyr: z.number().min(0),
  redshiftZ: z.number().min(0).optional(),
  scaleFactorA: z.number().min(0).max(1.0).optional(),
  cosmicAgeGyr: z.number().min(0).optional(),
  cosmicAgeYears: z.number().min(0).optional(),
  epochSlug: z.string().optional(),
  epochName: z.string().optional(),
  isCosmological: z.boolean(),
  scientificExplanation: z.string().min(1),
});

export type CosmicEpochParsed = z.infer<typeof CosmicEpochSchema>;
export type ObservationTimeModelParsed = z.infer<typeof ObservationTimeModelSchema>;
