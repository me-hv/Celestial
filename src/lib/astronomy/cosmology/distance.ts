import { SPEED_OF_LIGHT_KM_S, LY_PER_MPC } from "../coordinates/local-group";

export interface CosmologicalParameters {
  hubbleConstantKmSPerMpc: number; // H_0 e.g. 70.0 (Planck / Hubble tension range 67 - 73)
  omegaMatter?: number; // Omega_m e.g. 0.3
  omegaLambda?: number; // Omega_Lambda e.g. 0.7
}

export const DEFAULT_COSMOLOGICAL_PARAMS: CosmologicalParameters = {
  hubbleConstantKmSPerMpc: 70.0,
  omegaMatter: 0.315,
  omegaLambda: 0.685,
};

export interface CosmologicalDistanceResult {
  redshiftZ: number;
  apparentVelocityKmS: number;
  cosmologicalDistanceMpc: number;
  cosmologicalDistanceLy: number;
  lookbackTimeYears: number;
  isLocalGroupBound: boolean; // True if within Local Group where peculiar velocities dominate over expansion
  limitations: string;
}

/**
 * Converts spectroscopic redshift z to non-relativistic recession velocity:
 * v = c * z
 */
export function redshiftToRecessionVelocity(z: number): number {
  return SPEED_OF_LIGHT_KM_S * z;
}

/**
 * Derives approximate cosmological distance from redshift for extragalactic objects.
 *
 * IMPORTANT SCIENTIFIC CAVEATS:
 * 1. For Local Group galaxies (d < ~3 Mpc), gravitational binding completely overcomes cosmic Hubble expansion.
 *    For example, Andromeda (M31) has a negative redshift (blueshift z = -0.001001) due to orbital approach.
 * 2. For distant galaxies (z > 0.01), peculiar velocities become negligible relative to Hubble flow:
 *    v_Hubble = H_0 * d  =>  d ≈ (c * z) / H_0
 */
export function calculateCosmologicalDistance(
  redshiftZ: number,
  params: CosmologicalParameters = DEFAULT_COSMOLOGICAL_PARAMS
): CosmologicalDistanceResult {
  const velocityKmS = redshiftToRecessionVelocity(redshiftZ);
  const isLocalGroupBound = redshiftZ <= 0.001; // Objects within Local Group or nearby clusters

  if (isLocalGroupBound) {
    return {
      redshiftZ,
      apparentVelocityKmS: velocityKmS,
      cosmologicalDistanceMpc: 0.0,
      cosmologicalDistanceLy: 0.0,
      lookbackTimeYears: 0.0,
      isLocalGroupBound: true,
      limitations:
        "Local Group gravitationally bound object: Doppler velocity is dominated by local orbital motion and cannot be converted to distance via Hubble expansion.",
    };
  }

  // Linear Hubble approximation for low-redshift universe (z < 0.1)
  const distanceMpc = velocityKmS / params.hubbleConstantKmSPerMpc;
  const distanceLy = distanceMpc * LY_PER_MPC;
  const lookbackTimeYears = distanceLy;

  return {
    redshiftZ,
    apparentVelocityKmS: velocityKmS,
    cosmologicalDistanceMpc: distanceMpc,
    cosmologicalDistanceLy: distanceLy,
    lookbackTimeYears,
    isLocalGroupBound: false,
    limitations: `Derived assuming linear Hubble flow with H_0 = ${params.hubbleConstantKmSPerMpc} km/s/Mpc. Neglects peculiar velocity and relativistic cosmic deceleration corrections.`,
  };
}

/**
 * Formats a galaxy distance with scientific honesty avoiding false precision.
 * Examples:
 * - 778 kpc -> "~2.54 Million ly (778 ± 17 kpc)"
 * - 49.97 kpc -> "~163,000 ly (49.97 ± 0.19 kpc)"
 */
export function formatGalaxyDistance(
  distanceLy: number,
  uncertaintyLy?: { upper?: number; lower?: number }
): string {
  if (distanceLy >= 1e6) {
    const mLy = distanceLy / 1e6;
    if (uncertaintyLy && uncertaintyLy.upper) {
      const errMly = uncertaintyLy.upper / 1e6;
      return `${mLy.toFixed(2)} ± ${errMly.toFixed(2)} Mly`;
    }
    return `~${mLy.toFixed(2)} Million ly`;
  }

  if (distanceLy >= 1000) {
    const kLy = distanceLy / 1000;
    if (uncertaintyLy && uncertaintyLy.upper) {
      const errKly = uncertaintyLy.upper / 1000;
      return `${kLy.toFixed(1)} ± ${errKly.toFixed(1)} kly`;
    }
    return `~${Math.round(distanceLy).toLocaleString()} ly`;
  }

  return `${Math.round(distanceLy)} ly`;
}

/**
 * Formats lookback time into a human-readable astronomical statement.
 */
export function formatLookbackTime(lookbackYears: number): string {
  if (lookbackYears >= 1e6) {
    return `${(lookbackYears / 1e6).toFixed(2)} Million years in the past`;
  }
  if (lookbackYears >= 1000) {
    return `${(lookbackYears / 1000).toFixed(1)} thousand years in the past`;
  }
  return `${Math.round(lookbackYears).toLocaleString()} years in the past`;
}
