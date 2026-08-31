import { describe, it, expect } from "vitest";
import { deepSkyRepo } from "@/lib/data/deep-sky-repository";

describe("DeepSkyRepository & Deep Sky Catalog", () => {
  it("indexes verified deep sky objects across all five taxonomy categories", () => {
    const all = deepSkyRepo.getAll();
    expect(all.length).toBeGreaterThanOrEqual(15);

    const slugs = all.map((o) => o.slug);
    expect(slugs).toContain("m31-andromeda-galaxy");
    expect(slugs).toContain("m33-triangulum-galaxy");
    expect(slugs).toContain("m42-orion-nebula");
    expect(slugs).toContain("m45-pleiades-cluster");
    expect(slugs).toContain("m57-ring-nebula");
    expect(slugs).toContain("m1-crab-nebula");
  });

  it("filters objects by classification category (Galaxies, Nebulae, Clusters, Planetary Nebulae, SNR)", () => {
    const galaxies = deepSkyRepo.filter({ classificationCode: "GALAXY" });
    expect(galaxies.length).toBeGreaterThanOrEqual(5);
    galaxies.forEach((g) => {
      expect(g.classification.code).toBe("GALAXY");
      expect(g.deepSky?.galaxy).toBeDefined();
    });

    const nebulae = deepSkyRepo.filter({ classificationCode: "NEBULA" });
    expect(nebulae.length).toBeGreaterThanOrEqual(4);

    const clusters = deepSkyRepo.filter({ classificationCode: "STAR_CLUSTER" });
    expect(clusters.length).toBeGreaterThanOrEqual(4);

    const planetary = deepSkyRepo.filter({ classificationCode: "PLANETARY_NEBULA" });
    expect(planetary.length).toBeGreaterThanOrEqual(2);

    const snr = deepSkyRepo.filter({ classificationCode: "SUPERNOVA_REMNANT" });
    expect(snr.length).toBeGreaterThanOrEqual(2);
  });

  it("filters objects by catalog (Messier, NGC, IC)", () => {
    const messier = deepSkyRepo.filter({ catalog: "MESSIER" });
    expect(messier.length).toBeGreaterThanOrEqual(10);
    messier.forEach((m) => {
      expect(m.catalogIdentifiers?.messier).toBeDefined();
    });

    const ngc = deepSkyRepo.filter({ catalog: "NGC" });
    expect(ngc.length).toBeGreaterThanOrEqual(10);
    ngc.forEach((n) => {
      expect(n.catalogIdentifiers?.ngc).toBeDefined();
    });
  });

  it("filters objects by maximum apparent magnitude threshold", () => {
    const nakedEye = deepSkyRepo.filter({ maxMagnitudeV: 6.0 });
    expect(nakedEye.length).toBeGreaterThanOrEqual(5);
    nakedEye.forEach((obj) => {
      expect(obj.physical.apparentMagnitudeV).toBeLessThanOrEqual(6.0);
    });
  });

  it("paginates and sorts deep-sky objects deterministically by distance", () => {
    const paginated = deepSkyRepo.paginate({}, { page: 1, pageSize: 6, sortBy: "distance", sortDirection: "asc" });
    expect(paginated.objects.length).toBe(6);
    expect(paginated.page).toBe(1);
    expect(paginated.totalPages).toBeGreaterThanOrEqual(3);

    // Closer Milky Way objects (e.g. Pleiades at ~444 ly or Helix at ~655 ly) must precede distant galaxies (M31 at 2.54 Mly)
    expect(paginated.objects[0].positional.distanceLightYears).toBeLessThan(1000);
  });

  it("executes angular radius spatial queries correctly", () => {
    // Search around Orion Nebula (RA = 83.82, Dec = -5.39) within 5 degrees
    const neighbors = deepSkyRepo.getObjectsWithinAngularRadius(83.8221, -5.3911, 5.0);
    expect(neighbors.length).toBeGreaterThanOrEqual(2);

    const names = neighbors.map((n) => n.object.canonicalName);
    expect(names).toContain("Orion Nebula");
    expect(names).toContain("Horsehead Nebula");
  });
});
