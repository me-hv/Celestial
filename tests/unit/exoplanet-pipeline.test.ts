import { describe, it, expect } from "vitest";
import {
  NASAExoplanetNormalizer,
  NASAExoplanetValidator,
  RawNASAExoplanetRecord,
} from "@/lib/ingestion/exoplanets/normalizer";
import { CelestialObject } from "@/domain/celestial-object/types";

describe("NASA Exoplanet Ingestion Pipeline", () => {
  const normalizer = new NASAExoplanetNormalizer();
  const validator = new NASAExoplanetValidator();

  it("normalizes raw NASA record preserving missing/null values and uncertainties", () => {
    const raw: RawNASAExoplanetRecord = {
      pl_name: "Kepler-452 b",
      hostname: "Kepler-452",
      pl_letter: "b",
      discoverymethod: "Transit",
      disc_year: 2015,
      disc_facility: "Kepler Space Telescope",
      pl_orbper: 384.843,
      pl_orbpererr1: 0.007,
      pl_orbpererr2: -0.007,
      pl_orbsmax: 1.046,
      pl_rade: 1.63,
      pl_radeerr1: 0.23,
      pl_radeerr2: -0.15,
      // pl_masse is missing in discovery radial velocity data!
      sy_dist: 550.0,
    };

    const normalized = normalizer.normalize(raw);

    expect(normalized.canonicalName).toBe("Kepler-452 b");
    expect(normalized.classification?.code).toBe("SUPER_EARTH");
    expect(normalized.physical?.radiusEarth).toBe(1.63);

    // Missing mass must NOT be converted to 0
    expect(normalized.physical?.massEarth).toBeUndefined();
    expect(normalized.physical?.massKg).toBeUndefined();

    // Preserves uncertainty error bars
    const radiusUncertainty =
      normalized.physical?.measurementsWithUncertainty?.radiusEarth?.uncertainty;
    expect(radiusUncertainty?.upper).toBe(0.23);
    expect(radiusUncertainty?.lower).toBe(-0.15);

    // Provenance must point to NASA Exoplanet Archive
    expect(normalized.provenance?.authoritativeBody).toBe("NASA");
    expect(normalized.provenance?.recordIdentifier).toBe("NASA-EXOPLANET:Kepler-452 b");
  });

  it("validates normalized exoplanet entity against Zod schema", () => {
    const raw: RawNASAExoplanetRecord = {
      pl_name: "TRAPPIST-1 e",
      hostname: "TRAPPIST-1",
      pl_letter: "e",
      discoverymethod: "Transit",
      disc_year: 2017,
      disc_facility: "Spitzer Space Telescope",
      pl_orbper: 6.0996,
      pl_orbsmax: 0.02925,
      pl_rade: 0.92,
      pl_masse: 0.692,
      sy_dist: 12.47,
    };

    const normalized = normalizer.normalize(raw);
    const fullEntity = {
      ...normalized,
      id: "a0000000-0000-4000-8000-000000000001",
    };

    const validated = validator.validate(fullEntity as unknown as CelestialObject);
    expect(validated.id).toBe("a0000000-0000-4000-8000-000000000001");
    expect(validated.canonicalName).toBe("TRAPPIST-1 e");
  });
});
