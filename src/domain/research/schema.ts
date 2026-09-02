import { z } from "zod";
import { EpistemicStatusSchema } from "../mission/schema";

export const ResearchDomainTypeSchema = z.enum([
  "PLANET",
  "MOON",
  "STAR",
  "EXOPLANET",
  "STELLAR_SYSTEM",
  "DEEP_SKY",
  "GALAXY",
  "GALACTIC_STRUCTURE",
  "COSMIC_STRUCTURE",
  "CMB",
  "COSMIC_TIME",
  "OBSERVABLE_UNIVERSE",
  "MISSION",
  "SPACECRAFT",
  "INSTRUMENT",
  "ORGANIZATION",
  "DISCOVERY",
  "OBSERVATORY",
  "SOLAR_SYSTEM",
  "STELLAR",
  "GALACTIC",
  "COSMIC_WEB",
]);

export const EquatorialCoordinatesSchema = z.object({
  raDeg: z.number(),
  decDeg: z.number(),
  rightAscensionHours: z.number().optional(),
  declinationDegrees: z.number().optional(),
});

export const ResearchTargetReferenceSchema = z.object({
  id: z.string(),
  slug: z.string(),
  domain: ResearchDomainTypeSchema,
  canonicalName: z.string(),
  standardDesignation: z.string().optional(),
  category: z.string(),
  type: z.string(),
  summary: z.string(),
  equatorialCoordinates: EquatorialCoordinatesSchema.optional(),
  distanceLy: z.number().optional(),
  apparentMagnitudeV: z.number().optional(),
  constellation: z.string().optional(),
  badgeColor: z.enum(["cyan", "violet", "amber", "emerald", "default"]).optional(),
});

export const ObservationQualitySchema = z.enum(["BEST", "GOOD", "FAIR", "POOR", "NOT_VISIBLE"]);

export const ObservationWindowSchema = z.object({
  start: z.string(),
  end: z.string(),
  durationMinutes: z.number(),
  maxAltitudeDeg: z.number(),
  transitTime: z.string().nullable(),
  minAirmass: z.number(),
  twilightState: z.enum(["DAYLIGHT", "CIVIL", "NAUTICAL", "ASTRONOMICAL", "NIGHT"]),
  moonSeparationDeg: z.number(),
  moonIlluminationFraction: z.number(),
  quality: ObservationQualitySchema,
  visibilityScore: z.number().min(0).max(100),
  limitingFactors: z.array(z.string()),
});

export const ObservationConstraintSchema = z.object({
  minAltitudeDeg: z.number().optional(),
  preferredAltitudeDeg: z.number().optional(),
  maxAirmass: z.number().optional(),
  maxMoonIllumination: z.number().min(0).max(1).optional(),
  minMoonSeparationDeg: z.number().optional(),
  minSolarElongationDeg: z.number().optional(),
  twilightRequirement: z.enum(["CIVIL", "NAUTICAL", "ASTRONOMICAL", "ANY"]).optional(),
  minDurationMinutes: z.number().optional(),
  horizonObstructionDeg: z.number().optional(),
});

export const ObservingListSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  targetSlugs: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
  observerLocation: z.any().optional(),
  constraints: ObservationConstraintSchema.optional(),
});

export const ScientificEvidenceSchema = z.object({
  id: z.string(),
  claim: z.string(),
  source: z.string(),
  sourceType: z.enum([
    "NASA",
    "ESA",
    "JPL",
    "SIMBAD",
    "GAIA",
    "EXOPLANET_ARCHIVE",
    "NED",
    "PEER_REVIEWED_PAPER",
    "MISSION_ARCHIVE",
    "CALCULATED_DERIVATION",
  ]),
  publication: z.string().optional(),
  authors: z.array(z.string()).optional(),
  year: z.number().optional(),
  identifier: z.string().optional(),
  doi: z.string().optional(),
  url: z.string().optional(),
  epistemicStatus: EpistemicStatusSchema,
  confidenceScore: z.number().min(0).max(1),
  notes: z.string().optional(),
});

export const ScientificRelationTypeSchema = z.enum([
  "LOCATED_IN",
  "ORBITING",
  "MEMBER_OF",
  "VISITED_BY",
  "OBSERVED_BY",
  "STUDIED_BY",
  "DISCOVERED_BY",
  "DISCOVERY_ABOUT",
  "INSTRUMENT_ON",
  "PART_OF",
  "OPERATED_BY",
  "BUILT_BY",
  "DATA_ARCHIVE_OF",
  "DERIVED_FROM",
  "RELATED_TO",
]);

export const ResearchRelationSchema = z.object({
  id: z.string(),
  sourceId: z.string(),
  sourceSlug: z.string(),
  sourceName: z.string(),
  sourceDomain: ResearchDomainTypeSchema,
  targetId: z.string(),
  targetSlug: z.string(),
  targetName: z.string(),
  targetDomain: ResearchDomainTypeSchema,
  relationType: ScientificRelationTypeSchema,
  epistemicStatus: EpistemicStatusSchema,
  description: z.string(),
});

export const ResearchNoteSchema = z.object({
  id: z.string(),
  targetSlug: z.string(),
  author: z.string().optional(),
  title: z.string(),
  content: z.string(),
  tags: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ResearchCollectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  targetSlugs: z.array(z.string()),
  tags: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ResearchQuerySchema = z.object({
  query: z.string(),
  domain: ResearchDomainTypeSchema.optional(),
  category: z.string().optional(),
  limit: z.number().optional(),
  minDistanceLy: z.number().optional(),
  maxDistanceLy: z.number().optional(),
  epistemicStatus: EpistemicStatusSchema.optional(),
});

export const ResearchProjectSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  hypothesis: z.string().optional(),
  discipline: z.string(),
  tags: z.array(z.string()),
  targetSlugs: z.array(z.string()),
  datasetSlugs: z.array(z.string()),
  missionSlugs: z.array(z.string()),
  observatorySlugs: z.array(z.string()),
  observingListIds: z.array(z.string()),
  notes: z.array(ResearchNoteSchema),
  findings: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "PUBLISHED", "ARCHIVED"]),
  createdAt: z.string(),
  updatedAt: z.string(),
});
