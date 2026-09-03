import {
  DataFreshnessState,
  LiveDataHealth,
  LiveDataRecord,
  LiveDataSource,
  ValidationStatus,
} from "@/domain/live-data/types";
import { liveDataCache } from "./live-data-cache";
import { liveDataRegistry } from "./live-data-registry";

export class LiveDataService {
  private static instance: LiveDataService;
  private readonly healthMap: Map<string, LiveDataHealth> = new Map();

  private constructor() {
    // Initialize health tracker for all known sources
    liveDataRegistry.getAllSources().forEach((src) => {
      this.healthMap.set(src.id, {
        sourceId: src.id,
        sourceName: src.name,
        status: src.status,
        consecutiveFailures: 0,
        validationFailures: 0,
        staleRecordsCount: 0,
        currentFreshness: src.status === "LIVE" ? "FRESH" : "RECENT",
        retryCount: 0,
      });
    });
  }

  public static getInstance(): LiveDataService {
    if (!LiveDataService.instance) {
      LiveDataService.instance = new LiveDataService();
    }
    return LiveDataService.instance;
  }

  /**
   * Calculates explicit scientific freshness state given observation time vs retrieval time
   */
  public calculateFreshness(
    observedAt: Date,
    retrievedAt: Date,
    policy: LiveDataSource["freshnessPolicy"]
  ): DataFreshnessState {
    const now = Date.now();
    const ageSec = (now - observedAt.getTime()) / 1000;
    const retrievalAgeSec = (now - retrievedAt.getTime()) / 1000;

    if (retrievalAgeSec > policy.maxAgeSec) return "EXPIRED";
    if (ageSec > policy.staleThresholdSec || retrievalAgeSec > policy.staleThresholdSec)
      return "STALE";
    if (ageSec > policy.expectedIntervalSec * 2) return "RECENT";
    return "FRESH";
  }

  /**
   * Ingests, validates, normalizes, caches, and returns a typed LiveDataRecord
   */
  public async getRecord<T>(sourceId: string): Promise<LiveDataRecord<T> | null> {
    const source = liveDataRegistry.getSourceById(sourceId);
    if (!source) return null;

    const cacheKey = `live-record:${sourceId}`;
    const cached = liveDataCache.get<T>(cacheKey);

    // If cache entry exists and is fresh, return it
    if (cached && !liveDataCache.isExpired(cacheKey)) {
      return cached.record;
    }

    const adapter = liveDataRegistry.getAdapter<T>(sourceId);
    if (!adapter) {
      // Source without an active live adapter (e.g. AVAILABLE_BUT_NOT_LIVE)
      return null;
    }

    const health = this.healthMap.get(sourceId) || {
      sourceId,
      sourceName: source.name,
      status: source.status,
      consecutiveFailures: 0,
      validationFailures: 0,
      staleRecordsCount: 0,
      currentFreshness: "UNKNOWN",
      retryCount: 0,
    };

    const startTime = Date.now();

    try {
      const raw = await adapter.fetch();
      const latency = Date.now() - startTime;
      health.responseLatencyMs = latency;

      const validation = adapter.validate(raw);
      if (!validation.isValid) {
        health.validationFailures += 1;
        health.lastFailedFetch = new Date().toISOString();
        health.errorMessage = validation.errors.join("; ");
        // Fallback to stale cached if available
        if (cached) {
          health.staleRecordsCount += 1;
          return {
            ...cached.record,
            freshness: "STALE",
            validationStatus: "DEGRADED",
          };
        }
        return null;
      }

      const normalized = adapter.normalize(raw);
      const observedAt = adapter.getObservedAt(raw);
      const retrievedAt = new Date(raw.fetchedAt);
      const provenance = adapter.getProvenance(raw);

      const freshness = this.calculateFreshness(observedAt, retrievedAt, source.freshnessPolicy);
      const validUntil = new Date(
        retrievedAt.getTime() + source.freshnessPolicy.maxAgeSec * 1000
      ).toISOString();

      const record: LiveDataRecord<T> = {
        id: `rec-${sourceId}-${observedAt.getTime()}`,
        sourceId,
        providerId: source.providerId,
        recordIdentifier: `REC-${sourceId.toUpperCase()}-${observedAt.getTime()}`,
        observedAt: observedAt.toISOString(),
        retrievedAt: retrievedAt.toISOString(),
        validUntil,
        dataType: source.supportedDataTypes[0] || "SCIENTIFIC_TELEMETRY",
        payload: raw.rawContent as T,
        normalizedPayload: normalized,
        epistemicStatus: source.epistemicStatus,
        confidenceScore: provenance.confidenceScore || 0.999,
        authoritativeBody: source.authoritativeBody,
        provenance,
        freshness,
        validationStatus: "VALID" as ValidationStatus,
      };

      // Cache record
      const ttlMs = source.freshnessPolicy.expectedIntervalSec * 1000;
      liveDataCache.set<T>(cacheKey, sourceId, record, ttlMs, "VALID");

      // Update health
      health.lastSuccessfulFetch = new Date().toISOString();
      health.consecutiveFailures = 0;
      health.currentFreshness = freshness;
      health.errorMessage = undefined;
      health.status = source.status;

      this.healthMap.set(sourceId, health);
      return record;
    } catch (err) {
      health.consecutiveFailures += 1;
      health.lastFailedFetch = new Date().toISOString();
      health.errorMessage = err instanceof Error ? err.message : "Unknown fetch failure";

      this.healthMap.set(sourceId, health);

      if (cached) {
        health.staleRecordsCount += 1;
        return {
          ...cached.record,
          freshness: "STALE",
          validationStatus: "DEGRADED",
        };
      }
      return null;
    }
  }

  public getAllHealth(): LiveDataHealth[] {
    return Array.from(this.healthMap.values());
  }

  public getHealthForSource(sourceId: string): LiveDataHealth | undefined {
    return this.healthMap.get(sourceId);
  }
}

export const liveDataService = LiveDataService.getInstance();
