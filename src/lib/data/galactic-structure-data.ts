import { GalacticStructure } from "@/domain/galactic-structure/types";

export const GALACTIC_STRUCTURES_DATA: GalacticStructure[] = [
  // ==========================================
  // 1. THE MILKY WAY GALAXY
  // ==========================================
  {
    id: "g0000000-0000-4000-8000-000000000001",
    slug: "milky-way",
    name: "Milky Way Galaxy",
    standardDesignation: "Milky Way / The Galaxy",
    type: "GALAXY_STRUCTURE",
    aliases: ["Milky Way", "The Galaxy", "Via Lactea", "MW"],
    summary:
      "A barred spiral galaxy of Hubble type SB(rs)bc spanning ~100,000 light-years in diameter, containing 100-400 billion stars, and hosting the Solar System at ~8.18 kpc from the Galactic Center.",
    isModelDerived: false,
    modelConfidence: "CONFIRMED",
    spatialExtent: {
      minGalactocentricRadiusKpc: 0.0,
      maxGalactocentricRadiusKpc: 30.0,
      minZHeightPc: -3000,
      maxZHeightPc: 3000,
    },
    disk: {
      thinDiskScaleHeightPc: 300,
      thickDiskScaleHeightPc: 900,
      scaleLengthPc: 2600,
      radialCutoffKpc: 25.0,
      stellarMassSolar: 5.4e10,
      gasMassSolar: 1.0e10,
      estimatedRotationSpeedKmS: 234.0,
    },
    provenance: {
      authoritativeBody: "IAU",
      catalogName: "Bland-Hawthorn & Gerhard (2016) / Gaia DR3",
      recordIdentifier: "MILKY_WAY_CANONICAL_MODEL",
      confidenceScore: 0.99,
      citationUrl: "https://www.annualreviews.org/doi/abs/10.1146/annurev-astro-081915-023441",
    },
  },

  // ==========================================
  // 2. GALACTIC DISK
  // ==========================================
  {
    id: "g0000000-0000-4000-8000-000000000002",
    slug: "galactic-disk",
    name: "Milky Way Stellar Disk",
    standardDesignation: "Galactic Thin & Thick Disk",
    type: "GALACTIC_DISK",
    aliases: ["Galactic Disk", "Stellar Disk", "Galactic Plane Structure"],
    summary:
      "Flattened rotating stellar and interstellar component comprising a thin disk (~300 pc scale height, younger stars and gas) and a thick disk (~900 pc scale height, older metal-poor stars).",
    isModelDerived: true,
    modelConfidence: "CONFIRMED",
    spatialExtent: {
      minGalactocentricRadiusKpc: 1.5,
      maxGalactocentricRadiusKpc: 25.0,
      minZHeightPc: -1500,
      maxZHeightPc: 1500,
    },
    disk: {
      thinDiskScaleHeightPc: 300,
      thickDiskScaleHeightPc: 900,
      scaleLengthPc: 2600,
      radialCutoffKpc: 25.0,
      stellarMassSolar: 5.0e10,
      estimatedRotationSpeedKmS: 234.0,
    },
    provenance: {
      authoritativeBody: "GAIA",
      catalogName: "Gaia DR3 Structure Analysis (Bovy et al. 2016)",
      recordIdentifier: "GALACTIC_DISK_MODEL",
      confidenceScore: 0.98,
    },
  },

  // ==========================================
  // 3. GALACTIC BULGE
  // ==========================================
  {
    id: "g0000000-0000-4000-8000-000000000003",
    slug: "galactic-bulge",
    name: "Galactic Bulge",
    standardDesignation: "Central Spheroid & Boxy/Peanut Bulge",
    type: "GALACTIC_BULGE",
    aliases: ["Galactic Bulge", "Central Bulge", "MW Bulge"],
    summary:
      "A dense, central stellar concentration extending to ~2 kpc radius, dominated by old, metal-rich stars with a boxy/peanut-shaped morphology arising from dynamical bar buckling.",
    isModelDerived: true,
    modelConfidence: "CONFIRMED",
    spatialExtent: {
      minGalactocentricRadiusKpc: 0.0,
      maxGalactocentricRadiusKpc: 2.2,
      minZHeightPc: -1200,
      maxZHeightPc: 1200,
    },
    bulge: {
      effectiveRadiusKpc: 1.8,
      stellarMassSolar: 1.8e10,
      morphology: "BOXY_PEANUT",
      metallicityFeHRange: { min: -1.0, max: +0.4 },
    },
    provenance: {
      authoritativeBody: "ESO",
      catalogName: "Wegg & Gerhard (2013) / VVV Survey",
      recordIdentifier: "GALACTIC_BULGE_STRUCTURE",
      confidenceScore: 0.96,
    },
  },

  // ==========================================
  // 4. GALACTIC BAR
  // ==========================================
  {
    id: "g0000000-0000-4000-8000-000000000004",
    slug: "galactic-bar",
    name: "Galactic Central Bar",
    standardDesignation: "Milky Way Primary Stellar Bar",
    type: "GALACTIC_BAR",
    aliases: ["Galactic Bar", "Central Bar", "Long Bar"],
    summary:
      "A prominent non-axisymmetric rotating stellar bar of half-length ~5.0 kpc, inclined at an angle of ~29° relative to the Sun-Galactic Center axis, driving spiral density waves.",
    isModelDerived: true,
    modelConfidence: "CONFIRMED",
    spatialExtent: {
      minGalactocentricRadiusKpc: 0.0,
      maxGalactocentricRadiusKpc: 5.2,
      minZHeightPc: -600,
      maxZHeightPc: 600,
    },
    bar: {
      halfLengthKpc: 5.0,
      axisRatio: 0.45,
      patternSpeedKmSPerKpc: 39.0,
      orientationAngleDeg: 29.0,
    },
    provenance: {
      authoritativeBody: "ESA",
      catalogName: "Bland-Hawthorn & Gerhard (2016) / Spitzer GLIMPSE",
      recordIdentifier: "GALACTIC_BAR_STRUCTURE",
      confidenceScore: 0.95,
    },
  },

  // ==========================================
  // 5. GALACTIC HALO
  // ==========================================
  {
    id: "g0000000-0000-4000-8000-000000000005",
    slug: "galactic-halo",
    name: "Galactic Stellar & Dark Matter Halo",
    standardDesignation: "Milky Way Extended Halo",
    type: "GALACTIC_HALO",
    aliases: ["Galactic Halo", "Stellar Halo", "Dark Matter Halo"],
    summary:
      "Quasi-spherical outer envelope extending beyond 100 kpc containing ~157 ancient globular clusters, metal-poor halo field stars, stellar tidal streams, and a massive dark matter halo.",
    isModelDerived: true,
    modelConfidence: "PROBABLE",
    spatialExtent: {
      minGalactocentricRadiusKpc: 1.0,
      maxGalactocentricRadiusKpc: 100.0,
      minZHeightPc: -100000,
      maxZHeightPc: 100000,
    },
    halo: {
      innerRadiusKpc: 2.0,
      outerRadiusKpc: 100.0,
      stellarHaloMassSolar: 1.0e9,
      darkMatterHaloMassSolar: 1.3e12,
      globularClusterCountEstimated: 157,
    },
    provenance: {
      authoritativeBody: "NASA",
      catalogName: "Deason et al. (2019) / Bland-Hawthorn & Gerhard (2016)",
      recordIdentifier: "GALACTIC_HALO_STRUCTURE",
      confidenceScore: 0.94,
    },
  },

  // ==========================================
  // 6. GALACTIC CENTER REGION
  // ==========================================
  {
    id: "g0000000-0000-4000-8000-000000000006",
    slug: "galactic-center",
    name: "Galactic Center",
    standardDesignation: "Milky Way Nucleus / Sgr A Complex",
    type: "GALACTIC_CENTER",
    aliases: ["Galactic Center", "Galactic Nucleus", "GC", "Core of the Milky Way"],
    summary:
      "The rotational barycenter of the Milky Way located 8,178 pc from Earth in Sagittarius, containing the Central Molecular Zone, dense stellar clusters, and supermassive black hole Sagittarius A*.",
    isModelDerived: false,
    modelConfidence: "CONFIRMED",
    spatialExtent: {
      minGalactocentricRadiusKpc: 0.0,
      maxGalactocentricRadiusKpc: 0.3,
      minZHeightPc: -150,
      maxZHeightPc: 150,
    },
    galacticCenter: {
      distanceFromSunPc: {
        value: 8178.0,
        uncertainty: { upper: 26, lower: 26 },
        unit: "pc",
      },
      centralBlackHoleName: "Sagittarius A*",
      centralBlackHoleMassSolar: {
        value: 4154000,
        uncertainty: { upper: 14000, lower: 14000 },
        unit: "M_sun",
      },
      equatorialCoordinates: {
        raDeg: 266.4168,
        decDeg: -29.0078,
      },
      galacticCoordinates: {
        lDeg: 359.9443,
        bDeg: -0.0461,
      },
    },
    provenance: {
      authoritativeBody: "ESO",
      catalogName: "Abuter et al. (2019) / Event Horizon Telescope (2022)",
      recordIdentifier: "GALACTIC_CENTER_CONSENSUS",
      confidenceScore: 0.99,
      citationUrl: "https://www.aanda.org/articles/aa/full_html/2019/05/aa35656-19/aa35656-19.html",
    },
  },

  // ==========================================
  // 7. ORION SPUR / LOCAL ARM
  // ==========================================
  {
    id: "g0000000-0000-4000-8000-000000000007",
    slug: "orion-spur",
    name: "Orion Spur / Local Arm",
    standardDesignation: "Local Spur / Orion-Cygnus Arm",
    type: "SPIRAL_ARM",
    aliases: ["Orion Spur", "Local Arm", "Orion-Cygnus Arm", "Our Spiral Arm"],
    summary:
      "A prominent spiral arm branch inclined at ~12.0° pitch angle located between the Sagittarius and Perseus arms, harboring the Solar System, the Orion Nebula, the Pleiades, and the Local Bubble.",
    isModelDerived: true,
    modelConfidence: "CONFIRMED",
    spatialExtent: {
      minGalactocentricRadiusKpc: 7.5,
      maxGalactocentricRadiusKpc: 9.5,
      minZHeightPc: -300,
      maxZHeightPc: 300,
      angularSpanDeg: { start: 35.0, end: 115.0 },
    },
    spiralArm: {
      armName: "ORION_SPUR",
      pitchAngleDeg: 12.0,
      referenceRadiusKpc: 8.2,
      referenceAngleDeg: 55.0,
      angleRangeDeg: { start: 35.0, end: 115.0 },
      widthKpc: 0.6,
      isSpurOrSegment: true,
    },
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "Reid et al. (2019) / Xu et al. (2016)",
      recordIdentifier: "ORION_SPUR_BESSEL",
      confidenceScore: 0.97,
    },
  },

  // ==========================================
  // 8. PERSEUS ARM
  // ==========================================
  {
    id: "g0000000-0000-4000-8000-000000000008",
    slug: "perseus-arm",
    name: "Perseus Arm",
    standardDesignation: "Perseus Spiral Arm",
    type: "SPIRAL_ARM",
    aliases: ["Perseus Arm", "Outer Perseus Arm"],
    summary:
      "One of the two primary major spiral arms of the Milky Way, located outside the Solar orbit at ~9.9 kpc radius with a pitch angle of ~10.0°, hosting high-mass star formation complexes.",
    isModelDerived: true,
    modelConfidence: "CONFIRMED",
    spatialExtent: {
      minGalactocentricRadiusKpc: 8.0,
      maxGalactocentricRadiusKpc: 14.0,
      minZHeightPc: -400,
      maxZHeightPc: 400,
      angularSpanDeg: { start: 10.0, end: 240.0 },
    },
    spiralArm: {
      armName: "PERSEUS",
      pitchAngleDeg: 10.0,
      referenceRadiusKpc: 9.9,
      referenceAngleDeg: 40.0,
      angleRangeDeg: { start: 10.0, end: 240.0 },
      widthKpc: 0.8,
      isSpurOrSegment: false,
    },
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "Reid et al. (2019)",
      recordIdentifier: "PERSEUS_ARM_BESSEL",
      confidenceScore: 0.96,
    },
  },

  // ==========================================
  // 9. SAGITTARIUS ARM
  // ==========================================
  {
    id: "g0000000-0000-4000-8000-000000000009",
    slug: "sagittarius-arm",
    name: "Sagittarius-Carina Arm",
    standardDesignation: "Sagittarius Arm",
    type: "SPIRAL_ARM",
    aliases: ["Sagittarius Arm", "Sagittarius-Carina Arm", "Carina Arm"],
    summary:
      "Major inward spiral arm located between the Scutum-Centaurus Arm and the Orion Spur at ~6.6 kpc radius, harboring the luminous Carina Nebula (NGC 3372) and Lagoon Nebula (M8).",
    isModelDerived: true,
    modelConfidence: "CONFIRMED",
    spatialExtent: {
      minGalactocentricRadiusKpc: 5.5,
      maxGalactocentricRadiusKpc: 8.5,
      minZHeightPc: -350,
      maxZHeightPc: 350,
      angularSpanDeg: { start: 15.0, end: 230.0 },
    },
    spiralArm: {
      armName: "SAGITTARIUS",
      pitchAngleDeg: 13.0,
      referenceRadiusKpc: 6.6,
      referenceAngleDeg: 25.0,
      angleRangeDeg: { start: 15.0, end: 230.0 },
      widthKpc: 0.8,
      isSpurOrSegment: false,
    },
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "Reid et al. (2019)",
      recordIdentifier: "SAGITTARIUS_ARM_BESSEL",
      confidenceScore: 0.96,
    },
  },

  // ==========================================
  // 10. SCUTUM-CENTAURUS ARM
  // ==========================================
  {
    id: "g0000000-0000-4000-8000-000000000010",
    slug: "scutum-centaurus-arm",
    name: "Scutum-Centaurus Arm",
    standardDesignation: "Scutum-Crux Arm",
    type: "SPIRAL_ARM",
    aliases: ["Scutum-Centaurus Arm", "Scutum-Crux Arm", "Centaurus Arm"],
    summary:
      "One of the two primary stellar spiral arms originating directly from the tip of the Galactic central bar at ~5.0 kpc radius, characterized by intense giant molecular clouds and red supergiant clusters.",
    isModelDerived: true,
    modelConfidence: "CONFIRMED",
    spatialExtent: {
      minGalactocentricRadiusKpc: 4.0,
      maxGalactocentricRadiusKpc: 7.5,
      minZHeightPc: -350,
      maxZHeightPc: 350,
      angularSpanDeg: { start: 20.0, end: 260.0 },
    },
    spiralArm: {
      armName: "SCUTUM_CENTAURUS",
      pitchAngleDeg: 12.5,
      referenceRadiusKpc: 5.0,
      referenceAngleDeg: 30.0,
      angleRangeDeg: { start: 20.0, end: 260.0 },
      widthKpc: 0.9,
      isSpurOrSegment: false,
    },
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "Reid et al. (2019) / Churchwell et al. (2009)",
      recordIdentifier: "SCUTUM_CENTAURUS_ARM_BESSEL",
      confidenceScore: 0.95,
    },
  },

  // ==========================================
  // 11. LOCAL GROUP
  // ==========================================
  {
    id: "g0000000-0000-4000-8000-000000000011",
    slug: "local-group",
    name: "Local Group of Galaxies",
    standardDesignation: "Local Group / LG",
    type: "LOCAL_GROUP",
    aliases: ["Local Group", "Local Group of Galaxies", "LG"],
    summary:
      "The gravitationally bound galaxy cluster spanning ~3 Mpc (~10 Mly) containing the Milky Way, the Andromeda Galaxy (M31), the Triangulum Galaxy (M33), and over 80 satellite dwarf galaxies.",
    isModelDerived: false,
    modelConfidence: "CONFIRMED",
    spatialExtent: {
      minGalactocentricRadiusKpc: 0.0,
      maxGalactocentricRadiusKpc: 3000.0,
    },
    localGroup: {
      majorGalaxies: [
        "Milky Way Galaxy",
        "Andromeda Galaxy (M31)",
        "Triangulum Galaxy (M33)",
        "Large Magellanic Cloud (LMC)",
        "Small Magellanic Cloud (SMC)",
      ],
      approximateDiameterMpc: 3.0,
      totalGalaxyCountEstimated: 85,
    },
    provenance: {
      authoritativeBody: "NASA",
      catalogName: "McConnachie (2012) / van den Bergh (2000)",
      recordIdentifier: "LOCAL_GROUP_CONSENSUS",
      confidenceScore: 0.99,
    },
  },
];
