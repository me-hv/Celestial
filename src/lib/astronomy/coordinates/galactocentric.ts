import { equatorialToGalactic, galacticToEquatorial } from "./equatorial-to-galactic";

/**
 * Standard Galactocentric Coordinate Reference Constants
 * Grounded in peer-reviewed astronomical consensus:
 * - Distance to Galactic Center R_0: 8,178 pc ± 26 pc (GRAVITY Collaboration, Abuter et al. 2019)
 * - Solar height above Galactic Midplane z_0: +20.8 pc ± 0.3 pc (Bennett & Bovy 2019 / Bland-Hawthorn & Gerhard 2016)
 */
export const GALACTOCENTRIC_CONSTANTS = {
  SUN_DISTANCE_TO_GC_PC: 8178.0, // R_0 in parsecs
  SUN_HEIGHT_ABOVE_MIDPLANE_PC: 20.8, // z_0 in parsecs
  SUN_ROTATION_SPEED_KM_S: 234.0, // V_0 (circular rotation speed at R_0)
};

export interface GalactocentricCoordinates {
  xPc: number; // +X points from Sun to Galactic Center projected on Galactic Plane
  yPc: number; // +Y points in direction of Galactic rotation (l = 90°)
  zPc: number; // +Z points toward North Galactic Pole (b = +90°)
  rGalactocentricPc: number; // Total 3D distance from Galactic Center
  inPlaneRadiusPc: number; // Cylindrical radius in galactic midplane (R_xy)
  azimuthDeg: number; // In-plane azimuthal angle phi from Sun-GC axis (-180° to +180°)
}

export interface HeliocentricCartesianCoordinates {
  xPc: number; // points toward Galactic Center (l = 0°, b = 0°)
  yPc: number; // points toward Galactic rotation (l = 90°, b = 0°)
  zPc: number; // points toward North Galactic Pole (b = +90°)
  distancePc: number;
}

/**
 * Converts Galactic Coordinates (l, b) and Heliocentric Distance (pc)
 * into Heliocentric Cartesian Coordinates.
 */
export function galacticToHeliocentricCartesian(
  lDeg: number,
  bDeg: number,
  distancePc: number
): HeliocentricCartesianCoordinates {
  const lRad = (lDeg * Math.PI) / 180.0;
  const bRad = (bDeg * Math.PI) / 180.0;

  const cosB = Math.cos(bRad);
  const sinB = Math.sin(bRad);
  const cosL = Math.cos(lRad);
  const sinL = Math.sin(lRad);

  const xPc = distancePc * cosB * cosL;
  const yPc = distancePc * cosB * sinL;
  const zPc = distancePc * sinB;

  return {
    xPc,
    yPc,
    zPc,
    distancePc,
  };
}

/**
 * Transforms Galactic Coordinates (l, b) and Heliocentric Distance (pc)
 * into standard Galactocentric Cartesian Coordinates (X, Y, Z)_GC.
 *
 * Convention:
 * - Origin is at the Galactic Center (0, 0, 0).
 * - The Sun is located at (-R_0, 0, +z_0).
 * - +X points toward the GC projected on midplane.
 * - +Y points in the direction of galactic rotation (l = 90°).
 * - +Z points toward the North Galactic Pole (b = +90°).
 */
export function galacticToGalactocentric(
  lDeg: number,
  bDeg: number,
  distancePc: number,
  r0Pc: number = GALACTOCENTRIC_CONSTANTS.SUN_DISTANCE_TO_GC_PC,
  z0Pc: number = GALACTOCENTRIC_CONSTANTS.SUN_HEIGHT_ABOVE_MIDPLANE_PC
): GalactocentricCoordinates {
  const helio = galacticToHeliocentricCartesian(lDeg, bDeg, distancePc);

  // Translate Sun offset from Galactic Center
  const xPc = helio.xPc - r0Pc;
  const yPc = helio.yPc;
  const zPc = helio.zPc + z0Pc;

  const inPlaneRadiusPc = Math.sqrt(xPc * xPc + yPc * yPc);
  const rGalactocentricPc = Math.sqrt(xPc * xPc + yPc * yPc + zPc * zPc);
  const azimuthDeg = (Math.atan2(yPc, xPc) * 180.0) / Math.PI;

  return {
    xPc,
    yPc,
    zPc,
    rGalactocentricPc,
    inPlaneRadiusPc,
    azimuthDeg,
  };
}

