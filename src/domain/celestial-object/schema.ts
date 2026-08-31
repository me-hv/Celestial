import { z } from "zod";
import { ProvenanceRecordSchema } from "../provenance/types";
import { CelestialCategory, CelestialClassificationCode } from "./classification";

export const ObjectAliasSchema = z.object({
  name: z.string().min(1),
  type: z.enum([
    "COMMON",
    "BAYER",
    "FLAMSTEED",
    "CATALOG",
    "HISTORICAL",
    "EXOPLANET_LETTER",
    "GAIA",
    "HIP",
    "HD",
    "GLIESE",
    "MESSIER",
    "NGC",
    "IC",
    "CALDWELL",
  ]),
  sourceCatalog: z.string().optional(),
});

export const CatalogIdentifiersSchema = z.object({
  gaiaDr3: z.string().optional(),
  hip: z.string().optional(),
  hd: z.string().optional(),
  gliese: z.string().optional(),
  bayer: z.string().optional(),
  flamsteed: z.string().optional(),
  sao: z.string().optional(),
  hr: z.string().optional(),
  twoMass: z.string().optional(),
  messier: z.string().optional(),
  ngc: z.string().optional(),
  ic: z.string().optional(),
  caldwell: z.string().optional(),
  pgc: z.string().optional(),
  ugc: z.string().optional(),
});

export const ScientificMeasurementSchema = z.object({
  value: z.number(),
  unit: z.string(),
  uncertainty: z
    .object({
      upper: z.number().optional(),
      lower: z.number().optional(),
    })
    .optional(),
  provenance: ProvenanceRecordSchema.optional(),
});

export const PhysicalPropertiesSchema = z.object({
  massKg: z.number().positive().optional(),
  massSolar: z.number().positive().optional(),
  massEarth: z.number().positive().optional(),
  massJupiter: z.number().positive().optional(),

  meanRadiusKm: z.number().positive().optional(),
  radiusEarth: z.number().positive().optional(),
  radiusJupiter: z.number().positive().optional(),
  radiusSolar: z.number().positive().optional(),

  surfaceGravityMs2: z.number().positive().optional(),
  densityGcm3: z.number().positive().optional(),

  meanTemperatureK: z.number().positive().optional(),
  effectiveTemperatureK: z.number().positive().optional(),
  luminositySolar: z.number().positive().optional(),
  spectralClass: z.string().optional(),
  metallicityDex: z.number().optional(),
  surfaceGravityLogG: z.number().optional(),

  // Photometry
  apparentMagnitudeV: z.number().optional(),
  apparentMagnitudeG: z.number().optional(),
  absoluteMagnitudeV: z.number().optional(),
  absoluteMagnitudeG: z.number().optional(),
  colorIndexBMinusV: z.number().optional(),
  colorIndexBpMinusRp: z.number().optional(),

  // Stellar Evolution & Multiplicity
  stellarAgeGyr: z.number().min(0).optional(),
  variabilityType: z.string().optional(),
  isMultipleStarMember: z.boolean().optional(),
  multipleStarSystemSlug: z.string().optional(),
  constellation: z.string().optional(),

  morphologicalType: z.string().optional(),
  atmosphereComposition: z
    .array(
      z.object({
        molecule: z.string(),
        percentage: z.number().min(0).max(100),
      })
    )
    .optional(),

  measurementsWithUncertainty: z
    .object({
      massEarth: ScientificMeasurementSchema.optional(),
      radiusEarth: ScientificMeasurementSchema.optional(),
      massJupiter: ScientificMeasurementSchema.optional(),
      radiusJupiter: ScientificMeasurementSchema.optional(),
      effectiveTemperatureK: ScientificMeasurementSchema.optional(),
      luminositySolar: ScientificMeasurementSchema.optional(),
      stellarRadiusSolar: ScientificMeasurementSchema.optional(),
      stellarMassSolar: ScientificMeasurementSchema.optional(),
      parallaxMas: ScientificMeasurementSchema.optional(),
      distanceParsecs: ScientificMeasurementSchema.optional(),
      apparentMagnitudeV: ScientificMeasurementSchema.optional(),
    })
    .optional(),
});

