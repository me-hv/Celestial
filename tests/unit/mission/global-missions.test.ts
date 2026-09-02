import { describe, it, expect } from "vitest";
import { missionRepo } from "@/lib/data/mission-repository";
import { SpaceMissionSchema } from "@/domain/mission/schema";

describe("Global Space Missions & Collaborations", () => {
  it("validates all expanded space missions against schema", () => {
    const all = missionRepo.getAll();
    expect(all.length).toBeGreaterThanOrEqual(12);

    for (const mission of all) {
      const parsed = SpaceMissionSchema.safeParse(mission);
      expect(parsed.success, `Validation failed for mission ${mission.slug}: ${JSON.stringify(parsed.error?.issues)}`).toBe(true);
    }
  });

  it("supports multi-agency international collaborations with roles", () => {
    const ch3 = missionRepo.getBySlug("chandrayaan-3");
    expect(ch3).toBeDefined();
    expect(ch3?.participatingOrganizations).toBeDefined();
    expect(ch3?.participatingOrganizations?.length).toBeGreaterThanOrEqual(2);

    const lead = ch3?.participatingOrganizations?.find((p) => p.role === "LEAD_AGENCY");
    expect(lead?.organizationSlug).toBe("isro");

    const jwst = missionRepo.getBySlug("james-webb-space-telescope");
    expect(jwst).toBeDefined();
    expect(jwst?.participatingOrganizations?.some((p) => p.organizationSlug === "esa")).toBe(true);
    expect(jwst?.participatingOrganizations?.some((p) => p.organizationSlug === "csa")).toBe(true);
  });

  it("filters missions by country, region, and organization", () => {
    const indiaMissions = missionRepo.getByCountry("India");
    expect(indiaMissions.length).toBeGreaterThanOrEqual(4);
    expect(indiaMissions.some((m) => m.slug === "chandrayaan-3")).toBe(true);

    const japanMissions = missionRepo.getByCountry("Japan");
    expect(japanMissions.some((m) => m.slug === "hayabusa2")).toBe(true);

    const asiaPacific = missionRepo.getByRegion("ASIA_PACIFIC");
    expect(asiaPacific.some((m) => m.slug === "change-4")).toBe(true);
    expect(asiaPacific.some((m) => m.slug === "danuri-kplo")).toBe(true);
  });

  it("associates public scientific data archives with missions", () => {
    const ch3 = missionRepo.getBySlug("chandrayaan-3");
    expect(ch3?.dataArchives).toBeDefined();
    expect(ch3?.dataArchives?.[0]?.url).toContain("issdc");

    const hayabusa2 = missionRepo.getBySlug("hayabusa2");
    expect(hayabusa2?.dataArchives).toBeDefined();
    expect(hayabusa2?.dataArchives?.[0]?.url).toContain("darts");
  });
});
