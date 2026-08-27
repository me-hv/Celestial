import { CelestialObject } from "../celestial-object/types";

/**
 * Stellar System Model (e.g. Solar System, Alpha Centauri, TRAPPIST-1)
 */
export interface StellarSystem {
  id: string; // UUID v4
  slug: string;
  name: string;
  hostGalaxyId?: string;
  centralBodyIds: string[]; // Host star(s) IDs e.g. [Sun] or [Alpha Centauri A, Alpha Centauri B]
  planetaryBodyIds: string[];
  minorBodyIds?: string[];
  barycentricCoordinate?: {
    xAu: number;
    yAu: number;
    zAu: number;
  };
  summary?: string;
}

export interface SystemHierarchyNode {
  object: CelestialObject;
  children: SystemHierarchyNode[];
}
