import { describe, it, expect } from "vitest";
import { DeepSkyNormalizer, RawDeepSkyRecord } from "@/lib/ingestion/deep-sky/deep-sky-normalizer";
import { DeepSkyIngestionPipeline } from "@/lib/ingestion/deep-sky/deep-sky-pipeline";

describe("Deep Sky Ingestion Pipeline", () => {
  const normalizer = new DeepSkyNormalizer();
  const pipeline = new DeepSkyIngestionPipeline();

  it("normalizes raw galaxy record with derived Galactic and ICRS Cartesian coordinates", () => {
    const raw: RawDeepSkyRecord = {
      id_source: "MESSIER_031",
      slug: "m31-andromeda-galaxy",
      canonical_name: "Andromeda Galaxy",
      standard_designation: "M31 / NGC 224",
      classification_code: "GALAXY",
      ra_deg: 10.6847,
      dec_deg: 41.2687,
      distance_ly: 2537000,
      distance_mpc: 0.778,
      v_mag: 3.44,
      constellation: "Andromeda",
      messier_id: "M31",
      ngc_id: "NGC 224",
      aliases: ["M31", "NGC 224", "Andromeda Galaxy"],
      summary: "Major spiral galaxy in the Local Group.",
      deep_sky_properties: {
        type: "GALAXY",
        galaxy: {
          morphologicalType: "SA(s)b",
          redshiftZ: -0.001001,
        },
      },
      source_catalog: "SIMBAD / NED",
      record_identifier: "MESSIER 031",
    };

    const normalized = normalizer.normalize(raw);

    expect(normalized.canonicalName).toBe("Andromeda Galaxy");
    expect(normalized.classification?.category).toBe("DEEP_SKY");
    expect(normalized.classification?.code).toBe("GALAXY");

    // Galactic coordinates derived
    expect(normalized.positional?.galacticCoordinates?.lDeg).toBeDefined();
    expect(normalized.positional?.galacticCoordinates?.bDeg).toBeDefined();

    // Cartesian coordinates derived
    expect(normalized.positional?.cartesianCoordinatesPc).toBeDefined();

    // Catalog Identifiers
    expect(normalized.catalogIdentifiers?.messier).toBe("M31");
    expect(normalized.catalogIdentifiers?.ngc).toBe("NGC 224");
  });

  it("validates full deep-sky entity using DeepSkyIngestionPipeline", () => {
    const raw: RawDeepSkyRecord = {
      id_source: "MESSIER_042",
      slug: "m42-orion-nebula",
      canonical_name: "Orion Nebula",
      classification_code: "NEBULA",
      ra_deg: 83.8221,
      dec_deg: -5.3911,
      distance_ly: 1344,
      v_mag: 4.0,
      constellation: "Orion",
      messier_id: "M42",
      aliases: ["M42", "Orion Nebula"],
      summary: "Diffuse nebula in Orion.",
      deep_sky_properties: {
        type: "NEBULA",
        nebula: {
          nebulaSubtype: "EMISSION",
          angularDiameterArcmin: 65.0,
        },
      },
      source_catalog: "SIMBAD",
      record_identifier: "MESSIER 042",
    };

    const entity = pipeline.processRecord(raw);
    expect(entity.id).toBeDefined();
    expect(entity.slug).toBe("m42-orion-nebula");
    expect(entity.classification.code).toBe("NEBULA");
  });
});
