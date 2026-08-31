import { Constellation } from "@/domain/constellation/types";
import { IAU_CONSTELLATIONS_DATA } from "./constellation-data";
import { computeAngularSeparation } from "../astronomy/coordinates/angular-separation";

export interface IConstellationRepository {
  getAll(): Constellation[];
  getByCode(code: string): Constellation | undefined;
  getBySlug(slug: string): Constellation | undefined;
  getClosestForCoordinates(raDeg: number, decDeg: number): Constellation | undefined;
  search(query: string): Constellation[];
}

export class ConstellationRepository implements IConstellationRepository {
  private constellations: Constellation[];

  constructor(data: Constellation[] = IAU_CONSTELLATIONS_DATA) {
    this.constellations = [...data];
  }

  getAll(): Constellation[] {
    return this.constellations;
  }

  getByCode(code: string): Constellation | undefined {
    const target = code.trim().toUpperCase();
    return this.constellations.find((c) => c.iauCode.toUpperCase() === target);
  }

  getBySlug(slug: string): Constellation | undefined {
    const target = slug.trim().toLowerCase();
    return this.constellations.find((c) => c.slug.toLowerCase() === target || c.id === target);
  }

  getClosestForCoordinates(raDeg: number, decDeg: number): Constellation | undefined {
    if (this.constellations.length === 0) return undefined;

    let closestConst: Constellation | undefined = undefined;
    let minSep = Infinity;

    for (const c of this.constellations) {
      const sep = computeAngularSeparation(
        { raDeg, decDeg },
        { raDeg: c.centerCoordinates.raDeg, decDeg: c.centerCoordinates.decDeg }
      );
      if (sep.degrees < minSep) {
        minSep = sep.degrees;
        closestConst = c;
      }
    }

    return closestConst;
  }

  search(query: string): Constellation[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.constellations;

    return this.constellations.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.iauCode.toLowerCase().includes(q) ||
        c.genitive.toLowerCase().includes(q) ||
        c.brightestStar.name.toLowerCase().includes(q)
    );
  }
}

export const constellationRepo = new ConstellationRepository();
