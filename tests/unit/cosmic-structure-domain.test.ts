import { describe, it, expect } from "vitest";
import { CosmicStructureSchema } from "@/domain/cosmic-structure/schema";
import { COSMIC_STRUCTURES_DATA } from "@/lib/data/cosmic-structure-data";

describe("CosmicStructure Domain & Schema", () => {
  it("validates all 18 curated cosmic structures against strict Zod schema", () => {
    expect(COSMIC_STRUCTURES_DATA.length).toBeGreaterThanOrEqual(18);

    COSMIC_STRUCTURES_DATA.forEach((struct) => {
      const parsed = CosmicStructureSchema.safeParse(struct);
      if (!parsed.success) {
        console.error(`Validation failure for ${struct.slug}:`, parsed.error.format());
      }
      expect(parsed.success).toBe(true);
    });
  });

  it("fails validation for invalid structure missing coordinates", () => {
    const invalid = {
      id: "bad-struct",
      slug: "bad-struct",
      name: "Bad Structure",
      type: "GALAXY_CLUSTER",
      summary: "Missing coords",
      description: "Invalid",
      observationStatus: "OBSERVED",
      geometryStatus: "OBSERVED",
      provenance: {
        datasetSlug: "test",
        catalogName: "Test",
        sourceTier: "PRIMARY_AUTHORITATIVE",
        sourceCitation: "Test citation",
        retrievalDate: "2026-08-31",
      },
    };

    const parsed = CosmicStructureSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });

  it("fails validation for invalid RA / Dec out of range", () => {
    const struct = { ...COSMIC_STRUCTURES_DATA[0] };
    const invalidCoords = {
      ...struct,
      coordinates: {
        ...struct.coordinates,
        raDeg: 400.0, // Invalid: RA must be 0 to 360
      },
    };

    const parsed = CosmicStructureSchema.safeParse(invalidCoords);
    expect(parsed.success).toBe(false);
  });
});
