import { z } from "zod";
import { CelestialCategory, CelestialClassificationCode } from "./classification";

export const ProvenanceRecordSchema = z.object({
  sourceId: z.string().min(1),
  authoritativeBody: z.enum([
    "IAU",
    "NASA",
    "ESA",
    "ESO",
    "SIMBAD",
    "MINOR_PLANET_CENTER",
    "GAIA",
    "PEER_REVIEWED_PAPER",
  ]),
  catalogName: z.string().min(1),
  catalogVersion: z.string().optional(),
  recordIdentifier: z.string().min(1),
  citationUrl: z.string().url().optional(),
  doi: z.string().optional(),
  bibcode: z.string().optional(),
  confidenceScore: z.number().min(0).max(1),
  retrievedAt: z.string().datetime(),
});

export const ObjectAliasSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["COMMON", "BAYER", "FLAMSTEED", "CATALOG", "HISTORICAL"]),
  sourceCatalog: z.string().optional(),
});

export const PhysicalPropertiesSchema = z.object({
  massKg: z.number().positive().optional(),
  massSolar: z.number().positive().optional(),
  massEarth: z.number().positive().optional(),
  meanRadiusKm: z.number().positive().optional(),
  surfaceGravityMs2: z.number().positive().optional(),
  densityGcm3: z.number().positive().optional(),
  meanTemperatureK: z.number().nonnegative().optional(),
  spectralClass: z.string().optional(),
  morphologicalType: z.string().optional(),
  atmosphereComposition: z
    .array(
      z.object({
        molecule: z.string(),
        percentage: z.number().min(0).max(100),
      })
    )
    .optional(),
});

export const PositionalPropertiesSchema = z.object({
  rightAscensionDeg: z.number().min(0).max(360).optional(),
  declinationDeg: z.number().min(-90).max(90).optional(),
  distanceLightYears: z.number().nonnegative().optional(),
  distanceAu: z.number().nonnegative().optional(),
  distanceKm: z.number().nonnegative().optional(),
  epoch: z.string().default("J2000").optional(),
});

export const OrbitalPropertiesSchema = z.object({
  semiMajorAxisAu: z.number().positive().optional(),
  semiMajorAxisKm: z.number().positive().optional(),
  eccentricity: z.number().min(0).max(1).optional(),
  orbitalPeriodDays: z.number().positive().optional(),
  inclinationDeg: z.number().min(0).max(180).optional(),
  longitudeAscendingNodeDeg: z.number().min(-360).max(360).optional(),
  argumentPeriapsisDeg: z.number().min(-360).max(360).optional(),
  meanAnomalyDeg: z.number().min(-360).max(360).optional(),
  epochJulianDate: z.number().positive().optional(),
});

export const CelestialObjectSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be valid kebab-case"),
  canonicalName: z.string().min(1),
  standardDesignation: z.string().optional(),
  classification: z.object({
    category: z.nativeEnum(CelestialCategory),
    code: z.nativeEnum(CelestialClassificationCode),
  }),
  aliases: z.array(ObjectAliasSchema).default([]),
  parentId: z.string().uuid().optional(),
  hostSystemId: z.string().uuid().optional(),
  hostGalaxyId: z.string().uuid().optional(),
  childObjectIds: z.array(z.string().uuid()).optional(),
  physical: PhysicalPropertiesSchema.default({}),
  positional: PositionalPropertiesSchema.default({}),
  orbital: OrbitalPropertiesSchema.optional(),
  discovery: z
    .object({
      year: z.number().int().optional(),
      discoveredBy: z.string().optional(),
      method: z
        .enum(["DIRECT_IMAGING", "TRANSIT", "RADIAL_VELOCITY", "ASTROMETRY", "ANTIQUITY", "OTHER"])
        .optional(),
    })
    .optional(),
  provenance: ProvenanceRecordSchema,
  media: z
    .object({
      thumbnailUrl: z.string().url().optional(),
      textureUrl: z.string().url().optional(),
      credit: z.string().optional(),
    })
    .optional(),
  summary: z.string().optional(),
  isFeatured: z.boolean().default(false),
});

export type CelestialObjectInput = z.infer<typeof CelestialObjectSchema>;