export const PositionalPropertiesSchema = z.object({
  rightAscensionDeg: z.number().min(0).max(360).optional(),
  declinationDeg: z.number().min(-90).max(90).optional(),
  distanceLightYears: z.number().min(0).optional(),
  distanceParsecs: z.number().min(0).optional(),
  distanceKpc: z.number().min(0).optional(),
  distanceMpc: z.number().min(0).optional(),
  distanceAu: z.number().min(0).optional(),
  distanceKm: z.number().min(0).optional(),
  epoch: z.string().optional(),
  referenceFrame: z.enum(["ICRS", "FK5"]).optional(),

  // Galactic Coordinates
  galacticCoordinates: z
    .object({
      lDeg: z.number().min(0).max(360),
      bDeg: z.number().min(-90).max(90),
    })
    .optional(),

  // Astrometry
  parallaxMas: z.number().optional(),
  parallaxErrorMas: z.number().min(0).optional(),
  properMotionRaMasYr: z.number().optional(),
  properMotionDecMasYr: z.number().optional(),
  radialVelocityKmS: z.number().optional(),

  cartesianCoordinatesPc: z
    .object({
      x: z.number(),
      y: z.number(),
      z: z.number(),
    })
    .optional(),

  distanceUncertainty: z
    .object({
      upper: z.number().optional(),
      lower: z.number().optional(),
      percentage: z.number().optional(),
    })
    .optional(),
});

export const OrbitalPropertiesSchema = z.object({
  semiMajorAxisAu: z.number().positive().optional(),
  semiMajorAxisKm: z.number().positive().optional(),
  eccentricity: z.number().min(0).max(1).optional(),
  orbitalPeriodDays: z.number().positive().optional(),
  orbitalPeriodYears: z.number().positive().optional(),
  inclinationDeg: z.number().min(0).max(180).optional(),
  longitudeAscendingNodeDeg: z.number().min(0).max(360).optional(),
  argumentPeriapsisDeg: z.number().min(0).max(360).optional(),
  meanAnomalyDeg: z.number().min(0).max(360).optional(),
  epochJulianDate: z.number().optional(),
  transitMidpointJulianDate: z.number().optional(),

  orbitalPeriodUncertainty: z
    .object({
      upper: z.number().optional(),
      lower: z.number().optional(),
    })
    .optional(),
  semiMajorAxisUncertainty: z
    .object({
      upper: z.number().optional(),
      lower: z.number().optional(),
    })
    .optional(),
  eccentricityUncertainty: z
    .object({
      upper: z.number().optional(),
      lower: z.number().optional(),
    })
    .optional(),
  inclinationUncertainty: z
    .object({
      upper: z.number().optional(),
      lower: z.number().optional(),
    })
    .optional(),
});

export const MultiWavelengthObservationSchema = z.object({
  id: z.string(),
  wavelengthBand: z.enum(["OPTICAL", "INFRARED", "RADIO", "X_RAY", "ULTRAVIOLET", "GAMMA_RAY"]),
  filterOrFrequency: z.string().optional(),
  apparentMagnitude: z.number().optional(),
  fluxDensityJy: z.number().optional(),
  telescopeOrSurvey: z.string(),
  instrument: z.string().optional(),
  epoch: z.string().optional(),
  observationDate: z.string().optional(),
  citationOrCredit: z.string().optional(),
  referenceUrl: z.string().url().optional(),
});

