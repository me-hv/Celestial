import { z } from "zod";
import { ProvenanceRecordSchema } from "../provenance/types";

export const ConstellationFamilySchema = z.enum([
  "ZODIAC",
  "URSA_MAJOR_FAMILY",
  "PERSEUS_FAMILY",
  "HERCULES_FAMILY",
  "ORION_FAMILY",
  "HEAVENLY_WATERS",
  "BAYER_GROUP",
  "LACAILLE_FAMILY",
]);

export const ConstellationStarRefSchema = z.object({
  name: z.string().min(1),
  bayer: z.string().optional(),
  raDeg: z.number().min(0).max(360),
  decDeg: z.number().min(-90).max(90),
  magnitudeV: z.number().optional(),
  spectralClass: z.string().optional(),
});

export const ConstellationAsterismLineSchema = z.object({
  startStar: z.string().min(1),
  endStar: z.string().min(1),
  startCoords: z.object({
    raDeg: z.number().min(0).max(360),
    decDeg: z.number().min(-90).max(90),
  }),
  endCoords: z.object({
    raDeg: z.number().min(0).max(360),
    decDeg: z.number().min(-90).max(90),
  }),
});

export const ConstellationSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  iauCode: z.string().length(3),
  genitive: z.string().min(1),
  family: ConstellationFamilySchema,
  areaSquareDegrees: z.number().positive(),
  quadrant: z.enum(["NQ1", "NQ2", "NQ3", "NQ4", "SQ1", "SQ2", "SQ3", "SQ4"]),
  centerCoordinates: z.object({
    raDeg: z.number().min(0).max(360),
    decDeg: z.number().min(-90).max(90),
  }),
  brightestStar: z.object({
    name: z.string().min(1),
    designation: z.string().min(1),
    magnitudeV: z.number(),
    raDeg: z.number().min(0).max(360),
    decDeg: z.number().min(-90).max(90),
  }),
  asterismLines: z.array(ConstellationAsterismLineSchema),
  majorStars: z.array(ConstellationStarRefSchema),
  lore: z.string().min(1),
  summary: z.string().min(1),
  provenance: ProvenanceRecordSchema,
});
