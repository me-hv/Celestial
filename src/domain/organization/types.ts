import { ProvenanceRecord } from "../provenance/types";
import { EpistemicStatus } from "../mission/types";

export type OrganizationType =
  | "SPACE_AGENCY"
  | "GOVERNMENT_RESEARCH_ORGANIZATION"
  | "NATIONAL_RESEARCH_INSTITUTE"
  | "UNIVERSITY"
  | "OBSERVATORY"
  | "INTERNATIONAL_ORGANIZATION"
  | "SCIENTIFIC_CONSORTIUM"
  | "COMMERCIAL_SPACE_COMPANY"
  | "MISSION_CONSORTIUM"
  | "OTHER_RESEARCH_ORGANIZATION";

export type GeographicRegion =
  | "NORTH_AMERICA"
  | "EUROPE"
  | "ASIA_PACIFIC"
  | "SOUTH_ASIA"
  | "MIDDLE_EAST"
  | "LATIN_AMERICA"
  | "AFRICA"
  | "INTERNATIONAL";

export type OrganizationRole =
  | "LEAD_AGENCY"
  | "MISSION_OPERATOR"
  | "SPACECRAFT_OPERATOR"
  | "SPACECRAFT_BUILDER"
  | "INSTRUMENT_PROVIDER"
  | "SCIENCE_TEAM"
  | "RESEARCH_PARTNER"
  | "LAUNCH_PROVIDER"
  | "GROUND_SEGMENT"
  | "DATA_ARCHIVE"
  | "FUNDING_ORGANIZATION"
  | "MISSION_PARTNER"
  | "INTERNATIONAL_PARTNER"
  | "UNIVERSITY_PARTNER"
  | "COMMERCIAL_PARTNER";

export interface OrganizationParticipation {
  organizationId: string;
  organizationSlug: string;
  organizationName: string;
  organizationCountry: string;
  role: OrganizationRole;
  contributionDescription?: string;
}

export interface DataArchive {
  id: string;
  name: string;
  organizationId: string;
  organizationSlug: string;
  organizationName: string;
  url: string;
  dataType: string;
  instruments?: string[];
  accessLevel: "OPEN_ACCESS" | "RESTRICTED" | "ACADEMIC";
  description: string;
  provenance: ProvenanceRecord;
}

export interface PublicSource {
  title: string;
  url: string;
  sourceTier:
    | "TIER_1_OFFICIAL"
    | "TIER_2_ARCHIVE"
    | "TIER_3_PUBLICATION"
    | "TIER_4_CATALOG"
    | "TIER_5_SECONDARY";
  retrievedDate?: string;
}

export interface Organization {
  id: string;
  slug: string;
  officialName: string;
  shortName: string;
  acronym?: string;
  country: string;
  countryCode: string; // ISO 3166-1 alpha-2 or alpha-3
  region: GeographicRegion;
  organizationType: OrganizationType;
  description: string;
  summary: string;
  foundedYear?: number;
  headquarters?: string;
  officialWebsite?: string;
  parentOrganizationId?: string;
  parentOrganizationSlug?: string;
  aliases?: string[];
  isHistorical?: boolean;
  historicalPeriod?: string; // e.g. "1955–1991"
  primaryFocusAreas: string[];
  keyFacilities?: string[];
  dataArchives?: DataArchive[];
  officialSources?: PublicSource[];
  provenance: ProvenanceRecord;
  epistemicStatus?: EpistemicStatus;
}

export interface OrganizationStatistics {
  totalOrganizations: number;
  spaceAgencies: number;
  researchInstitutes: number;
  universities: number;
  observatories: number;
  commercialPartners: number;
  regionsRepresented: number;
  countriesRepresented: number;
}
