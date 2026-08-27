import { StellarSystem } from "@/domain/stellar-system/types";
import { CelestialObject } from "@/domain/celestial-object/types";

export type SystemScaleType = "SOLAR_SYSTEM" | "COMPACT_SYSTEM" | "WIDE_SYSTEM" | "CUSTOM";

export interface SystemScaleStrategy {
  scaleType: SystemScaleType;
  maxOrbitAu: number;
  minOrbitAu: number;
  /**
   * Transforms an orbital semi-major axis (in AU) into a 3D scene visual distance.
   */
  distanceToVisual(distanceAu: number): number;
  /**
   * Computes an interactive visual mesh radius for stars, gas giants, and terrestrial exoplanets.
   */
  calculateVisualRadius(object: CelestialObject): number;
}

export class AdaptiveScaleEngine {
  /**
   * Builds an optimized SystemScaleStrategy for a given stellar system and its member objects.
   */
  public static createStrategy(
    system: StellarSystem,
    planetaryObjects: CelestialObject[]
  ): SystemScaleStrategy {
    const semiMajorAxes = planetaryObjects
      .map((p) => p.orbital?.semiMajorAxisAu)
      .filter((a): a is number => typeof a === "number" && a > 0);

    const minOrbitAu = semiMajorAxes.length > 0 ? Math.min(...semiMajorAxes) : 0.1;
    const maxOrbitAu = semiMajorAxes.length > 0 ? Math.max(...semiMajorAxes) : 1.0;

    let scaleType: SystemScaleType = "WIDE_SYSTEM";
    if (system.slug === "solar-system") {
      scaleType = "SOLAR_SYSTEM";
    } else if (maxOrbitAu <= 0.2) {
      // e.g. TRAPPIST-1, Proxima Centauri, WASP-12, HD 209458
      scaleType = "COMPACT_SYSTEM";
    }

    const distanceToVisual = (distanceAu: number): number => {
      if (distanceAu <= 0) return 0;

      if (scaleType === "SOLAR_SYSTEM") {
        // Solar system non-linear power curve
        return Math.pow(distanceAu, 0.72) * 32.0;
      }

      if (scaleType === "COMPACT_SYSTEM") {
        // Compact systems (0.01 AU to 0.15 AU) mapped across a comfortable 4 to 34 unit radius
        const normalized = distanceAu / (maxOrbitAu * 1.15);
        return Math.pow(normalized, 0.65) * 30.0 + 4.0;
      }

      // Default Wide / Exoplanet system
      const normalized = distanceAu / (maxOrbitAu * 1.1);
      return Math.pow(normalized, 0.7) * 32.0 + 3.0;
    };

    const calculateVisualRadius = (object: CelestialObject): number => {
      const isStar = object.classification.code === "STAR";

      if (isStar) {
        // Star radius scaled by spectral class / solar radius
        const rSolar = object.physical.radiusSolar || 1.0;
        if (scaleType === "COMPACT_SYSTEM") {
          // For M-dwarfs in compact systems, keep star visually proportionate
          return Math.max(1.2, Math.min(3.0, rSolar * 2.2));
        }
        return Math.max(1.8, Math.min(4.5, rSolar * 2.6));
      }

      // Planets & Exoplanets
      const rEarth = object.physical.radiusEarth;
      const rKm = object.physical.meanRadiusKm;

      if (rEarth) {
        if (rEarth < 1.5) {
          // Earth / Mars sized
          return 0.35 + (rEarth - 1.0) * 0.08;
        } else if (rEarth < 4.0) {
          // Super-Earth / Sub-Neptune
          return 0.45 + (rEarth - 1.5) * 0.08;
        } else if (rEarth < 12.0) {
          // Gas Giant / Jupiter
          return 0.75 + (rEarth - 4.0) * 0.04;
        }
        return 1.1;
      }

      if (rKm) {
        const logR = Math.log10(Math.max(100, rKm));
        return Math.max(0.25, logR * 0.3 - 0.75);
      }

      return 0.4;
    };

    return {
      scaleType,
      maxOrbitAu,
      minOrbitAu,
      distanceToVisual,
      calculateVisualRadius,
    };
  }
}
