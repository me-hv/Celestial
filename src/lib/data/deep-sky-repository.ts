import { CelestialObject } from "@/domain/celestial-object/types";
import { DEEP_SKY_CELESTIAL_OBJECTS } from "./deep-sky-data";
import { computeAngularSeparation } from "../astronomy/coordinates/angular-separation";

export interface DeepSkyFilterOptions {
  query?: string;
  classificationCode?:
    "GALAXY" | "NEBULA" | "STAR_CLUSTER" | "PLANETARY_NEBULA" | "SUPERNOVA_REMNANT" | "ALL";
  galaxySubtype?: "SPIRAL" | "ELLIPTICAL" | "LENTICULAR" | "IRREGULAR" | "DWARF";
  nebulaSubtype?: "EMISSION" | "REFLECTION" | "DARK" | "DIFFUSE" | "STAR_FORMING";
  clusterSubtype?: "OPEN_CLUSTER" | "GLOBULAR_CLUSTER" | "STELLAR_ASSOCIATION";
  maxDistanceLy?: number;
  maxMagnitudeV?: number;
  constellation?: string;
  catalog?: "MESSIER" | "NGC" | "IC" | "CALDWELL" | "ALL";
}

export type DeepSkySortField = "distance" | "magnitude" | "name" | "ra" | "dec";
export type SortDirection = "asc" | "desc";

export interface DeepSkyPaginationOptions {
  page?: number;
  pageSize?: number;
  sortBy?: DeepSkySortField;
  sortDirection?: SortDirection;
}

