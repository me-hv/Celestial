import { CosmicStructure } from "@/domain/cosmic-structure/types";
import { equatorialToCosmicCoordinates } from "../astronomy/coordinates/cosmic-coordinates";
import { LY_PER_MPC } from "../astronomy/coordinates/local-group";

function makeCoords(
  raDeg: number,
  decDeg: number,
  distanceMpc: number,
  distanceUncertaintyMpc?: number,
  redshiftZ?: number,
  vRecessionKmS?: number
) {
  const cosmic = equatorialToCosmicCoordinates(raDeg, decDeg, distanceMpc);
  const distanceLy = distanceMpc * LY_PER_MPC;
  const distErrLy = distanceUncertaintyMpc ? distanceUncertaintyMpc * LY_PER_MPC : undefined;

  return {
    raDeg,
    decDeg,
    distanceMpc: {
      value: distanceMpc,
      uncertainty: distanceUncertaintyMpc
        ? { upper: distanceUncertaintyMpc, lower: distanceUncertaintyMpc }
        : undefined,
      unit: "Mpc",
    },
    distanceLy: {
      value: distanceLy,
      uncertainty: distErrLy ? { upper: distErrLy, lower: distErrLy } : undefined,
      unit: "ly",
    },
    spectroscopicRedshiftZ:
      redshiftZ !== undefined ? { value: redshiftZ, unit: "dimensionless" } : undefined,
    heliocentricRadialVelocityKmS:
      vRecessionKmS !== undefined ? { value: vRecessionKmS, unit: "km/s" } : undefined,
    galactocentricCartesianMpc: {
      xMpc: Number(cosmic.xMpc.toFixed(3)),
      yMpc: Number(cosmic.yMpc.toFixed(3)),
      zMpc: Number(cosmic.zMpc.toFixed(3)),
    },
    supergalactic: {
      sglDeg: Number(cosmic.supergalactic.sglDeg.toFixed(2)),
      sgbDeg: Number(cosmic.supergalactic.sgbDeg.toFixed(2)),
      sgxMpc: Number(cosmic.supergalactic.sgxMpc.toFixed(3)),
      sgyMpc: Number(cosmic.supergalactic.sgyMpc.toFixed(3)),
      sgzMpc: Number(cosmic.supergalactic.sgzMpc.toFixed(3)),
    },
    lookbackTimeYears: cosmic.lookbackTimeYears,
  };
}

