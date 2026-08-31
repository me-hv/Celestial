import { describe, it, expect } from "vitest";
import { cosmicStructureRepo } from "@/lib/data/cosmic-structure-repository";

describe("CosmicStructureRepository", () => {
  it("retrieves all cosmic structures", () => {
    const all = cosmicStructureRepo.getAll();
    expect(all.length).toBeGreaterThanOrEqual(18);
  });

  it("retrieves structure by slug", () => {
    const virgo = cosmicStructureRepo.getBySlug("virgo-cluster");
    expect(virgo).toBeDefined();
    expect(virgo?.name).toBe("Virgo Cluster");
    expect(virgo?.type).toBe("GALAXY_CLUSTER");
  });

  it("retrieves structure by catalog alias or designation", () => {
    const coma = cosmicStructureRepo.getById("Abell 1656");
    expect(coma).toBeDefined();
    expect(coma?.slug).toBe("coma-cluster");

    const laniakea = cosmicStructureRepo.getById("Laniakea");
    expect(laniakea).toBeDefined();
    expect(laniakea?.slug).toBe("laniakea-supercluster");
  });

  it("filters structures by type", () => {
    const voids = cosmicStructureRepo.filter({ type: "VOID" });
    expect(voids.length).toBeGreaterThanOrEqual(2);
    expect(voids.every((v) => v.type === "VOID")).toBe(true);

    const superclusters = cosmicStructureRepo.filter({ type: "SUPERCLUSTER" });
    expect(superclusters.length).toBeGreaterThanOrEqual(3);
  });

  it("filters structures by distance range", () => {
    const nearby = cosmicStructureRepo.filter({ maxDistanceMpc: 10 });
    expect(nearby.length).toBeGreaterThanOrEqual(4); // Local Group, M81, Sculptor, Maffei, Cen A, Local Sheet
  });

  it("traverses hierarchical structure ancestry chain", () => {
    const chain = cosmicStructureRepo.getAncestryChain("local-group");
    expect(chain.length).toBeGreaterThanOrEqual(3);
    expect(chain[0].slug).toBe("local-group");
    expect(chain[1].slug).toBe("local-sheet");
    expect(chain[2].slug).toBe("virgo-supercluster");
  });

  it("retrieves child member structures", () => {
    const sheetChildren = cosmicStructureRepo.getChildren("local-sheet");
    expect(sheetChildren.length).toBeGreaterThanOrEqual(3);
  });

  it("performs comparative analysis between two structures", () => {
    const comp = cosmicStructureRepo.compare("local-group", "virgo-cluster");
    expect(comp).not.toBeNull();
    expect(comp?.structureA.slug).toBe("local-group");
    expect(comp?.structureB.slug).toBe("virgo-cluster");
    expect(comp?.separationVector.separationMpc).toBeGreaterThan(15);
    expect(comp?.massRatio).toBeGreaterThan(100); // Virgo cluster mass ~1.2e15 vs Local Group 3e12
  });
});
