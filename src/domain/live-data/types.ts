import { EpistemicStatus } from "../mission/types";
import { AuthoritativeBody, ProvenanceRecord } from "../provenance/types";

export type LiveDataSourceType =
  | "API"
  | "JSON_FEED"
  | "XML_FEED"
  | "TEXT_FEED"
  | "STREAM"
  | "ARCHIVE"
  | "WEB_RESOURCE"
  | "MANUAL"
  | "COMPUTED";

export type LiveDataSourceAvailability =
  "LIVE" | "RECENT" | "HISTORICAL" | "AVAILABLE_BUT_NOT_LIVE" | "DEGRADED" | "OFFLINE" | "UNKNOWN";

export type DataFreshnessState = "FRESH" | "RECENT" | "STALE" | "EXPIRED" | "UNKNOWN";

export type ValidationStatus = "VALID" | "DEGRADED" | "INVALID";

export interface FreshnessPolicy {
  maxAgeSec: number;
  staleThresholdSec: number;
  expectedIntervalSec: number;
}

export interface LiveDataSource {
  id: string;
  providerId: string;
  name: string;
  description: string;
  sourceType: LiveDataSourceType;
  endpointReference: string;
  updateFrequency:
    "CONTINUOUS" | "MINUTELY" | "HOURLY" | "DAILY" | "WEEKLY" | "MONTHLY" | "STATIC_RELEASE";
  expectedLatencyMs: number;
  status: LiveDataSourceAvailability;
  supportedDataTypes: string[];
  authoritativeBody: AuthoritativeBody;
  epistemicStatus: EpistemicStatus;
  lastRetrievedAt?: string; // ISO 8601
  lastSuccessfulRetrievalAt?: string; // ISO 8601
  freshnessPolicy: FreshnessPolicy;
  provenance: ProvenanceRecord;
}

export interface LiveDataRecord<T = unknown> {
  id: string;
  sourceId: string;
  providerId: string;
  recordIdentifier: string;
  observedAt: string; // ISO 8601 - when measurement occurred in nature
  retrievedAt: string; // ISO 8601 - when downloaded by Celestial
  validUntil: string; // ISO 8601
  dataType: string;
  payload: T;
  normalizedPayload: T;
  epistemicStatus: EpistemicStatus;
  confidenceScore: number;
  authoritativeBody: AuthoritativeBody;
  provenance: ProvenanceRecord;
  freshness: DataFreshnessState;
  validationStatus: ValidationStatus;
}

export interface LiveDataHealth {
  sourceId: string;
  sourceName: string;
  status: LiveDataSourceAvailability;
  lastSuccessfulFetch?: string;
  lastFailedFetch?: string;
  consecutiveFailures: number;
  responseLatencyMs?: number;
  validationFailures: number;
  staleRecordsCount: number;
  currentFreshness: DataFreshnessState;
  errorMessage?: string;
  retryCount: number;
}

export interface CacheEntry<T = unknown> {
  fetchedAt: number; // Unix epoch ms
  expiresAt: number; // Unix epoch ms
  sourceUpdatedAt?: number;
  cacheKey: string;
  sourceId: string;
  record: LiveDataRecord<T>;
  validationStatus: ValidationStatus;
}
