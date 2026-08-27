import { CelestialObject } from "@/domain/celestial-object/types";
import { computeSpatialDistance } from "./astrometric-coordinates";

/**
 * Spatial Query Utilities for Stellar Neighborhood
 */

export function getStarDistancePc(star: CelestialObject): number {
  if (star.positional.distanceParsecs !== undefined) {
    return star.positional.distanceParsecs;
  }
  if (star.positional.distanceLightYears !== undefined) {
    return star.positional.distanceLightYears / 3.261563777;
  }
  if (star.positional.cartesianCoordinatesPc) {
    const { x, y, z } = star.positional.cartesianCoordinatesPc;
    return Math.sqrt(x * x + y * y + z * z);
  }
  return 0;
}

/**
 * Filters stars located within a given sphere radius (in parsecs) from the Sun.
 */
export function getStarsWithinRadius(
  stars: CelestialObject[],
  radiusPc: number
): CelestialObject[] {
  return stars.filter((star) => getStarDistancePc(star) <= radiusPc);
}

/**
 * Filters stars located within a spherical shell (between minRadiusPc and maxRadiusPc).
 */
export function getStarsInDistanceShell(
  stars: CelestialObject[],
  minRadiusPc: number,
  maxRadiusPc: number
): CelestialObject[] {
  return stars.filter((star) => {
    const d = getStarDistancePc(star);
    return d >= minRadiusPc && d <= maxRadiusPc;
  });
}

/**
 * Finds the N nearest neighbor stars to a specified target star.
 */
export function getNearestNeighbors(
  targetStar: CelestialObject,
  allStars: CelestialObject[],
  count = 5
): Array<{ star: CelestialObject; distancePc: number; distanceLy: number }> {
  const targetCartesian = targetStar.positional.cartesianCoordinatesPc || { x: 0, y: 0, z: 0 };

  const neighbors = allStars
    .filter((s) => s.id !== targetStar.id)
    .map((star) => {
      const starCartesian = star.positional.cartesianCoordinatesPc || { x: 0, y: 0, z: 0 };
      const dist = computeSpatialDistance(targetCartesian, starCartesian);
      return {
        star,
        distancePc: dist.distancePc,
        distanceLy: dist.distanceLy,
      };
    });

  neighbors.sort((a, b) => a.distancePc - b.distancePc);
  return neighbors.slice(0, count);
}
