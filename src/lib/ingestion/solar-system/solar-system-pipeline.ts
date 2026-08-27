import { CelestialObject } from "@/domain/celestial-object/types";
import { IFetcher, IIngestionPipeline, IMapper } from "../pipeline.interface";
import { IngestionResult } from "../types";
import { RawSolarSystemRecord, SolarSystemNormalizer, SolarSystemValidator } from "./normalizer";

export class SolarSystemPipeline implements IIngestionPipeline<
  unknown,
  RawSolarSystemRecord,
  Partial<CelestialObject>,
  CelestialObject,
  CelestialObject
> {
  constructor(
    public readonly fetcher: IFetcher<unknown, RawSolarSystemRecord>,
    public readonly normalizer: SolarSystemNormalizer,
    public readonly validator: SolarSystemValidator,
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
          recordIdentifier: rawRecord.name,
          reason: err instanceof Error ? err.message : "Normalization or validation failed",
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
