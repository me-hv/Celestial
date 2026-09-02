import { describe, it, expect } from "vitest";
import { organizationRepo } from "@/lib/data/organization-repository";
import { OrganizationSchema } from "@/domain/organization/schema";

describe("OrganizationRepository", () => {
  it("loads all organizations and validates schema", () => {
    const all = organizationRepo.getAll();
    expect(all.length).toBeGreaterThanOrEqual(20);

    for (const org of all) {
      const parsed = OrganizationSchema.safeParse(org);
      expect(parsed.success, `Validation failed for ${org.slug}: ${JSON.stringify(parsed.error?.issues)}`).toBe(true);
    }
  });

  it("retrieves organizations by ID, slug, and acronym", () => {
    const isro = organizationRepo.getBySlug("isro");
    expect(isro).toBeDefined();
    expect(isro?.officialName).toBe("Indian Space Research Organisation");
    expect(isro?.country).toBe("India");
    expect(isro?.region).toBe("SOUTH_ASIA");

    const jaxa = organizationRepo.getBySlug("jaxa");
    expect(jaxa).toBeDefined();
    expect(jaxa?.country).toBe("Japan");

    const cnsa = organizationRepo.getBySlug("cnsa");
    expect(cnsa).toBeDefined();
    expect(cnsa?.country).toBe("China");

    const soviet = organizationRepo.getBySlug("soviet-space-programme");
    expect(soviet).toBeDefined();
    expect(soviet?.isHistorical).toBe(true);
  });

  it("filters organizations by region, country, and type", () => {
    const southAsia = organizationRepo.getByRegion("SOUTH_ASIA");
    expect(southAsia.some((o) => o.slug === "isro")).toBe(true);

    const japan = organizationRepo.getByCountry("Japan");
    expect(japan.some((o) => o.slug === "jaxa")).toBe(true);

    const spaceAgencies = organizationRepo.getByType("SPACE_AGENCY");
    expect(spaceAgencies.length).toBeGreaterThanOrEqual(10);
  });

  it("searches organizations by query text", () => {
    const results = organizationRepo.search("lunar");
    expect(results.length).toBeGreaterThan(0);

    const isroQuery = organizationRepo.search("bengaluru");
    expect(isroQuery.some((o) => o.slug === "isro")).toBe(true);
  });

  it("correctly aggregates missions, spacecraft, and discoveries for ISRO", () => {
    const isroMissions = organizationRepo.getMissionsForOrganization("isro");
    expect(isroMissions.length).toBeGreaterThanOrEqual(4);
    expect(isroMissions.some((m) => m.slug === "chandrayaan-3")).toBe(true);
    expect(isroMissions.some((m) => m.slug === "mars-orbiter-mission")).toBe(true);
    expect(isroMissions.some((m) => m.slug === "aditya-l1")).toBe(true);

    const isroSpacecraft = organizationRepo.getSpacecraftForOrganization("isro");
    expect(isroSpacecraft.some((sc) => sc.slug === "vikram-lander")).toBe(true);
    expect(isroSpacecraft.some((sc) => sc.slug === "pragyan-rover")).toBe(true);

    const isroDiscoveries = organizationRepo.getDiscoveriesForOrganization("isro");
    expect(isroDiscoveries.length).toBeGreaterThanOrEqual(2);
  });

  it("correctly aggregates missions for JAXA and CNSA", () => {
    const jaxaMissions = organizationRepo.getMissionsForOrganization("jaxa");
    expect(jaxaMissions.some((m) => m.slug === "hayabusa2")).toBe(true);
    expect(jaxaMissions.some((m) => m.slug === "slim-moon")).toBe(true);

    const cnsaMissions = organizationRepo.getMissionsForOrganization("cnsa");
    expect(cnsaMissions.some((m) => m.slug === "change-4")).toBe(true);
    expect(cnsaMissions.some((m) => m.slug === "tianwen-1")).toBe(true);
  });

  it("provides comprehensive global statistics", () => {
    const stats = organizationRepo.getStatistics();
    expect(stats.totalOrganizations).toBeGreaterThanOrEqual(20);
    expect(stats.spaceAgencies).toBeGreaterThanOrEqual(10);
    expect(stats.regionsRepresented).toBeGreaterThanOrEqual(6);
    expect(stats.countriesRepresented).toBeGreaterThanOrEqual(10);
  });
});
