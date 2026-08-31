/**
 * Parametric Logarithmic Spiral Arm Model of the Milky Way Galaxy
 * Grounded in trigonometric parallax of high-mass star forming regions (Reid et al. 2019 / Vallée 2017).
 *
 * Logarithmic spiral equation:
 * r(theta) = r_0 * exp((theta - theta_0) * tan(psi))
 * where:
 * - r_0 is reference radius at reference angle theta_0
 * - psi is pitch angle (typically 9° to 14° for Milky Way arms)
 * - theta is galactocentric azimuth angle (in radians)
 */

export interface SpiralArmDefinition {
  id: string;
  name: string;
  shortName: string;
  color: string;
  pitchAngleDeg: number; // psi
  r0Kpc: number; // reference radius at theta0
  theta0Deg: number; // reference angle
  thetaMinDeg: number; // start angle
  thetaMaxDeg: number; // end angle
  widthKpc: number; // representative arm thickness
  isSpur: boolean;
  modelSource: string;
}

export interface SpiralArmPoint {
  thetaDeg: number;
  radiusKpc: number;
  xKpc: number; // Galactocentric X
  yKpc: number; // Galactocentric Y
}

export const SPIRAL_ARM_DEFINITIONS: SpiralArmDefinition[] = [
  {
    id: "orion-spur",
    name: "Orion Spur / Local Arm",
    shortName: "Orion Spur",
    color: "#38BDF8", // Cyan / Electric Blue
    pitchAngleDeg: 12.0,
    r0Kpc: 8.2,
    theta0Deg: 55.0,
    thetaMinDeg: 35.0,
    thetaMaxDeg: 115.0,
    widthKpc: 0.6,
    isSpur: true,
    modelSource: "Reid et al. (2019) / Xu et al. (2016) BeSSeL Survey",
  },
  {
    id: "perseus-arm",
    name: "Perseus Arm",
    shortName: "Perseus",
    color: "#A78BFA", // Purple / Violet
    pitchAngleDeg: 10.0,
    r0Kpc: 9.9,
    theta0Deg: 40.0,
    thetaMinDeg: 10.0,
    thetaMaxDeg: 240.0,
    widthKpc: 0.8,
    isSpur: false,
    modelSource: "Reid et al. (2019) / Vallée (2017)",
  },
  {
    id: "sagittarius-arm",
    name: "Sagittarius-Carina Arm",
    shortName: "Sagittarius",
    color: "#F43F5E", // Rose / Red
    pitchAngleDeg: 13.0,
    r0Kpc: 6.6,
    theta0Deg: 25.0,
    thetaMinDeg: 15.0,
    thetaMaxDeg: 230.0,
    widthKpc: 0.8,
    isSpur: false,
    modelSource: "Reid et al. (2019) / Vallée (2017)",
  },
  {
    id: "scutum-centaurus-arm",
    name: "Scutum-Centaurus Arm",
    shortName: "Scutum-Centaurus",
    color: "#FBBF24", // Amber / Gold
    pitchAngleDeg: 12.5,
    r0Kpc: 5.0,
    theta0Deg: 30.0,
    thetaMinDeg: 20.0,
    thetaMaxDeg: 260.0,
    widthKpc: 0.9,
    isSpur: false,
    modelSource: "Reid et al. (2019) / Vallée (2017)",
  },
  {
    id: "outer-norma-arm",
    name: "Norma-Outer Arm",
    shortName: "Norma-Outer",
    color: "#34D399", // Emerald
    pitchAngleDeg: 9.0,
    r0Kpc: 12.2,
    theta0Deg: 45.0,
    thetaMinDeg: 10.0,
    thetaMaxDeg: 200.0,
    widthKpc: 0.7,
    isSpur: false,
    modelSource: "Reid et al. (2019) / Vallée (2017)",
  },
];

/**
 * Calculates the Galactocentric radius r(theta) for a given spiral arm at azimuth theta.
 */
export function calculateSpiralArmRadius(arm: SpiralArmDefinition, thetaDeg: number): number {
  const psiRad = (arm.pitchAngleDeg * Math.PI) / 180.0;
  const deltaThetaRad = ((thetaDeg - arm.theta0Deg) * Math.PI) / 180.0;
  const radiusKpc = arm.r0Kpc * Math.exp(deltaThetaRad * Math.tan(psiRad));
  return radiusKpc;
}

/**
 * Generates an array of Galactocentric Cartesian sample points along a logarithmic spiral arm.
 */
export function generateSpiralArmPoints(
  arm: SpiralArmDefinition,
  stepDeg: number = 2.0
): SpiralArmPoint[] {
  const points: SpiralArmPoint[] = [];

  for (let theta = arm.thetaMinDeg; theta <= arm.thetaMaxDeg; theta += stepDeg) {
    const rKpc = calculateSpiralArmRadius(arm, theta);
    const thetaRad = (theta * Math.PI) / 180.0;

    // Convert polar (r, theta) to Galactocentric Cartesian (X, Y)
    const xKpc = rKpc * Math.cos(thetaRad);
    const yKpc = rKpc * Math.sin(thetaRad);

    points.push({
      thetaDeg: theta,
      radiusKpc: rKpc,
      xKpc,
      yKpc,
    });
  }

  return points;
}

/**
 * Tests if a given Galactocentric point (xKpc, yKpc) is within the model-derived boundary
 * of a spiral arm (within ± width/2).
 */
export function isPointNearSpiralArm(
  arm: SpiralArmDefinition,
  xKpc: number,
  yKpc: number,
  toleranceKpc?: number
): { isNear: boolean; distanceKpc: number } {
  const rKpc = Math.sqrt(xKpc * xKpc + yKpc * yKpc);
  let thetaDeg = (Math.atan2(yKpc, xKpc) * 180.0) / Math.PI;
  if (thetaDeg < 0) thetaDeg += 360.0;

  if (thetaDeg < arm.thetaMinDeg || thetaDeg > arm.thetaMaxDeg) {
    return { isNear: false, distanceKpc: 999.0 };
  }

  const modelRadius = calculateSpiralArmRadius(arm, thetaDeg);
  const distanceKpc = Math.abs(rKpc - modelRadius);
  const maxAllowed = toleranceKpc ?? arm.widthKpc / 2.0;

  return {
    isNear: distanceKpc <= maxAllowed,
    distanceKpc,
  };
}
