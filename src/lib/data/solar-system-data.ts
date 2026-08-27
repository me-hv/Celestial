import { CelestialObject } from "@/domain/celestial-object/types";
import {
  CelestialCategory,
  CelestialClassificationCode,
} from "@/domain/celestial-object/classification";

export const SOLAR_SYSTEM_IDS = {
  SUN: "10000000-0000-0000-0000-000000000001",
  MERCURY: "10000000-0000-0000-0000-000000000002",
  VENUS: "10000000-0000-0000-0000-000000000003",
  EARTH: "10000000-0000-0000-0000-000000000004",
  MOON: "10000000-0000-0000-0000-000000000005",
  MARS: "10000000-0000-0000-0000-000000000006",
  JUPITER: "10000000-0000-0000-0000-000000000007",
  SATURN: "10000000-0000-0000-0000-000000000008",
  URANUS: "10000000-0000-0000-0000-000000000009",
  NEPTUNE: "10000000-0000-0000-0000-000000000010",
  SOLAR_SYSTEM: "10000000-0000-0000-0000-000000000000",
} as const;

export const NASA_SSD_PROVENANCE = {
  sourceId: "src-nasa-ssd-jpl-001",
  authoritativeBody: "NASA" as const,
  catalogName: "NASA JPL Solar System Dynamics (SSD) & Horizons",
  catalogVersion: "DE440/DE441",
  citationUrl: "https://ssd.jpl.nasa.gov/planets/phys_par.html",
  recordIdentifier: "NASA-SSD:SOLAR_SYSTEM_J2000",
  confidenceScore: 0.999,
  retrievedAt: "2026-08-27T00:00:00.000Z",
};

