import {
  Organization,
  OrganizationStatistics,
  GeographicRegion,
  OrganizationType,
} from "@/domain/organization/types";
import { ORGANIZATIONS_DATA } from "./organization-data";
import {
  SPACE_MISSIONS,
  SPACECRAFT_DATA,
  MISSION_INSTRUMENTS,
  SCIENTIFIC_DISCOVERIES,
} from "./mission-data";
import {
  SpaceMission,
  Spacecraft,
  MissionInstrument,
  ScientificDiscovery,
} from "@/domain/mission/types";

export class OrganizationRepository {
  private static instance: OrganizationRepository;
  private organizations: Organization[];

  private constructor() {
    this.organizations = [...ORGANIZATIONS_DATA];
  }

  public static getInstance(): OrganizationRepository {
    if (!OrganizationRepository.instance) {
      OrganizationRepository.instance = new OrganizationRepository();
    }
    return OrganizationRepository.instance;
  }

  public getAll(): Organization[] {
    return this.organizations;
  }

  public getById(id: string): Organization | undefined {
    return this.organizations.find((org) => org.id === id);
  }

  public getBySlug(slug: string): Organization | undefined {
    const s = slug.toLowerCase();
    return this.organizations.find(
      (org) =>
        org.slug.toLowerCase() === s ||
        (org.acronym && org.acronym.toLowerCase() === s) ||
        (org.aliases && org.aliases.some((a) => a.toLowerCase() === s))
    );
  }

  public getByRegion(region: GeographicRegion): Organization[] {
    return this.organizations.filter((org) => org.region === region);
  }

  public getByCountry(country: string): Organization[] {
    const c = country.toLowerCase();
    return this.organizations.filter(
      (org) => org.country.toLowerCase().includes(c) || org.countryCode.toLowerCase() === c
    );
  }

  public getByType(type: OrganizationType): Organization[] {
    return this.organizations.filter((org) => org.organizationType === type);
  }

  public search(query: string): Organization[] {
    if (!query.trim()) return this.organizations;
    const q = query.toLowerCase();
    return this.organizations.filter(
      (org) =>
        org.officialName.toLowerCase().includes(q) ||
        org.shortName.toLowerCase().includes(q) ||
        (org.acronym && org.acronym.toLowerCase().includes(q)) ||
        org.country.toLowerCase().includes(q) ||
        (org.headquarters && org.headquarters.toLowerCase().includes(q)) ||
        (org.summary && org.summary.toLowerCase().includes(q)) ||
        (org.description && org.description.toLowerCase().includes(q)) ||
        (org.aliases && org.aliases.some((a) => a.toLowerCase().includes(q))) ||
        (org.keyFacilities && org.keyFacilities.some((k) => k.toLowerCase().includes(q))) ||
        org.primaryFocusAreas.some((f) => f.toLowerCase().includes(q))
    );
  }

  public getMissionsForOrganization(orgSlugOrId: string): SpaceMission[] {
    const org = this.getBySlug(orgSlugOrId) || this.getById(orgSlugOrId);
    if (!org) return [];

    const slug = org.slug.toLowerCase();
    const acronym = org.acronym ? org.acronym.toLowerCase() : "";

    return SPACE_MISSIONS.filter((m) => {
      // 1. Check direct agency or leadOrganizationSlug
      if (m.agency && (m.agency.toLowerCase() === slug || m.agency.toLowerCase() === acronym)) {
        return true;
      }
      if (m.leadOrganizationSlug && m.leadOrganizationSlug.toLowerCase() === slug) {
        return true;
      }
      // 2. Check participating organizations list
      if (
        m.participatingOrganizations &&
        m.participatingOrganizations.some(
          (p) =>
            p.organizationSlug.toLowerCase() === slug ||
            (org.acronym && p.organizationName.toLowerCase().includes(org.acronym.toLowerCase()))
        )
      ) {
        return true;
      }
      return false;
    });
  }

  public getSpacecraftForOrganization(orgSlugOrId: string): Spacecraft[] {
    const missions = this.getMissionsForOrganization(orgSlugOrId);
    const spacecraftIds = new Set<string>();
    missions.forEach((m) => m.spacecraftIds.forEach((id) => spacecraftIds.add(id)));
    return SPACECRAFT_DATA.filter((sc) => spacecraftIds.has(sc.id));
  }

  public getInstrumentsForOrganization(orgSlugOrId: string): MissionInstrument[] {
    const missions = this.getMissionsForOrganization(orgSlugOrId);
    const instrumentIds = new Set<string>();
    missions.forEach((m) => m.instrumentIds.forEach((id) => instrumentIds.add(id)));
    return MISSION_INSTRUMENTS.filter((inst) => instrumentIds.has(inst.id));
  }

  public getDiscoveriesForOrganization(orgSlugOrId: string): ScientificDiscovery[] {
    const missions = this.getMissionsForOrganization(orgSlugOrId);
    const discoveryIds = new Set<string>();
    missions.forEach((m) => m.discoveryIds.forEach((id) => discoveryIds.add(id)));
    return SCIENTIFIC_DISCOVERIES.filter((disc) => discoveryIds.has(disc.id));
  }

  public getStatistics(): OrganizationStatistics {
    const spaceAgencies = this.organizations.filter(
      (o) => o.organizationType === "SPACE_AGENCY"
    ).length;
    const researchInstitutes = this.organizations.filter(
      (o) =>
        o.organizationType === "NATIONAL_RESEARCH_INSTITUTE" ||
        o.organizationType === "GOVERNMENT_RESEARCH_ORGANIZATION"
    ).length;
    const universities = this.organizations.filter(
      (o) => o.organizationType === "UNIVERSITY"
    ).length;
    const observatories = this.organizations.filter(
      (o) => o.organizationType === "OBSERVATORY"
    ).length;
    const commercialPartners = this.organizations.filter(
      (o) => o.organizationType === "COMMERCIAL_SPACE_COMPANY"
    ).length;

    const regions = new Set(this.organizations.map((o) => o.region));
    const countries = new Set(this.organizations.map((o) => o.country));

    return {
      totalOrganizations: this.organizations.length,
      spaceAgencies,
      researchInstitutes,
      universities,
      observatories,
      commercialPartners,
      regionsRepresented: regions.size,
      countriesRepresented: countries.size,
    };
  }
}

export const organizationRepo = OrganizationRepository.getInstance();
