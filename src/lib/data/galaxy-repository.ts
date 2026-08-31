import { Galaxy, GalaxyMorphologyClass, GroupMembershipType } from "@/domain/galaxy/types";
import { LOCAL_GROUP_GALAXIES_DATA } from "./galaxy-data";

export interface GalaxyFilterOptions {
  query?: string;
  morphologyClass?: GalaxyMorphologyClass | "ALL";
  membershipType?: GroupMembershipType | "ALL";
  parentGalaxySlug?: string;
  minDistanceKpc?: number;
  maxDistanceKpc?: number;
}

export interface GalaxyComparisonResult {
  galaxyA: Galaxy;
  galaxyB: Galaxy;
  separationKpc?: number;
  separationLy?: number;
  massRatio?: number; // Total mass A / Total mass B
  diameterRatio?: number; // Diameter A / Diameter B
}

export class GalaxyRepository {
  private readonly galaxyMap: Map<string, Galaxy> = new Map();
  private readonly galaxyList: Galaxy[] = [];

  constructor(initialData: Galaxy[] = LOCAL_GROUP_GALAXIES_DATA) {
    this.galaxyList = initialData;
    initialData.forEach((g) => {
      this.galaxyMap.set(g.id, g);
      this.galaxyMap.set(g.slug, g);
      if (g.aliases) {
        g.aliases.forEach((alias) => {
          this.galaxyMap.set(alias.toLowerCase(), g);
          this.galaxyMap.set(alias.toLowerCase().replace(/\s+/g, ""), g);
        });
      }
      if (g.catalogIdentifiers) {
        const catIds = [
          g.catalogIdentifiers.messier,
          g.catalogIdentifiers.ngc,
          g.catalogIdentifiers.ic,
          g.catalogIdentifiers.ugc,
          g.catalogIdentifiers.pgc,
        ].filter(Boolean) as string[];
        catIds.forEach((cid) => {
          this.galaxyMap.set(cid.toLowerCase(), g);
          this.galaxyMap.set(cid.toLowerCase().replace(/\s+/g, ""), g);
        });
      }
    });
  }

  public getAll(): Galaxy[] {
    return [...this.galaxyList];
  }

  public getById(id: string): Galaxy | undefined {
    return this.galaxyMap.get(id);
  }

  public getBySlug(slug: string): Galaxy | undefined {
    return this.galaxyMap.get(slug);
  }

  public getMilkyWay(): Galaxy {
    return this.getBySlug("milky-way-galaxy") || this.galaxyList[0];
  }

  public getAndromeda(): Galaxy {
    return this.getBySlug("andromeda-galaxy") || this.galaxyList[1];
  }

  public getTriangulum(): Galaxy {
    return this.getBySlug("triangulum-galaxy") || this.galaxyList[2];
  }

  public getLocalGroupMembers(): Galaxy[] {
    return this.galaxyList.filter((g) => g.groupMembership?.groupId === "local-group");
  }

  public getSatellites(parentSlug: string): Galaxy[] {
    return this.galaxyList.filter((g) => g.groupMembership?.parentGalaxySlug === parentSlug);
  }

  public filter(options: GalaxyFilterOptions = {}): Galaxy[] {
    let result = this.galaxyList;

    if (options.query && options.query.trim()) {
      const q = options.query.trim().toLowerCase();
      const qClean = q.replace(/\s+/g, "");
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.slug.includes(q) ||
          g.standardDesignation?.toLowerCase().includes(q) ||
          g.aliases?.some(
            (a) =>
              a.toLowerCase().includes(q) || a.toLowerCase().replace(/\s+/g, "").includes(qClean)
          ) ||
          (g.catalogIdentifiers &&
            Object.values(g.catalogIdentifiers).some(
              (cid) =>
                cid &&
                (cid.toLowerCase().includes(q) ||
                  cid.toLowerCase().replace(/\s+/g, "").includes(qClean))
            ))
      );
    }

    if (options.morphologyClass && options.morphologyClass !== "ALL") {
      result = result.filter((g) => g.morphology.class === options.morphologyClass);
    }

    if (options.membershipType && options.membershipType !== "ALL") {
      result = result.filter((g) => g.groupMembership?.membershipType === options.membershipType);
    }

    if (options.parentGalaxySlug) {
      result = result.filter(
        (g) => g.groupMembership?.parentGalaxySlug === options.parentGalaxySlug
      );
    }

    if (options.minDistanceKpc !== undefined) {
      result = result.filter((g) => g.distance.distanceKpc.value >= options.minDistanceKpc!);
    }

    if (options.maxDistanceKpc !== undefined) {
      result = result.filter((g) => g.distance.distanceKpc.value <= options.maxDistanceKpc!);
    }

    return result;
  }

  public compare(slugA: string, slugB: string): GalaxyComparisonResult | null {
    const galaxyA = this.getBySlug(slugA);
    const galaxyB = this.getBySlug(slugB);

    if (!galaxyA || !galaxyB) return null;

    let massRatio: number | undefined = undefined;
    if (galaxyA.physical.totalMassSolar && galaxyB.physical.totalMassSolar) {
      massRatio = galaxyA.physical.totalMassSolar.value / galaxyB.physical.totalMassSolar.value;
    }

    const diameterRatio = galaxyA.physical.diameterKpc.value / galaxyB.physical.diameterKpc.value;

    return {
      galaxyA,
      galaxyB,
      massRatio,
      diameterRatio,
    };
  }
}

// Global Singleton Repository Instance
export const galaxyRepo = new GalaxyRepository();
