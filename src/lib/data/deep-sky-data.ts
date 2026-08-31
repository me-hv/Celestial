import { CelestialObject } from "@/domain/celestial-object/types";
import { RawDeepSkyRecord } from "../ingestion/deep-sky/deep-sky-normalizer";
import { DeepSkyIngestionPipeline } from "../ingestion/deep-sky/deep-sky-pipeline";

export const RAW_DEEP_SKY_RECORDS: RawDeepSkyRecord[] = [
  // ==========================================
  // 1. GALAXIES
  // ==========================================
  {
    id_source: "MESSIER_031",
    slug: "m31-andromeda-galaxy",
    canonical_name: "Andromeda Galaxy",
    standard_designation: "M31 / NGC 224",
    classification_code: "GALAXY",
    ra_deg: 10.6847, // 00h 42m 44s
    dec_deg: 41.2687, // +41° 16' 09''
    distance_ly: 2537000,
    distance_mpc: 0.778,
    distance_uncertainty_ly: { upper: 50000, lower: 50000, percentage: 2.0 },
    distance_method: "CEPHEID_VARIABLE",
    v_mag: 3.44,
    constellation: "Andromeda",
    messier_id: "M31",
    ngc_id: "NGC 224",
    pgc_id: "PGC 2557",
    ugc_id: "UGC 454",
    aliases: ["M31", "NGC 224", "Andromeda", "Andromeda Galaxy", "Great Andromeda Nebula"],
    summary:
      "The major spiral galaxy closest to the Milky Way (2.54 Mly), spanning ~220,000 ly in diameter and containing roughly one trillion stars within the Local Group.",
    deep_sky_properties: {
      type: "GALAXY",
      galaxy: {
        morphologicalType: "SA(s)b",
        galaxySubtype: "SPIRAL",
        redshiftZ: -0.001001,
        radialVelocityKmS: -300,
        majorAxisArcmin: 190.0,
        minorAxisArcmin: 60.0,
        positionAngleDeg: 35.0,
        inclinationDeg: 77.0,
        estimatedStellarMassSolar: 1.5e12,
        starFormationRateSolarMassPerYr: 1.0,
        galaxyGroupOrCluster: "Local Group",
      },
      cosmicHierarchy: {
        supercluster: "Laniakea Supercluster",
        clusterOrGroup: "Local Group",
        hostStructure: "Andromeda Subgroup",
      },
      distanceMethod: "CEPHEID_VARIABLE",
    },
    observations: [
      {
        id: "obs-m31-hst-phat",
        wavelengthBand: "OPTICAL",
        filterOrFrequency: "F475W / F814W",
        telescopeOrSurvey: "Hubble Space Telescope",
        instrument: "ACS/WFC",
        citationOrCredit: "PHAT Survey (Dalcanton et al. 2012)",
      },
      {
        id: "obs-m31-galex",
        wavelengthBand: "ULTRAVIOLET",
        filterOrFrequency: "NUV / FUV",
        telescopeOrSurvey: "GALEX",
        citationOrCredit: "NASA / JPL-Caltech",
      },
    ],
    source_catalog: "SIMBAD / NASA NED / OpenNGC",
    record_identifier: "MESSIER 031",
  },
  {
    id_source: "MESSIER_033",
    slug: "m33-triangulum-galaxy",
    canonical_name: "Triangulum Galaxy",
    standard_designation: "M33 / NGC 598",
    classification_code: "GALAXY",
    ra_deg: 23.4621, // 01h 33m 50.9s
    dec_deg: 30.6602, // +30° 39' 36''
    distance_ly: 2730000,
    distance_mpc: 0.837,
    distance_uncertainty_ly: { upper: 60000, lower: 60000, percentage: 2.2 },
    distance_method: "CEPHEID_VARIABLE",
    v_mag: 5.72,
    constellation: "Triangulum",
    messier_id: "M33",
    ngc_id: "NGC 598",
    pgc_id: "PGC 5818",
    ugc_id: "UGC 1117",
    aliases: ["M33", "NGC 598", "Triangulum", "Triangulum Galaxy", "Pinwheel Galaxy (historical)"],
    summary:
      "The third-largest member of the Local Group (2.73 Mly), a prominent flocculent spiral galaxy exhibiting active star formation across its disc and giant H II region NGC 604.",
    deep_sky_properties: {
      type: "GALAXY",
      galaxy: {
        morphologicalType: "SA(s)cd",
        galaxySubtype: "SPIRAL",
        redshiftZ: -0.000607,
        radialVelocityKmS: -179,
        majorAxisArcmin: 70.8,
        minorAxisArcmin: 41.7,
        positionAngleDeg: 23.0,
        inclinationDeg: 54.0,
        estimatedStellarMassSolar: 5.0e10,
        galaxyGroupOrCluster: "Local Group",
      },
      cosmicHierarchy: {
        supercluster: "Laniakea Supercluster",
        clusterOrGroup: "Local Group",
        hostStructure: "Triangulum Subgroup",
      },
      distanceMethod: "CEPHEID_VARIABLE",
    },
    source_catalog: "SIMBAD / NASA NED",
    record_identifier: "MESSIER 033",
  },
  {
    id_source: "MESSIER_051",
    slug: "m51-whirlpool-galaxy",
    canonical_name: "Whirlpool Galaxy",
    standard_designation: "M51a / NGC 5194",
    classification_code: "GALAXY",
    ra_deg: 202.4696, // 13h 29m 52.7s
    dec_deg: 47.1953, // +47° 11' 43''
    distance_ly: 23160000,
    distance_mpc: 7.1,
    distance_uncertainty_ly: { upper: 1500000, lower: 1500000, percentage: 6.5 },
    distance_method: "TIP_OF_RED_GIANT_BRANCH",
    v_mag: 8.4,
    constellation: "Canes Venatici",
    messier_id: "M51",
    ngc_id: "NGC 5194",
    pgc_id: "PGC 47404",
    ugc_id: "UGC 8493",
    aliases: ["M51", "NGC 5194", "Whirlpool Galaxy", "Rosse's Question Mark"],
    summary:
      "Grand-design spiral galaxy (23.2 Mly) famously interacting with its smaller companion NGC 5195, revealing sharp spiral density waves and massive starburst regions.",
    deep_sky_properties: {
      type: "GALAXY",
      galaxy: {
        morphologicalType: "SA(s)bc pec",
        galaxySubtype: "SPIRAL",
        redshiftZ: 0.001544,
        radialVelocityKmS: 463,
        majorAxisArcmin: 11.2,
        minorAxisArcmin: 6.9,
        positionAngleDeg: 163.0,
        inclinationDeg: 20.0,
        estimatedStellarMassSolar: 1.6e11,
        galaxyGroupOrCluster: "M51 Group",
      },
      cosmicHierarchy: {
        supercluster: "Virgo Supercluster",
        clusterOrGroup: "M51 Group",
      },
      distanceMethod: "TIP_OF_RED_GIANT_BRANCH",
    },
    source_catalog: "SIMBAD / NASA NED",
    record_identifier: "MESSIER 051",
  },
  {
    id_source: "MESSIER_104",
    slug: "m104-sombrero-galaxy",
    canonical_name: "Sombrero Galaxy",
    standard_designation: "M104 / NGC 4594",
    classification_code: "GALAXY",
    ra_deg: 189.9976, // 12h 39m 59.4s
    dec_deg: -11.6231, // -11° 37' 23''
    distance_ly: 31100000,
    distance_mpc: 9.55,
    distance_uncertainty_ly: { upper: 1800000, lower: 1800000, percentage: 5.8 },
    distance_method: "SURFACE_BRIGHTNESS_FLUCTUATIONS",
    v_mag: 8.0,
    constellation: "Virgo",
    messier_id: "M104",
    ngc_id: "NGC 4594",
    pgc_id: "PGC 42407",
    ugc_id: "UGC 293",
    aliases: ["M104", "NGC 4594", "Sombrero Galaxy"],
    summary:
      "Unbarred spiral galaxy (31.1 Mly) featuring a brilliant white central stellar bulge encircled by a prominent dark dust lane, hosting a billion-solar-mass supermassive black hole.",
    deep_sky_properties: {
      type: "GALAXY",
      galaxy: {
        morphologicalType: "SA(s)a",
        galaxySubtype: "SPIRAL",
        redshiftZ: 0.003416,
        radialVelocityKmS: 1024,
        majorAxisArcmin: 8.6,
        minorAxisArcmin: 4.2,
        positionAngleDeg: 90.0,
        inclinationDeg: 84.0,
        estimatedStellarMassSolar: 8.0e11,
      },
      cosmicHierarchy: {
        supercluster: "Virgo Supercluster",
      },
      distanceMethod: "SURFACE_BRIGHTNESS_FLUCTUATIONS",
    },
    source_catalog: "SIMBAD / NASA NED",
    record_identifier: "MESSIER 104",
  },
  {
    id_source: "MESSIER_081",
    slug: "m81-bodes-galaxy",
    canonical_name: "Bode's Galaxy",
    standard_designation: "M81 / NGC 3031",
    classification_code: "GALAXY",
    ra_deg: 148.8882, // 09h 55m 33.2s
    dec_deg: 69.0653, // +69° 03' 55''
    distance_ly: 11800000,
    distance_mpc: 3.62,
    distance_uncertainty_ly: { upper: 400000, lower: 400000, percentage: 3.4 },
    distance_method: "CEPHEID_VARIABLE",
    v_mag: 6.94,
    constellation: "Ursa Major",
    messier_id: "M81",
    ngc_id: "NGC 3031",
    pgc_id: "PGC 28630",
    ugc_id: "UGC 5318",
    aliases: ["M81", "NGC 3031", "Bode's Galaxy"],
    summary:
      "Bright grand-design spiral galaxy (11.8 Mly) in Ursa Major and core of the M81 Group, undergoing gravitational tidal interactions with starburst galaxy M82.",
    deep_sky_properties: {
      type: "GALAXY",
      galaxy: {
        morphologicalType: "SA(s)ab",
        galaxySubtype: "SPIRAL",
        redshiftZ: -0.000113,
        radialVelocityKmS: -34,
        majorAxisArcmin: 26.9,
        minorAxisArcmin: 14.1,
        positionAngleDeg: 157.0,
        inclinationDeg: 59.0,
        estimatedStellarMassSolar: 7.2e10,
        galaxyGroupOrCluster: "M81 Group",
      },
      cosmicHierarchy: {
        supercluster: "Virgo Supercluster",
        clusterOrGroup: "M81 Group",
      },
      distanceMethod: "CEPHEID_VARIABLE",
    },
    source_catalog: "SIMBAD / NASA NED",
    record_identifier: "MESSIER 081",
  },
  {
    id_source: "MESSIER_082",
    slug: "m82-cigar-galaxy",
    canonical_name: "Cigar Galaxy",
    standard_designation: "M82 / NGC 3034",
    classification_code: "GALAXY",
    ra_deg: 148.9685, // 09h 55m 52.4s
    dec_deg: 69.6797, // +69° 40' 47''
    distance_ly: 11400000,
    distance_mpc: 3.5,
    distance_uncertainty_ly: { upper: 500000, lower: 500000, percentage: 4.4 },
    distance_method: "TIP_OF_RED_GIANT_BRANCH",
    v_mag: 8.41,
    constellation: "Ursa Major",
    messier_id: "M82",
    ngc_id: "NGC 3034",
    pgc_id: "PGC 28655",
    ugc_id: "UGC 5322",
    aliases: ["M82", "NGC 3034", "Cigar Galaxy", "Starburst Galaxy M82"],
    summary:
      "Prototype starburst galaxy (11.4 Mly) forming stars at 10x the rate of the Milky Way, driving colossal galactic superwinds of ionized hydrogen perpendicular to its disc.",
    deep_sky_properties: {
      type: "GALAXY",
      galaxy: {
        morphologicalType: "I0 pec",
        galaxySubtype: "IRREGULAR",
        redshiftZ: 0.000677,
        radialVelocityKmS: 203,
        majorAxisArcmin: 11.2,
        minorAxisArcmin: 4.3,
        positionAngleDeg: 65.0,
        inclinationDeg: 80.0,
        estimatedStellarMassSolar: 5.0e10,
        starFormationRateSolarMassPerYr: 10.0,
        galaxyGroupOrCluster: "M81 Group",
      },
      cosmicHierarchy: {
        supercluster: "Virgo Supercluster",
        clusterOrGroup: "M81 Group",
      },
      distanceMethod: "TIP_OF_RED_GIANT_BRANCH",
    },
    source_catalog: "SIMBAD / NASA NED",
    record_identifier: "MESSIER 082",
  },
  {
    id_source: "PGC_017223",
    slug: "large-magellanic-cloud",
    canonical_name: "Large Magellanic Cloud",
    standard_designation: "LMC / PGC 17223",
    classification_code: "GALAXY",
    ra_deg: 80.8942, // 05h 23m 34.6s
    dec_deg: -69.7561, // -69° 45' 22''
    distance_ly: 163000,
    distance_kpc: 49.97,
    distance_uncertainty_ly: { upper: 1600, lower: 1600, percentage: 1.0 },
    distance_method: "LITERATURE_CONSENSUS",
    v_mag: 0.9,
    constellation: "Dorado / Mensa",
    pgc_id: "PGC 17223",
    aliases: ["LMC", "Large Magellanic Cloud", "Nubecula Major"],
    summary:
      "Satellite galaxy of the Milky Way (163,000 ly) and fourth-largest member of the Local Group, hosting the colossal 30 Doradus (Tarantula Nebula) star-forming region.",
    deep_sky_properties: {
      type: "GALAXY",
      galaxy: {
        morphologicalType: "SB(s)m",
        galaxySubtype: "DWARF",
        redshiftZ: 0.000927,
        radialVelocityKmS: 278,
        majorAxisArcmin: 645.0,
        minorAxisArcmin: 550.0,
        positionAngleDeg: 170.0,
        inclinationDeg: 35.0,
        estimatedStellarMassSolar: 1.0e10,
        galaxyGroupOrCluster: "Local Group",
      },
      cosmicHierarchy: {
        supercluster: "Laniakea Supercluster",
        clusterOrGroup: "Local Group",
        hostStructure: "Milky Way Subgroup",
      },
      distanceMethod: "LITERATURE_CONSENSUS",
    },
    source_catalog: "SIMBAD / NASA NED",
    record_identifier: "NAME LMC",
  },
  {
    id_source: "PGC_003085",
    slug: "small-magellanic-cloud",
    canonical_name: "Small Magellanic Cloud",
    standard_designation: "SMC / NGC 292 / PGC 3085",
    classification_code: "GALAXY",
    ra_deg: 13.1867, // 00h 52m 44.8s
    dec_deg: -72.8286, // -72° 49' 43''
    distance_ly: 204000,
    distance_kpc: 62.5,
    distance_uncertainty_ly: { upper: 3000, lower: 3000, percentage: 1.5 },
    distance_method: "CEPHEID_VARIABLE",
    v_mag: 2.7,
    constellation: "Tucana",
    ngc_id: "NGC 292",
    pgc_id: "PGC 3085",
    ugc_id: "UGC 29",
    aliases: ["SMC", "Small Magellanic Cloud", "NGC 292", "Nubecula Minor"],
    summary:
      "Dwarf irregular galaxy (204,000 ly) in orbit around the Milky Way, structurally distorted by gravitational tidal interactions with the LMC and the Milky Way halo.",
    deep_sky_properties: {
      type: "GALAXY",
      galaxy: {
        morphologicalType: "SB(s)m pec",
        galaxySubtype: "DWARF",
        redshiftZ: 0.000494,
        radialVelocityKmS: 148,
        majorAxisArcmin: 320.0,
        minorAxisArcmin: 185.0,
        positionAngleDeg: 45.0,
        estimatedStellarMassSolar: 6.5e9,
        galaxyGroupOrCluster: "Local Group",
      },
      cosmicHierarchy: {
        supercluster: "Laniakea Supercluster",
        clusterOrGroup: "Local Group",
        hostStructure: "Milky Way Subgroup",
      },
      distanceMethod: "CEPHEID_VARIABLE",
    },
    source_catalog: "SIMBAD / NASA NED",
    record_identifier: "NAME SMC",
  },
  {
    id_source: "NGC_5128",
    slug: "centaurus-a",
    canonical_name: "Centaurus A",
    standard_designation: "NGC 5128 / Caldwell 77",
    classification_code: "GALAXY",
    ra_deg: 201.3651, // 13h 25m 27.6s
    dec_deg: -43.0191, // -43° 01' 09''
    distance_ly: 12000000,
    distance_mpc: 3.7,
    distance_uncertainty_ly: { upper: 1000000, lower: 1000000, percentage: 8.3 },
    distance_method: "TIP_OF_RED_GIANT_BRANCH",
    v_mag: 6.84,
    constellation: "Centaurus",
    ngc_id: "NGC 5128",
    caldwell_id: "C77",
    pgc_id: "PGC 46957",
    aliases: ["Centaurus A", "NGC 5128", "Caldwell 77", "Cen A"],
    summary:
      "Peculiar lenticular/elliptical galaxy (12 Mly) bisected by a chaotic dust lane resulting from a major merger, hosting an active galactic nucleus with relativistic plasma jets.",
    deep_sky_properties: {
      type: "GALAXY",
      galaxy: {
        morphologicalType: "S0 pec",
        galaxySubtype: "LENTICULAR",
        redshiftZ: 0.001825,
        radialVelocityKmS: 547,
        majorAxisArcmin: 25.7,
        minorAxisArcmin: 20.0,
        positionAngleDeg: 35.0,
        galaxyGroupOrCluster: "Centaurus A / M83 Group",
      },
      cosmicHierarchy: {
        supercluster: "Virgo Supercluster",
        clusterOrGroup: "Centaurus A Group",
      },
      distanceMethod: "TIP_OF_RED_GIANT_BRANCH",
    },
    source_catalog: "SIMBAD / NASA NED",
    record_identifier: "NGC 5128",
  },

  // ==========================================
  // 2. NEBULAE (Diffuse / Emission / Reflection / Dark)
  // ==========================================
  {
    id_source: "MESSIER_042",
    slug: "m42-orion-nebula",
    canonical_name: "Orion Nebula",
    standard_designation: "M42 / NGC 1976",
    classification_code: "NEBULA",
    ra_deg: 83.8221, // 05h 35m 17.3s
    dec_deg: -5.3911, // -05° 23' 28''
    distance_ly: 1344,
    distance_pc: 412,
    distance_uncertainty_ly: { upper: 20, lower: 20, percentage: 1.5 },
    distance_method: "TRIGONOMETRIC_PARALLAX",
    v_mag: 4.0,
    constellation: "Orion",
    messier_id: "M42",
    ngc_id: "NGC 1976",
    aliases: ["M42", "NGC 1976", "Orion Nebula", "Great Orion Nebula"],
    summary:
      "Vast diffuse stellar nursery in the Orion Molecular Cloud Complex (1,344 ly), ionized by the massive young O/B stars of the Trapezium Cluster (Theta1 Orionis).",
    deep_sky_properties: {
      type: "NEBULA",
      nebula: {
        nebulaSubtype: "EMISSION",
        angularDiameterArcmin: 65.0,
        majorAxisArcmin: 65.0,
        minorAxisArcmin: 60.0,
        associatedIonizingStar: "Theta1 Orionis C",
        associatedCluster: "Trapezium Cluster",
        chemicalComposition: ["H-II", "O-III", "N-II", "S-II"],
      },
      cosmicHierarchy: {
        hostStructure: "Milky Way > Orion-Cygnus Arm > Orion Molecular Cloud",
      },
      distanceMethod: "TRIGONOMETRIC_PARALLAX",
    },
    observations: [
      {
        id: "obs-m42-hst",
        wavelengthBand: "OPTICAL",
        filterOrFrequency: "F435W / F555W / F658N (H-alpha) / F850LP",
        telescopeOrSurvey: "Hubble Space Telescope",
        instrument: "ACS",
        citationOrCredit:
          "NASA, ESA, M. Robberto (STScI/ESA) and the HST Orion Treasury Project Team",
      },
    ],
    source_catalog: "SIMBAD / OpenNGC",
    record_identifier: "MESSIER 042",
  },
  {
    id_source: "NGC_3372",
    slug: "carina-nebula",
    canonical_name: "Carina Nebula",
    standard_designation: "NGC 3372 / Caldwell 92",
    classification_code: "NEBULA",
    ra_deg: 161.2721, // 10h 45m 08.5s
    dec_deg: -59.8667, // -59° 52' 00''
    distance_ly: 7500,
    distance_pc: 2300,
    distance_uncertainty_ly: { upper: 300, lower: 300, percentage: 4.0 },
    distance_method: "LITERATURE_CONSENSUS",
    v_mag: 1.0,
    constellation: "Carina",
    ngc_id: "NGC 3372",
    caldwell_id: "C92",
    aliases: ["Carina Nebula", "NGC 3372", "Caldwell 92", "Eta Carinae Nebula", "Keyhole Nebula"],
    summary:
      "One of the largest and most luminous diffuse H II emission nebulae in our galaxy (7,500 ly), harboring hypergiant star Eta Carinae and the Trumpler 14/16 clusters.",
    deep_sky_properties: {
      type: "NEBULA",
      nebula: {
        nebulaSubtype: "EMISSION",
        angularDiameterArcmin: 120.0,
        majorAxisArcmin: 120.0,
        minorAxisArcmin: 120.0,
        associatedIonizingStar: "Eta Carinae",
        associatedCluster: "Trumpler 16",
        chemicalComposition: ["H-II", "O-III", "He-I"],
      },
      cosmicHierarchy: {
        hostStructure: "Milky Way > Carina-Sagittarius Arm",
      },
      distanceMethod: "LITERATURE_CONSENSUS",
    },
    source_catalog: "SIMBAD / OpenNGC",
    record_identifier: "NGC 3372",
  },
  {
    id_source: "MESSIER_016",
    slug: "m16-eagle-nebula",
    canonical_name: "Eagle Nebula",
    standard_designation: "M16 / NGC 6611",
    classification_code: "NEBULA",
    ra_deg: 274.7001, // 18h 18m 48.0s
    dec_deg: -13.8067, // -13° 48' 24''
    distance_ly: 7000,
    distance_pc: 2150,
    distance_uncertainty_ly: { upper: 300, lower: 300, percentage: 4.3 },
    distance_method: "TRIGONOMETRIC_PARALLAX",
    v_mag: 6.0,
    constellation: "Serpens",
    messier_id: "M16",
    ngc_id: "NGC 6611",
    aliases: ["M16", "NGC 6611", "Eagle Nebula", "Star Queen Nebula", "Pillars of Creation Host"],
    summary:
      "Active star-forming emission nebula (7,000 ly) containing the iconic 'Pillars of Creation' — interstellar gas columns eroded by stellar winds from open cluster NGC 6611.",
    deep_sky_properties: {
      type: "NEBULA",
      nebula: {
        nebulaSubtype: "EMISSION",
        angularDiameterArcmin: 70.0,
        majorAxisArcmin: 70.0,
        minorAxisArcmin: 55.0,
        associatedCluster: "NGC 6611",
        chemicalComposition: ["H-II", "O-III", "S-II"],
      },
      cosmicHierarchy: {
        hostStructure: "Milky Way > Carina-Sagittarius Arm",
      },
      distanceMethod: "TRIGONOMETRIC_PARALLAX",
    },
    source_catalog: "SIMBAD / OpenNGC",
    record_identifier: "MESSIER 016",
  },
  {
    id_source: "MESSIER_008",
    slug: "m8-lagoon-nebula",
    canonical_name: "Lagoon Nebula",
    standard_designation: "M8 / NGC 6523",
    classification_code: "NEBULA",
    ra_deg: 271.0501, // 18h 04m 12.0s
    dec_deg: -24.3833, // -24° 23' 00''
    distance_ly: 4100,
    distance_pc: 1250,
    distance_uncertainty_ly: { upper: 200, lower: 200, percentage: 4.8 },
    distance_method: "TRIGONOMETRIC_PARALLAX",
    v_mag: 6.0,
    constellation: "Sagittarius",
    messier_id: "M8",
    ngc_id: "NGC 6523",
    aliases: ["M8", "NGC 6523", "Lagoon Nebula", "Hourglass Nebula Host"],
    summary:
      "Giant interstellar cloud in Sagittarius (4,100 ly) classified as an emission nebula and H II region, ionized by hot O-type stars including Herschel 36.",
    deep_sky_properties: {
      type: "NEBULA",
      nebula: {
        nebulaSubtype: "EMISSION",
        angularDiameterArcmin: 90.0,
        majorAxisArcmin: 90.0,
        minorAxisArcmin: 40.0,
        associatedIonizingStar: "Herschel 36",
        chemicalComposition: ["H-II", "O-III"],
      },
      cosmicHierarchy: {
        hostStructure: "Milky Way > Carina-Sagittarius Arm",
      },
      distanceMethod: "TRIGONOMETRIC_PARALLAX",
    },
    source_catalog: "SIMBAD / OpenNGC",
    record_identifier: "MESSIER 008",
  },
  {
    id_source: "IC_0434",
    slug: "horsehead-nebula",
    canonical_name: "Horsehead Nebula",
    standard_designation: "Barnard 33 / IC 434",
    classification_code: "NEBULA",
    ra_deg: 85.2458, // 05h 40m 59.0s
    dec_deg: -2.4583, // -02° 27' 30''
    distance_ly: 1375,
    distance_pc: 422,
    distance_uncertainty_ly: { upper: 40, lower: 40, percentage: 2.9 },
    distance_method: "TRIGONOMETRIC_PARALLAX",
    v_mag: 6.8, // IC 434 background
    constellation: "Orion",
    ic_id: "IC 434",
    aliases: ["Horsehead Nebula", "Barnard 33", "B33", "IC 434"],
    summary:
      "Iconic dark absorption nebula in Orion (1,375 ly), silhouetted in the shape of a horse's head against the glowing hydrogen emission nebula IC 434.",
    deep_sky_properties: {
      type: "NEBULA",
      nebula: {
        nebulaSubtype: "DARK",
        angularDiameterArcmin: 8.0,
        majorAxisArcmin: 8.0,
        minorAxisArcmin: 6.0,
        associatedIonizingStar: "Sigma Orionis",
      },
      cosmicHierarchy: {
        hostStructure: "Milky Way > Orion-Cygnus Arm > Orion Molecular Cloud",
      },
      distanceMethod: "TRIGONOMETRIC_PARALLAX",
    },
    source_catalog: "SIMBAD / OpenNGC",
    record_identifier: "NAME HORSEHEAD NEBULA",
  },

  // ==========================================
  // 3. PLANETARY NEBULAE
  // ==========================================
  {
    id_source: "MESSIER_057",
    slug: "m57-ring-nebula",
    canonical_name: "Ring Nebula",
    standard_designation: "M57 / NGC 6720",
    classification_code: "PLANETARY_NEBULA",
    ra_deg: 283.3961, // 18h 53m 35.1s
    dec_deg: 33.0292, // +33° 01' 45''
    distance_ly: 2570,
    distance_pc: 787,
    distance_uncertainty_ly: { upper: 120, lower: 120, percentage: 4.6 },
    distance_method: "TRIGONOMETRIC_PARALLAX",
    v_mag: 8.8,
    constellation: "Lyra",
    messier_id: "M57",
    ngc_id: "NGC 6720",
    aliases: ["M57", "NGC 6720", "Ring Nebula", "The Ring in Lyra"],
    summary:
      "Prototype planetary nebula in Lyra (2,570 ly) comprising an expanding barrel-shaped torus of ionized gas ejected by a central dying white dwarf progenitor (15.75 mag).",
    deep_sky_properties: {
      type: "PLANETARY_NEBULA",
      planetaryNebula: {
        centralStarName: "HD 175635",
        centralStarMagnitudeV: 15.75,
        expansionVelocityKmS: 20.0,
        angularDiameterArcsec: 84.0,
        distanceMethod: "Gaia DR3 Trigonometric Parallax",
      },
      cosmicHierarchy: {
        hostStructure: "Milky Way > Orion-Cygnus Arm",
      },
      distanceMethod: "TRIGONOMETRIC_PARALLAX",
    },
    source_catalog: "SIMBAD / OpenNGC",
    record_identifier: "MESSIER 057",
  },
  {
    id_source: "NGC_7293",
    slug: "helix-nebula",
    canonical_name: "Helix Nebula",
    standard_designation: "NGC 7293 / Caldwell 63",
    classification_code: "PLANETARY_NEBULA",
    ra_deg: 337.4108, // 22h 29m 38.6s
    dec_deg: -20.8369, // -20° 50' 13''
    distance_ly: 655,
    distance_pc: 201,
    distance_uncertainty_ly: { upper: 15, lower: 15, percentage: 2.3 },
    distance_method: "TRIGONOMETRIC_PARALLAX",
    v_mag: 7.6,
    constellation: "Aquarius",
    ngc_id: "NGC 7293",
    caldwell_id: "C63",
    aliases: ["Helix Nebula", "NGC 7293", "Caldwell 63", "Eye of Sauron Nebula", "Eye of God"],
    summary:
      "The closest large planetary nebula to Earth (655 ly), displaying intricate radial cometary knots and concentric gaseous shells around a compact hot white dwarf.",
    deep_sky_properties: {
      type: "PLANETARY_NEBULA",
      planetaryNebula: {
        centralStarName: "WD 2226-210",
        centralStarMagnitudeV: 13.5,
        expansionVelocityKmS: 31.0,
        angularDiameterArcsec: 960.0,
        distanceMethod: "Gaia DR3 Trigonometric Parallax",
      },
      cosmicHierarchy: {
        hostStructure: "Milky Way > Orion-Cygnus Arm",
      },
      distanceMethod: "TRIGONOMETRIC_PARALLAX",
    },
    source_catalog: "SIMBAD / OpenNGC",
    record_identifier: "NGC 7293",
  },
  {
    id_source: "MESSIER_027",
    slug: "m27-dumbbell-nebula",
    canonical_name: "Dumbbell Nebula",
    standard_designation: "M27 / NGC 6853",
    classification_code: "PLANETARY_NEBULA",
    ra_deg: 299.9015, // 19h 59m 36.4s
    dec_deg: 22.7214, // +22° 43' 17''
    distance_ly: 1360,
    distance_pc: 417,
    distance_uncertainty_ly: { upper: 30, lower: 30, percentage: 2.2 },
    distance_method: "TRIGONOMETRIC_PARALLAX",
    v_mag: 7.5,
    constellation: "Vulpecula",
    messier_id: "M27",
    ngc_id: "NGC 6853",
    aliases: ["M27", "NGC 6853", "Dumbbell Nebula", "Apple Core Nebula"],
    summary:
      "The first planetary nebula discovered in history (by Charles Messier in 1764, 1,360 ly), showing a luminous bi-lobed hourglass morphology.",
    deep_sky_properties: {
      type: "PLANETARY_NEBULA",
      planetaryNebula: {
        centralStarName: "WD 1957+225",
        centralStarMagnitudeV: 13.9,
        expansionVelocityKmS: 30.0,
        angularDiameterArcsec: 480.0,
      },
      cosmicHierarchy: {
        hostStructure: "Milky Way > Orion-Cygnus Arm",
      },
      distanceMethod: "TRIGONOMETRIC_PARALLAX",
    },
    source_catalog: "SIMBAD / OpenNGC",
    record_identifier: "MESSIER 027",
  },

  // ==========================================
  // 4. SUPERNOVA REMNANTS
  // ==========================================
  {
    id_source: "MESSIER_001",
    slug: "m1-crab-nebula",
    canonical_name: "Crab Nebula",
    standard_designation: "M1 / NGC 1952",
    classification_code: "SUPERNOVA_REMNANT",
    ra_deg: 83.6331, // 05h 34m 31.9s
    dec_deg: 22.0145, // +22° 00' 52''
    distance_ly: 6500,
    distance_pc: 2000,
    distance_uncertainty_ly: { upper: 500, lower: 500, percentage: 7.7 },
    distance_method: "LITERATURE_CONSENSUS",
    v_mag: 8.4,
    constellation: "Taurus",
    messier_id: "M1",
    ngc_id: "NGC 1952",
    aliases: ["M1", "NGC 1952", "Crab Nebula", "Taurus A", "SN 1054 Remnant"],
    summary:
      "Pulsar wind nebula and supernova remnant in Taurus (6,500 ly) created by the core-collapse supernova observed by Chinese astronomers in 1054 AD, driven by the Crab Pulsar.",
    deep_sky_properties: {
      type: "SUPERNOVA_REMNANT",
      supernovaRemnant: {
        explosionYearEstimate: 1054,
        progenitorType: "CORE_COLLAPSE",
        expansionVelocityKmS: 1500.0,
        remnantCoreType: "PULSAR",
        centralCompactObject: "Crab Pulsar (PSR B0531+21 / 30.2 Hz)",
      },
      cosmicHierarchy: {
        hostStructure: "Milky Way > Perseus Arm",
      },
      distanceMethod: "LITERATURE_CONSENSUS",
    },
    observations: [
      {
        id: "obs-m1-chandra-xray",
        wavelengthBand: "X_RAY",
        filterOrFrequency: "0.5-7.0 keV",
        telescopeOrSurvey: "Chandra X-ray Observatory",
        instrument: "ACIS",
        citationOrCredit: "NASA / CXC / SAO",
      },
    ],
    source_catalog: "SIMBAD / OpenNGC",
    record_identifier: "MESSIER 001",
  },
  {
    id_source: "SNR_CAS_A",
    slug: "cassiopeia-a",
    canonical_name: "Cassiopeia A",
    standard_designation: "Cas A / 3C 461",
    classification_code: "SUPERNOVA_REMNANT",
    ra_deg: 350.8501, // 23h 23m 24.0s
    dec_deg: 58.8151, // +58° 48' 54''
    distance_ly: 11000,
    distance_pc: 3400,
    distance_uncertainty_ly: { upper: 1000, lower: 1000, percentage: 9.0 },
    distance_method: "LITERATURE_CONSENSUS",
    v_mag: 14.5, // Optical faint
    constellation: "Cassiopeia",
    aliases: ["Cassiopeia A", "Cas A", "3C 461", "SN 1680 Remnant"],
    summary:
      "Brightest astronomical radio source outside the Solar System (11,000 ly), an expanding shell resulting from a Type IIb core-collapse supernova roughly 340 years ago.",
    deep_sky_properties: {
      type: "SUPERNOVA_REMNANT",
      supernovaRemnant: {
        explosionYearEstimate: 1680,
        progenitorType: "CORE_COLLAPSE",
        expansionVelocityKmS: 5000.0,
        remnantCoreType: "NEUTRON_STAR",
        centralCompactObject: "Isolated Central Compact Object (CCO)",
      },
      cosmicHierarchy: {
        hostStructure: "Milky Way > Perseus Arm",
      },
      distanceMethod: "LITERATURE_CONSENSUS",
    },
    source_catalog: "SIMBAD / NASA NED",
    record_identifier: "NAME CAS A",
  },

  // ==========================================
  // 5. STAR CLUSTERS (Open & Globular)
  // ==========================================
  {
    id_source: "MESSIER_045",
    slug: "m45-pleiades-cluster",
    canonical_name: "Pleiades",
    standard_designation: "M45 / Melotte 22",
    classification_code: "STAR_CLUSTER",
    ra_deg: 56.75, // 03h 47m 00s
    dec_deg: 24.1167, // +24° 07' 00''
    distance_ly: 444,
    distance_pc: 136,
    distance_uncertainty_ly: { upper: 5, lower: 5, percentage: 1.1 },
    distance_method: "TRIGONOMETRIC_PARALLAX",
    v_mag: 1.6,
    constellation: "Taurus",
    messier_id: "M45",
    aliases: ["M45", "Pleiades", "Seven Sisters", "Melotte 22", "Subaru"],
    summary:
      "Prominent open star cluster in Taurus (444 ly) dominated by luminous hot B-type stars (Alcyone, Electra, Maia, Merope) passing through a blue reflection dust cloud.",
    deep_sky_properties: {
      type: "STAR_CLUSTER",
      starCluster: {
        clusterSubtype: "OPEN_CLUSTER",
        estimatedAgeGyr: 0.115, // ~115 Myr
        metallicityFeH: 0.03,
        estimatedMemberCount: 1000,
        coreRadiusArcmin: 16.0,
        halfLightRadiusArcmin: 70.0,
        totalLuminositySolar: 50000,
        trumplerClass: "II,2,r",
      },
      cosmicHierarchy: {
        hostStructure: "Milky Way > Orion-Cygnus Arm > Local Bubble",
      },
      distanceMethod: "TRIGONOMETRIC_PARALLAX",
    },
    source_catalog: "SIMBAD / Gaia DR3 / OpenNGC",
    record_identifier: "MESSIER 045",
  },
  {
    id_source: "MESSIER_013",
    slug: "m13-hercules-cluster",
    canonical_name: "Hercules Globular Cluster",
    standard_designation: "M13 / NGC 6205",
    classification_code: "STAR_CLUSTER",
    ra_deg: 250.4221, // 16h 41m 41.3s
    dec_deg: 36.4597, // +36° 27' 35''
    distance_ly: 22200,
    distance_pc: 6800,
    distance_uncertainty_ly: { upper: 500, lower: 500, percentage: 2.2 },
    distance_method: "CLUSTER_MAIN_SEQUENCE_FITTING",
    v_mag: 5.8,
    constellation: "Hercules",
    messier_id: "M13",
    ngc_id: "NGC 6205",
    aliases: ["M13", "NGC 6205", "Hercules Cluster", "Great Globular Cluster in Hercules"],
    summary:
      "One of the brightest and most famous globular star clusters in the northern sky (22,200 ly), packing several hundred thousand ancient stars into a diameter of 145 ly.",
    deep_sky_properties: {
      type: "STAR_CLUSTER",
      starCluster: {
        clusterSubtype: "GLOBULAR_CLUSTER",
        estimatedAgeGyr: 11.65,
        metallicityFeH: -1.53,
        estimatedMemberCount: 300000,
        coreRadiusArcmin: 0.62,
        halfLightRadiusArcmin: 1.69,
        totalLuminositySolar: 300000,
      },
      cosmicHierarchy: {
        hostStructure: "Milky Way > Galactic Halo",
      },
      distanceMethod: "CLUSTER_MAIN_SEQUENCE_FITTING",
    },
    source_catalog: "SIMBAD / OpenNGC",
    record_identifier: "MESSIER 013",
  },
  {
    id_source: "NGC_5139",
    slug: "omega-centauri",
    canonical_name: "Omega Centauri",
    standard_designation: "NGC 5139 / Caldwell 80",
    classification_code: "STAR_CLUSTER",
    ra_deg: 201.6971, // 13h 26m 47.3s
    dec_deg: -47.4797, // -47° 28' 47''
    distance_ly: 17090,
    distance_pc: 5240,
    distance_uncertainty_ly: { upper: 300, lower: 300, percentage: 1.8 },
    distance_method: "TRIGONOMETRIC_PARALLAX",
    v_mag: 3.9,
    constellation: "Centaurus",
    ngc_id: "NGC 5139",
    caldwell_id: "C80",
    aliases: ["Omega Centauri", "NGC 5139", "Caldwell 80", "ω Cen"],
    summary:
      "The largest and most massive globular cluster in the Milky Way (17,090 ly, 4 million solar masses), widely believed to be the remnant stripped core of an ancient dwarf galaxy.",
    deep_sky_properties: {
      type: "STAR_CLUSTER",
      starCluster: {
        clusterSubtype: "GLOBULAR_CLUSTER",
        estimatedAgeGyr: 11.52,
        metallicityFeH: -1.53,
        estimatedMemberCount: 10000000,
        coreRadiusArcmin: 2.57,
        halfLightRadiusArcmin: 5.0,
        totalLuminositySolar: 1000000,
      },
      cosmicHierarchy: {
        hostStructure: "Milky Way > Galactic Halo",
      },
      distanceMethod: "TRIGONOMETRIC_PARALLAX",
    },
    source_catalog: "SIMBAD / OpenNGC",
    record_identifier: "NGC 5139",
  },
  {
    id_source: "MESSIER_044",
    slug: "m44-beehive-cluster",
    canonical_name: "Beehive Cluster",
    standard_designation: "M44 / NGC 2632",
    classification_code: "STAR_CLUSTER",
    ra_deg: 130.1, // 08h 40m 24s
    dec_deg: 19.6667, // +19° 40' 00''
    distance_ly: 577,
    distance_pc: 177,
    distance_uncertainty_ly: { upper: 10, lower: 10, percentage: 1.7 },
    distance_method: "TRIGONOMETRIC_PARALLAX",
    v_mag: 3.7,
    constellation: "Cancer",
    messier_id: "M44",
    ngc_id: "NGC 2632",
    aliases: ["M44", "NGC 2632", "Beehive Cluster", "Praesepe", "Manger"],
    summary:
      "Ancient open cluster in Cancer (577 ly) visible to the naked eye since antiquity, sharing proper motion and metallicity with the Hyades cluster.",
    deep_sky_properties: {
      type: "STAR_CLUSTER",
      starCluster: {
        clusterSubtype: "OPEN_CLUSTER",
        estimatedAgeGyr: 0.65, // ~650 Myr
        metallicityFeH: 0.12,
        estimatedMemberCount: 1000,
        coreRadiusArcmin: 18.0,
        trumplerClass: "II,2,m",
      },
      cosmicHierarchy: {
        hostStructure: "Milky Way > Orion-Cygnus Arm > Local Bubble",
      },
      distanceMethod: "TRIGONOMETRIC_PARALLAX",
    },
    source_catalog: "SIMBAD / Gaia DR3 / OpenNGC",
    record_identifier: "MESSIER 044",
  },
  {
    id_source: "SGR_A_STAR",
    slug: "sagittarius-a-star",
    canonical_name: "Sagittarius A*",
    standard_designation: "Sgr A* / Milky Way SMBH",
    classification_code: "SUPERNOVA_REMNANT", // Black hole / central radio source in deep sky classification
    ra_deg: 266.4168, // 17h 45m 40.04s
    dec_deg: -29.0078, // -29° 00' 28.1''
    distance_ly: 26670,
    distance_pc: 8178,
    distance_uncertainty_ly: { upper: 85, lower: 85, percentage: 0.32 },
    distance_method: "LITERATURE_CONSENSUS",
    v_mag: 28.0, // Extinguished optically by galactic dust
    constellation: "Sagittarius",
    aliases: [
      "Sagittarius A*",
      "Sgr A*",
      "Central Supermassive Black Hole",
      "Milky Way Central Black Hole",
      "Galactic Center SMBH",
    ],
    summary:
      "The supermassive black hole at the dynamical center of the Milky Way (4.154 million solar masses, 8,178 pc from Earth), imaged by the Event Horizon Telescope revealing a bright relativistic plasma ring around its shadow.",
    deep_sky_properties: {
      type: "SUPERNOVA_REMNANT",
      supernovaRemnant: {
        progenitorType: "CORE_COLLAPSE",
        remnantCoreType: "BLACK_HOLE",
        centralCompactObject: "Supermassive Black Hole (M = 4.154 x 10^6 M_sun)",
      },
      cosmicHierarchy: {
        hostStructure: "Milky Way > Galactic Center > Sagittarius A Complex",
      },
      distanceMethod: "LITERATURE_CONSENSUS",
    },
    observations: [
      {
        id: "obs-sgra-eht-mm",
        wavelengthBand: "RADIO",
        filterOrFrequency: "1.3 mm (230 GHz)",
        telescopeOrSurvey: "Event Horizon Telescope (EHT)",
        citationOrCredit: "EHT Collaboration et al. (2022)",
      },
      {
        id: "obs-sgra-gravity-nir",
        wavelengthBand: "INFRARED",
        filterOrFrequency: "K-band (2.2 µm)",
        telescopeOrSurvey: "VLTI / GRAVITY",
        instrument: "GRAVITY Interferometer",
        citationOrCredit: "GRAVITY Collaboration (2018, 2019, 2020)",
      },
      {
        id: "obs-sgra-chandra-xray",
        wavelengthBand: "X_RAY",
        filterOrFrequency: "2-10 keV",
        telescopeOrSurvey: "Chandra X-ray Observatory",
        citationOrCredit: "NASA / CXC / MIT / F.K. Baganoff et al.",
      },
    ],
    source_catalog: "GRAVITY Collaboration / Event Horizon Telescope / SIMBAD",
    record_identifier: "NAME Sgr A*",
  },
];

const pipeline = new DeepSkyIngestionPipeline();

export function createDeepSkyEntities(): CelestialObject[] {
  return pipeline.processBatch(RAW_DEEP_SKY_RECORDS);
}

export const DEEP_SKY_CELESTIAL_OBJECTS: CelestialObject[] = createDeepSkyEntities();
