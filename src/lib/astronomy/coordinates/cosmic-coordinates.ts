import { equatorialToGalactic } from "./equatorial-to-galactic";
import { GALACTOCENTRIC_CONSTANTS } from "./galactocentric";
import { LY_PER_MPC, KPC_PER_MPC } from "./local-group";
import { SupergalacticCoordinates } from "@/domain/cosmic-structure/types";

export interface CosmicCartesianCoordinates {
  xMpc: number; // Galactocentric +X (towards Galactic Center)
  yMpc: number; // Galactocentric +Y (direction of Galactic rotation l = 90°)
  zMpc: number; // Galactocentric +Z (towards North Galactic Pole b = +90°)
  distanceMpc: number;
  distanceLy: number;
  lookbackTimeYears: number;
  supergalactic: SupergalacticCoordinates;
}

export interface InterStructureSeparationVector {
  separationMpc: number;
  separationLy: number;
  dxMpc: number;
  dyMpc: number;
  dzMpc: number;
}

/**
 * Standard IAU / de Vaucouleurs (1953) Galactic to Supergalactic Orthonormal Rotation Matrix
 */
const ROT_G_TO_SG: [[number, number, number], [number, number, number], [number, number, number]] =
  [
    [-0.73574257, 0.67726127, 0.0],
    [-0.07455438, -0.08099147, 0.99392259],
    [0.6731453, 0.73127117, 0.11008126],
  ];

/**
 * Supergalactic to Galactic Inverse Rotation Matrix (Transpose of Orthonormal Matrix)
 */
const ROT_SG_TO_G: [[number, number, number], [number, number, number], [number, number, number]] =
  [
    [-0.73574257, -0.07455438, 0.6731453],
    [0.67726127, -0.08099147, 0.73127117],
    [0.0, 0.99392259, 0.11008126],
  ];

/**
 * Converts Galactic Cartesian vector to Supergalactic Cartesian vector:
 * v_SG = M_G_to_SG * v_G
 */
export function galacticCartesianToSupergalacticCartesian(
  xMpc: number,
  yMpc: number,
  zMpc: number
): { sgxMpc: number; sgyMpc: number; sgzMpc: number } {
  const sgxMpc = ROT_G_TO_SG[0][0] * xMpc + ROT_G_TO_SG[0][1] * yMpc + ROT_G_TO_SG[0][2] * zMpc;
  const sgyMpc = ROT_G_TO_SG[1][0] * xMpc + ROT_G_TO_SG[1][1] * yMpc + ROT_G_TO_SG[1][2] * zMpc;
  const sgzMpc = ROT_G_TO_SG[2][0] * xMpc + ROT_G_TO_SG[2][1] * yMpc + ROT_G_TO_SG[2][2] * zMpc;

  return { sgxMpc, sgyMpc, sgzMpc };
}

/**
 * Converts Supergalactic Cartesian vector to Galactic Cartesian vector:
 * v_G = M_SG_to_G * v_SG
 */
export function supergalacticCartesianToGalacticCartesian(
  sgxMpc: number,
  sgyMpc: number,
  sgzMpc: number
): { xMpc: number; yMpc: number; zMpc: number } {
  const xMpc = ROT_SG_TO_G[0][0] * sgxMpc + ROT_SG_TO_G[0][1] * sgyMpc + ROT_SG_TO_G[0][2] * sgzMpc;
  const yMpc = ROT_SG_TO_G[1][0] * sgxMpc + ROT_SG_TO_G[1][1] * sgyMpc + ROT_SG_TO_G[1][2] * sgzMpc;
  const zMpc = ROT_SG_TO_G[2][0] * sgxMpc + ROT_SG_TO_G[2][1] * sgyMpc + ROT_SG_TO_G[2][2] * sgzMpc;

  return { xMpc, yMpc, zMpc };
}

/**
 * Converts Supergalactic Cartesian vector to Supergalactic spherical coordinates (SGL, SGB)
 */
export function supergalacticCartesianToSpherical(
  sgxMpc: number,
  sgyMpc: number,
  sgzMpc: number
): { sglDeg: number; sgbDeg: number; distanceMpc: number } {
  const distanceMpc = Math.sqrt(sgxMpc * sgxMpc + sgyMpc * sgyMpc + sgzMpc * sgzMpc);
  if (distanceMpc === 0) {
    return { sglDeg: 0, sgbDeg: 0, distanceMpc: 0 };
  }

  let sglDeg = (Math.atan2(sgyMpc, sgxMpc) * 180.0) / Math.PI;
  if (sglDeg < 0) sglDeg += 360.0;

  const sgbDeg = (Math.asin(Math.max(-1.0, Math.min(1.0, sgzMpc / distanceMpc))) * 180.0) / Math.PI;

  return { sglDeg, sgbDeg, distanceMpc };
}

