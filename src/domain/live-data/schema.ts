import { z } from "zod";
import { ProvenanceRecordSchema } from "../provenance/types";
import { EpistemicStatusSchema } from "../mission/schema";

export const LiveDataSourceTypeSchema = z.enum([
  "API",
  "JSON_FEED",
  "XML_FEED",
  "TEXT_FEED",
  "STREAM",
  "ARCHIVE",
  "WEB_RESOURCE",
  "MANUAL",
  "COMPUTED",
]);

export const LiveDataSourceAvailabilitySchema = z.enum([
  "LIVE",
  "RECENT",
  "HISTORICAL",
  "AVAILABLE_BUT_NOT_LIVE",
  "DEGRADED",
  "OFFLINE",
  "UNKNOWN",
]);

export const DataFreshnessStateSchema = z.enum(["FRESH", "RECENT", "STALE", "EXPIRED", "UNKNOWN"]);

export const ValidationStatusSchema = z.enum(["VALID", "DEGRADED", "INVALID"]);

export const FreshnessPolicySchema = z.object({
  maxAgeSec: z.number().positive(),
  staleThresholdSec: z.number().positive(),
  expectedIntervalSec: z.number().positive(),
});

export const LiveDataSourceSchema = z.object({
  id: z.string().min(1),
  providerId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  sourceType: LiveDataSourceTypeSchema,
  endpointReference: z.string().min(1),
  updateFrequency: z.enum([
    "CONTINUOUS",
    "MINUTELY",
    "HOURLY",
    "DAILY",
    "WEEKLY",
    "MONTHLY",
    "STATIC_RELEASE",
  ]),
  expectedLatencyMs: z.number().nonnegative(),
  status: LiveDataSourceAvailabilitySchema,
  supportedDataTypes: z.array(z.string()),
  authoritativeBody: z.string().min(1),
  epistemicStatus: EpistemicStatusSchema,
  lastRetrievedAt: z.string().optional(),
  lastSuccessfulRetrievalAt: z.string().optional(),
  freshnessPolicy: FreshnessPolicySchema,
  provenance: ProvenanceRecordSchema,
});

export const LiveDataRecordSchema = z.object({
  id: z.string().min(1),
  sourceId: z.string().min(1),
  providerId: z.string().min(1),
  recordIdentifier: z.string().min(1),
  observedAt: z.string().min(1),
  retrievedAt: z.string().min(1),
  validUntil: z.string().min(1),
  dataType: z.string().min(1),
  payload: z.unknown(),
  normalizedPayload: z.unknown(),
  epistemicStatus: EpistemicStatusSchema,
  confidenceScore: z.number().min(0).max(1),
  authoritativeBody: z.string().min(1),
  provenance: ProvenanceRecordSchema,
  freshness: DataFreshnessStateSchema,
  validationStatus: ValidationStatusSchema,
});
