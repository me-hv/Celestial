import { describe, it, expect } from "vitest";
import {
  SPIRAL_ARM_DEFINITIONS,
  calculateSpiralArmRadius,
  generateSpiralArmPoints,
  isPointNearSpiralArm,
} from "@/lib/astronomy/galactic/spiral-arms";

describe("Milky Way Logarithmic Spiral Arm Model", () => {
  const orion = SPIRAL_ARM_DEFINITIONS.find((a) => a.id === "orion-spur")!;
  const perseus = SPIRAL_ARM_DEFINITIONS.find((a) => a.id === "perseus-arm")!;

  it("calculates reference radius r_0 at reference angle theta_0", () => {
    const rOrionAtTheta0 = calculateSpiralArmRadius(orion, orion.theta0Deg);
    expect(rOrionAtTheta0).toBeCloseTo(orion.r0Kpc, 4);

    const rPerseusAtTheta0 = calculateSpiralArmRadius(perseus, perseus.theta0Deg);
    expect(rPerseusAtTheta0).toBeCloseTo(perseus.r0Kpc, 4);
  });

  it("produces continuous increasing radius with growing azimuth theta", () => {
    const r1 = calculateSpiralArmRadius(perseus, 40.0);
    const r2 = calculateSpiralArmRadius(perseus, 90.0);
    const r3 = calculateSpiralArmRadius(perseus, 140.0);

    expect(r2).toBeGreaterThan(r1);
    expect(r3).toBeGreaterThan(r2);
  });

  it("generates valid Galactocentric sample points along the spiral arm", () => {
    const points = generateSpiralArmPoints(orion, 5.0);
    expect(points.length).toBeGreaterThan(10);

    points.forEach((pt) => {
      expect(pt.radiusKpc).toBeGreaterThan(5.0);
      expect(pt.radiusKpc).toBeLessThan(15.0);
      const computedR = Math.sqrt(pt.xKpc * pt.xKpc + pt.yKpc * pt.yKpc);
      expect(computedR).toBeCloseTo(pt.radiusKpc, 3);
    });
  });

  it("identifies proximity of points to a model-defined spiral arm", () => {
    const midTheta = (orion.thetaMinDeg + orion.thetaMaxDeg) / 2.0;
    const rMid = calculateSpiralArmRadius(orion, midTheta);
    const thRad = (midTheta * Math.PI) / 180.0;

    const onArmX = rMid * Math.cos(thRad);
    const onArmY = rMid * Math.sin(thRad);

    const checkOnArm = isPointNearSpiralArm(orion, onArmX, onArmY);
    expect(checkOnArm.isNear).toBe(true);
    expect(checkOnArm.distanceKpc).toBeCloseTo(0.0, 3);

    // Far off-arm point
    const checkFar = isPointNearSpiralArm(orion, onArmX + 5.0, onArmY + 5.0);
    expect(checkFar.isNear).toBe(false);
  });
});
