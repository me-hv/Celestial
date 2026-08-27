import { J2000_EPOCH_JD } from "./constants";

export interface KeplerianElements {
  semiMajorAxisAu: number;
  eccentricity: number;
  inclinationDeg?: number;
  longitudeAscendingNodeDeg?: number;
  argumentPeriapsisDeg?: number;
  meanAnomalyEpochDeg?: number;
  orbitalPeriodDays?: number;
  epochJulianDate?: number;
}

export interface HeliocentricEclipticPosition {
  xAu: number;
  yAu: number;
  zAu: number;
  distanceAu: number;
  trueAnomalyDeg: number;
  eccentricAnomalyDeg: number;
}

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

/**
 * Converts standard Date or ISO string into Julian Date (JD)
 */
export function dateToJulianDate(date: Date = new Date()): number {
  const time = date.getTime();
  // 2440587.5 is Julian Date on 1970-01-01 00:00:00 UTC
  return time / 86400000 + 2440587.5;
}

/**
 * Solves Kepler's Equation M = E - e * sin(E) for Eccentric Anomaly E using Newton-Raphson iteration
 * @param meanAnomalyRad Mean anomaly in radians [0, 2*PI]
 * @param eccentricity Orbital eccentricity [0, 1)
 * @param tolerance Convergence tolerance (default 1e-12)
 * @param maxIterations Maximum iteration limit
 */
export function solveKeplerEquation(
  meanAnomalyRad: number,
  eccentricity: number,
  tolerance = 1e-12,
  maxIterations = 50
): number {
  // Normalize mean anomaly to [0, 2*PI)
  let M = meanAnomalyRad % (2 * Math.PI);
  if (M < 0) M += 2 * Math.PI;

  // Initial estimate (Danby initial guess)
  let E =
    eccentricity > 0.8
      ? Math.PI
      : M + eccentricity * Math.sin(M) + 0.5 * eccentricity * eccentricity * Math.sin(2 * M);

  for (let i = 0; i < maxIterations; i++) {
    const f = E - eccentricity * Math.sin(E) - M;
    const fPrime = 1 - eccentricity * Math.cos(E);
    const delta = f / fPrime;
    E -= delta;

    if (Math.abs(delta) < tolerance) {
      break;
    }
  }

  return E;
}

/**
 * Calculates the exact 3D Heliocentric / Stellar coordinate vector for a Keplerian body at a given Julian Date
 */
export function calculateHeliocentricPosition(
  elements: KeplerianElements,
  targetJulianDate: number = J2000_EPOCH_JD
): HeliocentricEclipticPosition {
  const {
    semiMajorAxisAu: a,
    eccentricity: e = 0,
    inclinationDeg = 0,
    longitudeAscendingNodeDeg = 0,
    argumentPeriapsisDeg = 0,
    meanAnomalyEpochDeg = 0,
    orbitalPeriodDays,
    epochJulianDate = J2000_EPOCH_JD,
  } = elements;

  // Mean motion in radians per day (from Kepler's 3rd law n = 2*PI / P or n = 0.9856076686 / a^(3/2))
  const n = orbitalPeriodDays
    ? (2 * Math.PI) / orbitalPeriodDays
    : (0.9856076686 * DEG_TO_RAD) / Math.pow(Math.max(0.0001, a), 1.5);

  const deltaDays = targetJulianDate - epochJulianDate;
  const M_rad = (meanAnomalyEpochDeg * DEG_TO_RAD + n * deltaDays) % (2 * Math.PI);

  // Solve Kepler's equation for Eccentric Anomaly E
  const E_rad = solveKeplerEquation(M_rad, Math.min(0.999, Math.max(0, e)));

  // True Anomaly nu
  const sinNu = (Math.sqrt(1 - e * e) * Math.sin(E_rad)) / (1 - e * Math.cos(E_rad));
  const cosNu = (Math.cos(E_rad) - e) / (1 - e * Math.cos(E_rad));
  let nu_rad = Math.atan2(sinNu, cosNu);
  if (nu_rad < 0) nu_rad += 2 * Math.PI;

  // Radius vector magnitude in AU
  const r = a * (1 - e * Math.cos(E_rad));

  // Orbital angles in radians
  const i_rad = inclinationDeg * DEG_TO_RAD;
  const omega_rad = argumentPeriapsisDeg * DEG_TO_RAD; // Argument of periapsis
  const Omega_rad = longitudeAscendingNodeDeg * DEG_TO_RAD; // Longitude of ascending node

  // Position in the orbital plane
  const xOrbital = r * Math.cos(nu_rad);
  const yOrbital = r * Math.sin(nu_rad);

  // 3D Rotation to Heliocentric Ecliptic / System coordinates
  const cosOmega = Math.cos(Omega_rad);
  const sinOmega = Math.sin(Omega_rad);
  const cosOmegaSmall = Math.cos(omega_rad);
  const sinOmegaSmall = Math.sin(omega_rad);
  const cosI = Math.cos(i_rad);
  const sinI = Math.sin(i_rad);

  const Px = cosOmega * cosOmegaSmall - sinOmega * sinOmegaSmall * cosI;
  const Py = sinOmega * cosOmegaSmall + cosOmega * sinOmegaSmall * cosI;
  const Pz = sinOmegaSmall * sinI;

  const Qx = -cosOmega * sinOmegaSmall - sinOmega * cosOmegaSmall * cosI;
  const Qy = -sinOmega * sinOmegaSmall + cosOmega * cosOmegaSmall * cosI;
  const Qz = cosOmegaSmall * sinI;

  const xAu = xOrbital * Px + yOrbital * Qx;
  const yAu = xOrbital * Py + yOrbital * Qy;
  const zAu = xOrbital * Pz + yOrbital * Qz;

  return {
    xAu,
    yAu,
    zAu,
    distanceAu: r,
    trueAnomalyDeg: nu_rad * RAD_TO_DEG,
    eccentricAnomalyDeg: E_rad * RAD_TO_DEG,
  };
}

