import { describe, it, expect } from "vitest";
import { cosmicEpochRepo } from "@/lib/data/cosmic-epoch-repository";

describe("CosmicEpochRepository", () => {
  it("retrieves all 14 epochs in order", () => {
    const epochs = cosmicEpochRepo.getAll();
    expect(epochs.length).toBe(14);
    expect(epochs[0].slug).toBe("planck-epoch");
    expect(epochs[13].slug).toBe("modern-universe");
  });

  it("retrieves epochs by slug", () => {
    const recomb = cosmicEpochRepo.getBySlug("recombination");
    expect(recomb).toBeDefined();
    expect(recomb?.name).toBe("Recombination & Photon Decoupling");
    expect(recomb?.type).toBe("RECOMBINATION");
  });

  it("maps cosmological redshifts to correct epochs", () => {
    expect(cosmicEpochRepo.getEpochForRedshift(0.0).slug).toBe("modern-universe");
    expect(cosmicEpochRepo.getEpochForRedshift(0.2).slug).toBe("modern-universe");
    expect(cosmicEpochRepo.getEpochForRedshift(1.5).slug).toBe("galaxy-assembly");
    expect(cosmicEpochRepo.getEpochForRedshift(4.0).slug).toBe("early-galaxies");
    expect(cosmicEpochRepo.getEpochForRedshift(8.0).slug).toBe("reionization");
    expect(cosmicEpochRepo.getEpochForRedshift(20.0).slug).toBe("first-stars");
    expect(cosmicEpochRepo.getEpochForRedshift(500.0).slug).toBe("dark-ages");
    expect(cosmicEpochRepo.getEpochForRedshift(1089.0).slug).toBe("recombination");
  });

  it("maps cosmic age to correct epochs", () => {
    const SECONDS_PER_YEAR = 31557600;
    expect(cosmicEpochRepo.getEpochForCosmicAge(1e-44 / SECONDS_PER_YEAR).slug).toBe("planck-epoch");
    expect(cosmicEpochRepo.getEpochForCosmicAge(1e-34 / SECONDS_PER_YEAR).slug).toBe("inflation");
    expect(cosmicEpochRepo.getEpochForCosmicAge(1e-8 / SECONDS_PER_YEAR).slug).toBe("quark-epoch");
    expect(cosmicEpochRepo.getEpochForCosmicAge(3 / (60 * 24 * 365.25)).slug).toBe("nucleosynthesis"); // 3 min
    expect(cosmicEpochRepo.getEpochForCosmicAge(380000).slug).toBe("recombination");
    expect(cosmicEpochRepo.getEpochForCosmicAge(50000000).slug).toBe("dark-ages");
    expect(cosmicEpochRepo.getEpochForCosmicAge(150000000).slug).toBe("first-stars");
    expect(cosmicEpochRepo.getEpochForCosmicAge(800000000).slug).toBe("reionization");
    expect(cosmicEpochRepo.getEpochForCosmicAge(2000000000).slug).toBe("early-galaxies");
    expect(cosmicEpochRepo.getEpochForCosmicAge(5000000000).slug).toBe("galaxy-assembly");
    expect(cosmicEpochRepo.getEpochForCosmicAge(13800000000).slug).toBe("modern-universe");
  });

  it("retrieves surrounding epochs for sequential pagination", () => {
    const { prev, next } = cosmicEpochRepo.getSurroundingEpochs("recombination");
    expect(prev?.slug).toBe("nucleosynthesis");
    expect(next?.slug).toBe("dark-ages");

    const first = cosmicEpochRepo.getSurroundingEpochs("planck-epoch");
    expect(first.prev).toBeUndefined();
    expect(first.next?.slug).toBe("inflation");

    const last = cosmicEpochRepo.getSurroundingEpochs("modern-universe");
    expect(last.prev?.slug).toBe("galaxy-assembly");
    expect(last.next).toBeUndefined();
  });

  it("searches epochs by keywords and physical processes", () => {
    const cmbMatches = cosmicEpochRepo.search("microwave");
    expect(cmbMatches.some((e) => e.slug === "recombination")).toBe(true);

    const jwstMatches = cosmicEpochRepo.search("JWST");
    expect(jwstMatches.length).toBeGreaterThan(0);
  });
});
