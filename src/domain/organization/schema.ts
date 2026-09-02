import { z } from "zod";
import { ProvenanceRecordSchema } from "../provenance/types";

export const OrganizationTypeSchema = z.enum([
  "SPACE_AGENCY",
  "GOVERNMENT_RESEARCH_ORGANIZATION",
  "NATIONAL_RESEARCH_INSTITUTE",
  "UNIVERSITY",
  "OBSERVATORY",
  "INTERNATIONAL_ORGANIZATION",
  "SCIENTIFIC_CONSORTIUM",
  "COMMERCIAL_SPACE_COMPANY",
  "MISSION_CONSORTIUM",
  "OTHER_RESEARCH_ORGANIZATION",
]);

export const GeographicRegionSchema = z.enum([
  "NORTH_AMERICA",
  "EUROPE",
  "ASIA_PACIFIC",
  "SOUTH_ASIA",
  "MIDDLE_EAST",
  "LATIN_AMERICA",
  "AFRICA",
  "INTERNATIONAL",
]);

export const OrganizationRoleSchema = z.enum([
  "LEAD_AGENCY",
  "MISSION_OPERATOR",
  "SPACECRAFT_OPERATOR",
  "SPACECRAFT_BUILDER",
  "INSTRUMENT_PROVIDER",
  "SCIENCE_TEAM",
  "RESEARCH_PARTNER",
  "LAUNCH_PROVIDER",
  "GROUND_SEGMENT",
  "DATA_ARCHIVE",
  "FUNDING_ORGANIZATION",
  "MISSION_PARTNER",
  "INTERNATIONAL_PARTNER",
  "UNIVERSITY_PARTNER",
  "COMMERCIAL_PARTNER",
]);

export const OrganizationParticipationSchema = z.object({
  organizationId: z.string(),
  organizationSlug: z.string(),
  organizationName: z.string(),
  organizationCountry: z.string(),
  role: OrganizationRoleSchema,
  contributionDescription: z.string().optional(),
});

export const DataArchiveSchema = z.object({
  id: z.string(),
  name: z.string(),
  organizationId: z.string(),
  organizationSlug: z.string(),
  organizationName: z.string(),
  url: z.string().url(),
  dataType: z.string(),
  instruments: z.array(z.string()).optional(),
  accessLevel: z.enum(["OPEN_ACCESS", "RESTRICTED", "ACADEMIC"]),
  description: z.string(),
  provenance: ProvenanceRecordSchema,
});

export const PublicSourceSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  sourceTier: z.enum([
    "TIER_1_OFFICIAL",
    "TIER_2_ARCHIVE",
    "TIER_3_PUBLICATION",
    "TIER_4_CATALOG",
    "TIER_5_SECONDARY",
  ]),
  retrievedDate: z.string().optional(),
});

export const OrganizationSchema = z.object({
  id: z.string(),
  slug: z.string(),
  officialName: z.string(),
  shortName: z.string(),
  acronym: z.string().optional(),
  country: z.string(),
  countryCode: z.string(),
  region: GeographicRegionSchema,
  organizationType: OrganizationTypeSchema,
  description: z.string(),
  summary: z.string(),
  foundedYear: z.number().optional(),
  headquarters: z.string().optional(),
  officialWebsite: z.string().url().optional(),
  parentOrganizationId: z.string().optional(),
  parentOrganizationSlug: z.string().optional(),
  aliases: z.array(z.string()).optional(),
  isHistorical: z.boolean().optional(),
  historicalPeriod: z.string().optional(),
  primaryFocusAreas: z.array(z.string()),
  keyFacilities: z.array(z.string()).optional(),
  dataArchives: z.array(DataArchiveSchema).optional(),
  officialSources: z.array(PublicSourceSchema).optional(),
  provenance: ProvenanceRecordSchema,
  epistemicStatus: z.enum(["OBSERVED", "INFERRED", "MODEL_DERIVED"]).optional(),
});
