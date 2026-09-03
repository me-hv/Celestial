import { z } from "zod";
import { ProvenanceRecordSchema } from "../provenance/types";
import { EpistemicStatusSchema } from "../mission/schema";
import { DataFreshnessStateSchema } from "../live-data/schema";

export const SolarActivityLevelSchema = z.enum([
  "VERY_LOW",
  "LOW",
  "MODERATE",
  "HIGH",
  "VERY_HIGH",
  "EXTREME",
]);

export const SolarFlareClassSchema = z.enum(["A", "B", "C", "M", "X"]);

export const GeomagneticStormScaleSchema = z.enum([
  "NONE",
  "G1_MINOR",
  "G2_MODERATE",
  "G3_STRONG",
  "G4_SEVERE",
  "G5_EXTREME",
]);

export const SolarRadiationStormScaleSchema = z.enum([
  "NONE",
  "S1_MINOR",
  "S2_MODERATE",
  "S3_STRONG",
  "S4_SEVERE",
  "S5_EXTREME",
]);

export const RadioBlackoutScaleSchema = z.enum([
  "NONE",
  "R1_MINOR",
  "R2_MODERATE",
  "R3_STRONG",
  "R4_SEVERE",
  "R5_EXTREME",
]);

export const SolarFlareSchema = z.object({
  id: z.string().min(1),
  flareClass: SolarFlareClassSchema,
  magnitude: z.string().min(1),
  peakFluxWm2: z.number().positive(),
  peakTimestamp: z.string().min(1),
  beginTimestamp: z.string().optional(),
  endTimestamp: z.string().optional(),
  activeRegionNumber: z.number().optional(),
  epistemicStatus: EpistemicStatusSchema,
  provenance: ProvenanceRecordSchema,
});

export const SolarWindObservationSchema = z.object({
  observedAt: z.string().min(1),
  retrievedAt: z.string().min(1),
  speedKmS: z.number().nonnegative(),
  densityProtonsCm3: z.number().nonnegative(),
  temperatureKelvin: z.number().nonnegative(),
  imfBtNanotesla: z.number().nonnegative(),
  imfBzNanotesla: z.number(),
  epistemicStatus: EpistemicStatusSchema,
  provenance: ProvenanceRecordSchema,
});

export const GeomagneticConditionSchema = z.object({
  observedAt: z.string().min(1),
  retrievedAt: z.string().min(1),
  kpIndex: z.number().min(0).max(9),
  apEquivalent: z.number().nonnegative(),
  stormScale: GeomagneticStormScaleSchema,
  description: z.string().min(1),
  auroralBoundaryLatitudeDeg: z.number(),
  epistemicStatus: EpistemicStatusSchema,
  provenance: ProvenanceRecordSchema,
});

export const SpaceWeatherObservationSchema = z.object({
  id: z.string().min(1),
  observedAt: z.string().min(1),
  retrievedAt: z.string().min(1),
  freshness: DataFreshnessStateSchema,
  solarActivity: SolarActivityLevelSchema,
  solarXrayFluxWm2: z.number().nonnegative(),
  radioBlackoutScale: RadioBlackoutScaleSchema,
  recentFlares: z.array(SolarFlareSchema),
  solarWind: SolarWindObservationSchema,
  geomagnetic: GeomagneticConditionSchema,
  particleEnvironment: z.object({
    observedAt: z.string().min(1),
    retrievedAt: z.string().min(1),
    protonFlux10MevPfu: z.number().nonnegative(),
    electronFlux2Mev: z.number().nonnegative(),
    radiationStormScale: SolarRadiationStormScaleSchema,
    satelliteRiskAssessment: z.enum([
      "NOMINAL",
      "ELEVATED_SURFACE_CHARGING",
      "SINGLE_EVENT_UPSET_RISK",
    ]),
    epistemicStatus: EpistemicStatusSchema,
    provenance: ProvenanceRecordSchema,
  }),
  activeAlerts: z.array(
    z.object({
      id: z.string().min(1),
      alertType: z.enum(["WATCH", "WARNING", "ALERT", "SUMMARY"]),
      code: z.string().min(1),
      issuedAt: z.string().min(1),
      validUntil: z.string().optional(),
      headline: z.string().min(1),
      message: z.string().min(1),
      affectsAurora: z.boolean(),
      affectsRadio: z.boolean(),
      affectsSatellites: z.boolean(),
      affectsAviationRadiation: z.boolean(),
      sourceUrl: z.string().optional(),
      provenance: ProvenanceRecordSchema,
    })
  ),
  observationImplications: z.object({
    auroralVisibilityRecommendation: z.string(),
    radioPropagationCondition: z.string(),
    groundTelescopeAtmosphericTurbulence: z.string(),
    satelliteSensorHazardScore: z.number().min(0).max(10),
  }),
  epistemicStatus: EpistemicStatusSchema,
  provenance: ProvenanceRecordSchema,
});
