import { AuthoritativeBody } from "@/domain/provenance/types";

export interface IngestionMetadata {
  sourceName: string;
  authoritativeBody: AuthoritativeBody;
  sourceUrl?: string;
  catalogVersion?: string;
  batchId: string;
  timestamp: string;
}

export interface IngestionResult<TEntity> {
  success: boolean;
  totalRecordsProcessed: number;
  successfulRecords: number;
  failedRecords: number;
  errors: Array<{
    recordIdentifier?: string;
    reason: string;
    details?: unknown;
  }>;
  entities: TEntity[];
}
