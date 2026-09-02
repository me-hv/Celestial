import { describe, it, expect } from "vitest";
import { starRepo } from "@/lib/data/star-repository";
import { celestialRepo } from "@/lib/data/celestial-repository";

describe("StarRepository & Stellar Catalog", () => {
  it("indexes confirmed nearby stars across diverse spectral classes and multiplicities", () => {
    const allStars = starRepo.getAll();
    expect(allStars.length).toBeGreaterThanOrEqual(20);

    const slugs = allStars.map((s) => s.slug);
    expect(slugs).toContain("sun");
    expect(slugs).toContain("proxima-centauri");
    expect(slugs).toContain("alpha-centauri-a");
    expect(slugs).toContain("alpha-centauri-b");
    expect(slugs).toContain("sirius-a");
    expect(slugs).toContain("sirius-b");
    expect(slugs).toContain("barnard-s-star");
    expect(slugs).toContain("vega");
    expect(slugs).toContain("altair");
    expect(slugs).toContain("fomalhaut");
    expect(slugs).toContain("trappist-1");
    expect(slugs).toContain("55-cancri");
    expect(slugs).toContain("pollux");
    expect(slugs).toContain("arcturus");
  });

  it("filters stars by spatial distance shells (< 5 pc, < 10 pc)", () => {
    const starsWithin5Pc = starRepo.filter({ maxDistancePc: 5.0 });
    expect(starsWithin5Pc.length).toBeGreaterThanOrEqual(10);

    // Stars within 5 pc include Alpha Cen, Proxima, Barnard's, Sirius, Wolf 359, UV Ceti, 61 Cygni, Procyon
    const slugs5Pc = starsWithin5Pc.map((s) => s.slug);
    expect(slugs5Pc).toContain("proxima-centauri");
    expect(slugs5Pc).toContain("sirius-a");
    expect(slugs5Pc).toContain("barnard-s-star");

    // Stars outside 5 pc must NOT be included in < 5 pc filter
    expect(slugs5Pc).not.toContain("vega"); // Vega is at ~7.68 pc
    expect(slugs5Pc).not.toContain("trappist-1"); // TRAPPIST-1 is at ~12.43 pc
  });

  it("filters stars by spectral classification (e.g. M red dwarfs, A stars, D white dwarfs)", () => {
    const mDwarfs = starRepo.filter({ spectralClass: "M" });
    expect(mDwarfs.length).toBeGreaterThanOrEqual(5);
    mDwarfs.forEach((star) => {
      expect(star.physical.spectralClass?.toUpperCase().startsWith("M")).toBe(true);
    });

    const aStars = starRepo.filter({ spectralClass: "A" });
    const aStarSlugs = aStars.map((s) => s.slug);
    expect(aStarSlugs).toContain("sirius-a");
    expect(aStarSlugs).toContain("vega");

    const whiteDwarfs = starRepo.filter({ spectralClass: "D" });
    const wdSlugs = whiteDwarfs.map((s) => s.slug);
    expect(wdSlugs).toContain("sirius-b");
    expect(wdSlugs).toContain("van-maanen-2");
  });

  it("filters stars with confirmed planetary systems vs. stars with no confirmed planets", () => {
    const starsWithPlanets = starRepo.filter({ hasPlanetarySystem: true });
    const planetHostSlugs = starsWithPlanets.map((s) => s.slug);
    expect(planetHostSlugs).toContain("proxima-centauri");
    expect(planetHostSlugs).toContain("trappist-1");
    expect(planetHostSlugs).toContain("55-cancri");

    const starsWithoutPlanets = starRepo.filter({ hasPlanetarySystem: false });
    const nonHostSlugs = starsWithoutPlanets.map((s) => s.slug);
    expect(nonHostSlugs).toContain("sirius-a");
    expect(nonHostSlugs).toContain("vega");
  });

  it("paginates and sorts stars deterministically by distance", () => {
    const paginated = starRepo.paginate({}, { page: 1, pageSize: 5, sortBy: "distance", sortDirection: "asc" });
    expect(paginated.stars.length).toBe(5);
    expect(paginated.page).toBe(1);
    expect(paginated.totalPages).toBeGreaterThanOrEqual(4);

    // First star should be the Sun (0 pc) followed by Alpha Centauri / Proxima
    expect(paginated.stars[0].slug).toBe("sun");
  });

  it("resolves multi-catalog search queries across common names and catalog IDs (HIP, HD, Gliese, Gaia)", async () => {
    const siriusSearch = await celestialRepo.search({ query: "Sirius" });
    expect(siriusSearch.results.length).toBeGreaterThan(0);
    expect(siriusSearch.results[0].canonicalName).toBe("Sirius A");

    const hipSearch = await celestialRepo.search({ query: "HIP 70890" });
    expect(hipSearch.results.length).toBeGreaterThan(0);
    expect(hipSearch.results[0].canonicalName).toBe("Proxima Centauri");

    const hdSearch = await celestialRepo.search({ query: "HD 128620" });
    expect(hdSearch.results.length).toBeGreaterThan(0);
    expect(hdSearch.results[0].canonicalName).toBe("Alpha Centauri A");

    const gjSearch = await celestialRepo.search({ query: "GJ 699" });
    expect(gjSearch.results.length).toBeGreaterThan(0);
    expect(gjSearch.results[0].canonicalName).toBe("Barnard's Star");
  });

  it("ensures all stars have strictly unique IDs and slugs", () => {
    const allStars = starRepo.getAll();
    const ids = new Set<string>();
    const slugs = new Set<string>();

    allStars.forEach((star) => {
      if (ids.has(star.id)) {
        throw new Error(`Duplicate star ID found: ${star.id} for star ${star.canonicalName}`);
      }
      ids.add(star.id);

      if (slugs.has(star.slug)) {
        throw new Error(`Duplicate star slug found: ${star.slug} for star ${star.canonicalName}`);
      }
      slugs.add(star.slug);
    });
  });
});
