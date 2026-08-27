import { CelestialObject } from "@/domain/celestial-object/types";
import {
  CelestialCategory,
  CelestialClassificationCode,
} from "@/domain/celestial-object/classification";
import { INormalizer, IValidator } from "../pipeline.interface";
import { CelestialObjectSchema } from "@/domain/celestial-object/schema";
import { ValidationError } from "@/lib/errors/app-error";
import { createMeasurement } from "@/domain/measurement/types";

/**
 * Raw NASA Exoplanet Archive (PS Table) Record Structure
 */
export interface RawNASAExoplanetRecord {
  pl_name: string; // Planet Name e.g. "TRAPPIST-1 e"
  hostname: string; // Host Star Name e.g. "TRAPPIST-1"
  pl_letter?: string; // Planet Letter e.g. "e"
  sy_snum?: number; // Number of Stars
  sy_pnum?: number; // Number of Planets
  discoverymethod?: string; // e.g. "Transit", "Radial Velocity"
  disc_year?: number; // e.g. 2017
  disc_facility?: string; // e.g. "Spitzer Space Telescope"
  disc_telescope?: string;
  disc_instrument?: string;
  disc_refname?: string;

  // Planetary Parameters
  pl_orbper?: number; // Orbital Period [days]
  pl_orbpererr1?: number;
  pl_orbpererr2?: number;

  pl_orbsmax?: number; // Semi-major axis [AU]
  pl_orbsmaxerr1?: number;
  pl_orbsmaxerr2?: number;

  pl_rade?: number; // Planet Radius [Earth Radii]
  pl_radeerr1?: number;
  pl_radeerr2?: number;

  pl_masse?: number; // Planet Mass [Earth Masses]
  pl_masseerr1?: number;
  pl_masseerr2?: number;

  pl_radj?: number; // Planet Radius [Jupiter Radii]
  pl_massj?: number; // Planet Mass [Jupiter Masses]

  pl_orbeccen?: number; // Eccentricity
  pl_orbeccenerr1?: number;
  pl_orbeccenerr2?: number;

  pl_orbincl?: number; // Inclination [deg]
  pl_orbinclerr1?: number;
  pl_orbinclerr2?: number;

  // Stellar Parameters
  st_spectype?: string; // e.g. "M8V", "G2V"
  st_teff?: number; // Effective Temperature [K]
  st_tefferr1?: number;
  st_tefferr2?: number;

  st_rad?: number; // Stellar Radius [Solar Radii]
  st_raderr1?: number;
  st_raderr2?: number;

  st_mass?: number; // Stellar Mass [Solar Masses]
  st_masserr1?: number;
  st_masserr2?: number;

  st_lum?: number; // Stellar Luminosity [log(Solar)]

  // System Parameters
  sy_dist?: number; // Distance [pc]
  sy_disterr1?: number;
  sy_disterr2?: number;
  ra?: number; // Right Ascension [deg]
  dec?: number; // Declination [deg]
}

export class NASAExoplanetNormalizer implements INormalizer<
  RawNASAExoplanetRecord,
  Partial<CelestialObject>
