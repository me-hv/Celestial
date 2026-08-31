import { describe, it, expect } from "vitest";
import { CMBLastScatteringSurfaceSchema } from "@/domain/observable-universe/schema";
import { CMB_DETAILED_DATA } from "@/lib/data/observable-universe-data";

describe("Cosmic Microwave Background (CMB) Domain Model & Validation", () => {
  it("validates CMB_DETAILED_DATA against CMBLastScatteringSurfaceSchema", () => {
    const result = CMBLastScatteringSurfaceSchema.safeParse(CMB_DETAILED_DATA);
    expect(result.success, `CMB validation failed: ${JSON.stringify(result)}`).toBe(true);
  });

  it("contains standard observational cosmological parameters for the CMB", () => {
    expect(CMB_DETAILED_DATA.redshiftZ).toBeCloseTo(1089.0, 0);
    expect(CMB_DETAILED_DATA.temperatureKelvinToday).toBeCloseTo(2.7255, 4);
    expect(CMB_DETAILED_DATA.cosmicAgeYears).toBe(379000);
    expect(CMB_DETAILED_DATA.dipoleVelocityKmS).toBe(369.0);
    expect(CMB_DETAILED_DATA.status).toBe("OBSERVED");
  });

  it("indexes major observational missions (Planck, WMAP, COBE, ACT)", () => {
    expect(CMB_DETAILED_DATA.missions.length).toBeGreaterThanOrEqual(4);
    const missionNames = CMB_DETAILED_DATA.missions.map((m) => m.name);
    expect(missionNames.some((n) => n.includes("Planck"))).toBe(true);
    expect(missionNames.some((n) => n.includes("WMAP"))).toBe(true);
    expect(missionNames.some((n) => n.includes("COBE"))).toBe(true);
  });

  it("indexes primary acoustic peak multipoles (l ≈ 220, 540, 800)", () => {
    expect(CMB_DETAILED_DATA.acousticPeaks.length).toBe(3);
    expect(CMB_DETAILED_DATA.acousticPeaks[0].multipoleL).toBe(220);
    expect(CMB_DETAILED_DATA.acousticPeaks[1].multipoleL).toBe(540);
    expect(CMB_DETAILED_DATA.acousticPeaks[2].multipoleL).toBe(800);
  });
});
