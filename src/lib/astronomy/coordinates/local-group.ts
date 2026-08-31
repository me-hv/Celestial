import { equatorialToGalactic } from "./equatorial-to-galactic";
import { GALACTOCENTRIC_CONSTANTS } from "./galactocentric";

export interface LocalGroupCoordinates {
  xKpc: number; // +X points from Milky Way center toward Galactic Center direction projected on plane
  yKpc: number; // +Y points in direction of Galactic rotation (l = 90°)
  zKpc: number; // +Z points toward North Galactic Pole (b = +90°)
  distanceKpc: number; // Total 3D distance from Milky Way center
  distanceMpc: number; // Total 3D distance in Megaparsecs
  distanceLy: number; // Total 3D distance in Light-Years
  lookbackTimeYears: number; // Light travel time: t = d / c
}

export interface InterGalaxyVector {
  separationKpc: number;
  separationMpc: number;
  separationLy: number;
  dxKpc: number;
  dyKpc: number;
  dzKpc: number;
  relativeRadialVelocityKmS?: number;
  approachTimeYears?: number; // Estimated time to encounter if approaching
}

/**
 * Speed of light in kilometers per second
 */
export const SPEED_OF_LIGHT_KM_S = 299792.458;

/**
 * Standard light-years per Megaparsec conversion
 */
export const LY_PER_MPC = 3261563.777;
export const LY_PER_KPC = 3261.563777;
export const KPC_PER_MPC = 1000.0;

/**
 * Transforms Galactic Coordinates (l, b) and Heliocentric Distance (in kpc)
 * into standard Local Group Galactocentric Cartesian Coordinates (X, Y, Z)_LG.
 *
 * Origin: Milky Way Center (0, 0, 0)
 * Sun Position: (-R_0, 0, +z_0) = (-8.178 kpc, 0, +0.0208 kpc)
 */
export function galacticToLocalGroup(
  lDeg: number,
  bDeg: number,
  distanceKpc: number,
  r0Kpc: number = GALACTOCENTRIC_CONSTANTS.SUN_DISTANCE_TO_GC_PC / 1000.0,
  z0Kpc: number = GALACTOCENTRIC_CONSTANTS.SUN_HEIGHT_ABOVE_MIDPLANE_PC / 1000.0
): LocalGroupCoordinates {
  const lRad = (lDeg * Math.PI) / 180.0;
  const bRad = (bDeg * Math.PI) / 180.0;

  const cosB = Math.cos(bRad);
  const sinB = Math.sin(bRad);
  const cosL = Math.cos(lRad);
  const sinL = Math.sin(lRad);

  // Heliocentric Cartesian offset in kpc
  const xHelioKpc = distanceKpc * cosB * cosL;
  const yHelioKpc = distanceKpc * cosB * sinL;
  const zHelioKpc = distanceKpc * sinB;

  // Translate Sun offset to Milky Way Center
  const xKpc = xHelioKpc - r0Kpc;
  const yKpc = yHelioKpc;
  const zKpc = zHelioKpc + z0Kpc;

  const totalDistanceKpc = Math.sqrt(xKpc * xKpc + yKpc * yKpc + zKpc * zKpc);
  const distanceMpc = totalDistanceKpc / KPC_PER_MPC;
  const distanceLy = distanceKpc * LY_PER_KPC;
  const lookbackTimeYears = distanceLy; // Light travel time

  return {
    xKpc,
    yKpc,
    zKpc,
    distanceKpc: totalDistanceKpc,
    distanceMpc,
    distanceLy,
    lookbackTimeYears,
  };
}

/**
 * Transforms Equatorial Coordinates (RA, Dec J2000) and Heliocentric Distance (in kpc)
 * into standard Local Group Galactocentric Cartesian Coordinates.
 */
export function equatorialToLocalGroup(
  raDeg: number,
  decDeg: number,
  distanceKpc: number
): LocalGroupCoordinates {
  const gal = equatorialToGalactic(raDeg, decDeg);
  return galacticToLocalGroup(gal.lDeg, gal.bDeg, distanceKpc);
}

/**
 * Calculates the exact 3D spatial separation vector between two galaxies in Local Group space.
 */
export function calculateInterGalaxyVector(
  posA: LocalGroupCoordinates,
  posB: LocalGroupCoordinates,
  radialVelocityApproachKmS?: number
): InterGalaxyVector {
  const dxKpc = posB.xKpc - posA.xKpc;
  const dyKpc = posB.yKpc - posA.yKpc;
  const dzKpc = posB.zKpc - posA.zKpc;

  const separationKpc = Math.sqrt(dxKpc * dxKpc + dyKpc * dyKpc + dzKpc * dzKpc);
  const separationMpc = separationKpc / KPC_PER_MPC;
  const separationLy = separationKpc * LY_PER_KPC;

  let approachTimeYears: number | undefined = undefined;
  if (radialVelocityApproachKmS && radialVelocityApproachKmS > 0) {
    // 1 kpc = 3.085677581e16 km, 1 year = 3.15576e7 s
    const separationKm = separationKpc * 3.085677581e16;
    const timeSeconds = separationKm / radialVelocityApproachKmS;
    approachTimeYears = timeSeconds / 31557600.0;
  }

  return {
    separationKpc,
    separationMpc,
    separationLy,
    dxKpc,
    dyKpc,
    dzKpc,
    relativeRadialVelocityKmS: radialVelocityApproachKmS,
    approachTimeYears,
  };
}

/**
 * Computes estimated Local Group barycenter location in Galactocentric Cartesian coordinates.
 * Dominated by Milky Way mass (~1.15 x 10^12 M_sun) and Andromeda mass (~1.5 x 10^12 M_sun).
 */
export function computeLocalGroupBarycenter(
  milkyWayMassSolar: number = 1.15e12,
  andromedaPosKpc: { x: number; y: number; z: number } = { x: -379, y: 612, z: -283 },
  andromedaMassSolar: number = 1.5e12
): { xKpc: number; yKpc: number; zKpc: number; distanceFromMilkyWayKpc: number } {
  const totalMass = milkyWayMassSolar + andromedaMassSolar;
  const m31Weight = andromedaMassSolar / totalMass;

  // Milky Way is at (0, 0, 0)
  const xKpc = andromedaPosKpc.x * m31Weight;
  const yKpc = andromedaPosKpc.y * m31Weight;
  const zKpc = andromedaPosKpc.z * m31Weight;

  const distanceFromMilkyWayKpc = Math.sqrt(xKpc * xKpc + yKpc * yKpc + zKpc * zKpc);

  return {
    xKpc,
    yKpc,
    zKpc,
    distanceFromMilkyWayKpc,
  };
}