export const COSMIC_STRUCTURES_DATA: CosmicStructure[] = [
  // ==========================================
  // 1. GALAXY GROUPS
  // ==========================================
  {
    id: "cosmic-local-group",
    slug: "local-group",
    name: "Local Group of Galaxies",
    standardDesignation: "Local Group",
    aliases: ["Local Galaxy Group", "LG", "Milky Way-Andromeda Group"],
    type: "GALAXY_GROUP",
    summary:
      "Our home galaxy group containing over 80 galaxies spanning ~3 Mpc across, dominated by the Milky Way and Andromeda Galaxy.",
    description:
      "The Local Group is a gravitationally bound aggregation of over 80 known galaxies within a diameter of approximately 3 Megaparsecs (10 Million light-years). Its total gravitational mass is approximately (3.0 ± 0.6) × 10¹² M☉, with over 90% concentrated in the Milky Way and Andromeda subgroups. The group is situated on the inner edge of the Local Sheet within the Virgo Supercluster and is currently experiencing internal gravitational contraction rather than cosmic Hubble expansion.",
    coordinates: makeCoords(0.0, 0.0, 0.001, 0.0002, 0.0, 0.0),
    dimensions: {
      majorAxisMpc: { value: 3.0, unit: "Mpc" },
      minorAxisMpc: { value: 2.0, unit: "Mpc" },
      depthMpc: { value: 1.5, unit: "Mpc" },
      approximateVolumeMpc3: 9.4,
      characteristicRadiusMpc: 1.5,
    },
    physical: {
      estimatedMassSolar: {
        value: 3.0e12,
        uncertainty: { upper: 0.6e12, lower: 0.6e12 },
        unit: "M_sun",
      },
      galaxyCountEstimated: { value: 85, unit: "galaxies" },
      meanVelocityDispersionKmS: { value: 65, unit: "km/s" },
      densityContrastDelta: 45.0,
      centralDominantGalaxy: {
        name: "Andromeda Galaxy (M31)",
        slug: "andromeda-galaxy",
        catalogId: "Messier 31",
      },
    },
    geometry: {
      geometryType: "ELLIPSOID",
      boundingRadiusMpc: 1.8,
      ellipsoidRadiiMpc: { rxMpc: 1.5, ryMpc: 1.0, rzMpc: 0.8 },
      isModelDerived: false,
    },
    parentStructure: {
      slug: "local-sheet",
      name: "Local Sheet",
      relationshipType: "MEMBER",
      confidence: "CONFIRMED",
    },
    memberGalaxies: [
      { name: "Milky Way Galaxy", slug: "milky-way-galaxy", isPrimaryMember: true },
      {
        name: "Andromeda Galaxy",
        slug: "andromeda-galaxy",
        catalogId: "M31",
        isPrimaryMember: true,
      },
      {
        name: "Triangulum Galaxy",
        slug: "triangulum-galaxy",
        catalogId: "M33",
        isPrimaryMember: true,
      },
      { name: "Large Magellanic Cloud", slug: "large-magellanic-cloud", catalogId: "LMC" },
      { name: "Small Magellanic Cloud", slug: "small-magellanic-cloud", catalogId: "SMC" },
    ],
    observationStatus: "OBSERVED",
    geometryStatus: "OBSERVED",
    discovery: {
      discoveredBy: "Edwin Hubble",
      discoveryYear: 1936,
      catalogDesignation: "Local Group",
    },
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "NASA/IPAC Extragalactic Database (NED)",
      recordIdentifier: "McConnachie-2012-AJ-144-4",
      confidenceScore: 0.99,
      citationUrl: "https://doi.org/10.1088/0004-6256/144/1/4",
      retrievedAt: "2026-08-31T00:00:00Z",
    },
    scientificNotes:
      "Gravitationally bound system with negative internal Hubble flow (Andromeda is blueshifted towards Milky Way at -110 km/s).",
    uncertaintyCaveats:
      "Faint dwarf galaxy membership census is continually updated by deep wide-field surveys (DES, Gaia, Rubin).",
  },
  {
    id: "cosmic-m81-group",
    slug: "m81-group",
    name: "M81 Group",
    standardDesignation: "NGC 3031 Group",
    aliases: ["Bode's Galaxy Group", "Ursa Major Group"],
    type: "GALAXY_GROUP",
    summary:
      "Prominent galaxy group in Ursa Major located 3.63 Mpc from Earth, famous for strong tidal interactions between M81, M82, and NGC 3077.",
    description:
      "The M81 Group is one of the closest neighboring galaxy groups to the Local Group, centered around the large grand-design spiral Messier 81. Situated at a distance of 3.63 Megaparsecs (11.8 Mly), the group features spectacular neutral hydrogen (HI) tidal bridges connecting M81 with the starburst galaxy M82 and NGC 3077, generated by close gravitational encounters approximately 200-300 million years ago.",
    coordinates: makeCoords(148.888, 69.065, 3.63, 0.14, 0.00067, 201),
    dimensions: {
      majorAxisMpc: { value: 1.2, unit: "Mpc" },
      minorAxisMpc: { value: 0.9, unit: "Mpc" },
      approximateVolumeMpc3: 1.0,
      characteristicRadiusMpc: 0.6,
    },
    physical: {
      estimatedMassSolar: {
        value: 1.6e12,
        uncertainty: { upper: 0.3e12, lower: 0.3e12 },
        unit: "M_sun",
      },
      galaxyCountEstimated: { value: 34, unit: "galaxies" },
      meanVelocityDispersionKmS: { value: 110, unit: "km/s" },
      densityContrastDelta: 30.0,
      centralDominantGalaxy: { name: "Messier 81 (Bode's Galaxy)", catalogId: "NGC 3031" },
    },
    geometry: {
      geometryType: "ELLIPSOID",
      boundingRadiusMpc: 0.8,
      isModelDerived: false,
    },
    parentStructure: {
      slug: "local-sheet",
      name: "Local Sheet",
      relationshipType: "MEMBER",
      confidence: "CONFIRMED",
    },
    memberGalaxies: [
      { name: "Messier 81", catalogId: "NGC 3031", isPrimaryMember: true },
      { name: "Messier 82 (Cigar Galaxy)", catalogId: "NGC 3034", isPrimaryMember: true },
      { name: "NGC 3077", isPrimaryMember: true },
      { name: "NGC 2976" },
      { name: "IC 2574 (Coddington's Nebula)" },
    ],
    observationStatus: "OBSERVED",
    geometryStatus: "OBSERVED",
    discovery: {
      catalogDesignation: "LGG 197 / Karachentsev 2002",
      bibcode: "2002A&A...383..125K",
    },
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "NASA/IPAC Extragalactic Database (NED)",
      recordIdentifier: "Karachentsev-2005-AJ-129-178",
      confidenceScore: 0.98,
      citationUrl: "https://doi.org/10.1086/426368",
      retrievedAt: "2026-08-31T00:00:00Z",
    },
    scientificNotes:
      "HI radio observations reveal extensive neutral gas streamers resulting from high-velocity tidal collisions.",
    uncertaintyCaveats:
      "Distance constrained with high precision using TRGB standard candles on Hubble ACS data.",
  },
  {
    id: "cosmic-sculptor-group",
    slug: "sculptor-group",
    name: "Sculptor Group",
    standardDesignation: "South Polar Group",
    aliases: ["NGC 253 Group", "South Polar Filament Group"],
    type: "GALAXY_GROUP",
    summary:
      "Loose, elongated galaxy group centered on the starburst galaxy NGC 253 (Silver Coin) at a distance of 3.90 Mpc near the South Galactic Pole.",
    description:
      "The Sculptor Group is one of the closest groups of galaxies to the Local Group, located approximately 3.9 Megaparsecs (12.7 Mly) away toward the South Galactic Pole in the constellation Sculptor. Dominated by the bright starburst spiral NGC 253, the group is loosely bound and extended along a filamentary axis spanning nearly 2 Mpc.",
    coordinates: makeCoords(11.888, -25.286, 3.9, 0.2, 0.00075, 225),
    dimensions: {
      majorAxisMpc: { value: 1.8, unit: "Mpc" },
      minorAxisMpc: { value: 0.8, unit: "Mpc" },
      approximateVolumeMpc3: 1.2,
      characteristicRadiusMpc: 0.9,
    },
    physical: {
      estimatedMassSolar: {
        value: 1.4e12,
        uncertainty: { upper: 0.4e12, lower: 0.4e12 },
        unit: "M_sun",
      },
      galaxyCountEstimated: { value: 29, unit: "galaxies" },
      meanVelocityDispersionKmS: { value: 90, unit: "km/s" },
      centralDominantGalaxy: { name: "Sculptor Galaxy (Silver Coin)", catalogId: "NGC 253" },
    },
    geometry: {
      geometryType: "ELLIPSOID",
      boundingRadiusMpc: 1.1,
      isModelDerived: false,
    },
    parentStructure: {
      slug: "local-sheet",
      name: "Local Sheet",
      relationshipType: "MEMBER",
      confidence: "CONFIRMED",
    },
    memberGalaxies: [
      { name: "NGC 253 (Sculptor Galaxy)", isPrimaryMember: true },
      { name: "NGC 55", isPrimaryMember: true },
      { name: "NGC 247", isPrimaryMember: true },
      { name: "NGC 300" },
      { name: "NGC 7793" },
    ],
    observationStatus: "OBSERVED",
    geometryStatus: "OBSERVED",
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "NASA/IPAC Extragalactic Database (NED)",
      recordIdentifier: "Karachentsev-2003-AA-404-93",
      confidenceScore: 0.97,
      citationUrl: "https://doi.org/10.1051/0004-6361:20030170",
      retrievedAt: "2026-08-31T00:00:00Z",
    },
  },
  {
    id: "cosmic-maffei-group",
    slug: "maffei-group",
    name: "IC 342 / Maffei Group",
    standardDesignation: "Maffei 1 Group",
    aliases: ["IC 342 Group", "Zone of Avoidance Group"],
    type: "GALAXY_GROUP",
    summary:
      "Massive neighboring galaxy group located 3.4 Mpc away, heavily obscured behind the Milky Way's galactic dust plane (Zone of Avoidance).",
    description:
      "The IC 342 / Maffei Group is the closest galaxy group to the Local Group, situated at a distance of ~3.4 Megaparsecs (11.1 Mly). Because it lies almost directly in the plane of the Milky Way's disk, visual extinction by interstellar dust obscures much of its optical emission. The group is split into two primary subgroups around the intermediate spiral IC 342 and the giant elliptical galaxy Maffei 1.",
    coordinates: makeCoords(40.675, 59.45, 3.4, 0.3, 0.00095, 285),
    dimensions: {
      majorAxisMpc: { value: 1.5, unit: "Mpc" },
      approximateVolumeMpc3: 1.1,
      characteristicRadiusMpc: 0.8,
    },
    physical: {
      estimatedMassSolar: {
        value: 1.2e12,
        uncertainty: { upper: 0.3e12, lower: 0.3e12 },
        unit: "M_sun",
      },
      galaxyCountEstimated: { value: 20, unit: "galaxies" },
      centralDominantGalaxy: { name: "IC 342 (Hidden Galaxy)", catalogId: "IC 342" },
    },
    geometry: {
      geometryType: "ELLIPSOID",
      boundingRadiusMpc: 1.0,
      isModelDerived: false,
    },
    parentStructure: {
      slug: "local-sheet",
      name: "Local Sheet",
      relationshipType: "MEMBER",
      confidence: "CONFIRMED",
    },
    memberGalaxies: [
      { name: "IC 342 (Hidden Galaxy)", catalogId: "IC 342", isPrimaryMember: true },
      { name: "Maffei 1", catalogId: "UGCA 34", isPrimaryMember: true },
      { name: "Maffei 2", isPrimaryMember: true },
      { name: "Dwingeloo 1" },
    ],
    observationStatus: "OBSERVED",
    geometryStatus: "OBSERVED",
    discovery: { discoveredBy: "Paolo Maffei", discoveryYear: 1968 },
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "NASA/IPAC Extragalactic Database (NED)",
      recordIdentifier: "Karachentsev-2005-AJ-129-178",
      confidenceScore: 0.96,
      retrievedAt: "2026-08-31T00:00:00Z",
    },
  },
  {
    id: "cosmic-centaurus-a-group",
    slug: "centaurus-a-group",
    name: "Centaurus A / M83 Group",
    standardDesignation: "NGC 5128 Group",
    aliases: ["Centaurus A Group", "M83 Group", "LGG 344"],
    type: "GALAXY_GROUP",
    summary:
      "Prominent nearby galaxy group at 3.84 Mpc containing the peculiar radio galaxy Centaurus A and the grand-design spiral Messier 83.",
    description:
      "The Centaurus A / M83 Group is a complex, rich group in the Local Volume located 3.84 Megaparsecs (12.5 Mly) from Earth. It contains two distinct dynamic concentrations: one around the giant elliptical/lenticular radio galaxy Centaurus A (NGC 5128) and another around the starburst spiral M83 (Southern Pinwheel Galaxy).",
    coordinates: makeCoords(201.365, -43.019, 3.84, 0.18, 0.00183, 547),
    dimensions: {
      majorAxisMpc: { value: 1.6, unit: "Mpc" },
      approximateVolumeMpc3: 1.3,
      characteristicRadiusMpc: 0.8,
    },
    physical: {
      estimatedMassSolar: {
        value: 2.1e12,
        uncertainty: { upper: 0.5e12, lower: 0.5e12 },
        unit: "M_sun",
      },
      galaxyCountEstimated: { value: 44, unit: "galaxies" },
      meanVelocityDispersionKmS: { value: 125, unit: "km/s" },
      centralDominantGalaxy: { name: "Centaurus A", catalogId: "NGC 5128" },
    },
    geometry: {
      geometryType: "ELLIPSOID",
      boundingRadiusMpc: 1.0,
      isModelDerived: false,
    },
    parentStructure: {
      slug: "local-sheet",
      name: "Local Sheet",
      relationshipType: "MEMBER",
      confidence: "CONFIRMED",
    },
    memberGalaxies: [
      { name: "Centaurus A", catalogId: "NGC 5128", isPrimaryMember: true },
      { name: "Messier 83 (Southern Pinwheel)", catalogId: "NGC 5236", isPrimaryMember: true },
      { name: "NGC 5253" },
      { name: "NGC 4945" },
    ],
    observationStatus: "OBSERVED",
    geometryStatus: "OBSERVED",
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "NASA/IPAC Extragalactic Database (NED)",
      recordIdentifier: "Muller-2018-Science-359-534",
      confidenceScore: 0.98,
      citationUrl: "https://doi.org/10.1126/science.aao1858",
      retrievedAt: "2026-08-31T00:00:00Z",
    },
  },

  // ==========================================
  // 2. GALAXY CLUSTERS
  // ==========================================
  {
    id: "cosmic-virgo-cluster",
    slug: "virgo-cluster",
    name: "Virgo Cluster",
    standardDesignation: "Virgo Cluster / ACO V",
    aliases: ["Virgo Galaxy Cluster", "Local Supercluster Core"],
    type: "GALAXY_CLUSTER",
    summary:
      "The massive gravitational anchor of the Local Supercluster located 16.5 Mpc away, containing ~1,500-2,000 galaxies and the giant radio elliptical M87.",
    description:
      "The Virgo Cluster is the closest rich galaxy cluster to Earth, situated at a distance of 16.5 Megaparsecs (53.8 Mly) in the constellation Virgo. Containing between 1,500 and 2,000 confirmed member galaxies and embedded in an enormous halo of 30-million-kelvin X-ray emitting intracluster gas, Virgo exerts a substantial gravitational pull on the Local Group, inducing a peculiar infall velocity of ~220 km/s (Virgocentric infall). The central gravitational dominant is the giant cD elliptical galaxy Messier 87, home to a 6.5-billion-solar-mass supermassive black hole.",
    coordinates: makeCoords(187.706, 12.391, 16.5, 0.5, 0.0036, 1307),
    dimensions: {
      majorAxisMpc: { value: 4.4, unit: "Mpc" },
      minorAxisMpc: { value: 3.2, unit: "Mpc" },
      depthMpc: { value: 3.0, unit: "Mpc" },
      approximateVolumeMpc3: 22.0,
      characteristicRadiusMpc: 2.2,
    },
    physical: {
      estimatedMassSolar: {
        value: 1.2e15,
        uncertainty: { upper: 0.2e15, lower: 0.2e15 },
        unit: "M_sun",
      },
      galaxyCountEstimated: {
        value: 1800,
        uncertainty: { upper: 200, lower: 200 },
        unit: "galaxies",
      },
      richnessClass: "1",
      bautzMorganType: "III",
      meanVelocityDispersionKmS: {
        value: 750,
        uncertainty: { upper: 30, lower: 30 },
        unit: "km/s",
      },
      densityContrastDelta: 120.0,
      centralDominantGalaxy: { name: "Messier 87 (Virgo A)", catalogId: "NGC 4486" },
    },
    geometry: {
      geometryType: "ELLIPSOID",
      boundingRadiusMpc: 3.0,
      ellipsoidRadiiMpc: { rxMpc: 2.2, ryMpc: 1.8, rzMpc: 1.5 },
      isModelDerived: false,
    },
    parentStructure: {
      slug: "virgo-supercluster",
      name: "Virgo Supercluster",
      relationshipType: "SUBCLUSTER",
      confidence: "CONFIRMED",
    },
    memberGalaxies: [
      { name: "Messier 87 (Virgo A)", catalogId: "NGC 4486", isPrimaryMember: true },
      { name: "Messier 49", catalogId: "NGC 4472", isPrimaryMember: true },
      { name: "Messier 86", catalogId: "NGC 4406", isPrimaryMember: true },
      { name: "Messier 84", catalogId: "NGC 4374", isPrimaryMember: true },
      { name: "Messier 60", catalogId: "NGC 4649" },
      { name: "Messier 88", catalogId: "NGC 4501" },
    ],
    observationStatus: "OBSERVED",
    geometryStatus: "OBSERVED",
    discovery: {
      discoveredBy: "Charles Messier",
      discoveryYear: 1781,
      catalogDesignation: "Virgo Cluster",
    },
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "NASA/IPAC Extragalactic Database (NED)",
      recordIdentifier: "Mei-2007-ApJ-655-144",
      confidenceScore: 0.99,
      citationUrl: "https://doi.org/10.1086/509598",
      retrievedAt: "2026-08-31T00:00:00Z",
    },
    scientificNotes:
      "Virgocentric infall velocity (~220 km/s) offsets the apparent Hubble velocity from pure linear cosmic expansion.",
    uncertaintyCaveats:
      "Cluster has significant substructure (Subcluster A around M87, Subcluster B around M49, W and M clouds).",
  },
  {
    id: "cosmic-fornax-cluster",
    slug: "fornax-cluster",
    name: "Fornax Cluster",
    standardDesignation: "ACO S 373",
    aliases: ["Fornax Galaxy Cluster", "Fornax I Cluster"],
    type: "GALAXY_CLUSTER",
    summary:
      "Second richest galaxy cluster within 20 Mpc, located 19.0 Mpc from Earth, centered on the giant cD elliptical NGC 1399.",
    description:
      "The Fornax Cluster is a compact, dense galaxy cluster located 19.0 Megaparsecs (62.0 Mly) away in the southern constellation Fornax. Although less massive than the Virgo Cluster (~7 × 10¹³ M☉ vs 1.2 × 10¹⁵ M☉), its member galaxies are packed into a smaller volume, making it valuable for studying galaxy morphology evolution in dense environments.",
    coordinates: makeCoords(54.621, -35.451, 19.0, 0.8, 0.00475, 1424),
    dimensions: {
      majorAxisMpc: { value: 2.8, unit: "Mpc" },
      approximateVolumeMpc3: 6.5,
      characteristicRadiusMpc: 1.4,
    },
    physical: {
      estimatedMassSolar: {
        value: 7.0e13,
        uncertainty: { upper: 1.5e13, lower: 1.5e13 },
        unit: "M_sun",
      },
      galaxyCountEstimated: { value: 60, unit: "galaxies" },
      richnessClass: "0",
      meanVelocityDispersionKmS: { value: 370, unit: "km/s" },
      centralDominantGalaxy: { name: "NGC 1399", catalogId: "NGC 1399" },
    },
    geometry: {
      geometryType: "ELLIPSOID",
      boundingRadiusMpc: 1.6,
      isModelDerived: false,
    },
    parentStructure: {
      slug: "virgo-supercluster",
      name: "Virgo Supercluster",
      relationshipType: "SUBCLUSTER",
      confidence: "CONFIRMED",
    },
    memberGalaxies: [
      { name: "NGC 1399", isPrimaryMember: true },
      { name: "NGC 1316 (Fornax A)", isPrimaryMember: true },
      { name: "NGC 1365 (Great Barred Spiral)", isPrimaryMember: true },
      { name: "NGC 1404" },
    ],
    observationStatus: "OBSERVED",
    geometryStatus: "OBSERVED",
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "NASA/IPAC Extragalactic Database (NED)",
      recordIdentifier: "Drinkwater-2001-MNRAS-326-1076",
      confidenceScore: 0.98,
      retrievedAt: "2026-08-31T00:00:00Z",
    },
  },
  {
    id: "cosmic-coma-cluster",
    slug: "coma-cluster",
    name: "Coma Cluster",
    standardDesignation: "Abell 1656",
    aliases: ["ACO 1656", "Coma Galaxy Cluster"],
    type: "GALAXY_CLUSTER",
    summary:
      "The classic archetype of a rich, regular galaxy cluster at 99 Mpc containing over 1,000 large galaxies and the historical birthplace of the Dark Matter hypothesis.",
    description:
      "The Coma Cluster (Abell 1656) is a massive, highly virialized galaxy cluster located approximately 99 Megaparsecs (323 Mly) away in Coma Berenices. Containing thousands of identified galaxies dominated by two supergiant cD ellipticals (NGC 4889 and NGC 4874), Coma played a foundational role in modern astrophysics: in 1933, Fritz Zwicky used the virial theorem on the velocity dispersion of Coma's member galaxies (~1,000 km/s) to infer the existence of unseen 'dunkle Materie' (Dark Matter).",
    coordinates: makeCoords(194.953, 27.981, 99.0, 3.0, 0.0231, 6925),
    dimensions: {
      majorAxisMpc: { value: 6.0, unit: "Mpc" },
      minorAxisMpc: { value: 5.2, unit: "Mpc" },
      approximateVolumeMpc3: 110.0,
      characteristicRadiusMpc: 3.0,
    },
    physical: {
      estimatedMassSolar: {
        value: 2.0e15,
        uncertainty: { upper: 0.4e15, lower: 0.4e15 },
        unit: "M_sun",
      },
      galaxyCountEstimated: { value: 1200, unit: "galaxies" },
      richnessClass: "2",
      bautzMorganType: "II",
      meanVelocityDispersionKmS: {
        value: 1008,
        uncertainty: { upper: 35, lower: 35 },
        unit: "km/s",
      },
      densityContrastDelta: 350.0,
      centralDominantGalaxy: { name: "NGC 4889 (Coma A)", catalogId: "NGC 4889" },
    },
    geometry: {
      geometryType: "ELLIPSOID",
      boundingRadiusMpc: 4.5,
      ellipsoidRadiiMpc: { rxMpc: 3.0, ryMpc: 2.6, rzMpc: 2.6 },
      isModelDerived: false,
    },
    parentStructure: {
      slug: "cfa2-great-wall",
      name: "CfA2 Great Wall",
      relationshipType: "CORE_CLUSTER",
      confidence: "CONFIRMED",
    },
    memberGalaxies: [
      { name: "NGC 4889", catalogId: "NGC 4889", isPrimaryMember: true },
      { name: "NGC 4874", catalogId: "NGC 4874", isPrimaryMember: true },
      { name: "NGC 4839" },
      { name: "NGC 4921" },
    ],
    observationStatus: "OBSERVED",
    geometryStatus: "OBSERVED",
    discovery: {
      discoveredBy: "George Abell",
      discoveryYear: 1958,
      catalogDesignation: "Abell 1656",
    },
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "NASA/IPAC Extragalactic Database (NED)",
      recordIdentifier: "Colless-1996-ApJ-458-435",
      confidenceScore: 0.99,
      citationUrl: "https://doi.org/10.1086/176827",
      retrievedAt: "2026-08-31T00:00:00Z",
    },
    scientificNotes:
      "Fritz Zwicky's 1933 discovery of dark matter was based on measuring velocity dispersion in Coma.",
  },
  {
    id: "cosmic-perseus-cluster",
    slug: "perseus-cluster",
    name: "Perseus Cluster",
    standardDesignation: "Abell 426",
    aliases: ["ACO 426", "Perseus A Cluster"],
    type: "GALAXY_CLUSTER",
    summary:
      "Brightest X-ray galaxy cluster in the sky at 73.6 Mpc, centered on the active radio galaxy NGC 1275 with famous sound waves oscillating in its intracluster medium.",
    description:
      "The Perseus Cluster (Abell 426) is one of the most massive structures in the nearby Universe, located 73.6 Megaparsecs (240 Mly) away. As the brightest cluster in the sky in the X-ray spectrum, Perseus contains thousands of galaxies embedded in a vast gas cloud at tens of millions of degrees. In 2003, Chandra X-ray observations detected concentric acoustic pressure waves (sound waves 57 octaves below middle C) rippling outward from the supermassive black hole in central galaxy NGC 1275.",
    coordinates: makeCoords(49.95, 41.512, 73.6, 2.5, 0.0179, 5366),
    dimensions: {
      majorAxisMpc: { value: 5.2, unit: "Mpc" },
      approximateVolumeMpc3: 75.0,
      characteristicRadiusMpc: 2.6,
    },
    physical: {
      estimatedMassSolar: {
        value: 1.2e15,
        uncertainty: { upper: 0.3e15, lower: 0.3e15 },
        unit: "M_sun",
      },
      galaxyCountEstimated: { value: 550, unit: "galaxies" },
      richnessClass: "2",
      meanVelocityDispersionKmS: { value: 1280, unit: "km/s" },
      centralDominantGalaxy: { name: "NGC 1275 (Perseus A)", catalogId: "NGC 1275" },
    },
    geometry: {
      geometryType: "ELLIPSOID",
      boundingRadiusMpc: 3.5,
      isModelDerived: false,
    },
    parentStructure: {
      slug: "perseus-pisces-supercluster",
      name: "Perseus-Pisces Supercluster",
      relationshipType: "CORE_CLUSTER",
      confidence: "CONFIRMED",
    },
    memberGalaxies: [
      { name: "NGC 1275 (Perseus A)", catalogId: "NGC 1275", isPrimaryMember: true },
      { name: "NGC 1272", isPrimaryMember: true },
      { name: "NGC 1265" },
    ],
    observationStatus: "OBSERVED",
    geometryStatus: "OBSERVED",
    discovery: {
      discoveredBy: "George Abell",
      discoveryYear: 1958,
      catalogDesignation: "Abell 426",
    },
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "NASA/IPAC Extragalactic Database (NED)",
      recordIdentifier: "Fabian-2003-MNRAS-344-L43",
      confidenceScore: 0.99,
      citationUrl: "https://doi.org/10.1046/j.1365-8711.2003.06902.x",
      retrievedAt: "2026-08-31T00:00:00Z",
    },
  },
  {
    id: "cosmic-centaurus-cluster",
    slug: "centaurus-cluster",
    name: "Centaurus Cluster",
    standardDesignation: "Abell 3526",
    aliases: ["ACO 3526", "Great Attractor Core Cluster"],
    type: "GALAXY_CLUSTER",
    summary:
      "Core galaxy cluster of the Hydra-Centaurus Supercluster at 49.5 Mpc, acting as a major gravitational component of the Great Attractor.",
    description:
      "The Centaurus Cluster (Abell 3526) is a rich galaxy cluster located 49.5 Megaparsecs (161 Mly) away in the constellation Centaurus. It comprises two distinct velocity components (Cen30 around NGC 4696 and Cen45 around NGC 4709) merging in real time. Centaurus forms the central gravitational nexus of the Great Attractor overdensity.",
    coordinates: makeCoords(192.203, -41.312, 49.5, 2.0, 0.0114, 3418),
    dimensions: {
      majorAxisMpc: { value: 4.0, unit: "Mpc" },
      approximateVolumeMpc3: 33.0,
      characteristicRadiusMpc: 2.0,
    },
    physical: {
      estimatedMassSolar: {
        value: 6.0e14,
        uncertainty: { upper: 1.2e14, lower: 1.2e14 },
        unit: "M_sun",
      },
      galaxyCountEstimated: { value: 300, unit: "galaxies" },
      richnessClass: "0",
      meanVelocityDispersionKmS: { value: 850, unit: "km/s" },
      centralDominantGalaxy: { name: "NGC 4696", catalogId: "NGC 4696" },
    },
    geometry: {
      geometryType: "ELLIPSOID",
      boundingRadiusMpc: 2.5,
      isModelDerived: false,
    },
    parentStructure: {
      slug: "laniakea-supercluster",
      name: "Laniakea Supercluster",
      relationshipType: "SUBCLUSTER",
      confidence: "CONFIRMED",
    },
    memberGalaxies: [
      { name: "NGC 4696", isPrimaryMember: true },
      { name: "NGC 4709", isPrimaryMember: true },
    ],
    observationStatus: "OBSERVED",
    geometryStatus: "OBSERVED",
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "NASA/IPAC Extragalactic Database (NED)",
      recordIdentifier: "Lucey-1986-MNRAS-222-427",
      confidenceScore: 0.98,
      retrievedAt: "2026-08-31T00:00:00Z",
    },
  },
  {
    id: "cosmic-hydra-cluster",
    slug: "hydra-cluster",
    name: "Hydra Cluster",
    standardDesignation: "Abell 1060",
    aliases: ["ACO 1060", "Hydra I Cluster"],
    type: "GALAXY_CLUSTER",
    summary:
      "Large, regular galaxy cluster located 58.0 Mpc away in Hydra, forming the northern component of the Hydra-Centaurus Supercluster.",
    description:
      "The Hydra Cluster (Abell 1060) is a major cluster of galaxies located 58.0 Megaparsecs (189 Mly) away, centered around dominant giant ellipticals NGC 3311 and NGC 3309.",
    coordinates: makeCoords(159.175, -27.528, 58.0, 2.5, 0.0126, 3777),
    dimensions: {
      majorAxisMpc: { value: 3.8, unit: "Mpc" },
      approximateVolumeMpc3: 28.0,
      characteristicRadiusMpc: 1.9,
    },
    physical: {
      estimatedMassSolar: {
        value: 3.5e14,
        uncertainty: { upper: 0.8e14, lower: 0.8e14 },
        unit: "M_sun",
      },
      galaxyCountEstimated: { value: 150, unit: "galaxies" },
      richnessClass: "1",
      meanVelocityDispersionKmS: { value: 724, unit: "km/s" },
      centralDominantGalaxy: { name: "NGC 3311" },
    },
    geometry: {
      geometryType: "ELLIPSOID",
      boundingRadiusMpc: 2.2,
      isModelDerived: false,
    },
    parentStructure: {
      slug: "laniakea-supercluster",
      name: "Laniakea Supercluster",
      relationshipType: "SUBCLUSTER",
      confidence: "CONFIRMED",
    },
    memberGalaxies: [
      { name: "NGC 3311", isPrimaryMember: true },
      { name: "NGC 3309", isPrimaryMember: true },
      { name: "NGC 3312" },
    ],
    observationStatus: "OBSERVED",
    geometryStatus: "OBSERVED",
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "NASA/IPAC Extragalactic Database (NED)",
      recordIdentifier: "Richter-1989-AAS-67-237",
      confidenceScore: 0.97,
      retrievedAt: "2026-08-31T00:00:00Z",
    },
  },

  // ==========================================
  // 3. SUPERCLUSTERS
  // ==========================================
  {
    id: "cosmic-virgo-supercluster",
    slug: "virgo-supercluster",
    name: "Virgo Supercluster",
    standardDesignation: "Local Supercluster (LSC)",
    aliases: ["Local Supercluster", "Virgo SC"],
    type: "SUPERCLUSTER",
    summary:
      "Our home supercluster spanning ~33 Mpc across, containing the Virgo Cluster at its core and the Local Group on its outskirts.",
    description:
      "The Virgo Supercluster (Local Supercluster) is a massive concentration of galaxy clusters and groups spanning approximately 33 Megaparsecs (107 Mly) with a total mass of roughly 10¹⁵ M☉. It encompasses the Virgo Cluster at its gravitational center, along with ~100 other galaxy groups and clusters including the Local Group, Fornax Cluster, and Canes Venatici groups. Originally identified by Gérard de Vaucouleurs in 1953, modern velocity-field studies (Tully et al. 2014) demonstrate that the Virgo Supercluster is a lobe or tributary within the vastly larger Laniakea Supercluster.",
    coordinates: makeCoords(187.706, 12.391, 16.5, 2.0, 0.0036, 1307),
    dimensions: {
      majorAxisMpc: { value: 33.0, unit: "Mpc" },
      minorAxisMpc: { value: 20.0, unit: "Mpc" },
      depthMpc: { value: 7.0, unit: "Mpc" },
      approximateVolumeMpc3: 2400.0,
      characteristicRadiusMpc: 16.5,
    },
    physical: {
      estimatedMassSolar: {
        value: 1.0e15,
        uncertainty: { upper: 0.3e15, lower: 0.3e15 },
        unit: "M_sun",
      },
      galaxyCountEstimated: { value: 2500, unit: "galaxies" },
      densityContrastDelta: 4.0,
      centralDominantGalaxy: {
        name: "Messier 87 in Virgo Core",
        slug: "andromeda-galaxy",
        catalogId: "M87",
      },
    },
    geometry: {
      geometryType: "PLANAR_SLAB",
      boundingRadiusMpc: 18.0,
      ellipsoidRadiiMpc: { rxMpc: 16.5, ryMpc: 10.0, rzMpc: 3.5 },
      planarNormal: { x: 0.0, y: 0.0, z: 1.0 },
      isModelDerived: false,
    },
    parentStructure: {
      slug: "laniakea-supercluster",
      name: "Laniakea Supercluster",
      relationshipType: "PART_OF",
      confidence: "CONFIRMED",
    },
    memberStructures: [
      {
        slug: "virgo-cluster",
        name: "Virgo Cluster",
        structureType: "GALAXY_CLUSTER",
        relationshipType: "SUBCLUSTER",
      },
      {
        slug: "fornax-cluster",
        name: "Fornax Cluster",
        structureType: "GALAXY_CLUSTER",
        relationshipType: "SUBCLUSTER",
      },
      {
        slug: "local-sheet",
        name: "Local Sheet",
        structureType: "SHEET",
        relationshipType: "MEMBER",
      },
      {
        slug: "local-group",
        name: "Local Group",
        structureType: "GALAXY_GROUP",
        relationshipType: "MEMBER",
      },
    ],
    observationStatus: "OBSERVED",
    geometryStatus: "OBSERVED",
    discovery: {
      discoveredBy: "Gérard de Vaucouleurs",
      discoveryYear: 1953,
      catalogDesignation: "Local Supercluster",
    },
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "NASA/IPAC Extragalactic Database (NED)",
      recordIdentifier: "deVaucouleurs-1953-AJ-58-30",
      confidenceScore: 0.99,
      citationUrl: "https://doi.org/10.1086/106805",
      retrievedAt: "2026-08-31T00:00:00Z",
    },
    scientificNotes:
      "Historically defined as an independent supercluster; now recognized as a sub-basin within Laniakea.",
  },
  {
    id: "cosmic-laniakea-supercluster",
    slug: "laniakea-supercluster",
    name: "Laniakea Supercluster",
    standardDesignation: "Laniakea",
    aliases: ["Laniakea Supercluster of Galaxies", "Hawaiian 'Immense Heaven'"],
    type: "SUPERCLUSTER",
    summary:
      "The immense gravitational watershed basin spanning 160 Mpc (520 Mly) and 10¹⁷ M☉, defining the coherent peculiar velocity flow of 100,000 galaxies towards the Great Attractor.",
    description:
      "Laniakea (Hawaiian for 'immense heaven') is the enormous basin of gravitational attraction containing the Milky Way, Local Group, Virgo Supercluster, Hydra-Centaurus Supercluster, and Pavo-Indus Supercluster. Defined in 2014 by R. Brent Tully and colleagues using the Cosmicflows-2 database of galaxy peculiar velocities, Laniakea is bounded by the surface where the velocity streamlines of galaxies diverge into adjacent basins (such as the Perseus-Pisces Supercluster). It spans 160 Megaparsecs (520 Million light-years) in diameter and contains approximately 100,000 galaxies with a combined mass of 10¹⁷ M☉.",
    coordinates: makeCoords(192.203, -41.312, 75.0, 15.0, 0.015, 4500),
    dimensions: {
      majorAxisMpc: { value: 160.0, uncertainty: { upper: 20.0, lower: 20.0 }, unit: "Mpc" },
      minorAxisMpc: { value: 120.0, unit: "Mpc" },
      depthMpc: { value: 100.0, unit: "Mpc" },
      approximateVolumeMpc3: 1000000.0,
      characteristicRadiusMpc: 80.0,
    },
    physical: {
      estimatedMassSolar: {
        value: 1.0e17,
        uncertainty: { upper: 0.3e17, lower: 0.3e17 },
        unit: "M_sun",
      },
      galaxyCountEstimated: { value: 100000, unit: "galaxies" },
      densityContrastDelta: 1.8,
      centralDominantGalaxy: {
        name: "Great Attractor / Centaurus Cluster",
        catalogId: "Abell 3526",
      },
    },
    geometry: {
      geometryType: "IRREGULAR_HULL",
      boundingRadiusMpc: 85.0,
      ellipsoidRadiiMpc: { rxMpc: 80.0, ryMpc: 60.0, rzMpc: 50.0 },
      isModelDerived: true,
      notes:
        "Boundary defined by the zero-velocity divergence watershed boundary of peculiar velocity streamlines.",
    },
    memberStructures: [
      {
        slug: "virgo-supercluster",
        name: "Virgo Supercluster",
        structureType: "SUPERCLUSTER",
        relationshipType: "PART_OF",
      },
      {
        slug: "centaurus-cluster",
        name: "Centaurus Cluster",
        structureType: "GALAXY_CLUSTER",
        relationshipType: "MEMBER",
      },
      {
        slug: "hydra-cluster",
        name: "Hydra Cluster",
        structureType: "GALAXY_CLUSTER",
        relationshipType: "MEMBER",
      },
      { slug: "local-void", name: "Local Void", structureType: "VOID", relationshipType: "NEAR" },
    ],
    observationStatus: "MODEL_DERIVED",
    geometryStatus: "MODEL_DERIVED",
    discovery: {
      discoveredBy: "R. Brent Tully, Hélène Courtois, Yehuda Hoffman, Daniel Pomarède",
      discoveryYear: 2014,
      catalogDesignation: "Tully 2014 / Cosmicflows-2",
    },
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "Nature / Cosmicflows Project",
      recordIdentifier: "Tully-2014-Nature-513-71",
      confidenceScore: 0.98,
      citationUrl: "https://doi.org/10.1038/nature13674",
      retrievedAt: "2026-08-31T00:00:00Z",
    },
    scientificNotes:
      "Unlike gravitationally bound galaxy clusters, Laniakea will not collapse into a single entity due to cosmological dark energy expansion.",
    uncertaintyCaveats:
      "Boundary is dynamic and velocity-field model dependent; future data from Cosmicflows-4 may adjust the watershed divider.",
  },
  {
    id: "cosmic-shapley-supercluster",
    slug: "shapley-supercluster",
    name: "Shapley Supercluster",
    standardDesignation: "Shapley Concentration (SCl 124)",
    aliases: ["Shapley Concentration", "Abell 3558 Complex"],
    type: "SUPERCLUSTER",
    summary:
      "The most massive cosmic mass overdensity in the local Universe at 200 Mpc, exerting a major gravitational pull on the entire Laniakea Supercluster.",
    description:
      "The Shapley Supercluster (Shapley Concentration) is the largest known concentration of gravitationally interacting galaxy clusters in the local Universe within z < 0.1. Located approximately 200 Megaparsecs (652 Mly) away in the constellation Centaurus, it contains over 25 Abell galaxy clusters and a total mass exceeding 10¹⁶ M☉. Along with the Dipole Repeller, Shapley accounts for the CMB dipole motion of the Local Group (~627 km/s).",
    coordinates: makeCoords(201.75, -31.5, 200.0, 10.0, 0.046, 13800),
    dimensions: {
      majorAxisMpc: { value: 65.0, unit: "Mpc" },
      minorAxisMpc: { value: 40.0, unit: "Mpc" },
      approximateVolumeMpc3: 55000.0,
      characteristicRadiusMpc: 32.5,
    },
    physical: {
      estimatedMassSolar: {
        value: 1.0e16,
        uncertainty: { upper: 0.3e16, lower: 0.3e16 },
        unit: "M_sun",
      },
      galaxyCountEstimated: { value: 8000, unit: "galaxies" },
      densityContrastDelta: 5.5,
      centralDominantGalaxy: { name: "Abell 3558 Core", catalogId: "ACO 3558" },
    },
    geometry: {
      geometryType: "ELLIPSOID",
      boundingRadiusMpc: 35.0,
      isModelDerived: false,
    },
    observationStatus: "OBSERVED",
    geometryStatus: "OBSERVED",
    discovery: { discoveredBy: "Harlow Shapley", discoveryYear: 1930 },
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "NASA/IPAC Extragalactic Database (NED)",
      recordIdentifier: "Raychaudhury-1989-Nature-342-251",
      confidenceScore: 0.97,
      citationUrl: "https://doi.org/10.1038/342251a0",
      retrievedAt: "2026-08-31T00:00:00Z",
    },
  },
  {
    id: "cosmic-perseus-pisces-supercluster",
    slug: "perseus-pisces-supercluster",
    name: "Perseus-Pisces Supercluster",
    standardDesignation: "SCl 40",
    aliases: ["Perseus-Pisces Filament Supercluster"],
    type: "SUPERCLUSTER",
    summary:
      "Prominent chain-like supercluster spanning ~90 Mpc at a distance of 76 Mpc, forming one of the major boundaries of the Local Void.",
    description:
      "The Perseus-Pisces Supercluster is one of the most luminous and densely populated superclusters in the nearby Universe, located 76 Megaparsecs (250 Mly) away. Spanning a 90-Mpc filamentary arc across Pisces and Perseus, it bounds the Local Void opposite to Laniakea.",
    coordinates: makeCoords(22.5, 36.0, 76.0, 4.0, 0.018, 5400),
    dimensions: {
      majorAxisMpc: { value: 90.0, unit: "Mpc" },
      minorAxisMpc: { value: 25.0, unit: "Mpc" },
      approximateVolumeMpc3: 30000.0,
      characteristicRadiusMpc: 45.0,
    },
    physical: {
      estimatedMassSolar: {
        value: 5.0e15,
        uncertainty: { upper: 1.0e15, lower: 1.0e15 },
        unit: "M_sun",
      },
      galaxyCountEstimated: { value: 4500, unit: "galaxies" },
    },
    geometry: {
      geometryType: "CYLINDRICAL_TUBE",
      boundingRadiusMpc: 48.0,
      isModelDerived: false,
    },
    memberStructures: [
      {
        slug: "perseus-cluster",
        name: "Perseus Cluster (Abell 426)",
        structureType: "GALAXY_CLUSTER",
        relationshipType: "SUBCLUSTER",
      },
    ],
    observationStatus: "OBSERVED",
    geometryStatus: "OBSERVED",
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "NASA/IPAC Extragalactic Database (NED)",
      recordIdentifier: "Giovanelli-1985-AJ-90-2445",
      confidenceScore: 0.98,
      retrievedAt: "2026-08-31T00:00:00Z",
    },
  },

  // ==========================================
  // 4. COSMIC VOIDS
  // ==========================================
  {
    id: "cosmic-local-void",
    slug: "local-void",
    name: "Local Void",
    standardDesignation: "Local Void",
    aliases: ["Tully Void", "Tully-Fisher Void"],
    type: "VOID",
    summary:
      "Vast underdense cosmic void directly adjacent to the Local Group, spanning ~60 Mpc and exerting a strong gravitational repulsion on the Local Sheet.",
    description:
      "The Local Void is a massive, extremely underdense region of space situated directly adjacent to the Milky Way and Local Sheet, beginning at the outer boundary of the Local Group and extending at least 60 Megaparsecs (195 Mly) in diameter. Discovered by R. Brent Tully and J. Richard Fisher in 1987, the mass deficit in the Local Void acts as an effective gravitational repeller, pushing the Local Sheet away from the void center at approximately 260 km/s.",
    coordinates: makeCoords(280.0, 18.0, 22.0, 5.0, 0.0051, 1530),
    dimensions: {
      majorAxisMpc: { value: 60.0, unit: "Mpc" },
      minorAxisMpc: { value: 45.0, unit: "Mpc" },
      approximateVolumeMpc3: 85000.0,
      characteristicRadiusMpc: 30.0,
    },
    physical: {
      densityContrastDelta: -0.85,
      galaxyCountEstimated: { value: 12, unit: "galaxies" },
    },
    geometry: {
      geometryType: "ELLIPSOID",
      boundingRadiusMpc: 32.0,
      ellipsoidRadiiMpc: { rxMpc: 30.0, ryMpc: 25.0, rzMpc: 22.0 },
      isModelDerived: true,
    },
    parentStructure: {
      slug: "laniakea-supercluster",
      name: "Laniakea Supercluster",
      relationshipType: "NEAR",
      confidence: "CONFIRMED",
    },
    observationStatus: "INFERRED",
    geometryStatus: "MODEL_DERIVED",
    discovery: { discoveredBy: "R. Brent Tully & J. Richard Fisher", discoveryYear: 1987 },
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "Nearby Galaxies Atlas",
      recordIdentifier: "Tully-2019-ApJ-880-24",
      confidenceScore: 0.98,
      citationUrl: "https://doi.org/10.3847/1538-4357/ab2597",
      retrievedAt: "2026-08-31T00:00:00Z",
    },
    scientificNotes:
      "The Local Void's mass deficit acts as a kinematic repeller driving the motion of our Local Sheet.",
  },
  {
    id: "cosmic-bootes-void",
    slug: "bootes-void",
    name: "Boötes Void",
    standardDesignation: "The Great Nothing",
    aliases: ["Great Void", "Boötes Supervoid"],
    type: "VOID",
    summary:
      "Famous colossal spherical void spanning ~100 Mpc (330 Mly) across in Boötes, containing almost no galaxies in over 500,000 cubic megaparsecs.",
    description:
      "The Boötes Void (popularly known as 'The Great Nothing') is a gigantic, approximately spherical cosmic void located 215 Megaparsecs (700 Mly) away in the constellation Boötes. Spanning roughly 100 Megaparsecs (330 Million light-years) in diameter, it is one of the largest voids known in the Universe. In a volume of space that would ordinarily contain ~10,000 galaxies, astronomers have identified only ~60 isolated galaxies, mostly distributed along a faint internal filament.",
    coordinates: makeCoords(218.0, 46.0, 215.0, 15.0, 0.052, 15600),
    dimensions: {
      majorAxisMpc: { value: 100.0, unit: "Mpc" },
      minorAxisMpc: { value: 95.0, unit: "Mpc" },
      approximateVolumeMpc3: 520000.0,
      characteristicRadiusMpc: 50.0,
    },
    physical: {
      densityContrastDelta: -0.92,
      galaxyCountEstimated: { value: 60, unit: "galaxies" },
    },
    geometry: {
      geometryType: "ELLIPSOID",
      boundingRadiusMpc: 52.0,
      ellipsoidRadiiMpc: { rxMpc: 50.0, ryMpc: 48.0, rzMpc: 48.0 },
      isModelDerived: false,
    },
    observationStatus: "OBSERVED",
    geometryStatus: "OBSERVED",
    discovery: {
      discoveredBy: "Robert Kirshner, Augustus Oemler, Paul Schechter, Stephen Shectman",
      discoveryYear: 1981,
    },
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "NASA/IPAC Extragalactic Database (NED)",
      recordIdentifier: "Kirshner-1981-ApJ-248-L57",
      confidenceScore: 0.98,
      citationUrl: "https://doi.org/10.1086/183623",
      retrievedAt: "2026-08-31T00:00:00Z",
    },
  },

  // ==========================================
  // 5. FILAMENTS, WALLS & SHEETS
  // ==========================================
  {
    id: "cosmic-local-sheet",
    slug: "local-sheet",
    name: "Local Sheet",
    standardDesignation: "Local Sheet Wall",
    aliases: ["Local Flat Wall", "Local Pancake"],
    type: "SHEET",
    summary:
      "Thin, flattened planar structure spanning ~14 Mpc containing the Local Group, M81, Sculptor, and Maffei groups with exceptionally low velocity dispersion.",
    description:
      "The Local Sheet is a planar galactic structure spanning approximately 14 Megaparsecs (45 Mly) across but only ~1.5 Megaparsecs thick. It encompasses the Local Group and major nearby groups (M81, Sculptor, Maffei, Centaurus A). Galaxies within the Local Sheet share remarkably similar peculiar velocities with an internal velocity dispersion of only ~40 km/s.",
    coordinates: makeCoords(0.0, 0.0, 0.001, 0.0001, 0.0, 0.0),
    dimensions: {
      majorAxisMpc: { value: 14.0, unit: "Mpc" },
      minorAxisMpc: { value: 12.0, unit: "Mpc" },
      depthMpc: { value: 1.5, unit: "Mpc" },
      approximateVolumeMpc3: 200.0,
      characteristicRadiusMpc: 7.0,
    },
    physical: {
      estimatedMassSolar: { value: 2.0e13, unit: "M_sun" },
      galaxyCountEstimated: { value: 200, unit: "galaxies" },
      meanVelocityDispersionKmS: { value: 40, unit: "km/s" },
    },
    geometry: {
      geometryType: "PLANAR_SLAB",
      boundingRadiusMpc: 7.5,
      ellipsoidRadiiMpc: { rxMpc: 7.0, ryMpc: 6.0, rzMpc: 0.8 },
      planarNormal: { x: 0.0, y: 0.0, z: 1.0 },
      isModelDerived: false,
    },
    parentStructure: {
      slug: "virgo-supercluster",
      name: "Virgo Supercluster",
      relationshipType: "PART_OF",
      confidence: "CONFIRMED",
    },
    memberStructures: [
      {
        slug: "local-group",
        name: "Local Group",
        structureType: "GALAXY_GROUP",
        relationshipType: "MEMBER",
      },
      {
        slug: "m81-group",
        name: "M81 Group",
        structureType: "GALAXY_GROUP",
        relationshipType: "MEMBER",
      },
      {
        slug: "sculptor-group",
        name: "Sculptor Group",
        structureType: "GALAXY_GROUP",
        relationshipType: "MEMBER",
      },
      {
        slug: "maffei-group",
        name: "Maffei Group",
        structureType: "GALAXY_GROUP",
        relationshipType: "MEMBER",
      },
      {
        slug: "centaurus-a-group",
        name: "Centaurus A Group",
        structureType: "GALAXY_GROUP",
        relationshipType: "MEMBER",
      },
    ],
    observationStatus: "OBSERVED",
    geometryStatus: "OBSERVED",
    discovery: { discoveredBy: "R. Brent Tully", discoveryYear: 2008 },
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "Nearby Galaxies Atlas",
      recordIdentifier: "Tully-2008-ApJ-676-184",
      confidenceScore: 0.98,
      citationUrl: "https://doi.org/10.1086/527428",
      retrievedAt: "2026-08-31T00:00:00Z",
    },
  },
  {
    id: "cosmic-virgo-filament",
    slug: "virgo-filament",
    name: "Virgo Filament",
    standardDesignation: "Virgo-Local Group Filament",
    aliases: ["Local Filament", "Virgo Bridge"],
    type: "FILAMENT",
    summary:
      "Curvilinear cosmic filament bridging the Local Group and Local Sheet directly into the core of the Virgo Cluster.",
    description:
      "The Virgo Filament is a cosmic thread of dark matter and dwarf galaxies extending from the Local Group and Local Sheet across 16.5 Megaparsecs into the heart of the Virgo Cluster.",
    coordinates: makeCoords(187.706 / 2, 12.391 / 2, 8.25, 1.5, 0.0018, 650),
    dimensions: {
      majorAxisMpc: { value: 16.5, unit: "Mpc" },
      minorAxisMpc: { value: 2.0, unit: "Mpc" },
      approximateVolumeMpc3: 50.0,
      characteristicRadiusMpc: 8.5,
    },
    physical: {
      estimatedMassSolar: { value: 1.0e14, unit: "M_sun" },
    },
    geometry: {
      geometryType: "CYLINDRICAL_TUBE",
      boundingRadiusMpc: 9.0,
      spinePath: [
        { xMpc: 0.0, yMpc: 0.0, zMpc: 0.0, thicknessMpc: 1.5 },
        { xMpc: -1.2, yMpc: 3.5, zMpc: 4.0, thicknessMpc: 1.8 },
        { xMpc: -2.5, yMpc: 7.3, zMpc: 8.5, thicknessMpc: 2.0 },
        { xMpc: -3.8, yMpc: 11.2, zMpc: 14.5, thicknessMpc: 2.2 },
      ],
      isModelDerived: true,
    },
    parentStructure: {
      slug: "virgo-supercluster",
      name: "Virgo Supercluster",
      relationshipType: "PART_OF",
      confidence: "CONFIRMED",
    },
    observationStatus: "MODEL_DERIVED",
    geometryStatus: "MODEL_DERIVED",
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "Cosmicflows / Literature",
      recordIdentifier: "Courtois-2013-AJ-146-69",
      confidenceScore: 0.95,
      retrievedAt: "2026-08-31T00:00:00Z",
    },
  },
  {
    id: "cosmic-cfa2-great-wall",
    slug: "cfa2-great-wall",
    name: "CfA2 Great Wall",
    standardDesignation: "Coma Wall",
    aliases: ["Great Wall", "Geller-Huchra Great Wall"],
    type: "WALL",
    summary:
      "Colossal planar filament of galaxies spanning 230 Mpc (750 Mly) discovered in 1989 by Margaret Geller and John Huchra.",
    description:
      "The CfA2 Great Wall (Coma Wall) is a monumental sheet-like cosmic filament of galaxies discovered in 1989 by Margaret Geller and John Huchra at the Harvard-Smithsonian Center for Astrophysics. Located ~100 Megaparsecs away, it spans at least 230 Megaparsecs (750 Million light-years) in length, 90 Megaparsecs in height, and only 5 Megaparsecs in thickness.",
    coordinates: makeCoords(194.953, 27.981, 100.0, 5.0, 0.024, 7200),
    dimensions: {
      majorAxisMpc: { value: 230.0, unit: "Mpc" },
      minorAxisMpc: { value: 90.0, unit: "Mpc" },
      depthMpc: { value: 5.0, unit: "Mpc" },
      approximateVolumeMpc3: 100000.0,
      characteristicRadiusMpc: 115.0,
    },
    physical: {
      estimatedMassSolar: { value: 1.0e16, unit: "M_sun" },
      galaxyCountEstimated: { value: 15000, unit: "galaxies" },
      centralDominantGalaxy: { name: "Coma Cluster (Abell 1656)", catalogId: "Abell 1656" },
    },
    geometry: {
      geometryType: "PLANAR_SLAB",
      boundingRadiusMpc: 120.0,
      ellipsoidRadiiMpc: { rxMpc: 115.0, ryMpc: 45.0, rzMpc: 5.0 },
      isModelDerived: false,
    },
    memberStructures: [
      {
        slug: "coma-cluster",
        name: "Coma Cluster (Abell 1656)",
        structureType: "GALAXY_CLUSTER",
        relationshipType: "CORE_CLUSTER",
      },
    ],
    observationStatus: "OBSERVED",
    geometryStatus: "OBSERVED",
    discovery: { discoveredBy: "Margaret Geller & John Huchra", discoveryYear: 1989 },
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "CfA Redshift Survey",
      recordIdentifier: "Geller-1989-Science-246-897",
      confidenceScore: 0.99,
      citationUrl: "https://doi.org/10.1126/science.246.4932.897",
      retrievedAt: "2026-08-31T00:00:00Z",
    },
  },
  {
    id: "cosmic-sloan-great-wall",
    slug: "sloan-great-wall",
    name: "Sloan Great Wall",
    standardDesignation: "SGW",
    aliases: ["Sloan Wall", "SDSS Great Wall"],
    type: "WALL",
    summary:
      "Giant cosmic wall of galaxies spanning 430 Mpc (1.4 Billion ly) discovered by SDSS in 2003, one of the largest structures in the observable Universe.",
    description:
      "The Sloan Great Wall is a colossal cosmic wall of galaxies discovered in 2003 by J. Richard Gott III and colleagues using Sloan Digital Sky Survey (SDSS) data. Located approximately 300 Megaparsecs (~1 Billion light-years) away, it spans roughly 433 Megaparsecs (1.38 Billion light-years) in length, making it one of the largest coherent filamentary structures identified in the observable Universe.",
    coordinates: makeCoords(195.0, 5.0, 300.0, 20.0, 0.07, 21000),
    dimensions: {
      majorAxisMpc: { value: 433.0, unit: "Mpc" },
      minorAxisMpc: { value: 150.0, unit: "Mpc" },
      depthMpc: { value: 15.0, unit: "Mpc" },
      approximateVolumeMpc3: 970000.0,
      characteristicRadiusMpc: 216.0,
    },
    physical: {
      estimatedMassSolar: { value: 2.5e16, unit: "M_sun" },
      galaxyCountEstimated: { value: 40000, unit: "galaxies" },
    },
    geometry: {
      geometryType: "PLANAR_SLAB",
      boundingRadiusMpc: 220.0,
      ellipsoidRadiiMpc: { rxMpc: 216.0, ryMpc: 75.0, rzMpc: 10.0 },
      isModelDerived: false,
    },
    observationStatus: "OBSERVED",
    geometryStatus: "OBSERVED",
    discovery: { discoveredBy: "J. Richard Gott III et al.", discoveryYear: 2003 },
    provenance: {
      authoritativeBody: "PEER_REVIEWED_PAPER",
      catalogName: "Sloan Digital Sky Survey",
      recordIdentifier: "Gott-2005-ApJ-624-463",
      confidenceScore: 0.99,
      citationUrl: "https://doi.org/10.1086/428890",
      retrievedAt: "2026-08-31T00:00:00Z",
    },
  },
];
