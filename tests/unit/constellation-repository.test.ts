import { describe, it, expect } from "vitest";
import { constellationRepo } from "@/lib/data/constellation-repository";
import { ConstellationSchema } from "@/domain/constellation/schema";

describe("Constellation Repository & IAU Data Validation", () => {
  it("retrieves all curated constellations and validates schemas", () => {
    const all = constellationRepo.getAll();
    expect(all.length).toBeGreaterThanOrEqual(10);

    for (const c of all) {
      const parsed = ConstellationSchema.safeParse(c);
      expect(parsed.success).toBe(true);
      expect(c.iauCode.length).toBe(3);
      expect(c.asterismLines.length).toBeGreaterThan(0);
    }
  });

  it("retrieves constellation by IAU 3-letter abbreviation", () => {
    const orion = constellationRepo.getByCode("ORI");
    expect(orion).toBeDefined();
    expect(orion?.name).toBe("Orion");
    expect(orion?.brightestStar.name).toBe("Rigel");

    const uma = constellationRepo.getByCode("UMA");
    expect(uma).toBeDefined();
    expect(uma?.name).toBe("Ursa Major");
  });

  it("finds closest constellation for celestial coordinates", () => {
    // Betelgeuse coordinates (RA ~88.8°, Dec ~+7.4°)
    const match = constellationRepo.getClosestForCoordinates(88.79, 7.41);
    expect(match).toBeDefined();
    expect(match?.name).toBe("Orion");
  });

  it("searches constellations by name, code, and brightest star", () => {
    const searchByName = constellationRepo.search("Scorpius");
    expect(searchByName.some((c) => c.iauCode === "SCO")).toBe(true);

    const searchByStar = constellationRepo.search("Vega");
    expect(searchByStar.some((c) => c.iauCode === "LYR")).toBe(true);
  });
});
