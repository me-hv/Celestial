import { HabitableZoneBoundaries } from "@/domain/stellar-system/types";

/**
 * Kopparapu et al. (2013, 2014) Circumstellar Habitable Zone Model Coefficients
 *
 * S_eff = S_eff_sun + a*T_* + b*T_*^2 + c*T_*^3 + d*T_*^4
 * where T_* = T_eff - 5780 K
 *
 * Distance d = sqrt( (L/L_sun) / S_eff ) AU
 *
 * Reference:
 * Kopparapu et al. (2013), "Habitable Zones around Main-Sequence Stars: New Estimates",
 * Astrophysical Journal 765, 131.
 */
interface KopparapuCoefficients {
  sEffSun: number;
  a: number;
  b: number;
  c: number;
  d: number;
}

const HZ_COEFFICIENTS: Record<
  "RECENT_VENUS" | "RUNAWAY_GREENHOUSE" | "MAXIMUM_GREENHOUSE" | "EARLY_MARS",
  KopparapuCoefficients
> = {
  // Optimistic Inner Boundary (Recent Venus: 1.0 Gyr ago)
  RECENT_VENUS: {
    sEffSun: 1.776,
    a: 2.136e-4,
    b: 2.533e-8,
    c: -1.332e-11,
    d: -3.097e-15,
  },
  // Conservative Inner Boundary (Runaway Greenhouse / Moist Greenhouse)
  RUNAWAY_GREENHOUSE: {
    sEffSun: 1.0385,
    a: 1.2456e-4,
    b: 1.4612e-8,
    c: -7.6345e-12,
    d: -1.7511e-15,
  },
  // Conservative Outer Boundary (Maximum Greenhouse)
  MAXIMUM_GREENHOUSE: {
    sEffSun: 0.3507,
    a: 5.9578e-5,
    b: 1.6707e-9,
    c: -3.0058e-12,
    d: -5.1925e-16,
  },
  // Optimistic Outer Boundary (Early Mars: 3.8 Gyr ago)
  EARLY_MARS: {
    sEffSun: 0.3207,
    a: 5.4471e-5,
    b: 1.5275e-9,
    c: -2.1709e-12,
    d: -3.8282e-16,
  },
};

export class HabitableZoneCalculator {
  /**
   * Calculates the Habitable Zone boundaries for a star given its effective temperature
   * and luminosity (or calculates luminosity from radius and temperature via Stefan-Boltzmann).
   *
   * @param effectiveTemperatureK Effective temperature of the star in Kelvin (valid range ~2600 K - 7200 K)
   * @param luminositySolar Stellar luminosity in solar units (L / L_sun)
   * @param radiusSolar Stellar radius in solar units (used if luminosity is not provided)
   */
  public static calculate(
    effectiveTemperatureK: number,
    luminositySolar?: number,
    radiusSolar?: number
  ): HabitableZoneBoundaries {
    // If luminosity is missing, calculate via Stefan-Boltzmann law: L/L_sun = (R/R_sun)^2 * (T_eff / 5778)^4
    let lum = luminositySolar;
    if (lum === undefined || lum <= 0) {
      const r = radiusSolar || 1.0;
      lum = Math.pow(r, 2) * Math.pow(effectiveTemperatureK / 5778, 4);
    }

    // Clamp T_eff for polynomial stability (Kopparapu model is valid for 2600K <= T_eff <= 7200K)
    const clampedT = Math.max(2600, Math.min(7200, effectiveTemperatureK));
    const tStar = clampedT - 5780;

    const sRecentVenus = this.computeEffectiveFlux(HZ_COEFFICIENTS.RECENT_VENUS, tStar);
    const sRunawayGreenhouse = this.computeEffectiveFlux(HZ_COEFFICIENTS.RUNAWAY_GREENHOUSE, tStar);
    const sMaxGreenhouse = this.computeEffectiveFlux(HZ_COEFFICIENTS.MAXIMUM_GREENHOUSE, tStar);
    const sEarlyMars = this.computeEffectiveFlux(HZ_COEFFICIENTS.EARLY_MARS, tStar);

    // Compute orbital distances in AU: d = sqrt(L / S_eff)
    const optimisticInnerAu = Math.sqrt(lum / sRecentVenus);
    const conservativeInnerAu = Math.sqrt(lum / sRunawayGreenhouse);
    const conservativeOuterAu = Math.sqrt(lum / sMaxGreenhouse);
    const optimisticOuterAu = Math.sqrt(lum / sEarlyMars);

    return {
      optimisticInnerAu: Number(optimisticInnerAu.toFixed(4)),
      conservativeInnerAu: Number(conservativeInnerAu.toFixed(4)),
      conservativeOuterAu: Number(conservativeOuterAu.toFixed(4)),
      optimisticOuterAu: Number(optimisticOuterAu.toFixed(4)),
      stellarLuminositySolar: Number(lum.toFixed(5)),
      stellarEffectiveTemperatureK: effectiveTemperatureK,
      calculationModel: "Kopparapu et al. (2013/2014) Effective Stellar Flux Model",
    };
  }

  private static computeEffectiveFlux(c: KopparapuCoefficients, tStar: number): number {
    return (
      c.sEffSun +
      c.a * tStar +
      c.b * Math.pow(tStar, 2) +
      c.c * Math.pow(tStar, 3) +
      c.d * Math.pow(tStar, 4)
    );
  }
}
