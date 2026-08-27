import { IngestionResult } from "./types";

/**
 * 1. Fetcher: Responsible for raw API querying, handling network pagination & rate limiting
 */
export interface IFetcher<TRawParams, TRawData> {
  readonly sourceName: string;
  fetch(params: TRawParams): Promise<TRawData>;
}

/**
 * 2. Normalizer: Converts source-specific metric units to standard astronomical SI/IAU units
 */
export interface INormalizer<TRawData, TNormalizedData> {
  normalize(raw: TRawData): Promise<TNormalizedData> | TNormalizedData;
}

/**
 * 3. Validator: Validates normalized scientific data against domain Zod contracts
 */
export interface IValidator<TNormalizedData, TValidatedData> {
  validate(data: TNormalizedData): Promise<TValidatedData> | TValidatedData;
}

/**
 * 4. Mapper: Translates validated schema records into domain entities & alias relations
 */
export interface IMapper<TValidatedData, TEntity> {
  mapToEntity(validated: TValidatedData): Promise<TEntity> | TEntity;
}

/**
 * 5. Ingestion Pipeline: End-to-End Orchestrator
 */
export interface IIngestionPipeline<
  TRawParams,
  TRawData,
  TNormalizedData,
  TValidatedData,
  TEntity,
> {
  readonly fetcher: IFetcher<TRawParams, TRawData>;
  readonly normalizer: INormalizer<TRawData, TNormalizedData>;
  readonly validator: IValidator<TNormalizedData, TValidatedData>;
  readonly mapper: IMapper<TValidatedData, TEntity>;

  execute(params: TRawParams): Promise<IngestionResult<TEntity>>;
}
