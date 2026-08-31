import { CelestialObject } from "@/domain/celestial-object/types";
import { CelestialObjectSchema } from "@/domain/celestial-object/schema";
import { ValidationError } from "@/lib/errors/app-error";
import {
  equatorialToCartesian,
  parsecsToLightYears,
  lightYearsToParsecs,
} from "@/lib/astronomy/coordinates/astrometric-coordinates";
import { equatorialToGalactic } from "@/lib/astronomy/coordinates/equatorial-to-galactic";
import { DeepSkyProperties, MultiWavelengthObservation } from "@/domain/deep-sky/types";

export interface RawDeepSkyRecord {
  id_source: string; // e.g. "MESSIER_031", "NGC_0224"
  slug: string;
  canonical_name: string;
  standard_designation?: string;
  classification_code:
    "GALAXY" | "NEBULA" | "STAR_CLUSTER" | "PLANETARY_NEBULA" | "SUPERNOVA_REMNANT";
  ra_deg: number;
  dec_deg: number;
  distance_ly?: number;
  distance_pc?: number;
  distance_kpc?: number;
  distance_mpc?: number;
  distance_uncertainty_ly?: { upper?: number; lower?: number; percentage?: number };
  distance_method?:
    | "TRIGONOMETRIC_PARALLAX"
    | "CEPHEID_VARIABLE"
    | "TIP_OF_RED_GIANT_BRANCH"
    | "TYPE_IA_SUPERNOVA"
    | "SURFACE_BRIGHTNESS_FLUCTUATIONS"
    | "REDSHIFT_HUBBLE_FLOW"
    | "CLUSTER_MAIN_SEQUENCE_FITTING"
    | "LITERATURE_CONSENSUS";
  v_mag?: number;
  apparent_magnitude_v?: number;
  constellation: string;
  messier_id?: string;
  ngc_id?: string;
  ic_id?: string;
  caldwell_id?: string;
  pgc_id?: string;
  ugc_id?: string;
  aliases: string[];
  summary: string;
  deep_sky_properties: DeepSkyProperties;
  observations?: MultiWavelengthObservation[];
  source_catalog: string; // e.g. "SIMBAD / NED / OpenNGC"
  record_identifier: string;
  citation_url?: string;
}

export class DeepSkyNormalizer {
  public normalize(raw: RawDeepSkyRecord): Partial<CelestialObject> {
    // 1. Distance normalizations
    let distanceLy = raw.distance_ly;
    let distancePc = raw.distance_pc;
    let distanceKpc = raw.distance_kpc;
    let distanceMpc = raw.distance_mpc;

    if (distanceLy !== undefined && distancePc === undefined) {
      distancePc = lightYearsToParsecs(distanceLy);
    } else if (distancePc !== undefined && distanceLy === undefined) {
      distanceLy = parsecsToLightYears(distancePc);
    }

    if (distancePc !== undefined) {
      distanceKpc = Number((distancePc / 1000).toFixed(4));
      distanceMpc = Number((distancePc / 1000000).toFixed(6));
    }

    // 2. Astrometric ICRS Cartesian Coordinates relative to Sun
    const cartesianCoordinatesPc =
      distancePc !== undefined
        ? equatorialToCartesian(raw.ra_deg, raw.dec_deg, distancePc)
        : undefined;

    // 3. Derived Galactic Coordinates (IAU J2000 System II)
    const galacticCoordinates = equatorialToGalactic(raw.ra_deg, raw.dec_deg);

    // 4. Multi-Catalog Identifiers
    const catalogIdentifiers = {
      messier: raw.messier_id,
      ngc: raw.ngc_id,
      ic: raw.ic_id,
      caldwell: raw.caldwell_id,
      pgc: raw.pgc_id,
      ugc: raw.ugc_id,
    };

    // 5. Aliases formatting
    const formattedAliases = (raw.aliases || []).map((a) => {
      let type: "COMMON" | "MESSIER" | "NGC" | "IC" | "CALDWELL" | "CATALOG" = "COMMON";
      if (a.startsWith("M ") || a.startsWith("M") || a === raw.messier_id) type = "MESSIER";
      else if (a.startsWith("NGC ") || a.startsWith("NGC") || a === raw.ngc_id) type = "NGC";
      else if (a.startsWith("IC ") || a.startsWith("IC") || a === raw.ic_id) type = "IC";
      else if (a.startsWith("C ") || a.startsWith("Caldwell")) type = "CALDWELL";

      return {
        name: a,
        type,
        sourceCatalog: raw.source_catalog,
      };
    });

    const vMag = raw.apparent_magnitude_v ?? raw.v_mag;

    return {
      slug: raw.slug,
      canonicalName: raw.canonical_name,
      standardDesignation: raw.standard_designation || raw.messier_id || raw.ngc_id,
      classification: {
        category: "DEEP_SKY",
        code: raw.classification_code,
      },
      aliases: formattedAliases,
      catalogIdentifiers,
      physical: {
        apparentMagnitudeV: vMag,
        constellation: raw.constellation,
      },
      positional: {
        rightAscensionDeg: raw.ra_deg,
        declinationDeg: raw.dec_deg,
        distanceLightYears: distanceLy,
        distanceParsecs: distancePc,
        distanceKpc,
        distanceMpc,
        epoch: "J2000.0",
        referenceFrame: "ICRS",
        galacticCoordinates,
        cartesianCoordinatesPc,
        distanceUncertainty: raw.distance_uncertainty_ly,
      },
      deepSky: {
        ...raw.deep_sky_properties,
        distanceMethod: raw.distance_method || raw.deep_sky_properties?.distanceMethod,
      },
      observations: raw.observations || [],
      provenance: {
        authoritativeBody: "SIMBAD",
        catalogName: raw.source_catalog,
        recordIdentifier: raw.record_identifier,
        confidenceScore: 0.98,
        citationUrl:
          raw.citation_url ||
          `https://simbad.cds.unistra.fr/simbad/sim-id?Ident=${encodeURIComponent(raw.canonical_name)}`,
      },
      summary: raw.summary,
      isFeatured: true,
    };
  }
}

export class DeepSkyValidator {
  public validate(data: unknown): CelestialObject {
    const parseResult = CelestialObjectSchema.safeParse(data);
    if (!parseResult.success) {
      const formatted = parseResult.error.format();
      const objName = (data as { canonicalName?: string })?.canonicalName || "unknown";
      throw new ValidationError(
        `Validation failed for Deep Sky object '${objName}': ${JSON.stringify(formatted)}`,
        formatted
      );
    }
    return parseResult.data as CelestialObject;
  }
}
