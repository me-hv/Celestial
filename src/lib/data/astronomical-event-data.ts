import { AstronomicalEvent } from "@/domain/astronomical-event/types";

export const ASTRONOMICAL_EVENTS: AstronomicalEvent[] = [
  // 1. Saturn at Opposition (2026)
  {
    id: "evt-saturn-opposition-2026",
    slug: "saturn-at-opposition-2026",
    title: "Saturn at Opposition (Closest Approach & Ring Edge-On Orientation)",
    description:
      "Saturn reaches 180° elongation opposite the Sun, rising at sunset and remaining visible all night in Aquarius. Ring inclination is extremely shallow (~2° to edge-on), providing a rare view of Saturn's atmospheric bands and moons.",
    eventType: "OPPOSITION",
    eventDate: "2026-09-21T00:00:00Z",
    peakTime: "2026-09-21T03:30:00Z",
    durationHours: 12,
    targetSlugs: ["saturn", "solar-system"],
    primaryTargetName: "Saturn",
    secondaryTargetName: "Titan / Enceladus",
    constellation: "Aquarius",
    visibilityDescription:
      "Visible all night globally from sunset to sunrise. Culminates around local midnight.",
    nakedEyeVisible: true,
    recommendedOptics: "SMALL_TELESCOPE",
    observerLatitudeRange: {
      minLatDeg: -80,
      maxLatDeg: 75,
      optimalRegion: "Global (Equatorial and Temperate Latitudes)",
    },
    apparentMagnitudeV: 0.55,
    lunarIlluminationFraction: 0.72,
    scientificSignificance:
      "Optimal photometric and spectroscopic viewing geometry with minimum geocentric distance (8.66 AU) and near-zero phase angle (opposition surge).",
    epistemicStatus: "MODEL_DERIVED",
    provenance: {
      sourceId: "src-jpl-horizons-evt-001",
      recordIdentifier: "REC-src-jpl-horizons-evt-001",
      authoritativeBody: "NASA",
      catalogName: "JPL Horizons Ephemeris DE440",
      citationUrl: "https://ssd.jpl.nasa.gov/horizons/",
      confidenceScore: 0.9999,
      retrievedAt: "2026-08-28T00:00:00.000Z",
    },
    tags: ["Saturn", "Opposition", "Rings", "Aquarius", "Planets"],
  },

  // 2. Jupiter & Mars Close Conjunction (2026)
  {
    id: "evt-jupiter-mars-conjunction-2026",
    slug: "jupiter-mars-close-conjunction-2026",
    title: "Great Planetary Conjunction: Jupiter and Mars (0.31° Separation)",
    description:
      "Spectacular ultra-close pre-dawn conjunction of Jupiter (-2.2 mag) and Mars (+0.8 mag) in Taurus, fitting within the same high-power telescope eyepiece field of view.",
    eventType: "CONJUNCTION",
    eventDate: "2026-10-18T04:00:00Z",
    peakTime: "2026-10-18T05:15:00Z",
    durationHours: 3.5,
    targetSlugs: ["jupiter", "mars", "solar-system"],
    primaryTargetName: "Jupiter",
    secondaryTargetName: "Mars",
    constellation: "Taurus",
    visibilityDescription: "Best viewed in the eastern sky 2 to 3 hours before sunrise.",
    nakedEyeVisible: true,
    recommendedOptics: "BINOCULARS",
    observerLatitudeRange: {
      minLatDeg: -60,
      maxLatDeg: 80,
      optimalRegion: "Northern Hemisphere and Tropics",
    },
    angularSeparationDeg: 0.31,
    apparentMagnitudeV: -2.2,
    lunarIlluminationFraction: 0.38,
    scientificSignificance:
      "High-precision astrometric calibration benchmark and multi-target comparative photometry opportunity.",
    epistemicStatus: "MODEL_DERIVED",
    provenance: {
      sourceId: "src-imcce-conjunction-001",
      recordIdentifier: "REC-src-imcce-conjunction-001",
      authoritativeBody: "IAU",
      catalogName: "IMCCE / Paris Observatory Ephemerides",
      citationUrl: "https://www.imcce.fr",
      confidenceScore: 0.9999,
      retrievedAt: "2026-08-28T00:00:00.000Z",
    },
    tags: ["Jupiter", "Mars", "Conjunction", "Taurus", "Double Planet"],
  },

  // 3. Perseid Meteor Shower Peak (2026)
  {
    id: "evt-perseids-meteor-shower-2026",
    slug: "perseid-meteor-shower-peak-2026",
    title: "Perseid Meteor Shower Maximum (ZHR ~ 100)",
    description:
      "Annual meteor shower produced by debris from Comet 109P/Swift-Tuttle entering Earth's upper atmosphere at 59 km/s, featuring abundant bright fireballs with persistent trains.",
    eventType: "METEOR_SHOWER",
    eventDate: "2026-08-12T21:00:00Z",
    peakTime: "2026-08-13T01:00:00Z",
    durationHours: 8,
    targetSlugs: ["comet-109p-swift-tuttle", "solar-system"],
    primaryTargetName: "Perseus Radiant",
    secondaryTargetName: "Comet 109P/Swift-Tuttle Debris Stream",
    constellation: "Perseus",
    visibilityDescription:
      "Visible across the entire sky after midnight; look toward dark sky away from city lights.",
    nakedEyeVisible: true,
    recommendedOptics: "NAKED_EYE",
    observerLatitudeRange: {
      minLatDeg: -10,
      maxLatDeg: 90,
      optimalRegion: "Northern Hemisphere (Latitude > 20° N)",
    },
    apparentMagnitudeV: -2.0,
    lunarIlluminationFraction: 0.04,
    scientificSignificance:
      "Upper atmospheric spectroscopy of cometary refractory dust grains (Fe, Mg, Na, Ca ablation lines) and meteoroid stream evolution modeling.",
    epistemicStatus: "OBSERVED",
    provenance: {
      sourceId: "src-imo-perseids-001",
      recordIdentifier: "REC-src-imo-perseids-001",
      authoritativeBody: "IAU",
      catalogName: "International Meteor Organization (IMO) Working List",
      citationUrl: "https://www.imo.net",
      confidenceScore: 0.995,
      retrievedAt: "2026-08-28T00:00:00.000Z",
    },
    tags: ["Perseids", "Meteor Shower", "Comet Swift-Tuttle", "Fireballs", "Perseus"],
  },

  // 4. Total Lunar Eclipse (Blood Moon 2026)
  {
    id: "evt-total-lunar-eclipse-2026",
    slug: "total-lunar-eclipse-blood-moon-2026",
    title: "Total Lunar Eclipse (Deep Umbral Blood Moon)",
    description:
      "The full Moon passes completely through Earth's central umbral shadow cone, illuminated only by refracted sunlight passing through Earth's atmosphere, casting a deep coppery red hue.",
    eventType: "LUNAR_ECLIPSE",
    eventDate: "2026-03-03T11:30:00Z",
    peakTime: "2026-03-03T11:34:00Z",
    durationHours: 3.5,
    targetSlugs: ["moon", "earth", "solar-system"],
    primaryTargetName: "Moon",
    secondaryTargetName: "Earth Umbra",
    constellation: "Leo",
    visibilityDescription:
      "Visible from Pacific Basin, Eastern Asia, Australia, and Western North America.",
    nakedEyeVisible: true,
    recommendedOptics: "NAKED_EYE",
    observerLatitudeRange: {
      minLatDeg: -80,
      maxLatDeg: 80,
      optimalRegion: "Asia-Pacific Region, Oceania, and Western Americas",
    },
    apparentMagnitudeV: -3.5,
    lunarIlluminationFraction: 1.0,
    scientificSignificance:
      "Spectroscopic transmission of Earth's atmosphere as an exoplanet analogue, stratospheric aerosol density mapping (Danjon scale estimation).",
    epistemicStatus: "MODEL_DERIVED",
    provenance: {
      sourceId: "src-nasa-eclipse-001",
      recordIdentifier: "REC-src-nasa-eclipse-001",
      authoritativeBody: "NASA",
      catalogName: "NASA Eclipse Web Site (Fred Espenak)",
      citationUrl: "https://eclipse.gsfc.nasa.gov",
      confidenceScore: 0.9999,
      retrievedAt: "2026-08-28T00:00:00.000Z",
    },
    tags: ["Lunar Eclipse", "Blood Moon", "Moon", "Umbra", "Leo"],
  },

  // 5. Total Solar Eclipse (2026 Greenland / Iceland / Spain)
  {
    id: "evt-total-solar-eclipse-2026",
    slug: "total-solar-eclipse-august-2026",
    title: "Total Solar Eclipse: Arctic, Iceland, and Northern Spain",
    description:
      "Moon completely occludes the solar disk along a narrow path of totality spanning northern Greenland, western Iceland, and northern Spain, revealing the solar white-light corona and chromospheric prominences.",
    eventType: "SOLAR_ECLIPSE",
    eventDate: "2026-08-12T17:45:00Z",
    peakTime: "2026-08-12T17:47:00Z",
    durationHours: 2.3,
    targetSlugs: ["sun", "moon", "solar-system"],
    primaryTargetName: "Sun",
    secondaryTargetName: "Solar Corona",
    constellation: "Leo",
    visibilityDescription:
      "Path of totality crosses Greenland, Iceland, Atlantic, and Spain. Partial eclipse visible across Europe and North Africa.",
    nakedEyeVisible: false,
    recommendedOptics: "SMALL_TELESCOPE",
    observerLatitudeRange: {
      minLatDeg: 35,
      maxLatDeg: 80,
      optimalRegion: "Spain (Burgos, Zaragoza, Mallorca) and Western Iceland (Reykjavik)",
    },
    apparentMagnitudeV: -26.7,
    lunarIlluminationFraction: 0.0,
    scientificSignificance:
      "High-resolution coronal magnetometry, polar plume dynamics, relativistic starlight deflection (Eddington test validation), and ionospheric total electron content (TEC) depletion.",
    epistemicStatus: "MODEL_DERIVED",
    provenance: {
      sourceId: "src-nasa-solar-eclipse-001",
      recordIdentifier: "REC-src-nasa-solar-eclipse-001",
      authoritativeBody: "NASA",
      catalogName: "NASA GSFC Eclipse Portal",
      citationUrl: "https://eclipse.gsfc.nasa.gov",
      confidenceScore: 0.9999,
      retrievedAt: "2026-08-28T00:00:00.000Z",
    },
    tags: ["Solar Eclipse", "Totality", "Corona", "Sun", "Spain", "Iceland"],
  },

  // 6. Comet C/2023 A3 (Tsuchinshan-ATLAS) Perihelion & Flyby
  {
    id: "evt-comet-c2023a3-perihelion",
    slug: "comet-tsuchinshan-atlas-perihelion",
    title: "Comet C/2023 A3 (Tsuchinshan-ATLAS) Close Earth Encounter",
    description:
      "Oort Cloud comet with hyper-extended dust tail and forward scattering enhancement, reaching peak visual magnitude +0.5 after passing perihelion at 0.39 AU from the Sun.",
    eventType: "COMET_APPROACH",
    eventDate: "2024-10-12T12:00:00Z",
    peakTime: "2024-10-12T18:00:00Z",
    durationHours: 96,
    targetSlugs: ["comet-c2023-a3", "solar-system"],
    primaryTargetName: "Comet C/2023 A3",
    constellation: "Virgo / Serpens",
    visibilityDescription: "Visible in western evening twilight shortly after sunset.",
    nakedEyeVisible: true,
    recommendedOptics: "BINOCULARS",
    observerLatitudeRange: {
      minLatDeg: -60,
      maxLatDeg: 60,
      optimalRegion: "Equatorial, Northern and Southern Temperate Latitudes",
    },
    apparentMagnitudeV: 0.5,
    lunarIlluminationFraction: 0.65,
    scientificSignificance:
      "First-time Oort cloud volatile sublimation diagnostics, CN/C2 gas production rates, and anti-tail geometry analysis.",
    epistemicStatus: "OBSERVED",
    provenance: {
      sourceId: "src-mpc-comet-001",
      recordIdentifier: "REC-src-mpc-comet-001",
      authoritativeBody: "IAU",
      catalogName: "Minor Planet Center (MPC) Observation Database",
      citationUrl: "https://minorplanetcenter.net",
      confidenceScore: 0.998,
      retrievedAt: "2026-08-28T00:00:00.000Z",
    },
    tags: ["Comet", "Tsuchinshan-ATLAS", "Oort Cloud", "Dust Tail", "Naked Eye"],
  },
];
