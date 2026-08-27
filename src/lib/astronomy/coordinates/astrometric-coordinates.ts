/**
 * Pure Astrometric Coordinate Transformations (ICRS / Equatorial to Cartesian)
 *
 * In accordance with IAU standards:
 * - Reference Epoch: J2000.0 / J2016.5
 * - Reference Frame: International Celestial Reference System (ICRS)
 * - Right Ascension (alpha): degrees [0, 360)
 * - Declination (delta): degrees [-90, +90]
 * - Parallax (varpi): milliarcseconds (mas)
 * - Distance (d): parsecs (pc) where d = 1000 / varpi
 */

export const PARSEC_TO_LIGHT_YEARS = 3.261563777;
export const LIGHT_YEARS_TO_PARSEC = 1 / PARSEC_TO_LIGHT_YEARS;
export const PARSEC_TO_AU = 206264.806247;
export const AU_TO_PARSEC = 1 / PARSEC_TO_AU;

export interface CartesianCoordinatesPc {
  x: number; // Towards Vernal Equinox (RA = 0 deg, Dec = 0 deg)
  y: number; // Towards RA = 90 deg (6h), Dec = 0 deg
  z: number; // Towards North Celestial Pole (Dec = +90 deg)
}

export interface DistanceCalculationResult {
  distancePc: number;
  distanceLy: number;
  distanceErrorPc?: number;
  distanceErrorLy?: number;
}

/**
 * Calculates distance from trigonometric parallax with error propagation.
 * d = 1000 / varpi [pc]
 * sigma_d = (1000 / varpi^2) * sigma_varpi
 */
export function parallaxToDistance(
  parallaxMas: number,
  parallaxErrorMas?: number
): DistanceCalculationResult {
  if (parallaxMas <= 0) {
    throw new Error(
      `Invalid astronomical parallax: ${parallaxMas} mas. Parallax must be positive for distance calculation.`
    );
  }

  const distancePc = 1000.0 / parallaxMas;
  const distanceLy = distancePc * PARSEC_TO_LIGHT_YEARS;

  let distanceErrorPc: number | undefined = undefined;
  let distanceErrorLy: number | undefined = undefined;

  if (parallaxErrorMas !== undefined && parallaxErrorMas > 0) {
    // First-order Taylor series error propagation
    distanceErrorPc = (1000.0 / (parallaxMas * parallaxMas)) * parallaxErrorMas;
    distanceErrorLy = distanceErrorPc * PARSEC_TO_LIGHT_YEARS;
  }

  return {
    distancePc: Number(distancePc.toFixed(4)),
    distanceLy: Number(distanceLy.toFixed(4)),
    distanceErrorPc: distanceErrorPc ? Number(distanceErrorPc.toFixed(4)) : undefined,
    distanceErrorLy: distanceErrorLy ? Number(distanceErrorLy.toFixed(4)) : undefined,
  };
}

/**
 * Converts Equatorial ICRS Coordinates (RA, Dec in degrees, Distance in parsecs)
 * to Heliocentric Cartesian Coordinates (X, Y, Z in parsecs).
 *
 * X = d * cos(Dec) * cos(RA)
 * Y = d * cos(Dec) * sin(RA)
 * Z = d * sin(Dec)
 */
export function equatorialToCartesian(
  raDeg: number,
  decDeg: number,
  distancePc: number
): CartesianCoordinatesPc {
  if (distancePc < 0) {
    throw new Error(`Distance cannot be negative: ${distancePc} pc`);
  }

  const raRad = (raDeg * Math.PI) / 180.0;
  const decRad = (decDeg * Math.PI) / 180.0;

  const cosDec = Math.cos(decRad);
  const sinDec = Math.sin(decRad);
  const cosRa = Math.cos(raRad);
  const sinRa = Math.sin(raRad);

  const x = distancePc * cosDec * cosRa;
  const y = distancePc * cosDec * sinRa;
  const z = distancePc * sinDec;

  return {
    x: Number(x.toFixed(5)),
    y: Number(y.toFixed(5)),
    z: Number(z.toFixed(5)),
  };
}

/**
 * Converts Cartesian Coordinates (X, Y, Z in parsecs) back to Equatorial Coordinates (RA, Dec, Distance).
 */
export function cartesianToEquatorial(
  xPc: number,
  yPc: number,
  zPc: number
): { raDeg: number; decDeg: number; distancePc: number } {
  const distancePc = Math.sqrt(xPc * xPc + yPc * yPc + zPc * zPc);

  if (distancePc === 0) {
    return { raDeg: 0, decDeg: 0, distancePc: 0 };
  }

  const decRad = Math.asin(Math.max(-1, Math.min(1, zPc / distancePc)));
  let raRad = Math.atan2(yPc, xPc);
  if (raRad < 0) {
    raRad += 2 * Math.PI;
  }

  const raDeg = (raRad * 180.0) / Math.PI;
  const decDeg = (decRad * 180.0) / Math.PI;

  return {
    raDeg: Number(raDeg.toFixed(5)),
    decDeg: Number(decDeg.toFixed(5)),
    distancePc: Number(distancePc.toFixed(5)),
  };
}

/**
 * Computes the 3D Euclidean physical distance between any two stars in parsecs.
 */
export function computeSpatialDistance(
  coordA: CartesianCoordinatesPc,
  coordB: CartesianCoordinatesPc
): { distancePc: number; distanceLy: number } {
  const dx = coordA.x - coordB.x;
  const dy = coordA.y - coordB.y;
  const dz = coordA.z - coordB.z;
  const distancePc = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const distanceLy = distancePc * PARSEC_TO_LIGHT_YEARS;

  return {
    distancePc: Number(distancePc.toFixed(4)),
    distanceLy: Number(distanceLy.toFixed(4)),
  };
}

export function lightYearsToParsecs(ly: number): number {
  return Number((ly * LIGHT_YEARS_TO_PARSEC).toFixed(5));
}

export function parsecsToLightYears(pc: number): number {
  return Number((pc * PARSEC_TO_LIGHT_YEARS).toFixed(5));
}
