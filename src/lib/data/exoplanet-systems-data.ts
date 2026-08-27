import { StellarSystem } from "@/domain/stellar-system/types";
import { CelestialObject } from "@/domain/celestial-object/types";
import { CelestialCategory } from "@/domain/celestial-object/classification";
import { HabitableZoneCalculator } from "../astronomy/habitable-zone";
import { createMeasurement } from "@/domain/measurement/types";
import { ProvenanceRecord } from "@/domain/provenance/types";

// Authoritative NASA Provenance Record Generator
function nasaExoplanetProvenance(
  recordId: string,
  citationUrl = "https://exoplanetarchive.ipac.caltech.edu/"
): ProvenanceRecord {
  return {
    authoritativeBody: "NASA",
    catalogName: "NASA Exoplanet Archive (Planetary Systems Composite Parameters)",
    catalogVersion: "PS_2026",
    recordIdentifier: `NASA-EXOPLANET:${recordId}`,
    confidenceScore: 0.995,
    citationUrl,
    lastIngestedAt: "2026-08-27T00:00:00Z",
  };
}

/* ========================================================================
   1. STELLAR SYSTEMS CATALOG
   ======================================================================== */

export const EXOPLANET_STELLAR_SYSTEMS: StellarSystem[] = [
  // 1. TRAPPIST-1 System
  {
    id: "f1000000-0000-4000-8000-000000000001",
    slug: "trappist-1",
    name: "TRAPPIST-1 System",
    architecture: "COMPACT_SYSTEM",
    centralBodyIds: ["e1000000-0000-4000-8000-000000000001"], // TRAPPIST-1 Star
    planetaryBodyIds: [
      "e1000000-0000-4000-8000-000000000002", // b
      "e1000000-0000-4000-8000-000000000003", // c
      "e1000000-0000-4000-8000-000000000004", // d
      "e1000000-0000-4000-8000-000000000005", // e (HZ)
      "e1000000-0000-4000-8000-000000000006", // f (HZ)
      "e1000000-0000-4000-8000-000000000007", // g (HZ)
      "e1000000-0000-4000-8000-000000000008", // h
    ],
    distanceLightYears: 40.66,
    distanceParsecs: 12.47,
    spectralTypeSummary: "M8V Ultra-Cool Red Dwarf",
    numberOfStars: 1,
    numberOfPlanets: 7,
    habitableZone: HabitableZoneCalculator.calculate(2566, 0.000553, 0.1192),
    discoveryFacility: "TRAPPIST-South / Spitzer Space Telescope",
    discoveryYear: 2016,
    summary:
      "A compact ultra-cool red dwarf star hosting seven transiting Earth-sized terrestrial planets, three of which reside within the circumstellar habitable zone.",
    provenance: nasaExoplanetProvenance("TRAPPIST-1"),
  },

  // 2. Proxima Centauri System
  {
    id: "f1000000-0000-4000-8000-000000000002",
    slug: "proxima-centauri",
    name: "Proxima Centauri System",
    architecture: "SINGLE_STAR",
    centralBodyIds: ["e1000000-0000-4000-8000-000000000010"], // Proxima Centauri Star
    planetaryBodyIds: [
      "e1000000-0000-4000-8000-000000000011", // Proxima b
      "e1000000-0000-4000-8000-000000000012", // Proxima d
    ],
    distanceLightYears: 4.2465,
    distanceParsecs: 1.302,
    spectralTypeSummary: "M5.5Ve Red Dwarf Flare Star",
    numberOfStars: 1,
    numberOfPlanets: 2,
    habitableZone: HabitableZoneCalculator.calculate(3042, 0.00155, 0.1542),
    discoveryFacility: "La Silla Observatory (HARPS) / VLT (ESPRESSO)",
    discoveryYear: 2016,
    summary:
      "The closest known stellar and exoplanetary system to the Sun, featuring Proxima Centauri b in its temperate habitable zone.",
    provenance: nasaExoplanetProvenance("Proxima Centauri"),
  },

  // 3. Alpha Centauri System
  {
    id: "f1000000-0000-4000-8000-000000000003",
    slug: "alpha-centauri",
    name: "Alpha Centauri System",
    architecture: "MULTIPLE_STAR",
    centralBodyIds: [
      "e1000000-0000-4000-8000-000000000020", // Alpha Centauri A
      "e1000000-0000-4000-8000-000000000021", // Alpha Centauri B
      "e1000000-0000-4000-8000-000000000010", // Proxima Centauri (Alpha Cen C)
    ],
    planetaryBodyIds: [
      "e1000000-0000-4000-8000-000000000011", // Proxima b
      "e1000000-0000-4000-8000-000000000012", // Proxima d
    ],
    distanceLightYears: 4.37,
    distanceParsecs: 1.34,
    spectralTypeSummary: "G2V + K1V + M5.5Ve Triple System",
    numberOfStars: 3,
    numberOfPlanets: 2,
    habitableZone: HabitableZoneCalculator.calculate(5790, 1.519, 1.217),
    barycentricModel: {
      isBarycentric: true,
      barycenterName: "Alpha Centauri AB Barycenter",
      centralStars: [
        {
          starId: "e1000000-0000-4000-8000-000000000020",
          starName: "Alpha Centauri A",
          massSolar: 1.079,
          semiMajorAxisAu: 11.2,
          orbitalPeriodYears: 79.91,
        },
        {
          starId: "e1000000-0000-4000-8000-000000000021",
          starName: "Alpha Centauri B",
          massSolar: 0.907,
          semiMajorAxisAu: 12.2,
          orbitalPeriodYears: 79.91,
        },
      ],
      approximationDescription:
        "Simplified two-body Keplerian barycentric approximation. Stars A and B orbit mutual barycenter with period P=79.91 yr and eccentricity e=0.518. Proxima orbits the AB pair at 13,000 AU.",
    },
    summary:
      "A prominent triple star system consisting of Solar-analog binary stars Alpha Centauri A and B, plus the outer red dwarf Proxima Centauri.",
    provenance: nasaExoplanetProvenance("Alpha Centauri"),
  },

  // 4. Kepler-90 System
  {
    id: "f1000000-0000-4000-8000-000000000004",
    slug: "kepler-90",
    name: "Kepler-90 System",
    architecture: "SINGLE_STAR",
    centralBodyIds: ["e1000000-0000-4000-8000-000000000030"], // Kepler-90 Star
    planetaryBodyIds: [
      "e1000000-0000-4000-8000-000000000031", // b
      "e1000000-0000-4000-8000-000000000032", // c
      "e1000000-0000-4000-8000-000000000033", // i
      "e1000000-0000-4000-8000-000000000034", // d
      "e1000000-0000-4000-8000-000000000035", // e
      "e1000000-0000-4000-8000-000000000036", // f
      "e1000000-0000-4000-8000-000000000037", // g
      "e1000000-0000-4000-8000-000000000038", // h
    ],
    distanceLightYears: 2840,
    distanceParsecs: 870,
    spectralTypeSummary: "G0V Main Sequence Star",
    numberOfStars: 1,
    numberOfPlanets: 8,
    habitableZone: HabitableZoneCalculator.calculate(6080, 1.76, 1.2),
    discoveryFacility: "Kepler Space Telescope",
    discoveryYear: 2013,
    summary:
      "A rich eight-planet system orbiting a G-type star, tied with our Solar System for the highest number of confirmed planets in a single system.",
    provenance: nasaExoplanetProvenance("Kepler-90"),
  },

  // 5. 55 Cancri System
  {
    id: "f1000000-0000-4000-8000-000000000005",
    slug: "55-cancri",
    name: "55 Cancri System",
    architecture: "BINARY_STAR",
    centralBodyIds: ["e1000000-0000-4000-8000-000000000040"], // 55 Cancri A (Copernicus)
    planetaryBodyIds: [
      "e1000000-0000-4000-8000-000000000041", // e (Janssen, Super-Earth)
      "e1000000-0000-4000-8000-000000000042", // b (Galileo)
      "e1000000-0000-4000-8000-000000000043", // c (Brahe)
      "e1000000-0000-4000-8000-000000000044", // f (Harriot)
      "e1000000-0000-4000-8000-000000000045", // d (Lipperhey)
    ],
    distanceLightYears: 41.06,
    distanceParsecs: 12.59,
    spectralTypeSummary: "G8V + M4V Binary System",
    numberOfStars: 2,
    numberOfPlanets: 5,
    habitableZone: HabitableZoneCalculator.calculate(5172, 0.582, 0.943),
    discoveryFacility: "Lick Observatory / McDonald Observatory",
    discoveryYear: 1996,
    summary:
      "A famous multi-planet system containing 5 exoplanets, including the ultra-hot diamond Super-Earth 55 Cancri e (Janssen).",
    provenance: nasaExoplanetProvenance("55 Cancri"),
  },

  // 6. WASP-12 System
  {
    id: "f1000000-0000-4000-8000-000000000006",
    slug: "wasp-12",
    name: "WASP-12 System",
    architecture: "SINGLE_STAR",
    centralBodyIds: ["e1000000-0000-4000-8000-000000000050"], // WASP-12 Star
    planetaryBodyIds: ["e1000000-0000-4000-8000-000000000051"], // WASP-12 b
    distanceLightYears: 1410,
    distanceParsecs: 432.3,
    spectralTypeSummary: "G0 Yellow Dwarf",
    numberOfStars: 1,
    numberOfPlanets: 1,
    habitableZone: HabitableZoneCalculator.calculate(6300, 3.45, 1.63),
    discoveryFacility: "SuperWASP",
    discoveryYear: 2008,
    summary:
      "Host to the extreme Hot Jupiter WASP-12 b, an egg-shaped planet being gravitationally torn apart and consumed by its host star.",
    provenance: nasaExoplanetProvenance("WASP-12"),
  },

  // 7. HD 209458 System
  {
    id: "f1000000-0000-4000-8000-000000000007",
    slug: "hd-209458",
    name: "HD 209458 System",
    architecture: "SINGLE_STAR",
    centralBodyIds: ["e1000000-0000-4000-8000-000000000060"], // HD 209458 Star
    planetaryBodyIds: ["e1000000-0000-4000-8000-000000000061"], // HD 209458 b (Osiris)
    distanceLightYears: 159.0,
    distanceParsecs: 48.76,
    spectralTypeSummary: "G0V Yellow Dwarf",
    numberOfStars: 1,
    numberOfPlanets: 1,
    habitableZone: HabitableZoneCalculator.calculate(6065, 1.61, 1.155),
    discoveryFacility: "Observatoire de Haute-Provence / Keck Observatory",
    discoveryYear: 1999,
    summary:
      "Host to Osiris (HD 209458 b), the first extrasolar planet observed in transit and the first found to have an evaporating atmosphere.",
    provenance: nasaExoplanetProvenance("HD 209458"),
  },
];

