import { CelestialObject } from "@/domain/celestial-object/types";
import { GaiaStarNormalizer, RawGaiaStarRecord, StarValidator } from "./star-normalizer";
import { generateDeterministicStarId } from "@/lib/data/stellar-catalog-data";

export class StarIngestionPipeline {
  private readonly normalizer = new GaiaStarNormalizer();
  private readonly validator = new StarValidator();

  /**
   * Deterministic UUID generation for star records based on Gaia source ID.
   */
  public generateDeterministicId(sourceId: string, slug?: string): string {
    return generateDeterministicStarId(sourceId, slug);
  }

  public processRecord(raw: RawGaiaStarRecord): CelestialObject {
    const partial = this.normalizer.normalize(raw);
    const slug = partial.slug || `star-${raw.source_id}`;
    const id = this.generateDeterministicId(raw.source_id, slug);

    const fullEntity: CelestialObject = {
      id,
      slug: partial.slug || `star-${raw.source_id}`,
      canonicalName: partial.canonicalName || `Star ${raw.source_id}`,
      standardDesignation: partial.standardDesignation,
      classification: partial.classification!,
      aliases: partial.aliases || [],
      catalogIdentifiers: partial.catalogIdentifiers,
      hostSystemId: partial.hostSystemId,
      physical: partial.physical || {},
      positional: partial.positional || {},
      provenance: partial.provenance!,
      summary: partial.summary,
    };

    return this.validator.validate(fullEntity);
  }

  public processBatch(records: RawGaiaStarRecord[]): CelestialObject[] {
    return records.map((rec) => this.processRecord(rec));
  }
}
