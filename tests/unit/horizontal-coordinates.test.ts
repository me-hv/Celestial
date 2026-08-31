import { describe, it, expect } from "vitest";
import {
  dateToJulianDate,
  julianDateToDate,
  calculateGreenwichMeanSiderealTimeHours,
  calculateLocalMeanSiderealTimeHours,
  equatorialToHorizontal,
  horizontalToEquatorial,
  eclipticToEquatorial,
  equatorialToEcliptic,
  calculateAtmosphericRefractionDeg,
  calculateRiseTransitSet,
  MEAN_OBLIQUITY_J2000_DEG,
} from "@/lib/astronomy/coordinates/horizontal";
import { J2000_EPOCH_JD } from "@/lib/astronomy/constants";

describe("Horizontal Coordinates & Astrometric Transforms", () => {
  it("converts Date to Julian Date and back accurately", () => {
    // J2000.0 epoch is 2000-01-01 12:00:00 UTC = 2451545.0 JD
    const j2000Date = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
    const jd = dateToJulianDate(j2000Date);
    expect(jd).toBeCloseTo(J2000_EPOCH_JD, 4);

    const roundtripDate = julianDateToDate(jd);
    expect(roundtripDate.getTime()).toBeCloseTo(j2000Date.getTime(), -2);
  });

  it("computes Greenwich Mean Sidereal Time (GMST) accurately for J2000.0", () => {
    // At J2000.0 (2000-01-01 12:00:00 UTC), GMST is 18.697374558 hrs (280.46061837 deg)
    const gmst = calculateGreenwichMeanSiderealTimeHours(J2000_EPOCH_JD);
    expect(gmst).toBeGreaterThanOrEqual(0);
    expect(gmst).toBeLessThan(24);
    expect(gmst * 15.0).toBeCloseTo(280.46, 1);
  });

  it("computes Local Mean Sidereal Time (LMST) correctly with observer longitude", () => {
    // Greenwich (Lon = 0) LMST should equal GMST
    const gmst = calculateGreenwichMeanSiderealTimeHours(J2000_EPOCH_JD);
    const lmstGreenwich = calculateLocalMeanSiderealTimeHours(J2000_EPOCH_JD, 0.0);
    expect(lmstGreenwich).toBeCloseTo(gmst, 4);

    // +90 deg East Longitude (+6 hours ahead)
    const lmstEast = calculateLocalMeanSiderealTimeHours(J2000_EPOCH_JD, 90.0);
    expect(lmstEast).toBeCloseTo((gmst + 6.0) % 24.0, 4);
  });

  it("transforms Equatorial (RA, Dec) to Horizontal (Alt, Az) at Zenith", () => {
    // Observer at Latitude = +45°, LMST = 6h (RA = 90°)
    // An object at RA = 90° (6h), Dec = +45° must be exactly at the Zenith (Alt = 90°)
    const raDeg = 90.0;
    const decDeg = 45.0;
    const latDeg = 45.0;
    const lmstHours = 6.0;

    const horiz = equatorialToHorizontal(raDeg, decDeg, latDeg, lmstHours);
    expect(horiz.altitudeDeg).toBeCloseTo(90.0, 1);
    expect(horiz.isAboveHorizon).toBe(true);
    expect(horiz.hourAngleHours).toBeCloseTo(0.0, 2);
  });

  it("transforms roundtrip Equatorial <-> Horizontal accurately", () => {
    const latDeg = 35.0;
    const lmstHours = 14.5;
    const origRaDeg = 120.0;
    const origDecDeg = 25.0;

    const horiz = equatorialToHorizontal(origRaDeg, origDecDeg, latDeg, lmstHours);
    const roundtrip = horizontalToEquatorial(horiz.altitudeDeg, horiz.azimuthDeg, latDeg, lmstHours);

    expect(roundtrip.raDeg).toBeCloseTo(origRaDeg, 1);
    expect(roundtrip.decDeg).toBeCloseTo(origDecDeg, 1);
  });

  it("transforms roundtrip Ecliptic <-> Equatorial accurately", () => {
    const origEclipticLon = 135.5;
    const origEclipticLat = 12.3;

    const eq = eclipticToEquatorial(origEclipticLon, origEclipticLat, MEAN_OBLIQUITY_J2000_DEG);
    const roundtrip = equatorialToEcliptic(eq.raDeg, eq.decDeg, MEAN_OBLIQUITY_J2000_DEG);

    expect(roundtrip.eclipticLongitudeDeg).toBeCloseTo(origEclipticLon, 3);
    expect(roundtrip.eclipticLatitudeDeg).toBeCloseTo(origEclipticLat, 3);
  });

  it("calculates atmospheric refraction correctly", () => {
    // At horizon (true altitude 0°), refraction is approx 0.5° (34 arcmin)
    const r0 = calculateAtmosphericRefractionDeg(0.0);
    expect(r0).toBeGreaterThan(0.45);
    expect(r0).toBeLessThan(0.65);

    // At zenith (true altitude 90°), refraction is near 0°
    const r90 = calculateAtmosphericRefractionDeg(90.0);
    expect(r90).toBeCloseTo(0.0, 2);
  });

  it("calculates rise, transit, and set times for circumpolar star", () => {
    // Polaris (Dec ~ +89.2°) viewed from Greenwich (+51.48° N) is circumpolar
    const rts = calculateRiseTransitSet(37.95, 89.26, 51.48, 0.0);
    expect(rts.status).toBe("CIRCUMPOLAR");
    expect(rts.riseDate).toBeNull();
    expect(rts.setDate).toBeNull();
    expect(rts.transitAltitudeDeg).toBeGreaterThan(0);
  });

  it("calculates rise, transit, and set times for non-rising star", () => {
    // Acrux (Dec ~ -63.1°) viewed from Greenwich (+51.48° N) never rises
    const rts = calculateRiseTransitSet(186.65, -63.1, 51.48, 0.0);
    expect(rts.status).toBe("NEVER_RISES");
    expect(rts.riseDate).toBeNull();
    expect(rts.setDate).toBeNull();
  });
});
