import { z } from "zod";
import { ProvenanceRecordSchema } from "../provenance/types";
import { EpistemicStatusSchema } from "../mission/schema";

export const SkyTwilightPhaseSchema = z.enum([
  "DAYLIGHT",
  "CIVIL_TWILIGHT",
  "NAUTICAL_TWILIGHT",
  "ASTRONOMICAL_TWILIGHT",
  "TRUE_NIGHT",
]);

export const TargetObservationQualitySchema = z.enum([
  "BEST",
  "GOOD",
  "FAIR",
  "POOR",
  "NOT_VISIBLE",
]);

export const TargetObservationRecommendationSchema = z.object({
  targetSlug: z.string().min(1),
  name: z.string().min(1),
  domain: z.enum(["SOLAR_SYSTEM", "STELLAR", "DEEP_SKY", "GALACTIC"]),
  category: z.string().min(1),
  apparentMagnitudeV: z.number().optional(),
  altitudeDeg: z.number(),
  azimuthDeg: z.number(),
  airmass: z.number().positive(),
  altitudeTrend: z.enum(["RISING", "CULMINATING", "SETTING"]),
  quality: TargetObservationQualitySchema,
  score: z.number().min(0).max(100),
  bestObservationTime: z.string().optional(),
  reason: z.string(),
  limitations: z.array(z.string()),
  epistemicStatus: EpistemicStatusSchema,
  provenance: ProvenanceRecordSchema,
});