> {
  public normalize(raw: RawNASAExoplanetRecord): Partial<CelestialObject> {
    const slug = raw.pl_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Determine derived classification code based on planet radius/mass
    let code: CelestialClassificationCode = "EXOPLANET";
    if (raw.pl_rade !== undefined) {
      if (raw.pl_rade < 1.5) {
        code = "TERRESTRIAL_PLANET";
      } else if (raw.pl_rade < 2.5) {
        code = "SUPER_EARTH";
      } else if (raw.pl_rade < 6.0) {
        code = "ICE_GIANT";
      } else {
        code = "GAS_GIANT";
      }
    } else if (raw.pl_massj !== undefined && raw.pl_massj > 0.3) {
      code = "GAS_GIANT";
    }

    const distanceLightYears = raw.sy_dist !== undefined ? raw.sy_dist * 3.26156 : undefined;

    // Convert Earth mass to kg (M_earth = 5.9722e24 kg)
    const massKg = raw.pl_masse !== undefined ? raw.pl_masse * 5.9722e24 : undefined;
    // Convert Earth radius to km (R_earth = 6371 km)
    const meanRadiusKm = raw.pl_rade !== undefined ? raw.pl_rade * 6371.0 : undefined;

    // Map discovery method enum
    let method: CelestialObject["discovery"] extends undefined
      ? never
      : NonNullable<CelestialObject["discovery"]>["method"] = "OTHER";
    if (raw.discoverymethod) {
      const lower = raw.discoverymethod.toLowerCase();
      if (lower.includes("transit")) method = "TRANSIT";
      else if (lower.includes("radial velocity")) method = "RADIAL_VELOCITY";
      else if (lower.includes("imaging")) method = "DIRECT_IMAGING";
      else if (lower.includes("astrometry")) method = "ASTROMETRY";
      else if (lower.includes("microlensing")) method = "MICROLENSING";
      else if (lower.includes("timing")) method = "TRANSIT_TIMING_VARIATION";
    }

    return {
      slug,
      canonicalName: raw.pl_name,
      standardDesignation: raw.pl_name,
      classification: {
        category: CelestialCategory.PLANETARY,
        code,
      },
      aliases: [
        {
          name: raw.pl_name,
          type: "CATALOG",
          sourceCatalog: "NASA_EXOPLANET_ARCHIVE",
        },
      ],
      physical: {
        massEarth: raw.pl_masse,
        massKg,
        radiusEarth: raw.pl_rade,
        meanRadiusKm,
        massJupiter: raw.pl_massj,
        radiusJupiter: raw.pl_radj,
        measurementsWithUncertainty: {
          ...(raw.pl_masse !== undefined && {
            massEarth: createMeasurement(raw.pl_masse, "M_earth", {
              upper: raw.pl_masseerr1,
              lower: raw.pl_masseerr2,
            }),
          }),
          ...(raw.pl_rade !== undefined && {
            radiusEarth: createMeasurement(raw.pl_rade, "R_earth", {
              upper: raw.pl_radeerr1,
              lower: raw.pl_radeerr2,
            }),
          }),
        },
      },
      positional: {
        rightAscensionDeg: raw.ra,
        declinationDeg: raw.dec,
        distanceParsecs: raw.sy_dist,
        distanceLightYears,
        distanceUncertainty: {
          upper: raw.sy_disterr1 ? raw.sy_disterr1 * 3.26156 : undefined,
          lower: raw.sy_disterr2 ? raw.sy_disterr2 * 3.26156 : undefined,
        },
      },
      orbital: {
        semiMajorAxisAu: raw.pl_orbsmax,
        eccentricity: raw.pl_orbeccen,
        orbitalPeriodDays: raw.pl_orbper,
        inclinationDeg: raw.pl_orbincl,
        semiMajorAxisUncertainty: {
          upper: raw.pl_orbsmaxerr1,
          lower: raw.pl_orbsmaxerr2,
        },
        orbitalPeriodUncertainty: {
          upper: raw.pl_orbpererr1,
          lower: raw.pl_orbpererr2,
        },
        eccentricityUncertainty: {
          upper: raw.pl_orbeccenerr1,
          lower: raw.pl_orbeccenerr2,
        },
        inclinationUncertainty: {
          upper: raw.pl_orbinclerr1,
          lower: raw.pl_orbinclerr2,
        },
      },
      discovery: {
        year: raw.disc_year,
        method,
        facility: raw.disc_facility,
        telescope: raw.disc_telescope,
        instrument: raw.disc_instrument,
        referenceCitation: raw.disc_refname,
      },
      provenance: {
        authoritativeBody: "NASA",
        catalogName: "NASA Exoplanet Archive (Planetary Systems Composite Parameters)",
        recordIdentifier: `NASA-EXOPLANET:${raw.pl_name}`,
        confidenceScore: 0.995,
        citationUrl: "https://exoplanetarchive.ipac.caltech.edu/",
        lastIngestedAt: new Date().toISOString(),
      },
    };
  }
}

export class NASAExoplanetValidator implements IValidator<CelestialObject, CelestialObject> {
  public validate(data: CelestialObject): CelestialObject {
    const parseResult = CelestialObjectSchema.safeParse(data);
    if (!parseResult.success) {
      throw new ValidationError(
        `Validation failed for exoplanet '${data.canonicalName}': ${JSON.stringify(parseResult.error.format())}`,
        parseResult.error.format()
      );
    }
    return parseResult.data as CelestialObject;
  }
}
