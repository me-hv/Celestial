import { describe, it, expect } from "vitest";
import {
  SolarSystemNormalizer,
  SolarSystemValidator,
  RawSolarSystemRecord,
} from "@/lib/ingestion/solar-system/normalizer";
import { celestialRepo } from "@/lib/data/celestial-repository";

describe("Solar System Ingestion Pipeline Modules", () => {
  const normalizer = new SolarSystemNormalizer();
  const validator = new SolarSystemValidator();

  it("normalizes raw NASA record into domain partial object", () => {
    const rawRecord: RawSolarSystemRecord = {
      name: "Jupiter",
      designation: "Sol V",
      type: "GAS_GIANT",
      semiMajorAxisAU: 5.203363,
      eccentricity: 0.048392,
      inclinationDeg: 1.3053,
      massKg: 1.8982e27,
      radiusKm: 69911,
      gravityMs2: 24.79,
      meanTempK: 165,
    };

    const normalized = normalizer.normalize(rawRecord);
    expect(normalized.canonicalName).toBe("Jupiter");
    expect(normalized.physical?.massKg).toBe(1.8982e27);
    expect(normalized.orbital?.semiMajorAxisAu).toBe(5.203363);
  });

  it("validates all ingested repository objects against Zod schema", () => {
    const objects = celestialRepo.getAll();
    for (const obj of objects) {
      const validated = validator.validate(obj);
      expect(validated.id).toBe(obj.id);
      expect(validated.canonicalName).toBe(obj.canonicalName);
    }
  });
});
