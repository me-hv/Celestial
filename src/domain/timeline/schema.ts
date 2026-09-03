import { z } from "zod";
import { ProvenanceRecordSchema } from "../provenance/types";
import { EpistemicStatusSchema } from "../mission/schema";

export const TemporalPrecisionSchema = z.enum([
  "EXACT",
  "DAY",
  "MONTH",
  "YEAR",
  "APPROXIMATE",
  "INTERVAL",
  "COSMOLOGICAL",
  "UNKNOWN",
]);

export const TemporalStatusSchema = z.enum([
  "PAST",
  "ONGOING",
  "UPCOMING",
  "PREDICTED",
  "SCHEDULED",
  "UNKNOWN",
]);

export const TemporalEventTypeSchema = z.enum([
  "ASTRONOMICAL_EVENT",
  "MISSION_EVENT",
  "LAUNCH",
  "ARRIVAL",
  "FLYBY",
  "ORBIT_INSERTION",
  "LANDING",
  "SAMPLE_RETURN",
  "OBSERVATION",
  "DISCOVERY",
  "DATA_RELEASE",
  "INSTRUMENT_ACTIVATION",
  "SOLAR_EVENT",
  "SPACE_WEATHER_EVENT",
  "SCIENTIFIC_MILESTONE",
  "ORGANIZATION_EVENT",
  "COSMIC_EPOCH",
  "CUSTOM",
]);

export const TemporalDomainSchema = z.enum([
  "COSMOS",
  "ASTRONOMY",
  "SPACE_MISSIONS",
  "SCIENCE",
  "SPACE_WEATHER",
  "OBSERVATIONS",
  "DATA",
]);

export const TemporalRelationTypeSchema = z.enum([
  "BEFORE",
  "AFTER",
  "DURING",
  "OVERLAPS",
  "STARTS",
  "ENDS",
  "CONCURRENT_WITH",
  "CAUSED_BY",
  "RESULTED_IN",
  "FOLLOWED_BY",
  "PRECEDED_BY",
  "OBSERVED_DURING",
  "DISCOVERED_DURING",
  "DATA_RELEASED_DURING",
  "MISSION_ACTIVE_DURING",
  "VISIBLE_DURING",
]);

export const TemporalConflictSchema = z.object({
  id: z.string().min(1),
  claimA: z.string().min(1),
  sourceA: z.string().min(1),
  claimB: z.string().min(1),
  sourceB: z.string().min(1),
  differenceDescription: z.string().min(1),
  resolutionStatus: z.enum(["RESOLVED", "UNRESOLVED", "CONTEXT_DEPENDENT"]),
  resolutionRationale: z.string().optional(),
});

export const TemporalEventSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  domain: TemporalDomainSchema,
  eventType: TemporalEventTypeSchema,
  startTime: z.string().min(1),
  endTime: z.string().optional(),
  timePrecision: TemporalPrecisionSchema,
  temporalStatus: TemporalStatusSchema,
  targetIds: z.array(z.string()).optional(),
  targetNames: z.array(z.string()).optional(),
  missionIds: z.array(z.string()).optional(),
  organizationIds: z.array(z.string()).optional(),
  datasetIds: z.array(z.string()).optional(),
  discoveryIds: z.array(z.string()).optional(),
  observationIds: z.array(z.string()).optional(),
  sourceReferences: z.array(z.string()),
  epistemicStatus: EpistemicStatusSchema,
  confidenceScore: z.number().min(0).max(1),
  provenance: ProvenanceRecordSchema,
  conflicts: z.array(TemporalConflictSchema).optional(),
  scientificSignificance: z.string().optional(),
  cosmologicalRedshift: z.number().optional(),
  cosmologicalScaleFactor: z.number().optional(),
  lookbackTimeGyr: z.number().optional(),
  tags: z.array(z.string()),
});
