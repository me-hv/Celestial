import { describe, it, expect } from "vitest";
import {
  getJulianDate,
  getModifiedJulianDate,
  getJulianCenturies,
  getGreenwichMeanSiderealTimeHours,
  getLocalSiderealTimeHours,
  formatSiderealTime,
  julianDateToDate,
} from "@/lib/astronomy/time/astronomical-time";

describe("Astronomical Time Engine", () => {
  it("calculates accurate Julian Date for J2000.0 epoch", () => {
    // J2000.0 is 2000-01-01T12:00:00Z -> JD 2451545.0
    const j2000Date = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
    const jd = getJulianDate(j2000Date);
    expect(jd).toBeCloseTo(2451545.0, 4);

    // MJD = JD - 2400000.5 -> 51544.5
    const mjd = getModifiedJulianDate(j2000Date);
    expect(mjd).toBeCloseTo(51544.5, 4);

    // Julian centuries T = 0 at J2000.0
    const T = getJulianCenturies(jd);
    expect(T).toBeCloseTo(0.0, 6);
  });

  it("converts Julian Date back to JavaScript Date", () => {
    const original = new Date(Date.UTC(2026, 8, 1, 18, 30, 0));
    const jd = getJulianDate(original);
    const roundTrip = julianDateToDate(jd);
    expect(roundTrip.getTime()).toBe(original.getTime());
  });

  it("computes Greenwich Mean Sidereal Time (GMST)", () => {
    const j2000Date = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
    const jd = getJulianDate(j2000Date);
    const gmstHours = getGreenwichMeanSiderealTimeHours(jd);
    // GMST at J2000.0 is ~18.697 hours (280.46° / 15)
    expect(gmstHours).toBeGreaterThan(18.0);
    expect(gmstHours).toBeLessThan(19.0);
  });

  it("computes Local Sidereal Time (LMST) accounting for observer longitude", () => {
    const date = new Date(Date.UTC(2026, 5, 21, 0, 0, 0));
    const jd = getJulianDate(date);

    const gmst = getGreenwichMeanSiderealTimeHours(jd);
    // Observer at Greenwich (0° lon) -> LMST = GMST
    const lmstGreenwich = getLocalSiderealTimeHours(jd, 0.0);
    expect(lmstGreenwich).toBeCloseTo(gmst, 4);

    // Observer at +90° East -> LMST is 6 hours ahead of GMST
    const lmstEast = getLocalSiderealTimeHours(jd, 90.0);
    const diff = ((lmstEast - gmst + 24.0) % 24.0);
    expect(diff).toBeCloseTo(6.0, 4);
  });

  it("formats decimal hours to standard HH:MM:SS format", () => {
    expect(formatSiderealTime(14.5)).toBe("14:30:00");
    expect(formatSiderealTime(0.25)).toBe("00:15:00");
    expect(formatSiderealTime(23.999)).toBe("23:59:56");
  });
});
