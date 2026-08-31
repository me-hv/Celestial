import { z } from "zod";
import { ProvenanceRecordSchema } from "../provenance/types";

export const ScientificObservationStatusSchema = z.enum([
  "OBSERVED",
  "INFERRED",
  "MODEL_DERIVED",
  "ILLUSTRATIVE",
]);

export const HorizonTypeSchema = z.enum([
  "PARTICLE_HORIZON",
  "HUBBLE_SPHERE",
  "COSMOLOGICAL_EVENT_HORIZON",
  "CMB_LAST_SCATTERING",
  "LIGHT_TRAVEL_HORIZON",
]);

export const CosmicHorizonSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  horizonType: HorizonTypeSchema,
  comovingRadiusMpc: z.number().nonnegative(),
  comovingRadiusGly: z.number().nonnegative(),
  redshiftZ: z.number().optional(),
  lookbackTimeGyr: z.number().nonnegative(),
  cosmicAgeGyr: z.number().nonnegative(),
  scaleFactorA: z.number().nonnegative(),
  status: ScientificObservationStatusSchema,
  summary: z.string().min(1),
  physicalMeaning: z.string().min(1),
  commonMisconception: z.string().optional(),
  citation: z.string().optional(),
});

export const RedshiftShellTypeSchema = z.enum([
  "LOCAL_UNIVERSE",
  "NEARBY_GALAXIES",
  "INTERMEDIATE_UNIVERSE",
  "EARLY_GALAXIES",
  "HIGH_REDSHIFT_UNIVERSE",
  "COSMIC_DAWN",
  "DARK_AGES",
  "CMB_LAST_SCATTERING",
  "PARTICLE_HORIZON",
]);

export const RedshiftShellSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  type: RedshiftShellTypeSchema,
  orderIndex: z.number().int().positive(),
  minRedshiftZ: z.number().nonnegative(),
  maxRedshiftZ: z.number().nonnegative(),
  minComovingDistanceMpc: z.number().nonnegative(),
  maxComovingDistanceMpc: z.number().nonnegative(),
  minLookbackTimeGyr: z.number().nonnegative(),
  maxLookbackTimeGyr: z.number().nonnegative(),
  minCosmicAgeGyr: z.number().nonnegative(),
  maxCosmicAgeGyr: z.number().nonnegative(),
  minScaleFactorA: z.number().nonnegative(),
  maxScaleFactorA: z.number().nonnegative(),
  status: ScientificObservationStatusSchema,
  colorHex: z.string().min(4),
  description: z.string().min(1),
  representativeObjects: z.array(z.string()),
});

export const ObservationalLandmarkSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  standardDesignation: z.string().optional(),
  category: z.enum(["LOCAL", "GALAXY", "QUASAR", "HIGH_Z_GALAXY", "HORIZON", "CMB"]),
  redshiftZ: z.number().nonnegative(),
  scaleFactorA: z.number().nonnegative(),
  comovingDistanceMpc: z.number().nonnegative(),
  comovingDistanceGly: z.number().nonnegative(),
  luminosityDistanceMpc: z.number().nonnegative(),
  angularDiameterDistanceMpc: z.number().nonnegative(),
  properDistanceEmissionMpc: z.number().nonnegative(),
  lookbackTimeGyr: z.number().nonnegative(),
  cosmicAgeAtEmissionGyr: z.number().nonnegative(),
  status: ScientificObservationStatusSchema,
  observationalSource: z.string().optional(),
  coordinates: z
    .object({
      rightAscensionDeg: z.number().optional(),
      declinationDeg: z.number().optional(),
    })
    .optional(),
  summary: z.string().min(1),
  provenance: ProvenanceRecordSchema,
});

export const CMBAcousticPeakSchema = z.object({
  peakNumber: z.number().int().positive(),
  multipoleL: z.number().positive(),
  angularScaleDeg: z.number().positive(),
  physicalMeaning: z.string().min(1),
});

export const CMBMissionRecordSchema = z.object({
  name: z.string().min(1),
  agency: z.string().min(1),
  launchYear: z.number().int(),
  orbitOrLocation: z.string().min(1),
  keyDiscovery: z.string().min(1),
  citation: z.string().min(1),
});

export const CMBLastScatteringSurfaceSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  redshiftZ: z.number().positive(),
  scaleFactorA: z.number().positive(),
  cosmicAgeYears: z.number().positive(),
  lookbackTimeGyr: z.number().positive(),
  comovingDistanceMpc: z.number().positive(),
  comovingDistanceGly: z.number().positive(),
  temperatureKelvinToday: z.number().positive(),
  temperatureKelvinDecoupling: z.number().positive(),
  dipoleVelocityKmS: z.number().positive(),
  anisotropyScaleRmsMicroKelvin: z.number().positive(),
  acousticPeaks: z.array(CMBAcousticPeakSchema),
  missions: z.array(CMBMissionRecordSchema),
  status: z.literal("OBSERVED"),
  summary: z.string().min(1),
  physicalProcesses: z.string().min(1),
  provenance: ProvenanceRecordSchema,
});
