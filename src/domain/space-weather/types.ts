import { EpistemicStatus } from "../mission/types";
import { ProvenanceRecord } from "../provenance/types";
import { DataFreshnessState } from "../live-data/types";

export type SolarActivityLevel = "VERY_LOW" | "LOW" | "MODERATE" | "HIGH" | "VERY_HIGH" | "EXTREME";

export type SolarFlareClass = "A" | "B" | "C" | "M" | "X";

export type GeomagneticStormScale =
  "NONE" | "G1_MINOR" | "G2_MODERATE" | "G3_STRONG" | "G4_SEVERE" | "G5_EXTREME";

export type SolarRadiationStormScale =
  "NONE" | "S1_MINOR" | "S2_MODERATE" | "S3_STRONG" | "S4_SEVERE" | "S5_EXTREME";

export type RadioBlackoutScale =
  "NONE" | "R1_MINOR" | "R2_MODERATE" | "R3_STRONG" | "R4_SEVERE" | "R5_EXTREME";

export interface SolarFlare {
  id: string;
  flareClass: SolarFlareClass;
  magnitude: string; // e.g. "M2.4" or "X1.1"
  peakFluxWm2: number; // Watts per square meter
  peakTimestamp: string; // ISO 8601
  beginTimestamp?: string;
  endTimestamp?: string;
  activeRegionNumber?: number; // e.g. AR 3842
  epistemicStatus: EpistemicStatus;
  provenance: ProvenanceRecord;
}

export interface SolarWindObservation {
  observedAt: string; // ISO 8601
  retrievedAt: string; // ISO 8601
  speedKmS: number; // Solar wind speed (e.g. 420 km/s)
  densityProtonsCm3: number; // Proton density (e.g. 6.5 p/cm3)
  temperatureKelvin: number; // Plasma temperature (e.g. 85,000 K)
  imfBtNanotesla: number; // Interplanetary Magnetic Field Total Bt (nT)
  imfBzNanotesla: number; // North-South component Bz (nT) - critical for auroral coupling
  epistemicStatus: EpistemicStatus;
  provenance: ProvenanceRecord;
}

export interface GeomagneticCondition {
  observedAt: string; // ISO 8601
  retrievedAt: string; // ISO 8601
  kpIndex: number; // Planetary K-index (0.0 to 9.0)
  apEquivalent: number; // Ap index
  stormScale: GeomagneticStormScale;
  description: string;
  auroralBoundaryLatitudeDeg: number; // Lowest geomagnetic latitude where aurora may be visible
  epistemicStatus: EpistemicStatus;
  provenance: ProvenanceRecord;
}

export interface SolarParticleObservation {
  observedAt: string; // ISO 8601
  retrievedAt: string; // ISO 8601
  protonFlux10MevPfu: number; // Particle Flux Units (>10 MeV protons)
  electronFlux2Mev: number; // Electron flux (>2 MeV)
  radiationStormScale: SolarRadiationStormScale;
  satelliteRiskAssessment: "NOMINAL" | "ELEVATED_SURFACE_CHARGING" | "SINGLE_EVENT_UPSET_RISK";
  epistemicStatus: EpistemicStatus;
  provenance: ProvenanceRecord;
}

export interface SpaceWeatherAlert {
  id: string;
  alertType: "WATCH" | "WARNING" | "ALERT" | "SUMMARY";
  code: string; // e.g. "ALTK05", "WARK06", "ALTEF3"
  issuedAt: string; // ISO 8601
  validUntil?: string; // ISO 8601
  headline: string;
  message: string;
  affectsAurora: boolean;
  affectsRadio: boolean;
  affectsSatellites: boolean;
  affectsAviationRadiation: boolean;
  sourceUrl?: string;
  provenance: ProvenanceRecord;
}

export interface SpaceWeatherObservation {
  id: string;
  observedAt: string; // ISO 8601
  retrievedAt: string; // ISO 8601
  freshness: DataFreshnessState;
  solarActivity: SolarActivityLevel;
  solarXrayFluxWm2: number;
  radioBlackoutScale: RadioBlackoutScale;
  recentFlares: SolarFlare[];
  solarWind: SolarWindObservation;
  geomagnetic: GeomagneticCondition;
  particleEnvironment: SolarParticleObservation;
  activeAlerts: SpaceWeatherAlert[];
  observationImplications: {
    auroralVisibilityRecommendation: string;
    radioPropagationCondition: string;
    groundTelescopeAtmosphericTurbulence: string;
    satelliteSensorHazardScore: number; // 0 (none) to 10 (extreme)
  };
  epistemicStatus: EpistemicStatus;
  provenance: ProvenanceRecord;
}
