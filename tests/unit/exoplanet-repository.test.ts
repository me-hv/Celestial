import { describe, it, expect } from "vitest";
import { stellarSystemRepo } from "@/lib/data/stellar-system-repository";
import { celestialRepo } from "@/lib/data/celestial-repository";

describe("StellarSystemRepository & Exoplanet Catalog", () => {
  it("indexes confirmed stellar systems including Solar System, TRAPPIST-1, Proxima, and Kepler-90", () => {
    const allSystems = stellarSystemRepo.getAll();
    expect(allSystems.length).toBeGreaterThanOrEqual(8);

    const slugs = allSystems.map((s) => s.slug);
    expect(slugs).toContain("solar-system");
    expect(slugs).toContain("trappist-1");
    expect(slugs).toContain("proxima-centauri");
    expect(slugs).toContain("alpha-centauri");
    expect(slugs).toContain("kepler-90");
    expect(slugs).toContain("55-cancri");
    expect(slugs).toContain("wasp-12");
    expect(slugs).toContain("hd-209458");
  });

  it("accurately models the TRAPPIST-1 host star and 7 confirmed exoplanets", () => {
    const trappistSys = stellarSystemRepo.getBySlug("trappist-1");
    expect(trappistSys).toBeDefined();
    expect(trappistSys?.numberOfPlanets).toBe(7);

    const hostStars = stellarSystemRepo.getHostStars(trappistSys!.id);
    expect(hostStars.length).toBe(1);
    expect(hostStars[0].canonicalName).toBe("TRAPPIST-1");
    expect(hostStars[0].classification.code).toBe("STAR");

    const planets = stellarSystemRepo.getPlanets(trappistSys!.id);
    expect(planets.length).toBe(7);

    const planetNames = planets.map((p) => p.canonicalName);
    expect(planetNames).toContain("TRAPPIST-1 b");
    expect(planetNames).toContain("TRAPPIST-1 e");
    expect(planetNames).toContain("TRAPPIST-1 h");
  });

  it("preserves explicit measurement uncertainties for exoplanets", () => {
    const trappist1e = celestialRepo.getBySlug("trappist-1-e");
    expect(trappist1e).toBeDefined();

    const massUncertainty = trappist1e?.physical.measurementsWithUncertainty?.massEarth?.uncertainty;
    expect(massUncertainty).toBeDefined();
    expect(massUncertainty?.upper).toBe(0.022);
    expect(massUncertainty?.lower).toBe(-0.022);
  });

  it("resolves multi-catalog search queries for stars and exoplanets", async () => {
    const trappistSearch = await celestialRepo.search({ query: "trappist-1 e" });
    expect(trappistSearch.results.length).toBeGreaterThan(0);
    expect(trappistSearch.results[0].canonicalName).toBe("TRAPPIST-1 e");
    expect(trappistSearch.results[0].objectType).toBe("EXOPLANET");

    const proximaSearch = await celestialRepo.search({ query: "proxima" });
    expect(proximaSearch.results.length).toBeGreaterThan(0);

    const janssenSearch = await celestialRepo.search({ query: "janssen" });
    expect(janssenSearch.results.length).toBeGreaterThan(0);
    expect(janssenSearch.results[0].canonicalName).toBe("55 Cancri e");
  });
});
