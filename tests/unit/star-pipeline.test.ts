import { describe, it, expect } from "vitest";
import {
  GaiaStarNormalizer,
  RawGaiaStarRecord,
} from "@/lib/ingestion/stars/star-normalizer";
import { StarIngestionPipeline } from "@/lib/ingestion/stars/star-pipeline";

describe("Gaia Star Ingestion Pipeline", () => {
  const normalizer = new GaiaStarNormalizer();
  const pipeline = new StarIngestionPipeline();

  it("normalizes raw Gaia record into domain star entity with derived astrometry and 3D Cartesian coordinates", () => {
    const raw: RawGaiaStarRecord = {
      source_id: "5853498713190525696",
      designation: "Proxima Centauri",
      bayer_flamsteed: "Alpha Centauri C",
      hip_id: "70890",
      hd_id: "128620C",
      gliese_id: "GJ 551",
      ra_deg: 217.42894,
      dec_deg: -62.67949,
      parallax_mas: 768.0665,
      parallax_error_mas: 0.0499,
      pm_ra_mas_yr: -3781.741,
      pm_dec_mas_yr: 769.465,
      radial_velocity_km_s: -22.2,
      phot_g_mean_mag: 11.13,
      v_mag: 11.05,
      abs_v_mag: 15.6,
      spectral_class: "M5.5Ve",
      teff_gspphot_k: 3042,
      radius_gspphot_solar: 0.154,
      mass_flame_solar: 0.122,
      lum_flame_solar: 0.0017,
      constellation: "Centaurus",
    };

    const normalized = normalizer.normalize(raw);

    expect(normalized.canonicalName).toBe("Proxima Centauri");
    expect(normalized.standardDesignation).toBe("Alpha Centauri C");
    expect(normalized.classification?.category).toBe("STELLAR");
    expect(normalized.classification?.code).toBe("STAR");

    // Derived distance: 1000 / 768.0665 ≈ 1.302 pc ≈ 4.246 ly
    expect(normalized.positional?.distanceParsecs).toBeCloseTo(1.302, 2);
    expect(normalized.positional?.distanceLightYears).toBeCloseTo(4.246, 2);

    // 3D Cartesian coordinates must be non-zero and bounded by distance
    const cartesian = normalized.positional?.cartesianCoordinatesPc;
    expect(cartesian).toBeDefined();
    const r = Math.sqrt(cartesian!.x ** 2 + cartesian!.y ** 2 + cartesian!.z ** 2);
    expect(r).toBeCloseTo(normalized.positional!.distanceParsecs!, 2);

    // Catalog Identifiers
    expect(normalized.catalogIdentifiers?.gaiaDr3).toBe("Gaia DR3 5853498713190525696");
    expect(normalized.catalogIdentifiers?.hip).toBe("HIP 70890");
    expect(normalized.catalogIdentifiers?.hd).toBe("HD 128620C");
    expect(normalized.catalogIdentifiers?.gliese).toBe("GJ 551");

    // Uncertainty Preservation
    expect(normalized.physical?.measurementsWithUncertainty?.parallaxMas?.uncertainty).toBeDefined();
    expect(normalized.positional?.distanceUncertainty).toBeDefined();
  });

  it("validates full star entity using StarValidator and StarIngestionPipeline", () => {
    const raw: RawGaiaStarRecord = {
      source_id: "2104829104829104820",
      designation: "Vega",
      bayer_flamsteed: "Alpha Lyrae",
      hip_id: "91262",
      hd_id: "172167",
      ra_deg: 279.23473,
      dec_deg: 38.78369,
      parallax_mas: 130.23,
      parallax_error_mas: 0.36,
      phot_g_mean_mag: 0.03,
      v_mag: 0.03,
      spectral_class: "A0Va",
      teff_gspphot_k: 9602,
    };

    const star = pipeline.processRecord(raw);
    expect(star.id).toBeDefined();
    expect(star.slug).toBe("vega");
    expect(star.canonicalName).toBe("Vega");
    expect(star.physical.spectralClass).toBe("A0Va");
  });
});