/* ========================================================================
   2. EXOPLANETARY CELESTIAL OBJECTS (STARS & PLANETS)
   ======================================================================== */

export const EXOPLANET_CELESTIAL_OBJECTS: CelestialObject[] = [
  // ------------------------------------------------------------------------
  // TRAPPIST-1 SYSTEM
  // ------------------------------------------------------------------------
  {
    id: "e1000000-0000-4000-8000-000000000001",
    slug: "trappist-1-star",
    canonicalName: "TRAPPIST-1",
    standardDesignation: "2MASS J23062928-0502285",
    classification: { category: CelestialCategory.STELLAR, code: "STAR" },
    aliases: [
      { name: "2MASS J23062928-0502285", type: "CATALOG", sourceCatalog: "2MASS" },
      { name: "K2-112", type: "CATALOG", sourceCatalog: "KEPLER" },
      { name: "EPIC 246199087", type: "CATALOG", sourceCatalog: "EPIC" },
    ],
    hostSystemId: "f1000000-0000-4000-8000-000000000001",
    childObjectIds: [
      "e1000000-0000-4000-8000-000000000002",
      "e1000000-0000-4000-8000-000000000003",
      "e1000000-0000-4000-8000-000000000004",
      "e1000000-0000-4000-8000-000000000005",
      "e1000000-0000-4000-8000-000000000006",
      "e1000000-0000-4000-8000-000000000007",
      "e1000000-0000-4000-8000-000000000008",
    ],
    physical: {
      massSolar: 0.0898,
      massKg: 1.785e29,
      radiusSolar: 0.1192,
      meanRadiusKm: 82900,
      effectiveTemperatureK: 2566,
      luminositySolar: 0.000553,
      spectralClass: "M8V",
      surfaceGravityLogG: 5.24,
      measurementsWithUncertainty: {
        stellarMassSolar: createMeasurement(0.0898, "M_sun", { upper: 0.0023, lower: -0.0023 }),
        stellarRadiusSolar: createMeasurement(0.1192, "R_sun", { upper: 0.0013, lower: -0.0013 }),
        effectiveTemperatureK: createMeasurement(2566, "K", { upper: 26, lower: -26 }),
      },
    },
    positional: {
      rightAscensionDeg: 346.622,
      declinationDeg: -5.041,
      distanceLightYears: 40.66,
      distanceParsecs: 12.47,
      distanceUncertainty: { upper: 0.12, lower: -0.12 },
    },
    provenance: nasaExoplanetProvenance("TRAPPIST-1"),
    summary:
      "Ultra-cool red dwarf star located 40.7 light-years away in the constellation Aquarius, slightly larger than Jupiter in radius with ~9% the mass of the Sun.",
  },
  {
    id: "e1000000-0000-4000-8000-000000000002",
    slug: "trappist-1-b",
    canonicalName: "TRAPPIST-1 b",
    classification: { category: CelestialCategory.PLANETARY, code: "TERRESTRIAL_PLANET" },
    aliases: [{ name: "2MASS J23062928-0502285 b", type: "CATALOG" }],
    parentId: "e1000000-0000-4000-8000-000000000001",
    hostSystemId: "f1000000-0000-4000-8000-000000000001",
    physical: {
      massEarth: 1.374,
      massKg: 8.205e24,
      radiusEarth: 1.116,
      meanRadiusKm: 7110,
      meanTemperatureK: 400,
      densityGcm3: 5.42,
      measurementsWithUncertainty: {
        massEarth: createMeasurement(1.374, "M_earth", { upper: 0.069, lower: -0.069 }),
        radiusEarth: createMeasurement(1.116, "R_earth", { upper: 0.014, lower: -0.014 }),
      },
    },
    positional: { distanceLightYears: 40.66, distanceParsecs: 12.47 },
    orbital: {
      semiMajorAxisAu: 0.01154,
      eccentricity: 0.00622,
      orbitalPeriodDays: 1.51087081,
      inclinationDeg: 89.65,
      semiMajorAxisUncertainty: { upper: 0.0001, lower: -0.0001 },
      orbitalPeriodUncertainty: { upper: 0.0000006, lower: -0.0000006 },
    },
    discovery: {
      year: 2016,
      method: "TRANSIT",
      facility: "TRAPPIST-South",
      referenceCitation: "Gillon et al. (2016)",
    },
    provenance: nasaExoplanetProvenance("TRAPPIST-1 b"),
    summary:
      "Innermost rocky planet of the TRAPPIST-1 system with a blisteringly fast 1.51-day orbital period.",
  },
  {
    id: "e1000000-0000-4000-8000-000000000003",
    slug: "trappist-1-c",
    canonicalName: "TRAPPIST-1 c",
    classification: { category: CelestialCategory.PLANETARY, code: "TERRESTRIAL_PLANET" },
    aliases: [{ name: "2MASS J23062928-0502285 c", type: "CATALOG" }],
    parentId: "e1000000-0000-4000-8000-000000000001",
    hostSystemId: "f1000000-0000-4000-8000-000000000001",
    physical: {
      massEarth: 1.308,
      massKg: 7.811e24,
      radiusEarth: 1.097,
      meanRadiusKm: 6989,
      meanTemperatureK: 342,
      densityGcm3: 5.63,
      measurementsWithUncertainty: {
        massEarth: createMeasurement(1.308, "M_earth", { upper: 0.056, lower: -0.056 }),
        radiusEarth: createMeasurement(1.097, "R_earth", { upper: 0.014, lower: -0.014 }),
      },
    },
    positional: { distanceLightYears: 40.66, distanceParsecs: 12.47 },
    orbital: {
      semiMajorAxisAu: 0.0158,
      eccentricity: 0.00654,
      orbitalPeriodDays: 2.4218233,
      inclinationDeg: 89.67,
    },
    discovery: { year: 2016, method: "TRANSIT", facility: "TRAPPIST-South" },
    provenance: nasaExoplanetProvenance("TRAPPIST-1 c"),
    summary: "Dense terrestrial exoplanet orbiting TRAPPIST-1 every 2.42 days.",
  },
  {
    id: "e1000000-0000-4000-8000-000000000004",
    slug: "trappist-1-d",
    canonicalName: "TRAPPIST-1 d",
    classification: { category: CelestialCategory.PLANETARY, code: "TERRESTRIAL_PLANET" },
    aliases: [{ name: "2MASS J23062928-0502285 d", type: "CATALOG" }],
    parentId: "e1000000-0000-4000-8000-000000000001",
    hostSystemId: "f1000000-0000-4000-8000-000000000001",
    physical: {
      massEarth: 0.388,
      massKg: 2.317e24,
      radiusEarth: 0.788,
      meanRadiusKm: 5020,
      meanTemperatureK: 288,
      densityGcm3: 4.34,
      measurementsWithUncertainty: {
        massEarth: createMeasurement(0.388, "M_earth", { upper: 0.012, lower: -0.012 }),
        radiusEarth: createMeasurement(0.788, "R_earth", { upper: 0.011, lower: -0.011 }),
      },
    },
    positional: { distanceLightYears: 40.66, distanceParsecs: 12.47 },
    orbital: {
      semiMajorAxisAu: 0.02227,
      eccentricity: 0.00837,
      orbitalPeriodDays: 4.04961,
      inclinationDeg: 89.75,
    },
    discovery: { year: 2016, method: "TRANSIT", facility: "TRAPPIST-South / Spitzer" },
    provenance: nasaExoplanetProvenance("TRAPPIST-1 d"),
    summary:
      "The least massive world in the TRAPPIST-1 system, slightly larger than Mars with 38% Earth mass.",
  },
  {
    id: "e1000000-0000-4000-8000-000000000005",
    slug: "trappist-1-e",
    canonicalName: "TRAPPIST-1 e",
    classification: { category: CelestialCategory.PLANETARY, code: "TERRESTRIAL_PLANET" },
    aliases: [{ name: "2MASS J23062928-0502285 e", type: "CATALOG" }],
    parentId: "e1000000-0000-4000-8000-000000000001",
    hostSystemId: "f1000000-0000-4000-8000-000000000001",
    physical: {
      massEarth: 0.692,
      massKg: 4.133e24,
      radiusEarth: 0.92,
      meanRadiusKm: 5861,
      meanTemperatureK: 251,
      surfaceGravityMs2: 9.12,
      densityGcm3: 5.07,
      measurementsWithUncertainty: {
        massEarth: createMeasurement(0.692, "M_earth", { upper: 0.022, lower: -0.022 }),
        radiusEarth: createMeasurement(0.92, "R_earth", { upper: 0.013, lower: -0.013 }),
      },
    },
    positional: { distanceLightYears: 40.66, distanceParsecs: 12.47 },
    orbital: {
      semiMajorAxisAu: 0.02925,
      eccentricity: 0.0051,
      orbitalPeriodDays: 6.099615,
      inclinationDeg: 89.86,
    },
    discovery: { year: 2017, method: "TRANSIT", facility: "Spitzer Space Telescope" },
    provenance: nasaExoplanetProvenance("TRAPPIST-1 e"),
    summary:
      "A prime Earth-sized habitable zone exoplanet with a high Earth Similarity Index, receiving ~66% of Earth's stellar flux.",
  },
  {
    id: "e1000000-0000-4000-8000-000000000006",
    slug: "trappist-1-f",
    canonicalName: "TRAPPIST-1 f",
    classification: { category: CelestialCategory.PLANETARY, code: "TERRESTRIAL_PLANET" },
    aliases: [{ name: "2MASS J23062928-0502285 f", type: "CATALOG" }],
    parentId: "e1000000-0000-4000-8000-000000000001",
    hostSystemId: "f1000000-0000-4000-8000-000000000001",
    physical: {
      massEarth: 1.039,
      massKg: 6.205e24,
      radiusEarth: 1.045,
      meanRadiusKm: 6658,
      meanTemperatureK: 219,
      densityGcm3: 5.12,
      measurementsWithUncertainty: {
        massEarth: createMeasurement(1.039, "M_earth", { upper: 0.031, lower: -0.031 }),
        radiusEarth: createMeasurement(1.045, "R_earth", { upper: 0.013, lower: -0.013 }),
      },
    },
    positional: { distanceLightYears: 40.66, distanceParsecs: 12.47 },
    orbital: {
      semiMajorAxisAu: 0.03849,
      eccentricity: 0.01007,
      orbitalPeriodDays: 9.20669,
      inclinationDeg: 89.68,
    },
    discovery: { year: 2017, method: "TRANSIT", facility: "Spitzer Space Telescope" },
    provenance: nasaExoplanetProvenance("TRAPPIST-1 f"),
    summary:
      "Earth-mass exoplanet in the habitable zone of TRAPPIST-1, likely a water-rich or volatile-rich world.",
  },
  {
    id: "e1000000-0000-4000-8000-000000000007",
    slug: "trappist-1-g",
    canonicalName: "TRAPPIST-1 g",
    classification: { category: CelestialCategory.PLANETARY, code: "TERRESTRIAL_PLANET" },
    aliases: [{ name: "2MASS J23062928-0502285 g", type: "CATALOG" }],
    parentId: "e1000000-0000-4000-8000-000000000001",
    hostSystemId: "f1000000-0000-4000-8000-000000000001",
    physical: {
      massEarth: 1.321,
      massKg: 7.889e24,
      radiusEarth: 1.129,
      meanRadiusKm: 7193,
      meanTemperatureK: 198,
      densityGcm3: 5.09,
      measurementsWithUncertainty: {
        massEarth: createMeasurement(1.321, "M_earth", { upper: 0.038, lower: -0.038 }),
        radiusEarth: createMeasurement(1.129, "R_earth", { upper: 0.014, lower: -0.014 }),
      },
    },
    positional: { distanceLightYears: 40.66, distanceParsecs: 12.47 },
    orbital: {
      semiMajorAxisAu: 0.04683,
      eccentricity: 0.00208,
      orbitalPeriodDays: 12.35294,
      inclinationDeg: 89.71,
    },
    discovery: { year: 2017, method: "TRANSIT", facility: "Spitzer Space Telescope" },
    provenance: nasaExoplanetProvenance("TRAPPIST-1 g"),
    summary:
      "The largest planet in TRAPPIST-1, orbiting near the outer edge of the habitable zone.",
  },
  {
    id: "e1000000-0000-4000-8000-000000000008",
    slug: "trappist-1-h",
    canonicalName: "TRAPPIST-1 h",
    classification: { category: CelestialCategory.PLANETARY, code: "TERRESTRIAL_PLANET" },
    aliases: [{ name: "2MASS J23062928-0502285 h", type: "CATALOG" }],
    parentId: "e1000000-0000-4000-8000-000000000001",
    hostSystemId: "f1000000-0000-4000-8000-000000000001",
    physical: {
      massEarth: 0.326,
      massKg: 1.947e24,
      radiusEarth: 0.775,
      meanRadiusKm: 4937,
      meanTemperatureK: 173,
      densityGcm3: 4.14,
      measurementsWithUncertainty: {
        massEarth: createMeasurement(0.326, "M_earth", { upper: 0.02, lower: -0.02 }),
        radiusEarth: createMeasurement(0.775, "R_earth", { upper: 0.014, lower: -0.014 }),
      },
    },
    positional: { distanceLightYears: 40.66, distanceParsecs: 12.47 },
    orbital: {
      semiMajorAxisAu: 0.06189,
      eccentricity: 0.00567,
      orbitalPeriodDays: 18.76795,
      inclinationDeg: 89.8,
    },
    discovery: { year: 2017, method: "TRANSIT", facility: "Spitzer Space Telescope" },
    provenance: nasaExoplanetProvenance("TRAPPIST-1 h"),
    summary:
      "Outermost cold rocky planet of the TRAPPIST-1 system, likely frozen with a water-ice crust.",
  },

  // ------------------------------------------------------------------------
  // PROXIMA CENTAURI SYSTEM
  // ------------------------------------------------------------------------
  {
    id: "e1000000-0000-4000-8000-000000000010",
    slug: "proxima-centauri-star",
    canonicalName: "Proxima Centauri",
    standardDesignation: "Alpha Centauri C",
    classification: { category: CelestialCategory.STELLAR, code: "STAR" },
    aliases: [
      { name: "Alpha Centauri C", type: "BAYER" },
      { name: "GJ 551", type: "CATALOG" },
      { name: "HIP 70890", type: "CATALOG" },
    ],
    hostSystemId: "f1000000-0000-4000-8000-000000000002",
    childObjectIds: [
      "e1000000-0000-4000-8000-000000000011",
      "e1000000-0000-4000-8000-000000000012",
    ],
    physical: {
      massSolar: 0.1221,
      massKg: 2.428e29,
      radiusSolar: 0.1542,
      meanRadiusKm: 107300,
      effectiveTemperatureK: 3042,
      luminositySolar: 0.00155,
      spectralClass: "M5.5Ve",
      measurementsWithUncertainty: {
        stellarMassSolar: createMeasurement(0.1221, "M_sun", { upper: 0.0022, lower: -0.0022 }),
        effectiveTemperatureK: createMeasurement(3042, "K", { upper: 117, lower: -117 }),
      },
    },
    positional: {
      rightAscensionDeg: 217.4289,
      declinationDeg: -62.6795,
      distanceLightYears: 4.2465,
      distanceParsecs: 1.302,
    },
    provenance: nasaExoplanetProvenance("Proxima Centauri"),
    summary:
      "A red dwarf flare star in the constellation Centaurus, the closest star to the Sun at 4.25 light-years.",
  },
  {
    id: "e1000000-0000-4000-8000-000000000011",
    slug: "proxima-centauri-b",
    canonicalName: "Proxima Centauri b",
    classification: { category: CelestialCategory.PLANETARY, code: "TERRESTRIAL_PLANET" },
    aliases: [{ name: "Alpha Centauri C b", type: "BAYER" }],
    parentId: "e1000000-0000-4000-8000-000000000010",
    hostSystemId: "f1000000-0000-4000-8000-000000000002",
    physical: {
      massEarth: 1.07,
      massKg: 6.39e24,
      radiusEarth: 1.03,
      meanRadiusKm: 6562,
      meanTemperatureK: 234,
      measurementsWithUncertainty: {
        massEarth: createMeasurement(1.07, "M_earth", { upper: 0.06, lower: -0.06 }),
      },
    },
    positional: { distanceLightYears: 4.2465, distanceParsecs: 1.302 },
    orbital: {
      semiMajorAxisAu: 0.0485,
      eccentricity: 0.02,
      orbitalPeriodDays: 11.186,
      inclinationDeg: 133,
    },
    discovery: {
      year: 2016,
      method: "RADIAL_VELOCITY",
      facility: "La Silla Observatory (HARPS)",
      referenceCitation: "Anglada-Escudé et al. (2016)",
    },
    provenance: nasaExoplanetProvenance("Proxima Centauri b"),
    summary:
      "The nearest known exoplanet to Earth, an Earth-mass candidate orbiting inside the habitable zone of Proxima Centauri.",
  },
  {
    id: "e1000000-0000-4000-8000-000000000012",
    slug: "proxima-centauri-d",
    canonicalName: "Proxima Centauri d",
    classification: { category: CelestialCategory.PLANETARY, code: "TERRESTRIAL_PLANET" },
    aliases: [{ name: "Alpha Centauri C d", type: "BAYER" }],
    parentId: "e1000000-0000-4000-8000-000000000010",
    hostSystemId: "f1000000-0000-4000-8000-000000000002",
    physical: {
      massEarth: 0.26,
      massKg: 1.55e24,
      radiusEarth: 0.81,
      meanRadiusKm: 5160,
      meanTemperatureK: 360,
      measurementsWithUncertainty: {
        massEarth: createMeasurement(0.26, "M_earth", { upper: 0.05, lower: -0.05 }),
      },
    },
    positional: { distanceLightYears: 4.2465, distanceParsecs: 1.302 },
    orbital: {
      semiMajorAxisAu: 0.02885,
      eccentricity: 0.04,
      orbitalPeriodDays: 5.122,
    },
    discovery: { year: 2022, method: "RADIAL_VELOCITY", facility: "VLT (ESPRESSO)" },
    provenance: nasaExoplanetProvenance("Proxima Centauri d"),
    summary: "Sub-Earth mass exoplanet orbiting Proxima Centauri every 5.1 days.",
  },

  // ------------------------------------------------------------------------
  // ALPHA CENTAURI BINARY STARS
  // ------------------------------------------------------------------------
  {
    id: "e1000000-0000-4000-8000-000000000020",
    slug: "alpha-centauri-a",
    canonicalName: "Alpha Centauri A",
    standardDesignation: "Rigil Kentaurus",
    classification: { category: CelestialCategory.STELLAR, code: "STAR" },
    aliases: [
      { name: "Rigil Kentaurus", type: "HISTORICAL" },
      { name: "HD 128620", type: "CATALOG" },
      { name: "HIP 71683", type: "CATALOG" },
    ],
    hostSystemId: "f1000000-0000-4000-8000-000000000003",
    physical: {
      massSolar: 1.0788,
      massKg: 2.145e30,
      radiusSolar: 1.2175,
      meanRadiusKm: 847800,
      effectiveTemperatureK: 5790,
      luminositySolar: 1.519,
      spectralClass: "G2V",
      surfaceGravityLogG: 4.3,
    },
    positional: {
      rightAscensionDeg: 219.902,
      declinationDeg: -60.833,
      distanceLightYears: 4.37,
      distanceParsecs: 1.34,
    },
    provenance: nasaExoplanetProvenance("Alpha Centauri A"),
    summary:
      "Solar-analog yellow dwarf star, the primary and brightest component of the Alpha Centauri triple star system.",
  },
  {
    id: "e1000000-0000-4000-8000-000000000021",
    slug: "alpha-centauri-b",
    canonicalName: "Alpha Centauri B",
    standardDesignation: "Toliman",
    classification: { category: CelestialCategory.STELLAR, code: "STAR" },
    aliases: [
      { name: "Toliman", type: "HISTORICAL" },
      { name: "HD 128621", type: "CATALOG" },
      { name: "HIP 71681", type: "CATALOG" },
    ],
    hostSystemId: "f1000000-0000-4000-8000-000000000003",
    physical: {
      massSolar: 0.907,
      massKg: 1.803e30,
      radiusSolar: 0.865,
      meanRadiusKm: 602300,
      effectiveTemperatureK: 5260,
      luminositySolar: 0.5,
      spectralClass: "K1V",
      surfaceGravityLogG: 4.53,
    },
    positional: {
      rightAscensionDeg: 219.902,
      declinationDeg: -60.833,
      distanceLightYears: 4.37,
      distanceParsecs: 1.34,
    },
    provenance: nasaExoplanetProvenance("Alpha Centauri B"),
    summary:
      "Orange main-sequence star orbiting Alpha Centauri A in an 80-year mutual binary orbit.",
  },

  // ------------------------------------------------------------------------
  // KEPLER-90 SYSTEM (8 PLANETS)
  // ------------------------------------------------------------------------
  {
    id: "e1000000-0000-4000-8000-000000000030",
    slug: "kepler-90-star",
    canonicalName: "Kepler-90",
    standardDesignation: "KOI-351",
    classification: { category: CelestialCategory.STELLAR, code: "STAR" },
    aliases: [
      { name: "KOI-351", type: "CATALOG" },
      { name: "KIC 11442793", type: "CATALOG" },
    ],
    hostSystemId: "f1000000-0000-4000-8000-000000000004",
    physical: {
      massSolar: 1.2,
      radiusSolar: 1.2,
      effectiveTemperatureK: 6080,
      luminositySolar: 1.76,
      spectralClass: "G0V",
    },
    positional: { distanceLightYears: 2840, distanceParsecs: 870 },
    provenance: nasaExoplanetProvenance("Kepler-90"),
    summary: "G-type main sequence star hosting 8 confirmed planets.",
  },
  {
    id: "e1000000-0000-4000-8000-000000000031",
    slug: "kepler-90-b",
    canonicalName: "Kepler-90 b",
    classification: { category: CelestialCategory.PLANETARY, code: "TERRESTRIAL_PLANET" },
    aliases: [{ name: "KOI-351 b", type: "CATALOG" }],
    parentId: "e1000000-0000-4000-8000-000000000030",
    hostSystemId: "f1000000-0000-4000-8000-000000000004",
    physical: { radiusEarth: 1.31, massEarth: 2.1 },
    positional: { distanceLightYears: 2840 },
    orbital: { semiMajorAxisAu: 0.074, orbitalPeriodDays: 7.008, eccentricity: 0.0 },
    discovery: { year: 2013, method: "TRANSIT", facility: "Kepler" },
    provenance: nasaExoplanetProvenance("Kepler-90 b"),
    summary: "Innermost planet of Kepler-90 with a 7-day orbit.",
  },
  {
    id: "e1000000-0000-4000-8000-000000000032",
    slug: "kepler-90-c",
    canonicalName: "Kepler-90 c",
    classification: { category: CelestialCategory.PLANETARY, code: "TERRESTRIAL_PLANET" },
    aliases: [{ name: "KOI-351 c", type: "CATALOG" }],
    parentId: "e1000000-0000-4000-8000-000000000030",
    hostSystemId: "f1000000-0000-4000-8000-000000000004",
    physical: { radiusEarth: 1.18, massEarth: 1.6 },
    positional: { distanceLightYears: 2840 },
    orbital: { semiMajorAxisAu: 0.089, orbitalPeriodDays: 8.719, eccentricity: 0.0 },
    discovery: { year: 2013, method: "TRANSIT", facility: "Kepler" },
    provenance: nasaExoplanetProvenance("Kepler-90 c"),
    summary: "Second planet in Kepler-90 system.",
  },
  {
    id: "e1000000-0000-4000-8000-000000000033",
    slug: "kepler-90-i",
    canonicalName: "Kepler-90 i",
    classification: { category: CelestialCategory.PLANETARY, code: "SUPER_EARTH" },
    aliases: [{ name: "KOI-351 i", type: "CATALOG" }],
    parentId: "e1000000-0000-4000-8000-000000000030",
    hostSystemId: "f1000000-0000-4000-8000-000000000004",
    physical: { radiusEarth: 1.32, massEarth: 2.5, meanTemperatureK: 709 },
    positional: { distanceLightYears: 2840 },
    orbital: { semiMajorAxisAu: 0.1234, orbitalPeriodDays: 14.44912, eccentricity: 0.0 },
    discovery: {
      year: 2017,
      method: "TRANSIT",
      facility: "Kepler (Deep Learning / Shallue & Vanderburg)",
    },
    provenance: nasaExoplanetProvenance("Kepler-90 i"),
    summary:
      "Eighth planet discovered in the system using machine learning neural networks on Kepler data.",
  },
  {
    id: "e1000000-0000-4000-8000-000000000034",
    slug: "kepler-90-d",
    canonicalName: "Kepler-90 d",
    classification: { category: CelestialCategory.PLANETARY, code: "ICE_GIANT" },
    aliases: [{ name: "KOI-351 d", type: "CATALOG" }],
    parentId: "e1000000-0000-4000-8000-000000000030",
    hostSystemId: "f1000000-0000-4000-8000-000000000004",
    physical: { radiusEarth: 2.88, massEarth: 9.0 },
    positional: { distanceLightYears: 2840 },
    orbital: { semiMajorAxisAu: 0.32, orbitalPeriodDays: 59.736 },
    discovery: { year: 2013, method: "TRANSIT", facility: "Kepler" },
    provenance: nasaExoplanetProvenance("Kepler-90 d"),
    summary: "Sub-Neptune exoplanet orbiting in Kepler-90.",
  },
  {
    id: "e1000000-0000-4000-8000-000000000035",
    slug: "kepler-90-e",
    canonicalName: "Kepler-90 e",
    classification: { category: CelestialCategory.PLANETARY, code: "ICE_GIANT" },
    aliases: [{ name: "KOI-351 e", type: "CATALOG" }],
    parentId: "e1000000-0000-4000-8000-000000000030",
    hostSystemId: "f1000000-0000-4000-8000-000000000004",
    physical: { radiusEarth: 2.67, massEarth: 8.0 },
    positional: { distanceLightYears: 2840 },
    orbital: { semiMajorAxisAu: 0.42, orbitalPeriodDays: 91.939 },
    discovery: { year: 2013, method: "TRANSIT", facility: "Kepler" },
    provenance: nasaExoplanetProvenance("Kepler-90 e"),
    summary: "Fifth planet in Kepler-90 system.",
  },
  {
    id: "e1000000-0000-4000-8000-000000000036",
    slug: "kepler-90-f",
    canonicalName: "Kepler-90 f",
    classification: { category: CelestialCategory.PLANETARY, code: "ICE_GIANT" },
    aliases: [{ name: "KOI-351 f", type: "CATALOG" }],
    parentId: "e1000000-0000-4000-8000-000000000030",
    hostSystemId: "f1000000-0000-4000-8000-000000000004",
    physical: { radiusEarth: 2.89, massEarth: 8.5 },
    positional: { distanceLightYears: 2840 },
    orbital: { semiMajorAxisAu: 0.48, orbitalPeriodDays: 124.914 },
    discovery: { year: 2013, method: "TRANSIT", facility: "Kepler" },
    provenance: nasaExoplanetProvenance("Kepler-90 f"),
    summary: "Sixth planet in Kepler-90 system.",
  },
  {
    id: "e1000000-0000-4000-8000-000000000037",
    slug: "kepler-90-g",
    canonicalName: "Kepler-90 g",
    classification: { category: CelestialCategory.PLANETARY, code: "GAS_GIANT" },
    aliases: [{ name: "KOI-351 g", type: "CATALOG" }],
    parentId: "e1000000-0000-4000-8000-000000000030",
    hostSystemId: "f1000000-0000-4000-8000-000000000004",
    physical: { radiusEarth: 8.13, massEarth: 215 },
    positional: { distanceLightYears: 2840 },
    orbital: { semiMajorAxisAu: 0.71, orbitalPeriodDays: 210.607 },
    discovery: { year: 2013, method: "TRANSIT", facility: "Kepler" },
    provenance: nasaExoplanetProvenance("Kepler-90 g"),
    summary: "Large gas giant planet orbiting in the Kepler-90 system.",
  },
  {
    id: "e1000000-0000-4000-8000-000000000038",
    slug: "kepler-90-h",
    canonicalName: "Kepler-90 h",
    classification: { category: CelestialCategory.PLANETARY, code: "GAS_GIANT" },
    aliases: [{ name: "KOI-351 h", type: "CATALOG" }],
    parentId: "e1000000-0000-4000-8000-000000000030",
    hostSystemId: "f1000000-0000-4000-8000-000000000004",
    physical: { radiusEarth: 11.32, massEarth: 320, meanTemperatureK: 292 },
    positional: { distanceLightYears: 2840 },
    orbital: { semiMajorAxisAu: 1.01, orbitalPeriodDays: 331.601, eccentricity: 0.011 },
    discovery: { year: 2013, method: "TRANSIT", facility: "Kepler" },
    provenance: nasaExoplanetProvenance("Kepler-90 h"),
    summary:
      "Outermost Jupiter-sized gas giant planet in the Kepler-90 system, orbiting at 1.01 AU.",
  },

  // ------------------------------------------------------------------------
  // 55 CANCRI SYSTEM (COPERNICUS)
  // ------------------------------------------------------------------------
  {
    id: "e1000000-0000-4000-8000-000000000040",
    slug: "55-cancri-star",
    canonicalName: "55 Cancri A",
    standardDesignation: "Copernicus",
    classification: { category: CelestialCategory.STELLAR, code: "STAR" },
    aliases: [
      { name: "Copernicus", type: "HISTORICAL" },
      { name: "Rho-1 Cancri", type: "BAYER" },
      { name: "HD 75732", type: "CATALOG" },
      { name: "HIP 43587", type: "CATALOG" },
    ],
    hostSystemId: "f1000000-0000-4000-8000-000000000005",
    physical: {
      massSolar: 0.905,
      radiusSolar: 0.943,
      effectiveTemperatureK: 5172,
      luminositySolar: 0.582,
      spectralClass: "G8V",
    },
    positional: { distanceLightYears: 41.06, distanceParsecs: 12.59 },
    provenance: nasaExoplanetProvenance("55 Cancri A"),
    summary: "Yellow dwarf star located 41 light-years away in Cancer, host to 5 exoplanets.",
  },
  {
    id: "e1000000-0000-4000-8000-000000000041",
    slug: "55-cancri-e",
    canonicalName: "55 Cancri e",
    standardDesignation: "Janssen",
    classification: { category: CelestialCategory.PLANETARY, code: "SUPER_EARTH" },
    aliases: [
      { name: "Janssen", type: "HISTORICAL" },
      { name: "HD 75732 e", type: "CATALOG" },
    ],
    parentId: "e1000000-0000-4000-8000-000000000040",
    hostSystemId: "f1000000-0000-4000-8000-000000000005",
    physical: {
      massEarth: 7.99,
      radiusEarth: 1.875,
      meanRadiusKm: 11945,
      meanTemperatureK: 2246,
      densityGcm3: 6.66,
      measurementsWithUncertainty: {
        massEarth: createMeasurement(7.99, "M_earth", { upper: 0.32, lower: -0.32 }),
        radiusEarth: createMeasurement(1.875, "R_earth", { upper: 0.029, lower: -0.029 }),
      },
    },
    positional: { distanceLightYears: 41.06 },
    orbital: {
      semiMajorAxisAu: 0.01544,
      eccentricity: 0.05,
      orbitalPeriodDays: 0.736547,
      inclinationDeg: 83.59,
    },
    discovery: {
      year: 2004,
      method: "RADIAL_VELOCITY",
      facility: "McDonald Observatory",
      referenceCitation: "McArthur et al. (2004)",
    },
    provenance: nasaExoplanetProvenance("55 Cancri e"),
    summary:
      "Ultra-short period lava Super-Earth, orbiting its star in just 17.7 hours with surface temperatures over 2,200 K.",
  },
  {
    id: "e1000000-0000-4000-8000-000000000042",
    slug: "55-cancri-b",
    canonicalName: "55 Cancri b",
    standardDesignation: "Galileo",
    classification: { category: CelestialCategory.PLANETARY, code: "GAS_GIANT" },
    aliases: [{ name: "Galileo", type: "HISTORICAL" }],
    parentId: "e1000000-0000-4000-8000-000000000040",
    hostSystemId: "f1000000-0000-4000-8000-000000000005",
    physical: { massJupiter: 0.8306, radiusJupiter: 1.15 },
    positional: { distanceLightYears: 41.06 },
    orbital: { semiMajorAxisAu: 0.1134, orbitalPeriodDays: 14.65152, eccentricity: 0.013 },
    discovery: { year: 1996, method: "RADIAL_VELOCITY", facility: "Lick Observatory" },
    provenance: nasaExoplanetProvenance("55 Cancri b"),
    summary: "Hot Jupiter gas giant orbiting 55 Cancri.",
  },
  {
    id: "e1000000-0000-4000-8000-000000000043",
    slug: "55-cancri-c",
    canonicalName: "55 Cancri c",
    standardDesignation: "Brahe",
    classification: { category: CelestialCategory.PLANETARY, code: "GAS_GIANT" },
    aliases: [{ name: "Brahe", type: "HISTORICAL" }],
    parentId: "e1000000-0000-4000-8000-000000000040",
    hostSystemId: "f1000000-0000-4000-8000-000000000005",
    physical: { massJupiter: 0.1714 },
    positional: { distanceLightYears: 41.06 },
    orbital: { semiMajorAxisAu: 0.2373, orbitalPeriodDays: 44.3446, eccentricity: 0.08 },
    discovery: { year: 2002, method: "RADIAL_VELOCITY", facility: "Lick Observatory" },
    provenance: nasaExoplanetProvenance("55 Cancri c"),
    summary: "Saturn-mass gas planet orbiting in 55 Cancri.",
  },
  {
    id: "e1000000-0000-4000-8000-000000000044",
    slug: "55-cancri-f",
    canonicalName: "55 Cancri f",
    standardDesignation: "Harriot",
    classification: { category: CelestialCategory.PLANETARY, code: "GAS_GIANT" },
    aliases: [{ name: "Harriot", type: "HISTORICAL" }],
    parentId: "e1000000-0000-4000-8000-000000000040",
    hostSystemId: "f1000000-0000-4000-8000-000000000005",
    physical: { massJupiter: 0.141 },
    positional: { distanceLightYears: 41.06 },
    orbital: { semiMajorAxisAu: 0.7708, orbitalPeriodDays: 260.7, eccentricity: 0.2 },
    discovery: { year: 2007, method: "RADIAL_VELOCITY", facility: "Lick Observatory" },
    provenance: nasaExoplanetProvenance("55 Cancri f"),
    summary: "Gas giant located inside the circumstellar habitable zone of 55 Cancri.",
  },
  {
    id: "e1000000-0000-4000-8000-000000000045",
    slug: "55-cancri-d",
    canonicalName: "55 Cancri d",
    standardDesignation: "Lipperhey",
    classification: { category: CelestialCategory.PLANETARY, code: "GAS_GIANT" },
    aliases: [{ name: "Lipperhey", type: "HISTORICAL" }],
    parentId: "e1000000-0000-4000-8000-000000000040",
    hostSystemId: "f1000000-0000-4000-8000-000000000005",
    physical: { massJupiter: 3.835 },
    positional: { distanceLightYears: 41.06 },
    orbital: { semiMajorAxisAu: 5.957, orbitalPeriodDays: 5218, eccentricity: 0.02 },
    discovery: { year: 2002, method: "RADIAL_VELOCITY", facility: "Lick Observatory" },
    provenance: nasaExoplanetProvenance("55 Cancri d"),
    summary: "Massive outer gas giant with an orbital period of over 14 years.",
  },

  // ------------------------------------------------------------------------
  // WASP-12 SYSTEM (EXTREME HOT JUPITER)
  // ------------------------------------------------------------------------
  {
    id: "e1000000-0000-4000-8000-000000000050",
    slug: "wasp-12-star",
    canonicalName: "WASP-12",
    classification: { category: CelestialCategory.STELLAR, code: "STAR" },
    aliases: [{ name: "2MASS J06303279+2940202", type: "CATALOG" }],
    hostSystemId: "f1000000-0000-4000-8000-000000000006",
    childObjectIds: ["e1000000-0000-4000-8000-000000000051"],
    physical: {
      massSolar: 1.434,
      radiusSolar: 1.63,
      effectiveTemperatureK: 6300,
      luminositySolar: 3.45,
      spectralClass: "G0",
    },
    positional: { distanceLightYears: 1410, distanceParsecs: 432.3 },
    provenance: nasaExoplanetProvenance("WASP-12"),
    summary: "Yellow dwarf star hosting the famously doomed hot Jupiter WASP-12 b.",
  },
  {
    id: "e1000000-0000-4000-8000-000000000051",
    slug: "wasp-12-b",
    canonicalName: "WASP-12 b",
    classification: { category: CelestialCategory.PLANETARY, code: "GAS_GIANT" },
    aliases: [{ name: "WASP-12 b", type: "CATALOG" }],
    parentId: "e1000000-0000-4000-8000-000000000050",
    hostSystemId: "f1000000-0000-4000-8000-000000000006",
    physical: {
      massJupiter: 1.465,
      radiusJupiter: 1.937,
      meanTemperatureK: 2500,
      measurementsWithUncertainty: {
        massJupiter: createMeasurement(1.465, "M_jup", { upper: 0.074, lower: -0.074 }),
        radiusJupiter: createMeasurement(1.937, "R_jup", { upper: 0.051, lower: -0.051 }),
      },
    },
    positional: { distanceLightYears: 1410 },
    orbital: {
      semiMajorAxisAu: 0.0229,
      eccentricity: 0.049,
      orbitalPeriodDays: 1.09142,
      inclinationDeg: 83.37,
    },
    discovery: { year: 2008, method: "TRANSIT", facility: "SuperWASP" },
    provenance: nasaExoplanetProvenance("WASP-12 b"),
    summary:
      "Extreme pitch-black Hot Jupiter stretched into an egg shape by extreme tidal forces, slowly spiraling into its parent star.",
  },

  // ------------------------------------------------------------------------
  // HD 209458 SYSTEM (OSIRIS)
  // ------------------------------------------------------------------------
  {
    id: "e1000000-0000-4000-8000-000000000060",
    slug: "hd-209458-star",
    canonicalName: "HD 209458",
    standardDesignation: "HD 209458",
    classification: { category: CelestialCategory.STELLAR, code: "STAR" },
    aliases: [
      { name: "HIP 108859", type: "CATALOG" },
      { name: "BD+18 4917", type: "CATALOG" },
    ],
    hostSystemId: "f1000000-0000-4000-8000-000000000007",
    childObjectIds: ["e1000000-0000-4000-8000-000000000061"],
    physical: {
      massSolar: 1.148,
      radiusSolar: 1.155,
      effectiveTemperatureK: 6065,
      luminositySolar: 1.61,
      spectralClass: "G0V",
    },
    positional: { distanceLightYears: 159.0, distanceParsecs: 48.76 },
    provenance: nasaExoplanetProvenance("HD 209458"),
    summary:
      "G0V star in the constellation Pegasus, host to the historic transiting exoplanet Osiris.",
  },
  {
    id: "e1000000-0000-4000-8000-000000000061",
    slug: "hd-209458-b",
    canonicalName: "HD 209458 b",
    standardDesignation: "Osiris",
    classification: { category: CelestialCategory.PLANETARY, code: "GAS_GIANT" },
    aliases: [
      { name: "Osiris", type: "HISTORICAL" },
      { name: "HD 209458 b", type: "CATALOG" },
    ],
    parentId: "e1000000-0000-4000-8000-000000000060",
    hostSystemId: "f1000000-0000-4000-8000-000000000007",
    physical: {
      massJupiter: 0.69,
      radiusJupiter: 1.38,
      meanTemperatureK: 1450,
      measurementsWithUncertainty: {
        massJupiter: createMeasurement(0.69, "M_jup", { upper: 0.05, lower: -0.05 }),
        radiusJupiter: createMeasurement(1.38, "R_jup", { upper: 0.02, lower: -0.02 }),
      },
    },
    positional: { distanceLightYears: 159.0 },
    orbital: {
      semiMajorAxisAu: 0.04707,
      eccentricity: 0.007,
      orbitalPeriodDays: 3.52474859,
      inclinationDeg: 86.71,
    },
    discovery: {
      year: 1999,
      method: "TRANSIT",
      facility: "Observatoire de Haute-Provence / Keck",
      referenceCitation: "Charbonneau et al. (2000)",
    },
    provenance: nasaExoplanetProvenance("HD 209458 b"),
    summary:
      "The first transiting exoplanet discovered, and the first exoplanet confirmed to have water vapor, carbon monoxide, and an evaporating comet-like hydrogen tail.",
  },
];
