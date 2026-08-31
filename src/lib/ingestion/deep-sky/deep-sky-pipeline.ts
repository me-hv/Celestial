import { CelestialObject } from "@/domain/celestial-object/types";
import { DeepSkyNormalizer, RawDeepSkyRecord, DeepSkyValidator } from "./deep-sky-normalizer";

export class DeepSkyIngestionPipeline {
  private readonly normalizer = new DeepSkyNormalizer();
  private readonly validator = new DeepSkyValidator();

  /**
   * Deterministic UUID generation for deep-sky entities based on source identifier.
   */
  public generateDeterministicId(sourceId: string): string {
    let hash = 0;
    for (let i = 0; i < sourceId.length; i++) {
      hash = (hash * 31 + sourceId.charCodeAt(i)) >>> 0;
    }
    const hex = hash.toString(16).padStart(12, "0").slice(0, 12);
    return `d0000000-0000-4000-8000-${hex}`;
  }

  public processRecord(raw: RawDeepSkyRecord): CelestialObject {
    const partial = this.normalizer.normalize(raw);
    const id = this.generateDeterministicId(raw.id_source);

    const fullEntity: CelestialObject = {
      id,
      slug: partial.slug || `deep-sky-${raw.id_source.toLowerCase()}`,
      canonicalName: partial.canonicalName || `Object ${raw.id_source}`,
      standardDesignation: partial.standardDesignation,
      classification: partial.classification!,
      aliases: partial.aliases || [],
      catalogIdentifiers: partial.catalogIdentifiers,
      physical: partial.physical || {},
      positional: partial.positional || {},
      deepSky: partial.deepSky,
      observations: partial.observations || [],
      provenance: partial.provenance!,
      summary: partial.summary,
      isFeatured: partial.isFeatured,
    };

    return this.validator.validate(fullEntity);
  }

  public processBatch(records: RawDeepSkyRecord[]): CelestialObject[] {
    return records.map((rec) => this.processRecord(rec));
  }
}