export interface PaginatedDeepSkyResult {
  objects: CelestialObject[];
  totalMatches: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class DeepSkyRepository {
  private readonly objectsMap: Map<string, CelestialObject> = new Map();
  private readonly objectsList: CelestialObject[] = [];

  constructor(initialObjects: CelestialObject[] = DEEP_SKY_CELESTIAL_OBJECTS) {
    this.objectsList = initialObjects;
    initialObjects.forEach((obj) => {
      this.objectsMap.set(obj.id, obj);
      this.objectsMap.set(obj.slug, obj);

      // Index catalog IDs
      if (obj.catalogIdentifiers?.messier) {
        this.objectsMap.set(obj.catalogIdentifiers.messier.toLowerCase(), obj);
        this.objectsMap.set(obj.catalogIdentifiers.messier.replace(/\s+/g, "").toLowerCase(), obj);
      }
      if (obj.catalogIdentifiers?.ngc) {
        this.objectsMap.set(obj.catalogIdentifiers.ngc.toLowerCase(), obj);
        this.objectsMap.set(obj.catalogIdentifiers.ngc.replace(/\s+/g, "").toLowerCase(), obj);
      }
      if (obj.catalogIdentifiers?.ic) {
        this.objectsMap.set(obj.catalogIdentifiers.ic.toLowerCase(), obj);
        this.objectsMap.set(obj.catalogIdentifiers.ic.replace(/\s+/g, "").toLowerCase(), obj);
      }
      if (obj.catalogIdentifiers?.caldwell) {
        this.objectsMap.set(obj.catalogIdentifiers.caldwell.toLowerCase(), obj);
        this.objectsMap.set(obj.catalogIdentifiers.caldwell.replace(/\s+/g, "").toLowerCase(), obj);
      }
    });
  }

  public getAll(): CelestialObject[] {
    return [...this.objectsList];
  }

  public getById(id: string): CelestialObject | undefined {
    return this.objectsMap.get(id);
  }

  public getBySlug(slug: string): CelestialObject | undefined {
    return this.objectsMap.get(slug);
  }

  public getByCatalogIdentifier(identifier: string): CelestialObject | undefined {
    const clean = identifier.trim().toLowerCase();
    return this.objectsMap.get(clean) || this.objectsMap.get(clean.replace(/\s+/g, ""));
  }

  public getObjectsWithinAngularRadius(
    centerRaDeg: number,
    centerDecDeg: number,
    maxRadiusDeg: number
  ): Array<{ object: CelestialObject; separationDeg: number }> {
    const results: Array<{ object: CelestialObject; separationDeg: number }> = [];

    for (const obj of this.objectsList) {
      if (
        obj.positional.rightAscensionDeg !== undefined &&
        obj.positional.declinationDeg !== undefined
      ) {
        const sep = computeAngularSeparation(
          { raDeg: centerRaDeg, decDeg: centerDecDeg },
          { raDeg: obj.positional.rightAscensionDeg, decDeg: obj.positional.declinationDeg }
        );
        if (sep.degrees <= maxRadiusDeg) {
          results.push({ object: obj, separationDeg: sep.degrees });
        }
      }
    }

    results.sort((a, b) => a.separationDeg - b.separationDeg);
    return results;
  }

  public filter(options: DeepSkyFilterOptions = {}): CelestialObject[] {
    let result = this.objectsList;

    // 1. Text Query (Name, Designation, Alias, or Catalog ID)
    if (options.query && options.query.trim()) {
      const q = options.query.trim().toLowerCase();
      const qClean = q.replace(/\s+/g, "");

      result = result.filter((obj) => {
        if (obj.canonicalName.toLowerCase().includes(q)) return true;
        if (obj.standardDesignation?.toLowerCase().includes(q)) return true;
        if (obj.slug.includes(q)) return true;
        if (
          obj.aliases.some(
            (a) =>
              a.name.toLowerCase().includes(q) ||
              a.name.toLowerCase().replace(/\s+/g, "").includes(qClean)
          )
        )
          return true;
        if (
          obj.catalogIdentifiers?.messier?.toLowerCase().includes(q) ||
          obj.catalogIdentifiers?.messier?.toLowerCase().replace(/\s+/g, "").includes(qClean)
        )
          return true;
        if (
          obj.catalogIdentifiers?.ngc?.toLowerCase().includes(q) ||
          obj.catalogIdentifiers?.ngc?.toLowerCase().replace(/\s+/g, "").includes(qClean)
        )
          return true;
        if (
          obj.catalogIdentifiers?.ic?.toLowerCase().includes(q) ||
          obj.catalogIdentifiers?.ic?.toLowerCase().replace(/\s+/g, "").includes(qClean)
        )
          return true;
        if (obj.catalogIdentifiers?.caldwell?.toLowerCase().includes(q)) return true;
        return false;
      });
    }

    // 2. Classification Filter
    if (options.classificationCode && options.classificationCode !== "ALL") {
      result = result.filter((obj) => obj.classification.code === options.classificationCode);
    }

    // 3. Subtype Filters
    if (options.galaxySubtype) {
      result = result.filter((obj) => obj.deepSky?.galaxy?.galaxySubtype === options.galaxySubtype);
    }
    if (options.nebulaSubtype) {
      result = result.filter((obj) => obj.deepSky?.nebula?.nebulaSubtype === options.nebulaSubtype);
    }
    if (options.clusterSubtype) {
      result = result.filter(
        (obj) => obj.deepSky?.starCluster?.clusterSubtype === options.clusterSubtype
      );
    }

    // 4. Catalog Filter
    if (options.catalog && options.catalog !== "ALL") {
      switch (options.catalog) {
        case "MESSIER":
          result = result.filter((obj) => Boolean(obj.catalogIdentifiers?.messier));
          break;
        case "NGC":
          result = result.filter((obj) => Boolean(obj.catalogIdentifiers?.ngc));
          break;
        case "IC":
          result = result.filter((obj) => Boolean(obj.catalogIdentifiers?.ic));
          break;
        case "CALDWELL":
          result = result.filter((obj) => Boolean(obj.catalogIdentifiers?.caldwell));
          break;
      }
    }

    // 5. Maximum Distance in Light-Years
    if (options.maxDistanceLy !== undefined) {
      result = result.filter(
        (obj) =>
          obj.positional.distanceLightYears !== undefined &&
          obj.positional.distanceLightYears <= options.maxDistanceLy!
      );
    }

    // 6. Maximum Apparent Magnitude (lower magnitude = brighter)
    if (options.maxMagnitudeV !== undefined) {
      result = result.filter(
        (obj) =>
          obj.physical.apparentMagnitudeV !== undefined &&
          obj.physical.apparentMagnitudeV <= options.maxMagnitudeV!
      );
    }

    // 7. Constellation Filter
    if (options.constellation) {
      result = result.filter(
        (obj) => obj.physical.constellation?.toLowerCase() === options.constellation!.toLowerCase()
      );
    }

    return result;
  }

  public paginate(
    filterOptions: DeepSkyFilterOptions = {},
    paginationOptions: DeepSkyPaginationOptions = {}
  ): PaginatedDeepSkyResult {
    const filtered = this.filter(filterOptions);
    const {
      page = 1,
      pageSize = 12,
      sortBy = "distance",
      sortDirection = "asc",
    } = paginationOptions;

    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "distance": {
          const distA = a.positional.distanceLightYears ?? 999999999;
          const distB = b.positional.distanceLightYears ?? 999999999;
          comparison = distA - distB;
          break;
        }
        case "magnitude": {
          const magA = a.physical.apparentMagnitudeV ?? 99;
          const magB = b.physical.apparentMagnitudeV ?? 99;
          comparison = magA - magB;
          break;
        }
        case "name":
          comparison = a.canonicalName.localeCompare(b.canonicalName);
          break;
        case "ra": {
          const raA = a.positional.rightAscensionDeg ?? 0;
          const raB = b.positional.rightAscensionDeg ?? 0;
          comparison = raA - raB;
          break;
        }
        case "dec": {
          const decA = a.positional.declinationDeg ?? 0;
          const decB = b.positional.declinationDeg ?? 0;
          comparison = decA - decB;
          break;
        }
      }
      return sortDirection === "desc" ? -comparison : comparison;
    });

    const totalMatches = sorted.length;
    const totalPages = Math.max(1, Math.ceil(totalMatches / pageSize));
    const safePage = Math.max(1, Math.min(page, totalPages));
    const startIndex = (safePage - 1) * pageSize;
    const paginatedObjects = sorted.slice(startIndex, startIndex + pageSize);

    return {
      objects: paginatedObjects,
      totalMatches,
      page: safePage,
      pageSize,
      totalPages,
    };
  }
}

// Global Singleton Deep Sky Repository
export const deepSkyRepo = new DeepSkyRepository();
