import { describe, it, expect, beforeEach } from "vitest";
import { liveDataService } from "@/lib/live-data/live-data-service";
import { liveDataCache } from "@/lib/live-data/live-data-cache";
import { liveDataRegistry } from "@/lib/live-data/live-data-registry";
import { SpaceWeatherObservation } from "@/domain/space-weather/types";

describe("Live Data Ingestion & Service Engine", () => {
  beforeEach(() => {
    liveDataCache.clear();
  });

  it("registers authoritative live and non-live sources correctly", () => {
    const sources = liveDataRegistry.getAllSources();
    expect(sources.length).toBeGreaterThanOrEqual(6);

    const noaa = liveDataRegistry.getSourceById("src-noaa-swpc-live");
    expect(noaa).toBeDefined();
    expect(noaa?.status).toBe("LIVE");
    expect(noaa?.authoritativeBody).toBe("NOAA");

    const isro = liveDataRegistry.getSourceById("src-isro-issdc-pradan");
    expect(isro).toBeDefined();
    expect(isro?.status).toBe("AVAILABLE_BUT_NOT_LIVE");
  });

  it("fetches, validates, and normalizes NOAA SWPC live record with separate observedAt vs retrievedAt", async () => {
    const record = await liveDataService.getRecord<SpaceWeatherObservation>("src-noaa-swpc-live");
    expect(record).not.toBeNull();
    if (!record) return;

    expect(record.sourceId).toBe("src-noaa-swpc-live");
    expect(record.validationStatus).toBe("VALID");
    expect(record.freshness).toBe("FRESH");
    expect(record.observedAt).toBeDefined();
    expect(record.retrievedAt).toBeDefined();

    // Scientific integrity check: observedAt must be distinct or timestamped properly
    expect(new Date(record.observedAt).getTime()).toBeGreaterThan(0);
    expect(new Date(record.retrievedAt).getTime()).toBeGreaterThan(0);

    // Payload verification
    expect(record.normalizedPayload.solarActivity).toBeDefined();
    expect(record.normalizedPayload.geomagnetic.kpIndex).toBeGreaterThanOrEqual(0);
  });

  it("calculates freshness states correctly based on policy", () => {
    const now = new Date();
    const policy = {
      maxAgeSec: 3600,
      staleThresholdSec: 900,
      expectedIntervalSec: 60,
    };

    // Very recent observation
    const fresh = liveDataService.calculateFreshness(now, now, policy);
    expect(fresh).toBe("FRESH");

    // 20 minutes old observation (stale)
    const staleObs = new Date(Date.now() - 20 * 60 * 1000);
    const stale = liveDataService.calculateFreshness(staleObs, now, policy);
    expect(stale).toBe("STALE");

    // 2 hours old retrieval (expired)
    const expiredRet = new Date(Date.now() - 2 * 3600 * 1000);
    const expired = liveDataService.calculateFreshness(now, expiredRet, policy);
    expect(expired).toBe("EXPIRED");
  });

  it("caches live records and tracks health statistics", async () => {
    await liveDataService.getRecord<SpaceWeatherObservation>("src-noaa-swpc-live");
    const health = liveDataService.getHealthForSource("src-noaa-swpc-live");

    expect(health).toBeDefined();
    expect(health?.consecutiveFailures).toBe(0);
    expect(health?.currentFreshness).toBe("FRESH");
    expect(health?.lastSuccessfulFetch).toBeDefined();
  });
});
