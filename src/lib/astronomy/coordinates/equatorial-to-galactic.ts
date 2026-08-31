/**
 * Pure Astronomical Coordinate Transformation: Equatorial (ICRS J2000) <-> Galactic (System II)
 *
 * In accordance with IAU standards (Blaauw et al. 1960 / J2000 IAU definition):
 * - North Galactic Pole (NGP):
 *     alpha_NGP = 192.85948 deg (12h 51m 26.28s)
 *     delta_NGP = 27.12825 deg (+27 deg 07' 41.7'')
 * - Galactic Center (Sgr A* region reference):
 *     l_NCP = 122.93192 deg (position angle of NCP relative to galactic north)
 * - Galactic Longitude (l): degrees [0, 360)
 * - Galactic Latitude (b): degrees [-90, +90]
 */

export interface GalacticCoordinates {
  lDeg: number; // Galactic Longitude [0, 360)
  bDeg: number; // Galactic Latitude [-90, +90]
}

export interface EquatorialCoordinates {
  raDeg: number; // Right Ascension [0, 360)
  decDeg: number; // Declination [-90, +90]
}

const DEG_TO_RAD = Math.PI / 180.0;
const RAD_TO_DEG = 180.0 / Math.PI;

// Standard IAU J2000 Constants
const ALPHA_NGP_RAD = 192.85948 * DEG_TO_RAD;
const DELTA_NGP_RAD = 27.12825 * DEG_TO_RAD;
const L_NCP_RAD = 122.93192 * DEG_TO_RAD;

const SIN_DELTA_NGP = Math.sin(DELTA_NGP_RAD);
const COS_DELTA_NGP = Math.cos(DELTA_NGP_RAD);

/**
 * Transforms Equatorial ICRS Coordinates (RA, Dec in degrees) to Galactic Coordinates (l, b in degrees).
 *
 * Formulas:
 * sin(b) = sin(dec) * sin(delta_NGP) + cos(dec) * cos(delta_NGP) * cos(ra - alpha_NGP)
 * cos(b) * sin(l_NCP - l) = cos(dec) * sin(ra - alpha_NGP)
 * cos(b) * cos(l_NCP - l) = sin(dec) * cos(delta_NGP) - cos(dec) * sin(delta_NGP) * cos(ra - alpha_NGP)
 */
export function equatorialToGalactic(raDeg: number, decDeg: number): GalacticCoordinates {
  const raRad = raDeg * DEG_TO_RAD;
  const decRad = decDeg * DEG_TO_RAD;

  const sinDec = Math.sin(decRad);
  const cosDec = Math.cos(decRad);
  const deltaAlpha = raRad - ALPHA_NGP_RAD;
  const sinDeltaAlpha = Math.sin(deltaAlpha);
  const cosDeltaAlpha = Math.cos(deltaAlpha);

  // 1. Calculate Galactic Latitude (b)
  const sinB = sinDec * SIN_DELTA_NGP + cosDec * COS_DELTA_NGP * cosDeltaAlpha;
  const bRad = Math.asin(Math.max(-1, Math.min(1, sinB)));
  const bDeg = bRad * RAD_TO_DEG;

  // 2. Calculate Galactic Longitude (l)
  const y = cosDec * sinDeltaAlpha;
  const x = sinDec * COS_DELTA_NGP - cosDec * SIN_DELTA_NGP * cosDeltaAlpha;

  let lRad = L_NCP_RAD - Math.atan2(y, x);

  // Normalize l to [0, 2*PI)
  while (lRad < 0) {
    lRad += 2 * Math.PI;
  }
  while (lRad >= 2 * Math.PI) {
    lRad -= 2 * Math.PI;
  }

  const lDeg = lRad * RAD_TO_DEG;

  return {
    lDeg: Number(lDeg.toFixed(5)),
    bDeg: Number(bDeg.toFixed(5)),
  };
}

/**
 * Transforms Galactic Coordinates (l, b in degrees) to Equatorial ICRS Coordinates (RA, Dec in degrees).
 */
export function galacticToEquatorial(lDeg: number, bDeg: number): EquatorialCoordinates {
  const lRad = lDeg * DEG_TO_RAD;
  const bRad = bDeg * DEG_TO_RAD;

  const sinB = Math.sin(bRad);
  const cosB = Math.cos(bRad);
  const deltaL = L_NCP_RAD - lRad;
  const sinDeltaL = Math.sin(deltaL);
  const cosDeltaL = Math.cos(deltaL);

  // 1. Calculate Declination (dec)
  const sinDec = sinB * SIN_DELTA_NGP + cosB * COS_DELTA_NGP * cosDeltaL;
  const decRad = Math.asin(Math.max(-1, Math.min(1, sinDec)));
  const decDeg = decRad * RAD_TO_DEG;

  // 2. Calculate Right Ascension (ra)
  const y = cosB * sinDeltaL;
  const x = sinB * COS_DELTA_NGP - cosB * SIN_DELTA_NGP * cosDeltaL;

  let raRad = ALPHA_NGP_RAD + Math.atan2(y, x);

  // Normalize ra to [0, 2*PI)
  while (raRad < 0) {
    raRad += 2 * Math.PI;
  }
  while (raRad >= 2 * Math.PI) {
    raRad -= 2 * Math.PI;
  }

  const raDeg = raRad * RAD_TO_DEG;

  return {
    raDeg: Number(raDeg.toFixed(5)),
    decDeg: Number(decDeg.toFixed(5)),
  };
}
