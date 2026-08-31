import { Galaxy } from "@/domain/galaxy/types";

export const LOCAL_GROUP_GALAXIES_DATA: Galaxy[] = [
  // ==========================================
  // 1. THE MILKY WAY GALAXY
  // ==========================================
  {
    id: "g1000000-0000-4000-8000-000000000001",
    slug: "milky-way-galaxy",
    name: "Milky Way Galaxy",
    standardDesignation: "The Galaxy / Via Lactea",
    aliases: ["Milky Way", "The Galaxy", "Via Lactea", "MW Galaxy", "Our Galaxy"],
    summary:
      "A massive barred spiral galaxy of Hubble type SB(rs)bc, containing 100-400 billion stars and hosting our Solar System at ~8.18 kpc from the central supermassive black hole Sagittarius A*.",
    morphology: {
      class: "BARRED_SPIRAL",
      hubbleDeVaucouleurs: "SB(rs)bc",
      isModelDerived: true,
      notes:
        "Central bar of length ~10 kpc with two major logarithmic spiral arms and local spurs.",
    },
    physical: {
      diameterLy: { value: 100000, uncertainty: { upper: 10000, lower: 10000 }, unit: "ly" },
      diameterKpc: { value: 26.8, uncertainty: { upper: 2.5, lower: 2.5 }, unit: "kpc" },
      stellarMassSolar: {
        value: 5.4e10,
        uncertainty: { upper: 0.5e10, lower: 0.5e10 },
        unit: "M_sun",
      },
      totalMassSolar: {
        value: 1.15e12,
        uncertainty: { upper: 0.2e12, lower: 0.2e12 },
        unit: "M_sun",
      },
      neutralHydrogenMassSolar: { value: 1.0e10, unit: "M_sun" },
      starFormationRateSolarMassPerYr: 1.65,
      metallicityFeH: 0.0,
      absoluteMagnitudeV: -20.9,
    },
    kinematics: {
      heliocentricRadialVelocityKmS: { value: 0.0, unit: "km/s" },
      galactocentricRadialVelocityKmS: { value: 0.0, unit: "km/s" },
      rotationalVelocityKmS: { value: 234.0, uncertainty: { upper: 10, lower: 10 }, unit: "km/s" },
    },
    orientation: {
      inclinationDeg: 0.0, // Reference origin
      positionAngleDeg: 0.0,
      majorAxisArcmin: 0.0,
      minorAxisArcmin: 0.0,
      axisRatio: 1.0,
    },
    distance: {
      distanceLy: { value: 0.0, unit: "ly" },
      distanceKpc: { value: 0.0, unit: "kpc" },
      distanceMpc: { value: 0.0, unit: "Mpc" },
      primaryMethod: "LITERATURE_CONSENSUS",
      derivedLookbackTimeYears: 0.0,
    },
    positional: {
      rightAscensionDeg: 266.4168,
      declinationDeg: -29.0078,
      distanceLightYears: 0.0,
      distanceParsecs: 0.0,
      galacticCoordinates: { lDeg: 0.0, bDeg: 0.0 },
    },
    groupMembership: {
      groupId: "local-group",
      groupName: "Local Group",
      membershipType: "PRIMARY_MEMBER",
      subgroupId: "MILKY_WAY_SUBGROUP",
    },
    relationships: [
      {
        targetGalaxySlug: "andromeda-galaxy",
        targetGalaxyName: "Andromeda Galaxy (M31)",
        relationshipType: "APPROACHING",
        relativeVelocityKmS: -110.0,
        separationKpc: 778.0,
        description:
          "Approaching Milky Way at ~110 km/s, predicted to gravitationally coalesce in ~4.5 billion years.",
        isFutureInteraction: true,
      },
      {
        targetGalaxySlug: "large-magellanic-cloud",
        targetGalaxyName: "Large Magellanic Cloud (LMC)",
        relationshipType: "HOST_TO",
        separationKpc: 49.97,
        description: "Primary massive satellite galaxy in close bound orbit.",
      },
      {
        targetGalaxySlug: "small-magellanic-cloud",
        targetGalaxyName: "Small Magellanic Cloud (SMC)",
        relationshipType: "HOST_TO",
        separationKpc: 62.1,
        description:
          "Secondary dwarf irregular satellite interacting with LMC through Magellanic Stream.",
      },
    ],
    provenance: {
      authoritativeBody: "IAU",
      catalogName: "Bland-Hawthorn & Gerhard (2016) / Gaia DR3",
      recordIdentifier: "MILKY_WAY_CANONICAL",
      confidenceScore: 0.99,
      citationUrl: "https://www.annualreviews.org/doi/abs/10.1146/annurev-astro-081915-023441",
    },
  },

  // ==========================================
  // 2. ANDROMEDA GALAXY (M31 / NGC 224)
  // ==========================================
  {
    id: "g1000000-0000-4000-8000-000000000002",
    slug: "andromeda-galaxy",
    name: "Andromeda Galaxy",
    standardDesignation: "M31 / NGC 224 / UGC 454 / PGC 2557",
    aliases: [
      "Andromeda Galaxy",
      "M31",
      "NGC 224",
      "Andromeda Nebula",
      "Great Andromeda Galaxy",
      "UGC 454",
    ],
    summary:
      "The most massive galaxy in the Local Group (spanning ~220,000 ly across), an inclined barred spiral SA(s)b galaxy located 2.54 million light-years from Earth in Andromeda.",
    morphology: {
      class: "BARRED_SPIRAL",
      hubbleDeVaucouleurs: "SA(s)b / SBb",
      isModelDerived: false,
      notes:
        "Large stellar disk with warped outer hydrogen ring and dense double-peaked stellar nucleus.",
    },
    physical: {
      diameterLy: { value: 220000, uncertainty: { upper: 15000, lower: 15000 }, unit: "ly" },
      diameterKpc: { value: 46.6, uncertainty: { upper: 3.0, lower: 3.0 }, unit: "kpc" },
      stellarMassSolar: {
        value: 1.1e11,
        uncertainty: { upper: 0.2e11, lower: 0.2e11 },
        unit: "M_sun",
      },
      totalMassSolar: {
        value: 1.5e12,
        uncertainty: { upper: 0.3e12, lower: 0.3e12 },
        unit: "M_sun",
      },
      starFormationRateSolarMassPerYr: 0.7,
      metallicityFeH: -0.1,
      absoluteMagnitudeV: -21.7,
      apparentMagnitudeV: 3.44,
    },
    kinematics: {
      heliocentricRadialVelocityKmS: {
        value: -301.0,
        uncertainty: { upper: 1.0, lower: 1.0 },
        unit: "km/s",
      },
      galactocentricRadialVelocityKmS: {
        value: -110.0,
        uncertainty: { upper: 4.0, lower: 4.0 },
        unit: "km/s",
      },
      spectroscopicRedshiftZ: { value: -0.001001, unit: "z" },
      rotationalVelocityKmS: { value: 260.0, uncertainty: { upper: 10, lower: 10 }, unit: "km/s" },
      velocityDispersionKmS: 160.0,
    },
    orientation: {
      inclinationDeg: 77.0, // Edge-on tilt
      positionAngleDeg: 35.0, // Major axis position angle
      majorAxisArcmin: 190.0,
      minorAxisArcmin: 60.0,
      axisRatio: 0.316,
    },
    distance: {
      distanceLy: { value: 2537000, uncertainty: { upper: 55000, lower: 55000 }, unit: "ly" },
      distanceKpc: { value: 778.0, uncertainty: { upper: 17.0, lower: 17.0 }, unit: "kpc" },
      distanceMpc: { value: 0.778, uncertainty: { upper: 0.017, lower: 0.017 }, unit: "Mpc" },
      primaryMethod: "TRGB",
      derivedLookbackTimeYears: 2537000,
    },
    positional: {
      rightAscensionDeg: 10.6847, // 00h 42m 44.3s
      declinationDeg: 41.2687, // +41° 16' 07''
      distanceLightYears: 2537000,
      distanceParsecs: 778000,
      galacticCoordinates: { lDeg: 121.1743, bDeg: -21.5733 },
    },
    catalogIdentifiers: {
      messier: "M31",
      ngc: "NGC 224",
      ugc: "UGC 454",
      pgc: "PGC 2557",
    },
    groupMembership: {
      groupId: "local-group",
      groupName: "Local Group",
      membershipType: "PRIMARY_MEMBER",
      subgroupId: "ANDROMEDA_SUBGROUP",
    },
    relationships: [
      {
        targetGalaxySlug: "milky-way-galaxy",
        targetGalaxyName: "Milky Way Galaxy",
        relationshipType: "APPROACHING",
        relativeVelocityKmS: -110.0,
        separationKpc: 778.0,
        description: "Gravitationally bound major pair approaching mutual collision in ~4.5 Gyr.",
        isFutureInteraction: true,
      },
      {
        targetGalaxySlug: "triangulum-galaxy",
        targetGalaxyName: "Triangulum Galaxy (M33)",
        relationshipType: "GRAVITATIONAL_ASSOCIATION",
        separationKpc: 230.0,
        description: "Close companion galaxy bound in the Andromeda Subgroup.",
      },
      {
        targetGalaxySlug: "m32-galaxy",
        targetGalaxyName: "Messier 32 (M32 / NGC 221)",
        relationshipType: "HOST_TO",
        separationKpc: 8.0,
        description: "Compact elliptical satellite galaxy orbiting near M31's disk.",
      },
      {
        targetGalaxySlug: "m110-galaxy",
        targetGalaxyName: "Messier 110 (M110 / NGC 205)",
        relationshipType: "HOST_TO",
        separationKpc: 12.0,
        description: "Dwarf elliptical satellite galaxy in Andromeda's extended halo.",
      },
    ],
    observations: [
      {
        id: "obs-m31-galex-uv",
        wavelengthBand: "ULTRAVIOLET",
        telescopeOrSurvey: "GALEX Space Telescope",
        citationOrCredit: "NASA / JPL-Caltech",
      },
      {
        id: "obs-m31-spitzer-ir",
        wavelengthBand: "INFRARED",
        filterOrFrequency: "24 µm (MIPS)",
        telescopeOrSurvey: "Spitzer Space Telescope",
        citationOrCredit: "NASA / JPL-Caltech / K. Gordon",
      },
    ],
    provenance: {
      authoritativeBody: "NASA",
      catalogName: "NASA/IPAC Extragalactic Database (NED) / Riess et al. (2012)",
      recordIdentifier: "MESSIER 031",
      confidenceScore: 0.99,
      citationUrl: "https://ned.ipac.caltech.edu/byname?objname=MESSIER+031",
    },
  },

  // ==========================================
  // 3. TRIANGULUM GALAXY (M33 / NGC 598)
  // ==========================================
  {
    id: "g1000000-0000-4000-8000-000000000003",
    slug: "triangulum-galaxy",
    name: "Triangulum Galaxy",
    standardDesignation: "M33 / NGC 598 / UGC 1117 / PGC 5818",
    aliases: ["Triangulum Galaxy", "M33", "NGC 598", "Pinwheel Galaxy (Triangulum)", "UGC 1117"],
    summary:
      "The third-largest galaxy in the Local Group (spanning ~60,000 ly), an active unbarred spiral SA(s)cd galaxy located 2.80 million light-years from Earth in Triangulum, harboring giant H II nursery NGC 604.",
    morphology: {
      class: "SPIRAL",
      hubbleDeVaucouleurs: "SA(s)cd",
      isModelDerived: false,
      notes:
        "Open spiral structure with high specific star formation rate and no prominent central bar.",
    },
    physical: {
      diameterLy: { value: 60000, uncertainty: { upper: 5000, lower: 5000 }, unit: "ly" },
      diameterKpc: { value: 18.7, uncertainty: { upper: 1.5, lower: 1.5 }, unit: "kpc" },
      stellarMassSolar: {
        value: 4.5e9,
        uncertainty: { upper: 0.8e9, lower: 0.8e9 },
        unit: "M_sun",
      },
      totalMassSolar: {
        value: 5.0e10,
        uncertainty: { upper: 1.0e10, lower: 1.0e10 },
        unit: "M_sun",
      },
      starFormationRateSolarMassPerYr: 0.45,
      metallicityFeH: -0.3,
      absoluteMagnitudeV: -18.9,
      apparentMagnitudeV: 5.72,
    },
    kinematics: {
      heliocentricRadialVelocityKmS: {
        value: -179.0,
        uncertainty: { upper: 3.0, lower: 3.0 },
        unit: "km/s",
      },
      galactocentricRadialVelocityKmS: {
        value: -44.0,
        uncertainty: { upper: 5.0, lower: 5.0 },
        unit: "km/s",
      },
      spectroscopicRedshiftZ: { value: -0.000597, unit: "z" },
      rotationalVelocityKmS: {
        value: 105.0,
        uncertainty: { upper: 8.0, lower: 8.0 },
        unit: "km/s",
      },
    },
    orientation: {
      inclinationDeg: 56.0,
      positionAngleDeg: 23.0,
      majorAxisArcmin: 70.8,
      minorAxisArcmin: 41.7,
      axisRatio: 0.589,
    },
    distance: {
      distanceLy: { value: 2800000, uncertainty: { upper: 60000, lower: 60000 }, unit: "ly" },
      distanceKpc: { value: 859.0, uncertainty: { upper: 19.0, lower: 19.0 }, unit: "kpc" },
      distanceMpc: { value: 0.859, uncertainty: { upper: 0.019, lower: 0.019 }, unit: "Mpc" },
      primaryMethod: "CEPHEID",
      derivedLookbackTimeYears: 2800000,
    },
    positional: {
      rightAscensionDeg: 23.4621, // 01h 33m 50.9s
      declinationDeg: 30.6602, // +30° 39' 37''
      distanceLightYears: 2800000,
      distanceParsecs: 859000,
      galacticCoordinates: { lDeg: 133.6102, bDeg: -31.3304 },
    },
    catalogIdentifiers: {
      messier: "M33",
      ngc: "NGC 598",
      ugc: "UGC 1117",
      pgc: "PGC 5818",
    },
    groupMembership: {
      groupId: "local-group",
      groupName: "Local Group",
      membershipType: "PRIMARY_MEMBER",
      subgroupId: "ANDROMEDA_SUBGROUP",
    },
    relationships: [
      {
        targetGalaxySlug: "andromeda-galaxy",
        targetGalaxyName: "Andromeda Galaxy (M31)",
        relationshipType: "GRAVITATIONAL_ASSOCIATION",
        separationKpc: 230.0,
        description:
          "Tidally interacting companion in Andromeda subgroup; may be on its first orbital infall.",
      },
    ],
    provenance: {
      authoritativeBody: "NASA",
      catalogName: "NASA/IPAC Extragalactic Database (NED) / Gieren et al. (2013)",
      recordIdentifier: "MESSIER 033",
      confidenceScore: 0.98,
      citationUrl: "https://ned.ipac.caltech.edu/byname?objname=MESSIER+033",
    },
  },

  // ==========================================
  // 4. LARGE MAGELLANIC CLOUD (LMC)
  // ==========================================
  {
    id: "g1000000-0000-4000-8000-000000000004",
    slug: "large-magellanic-cloud",
    name: "Large Magellanic Cloud",
    standardDesignation: "LMC / PGC 17223",
    aliases: ["Large Magellanic Cloud", "LMC", "Nubecula Major", "PGC 17223", "ESO 56-115"],
    summary:
      "The most massive satellite galaxy of the Milky Way (163,000 ly from Earth), a disrupted Magellanic spiral SB(s)m galaxy hosting the Tarantula Nebula (30 Doradus) and supernova SN 1987A.",
    morphology: {
      class: "IRREGULAR",
      hubbleDeVaucouleurs: "SB(s)m",
      isModelDerived: false,
      notes:
        "Single prominent off-center stellar bar with disrupted spiral arm structure caused by Milky Way tides.",
    },
    physical: {
      diameterLy: { value: 32000, uncertainty: { upper: 2000, lower: 2000 }, unit: "ly" },
      diameterKpc: { value: 9.86, uncertainty: { upper: 0.6, lower: 0.6 }, unit: "kpc" },
      stellarMassSolar: {
        value: 2.7e9,
        uncertainty: { upper: 0.4e9, lower: 0.4e9 },
        unit: "M_sun",
      },
      totalMassSolar: {
        value: 1.4e11,
        uncertainty: { upper: 0.3e11, lower: 0.3e11 },
        unit: "M_sun",
      },
      starFormationRateSolarMassPerYr: 0.26,
      metallicityFeH: -0.4,
      absoluteMagnitudeV: -18.1,
      apparentMagnitudeV: 0.9,
    },
    kinematics: {
      heliocentricRadialVelocityKmS: {
        value: 278.0,
        uncertainty: { upper: 2.0, lower: 2.0 },
        unit: "km/s",
      },
      galactocentricRadialVelocityKmS: {
        value: 74.0,
        uncertainty: { upper: 3.0, lower: 3.0 },
        unit: "km/s",
      },
      spectroscopicRedshiftZ: { value: 0.000927, unit: "z" },
    },
    orientation: {
      inclinationDeg: 35.0,
      positionAngleDeg: 170.0,
      majorAxisArcmin: 650.0,
      minorAxisArcmin: 550.0,
      axisRatio: 0.846,
    },
    distance: {
      distanceLy: { value: 163000, uncertainty: { upper: 600, lower: 600 }, unit: "ly" },
      distanceKpc: { value: 49.97, uncertainty: { upper: 0.19, lower: 0.19 }, unit: "kpc" },
      distanceMpc: { value: 0.04997, uncertainty: { upper: 0.00019, lower: 0.00019 }, unit: "Mpc" },
      primaryMethod: "LITERATURE_CONSENSUS", // Eclipsing binaries (Pietrzyński et al. 2019, 1% precision)
      derivedLookbackTimeYears: 163000,
    },
    positional: {
      rightAscensionDeg: 80.8942, // 05h 23m 34.6s
      declinationDeg: -69.7561, // -69° 45' 22''
      distanceLightYears: 163000,
      distanceParsecs: 49970,
      galacticCoordinates: { lDeg: 280.4652, bDeg: -32.8884 },
    },
    catalogIdentifiers: {
      pgc: "PGC 17223",
    },
    groupMembership: {
      groupId: "local-group",
      groupName: "Local Group",
      membershipType: "SATELLITE",
      subgroupId: "MILKY_WAY_SUBGROUP",
      parentGalaxySlug: "milky-way-galaxy",
    },
    relationships: [
      {
        targetGalaxySlug: "milky-way-galaxy",
        targetGalaxyName: "Milky Way Galaxy",
        relationshipType: "SATELLITE_OF",
        separationKpc: 49.97,
        description:
          "In first infall orbit around Milky Way; driving Magellanic Stream tidal feature.",
      },
      {
        targetGalaxySlug: "small-magellanic-cloud",
        targetGalaxyName: "Small Magellanic Cloud (SMC)",
        relationshipType: "PAIR_WITH",
        separationKpc: 23.0,
        description: "Gravitationally linked pair with active gas bridge and common orbit.",
      },
    ],
    provenance: {
      authoritativeBody: "ESO",
      catalogName: "Pietrzyński et al. (2019) Nature Eclipsing Binaries / NED",
      recordIdentifier: "NAME LMC",
      confidenceScore: 0.99,
      citationUrl: "https://www.nature.com/articles/s41586-019-1060-5",
    },
  },

  // ==========================================
  // 5. SMALL MAGELLANIC CLOUD (SMC)
  // ==========================================
  {
    id: "g1000000-0000-4000-8000-000000000005",
    slug: "small-magellanic-cloud",
    name: "Small Magellanic Cloud",
    standardDesignation: "SMC / NGC 292 / PGC 3085",
    aliases: ["Small Magellanic Cloud", "SMC", "Nubecula Minor", "NGC 292", "PGC 3085"],
    summary:
      "A dwarf irregular satellite galaxy of the Milky Way (200,000 ly from Earth), containing several hundred million stars and experiencing intense gravitational tidal distortion from the LMC.",
    morphology: {
      class: "DWARF_IRREGULAR",
      hubbleDeVaucouleurs: "SB(s)m pec / dIrr",
      isModelDerived: false,
      notes: "Elongated along line of sight due to tidal disruption.",
    },
    physical: {
      diameterLy: { value: 18000, uncertainty: { upper: 1500, lower: 1500 }, unit: "ly" },
      diameterKpc: { value: 5.5, uncertainty: { upper: 0.5, lower: 0.5 }, unit: "kpc" },
      stellarMassSolar: {
        value: 1.0e9,
        uncertainty: { upper: 0.2e9, lower: 0.2e9 },
        unit: "M_sun",
      },
      totalMassSolar: { value: 6.5e9, uncertainty: { upper: 1.0e9, lower: 1.0e9 }, unit: "M_sun" },
      starFormationRateSolarMassPerYr: 0.05,
      metallicityFeH: -0.7,
      absoluteMagnitudeV: -16.8,
      apparentMagnitudeV: 2.7,
    },
    kinematics: {
      heliocentricRadialVelocityKmS: {
        value: 146.0,
        uncertainty: { upper: 2.0, lower: 2.0 },
        unit: "km/s",
      },
      galactocentricRadialVelocityKmS: {
        value: 19.0,
        uncertainty: { upper: 3.0, lower: 3.0 },
        unit: "km/s",
      },
      spectroscopicRedshiftZ: { value: 0.000486, unit: "z" },
    },
    orientation: {
      inclinationDeg: 60.0,
      positionAngleDeg: 45.0,
      majorAxisArcmin: 320.0,
      minorAxisArcmin: 185.0,
      axisRatio: 0.578,
    },
    distance: {
      distanceLy: { value: 200000, uncertainty: { upper: 6000, lower: 6000 }, unit: "ly" },
      distanceKpc: { value: 62.1, uncertainty: { upper: 1.9, lower: 1.9 }, unit: "kpc" },
      distanceMpc: { value: 0.0621, uncertainty: { upper: 0.0019, lower: 0.0019 }, unit: "Mpc" },
      primaryMethod: "CEPHEID",
      derivedLookbackTimeYears: 200000,
    },
    positional: {
      rightAscensionDeg: 13.1867, // 00h 52m 44.8s
      declinationDeg: -72.8286, // -72° 49' 43''
      distanceLightYears: 200000,
      distanceParsecs: 62100,
      galacticCoordinates: { lDeg: 302.7981, bDeg: -44.2991 },
    },
    catalogIdentifiers: {
      ngc: "NGC 292",
      pgc: "PGC 3085",
    },
    groupMembership: {
      groupId: "local-group",
      groupName: "Local Group",
      membershipType: "SATELLITE",
      subgroupId: "MILKY_WAY_SUBGROUP",
      parentGalaxySlug: "milky-way-galaxy",
    },
    relationships: [
      {
        targetGalaxySlug: "milky-way-galaxy",
        targetGalaxyName: "Milky Way Galaxy",
        relationshipType: "SATELLITE_OF",
        separationKpc: 62.1,
        description: "Milky Way satellite interacting through Magellanic Bridge and Leading Arm.",
      },
      {
        targetGalaxySlug: "large-magellanic-cloud",
        targetGalaxyName: "Large Magellanic Cloud (LMC)",
        relationshipType: "PAIR_WITH",
        separationKpc: 23.0,
        description: "Direct tidal interaction with LMC stripping outer gas envelope.",
      },
    ],
    provenance: {
      authoritativeBody: "NASA",
      catalogName: "NASA/IPAC Extragalactic Database (NED) / Graczyk et al. (2014)",
      recordIdentifier: "NAME SMC",
      confidenceScore: 0.98,
    },
  },

  // ==========================================
  // 6. MESSIER 32 (M32 / NGC 221)
  // ==========================================
  {
    id: "g1000000-0000-4000-8000-000000000006",
    slug: "m32-galaxy",
    name: "Messier 32",
    standardDesignation: "M32 / NGC 221 / PGC 2555",
    aliases: ["M32", "NGC 221", "PGC 2555", "Le Gentil"],
    summary:
      "Prototype compact dwarf elliptical galaxy cE2 located 2.49 million light-years away, an extremely dense satellite of Andromeda containing an active supermassive black hole.",
    morphology: {
      class: "DWARF_ELLIPTICAL",
      hubbleDeVaucouleurs: "cE2",
      isModelDerived: false,
      notes:
        "Compact elliptical structure resulting from tidal stripping of an ancient spiral progenitor by M31.",
    },
    physical: {
      diameterLy: { value: 6500, uncertainty: { upper: 500, lower: 500 }, unit: "ly" },
      diameterKpc: { value: 2.0, uncertainty: { upper: 0.2, lower: 0.2 }, unit: "kpc" },
      stellarMassSolar: { value: 3.0e9, unit: "M_sun" },
      totalMassSolar: { value: 3.5e9, unit: "M_sun" },
      metallicityFeH: -0.1,
      apparentMagnitudeV: 8.08,
    },
    kinematics: {
      heliocentricRadialVelocityKmS: {
        value: -200.0,
        uncertainty: { upper: 6.0, lower: 6.0 },
        unit: "km/s",
      },
      spectroscopicRedshiftZ: { value: -0.000667, unit: "z" },
    },
    orientation: {
      inclinationDeg: 70.0,
      positionAngleDeg: 155.0,
      majorAxisArcmin: 8.7,
      minorAxisArcmin: 6.5,
      axisRatio: 0.747,
    },
    distance: {
      distanceLy: { value: 2490000, uncertainty: { upper: 60000, lower: 60000 }, unit: "ly" },
      distanceKpc: { value: 763.0, uncertainty: { upper: 18.0, lower: 18.0 }, unit: "kpc" },
      distanceMpc: { value: 0.763, uncertainty: { upper: 0.018, lower: 0.018 }, unit: "Mpc" },
      primaryMethod: "TRGB",
      derivedLookbackTimeYears: 2490000,
    },
    positional: {
      rightAscensionDeg: 10.6743, // 00h 42m 41.8s
      declinationDeg: 40.8653, // +40° 51' 55''
      distanceLightYears: 2490000,
      distanceParsecs: 763000,
      galacticCoordinates: { lDeg: 121.1444, bDeg: -21.9754 },
    },
    catalogIdentifiers: {
      messier: "M32",
      ngc: "NGC 221",
      pgc: "PGC 2555",
    },
    groupMembership: {
      groupId: "local-group",
      groupName: "Local Group",
      membershipType: "SATELLITE",
      subgroupId: "ANDROMEDA_SUBGROUP",
      parentGalaxySlug: "andromeda-galaxy",
    },
    relationships: [
      {
        targetGalaxySlug: "andromeda-galaxy",
        targetGalaxyName: "Andromeda Galaxy (M31)",
        relationshipType: "SATELLITE_OF",
        separationKpc: 8.0,
        description: "Close satellite orbiting through Andromeda's disk.",
      },
    ],
    provenance: {
      authoritativeBody: "NASA",
      catalogName: "NASA/IPAC Extragalactic Database (NED)",
      recordIdentifier: "MESSIER 032",
      confidenceScore: 0.98,
    },
  },

  // ==========================================
  // 7. MESSIER 110 (M110 / NGC 205)
  // ==========================================
  {
    id: "g1000000-0000-4000-8000-000000000007",
    slug: "m110-galaxy",
    name: "Messier 110",
    standardDesignation: "M110 / NGC 205 / UGC 426 / PGC 2429",
    aliases: ["M110", "NGC 205", "UGC 426", "PGC 2429"],
    summary:
      "Dwarf elliptical satellite of Andromeda galaxy located 2.69 million light-years away, featuring unusual dust clouds and recent star formation at its core.",
    morphology: {
      class: "DWARF_ELLIPTICAL",
      hubbleDeVaucouleurs: "dE5 pec",
      isModelDerived: false,
      notes: "Peculiar dwarf elliptical with interstellar dust and Population I stars.",
    },
    physical: {
      diameterLy: { value: 17000, uncertainty: { upper: 1000, lower: 1000 }, unit: "ly" },
      diameterKpc: { value: 5.2, uncertainty: { upper: 0.3, lower: 0.3 }, unit: "kpc" },
      stellarMassSolar: { value: 1.5e9, unit: "M_sun" },
      totalMassSolar: { value: 1.0e10, unit: "M_sun" },
      apparentMagnitudeV: 8.92,
    },
    kinematics: {
      heliocentricRadialVelocityKmS: {
        value: -241.0,
        uncertainty: { upper: 3.0, lower: 3.0 },
        unit: "km/s",
      },
      spectroscopicRedshiftZ: { value: -0.000804, unit: "z" },
    },
    orientation: {
      inclinationDeg: 54.0,
      positionAngleDeg: 170.0,
      majorAxisArcmin: 21.9,
      minorAxisArcmin: 11.0,
      axisRatio: 0.502,
    },
    distance: {
      distanceLy: { value: 2690000, uncertainty: { upper: 70000, lower: 70000 }, unit: "ly" },
      distanceKpc: { value: 825.0, uncertainty: { upper: 21.0, lower: 21.0 }, unit: "kpc" },
      distanceMpc: { value: 0.825, uncertainty: { upper: 0.021, lower: 0.021 }, unit: "Mpc" },
      primaryMethod: "TRGB",
      derivedLookbackTimeYears: 2690000,
    },
    positional: {
      rightAscensionDeg: 10.0917, // 00h 40m 22.0s
      declinationDeg: 41.6854, // +41° 41' 07''
      distanceLightYears: 2690000,
      distanceParsecs: 825000,
      galacticCoordinates: { lDeg: 120.7154, bDeg: -21.1444 },
    },
    catalogIdentifiers: {
      messier: "M110",
      ngc: "NGC 205",
      ugc: "UGC 426",
      pgc: "PGC 2429",
    },
    groupMembership: {
      groupId: "local-group",
      groupName: "Local Group",
      membershipType: "SATELLITE",
      subgroupId: "ANDROMEDA_SUBGROUP",
      parentGalaxySlug: "andromeda-galaxy",
    },
    relationships: [
      {
        targetGalaxySlug: "andromeda-galaxy",
        targetGalaxyName: "Andromeda Galaxy (M31)",
        relationshipType: "SATELLITE_OF",
        separationKpc: 12.0,
        description: "Bound satellite galaxy in outer Andromeda halo.",
      },
    ],
    provenance: {
      authoritativeBody: "NASA",
      catalogName: "NASA/IPAC Extragalactic Database (NED)",
      recordIdentifier: "MESSIER 110",
      confidenceScore: 0.98,
    },
  },

  // ==========================================
  // 8. SAGITTARIUS DWARF SPHEROIDAL (Sgr dSph)
  // ==========================================
  {
    id: "g1000000-0000-4000-8000-000000000008",
    slug: "sagittarius-dsph",
    name: "Sagittarius Dwarf Spheroidal",
    standardDesignation: "Sgr dSph / PGC 64427",
    aliases: ["Sagittarius dSph", "Sagittarius Dwarf", "Sgr dSph", "PGC 64427"],
    summary:
      "A loop-shaped dwarf spheroidal galaxy located ~70,000 ly from Earth on the far side of the Milky Way core, currently undergoing extreme tidal disruption by our Galaxy into the Sagittarius Stream.",
    morphology: {
      class: "DWARF_SPHEROIDAL",
      hubbleDeVaucouleurs: "dSph(t)",
      isModelDerived: true,
      notes: "Heavily tidally stripped stellar stream wrapping around the Milky Way halo.",
    },
    physical: {
      diameterLy: { value: 10000, unit: "ly" },
      diameterKpc: { value: 3.0, unit: "kpc" },
      stellarMassSolar: { value: 2.1e7, unit: "M_sun" },
      totalMassSolar: { value: 2.5e8, unit: "M_sun" },
      apparentMagnitudeV: 4.5, // Extended surface brightness
    },
    kinematics: {
      heliocentricRadialVelocityKmS: {
        value: 140.0,
        uncertainty: { upper: 2.0, lower: 2.0 },
        unit: "km/s",
      },
      galactocentricRadialVelocityKmS: { value: 171.0, unit: "km/s" },
    },
    orientation: {
      inclinationDeg: 80.0,
      positionAngleDeg: 100.0,
      majorAxisArcmin: 450.0,
      minorAxisArcmin: 210.0,
      axisRatio: 0.467,
    },
    distance: {
      distanceLy: { value: 70000, uncertainty: { upper: 3000, lower: 3000 }, unit: "ly" },
      distanceKpc: { value: 21.5, uncertainty: { upper: 0.9, lower: 0.9 }, unit: "kpc" },
      distanceMpc: { value: 0.0215, unit: "Mpc" },
      primaryMethod: "TRGB",
      derivedLookbackTimeYears: 70000,
    },
    positional: {
      rightAscensionDeg: 283.83, // 18h 55m
      declinationDeg: -30.48, // -30° 29'
      distanceLightYears: 70000,
      distanceParsecs: 21500,
      galacticCoordinates: { lDeg: 5.61, bDeg: -14.17 },
    },
    groupMembership: {
      groupId: "local-group",
      groupName: "Local Group",
      membershipType: "SATELLITE",
      subgroupId: "MILKY_WAY_SUBGROUP",
      parentGalaxySlug: "milky-way-galaxy",
    },
    relationships: [
      {
        targetGalaxySlug: "milky-way-galaxy",
        targetGalaxyName: "Milky Way Galaxy",
        relationshipType: "INTERACTING_WITH",
        separationKpc: 16.0,
        description:
          "Undergoing tidal disruption and assimilation by Milky Way gravitational potential.",
      },
    ],
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "Ibata et al. (1994) Nature / Law & Majewski (2010)",
      recordIdentifier: "SGR_DSPH",
      confidenceScore: 0.96,
    },
  },

  // ==========================================
  // 9. FORNAX DWARF SPHEROIDAL
  // ==========================================
  {
    id: "g1000000-0000-4000-8000-000000000009",
    slug: "fornax-dwarf",
    name: "Fornax Dwarf Spheroidal",
    standardDesignation: "Fornax dSph / PGC 10074",
    aliases: ["Fornax Dwarf", "Fornax dSph", "PGC 10074", "ESO 356-04"],
    summary:
      "One of the most luminous dwarf spheroidal satellites of the Milky Way located 460,000 ly away in Fornax, hosting six dedicated globular clusters.",
    morphology: {
      class: "DWARF_SPHEROIDAL",
      hubbleDeVaucouleurs: "dSph",
      isModelDerived: false,
    },
    physical: {
      diameterLy: { value: 6000, unit: "ly" },
      diameterKpc: { value: 1.84, unit: "kpc" },
      stellarMassSolar: { value: 2.0e7, unit: "M_sun" },
      totalMassSolar: { value: 1.6e8, unit: "M_sun" },
      apparentMagnitudeV: 9.3,
    },
    kinematics: {
      heliocentricRadialVelocityKmS: {
        value: 53.0,
        uncertainty: { upper: 3.0, lower: 3.0 },
        unit: "km/s",
      },
      galactocentricRadialVelocityKmS: { value: -35.0, unit: "km/s" },
    },
    orientation: {
      inclinationDeg: 40.0,
      positionAngleDeg: 42.0,
      majorAxisArcmin: 17.0,
      minorAxisArcmin: 12.0,
      axisRatio: 0.706,
    },
    distance: {
      distanceLy: { value: 460000, uncertainty: { upper: 15000, lower: 15000 }, unit: "ly" },
      distanceKpc: { value: 141.0, uncertainty: { upper: 4.6, lower: 4.6 }, unit: "kpc" },
      distanceMpc: { value: 0.141, unit: "Mpc" },
      primaryMethod: "TRGB",
      derivedLookbackTimeYears: 460000,
    },
    positional: {
      rightAscensionDeg: 39.9971, // 02h 39m 59.3s
      declinationDeg: -34.4497, // -34° 26' 59''
      distanceLightYears: 460000,
      distanceParsecs: 141000,
      galacticCoordinates: { lDeg: 237.19, bDeg: -65.65 },
    },
    groupMembership: {
      groupId: "local-group",
      groupName: "Local Group",
      membershipType: "SATELLITE",
      subgroupId: "MILKY_WAY_SUBGROUP",
      parentGalaxySlug: "milky-way-galaxy",
    },
    relationships: [
      {
        targetGalaxySlug: "milky-way-galaxy",
        targetGalaxyName: "Milky Way Galaxy",
        relationshipType: "SATELLITE_OF",
        separationKpc: 141.0,
        description: "Distant satellite in Milky Way virial halo.",
      },
    ],
    provenance: {
      authoritativeBody: "NASA",
      catalogName: "NASA/IPAC Extragalactic Database (NED) / McConnachie (2012)",
      recordIdentifier: "NAME FORNAX DWARF",
      confidenceScore: 0.97,
    },
  },

  // ==========================================
  // 10. IC 10 (STARBURST DWARF IRREGULAR)
  // ==========================================
  {
    id: "g1000000-0000-4000-8000-000000000010",
    slug: "ic-10",
    name: "IC 10",
    standardDesignation: "IC 10 / UGC 192 / PGC 1305",
    aliases: ["IC 10", "UGC 192", "PGC 1305"],
    summary:
      "The only known starburst galaxy in the Local Group located 2.2 million light-years away in Cassiopeia, containing an extraordinary concentration of Wolf-Rayet stars.",
    morphology: {
      class: "DWARF_IRREGULAR",
      hubbleDeVaucouleurs: "dIrr IV / BCD",
      isModelDerived: false,
      notes: "Blue compact dwarf with strong massive star formation burst.",
    },
    physical: {
      diameterLy: { value: 5000, unit: "ly" },
      diameterKpc: { value: 1.5, unit: "kpc" },
      stellarMassSolar: { value: 8.6e7, unit: "M_sun" },
      totalMassSolar: { value: 1.6e9, unit: "M_sun" },
      starFormationRateSolarMassPerYr: 0.08,
      apparentMagnitudeV: 11.2,
    },
    kinematics: {
      heliocentricRadialVelocityKmS: {
        value: -348.0,
        uncertainty: { upper: 1.0, lower: 1.0 },
        unit: "km/s",
      },
      spectroscopicRedshiftZ: { value: -0.001161, unit: "z" },
    },
    orientation: {
      inclinationDeg: 45.0,
      positionAngleDeg: 135.0,
      majorAxisArcmin: 6.8,
      minorAxisArcmin: 5.9,
      axisRatio: 0.868,
    },
    distance: {
      distanceLy: { value: 2200000, uncertainty: { upper: 100000, lower: 100000 }, unit: "ly" },
      distanceKpc: { value: 660.0, uncertainty: { upper: 30.0, lower: 30.0 }, unit: "kpc" },
      distanceMpc: { value: 0.66, unit: "Mpc" },
      primaryMethod: "CEPHEID",
      derivedLookbackTimeYears: 2200000,
    },
    positional: {
      rightAscensionDeg: 5.1004, // 00h 20m 24.1s
      declinationDeg: 59.2928, // +59° 17' 34''
      distanceLightYears: 2200000,
      distanceParsecs: 660000,
      galacticCoordinates: { lDeg: 118.97, bDeg: -3.33 },
    },
    catalogIdentifiers: {
      ic: "IC 10",
      ugc: "UGC 192",
      pgc: "PGC 1305",
    },
    groupMembership: {
      groupId: "local-group",
      groupName: "Local Group",
      membershipType: "DWARF_MEMBER",
      subgroupId: "LOCAL_GROUP_ISOLATED",
    },
    relationships: [
      {
        targetGalaxySlug: "andromeda-galaxy",
        targetGalaxyName: "Andromeda Galaxy (M31)",
        relationshipType: "GRAVITATIONAL_ASSOCIATION",
        separationKpc: 250.0,
        description: "Isolated member of Local Group roughly equidistant between MW and M31.",
      },
    ],
    provenance: {
      authoritativeBody: "NASA",
      catalogName: "NASA/IPAC Extragalactic Database (NED) / Sanna et al. (2008)",
      recordIdentifier: "IC 0010",
      confidenceScore: 0.97,
    },
  },
];
