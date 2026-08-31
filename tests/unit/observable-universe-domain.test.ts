import { describe, it, expect } from "vitest";
import {
  CosmicHorizonSchema,
  RedshiftShellSchema,
  ObservationalLandmarkSchema,
} from "@/domain/observable-universe/schema";
import {
  COSMIC_HORIZONS_DATA,
  REDSHIFT_SHELLS_DATA,
  OBSERVATIONAL_LANDMARKS_DATA,
} from "@/lib/data/observable-universe-data";

describe("Observable Universe Domain Schema & Data Validation", () => {
  it("validates all curated cosmic horizons against CosmicHorizonSchema", () => {
    expect(COSMIC_HORIZONS_DATA.length).toBeGreaterThanOrEqual(4);

    COSMIC_HORIZONS_DATA.forEach((horizon) => {
      const result = CosmicHorizonSchema.safeParse(horizon);
      expect(result.success, `Horizon validation failed for ${horizon.slug}: ${JSON.stringify(result)}`).toBe(true);
    });
  });

  it("validates all 9 redshift shells against RedshiftShellSchema", () => {
    expect(REDSHIFT_SHELLS_DATA.length).toBe(9);

    REDSHIFT_SHELLS_DATA.forEach((shell) => {
      const result = RedshiftShellSchema.safeParse(shell);
      expect(result.success, `Redshift shell validation failed for ${shell.slug}: ${JSON.stringify(result)}`).toBe(true);
      expect(shell.maxRedshiftZ).toBeGreaterThan(shell.minRedshiftZ);
      expect(shell.maxComovingDistanceMpc).toBeGreaterThan(shell.minComovingDistanceMpc);
    });
  });

  it("validates all 12 observational landmarks against ObservationalLandmarkSchema", () => {
    expect(OBSERVATIONAL_LANDMARKS_DATA.length).toBe(12);

    OBSERVATIONAL_LANDMARKS_DATA.forEach((landmark) => {
      const result = ObservationalLandmarkSchema.safeParse(landmark);
      expect(result.success, `Landmark validation failed for ${landmark.slug}: ${JSON.stringify(result)}`).toBe(true);
      expect(landmark.provenance.authoritativeBody).toBeDefined();
    });
  });

  it("explicitly distinguishes scientific statuses (OBSERVED vs MODEL_DERIVED)", () => {
    const cmb = OBSERVATIONAL_LANDMARKS_DATA.find((l) => l.slug === "cmb-surface-landmark");
    expect(cmb?.status).toBe("OBSERVED");

    const horizon = COSMIC_HORIZONS_DATA.find((h) => h.slug === "particle-horizon");
    expect(horizon?.status).toBe("MODEL_DERIVED");
  });
});
