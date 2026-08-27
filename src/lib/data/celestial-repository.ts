import { CelestialObject } from "@/domain/celestial-object/types";
import { SOLAR_SYSTEM_OBJECTS } from "./solar-system-data";
import { EXOPLANET_CELESTIAL_OBJECTS } from "./exoplanet-systems-data";
import { InMemorySearchProvider } from "@/features/search/in-memory-search.provider";
import { SearchQuery } from "@/features/search/types";

export class CelestialObjectRepository {
  private readonly objects: Map<string, CelestialObject> = new Map();
  private readonly searchProvider: InMemorySearchProvider;

  constructor() {
    const allObjects = [...SOLAR_SYSTEM_OBJECTS, ...EXOPLANET_CELESTIAL_OBJECTS];

    // Populate objects map by both ID and Slug
    allObjects.forEach((obj) => {
      this.objects.set(obj.id, obj);
      this.objects.set(obj.slug, obj);
    });

    this.searchProvider = new InMemorySearchProvider(allObjects);
  }

  public getAll(): CelestialObject[] {
    const uniqueMap = new Map<string, CelestialObject>();
    this.objects.forEach((obj) => {
      uniqueMap.set(obj.id, obj);
    });
    return Array.from(uniqueMap.values());
  }

  public getById(id: string): CelestialObject | undefined {
    return this.objects.get(id);
  }

  public getBySlug(slug: string): CelestialObject | undefined {
    return this.objects.get(slug);
  }

  public getByHostSystem(systemIdOrSlug: string): CelestialObject[] {
    return this.getAll().filter(
      (obj) =>
        obj.hostSystemId === systemIdOrSlug ||
        obj.hostSystemId === this.objects.get(systemIdOrSlug)?.id
    );
  }

  public getPlanets(hostSystemId?: string): CelestialObject[] {
    return this.getAll().filter((obj) => {
      const isPlanet =
        obj.classification.category === "PLANETARY" && obj.classification.code !== "MOON";
      if (!isPlanet) return false;
      if (hostSystemId) {
        return (
          obj.hostSystemId === hostSystemId ||
          obj.hostSystemId === this.objects.get(hostSystemId)?.id
        );
      }
      return true;
    });
  }

  public getStars(): CelestialObject[] {
    return this.getAll().filter((obj) => obj.classification.code === "STAR");
  }

  public getChildrenOf(parentId: string): CelestialObject[] {
    return this.getAll().filter((obj) => obj.parentId === parentId);
  }

  public async search(query: SearchQuery) {
    return this.searchProvider.search(query);
  }
}

// Global Singleton Repository Instance
export const celestialRepo = new CelestialObjectRepository();
