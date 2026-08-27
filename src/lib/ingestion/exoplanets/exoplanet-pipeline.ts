import { CelestialObject } from "@/domain/celestial-object/types";
import { IFetcher, IIngestionPipeline, IMapper } from "../pipeline.interface";
import { IngestionResult } from "../types";
import {
  RawNASAExoplanetRecord,
  NASAExoplanetNormalizer,
  NASAExoplanetValidator,
} from "./normalizer";

export class NASAExoplanetPipeline implements IIngestionPipeline<
  unknown,
  RawNASAExoplanetRecord,
  Partial<CelestialObject>,
  CelestialObject,
  CelestialObject
> {
  constructor(
    public readonly fetcher: IFetcher<unknown, RawNASAExoplanetRecord>,
    public readonly normalizer: NASAExoplanetNormalizer,
    public readonly validator: NASAExoplanetValidator,
    public readonly mapper: IMapper<CelestialObject, CelestialObject>
  ) {}

  public async execute(params: unknown): Promise<IngestionResult<CelestialObject>> {
    const errors: Array<{ recordIdentifier?: string; reason: string }> = [];
    const successfulEntities: CelestialObject[] = [];

    try {
      const rawRecord = await this.fetcher.fetch(params);
      try {
        const normalized = this.normalizer.normalize(rawRecord);
        const mapped = await this.mapper.mapToEntity(normalized as CelestialObject);
        const validated = this.validator.validate(mapped);
        successfulEntities.push(validated);
      } catch (err: unknown) {
        errors.push({
          recordIdentifier: rawRecord.pl_name,
          reason:
            err instanceof Error ? err.message : "Exoplanet normalization or validation failed",
        });
      }

      return {
        success: errors.length === 0,
        totalRecordsProcessed: 1,
        successfulRecords: successfulEntities.length,
        failedRecords: errors.length,
        errors,
        entities: successfulEntities,
      };
    } catch (err: unknown) {
      return {
        success: false,
        totalRecordsProcessed: 0,
        successfulRecords: 0,
        failedRecords: 1,
        errors: [
          {
            reason: err instanceof Error ? err.message : "Pipeline execution failed",
          },
        ],
        entities: [],
      };
    }
  }
}
