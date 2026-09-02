import { describe, it, expect } from "vitest";
import {
  evaluateVisibility,
  calculateAirmass,
} from "@/lib/astronomy/observation/visibility";
import { HorizontalCoordinates, RiseTransitSetResult } from "@/domain/observer/types";

describe("Visibility Engine", () => {
  it("calculates airmass correctly across altitudes", () => {
    // At Zenith (90° alt), airmass X = 1.0
    expect(calculateAirmass(90.0)).toBeCloseTo(1.0, 1);
    // At 30° alt (z = 60°), airmass X ≈ 2.0
    expect(calculateAirmass(30.0)).toBeCloseTo(2.0, 1);
    // Below horizon, airmass is capped at 99.0
    expect(calculateAirmass(-5.0)).toBe(99.0);
  });

  it("evaluates prime visibility for high altitude objects in dark sky", () => {
    const horizontal: HorizontalCoordinates = {
      altitudeDeg: 45.0,
      apparentAltitudeDeg: 45.02,
      azimuthDeg: 180.0,
      hourAngleDeg: 0.0,
      hourAngleHours: 0.0,
      isAboveHorizon: true,
    };

    const rts: RiseTransitSetResult = {
      riseDate: new Date(),
      transitDate: new Date(),
      setDate: new Date(),
      transitAltitudeDeg: 45.0,
      status: "NORMAL",
    };

    const result = evaluateVisibility(horizontal, rts, 0.0, true);
    expect(result.visibilityClass).toBe("PRIME_OBSERVATION");
    expect(result.state).toBe("CULMINATING");
    expect(result.isNakedEyeVisible).toBe(true);
    expect(result.qualityScore).toBeGreaterThanOrEqual(70);
  });

  it("identifies rising and setting objects based on hour angle", () => {
    const risingHoriz: HorizontalCoordinates = {
      altitudeDeg: 20.0,
      apparentAltitudeDeg: 20.05,
      azimuthDeg: 90.0,
      hourAngleDeg: -45.0,
      hourAngleHours: 21.0,
      isAboveHorizon: true,
    };

    const rts: RiseTransitSetResult = {
      riseDate: new Date(),
      transitDate: new Date(),
      setDate: new Date(),
      transitAltitudeDeg: 60.0,
      status: "NORMAL",
    };

    const risingResult = evaluateVisibility(risingHoriz, rts, 2.0, true);
    expect(risingResult.state).toBe("RISING");
    expect(risingResult.visibilityClass).toBe("MODERATE_OBSERVATION");

    const settingHoriz: HorizontalCoordinates = {
      ...risingHoriz,
      azimuthDeg: 270.0,
      hourAngleDeg: 45.0,
      hourAngleHours: 3.0,
    };
    const settingResult = evaluateVisibility(settingHoriz, rts, 2.0, true);
    expect(settingResult.state).toBe("SETTING");
  });

  it("identifies objects below horizon and never-rises bodies", () => {
    const belowHoriz: HorizontalCoordinates = {
      altitudeDeg: -30.0,
      apparentAltitudeDeg: -30.0,
      azimuthDeg: 180.0,
      hourAngleDeg: 180.0,
      hourAngleHours: 12.0,
      isAboveHorizon: false,
    };

    const rts: RiseTransitSetResult = {
      riseDate: null,
      transitDate: null,
      setDate: null,
      transitAltitudeDeg: -20.0,
      status: "NEVER_RISES",
    };

    const result = evaluateVisibility(belowHoriz, rts, 1.0, true);
    expect(result.state).toBe("BELOW_HORIZON");
    expect(result.visibilityClass).toBe("BELOW_HORIZON");
    expect(result.isNakedEyeVisible).toBe(false);
    expect(result.qualityScore).toBe(0);
  });
});
