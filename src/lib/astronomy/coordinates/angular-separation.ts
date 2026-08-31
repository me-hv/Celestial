/**
 * Pure Celestial Angular Separation Mathematics
 * Computes great-circle angular distance on the celestial sphere.
 */

export interface CelestialCoordinate {
  raDeg: number; // Right Ascension in degrees [0, 360)
  decDeg: number; // Declination in degrees [-90, +90]
}

export interface AngularSeparationResult {
  degrees: number;
  arcminutes: number;
  arcseconds: number;
  radians: number;
}

const DEG_TO_RAD = Math.PI / 180.0;
const RAD_TO_DEG = 180.0 / Math.PI;

/**
 * Computes the exact angular separation between two celestial coordinates
 * using the Vincenty great-circle formula (stable for all distances).
 */
export function computeAngularSeparation(
  coordA: CelestialCoordinate,
  coordB: CelestialCoordinate
): AngularSeparationResult {
  const ra1 = coordA.raDeg * DEG_TO_RAD;
  const dec1 = coordA.decDeg * DEG_TO_RAD;
  const ra2 = coordB.raDeg * DEG_TO_RAD;
  const dec2 = coordB.decDeg * DEG_TO_RAD;

  const deltaRa = ra2 - ra1;
  const sinDeltaRa = Math.sin(deltaRa);
  const cosDeltaRa = Math.cos(deltaRa);
  const sinDec1 = Math.sin(dec1);
  const cosDec1 = Math.cos(dec1);
  const sinDec2 = Math.sin(dec2);
  const cosDec2 = Math.cos(dec2);

  // Vincenty formula for sphere
  const numeratorTerm1 = cosDec2 * sinDeltaRa;
  const numeratorTerm2 = cosDec1 * sinDec2 - sinDec1 * cosDec2 * cosDeltaRa;
  const numerator = Math.sqrt(numeratorTerm1 * numeratorTerm1 + numeratorTerm2 * numeratorTerm2);

  const denominator = sinDec1 * sinDec2 + cosDec1 * cosDec2 * cosDeltaRa;

  const sepRad = Math.atan2(numerator, denominator);
  const sepDeg = sepRad * RAD_TO_DEG;

  return {
    degrees: Number(sepDeg.toFixed(6)),
    arcminutes: Number((sepDeg * 60.0).toFixed(4)),
    arcseconds: Number((sepDeg * 3600.0).toFixed(2)),
    radians: Number(sepRad.toFixed(8)),
  };
}
