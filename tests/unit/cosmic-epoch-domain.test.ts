import { describe, it, expect } from "vitest";
import { CosmicEpochSchema } from "@/domain/cosmic-time/schema";
import { COSMIC_EPOCHS_DATA } from "@/lib/data/cosmic-epoch-data";

describe("Cosmic Epoch Domain & Zod Schema Validation", () => {
  it("contains exactly 14 standard cosmological epochs", () => {
    expect(COSMIC_EPOCHS_DATA.length).toBe(14);
  });

  it("validates all 14 epochs against the strict Zod CosmicEpochSchema", () => {
    COSMIC_EPOCHS_DATA.forEach((epoch) => {
      const parsed = CosmicEpochSchema.safeParse(epoch);
      expect(parsed.success).toBe(true);
      if (!parsed.success) {
        console.error("Zod validation error:", parsed.error);
      }
    });
  });

  it("ensures chronological orderIndex values from 1 to 14 without gaps", () => {
    const indices = COSMIC_EPOCHS_DATA.map((e) => e.orderIndex);
    expect(indices).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
  });

  it("ensures all epochs have valid non-negative age and lookback ranges", () => {
    COSMIC_EPOCHS_DATA.forEach((epoch) => {
      expect(epoch.ageRange.minYears).toBeGreaterThanOrEqual(0);
      expect(epoch.ageRange.maxYears).toBeGreaterThanOrEqual(epoch.ageRange.minYears);
      expect(epoch.lookbackTimeRangeGyr.minGyr).toBeGreaterThanOrEqual(0);
      expect(epoch.lookbackTimeRangeGyr.maxGyr).toBeGreaterThanOrEqual(
        epoch.lookbackTimeRangeGyr.minGyr
      );
    });
  });

  it("verifies explicit scientific observation and boundary statuses", () => {
    const statuses = new Set(COSMIC_EPOCHS_DATA.map((e) => e.observationStatus));
    expect(statuses.has("OBSERVED")).toBe(true);
    expect(statuses.has("INFERRED")).toBe(true);
    expect(statuses.has("THEORETICAL")).toBe(true);

    const reionization = COSMIC_EPOCHS_DATA.find((e) => e.slug === "reionization");
    expect(reionization?.observationStatus).toBe("OBSERVED");

    const planck = COSMIC_EPOCHS_DATA.find((e) => e.slug === "planck-epoch");
    expect(planck?.observationStatus).toBe("THEORETICAL");
  });
});
