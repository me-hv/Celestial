import { describe, it, expect } from "vitest";
import { GalaxySchema } from "@/domain/galaxy/schema";
import { LOCAL_GROUP_GALAXIES_DATA } from "@/lib/data/galaxy-data";

describe("Galaxy Domain Model & Schema Validation", () => {
  it("should validate all curated Local Group galaxies against GalaxySchema", () => {
    expect(LOCAL_GROUP_GALAXIES_DATA.length).toBeGreaterThanOrEqual(5);

    for (const galaxy of LOCAL_GROUP_GALAXIES_DATA) {
      const parsed = GalaxySchema.safeParse(galaxy);
      expect(
        parsed.success,
        `Validation failed for galaxy "${galaxy.name}" (${galaxy.slug}): ${JSON.stringify(parsed.error?.format())}`
      ).toBe(true);
    }
  });

  it("should validate Andromeda Galaxy (M31) physical and kinematic properties", () => {
    const m31 = LOCAL_GROUP_GALAXIES_DATA.find((g) => g.slug === "andromeda-galaxy");
    expect(m31).toBeDefined();
    if (!m31) return;

    expect(m31.morphology.class).toBe("BARRED_SPIRAL");
    expect(m31.morphology.hubbleDeVaucouleurs).toContain("SA(s)b");
    expect(m31.distance.distanceKpc.value).toBeCloseTo(778.0, 1);
    expect(m31.distance.primaryMethod).toBe("TRGB");
    expect(m31.kinematics.heliocentricRadialVelocityKmS.value).toBeCloseTo(-301.0, 1);
    expect(m31.kinematics.galactocentricRadialVelocityKmS?.value).toBeCloseTo(-110.0, 1);
    expect(m31.orientation.inclinationDeg).toBe(77.0);
    expect(m31.provenance.catalogName).toContain("NASA/IPAC");
  });

  it("should validate Triangulum Galaxy (M33) properties", () => {
    const m33 = LOCAL_GROUP_GALAXIES_DATA.find((g) => g.slug === "triangulum-galaxy");
    expect(m33).toBeDefined();
    if (!m33) return;

    expect(m33.morphology.class).toBe("SPIRAL");
    expect(m33.morphology.hubbleDeVaucouleurs).toBe("SA(s)cd");
    expect(m33.distance.distanceKpc.value).toBeCloseTo(859.0, 1);
    expect(m33.distance.primaryMethod).toBe("CEPHEID");
    expect(m33.orientation.inclinationDeg).toBe(56.0);
  });

  it("should validate Large Magellanic Cloud (LMC) satellite properties", () => {
    const lmc = LOCAL_GROUP_GALAXIES_DATA.find((g) => g.slug === "large-magellanic-cloud");
    expect(lmc).toBeDefined();
    if (!lmc) return;

    expect(lmc.morphology.class).toBe("IRREGULAR");
    expect(lmc.groupMembership?.membershipType).toBe("SATELLITE");
    expect(lmc.groupMembership?.parentGalaxySlug).toBe("milky-way-galaxy");
    expect(lmc.distance.distanceKpc.value).toBeCloseTo(49.97, 2);
  });
});