/**
 * Samples N points along a full 360-degree elliptical orbit trajectory
 */
export function generateOrbitTrajectoryPoints(
  elements: KeplerianElements,
  sampleCount = 128
): Array<{ xAu: number; yAu: number; zAu: number }> {
  const points: Array<{ xAu: number; yAu: number; zAu: number }> = [];
  const {
    semiMajorAxisAu: a,
    eccentricity: e = 0,
    inclinationDeg = 0,
    longitudeAscendingNodeDeg = 0,
    argumentPeriapsisDeg = 0,
  } = elements;

  const i_rad = inclinationDeg * DEG_TO_RAD;
  const omega_rad = argumentPeriapsisDeg * DEG_TO_RAD;
  const Omega_rad = longitudeAscendingNodeDeg * DEG_TO_RAD;

  const cosOmega = Math.cos(Omega_rad);
  const sinOmega = Math.sin(Omega_rad);
  const cosOmegaSmall = Math.cos(omega_rad);
  const sinOmegaSmall = Math.sin(omega_rad);
  const cosI = Math.cos(i_rad);
  const sinI = Math.sin(i_rad);

  const Px = cosOmega * cosOmegaSmall - sinOmega * sinOmegaSmall * cosI;
  const Py = sinOmega * cosOmegaSmall + cosOmega * sinOmegaSmall * cosI;
  const Pz = sinOmegaSmall * sinI;

  const Qx = -cosOmega * sinOmegaSmall - sinOmega * cosOmegaSmall * cosI;
  const Qy = -sinOmega * sinOmegaSmall + cosOmega * cosOmegaSmall * cosI;
  const Qz = cosOmegaSmall * sinI;

  for (let step = 0; step <= sampleCount; step++) {
    const E_rad = (step / sampleCount) * 2 * Math.PI;
    const r = a * (1 - e * Math.cos(E_rad));

    const sinNu = (Math.sqrt(1 - e * e) * Math.sin(E_rad)) / (1 - e * Math.cos(E_rad));
    const cosNu = (Math.cos(E_rad) - e) / (1 - e * Math.cos(E_rad));
    const nu_rad = Math.atan2(sinNu, cosNu);

    const xOrbital = r * Math.cos(nu_rad);
    const yOrbital = r * Math.sin(nu_rad);

    points.push({
      xAu: xOrbital * Px + yOrbital * Qx,
      yAu: xOrbital * Py + yOrbital * Qy,
      zAu: xOrbital * Pz + yOrbital * Qz,
    });
  }

  return points;
}
