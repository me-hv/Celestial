import { CacheEntry, LiveDataRecord, ValidationStatus } from "@/domain/live-data/types";

export class LiveDataCache {
  private static instance: LiveDataCache;
  private readonly store: Map<string, CacheEntry<unknown>> = new Map();

  private constructor() {}

  public static getInstance(): LiveDataCache {
    if (!LiveDataCache.instance) {
      LiveDataCache.instance = new LiveDataCache();
    }
    return LiveDataCache.instance;
  }

  public get<T>(cacheKey: string): CacheEntry<T> | undefined {
    const entry = this.store.get(cacheKey) as CacheEntry<T> | undefined;
    if (!entry) return undefined;
    return entry;
  }

  public set<T>(
    cacheKey: string,
    sourceId: string,
    record: LiveDataRecord<T>,
    ttlMs: number,
    validationStatus: ValidationStatus = "VALID"
  ): CacheEntry<T> {
    const now = Date.now();
    const entry: CacheEntry<T> = {
      fetchedAt: now,
      expiresAt: now + ttlMs,
      cacheKey,
      sourceId,
      record,
      validationStatus,
    };
    this.store.set(cacheKey, entry as CacheEntry<unknown>);
    return entry;
  }

  public isExpired(cacheKey: string): boolean {
    const entry = this.store.get(cacheKey);
    if (!entry) return true;
    return Date.now() > entry.expiresAt;
  }

  public clear(): void {
    this.store.clear();
  }

  public size(): number {
    return this.store.size;
  }
}

export const liveDataCache = LiveDataCache.getInstance();
