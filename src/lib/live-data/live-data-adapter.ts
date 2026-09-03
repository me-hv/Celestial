import { ProvenanceRecord } from "@/domain/provenance/types";
import { ValidationStatus } from "@/domain/live-data/types";

export interface ValidationResult {
  isValid: boolean;
  status: ValidationStatus;
  errors: string[];
}

export interface RawLiveData {
  rawContent: unknown;
  fetchedAt: string;
  sourceUrl: string;
  httpStatus?: number;
}

export interface LiveDataAdapter<T> {
  sourceId: string;
  providerId: string;
  fetch(): Promise<RawLiveData>;
  validate(data: RawLiveData): ValidationResult;
  normalize(data: RawLiveData): T;
  getObservedAt(data: RawLiveData): Date;
  getProvenance(data: RawLiveData): ProvenanceRecord;
}
