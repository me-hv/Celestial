import { CelestialObject } from "@/domain/celestial-object/types";
import { SOLAR_SYSTEM_OBJECTS, SOLAR_SYSTEM_IDS } from "./solar-system-data";
import { InMemorySearchProvider } from "@/features/search/in-memory-search.provider";
import { SearchQueryOptions, SearchResponse } from "@/features/search/types";

export class CelestialObjectRepository {
  private static instance: CelestialObjectRepository;
  private objects: Map<string, CelestialObject> = new Map();
  private slugIndex: Map<string, CelestialObject> = new Map();
  private searchProvider: InMemorySearchProvider;

  private constructor() {
    this.searchProvider = new InMemorySearchProvider();
    this.initializeData(SOLAR_SYSTEM_OBJECTS);
  }

  public static getInstance(): CelestialObjectRepository {
    if (!CelestialObjectRepository.instance) {
      CelestialObjectRepository.instance = new CelestialObjectRepository();
    }
    return CelestialObjectRepository.instance;
  }

  private initializeData(data: CelestialObject[]): void {
    this.objects.clear();
    this.slugIndex.clear();

    for (const item of data) {
      this.objects.set(item.id, item);
      this.slugIndex.set(item.slug.toLowerCase(), item);
    }

    this.searchProvider.setIndex(Array.from(this.objects.values()));
  }

  public getAll(): CelestialObject[] {
    return Array.from(this.objects.values());
  }

  public getById(id: string): CelestialObject | undefined {
    return this.objects.get(id);
  }

  public getBySlug(slug: string): CelestialObject | undefined {
    return this.slugIndex.get(slug.trim().toLowerCase());
  }

  public getChildrenOf(parentId: string): CelestialObject[] {
    return this.getAll().filter((obj) => obj.parentId === parentId);
  }

  public getPlanets(): CelestialObject[] {
    return this.getAll().filter(
      (obj) => obj.parentId === SOLAR_SYSTEM_IDS.SUN && obj.classification.category === "PLANETARY"
    );
  }

  public async search(options: SearchQueryOptions): Promise<SearchResponse> {
    return this.searchProvider.search(options);
  }
}

export const celestialRepo = CelestialObjectRepository.getInstance();
