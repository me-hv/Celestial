import { CelestialObject } from "@/domain/celestial-object/types";
import { STELLAR_CATALOG_OBJECTS } from "./stellar-catalog-data";
import { getStarDistancePc } from "../astronomy/coordinates/spatial-query";

export interface StarFilterOptions {
  query?: string;
  maxDistancePc?: number; // e.g. 5, 10, 20, 25
  minDistancePc?: number;
  spectralClass?: string; // e.g. "O", "B", "A", "F", "G", "K", "M", "D" (white dwarf)
  hasPlanetarySystem?: boolean; // true = only with known planetary system, false = only without, undefined = all
  minTemperatureK?: number;
  maxTemperatureK?: number;
  maxMagnitudeV?: number;
  constellation?: string;
  isMultiple?: boolean;
}

export type StarSortField = "distance" | "magnitude" | "name" | "temperature" | "luminosity";
export type SortDirection = "asc" | "desc";

export interface StarPaginationOptions {
  page?: number;
  pageSize?: number;
  sortBy?: StarSortField;
  sortDirection?: SortDirection;
}

export interface PaginatedStarResult {
  stars: CelestialObject[];
  totalMatches: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class StarRepository {
  private readonly starsMap: Map<string, CelestialObject> = new Map();
  private readonly starsList: CelestialObject[] = [];

  constructor(initialStars: CelestialObject[] = STELLAR_CATALOG_OBJECTS) {
    this.starsList = initialStars;
    initialStars.forEach((star) => {
      this.starsMap.set(star.id, star);
      this.starsMap.set(star.slug, star);

      // Index catalog IDs
      if (star.catalogIdentifiers?.hip) {
        this.starsMap.set(star.catalogIdentifiers.hip.toLowerCase(), star);
      }
      if (star.catalogIdentifiers?.hd) {
        this.starsMap.set(star.catalogIdentifiers.hd.toLowerCase(), star);
      }
      if (star.catalogIdentifiers?.gliese) {
        this.starsMap.set(star.catalogIdentifiers.gliese.toLowerCase(), star);
      }
      if (star.catalogIdentifiers?.gaiaDr3) {
        this.starsMap.set(star.catalogIdentifiers.gaiaDr3.toLowerCase(), star);
      }
    });
  }

  public getAll(): CelestialObject[] {
    return [...this.starsList];
  }

  public getById(id: string): CelestialObject | undefined {
    return this.starsMap.get(id);
  }

  public getBySlug(slug: string): CelestialObject | undefined {
    return this.starsMap.get(slug);
  }

  public getByCatalogIdentifier(identifier: string): CelestialObject | undefined {
    return this.starsMap.get(identifier.toLowerCase());
  }

  public filter(options: StarFilterOptions = {}): CelestialObject[] {
    let result = this.starsList;

    // 1. Text Query (Name, Designation, Alias, or Catalog ID)
    if (options.query && options.query.trim()) {
      const q = options.query.trim().toLowerCase();
      result = result.filter((star) => {
        if (star.canonicalName.toLowerCase().includes(q)) return true;
        if (star.standardDesignation?.toLowerCase().includes(q)) return true;
        if (star.slug.includes(q)) return true;
        if (star.aliases.some((a) => a.name.toLowerCase().includes(q))) return true;
        if (star.catalogIdentifiers?.hip?.toLowerCase().includes(q)) return true;
        if (star.catalogIdentifiers?.hd?.toLowerCase().includes(q)) return true;
        if (star.catalogIdentifiers?.gliese?.toLowerCase().includes(q)) return true;
        if (star.catalogIdentifiers?.gaiaDr3?.toLowerCase().includes(q)) return true;
        return false;
      });
    }

    // 2. Distance Bounds (in Parsecs)
    if (options.maxDistancePc !== undefined) {
      result = result.filter((star) => getStarDistancePc(star) <= options.maxDistancePc!);
    }
    if (options.minDistancePc !== undefined) {
      result = result.filter((star) => getStarDistancePc(star) >= options.minDistancePc!);
    }

    // 3. Spectral Class Filter
    if (options.spectralClass && options.spectralClass !== "ALL") {
      const targetClass = options.spectralClass.toUpperCase();
      result = result.filter((star) => {
        const spec = star.physical.spectralClass?.toUpperCase() || "";
        if (targetClass === "D") {
          return spec.startsWith("D") || spec.includes("DA") || spec.includes("DB");
        }
        return spec.startsWith(targetClass);
      });
    }

    // 4. Planetary System Status
    if (options.hasPlanetarySystem !== undefined) {
      result = result.filter((star) => {
        const hasSystem = Boolean(star.hostSystemId);
        return hasSystem === options.hasPlanetarySystem;
      });
    }

    // 5. Temperature Range
    if (options.minTemperatureK !== undefined) {
      result = result.filter(
        (star) =>
          star.physical.effectiveTemperatureK !== undefined &&
          star.physical.effectiveTemperatureK >= options.minTemperatureK!
      );
    }
    if (options.maxTemperatureK !== undefined) {
      result = result.filter(
        (star) =>
          star.physical.effectiveTemperatureK !== undefined &&
          star.physical.effectiveTemperatureK <= options.maxTemperatureK!
      );
    }

    // 6. Apparent Magnitude
    if (options.maxMagnitudeV !== undefined) {
      result = result.filter(
        (star) =>
          star.physical.apparentMagnitudeV !== undefined &&
          star.physical.apparentMagnitudeV <= options.maxMagnitudeV!
      );
    }

    // 7. Multiplicity
    if (options.isMultiple !== undefined) {
      result = result.filter(
        (star) => Boolean(star.physical.isMultipleStarMember) === options.isMultiple
      );
    }

    return result;
  }

  public paginate(
    filterOptions: StarFilterOptions = {},
    paginationOptions: StarPaginationOptions = {}
  ): PaginatedStarResult {
    const filtered = this.filter(filterOptions);
    const {
      page = 1,
      pageSize = 12,
      sortBy = "distance",
      sortDirection = "asc",
    } = paginationOptions;

    // Sorting
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "distance":
          comparison = getStarDistancePc(a) - getStarDistancePc(b);
          break;
        case "magnitude": {
          const magA = a.physical.apparentMagnitudeV ?? a.physical.apparentMagnitudeG ?? 99;
          const magB = b.physical.apparentMagnitudeV ?? b.physical.apparentMagnitudeG ?? 99;
          comparison = magA - magB;
          break;
        }
        case "name":
          comparison = a.canonicalName.localeCompare(b.canonicalName);
          break;
        case "temperature": {
          const tempA = a.physical.effectiveTemperatureK ?? 0;
          const tempB = b.physical.effectiveTemperatureK ?? 0;
          comparison = tempA - tempB;
          break;
        }
        case "luminosity": {
          const lumA = a.physical.luminositySolar ?? 0;
          const lumB = b.physical.luminositySolar ?? 0;
          comparison = lumA - lumB;
          break;
        }
      }
      return sortDirection === "desc" ? -comparison : comparison;
    });

    const totalMatches = sorted.length;
    const totalPages = Math.max(1, Math.ceil(totalMatches / pageSize));
    const safePage = Math.max(1, Math.min(page, totalPages));
    const startIndex = (safePage - 1) * pageSize;
    const paginatedStars = sorted.slice(startIndex, startIndex + pageSize);

    return {
      stars: paginatedStars,
      totalMatches,
      page: safePage,
      pageSize,
      totalPages,
    };
  }
}

// Global Singleton Instance
export const starRepo = new StarRepository();
