import {
  CosmicStructure,
  CosmicStructureType,
  StructureObservationStatus,
} from "@/domain/cosmic-structure/types";
import { COSMIC_STRUCTURES_DATA } from "./cosmic-structure-data";
import {
  calculateInterStructureSeparation,
  InterStructureSeparationVector,
} from "../astronomy/coordinates/cosmic-coordinates";

export interface CosmicStructureFilterOptions {
  type?: CosmicStructureType;
  types?: CosmicStructureType[];
  observationStatus?: StructureObservationStatus;
  minDistanceMpc?: number;
  maxDistanceMpc?: number;
  parentSlug?: string;
}

export interface CosmicStructureComparison {
  structureA: CosmicStructure;
  structureB: CosmicStructure;
  separationVector: InterStructureSeparationVector;
  distanceRatio?: number; // Distance B / Distance A
  majorAxisRatio?: number; // Size B / Size A
  massRatio?: number; // Mass B / Mass A
  galaxyCountRatio?: number;
  velocityDifferenceKmS?: number;
}

export class CosmicStructureRepository {
  private readonly structures: Map<string, CosmicStructure> = new Map();
  private readonly slugMap: Map<string, CosmicStructure> = new Map();

  constructor(initialData: CosmicStructure[] = COSMIC_STRUCTURES_DATA) {
    initialData.forEach((item) => {
      this.structures.set(item.id, item);
      this.slugMap.set(item.slug, item);

      // Index standard designation & aliases
      if (item.standardDesignation) {
        const clean = item.standardDesignation.toLowerCase().replace(/[\s\-_]/g, "");
        this.structures.set(clean, item);
      }
      if (item.aliases) {
        item.aliases.forEach((alias) => {
          const cleanAlias = alias.toLowerCase().replace(/[\s\-_]/g, "");
          this.structures.set(cleanAlias, item);
        });
      }
    });
  }

  public getAll(): CosmicStructure[] {
    return Array.from(this.slugMap.values());
  }

  public getBySlug(slug: string): CosmicStructure | undefined {
    return this.slugMap.get(slug);
  }

  public getById(idOrAlias: string): CosmicStructure | undefined {
    if (this.structures.has(idOrAlias)) {
      return this.structures.get(idOrAlias);
    }
    const clean = idOrAlias.toLowerCase().replace(/[\s\-_]/g, "");
    return this.structures.get(clean) || this.slugMap.get(idOrAlias);
  }

  public filter(options: CosmicStructureFilterOptions): CosmicStructure[] {
    return this.getAll().filter((item) => {
      if (options.type && item.type !== options.type) {
        return false;
      }
      if (options.types && options.types.length > 0 && !options.types.includes(item.type)) {
        return false;
      }
      if (options.observationStatus && item.observationStatus !== options.observationStatus) {
        return false;
      }
      if (
        options.minDistanceMpc !== undefined &&
        item.coordinates.distanceMpc.value < options.minDistanceMpc
      ) {
        return false;
      }
      if (
        options.maxDistanceMpc !== undefined &&
        item.coordinates.distanceMpc.value > options.maxDistanceMpc
      ) {
        return false;
      }
      if (options.parentSlug && item.parentStructure?.slug !== options.parentSlug) {
        return false;
      }
      return true;
    });
  }

  public getParent(slug: string): CosmicStructure | undefined {
    const item = this.getBySlug(slug);
    if (!item?.parentStructure?.slug) return undefined;
    return this.getBySlug(item.parentStructure.slug);
  }

  public getChildren(slug: string): CosmicStructure[] {
    return this.getAll().filter((item) => item.parentStructure?.slug === slug);
  }

  /**
   * Ascends the hierarchical cosmic tree from a given structure up to the largest parent basin.
   * Example: Local Group -> Local Sheet -> Virgo Supercluster -> Laniakea Supercluster
   */
  public getAncestryChain(slug: string): CosmicStructure[] {
    const chain: CosmicStructure[] = [];
    let current = this.getBySlug(slug);
    const visited = new Set<string>();

    while (current && !visited.has(current.slug)) {
      chain.push(current);
      visited.add(current.slug);
      if (current.parentStructure?.slug) {
        current = this.getBySlug(current.parentStructure.slug);
      } else {
        break;
      }
    }

    return chain;
  }

  /**
   * Compares two cosmic structures across physical scale, mass, distance, and 3D separation.
   */
  public compare(slugA: string, slugB: string): CosmicStructureComparison | null {
    const structA = this.getBySlug(slugA);
    const structB = this.getBySlug(slugB);

    if (!structA || !structB) {
      return null;
    }

    const posA = structA.coordinates.galactocentricCartesianMpc;
    const posB = structB.coordinates.galactocentricCartesianMpc;
    const separationVector = calculateInterStructureSeparation(posA, posB);

    const distA = structA.coordinates.distanceMpc.value;
    const distB = structB.coordinates.distanceMpc.value;
    const distanceRatio = distA > 0 ? distB / distA : undefined;

    const sizeA = structA.dimensions.majorAxisMpc.value;
    const sizeB = structB.dimensions.majorAxisMpc.value;
    const majorAxisRatio = sizeA > 0 ? sizeB / sizeA : undefined;

    const massA = structA.physical.estimatedMassSolar?.value;
    const massB = structB.physical.estimatedMassSolar?.value;
    const massRatio = massA && massB ? massB / massA : undefined;

    const countA = structA.physical.galaxyCountEstimated?.value;
    const countB = structB.physical.galaxyCountEstimated?.value;
    const galaxyCountRatio = countA && countB ? countB / countA : undefined;

    const vA = structA.coordinates.heliocentricRadialVelocityKmS?.value;
    const vB = structB.coordinates.heliocentricRadialVelocityKmS?.value;
    const velocityDifferenceKmS = vA !== undefined && vB !== undefined ? vB - vA : undefined;

    return {
      structureA: structA,
      structureB: structB,
      separationVector,
      distanceRatio,
      majorAxisRatio,
      massRatio,
      galaxyCountRatio,
      velocityDifferenceKmS,
    };
  }
}

// Global Singleton Repository
export const cosmicStructureRepo = new CosmicStructureRepository();