export const DeepSkyPropertiesSchema = z.object({
  type: z.enum(["GALAXY", "NEBULA", "PLANETARY_NEBULA", "SUPERNOVA_REMNANT", "STAR_CLUSTER"]),
  galaxy: z
    .object({
      morphologicalType: z.string(),
      galaxySubtype: z
        .enum(["SPIRAL", "ELLIPTICAL", "LENTICULAR", "IRREGULAR", "DWARF"])
        .optional(),
      redshiftZ: z.number().optional(),
      radialVelocityKmS: z.number().optional(),
      majorAxisArcmin: z.number().optional(),
      minorAxisArcmin: z.number().optional(),
      positionAngleDeg: z.number().optional(),
      inclinationDeg: z.number().optional(),
      estimatedStellarMassSolar: z.number().optional(),
      starFormationRateSolarMassPerYr: z.number().optional(),
      galaxyGroupOrCluster: z.string().optional(),
    })
    .optional(),
  nebula: z
    .object({
      nebulaSubtype: z.enum(["EMISSION", "REFLECTION", "DARK", "DIFFUSE", "STAR_FORMING"]),
      angularDiameterArcmin: z.number().optional(),
      majorAxisArcmin: z.number().optional(),
      minorAxisArcmin: z.number().optional(),
      associatedIonizingStar: z.string().optional(),
      associatedCluster: z.string().optional(),
      chemicalComposition: z.array(z.string()).optional(),
    })
    .optional(),
  planetaryNebula: z
    .object({
      centralStarName: z.string().optional(),
      centralStarMagnitudeV: z.number().optional(),
      expansionVelocityKmS: z.number().optional(),
      angularDiameterArcsec: z.number().optional(),
      distanceMethod: z.string().optional(),
    })
    .optional(),
  supernovaRemnant: z
    .object({
      explosionYearEstimate: z.number().optional(),
      progenitorType: z.enum(["TYPE_IA", "CORE_COLLAPSE", "UNKNOWN"]).optional(),
      expansionVelocityKmS: z.number().optional(),
      remnantCoreType: z.enum(["PULSAR", "NEUTRON_STAR", "BLACK_HOLE", "NONE"]).optional(),
      centralCompactObject: z.string().optional(),
    })
    .optional(),
  starCluster: z
    .object({
      clusterSubtype: z.enum(["OPEN_CLUSTER", "GLOBULAR_CLUSTER", "STELLAR_ASSOCIATION"]),
      estimatedAgeGyr: z.number().optional(),
      metallicityFeH: z.number().optional(),
      estimatedMemberCount: z.number().optional(),
      coreRadiusArcmin: z.number().optional(),
      halfLightRadiusArcmin: z.number().optional(),
      totalLuminositySolar: z.number().optional(),
      trumplerClass: z.string().optional(),
    })
    .optional(),
  cosmicHierarchy: z
    .object({
      supercluster: z.string().optional(),
      clusterOrGroup: z.string().optional(),
      hostStructure: z.string().optional(),
    })
    .optional(),
  distanceMethod: z
    .enum([
      "TRIGONOMETRIC_PARALLAX",
      "CEPHEID_VARIABLE",
      "TIP_OF_RED_GIANT_BRANCH",
      "TYPE_IA_SUPERNOVA",
      "SURFACE_BRIGHTNESS_FLUCTUATIONS",
      "REDSHIFT_HUBBLE_FLOW",
      "CLUSTER_MAIN_SEQUENCE_FITTING",
      "LITERATURE_CONSENSUS",
    ])
    .optional(),
});

export const DiscoveryInfoSchema = z.object({
  year: z.number().int().optional(),
  discoveredBy: z.string().optional(),
  method: z
    .enum([
      "DIRECT_IMAGING",
      "TRANSIT",
      "RADIAL_VELOCITY",
      "ASTROMETRY",
      "MICROLENSING",
      "TRANSIT_TIMING_VARIATION",
      "TELESCOPIC_OBSERVATION",
      "ANTIQUITY",
      "OTHER",
    ])
    .optional(),
  facility: z.string().optional(),
  telescope: z.string().optional(),
  instrument: z.string().optional(),
  referenceCitation: z.string().optional(),
});

export const MediaAssetsSchema = z.object({
  thumbnailUrl: z.string().url().optional(),
  textureUrl: z.string().url().optional(),
  credit: z.string().optional(),
});

export const CelestialClassificationSchema = z.object({
  category: z.nativeEnum(CelestialCategory),
  code: z.nativeEnum(CelestialClassificationCode),
});

export const CelestialObjectSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  canonicalName: z.string().min(1),
  standardDesignation: z.string().optional(),
  classification: CelestialClassificationSchema,
  aliases: z.array(ObjectAliasSchema),
  catalogIdentifiers: CatalogIdentifiersSchema.optional(),

  parentId: z.string().uuid().optional(),
  hostSystemId: z.string().optional(),
  hostGalaxyId: z.string().optional(),
  childObjectIds: z.array(z.string().uuid()).optional(),

  physical: PhysicalPropertiesSchema,
  positional: PositionalPropertiesSchema,
  orbital: OrbitalPropertiesSchema.optional(),

  deepSky: DeepSkyPropertiesSchema.optional(),
  observations: z.array(MultiWavelengthObservationSchema).optional(),

  discovery: DiscoveryInfoSchema.optional(),
  provenance: ProvenanceRecordSchema,
  media: MediaAssetsSchema.optional(),
  summary: z.string().optional(),
  isFeatured: z.boolean().optional(),
});

export type ValidatedCelestialObject = z.infer<typeof CelestialObjectSchema>;
