import { CelestialObject, ObjectAlias } from "@/domain/celestial-object/types";
import {
  CelestialCategory,
  CelestialClassificationCode,
} from "@/domain/celestial-object/classification";
import {
  equatorialToCartesian,
  parallaxToDistance,
  PARSEC_TO_LIGHT_YEARS,
} from "@/lib/astronomy/coordinates/astrometric-coordinates";
import { createMeasurement } from "@/domain/measurement/types";
import { CelestialObjectSchema } from "@/domain/celestial-object/schema";
import { ValidationError } from "@/lib/errors/app-error";

export interface RawGaiaStarRecord {
  source_id: string; // Gaia DR3 Source ID
  designation?: string; // Common name or Bayer designation
  bayer_flamsteed?: string;
  hip_id?: string;
  hd_id?: string;
  gliese_id?: string;
  sao_id?: string;
  ra_deg: number; // Right Ascension (ICRS, deg)
  dec_deg: number; // Declination (ICRS, deg)
  parallax_mas: number; // Parallax in milliarcseconds
  parallax_error_mas?: number;
  pm_ra_mas_yr?: number; // Proper motion RA
  pm_dec_mas_yr?: number; // Proper motion Dec
  radial_velocity_km_s?: number;
  phot_g_mean_mag?: number; // Gaia G band magnitude
  phot_bp_rp_color?: number;
  v_mag?: number; // Visual Johnson magnitude
  abs_v_mag?: number; // Absolute V magnitude
  spectral_class?: string;
  teff_gspphot_k?: number; // Effective temperature (K)
  radius_gspphot_solar?: number; // Radius in R_sun
  mass_flame_solar?: number; // Mass in M_sun
  lum_flame_solar?: number; // Luminosity in L_sun
  fe_h_gspphot_dex?: number; // Metallicity [Fe/H]
  constellation?: string;
  is_multiple_system?: boolean;
  multiple_system_name?: string;
  host_planetary_system_slug?: string; // Slug of StellarSystem if confirmed planets exist
  summary?: string;
  aliases?: string[];
}

