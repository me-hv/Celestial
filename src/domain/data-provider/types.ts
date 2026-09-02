import { EpistemicStatus } from "../mission/types";
import { ProvenanceRecord } from "../provenance/types";

export type WavelengthBand =
  | "RADIO"
  | "MICROWAVE"
  | "INFRARED"
  | "OPTICAL"
  | "ULTRAVIOLET"
  | "XRAY"
  | "GAMMA_RAY"
  | "GRAVITATIONAL_WAVE"
  | "PARTICLE"
  | "MULTI_WAVELENGTH";

export type ScientificDiscipline =
  | "PLANETARY_SCIENCE"
  | "ASTROPHYSICS"
  | "SOLAR_PHYSICS"
  | "COSMOLOGY"
  | "EXOPLANETARY_SCIENCE"
  | "ASTROMETRY"
  | "HELIOPHYSICS"
  | "ASTROBIOLOGY"
  | "GRAVITATIONAL_ASTRONOMY";

export type DatasetDataType =
  | "IMAGERY"
  | "SPECTRA"
  | "LIGHT_CURVE"
  | "MAGNETIC_FIELD"
  | "RADAR_ALTIMETRY"
  | "PARTICLE_FLUX"
  | "POINT_CATALOG"
  | "TIME_SERIES"
  | "TELEMETRY"
  | "POLARIZATION"
  | "THERMAL_PROFILE";

export interface DataTransformationStep {
  stepIndex: number;
  stepName: string;
  description: string;
  sourceFileOrResource?: string;
  appliedAlgorithm: string;
  executionTimestamp: string;
  softwareVersion?: string;
  epistemicStatus: EpistemicStatus;
}

export interface ScientificDataProvider {
  id: string;
  slug: string;
  name: string;
  acronym?: string;
  organizationId: string;
  organizationSlug: string;
  organizationName: string;
  baseUrl: string;
  documentationUrl?: string;
  license: string;
  updateFrequency: "DAILY" | "WEEKLY" | "MONTHLY" | "CONTINUOUS" | "STATIC_RELEASE";
  supportedDisciplines: ScientificDiscipline[];
  epistemicRating:
    "OFFICIAL_AUTHORITY" | "PEER_REVIEWED" | "STANDARDIZED_CATALOG" | "DERIVED_PIPELINE";
  summary: string;
  provenance: ProvenanceRecord;
}

export interface ScientificDataset {
  id: string;
  slug: string;
  title: string;
  description: string;
  providerId: string;
  providerSlug: string;
  providerName: string;
  organizationId: string;
  organizationSlug: string;
  organizationName: string;
  missionId?: string;
  missionSlug?: string;
  missionName?: string;
  spacecraftId?: string;
  spacecraftSlug?: string;
  spacecraftName?: string;
  instrumentIds?: string[];
  instrumentNames?: string[];
  targetSlugs: string[];
  primaryTargetName: string;
  wavelengthBand: WavelengthBand;
  discipline: ScientificDiscipline;
  dataType: DatasetDataType;
  dataVersion: string;
  retrievalTimestamp: string;
  sourceUrl: string;
  downloadUrl?: string;
  landingPageUrl?: string;
  license: string;
  citationDoi?: string;
  sizeBytes?: number;
  recordCount?: number;
  epistemicStatus: EpistemicStatus;
  provenance: ProvenanceRecord;
  transformationHistory: DataTransformationStep[];
  parametersMeasured: string[];
  tags: string[];
}
