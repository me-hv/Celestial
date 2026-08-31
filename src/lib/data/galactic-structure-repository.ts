import { GalacticStructure, GalacticStructureType } from "@/domain/galactic-structure/types";
import { GALACTIC_STRUCTURES_DATA } from "./galactic-structure-data";
import { GalactocentricCoordinates } from "../astronomy/coordinates/galactocentric";

export interface GalacticStructureFilterOptions {
  query?: string;
  type?: GalacticStructureType | "ALL";
  minRadiusKpc?: number;
  maxRadiusKpc?: number;
  isModelDerived?: boolean;
}

export class GalacticStructureRepository {
  private readonly structuresMap: Map<string, GalacticStructure> = new Map();
  private readonly structuresList: GalacticStructure[] = [];

  constructor(initialData: GalacticStructure[] = GALACTIC_STRUCTURES_DATA) {
    this.structuresList = initialData;
    initialData.forEach((struct) => {
      this.structuresMap.set(struct.id, struct);
      this.structuresMap.set(struct.slug, struct);
      if (struct.aliases) {
        struct.aliases.forEach((alias) => {
          this.structuresMap.set(alias.toLowerCase(), struct);
          this.structuresMap.set(alias.toLowerCase().replace(/\s+/g, ""), struct);
        });
      }
    });
  }

  public getAll(): GalacticStructure[] {
    return [...this.structuresList];
  }

  public getById(id: string): GalacticStructure | undefined {
    return this.structuresMap.get(id);
  }

  public getBySlug(slug: string): GalacticStructure | undefined {
    return this.structuresMap.get(slug);
  }

  public getByType(type: GalacticStructureType): GalacticStructure[] {
    return this.structuresList.filter((s) => s.type === type);
  }

  public getMilkyWay(): GalacticStructure {
    return this.getBySlug("milky-way")!;
  }

  public getGalacticCenter(): GalacticStructure {
    return this.getBySlug("galactic-center")!;
  }

  public getSpiralArms(): GalacticStructure[] {
    return this.structuresList.filter((s) => s.type === "SPIRAL_ARM");
  }

  public filter(options: GalacticStructureFilterOptions = {}): GalacticStructure[] {
    let result = this.structuresList;

    if (options.query && options.query.trim()) {
      const q = options.query.trim().toLowerCase();
      const qClean = q.replace(/\s+/g, "");
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.slug.includes(q) ||
          s.standardDesignation?.toLowerCase().includes(q) ||
          s.aliases?.some(
            (a) =>
              a.toLowerCase().includes(q) || a.toLowerCase().replace(/\s+/g, "").includes(qClean)
          )
      );
    }

    if (options.type && options.type !== "ALL") {
      result = result.filter((s) => s.type === options.type);
    }

    if (options.minRadiusKpc !== undefined) {
      result = result.filter(
        (s) => s.spatialExtent.maxGalactocentricRadiusKpc >= options.minRadiusKpc!
      );
    }

    if (options.maxRadiusKpc !== undefined) {
      result = result.filter(
        (s) => s.spatialExtent.minGalactocentricRadiusKpc <= options.maxRadiusKpc!
      );
    }

    if (options.isModelDerived !== undefined) {
      result = result.filter((s) => s.isModelDerived === options.isModelDerived);
    }

    return result;
  }

  /**
   * Identifies which Galactic structures spatially contain or bound a given Galactocentric point.
   */
  public getContainingStructures(coord: GalactocentricCoordinates): GalacticStructure[] {
    const rKpc = coord.rGalactocentricPc / 1000.0;
    const zPc = coord.zPc;

    return this.structuresList.filter((s) => {
      const ext = s.spatialExtent;
      const inRadius =
        rKpc >= ext.minGalactocentricRadiusKpc && rKpc <= ext.maxGalactocentricRadiusKpc;
      if (!inRadius) return false;

      if (ext.minZHeightPc !== undefined && zPc < ext.minZHeightPc) return false;
      if (ext.maxZHeightPc !== undefined && zPc > ext.maxZHeightPc) return false;

      return true;
    });
  }
}

// Global Singleton Repository Instance
export const galacticStructureRepo = new GalacticStructureRepository();
