import { describe, it, expect } from "vitest";
import { galacticStructureRepo } from "@/lib/data/galactic-structure-repository";

describe("GalacticStructureRepository", () => {
  it("indexes core Galactic structures including Milky Way, Disk, Bulge, Bar, Halo, Center, and Arms", () => {
    const all = galacticStructureRepo.getAll();
    expect(all.length).toBeGreaterThanOrEqual(10);

    const slugs = all.map((s) => s.slug);
    expect(slugs).toContain("milky-way");
    expect(slugs).toContain("galactic-disk");
    expect(slugs).toContain("galactic-bulge");
    expect(slugs).toContain("galactic-bar");
    expect(slugs).toContain("galactic-halo");
    expect(slugs).toContain("galactic-center");
    expect(slugs).toContain("orion-spur");
    expect(slugs).toContain("perseus-arm");
    expect(slugs).toContain("sagittarius-arm");
    expect(slugs).toContain("scutum-centaurus-arm");
    expect(slugs).toContain("local-group");
  });

  it("filters structures by type", () => {
    const spiralArms = galacticStructureRepo.getByType("SPIRAL_ARM");
    expect(spiralArms.length).toBeGreaterThanOrEqual(4);
    spiralArms.forEach((arm) => {
      expect(arm.type).toBe("SPIRAL_ARM");
      expect(arm.spiralArm).toBeDefined();
    });

    const centers = galacticStructureRepo.getByType("GALACTIC_CENTER");
    expect(centers.length).toBe(1);
    expect(centers[0].galacticCenter?.centralBlackHoleName).toBe("Sagittarius A*");
  });

  it("filters structures by Galactocentric radius bounds", () => {
    // Structures within 2 kpc of Galactic Center
    const innerStructures = galacticStructureRepo.filter({ maxRadiusKpc: 2.0 });
    const innerSlugs = innerStructures.map((s) => s.slug);
    expect(innerSlugs).toContain("galactic-center");
    expect(innerSlugs).toContain("galactic-bulge");
  });

  it("retrieves containing structures for a Galactocentric coordinate", () => {
    // Solar coordinate: R_GC = 8.178 kpc, z = +20.8 pc
    const sunCoord = {
      xPc: -8178.0,
      yPc: 0.0,
      zPc: 20.8,
      rGalactocentricPc: 8178.0,
      inPlaneRadiusPc: 8178.0,
      azimuthDeg: 180.0,
    };

    const containing = galacticStructureRepo.getContainingStructures(sunCoord);
    const slugs = containing.map((s) => s.slug);
    expect(slugs).toContain("milky-way");
    expect(slugs).toContain("galactic-disk");
    expect(slugs).toContain("orion-spur");
    expect(slugs).toContain("local-group");
  });
});
