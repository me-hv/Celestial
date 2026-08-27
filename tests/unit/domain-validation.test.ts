import { describe, it, expect } from "vitest";
import { CelestialObjectSchema } from "@/domain/celestial-object/schema";
import {
  CelestialCategory,
  CelestialClassificationCode,
} from "@/domain/celestial-object/classification";

describe("CelestialObject Domain Validation Schema", () => {
  it("successfully validates a complete canonical celestial object", () => {
    const earthPayload = {
      id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      slug: "earth",
      canonicalName: "Earth",
      standardDesignation: "Sol III",
      classification: {
        category: CelestialCategory.PLANETARY,
        code: CelestialClassificationCode.TERRESTRIAL_PLANET,
      },
      aliases: [
        { name: "Terra", type: "HISTORICAL" as const },
        { name: "The Blue Planet", type: "COMMON" as const },
      ],
      physical: {
        massKg: 5.972e24,
        meanRadiusKm: 6371.0,
        surfaceGravityMs2: 9.807,
        meanTemperatureK: 288,
        atmosphereComposition: [
          { molecule: "N2", percentage: 78.08 },
          { molecule: "O2", percentage: 20.95 },
        ],
      },
      positional: {
        distanceAu: 1.0,
      },
      orbital: {
        semiMajorAxisAu: 1.00000011,
        eccentricity: 0.0167,
        orbitalPeriodDays: 365.256,
        inclinationDeg: 0.00005,
      },
      discovery: {
        method: "ANTIQUITY" as const,
      },
      provenance: {
        sourceId: "src-nasa-ssd-001",
        authoritativeBody: "NASA" as const,
        catalogName: "NASA Planetary Fact Sheet",
        recordIdentifier: "SSD:EARTH",
        confidenceScore: 0.99,
        retrievedAt: new Date().toISOString(),
      },
      summary: "Third planet from the Sun and the only astronomical object known to harbor life.",
      isFeatured: true,
    };

    const result = CelestialObjectSchema.safeParse(earthPayload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.canonicalName).toBe("Earth");
      expect(result.data.classification.category).toBe(CelestialCategory.PLANETARY);
    }
  });

  it("rejects an invalid slug format", () => {
    const invalidSlugPayload = {
      id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      slug: "Earth With Spaces!",
      canonicalName: "Earth",
      classification: {
        category: CelestialCategory.PLANETARY,
        code: CelestialClassificationCode.TERRESTRIAL_PLANET,
      },
      provenance: {
        sourceId: "src-1",
        authoritativeBody: "NASA" as const,
        catalogName: "Catalog",
        recordIdentifier: "ID-1",
        confidenceScore: 1,
        retrievedAt: new Date().toISOString(),
      },
    };

    const result = CelestialObjectSchema.safeParse(invalidSlugPayload);
    expect(result.success).toBe(false);
  });

  it("rejects invalid orbital eccentricity greater than 1", () => {
    const invalidEccentricity = {
      id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      slug: "hyperbolic-comet",
      canonicalName: "Comet X",
      classification: {
        category: CelestialCategory.MINOR_BODY,
        code: CelestialClassificationCode.COMET,
      },
      orbital: {
        eccentricity: 1.5, // Elliptical orbit schema expects 0 <= e <= 1
      },
      provenance: {
        sourceId: "src-1",
        authoritativeBody: "IAU" as const,
        catalogName: "MPC",
        recordIdentifier: "MPC:CX",
        confidenceScore: 0.9,
        retrievedAt: new Date().toISOString(),
      },
    };

    const result = CelestialObjectSchema.safeParse(invalidEccentricity);
    expect(result.success).toBe(false);
  });
});
