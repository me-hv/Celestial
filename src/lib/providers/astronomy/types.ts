import { ProvenanceRecord } from "@/domain/provenance/types";

export type AstronomyDataStatus =
  "CURATED_DATA" | "REFERENCE_DATA" | "LIVE_REMOTE_DATA" | "DERIVED_DATA" | "OFFLINE_FALLBACK";

export interface ProviderResponseMetadata {
  providerId: string;
  providerName: string;
  endpointUrl?: string;
  dataStatus: AstronomyDataStatus;
  retrievedAt: string;
  observationEpoch?: string;
  cacheTtlSeconds?: number;
  isStale?: boolean;
  provenance: ProvenanceRecord;
}

export interface ProviderResult<T> {
  success: boolean;
  data: T | null;
  metadata: ProviderResponseMetadata;
  errorMessage?: string;
}

export interface AstronomicalObjectSearchQuery {
  targetNameOrIdentifier: string;
  catalog?: "GAIA" | "SIMBAD" | "HORIZONS" | "EXOPLANET_ARCHIVE" | "ALL";
  radiusArcsec?: number;
}
