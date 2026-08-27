import { describe, it, expect } from "vitest";
import {
  solveKeplerEquation,
  calculateHeliocentricPosition,
  generateOrbitTrajectoryPoints,
  dateToJulianDate,
} from "@/lib/astronomy/kepler-solver";
import { J2000_EPOCH_JD } from "@/lib/astronomy/constants";

describe("Keplerian Orbital Mechanics Solver", () => {
  it("converts J2000 standard epoch date to 2451545.0 JD", () => {
    // 2000-01-01 12:00:00 UTC is exactly JD 2451545.0
    const j2000Date = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
    const jd = dateToJulianDate(j2000Date);
    expect(jd).toBeCloseTo(J2000_EPOCH_JD, 4);
  });

  it("solves Kepler's Equation for circular orbit (e = 0)", () => {
    const M = Math.PI / 3;
    const E = solveKeplerEquation(M, 0);
    expect(E).toBeCloseTo(M, 8);
  });

  it("solves Kepler's Equation for eccentric orbit (e = 0.2056, Mercury)", () => {
    const M = 1.0;
    const e = 0.20563;
    const E = solveKeplerEquation(M, e);
    // Verify M = E - e * sin(E)
    const computedM = E - e * Math.sin(E);
    expect(computedM).toBeCloseTo(M, 8);
  });

  it("calculates Earth's orbital distance within perihelion/aphelion limits", () => {
    const earthElements = {
      semiMajorAxisAu: 1.00000011,
      eccentricity: 0.01671022,
      inclinationDeg: 0.00005,
      longitudeAscendingNodeDeg: -11.26,
      argumentPeriapsisDeg: 102.947,
      meanAnomalyEpochDeg: 100.464,
      orbitalPeriodDays: 365.256,
      epochJulianDate: J2000_EPOCH_JD,
    };

    const position = calculateHeliocentricPosition(earthElements, J2000_EPOCH_JD);
    const perihelion = earthElements.semiMajorAxisAu * (1 - earthElements.eccentricity);
    const aphelion = earthElements.semiMajorAxisAu * (1 + earthElements.eccentricity);

    expect(position.distanceAu).toBeGreaterThanOrEqual(perihelion - 0.0001);
    expect(position.distanceAu).toBeLessThanOrEqual(aphelion + 0.0001);
  });

  it("generates closed orbital trajectory loop with requested sample count", () => {
    const marsElements = {
      semiMajorAxisAu: 1.523662,
      eccentricity: 0.093412,
      inclinationDeg: 1.85,
      longitudeAscendingNodeDeg: 49.578,
      argumentPeriapsisDeg: 286.502,
    };

    const samples = generateOrbitTrajectoryPoints(marsElements, 64);
    expect(samples.length).toBe(65); // 0 to 64 inclusive
    // First and last point should connect (closed ellipse)
    expect(samples[0].xAu).toBeCloseTo(samples[samples.length - 1].xAu, 5);
  });
});