/**
 * Transforms Galactic Coordinates (l, b) and Distance (in Mpc)
 * into standard Galactocentric Megaparsec Cartesian frame (X, Y, Z)_CC
 * and Supergalactic frame (SGL, SGB, SGX, SGY, SGZ).
 */
export function galacticToCosmicCoordinates(
  lDeg: number,
  bDeg: number,
  distanceMpc: number,
  r0Kpc: number = GALACTOCENTRIC_CONSTANTS.SUN_DISTANCE_TO_GC_PC / 1000.0,
  z0Kpc: number = GALACTOCENTRIC_CONSTANTS.SUN_HEIGHT_ABOVE_MIDPLANE_PC / 1000.0
): CosmicCartesianCoordinates {
  const lRad = (lDeg * Math.PI) / 180.0;
  const bRad = (bDeg * Math.PI) / 180.0;

  const cosB = Math.cos(bRad);
  const sinB = Math.sin(bRad);
  const cosL = Math.cos(lRad);
  const sinL = Math.sin(lRad);

  // Heliocentric Cartesian offset in Mpc
  const xHelioMpc = distanceMpc * cosB * cosL;
  const yHelioMpc = distanceMpc * cosB * sinL;
  const zHelioMpc = distanceMpc * sinB;

  // Translate Sun offset to Milky Way Galactic Center
  const r0Mpc = r0Kpc / KPC_PER_MPC;
  const z0Mpc = z0Kpc / KPC_PER_MPC;
  const xMpc = xHelioMpc - r0Mpc;
  const yMpc = yHelioMpc;
  const zMpc = zHelioMpc + z0Mpc;

  const totalDistanceMpc = Math.sqrt(xMpc * xMpc + yMpc * yMpc + zMpc * zMpc);
  const distanceLy = totalDistanceMpc * LY_PER_MPC;
  const lookbackTimeYears = distanceLy; // Light travel time in vacuum

  // Rotate to Supergalactic frame
  const sgCart = galacticCartesianToSupergalacticCartesian(xMpc, yMpc, zMpc);
  const sgSph = supergalacticCartesianToSpherical(sgCart.sgxMpc, sgCart.sgyMpc, sgCart.sgzMpc);

  return {
    xMpc,
    yMpc,
    zMpc,
    distanceMpc: totalDistanceMpc,
    distanceLy,
    lookbackTimeYears,
    supergalactic: {
      sglDeg: sgSph.sglDeg,
      sgbDeg: sgSph.sgbDeg,
      sgxMpc: sgCart.sgxMpc,
      sgyMpc: sgCart.sgyMpc,
      sgzMpc: sgCart.sgzMpc,
    },
  };
}

/**
 * Transforms Equatorial Coordinates (RA, Dec J2000) and Distance (in Mpc)
 * into Galactocentric and Supergalactic Cosmic Coordinates.
 */
export function equatorialToCosmicCoordinates(
  raDeg: number,
  decDeg: number,
  distanceMpc: number
): CosmicCartesianCoordinates {
  const gal = equatorialToGalactic(raDeg, decDeg);
  return galacticToCosmicCoordinates(gal.lDeg, gal.bDeg, distanceMpc);
}

/**
 * Calculates the exact 3D spatial separation vector between two large-scale structures in Megaparsecs.
 */
export function calculateInterStructureSeparation(
  posA: { xMpc: number; yMpc: number; zMpc: number },
  posB: { xMpc: number; yMpc: number; zMpc: number }
): InterStructureSeparationVector {
  const dxMpc = posB.xMpc - posA.xMpc;
  const dyMpc = posB.yMpc - posA.yMpc;
  const dzMpc = posB.zMpc - posA.zMpc;

  const separationMpc = Math.sqrt(dxMpc * dxMpc + dyMpc * dyMpc + dzMpc * dzMpc);
  const separationLy = separationMpc * LY_PER_MPC;

  return {
    separationMpc,
    separationLy,
    dxMpc,
    dyMpc,
    dzMpc,
  };
}

/**
 * Computes center-of-mass barycenter for a cluster or collection of member structures with masses.
 */
export function computeCosmicBarycenter(
  members: Array<{ posMpc: { xMpc: number; yMpc: number; zMpc: number }; massSolar: number }>
): { xMpc: number; yMpc: number; zMpc: number; totalMassSolar: number } {
  let totalMass = 0;
  let weightedX = 0;
  let weightedY = 0;
  let weightedZ = 0;

  for (const m of members) {
    totalMass += m.massSolar;
    weightedX += m.posMpc.xMpc * m.massSolar;
    weightedY += m.posMpc.yMpc * m.massSolar;
    weightedZ += m.posMpc.zMpc * m.massSolar;
  }

  if (totalMass === 0) {
    return { xMpc: 0, yMpc: 0, zMpc: 0, totalMassSolar: 0 };
  }

  return {
    xMpc: weightedX / totalMass,
    yMpc: weightedY / totalMass,
    zMpc: weightedZ / totalMass,
    totalMassSolar: totalMass,
  };
}
