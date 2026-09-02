import { z } from "zod";
import { ProvenanceRecordSchema } from "../provenance/types";

export const ObservatoryTypeSchema = z.enum([
  "OPTICAL",
  "RADIO",
  "INFRARED",
  "MILLIMETER",
  "SOLAR",
  "GRAVITATIONAL_WAVE",
  "SPACE_TELESCOPE",
]);

export const TelescopeSpecificationSchema = z.object({
  name: z.string(),
  apertureMeters: z.number(),
  opticalDesign: z.string(),
  mountType: z.string().optional(),
  wavelengthBand: z.string(),
  firstLightYear: z.number().optional(),
});

export const GroundObservatorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  acronym: z.string().optional(),
  type: ObservatoryTypeSchema,
  locationName: z.string(),
  country: z.string(),
  coordinates: z.object({
    latitudeDeg: z.number(),
    longitudeDeg: z.number(),
    elevationMeters: z.number(),
  }),
  timezone: z.string(),
  operationalStatus: z.enum(["ACTIVE", "UPGRADING", "DECOMMISSIONED", "PLANNED"]),
  governingOrganization: z.string(),
  primaryTelescopes: z.array(TelescopeSpecificationSchema),
  wavelengthCoverage: z.array(z.string()),
  activeInstruments: z.array(z.string()),
  keyDiscoveries: z.array(z.string()),
  summary: z.string(),
  heroImageUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
  provenance: ProvenanceRecordSchema,
});