export const SOLAR_SYSTEM_OBJECTS: CelestialObject[] = [
  // 1. SUN
  {
    id: SOLAR_SYSTEM_IDS.SUN,
    slug: "sun",
    canonicalName: "Sun",
    standardDesignation: "Sol",
    classification: {
      category: CelestialCategory.STELLAR,
      code: CelestialClassificationCode.STAR,
    },
    aliases: [
      { name: "Sol", type: "HISTORICAL" },
      { name: "Helios", type: "HISTORICAL" },
      { name: "The Sun", type: "COMMON" },
    ],
    hostSystemId: SOLAR_SYSTEM_IDS.SOLAR_SYSTEM,
    childObjectIds: [
      SOLAR_SYSTEM_IDS.MERCURY,
      SOLAR_SYSTEM_IDS.VENUS,
      SOLAR_SYSTEM_IDS.EARTH,
      SOLAR_SYSTEM_IDS.MARS,
      SOLAR_SYSTEM_IDS.JUPITER,
      SOLAR_SYSTEM_IDS.SATURN,
      SOLAR_SYSTEM_IDS.URANUS,
      SOLAR_SYSTEM_IDS.NEPTUNE,
    ],
    physical: {
      massKg: 1.98847e30,
      massSolar: 1.0,
      massEarth: 332946,
      meanRadiusKm: 696340,
      surfaceGravityMs2: 274.0,
      densityGcm3: 1.408,
      meanTemperatureK: 5778,
      spectralClass: "G2V",
      atmosphereComposition: [
        { molecule: "H2", percentage: 73.46 },
        { molecule: "He", percentage: 24.85 },
        { molecule: "O", percentage: 0.77 },
        { molecule: "C", percentage: 0.29 },
        { molecule: "Fe", percentage: 0.16 },
        { molecule: "Ne", percentage: 0.12 },
      ],
    },
    positional: {
      distanceLightYears: 0.0,
      distanceAu: 0.0,
      distanceKm: 0.0,
      epoch: "J2000",
    },
    discovery: {
      method: "ANTIQUITY",
    },
    provenance: NASA_SSD_PROVENANCE,
    summary:
      "The G-type main-sequence star at the gravitational center of the Solar System, containing 99.86% of its total mass.",
    isFeatured: true,
  },

  // 2. MERCURY
  {
    id: SOLAR_SYSTEM_IDS.MERCURY,
    slug: "mercury",
    canonicalName: "Mercury",
    standardDesignation: "Sol I",
    classification: {
      category: CelestialCategory.PLANETARY,
      code: CelestialClassificationCode.TERRESTRIAL_PLANET,
    },
    aliases: [
      { name: "Hermes", type: "HISTORICAL" },
      { name: "Sol I", type: "CATALOG" },
    ],
    parentId: SOLAR_SYSTEM_IDS.SUN,
    hostSystemId: SOLAR_SYSTEM_IDS.SOLAR_SYSTEM,
    physical: {
      massKg: 3.3011e23,
      massEarth: 0.0553,
      meanRadiusKm: 2439.7,
      surfaceGravityMs2: 3.7,
      densityGcm3: 5.427,
      meanTemperatureK: 440,
      atmosphereComposition: [
        { molecule: "O2", percentage: 42.0 },
        { molecule: "Na", percentage: 29.0 },
        { molecule: "H2", percentage: 22.0 },
        { molecule: "He", percentage: 6.0 },
      ],
    },
    positional: {
      distanceAu: 0.387,
    },
    orbital: {
      semiMajorAxisAu: 0.387098,
      eccentricity: 0.20563,
      inclinationDeg: 7.005,
      longitudeAscendingNodeDeg: 48.331,
      argumentPeriapsisDeg: 29.124,
      meanAnomalyDeg: 174.796,
      orbitalPeriodDays: 87.969,
      epochJulianDate: 2451545.0,
    },
    discovery: {
      method: "ANTIQUITY",
    },
    provenance: NASA_SSD_PROVENANCE,
    summary:
      "The smallest planet in the Solar System and the closest to the Sun, featuring an extreme temperature variation and iron-rich core.",
    isFeatured: true,
  },

  // 3. VENUS
  {
    id: SOLAR_SYSTEM_IDS.VENUS,
    slug: "venus",
    canonicalName: "Venus",
    standardDesignation: "Sol II",
    classification: {
      category: CelestialCategory.PLANETARY,
      code: CelestialClassificationCode.TERRESTRIAL_PLANET,
    },
    aliases: [
      { name: "Morning Star", type: "COMMON" },
      { name: "Evening Star", type: "COMMON" },
      { name: "Phosphorus", type: "HISTORICAL" },
      { name: "Hesperus", type: "HISTORICAL" },
    ],
    parentId: SOLAR_SYSTEM_IDS.SUN,
    hostSystemId: SOLAR_SYSTEM_IDS.SOLAR_SYSTEM,
    physical: {
      massKg: 4.8675e24,
      massEarth: 0.815,
      meanRadiusKm: 6051.8,
      surfaceGravityMs2: 8.87,
      densityGcm3: 5.243,
      meanTemperatureK: 737,
      atmosphereComposition: [
        { molecule: "CO2", percentage: 96.5 },
        { molecule: "N2", percentage: 3.5 },
        { molecule: "SO2", percentage: 0.015 },
      ],
    },
    positional: {
      distanceAu: 0.723,
    },
    orbital: {
      semiMajorAxisAu: 0.723332,
      eccentricity: 0.006772,
      inclinationDeg: 3.39458,
      longitudeAscendingNodeDeg: 76.68,
      argumentPeriapsisDeg: 54.884,
      meanAnomalyDeg: 50.115,
      orbitalPeriodDays: 224.701,
      epochJulianDate: 2451545.0,
    },
    discovery: {
      method: "ANTIQUITY",
    },
    provenance: NASA_SSD_PROVENANCE,
    summary:
      "Second planet from the Sun, enveloped in dense sulfuric acid clouds producing an intense greenhouse effect that makes it the hottest planet.",
    isFeatured: true,
  },

  // 4. EARTH
  {
    id: SOLAR_SYSTEM_IDS.EARTH,
    slug: "earth",
    canonicalName: "Earth",
    standardDesignation: "Sol III",
    classification: {
      category: CelestialCategory.PLANETARY,
      code: CelestialClassificationCode.TERRESTRIAL_PLANET,
    },
    aliases: [
      { name: "Terra", type: "HISTORICAL" },
      { name: "Gaia", type: "HISTORICAL" },
      { name: "The Blue Planet", type: "COMMON" },
      { name: "Sol III", type: "CATALOG" },
    ],
    parentId: SOLAR_SYSTEM_IDS.SUN,
    hostSystemId: SOLAR_SYSTEM_IDS.SOLAR_SYSTEM,
    childObjectIds: [SOLAR_SYSTEM_IDS.MOON],
    physical: {
      massKg: 5.9722e24,
      massEarth: 1.0,
      meanRadiusKm: 6371.0,
      surfaceGravityMs2: 9.807,
      densityGcm3: 5.514,
      meanTemperatureK: 288,
      atmosphereComposition: [
        { molecule: "N2", percentage: 78.08 },
        { molecule: "O2", percentage: 20.95 },
        { molecule: "Ar", percentage: 0.93 },
        { molecule: "CO2", percentage: 0.04 },
      ],
    },
    positional: {
      distanceAu: 1.0,
    },
    orbital: {
      semiMajorAxisAu: 1.00000011,
      eccentricity: 0.01671022,
      inclinationDeg: 0.00005,
      longitudeAscendingNodeDeg: 348.74,
      argumentPeriapsisDeg: 102.947,
      meanAnomalyDeg: 100.464,
      orbitalPeriodDays: 365.256,
      epochJulianDate: 2451545.0,
    },
    discovery: {
      method: "ANTIQUITY",
    },
    provenance: NASA_SSD_PROVENANCE,
    summary:
      "Third planet from the Sun, the densest major body in the Solar System, and the only astronomical object confirmed to harbor life and surface liquid water.",
    isFeatured: true,
  },

  // 5. MOON
  {
    id: SOLAR_SYSTEM_IDS.MOON,
    slug: "moon",
    canonicalName: "Moon",
    standardDesignation: "Earth I",
    classification: {
      category: CelestialCategory.SATELLITE,
      code: CelestialClassificationCode.MOON,
    },
    aliases: [
      { name: "Luna", type: "HISTORICAL" },
      { name: "Selene", type: "HISTORICAL" },
      { name: "The Moon", type: "COMMON" },
      { name: "Earth I", type: "CATALOG" },
    ],
    parentId: SOLAR_SYSTEM_IDS.EARTH,
    hostSystemId: SOLAR_SYSTEM_IDS.SOLAR_SYSTEM,
    physical: {
      massKg: 7.342e22,
      massEarth: 0.0123,
      meanRadiusKm: 1737.4,
      surfaceGravityMs2: 1.62,
      densityGcm3: 3.344,
      meanTemperatureK: 220,
      atmosphereComposition: [
        { molecule: "He", percentage: 29.0 },
        { molecule: "Ne", percentage: 29.0 },
        { molecule: "H2", percentage: 22.0 },
        { molecule: "Ar", percentage: 20.0 },
      ],
    },
    positional: {
      distanceKm: 384400,
    },
    orbital: {
      semiMajorAxisKm: 384400,
      semiMajorAxisAu: 0.00257,
      eccentricity: 0.0549,
      inclinationDeg: 5.145,
      orbitalPeriodDays: 27.321,
      epochJulianDate: 2451545.0,
    },
    discovery: {
      method: "ANTIQUITY",
    },
    provenance: NASA_SSD_PROVENANCE,
    summary:
      "Earth's sole natural satellite in synchronous tidal rotation, the fifth-largest satellite in the Solar System.",
    isFeatured: true,
  },

  // 6. MARS
  {
    id: SOLAR_SYSTEM_IDS.MARS,
    slug: "mars",
    canonicalName: "Mars",
    standardDesignation: "Sol IV",
    classification: {
      category: CelestialCategory.PLANETARY,
      code: CelestialClassificationCode.TERRESTRIAL_PLANET,
    },
    aliases: [
      { name: "The Red Planet", type: "COMMON" },
      { name: "Ares", type: "HISTORICAL" },
      { name: "Sol IV", type: "CATALOG" },
    ],
    parentId: SOLAR_SYSTEM_IDS.SUN,
    hostSystemId: SOLAR_SYSTEM_IDS.SOLAR_SYSTEM,
    physical: {
      massKg: 6.4171e23,
      massEarth: 0.107,
      meanRadiusKm: 3389.5,
      surfaceGravityMs2: 3.72,
      densityGcm3: 3.9335,
      meanTemperatureK: 210,
      atmosphereComposition: [
        { molecule: "CO2", percentage: 95.32 },
        { molecule: "N2", percentage: 2.6 },
        { molecule: "Ar", percentage: 1.9 },
        { molecule: "O2", percentage: 0.13 },
      ],
    },
    positional: {
      distanceAu: 1.524,
    },
    orbital: {
      semiMajorAxisAu: 1.523662,
      eccentricity: 0.093412,
      inclinationDeg: 1.85,
      longitudeAscendingNodeDeg: 49.578,
      argumentPeriapsisDeg: 286.502,
      meanAnomalyDeg: 19.373,
      orbitalPeriodDays: 686.98,
      epochJulianDate: 2451545.0,
    },
    discovery: {
      method: "ANTIQUITY",
    },
    provenance: NASA_SSD_PROVENANCE,
    summary:
      "Fourth planet from the Sun, a dusty desert world with a thin carbon dioxide atmosphere, polar ice caps, and dormant volcanoes including Olympus Mons.",
    isFeatured: true,
  },

  // 7. JUPITER
  {
    id: SOLAR_SYSTEM_IDS.JUPITER,
    slug: "jupiter",
    canonicalName: "Jupiter",
    standardDesignation: "Sol V",
    classification: {
      category: CelestialCategory.PLANETARY,
      code: CelestialClassificationCode.GAS_GIANT,
    },
    aliases: [
      { name: "Jove", type: "HISTORICAL" },
      { name: "Zeus", type: "HISTORICAL" },
      { name: "King of Planets", type: "COMMON" },
      { name: "Sol V", type: "CATALOG" },
    ],
    parentId: SOLAR_SYSTEM_IDS.SUN,
    hostSystemId: SOLAR_SYSTEM_IDS.SOLAR_SYSTEM,
    physical: {
      massKg: 1.8982e27,
      massEarth: 317.8,
      meanRadiusKm: 69911,
      surfaceGravityMs2: 24.79,
      densityGcm3: 1.326,
      meanTemperatureK: 165,
      atmosphereComposition: [
        { molecule: "H2", percentage: 89.8 },
        { molecule: "He", percentage: 10.2 },
        { molecule: "CH4", percentage: 0.3 },
      ],
    },
    positional: {
      distanceAu: 5.204,
    },
    orbital: {
      semiMajorAxisAu: 5.203363,
      eccentricity: 0.048392,
      inclinationDeg: 1.3053,
      longitudeAscendingNodeDeg: 100.556,
      argumentPeriapsisDeg: 273.867,
      meanAnomalyDeg: 20.02,
      orbitalPeriodDays: 4332.589,
      epochJulianDate: 2451545.0,
    },
    discovery: {
      method: "ANTIQUITY",
    },
    provenance: NASA_SSD_PROVENANCE,
    summary:
      "The largest planet in the Solar System, a gas giant with more than twice the mass of all other planets combined, famous for its Great Red Spot storm.",
    isFeatured: true,
  },

  // 8. SATURN
  {
    id: SOLAR_SYSTEM_IDS.SATURN,
    slug: "saturn",
    canonicalName: "Saturn",
    standardDesignation: "Sol VI",
    classification: {
      category: CelestialCategory.PLANETARY,
      code: CelestialClassificationCode.GAS_GIANT,
    },
    aliases: [
      { name: "Ringed Planet", type: "COMMON" },
      { name: "Cronus", type: "HISTORICAL" },
      { name: "Sol VI", type: "CATALOG" },
    ],
    parentId: SOLAR_SYSTEM_IDS.SUN,
    hostSystemId: SOLAR_SYSTEM_IDS.SOLAR_SYSTEM,
    physical: {
      massKg: 5.6834e26,
      massEarth: 95.16,
      meanRadiusKm: 58232,
      surfaceGravityMs2: 10.44,
      densityGcm3: 0.687,
      meanTemperatureK: 134,
      atmosphereComposition: [
        { molecule: "H2", percentage: 96.3 },
        { molecule: "He", percentage: 3.25 },
        { molecule: "CH4", percentage: 0.45 },
      ],
    },
    positional: {
      distanceAu: 9.537,
    },
    orbital: {
      semiMajorAxisAu: 9.53707,
      eccentricity: 0.05415,
      inclinationDeg: 2.48446,
      longitudeAscendingNodeDeg: 113.715,
      argumentPeriapsisDeg: 339.392,
      meanAnomalyDeg: 317.02,
      orbitalPeriodDays: 10759.22,
      epochJulianDate: 2451545.0,
    },
    discovery: {
      method: "ANTIQUITY",
    },
    provenance: NASA_SSD_PROVENANCE,
    summary:
      "Sixth planet from the Sun and the second-largest in the Solar System, distinguished by an extensive, luminous planetary ring system composed mainly of water ice.",
    isFeatured: true,
  },

  // 9. URANUS
  {
    id: SOLAR_SYSTEM_IDS.URANUS,
    slug: "uranus",
    canonicalName: "Uranus",
    standardDesignation: "Sol VII",
    classification: {
      category: CelestialCategory.PLANETARY,
      code: CelestialClassificationCode.ICE_GIANT,
    },
    aliases: [
      { name: "Ouranos", type: "HISTORICAL" },
      { name: "Sol VII", type: "CATALOG" },
      { name: "The Ice Giant", type: "COMMON" },
    ],
    parentId: SOLAR_SYSTEM_IDS.SUN,
    hostSystemId: SOLAR_SYSTEM_IDS.SOLAR_SYSTEM,
    physical: {
      massKg: 8.681e25,
      massEarth: 14.54,
      meanRadiusKm: 25362,
      surfaceGravityMs2: 8.69,
      densityGcm3: 1.27,
      meanTemperatureK: 76,
      atmosphereComposition: [
        { molecule: "H2", percentage: 82.5 },
        { molecule: "He", percentage: 15.2 },
        { molecule: "CH4", percentage: 2.3 },
      ],
    },
    positional: {
      distanceAu: 19.191,
    },
    orbital: {
      semiMajorAxisAu: 19.19126,
      eccentricity: 0.047168,
      inclinationDeg: 0.76986,
      longitudeAscendingNodeDeg: 74.22988,
      argumentPeriapsisDeg: 96.734,
      meanAnomalyDeg: 142.2386,
      orbitalPeriodDays: 30688.5,
      epochJulianDate: 2451545.0,
    },
    discovery: {
      year: 1781,
      discoveredBy: "William Herschel",
      method: "OTHER",
    },
    provenance: NASA_SSD_PROVENANCE,
    summary:
      "Seventh planet from the Sun, an ice giant with a dramatic axial tilt of 97.77 degrees, rotating virtually on its side.",
    isFeatured: true,
  },

  // 10. NEPTUNE
  {
    id: SOLAR_SYSTEM_IDS.NEPTUNE,
    slug: "neptune",
    canonicalName: "Neptune",
    standardDesignation: "Sol VIII",
    classification: {
      category: CelestialCategory.PLANETARY,
      code: CelestialClassificationCode.ICE_GIANT,
    },
    aliases: [
      { name: "Poseidon", type: "HISTORICAL" },
      { name: "Sol VIII", type: "CATALOG" },
    ],
    parentId: SOLAR_SYSTEM_IDS.SUN,
    hostSystemId: SOLAR_SYSTEM_IDS.SOLAR_SYSTEM,
    physical: {
      massKg: 1.02413e26,
      massEarth: 17.15,
      meanRadiusKm: 24622,
      surfaceGravityMs2: 11.15,
      densityGcm3: 1.638,
      meanTemperatureK: 72,
      atmosphereComposition: [
        { molecule: "H2", percentage: 80.0 },
        { molecule: "He", percentage: 19.0 },
        { molecule: "CH4", percentage: 1.5 },
      ],
    },
    positional: {
      distanceAu: 30.069,
    },
    orbital: {
      semiMajorAxisAu: 30.06896,
      eccentricity: 0.008586,
      inclinationDeg: 1.76917,
      longitudeAscendingNodeDeg: 131.72169,
      argumentPeriapsisDeg: 273.187,
      meanAnomalyDeg: 256.228,
      orbitalPeriodDays: 60182.0,
      epochJulianDate: 2451545.0,
    },
    discovery: {
      year: 1846,
      discoveredBy: "Urbain Le Verrier & Johann Galle",
      method: "OTHER",
    },
    provenance: NASA_SSD_PROVENANCE,
    summary:
      "The outermost known major planet in the Solar System, an ice giant with supersonic winds and a vivid azure coloration from atmospheric methane.",
    isFeatured: true,
  },
];
