import { ProvenanceRecord } from "../provenance/types";

export type ObservatoryType =
  | "OPTICAL"
  | "RADIO"
  | "INFRARED"
  | "MILLIMETER"
  | "SOLAR"
  | "GRAVITATIONAL_WAVE"
  | "SPACE_TELESCOPE";

export interface TelescopeSpecification {
  name: string;
  apertureMeters: number;
  opticalDesign: string;
  mountType?: string;
  wavelengthBand: string;
  firstLightYear?: number;
}

export interface GroundObservatory {
  id: string;
  slug: string;
  name: string;
  acronym?: string;
  type: ObservatoryType;
  locationName: string;
  country: string;
  coordinates: {
    latitudeDeg: number;
    longitudeDeg: number;
    elevationMeters: number;
  };
  timezone: string;
  operationalStatus: "ACTIVE" | "UPGRADING" | "DECOMMISSIONED" | "PLANNED";
  governingOrganization: string;
  primaryTelescopes: TelescopeSpecification[];
  wavelengthCoverage: string[];
  activeInstruments: string[];
  keyDiscoveries: string[];
  summary: string;
  heroImageUrl?: string;
  websiteUrl?: string;
  provenance: ProvenanceRecord;
}