export class GaiaStarNormalizer {
  public normalize(raw: RawGaiaStarRecord): Partial<CelestialObject> {
    const canonicalName = raw.designation || `Gaia DR3 ${raw.source_id}`;
    const slug = canonicalName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // 1. Astrometric Distance & Coordinates Derivation
    let distancePc: number;
    let distanceLy: number;
    let distanceErrorPc: number | undefined;

    if (raw.parallax_mas > 0) {
      const distResult = parallaxToDistance(raw.parallax_mas, raw.parallax_error_mas);
      distancePc = distResult.distancePc;
      distanceLy = distResult.distanceLy;
      distanceErrorPc = distResult.distanceErrorPc;
    } else {
      distancePc = 0;
      distanceLy = 0;
    }

    const cartesianPc = equatorialToCartesian(raw.ra_deg, raw.dec_deg, distancePc);

    // 2. Catalog Identifiers and Aliases
    const aliases: ObjectAlias[] = [];
    if (raw.bayer_flamsteed) {
      aliases.push({ name: raw.bayer_flamsteed, type: "BAYER", sourceCatalog: "SIMBAD" });
    }
    if (raw.hip_id) {
      aliases.push({ name: `HIP ${raw.hip_id}`, type: "HIP", sourceCatalog: "HIPPARCOS" });
    }
    if (raw.hd_id) {
      aliases.push({ name: `HD ${raw.hd_id}`, type: "HD", sourceCatalog: "HENRY_DRAPER" });
    }
    if (raw.gliese_id) {
      aliases.push({ name: raw.gliese_id, type: "GLIESE", sourceCatalog: "CNS" });
    }
    aliases.push({ name: `Gaia DR3 ${raw.source_id}`, type: "GAIA", sourceCatalog: "GAIA_DR3" });

    if (raw.aliases) {
      raw.aliases.forEach((a) => {
        if (!aliases.some((existing) => existing.name.toLowerCase() === a.toLowerCase())) {
          aliases.push({ name: a, type: "COMMON", sourceCatalog: "SIMBAD" });
        }
      });
    }

    return {
      slug,
      canonicalName,
      standardDesignation: raw.bayer_flamsteed || `Gaia DR3 ${raw.source_id}`,
      classification: {
        category: CelestialCategory.STELLAR,
        code: CelestialClassificationCode.STAR,
      },
      aliases,
      catalogIdentifiers: {
        gaiaDr3: `Gaia DR3 ${raw.source_id}`,
        hip: raw.hip_id ? `HIP ${raw.hip_id}` : undefined,
        hd: raw.hd_id ? `HD ${raw.hd_id}` : undefined,
        gliese: raw.gliese_id,
        bayer: raw.bayer_flamsteed,
        sao: raw.sao_id,
      },
      hostSystemId: raw.host_planetary_system_slug,
      positional: {
        rightAscensionDeg: Number(raw.ra_deg.toFixed(5)),
        declinationDeg: Number(raw.dec_deg.toFixed(5)),
        distanceParsecs: distancePc,
        distanceLightYears: distanceLy,
        epoch: "J2016.5",
        referenceFrame: "ICRS",
        parallaxMas: raw.parallax_mas,
        parallaxErrorMas: raw.parallax_error_mas,
        properMotionRaMasYr: raw.pm_ra_mas_yr,
        properMotionDecMasYr: raw.pm_dec_mas_yr,
        radialVelocityKmS: raw.radial_velocity_km_s,
        cartesianCoordinatesPc: cartesianPc,
        distanceUncertainty: distanceErrorPc
          ? {
              upper: Number((distanceErrorPc * PARSEC_TO_LIGHT_YEARS).toFixed(4)),
              lower: Number((-distanceErrorPc * PARSEC_TO_LIGHT_YEARS).toFixed(4)),
            }
          : undefined,
      },
      physical: {
        spectralClass: raw.spectral_class,
        apparentMagnitudeV: raw.v_mag,
        apparentMagnitudeG: raw.phot_g_mean_mag,
        absoluteMagnitudeV: raw.abs_v_mag,
        colorIndexBpMinusRp: raw.phot_bp_rp_color,
        effectiveTemperatureK: raw.teff_gspphot_k,
        radiusSolar: raw.radius_gspphot_solar,
        massSolar: raw.mass_flame_solar,
        luminositySolar: raw.lum_flame_solar,
        metallicityDex: raw.fe_h_gspphot_dex,
        constellation: raw.constellation,
        isMultipleStarMember: raw.is_multiple_system,
        multipleStarSystemSlug: raw.multiple_system_name,
        measurementsWithUncertainty: {
          parallaxMas: raw.parallax_error_mas
            ? createMeasurement(raw.parallax_mas, "mas", {
                upper: raw.parallax_error_mas,
                lower: -raw.parallax_error_mas,
              })
            : undefined,
          distanceParsecs: distanceErrorPc
            ? createMeasurement(distancePc, "pc", {
                upper: distanceErrorPc,
                lower: -distanceErrorPc,
              })
            : undefined,
          effectiveTemperatureK: raw.teff_gspphot_k
            ? createMeasurement(raw.teff_gspphot_k, "K")
            : undefined,
          luminositySolar: raw.lum_flame_solar
            ? createMeasurement(raw.lum_flame_solar, "L_sun")
            : undefined,
        },
      },
      provenance: {
        authoritativeBody: "GAIA",
        catalogName: "Gaia Data Release 3 (Gaia DR3)",
        catalogVersion: "DR3_2022",
        recordIdentifier: `GAIA-DR3:${raw.source_id}`,
        confidenceScore: 0.998,
        citationUrl: `https://gea.esac.esa.int/archive/`,
        lastIngestedAt: "2026-08-27T00:00:00Z",
      },
      summary: raw.summary,
    };
  }
}

export class StarValidator {
  public validate(data: unknown): CelestialObject {
    const parseResult = CelestialObjectSchema.safeParse(data);
    if (!parseResult.success) {
      const formatted = parseResult.error.format();
      const starName = (data as { canonicalName?: string })?.canonicalName || "unknown";
      throw new ValidationError(
        `Validation failed for star object '${starName}': ${JSON.stringify(formatted)}`,
        formatted
      );
    }
    return parseResult.data as CelestialObject;
  }
}
