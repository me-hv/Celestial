import { StellarSystem } from "@/domain/stellar-system/types";
import { CelestialObject } from "@/domain/celestial-object/types";
import { EXOPLANET_STELLAR_SYSTEMS, EXOPLANET_CELESTIAL_OBJECTS } from "./exoplanet-systems-data";
import { SOLAR_SYSTEM_OBJECTS, SOLAR_SYSTEM_IDS } from "./solar-system-data";
import { HabitableZoneCalculator } from "../astronomy/habitable-zone";

// Canonical Solar System Model as a First-Class StellarSystem
export const SOLAR_SYSTEM_ENTITY: StellarSystem = {
  id: "f0000000-0000-4000-8000-000000000001",
  slug: "solar-system",
  name: "Solar System",
  architecture: "SINGLE_STAR",
  centralBodyIds: [SOLAR_SYSTEM_IDS.SUN],
  planetaryBodyIds: [
    SOLAR_SYSTEM_IDS.MERCURY,
    SOLAR_SYSTEM_IDS.VENUS,
    SOLAR_SYSTEM_IDS.EARTH,
    SOLAR_SYSTEM_IDS.MARS,
    SOLAR_SYSTEM_IDS.JUPITER,
    SOLAR_SYSTEM_IDS.SATURN,
    SOLAR_SYSTEM_IDS.URANUS,
    SOLAR_SYSTEM_IDS.NEPTUNE,
  ],
  minorBodyIds: [SOLAR_SYSTEM_IDS.MOON],
  distanceLightYears: 0,
  distanceParsecs: 0,
  spectralTypeSummary: "G2V Yellow Dwarf (Sol)",
  numberOfStars: 1,
  numberOfPlanets: 8,
  habitableZone: HabitableZoneCalculator.calculate(5778, 1.0, 1.0),
  summary:
    "Our home planetary system, consisting of the Sun, eight planets, moons, asteroids, and comets.",
  provenance: {
    authoritativeBody: "NASA",
    catalogName: "NASA JPL Solar System Dynamics (SSD)",
    recordIdentifier: "NASA-SSD:SOLAR_SYSTEM_J2000",
    confidenceScore: 0.999,
    citationUrl: "https://ssd.jpl.nasa.gov/",
    lastIngestedAt: "2026-08-27T00:00:00Z",
  },
};

export class StellarSystemRepository {
  private readonly systemsMap: Map<string, StellarSystem> = new Map();
  private readonly objectsMap: Map<string, CelestialObject> = new Map();

  constructor() {
    // 1. Index All Stellar Systems
    const allSystems = [SOLAR_SYSTEM_ENTITY, ...EXOPLANET_STELLAR_SYSTEMS];
    for (const sys of allSystems) {
      this.systemsMap.set(sys.id, sys);
      this.systemsMap.set(sys.slug, sys);
    }

    // 2. Index All Celestial Objects (Solar System + Exoplanets)
    const allObjects = [...SOLAR_SYSTEM_OBJECTS, ...EXOPLANET_CELESTIAL_OBJECTS];
    for (const obj of allObjects) {
      this.objectsMap.set(obj.id, obj);
      this.objectsMap.set(obj.slug, obj);
    }
  }

  public getAll(): StellarSystem[] {
    return [SOLAR_SYSTEM_ENTITY, ...EXOPLANET_STELLAR_SYSTEMS];
  }

  public getById(id: string): StellarSystem | undefined {
    return this.systemsMap.get(id);
  }

  public getBySlug(slug: string): StellarSystem | undefined {
    return this.systemsMap.get(slug);
  }

  public getHostStars(systemIdOrSlug: string): CelestialObject[] {
    const system = this.getBySlug(systemIdOrSlug) || this.getById(systemIdOrSlug);
    if (!system) return [];
    return system.centralBodyIds
      .map((id) => this.objectsMap.get(id))
      .filter((o): o is CelestialObject => o !== undefined);
  }

  public getPlanets(systemIdOrSlug: string): CelestialObject[] {
    const system = this.getBySlug(systemIdOrSlug) || this.getById(systemIdOrSlug);
    if (!system) return [];
    return system.planetaryBodyIds
      .map((id) => this.objectsMap.get(id))
      .filter((o): o is CelestialObject => o !== undefined);
  }

  public getAllObjectsForSystem(systemIdOrSlug: string): CelestialObject[] {
    const system = this.getBySlug(systemIdOrSlug) || this.getById(systemIdOrSlug);
    if (!system) return [];
    const ids = [
      ...system.centralBodyIds,
      ...system.planetaryBodyIds,
      ...(system.minorBodyIds || []),
    ];
    return ids
      .map((id) => this.objectsMap.get(id))
      .filter((o): o is CelestialObject => o !== undefined);
  }
}

// Global Repository Singleton
export const stellarSystemRepo = new StellarSystemRepository();
