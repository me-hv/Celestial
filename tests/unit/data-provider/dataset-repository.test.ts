import { describe, it, expect } from "vitest";
import { datasetRepo } from "@/lib/data/dataset-repository";
import { dataProviderRegistry } from "@/lib/data-providers/registry";

describe("Phase 13: Scientific Data Providers & Dataset Repository", () => {
  it("loads all authoritative data providers including ISRO, NASA, ESA, JAXA, CNSA, ESO, NOAA", () => {
    const providers = dataProviderRegistry.getAll();
    expect(providers.length).toBeGreaterThanOrEqual(7);

    const isro = dataProviderRegistry.getBySlug("isro-issdc");
    expect(isro).toBeDefined();
    expect(isro?.organizationSlug).toBe("isro");
    expect(isro?.epistemicRating).toBe("OFFICIAL_AUTHORITY");

    const jaxa = dataProviderRegistry.getBySlug("jaxa-darts");
    expect(jaxa).toBeDefined();
    expect(jaxa?.name).toContain("Data Archives");
  });

  it("retrieves scientific datasets across agencies with full provenance and audit trails", () => {
    const datasets = datasetRepo.getAll();
    expect(datasets.length).toBeGreaterThanOrEqual(8);

    // Chandrayaan-3 ChaSTE in-situ thermophysics
    const chaste = datasetRepo.getBySlug("chandrayaan3-chaste-thermophysics");
    expect(chaste).toBeDefined();
    expect(chaste?.organizationSlug).toBe("isro");
    expect(chaste?.epistemicStatus).toBe("OBSERVED");
    expect(chaste?.transformationHistory.length).toBeGreaterThan(0);
    expect(chaste?.parametersMeasured).toContain("Surface Regolith Temperature (K)");

    // Gaia DR3
    const gaia = datasetRepo.getBySlug("gaia-dr3-astrometric-catalogue");
    expect(gaia).toBeDefined();
    expect(gaia?.recordCount).toBeGreaterThan(1000000000);
  });

  it("filters datasets by discipline, wavelength, and search query", () => {
    const planetary = datasetRepo.filter({ discipline: "PLANETARY_SCIENCE" });
    expect(planetary.length).toBeGreaterThan(0);

    const infrared = datasetRepo.filter({ wavelengthBand: "INFRARED" });
    expect(infrared.length).toBeGreaterThan(0);

    const sulfurSearch = datasetRepo.filter({ search: "Sulfur" });
    expect(sulfurSearch.some((d) => d.slug === "chandrayaan3-pragyan-libs-spectra")).toBe(true);
  });
});