/**
 * Transforms Equatorial Coordinates (RA, Dec in J2000) and Heliocentric Distance (pc)
 * directly into Galactocentric Cartesian Coordinates.
 */
export function equatorialToGalactocentric(
  raDeg: number,
  decDeg: number,
  distancePc: number,
  r0Pc: number = GALACTOCENTRIC_CONSTANTS.SUN_DISTANCE_TO_GC_PC,
  z0Pc: number = GALACTOCENTRIC_CONSTANTS.SUN_HEIGHT_ABOVE_MIDPLANE_PC
): GalactocentricCoordinates {
  const galactic = equatorialToGalactic(raDeg, decDeg);
  return galacticToGalactocentric(galactic.lDeg, galactic.bDeg, distancePc, r0Pc, z0Pc);
}

/**
 * Inverse transformation: Converts Galactocentric Cartesian Coordinates (X, Y, Z)_GC
 * back to Galactic Coordinates (l, b) and Heliocentric Distance (pc).
 */
export function galactocentricToGalactic(
  xPc: number,
  yPc: number,
  zPc: number,
  r0Pc: number = GALACTOCENTRIC_CONSTANTS.SUN_DISTANCE_TO_GC_PC,
  z0Pc: number = GALACTOCENTRIC_CONSTANTS.SUN_HEIGHT_ABOVE_MIDPLANE_PC
): { lDeg: number; bDeg: number; distancePc: number } {
  // Heliocentric vector from Sun to object
  const dx = xPc + r0Pc;
  const dy = yPc;
  const dz = zPc - z0Pc;

  const distancePc = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (distancePc === 0) {
    return { lDeg: 0, bDeg: 0, distancePc: 0 };
  }

  const bRad = Math.asin(Math.max(-1, Math.min(1, dz / distancePc)));
  const bDeg = (bRad * 180.0) / Math.PI;

  let lRad = Math.atan2(dy, dx);
  if (lRad < 0) lRad += 2 * Math.PI;
  const lDeg = (lRad * 180.0) / Math.PI;

  return {
    lDeg,
    bDeg,
    distancePc,
  };
}

/**
 * Converts Galactocentric Cartesian Coordinates directly to Equatorial (RA, Dec) J2000.
 */
export function galactocentricToEquatorial(
  xPc: number,
  yPc: number,
  zPc: number,
  r0Pc: number = GALACTOCENTRIC_CONSTANTS.SUN_DISTANCE_TO_GC_PC,
  z0Pc: number = GALACTOCENTRIC_CONSTANTS.SUN_HEIGHT_ABOVE_MIDPLANE_PC
): { raDeg: number; decDeg: number; distancePc: number } {
  const gal = galactocentricToGalactic(xPc, yPc, zPc, r0Pc, z0Pc);
  const eq = galacticToEquatorial(gal.lDeg, gal.bDeg);
  return {
    raDeg: eq.raDeg,
    decDeg: eq.decDeg,
    distancePc: gal.distancePc,
  };
}

/**
 * Returns canonical Solar position in Galactocentric Cartesian space.
 */
export function getSunGalactocentricPosition(
  r0Pc: number = GALACTOCENTRIC_CONSTANTS.SUN_DISTANCE_TO_GC_PC,
  z0Pc: number = GALACTOCENTRIC_CONSTANTS.SUN_HEIGHT_ABOVE_MIDPLANE_PC
): GalactocentricCoordinates {
  return {
    xPc: -r0Pc,
    yPc: 0.0,
    zPc: z0Pc,
    rGalactocentricPc: Math.sqrt(r0Pc * r0Pc + z0Pc * z0Pc),
    inPlaneRadiusPc: r0Pc,
    azimuthDeg: 180.0,
  };
}
