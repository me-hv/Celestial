import {
  HorizontalCoordinates,
  EclipticCoordinates,
  RiseTransitSetResult,
} from "@/domain/observer/types";
import { J2000_EPOCH_JD } from "../constants";

const DEG_TO_RAD = Math.PI / 180.0;
const RAD_TO_DEG = 180.0 / Math.PI;
const HOURS_TO_DEG = 15.0;
const DEG_TO_HOURS = 1.0 / 15.0;

/**
 * Standard J2000 Mean Obliquity of the Ecliptic (IAU 2006)
 */
export const MEAN_OBLIQUITY_J2000_DEG = 23.4392911;

/**
 * Calculates Julian Date (JD) from a JavaScript Date
 */
export function dateToJulianDate(date: Date = new Date()): number {
  return date.getTime() / 86400000.0 + 2440587.5;
}

/**
 * Converts Julian Date (JD) back to JavaScript Date
 */
export function julianDateToDate(jd: number): Date {
  return new Date((jd - 2440587.5) * 86400000.0);
}

/**
 * Computes Greenwich Mean Sidereal Time (GMST) in hours [0, 24) for a given Julian Date
 * IAU 2000/2006 standard polynomial approximation.
 */
export function calculateGreenwichMeanSiderealTimeHours(jd: number): number {
  const d = jd - J2000_EPOCH_JD;
  const T = d / 36525.0; // Julian centuries since J2000.0

  // GMST in degrees (Astronomical Almanac formula)
  let gmstDeg = 280.46061837 + 360.98564736629 * d + 0.000387933 * T * T - (T * T * T) / 38710000.0;

  // Normalize to [0, 360)
  gmstDeg = ((gmstDeg % 360.0) + 360.0) % 360.0;

  return gmstDeg * DEG_TO_HOURS;
}

/**
 * Computes Local Mean Sidereal Time (LMST) in hours [0, 24)
 * LMST = GMST + Longitude / 15
 * @param jd Julian Date
 * @param longitudeDeg Observer longitude in degrees (-180 West to +180 East)
 */
export function calculateLocalMeanSiderealTimeHours(jd: number, longitudeDeg: number): number {
  const gmst = calculateGreenwichMeanSiderealTimeHours(jd);
  const lmst = (gmst + longitudeDeg * DEG_TO_HOURS) % 24.0;
  return (lmst + 24.0) % 24.0;
}

/**
 * Computes Atmospheric Refraction in degrees (Bennett 1982 / Saemundsson 1986 formula)
 * Applicable for optical astronomy at standard 1010 mbar pressure and 10°C temperature.
 */
export function calculateAtmosphericRefractionDeg(
  trueAltDeg: number,
  pressureMbar = 1013.25,
  tempCelsius = 15.0
): number {
  if (trueAltDeg < -5.0) return 0.0; // Deep below horizon

  // Saemundsson formula for apparent altitude
  const altForFormula = Math.max(-1.0, trueAltDeg);
  const rArcmin =
    (1.02 / Math.tan((altForFormula + 10.3 / (altForFormula + 5.11)) * DEG_TO_RAD)) *
    (pressureMbar / 1010.0) *
    (283.0 / (273.0 + tempCelsius));

  return Math.max(0.0, rArcmin / 60.0);
}

/**
 * Transforms Equatorial Coordinates (RA, Dec in degrees) to Horizontal Coordinates (Alt, Az)
 * for a specific observer location and Local Mean Sidereal Time (LMST).
 *
 * @param raDeg Right Ascension in degrees [0, 360)
 * @param decDeg Declination in degrees [-90, +90]
 * @param observerLatDeg Observer latitude in degrees [-90, +90]
 * @param lmstHours Local Mean Sidereal Time in hours [0, 24)
 */
export function equatorialToHorizontal(
  raDeg: number,
  decDeg: number,
  observerLatDeg: number,
  lmstHours: number
): HorizontalCoordinates {
  const raHours = raDeg * DEG_TO_HOURS;
  let haHours = lmstHours - raHours;
  haHours = ((haHours % 24.0) + 24.0) % 24.0;

  // Hour angle in degrees [-180, +180] for azimuth branch
  let haDeg = haHours * HOURS_TO_DEG;
  if (haDeg > 180.0) haDeg -= 360.0;

  const haRad = haDeg * DEG_TO_RAD;
  const decRad = decDeg * DEG_TO_RAD;
  const latRad = observerLatDeg * DEG_TO_RAD;

  // 1. True Altitude h
  const sinAlt =
    Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(haRad);
  const altRad = Math.asin(Math.max(-1.0, Math.min(1.0, sinAlt)));
  const trueAltDeg = altRad * RAD_TO_DEG;

  // 2. True Azimuth A (measured from North 0° -> East 90° -> South 180° -> West 270°)
  const y = -Math.cos(decRad) * Math.sin(haRad);
  const x =
    Math.sin(decRad) * Math.cos(latRad) - Math.cos(decRad) * Math.sin(latRad) * Math.cos(haRad);

  let azDeg = Math.atan2(y, x) * RAD_TO_DEG;
  azDeg = ((azDeg % 360.0) + 360.0) % 360.0;

  // 3. Atmospheric Refraction Correction
  const refractionDeg = calculateAtmosphericRefractionDeg(trueAltDeg);
  const apparentAltDeg = trueAltDeg + refractionDeg;

  return {
    altitudeDeg: Number(trueAltDeg.toFixed(4)),
    azimuthDeg: Number(azDeg.toFixed(4)),
    apparentAltitudeDeg: Number(apparentAltDeg.toFixed(4)),
    hourAngleDeg: Number(haDeg.toFixed(4)),
    hourAngleHours: Number(haHours.toFixed(4)),
    isAboveHorizon: apparentAltDeg >= 0.0,
  };
}

/**
 * Transforms Horizontal Coordinates (Alt, Az in degrees) back to Equatorial Coordinates (RA, Dec in degrees).
 */
export function horizontalToEquatorial(
  altDeg: number,
  azDeg: number,
  observerLatDeg: number,
  lmstHours: number
): { raDeg: number; decDeg: number; hourAngleDeg: number } {
  const altRad = altDeg * DEG_TO_RAD;
  const azRad = azDeg * DEG_TO_RAD;
  const latRad = observerLatDeg * DEG_TO_RAD;

  // 1. Declination: sin(dec) = sin(lat)*sin(alt) + cos(lat)*cos(alt)*cos(az)
  const sinDec =
    Math.sin(latRad) * Math.sin(altRad) + Math.cos(latRad) * Math.cos(altRad) * Math.cos(azRad);
  const decRad = Math.asin(Math.max(-1.0, Math.min(1.0, sinDec)));
  const decDeg = decRad * RAD_TO_DEG;

  // 2. Hour Angle H:
  // y = -sin(az) * cos(alt)
  // x = sin(alt) * cos(lat) - cos(alt) * sin(lat) * cos(az)
  const y = -Math.sin(azRad) * Math.cos(altRad);
  const x =
    Math.sin(altRad) * Math.cos(latRad) - Math.cos(altRad) * Math.sin(latRad) * Math.cos(azRad);

  let haRad = Math.atan2(y, x);
  if (haRad < 0) haRad += 2 * Math.PI;
  const haDeg = haRad * RAD_TO_DEG;

  const haHours = haDeg * DEG_TO_HOURS;
  let raHours = lmstHours - haHours;
  raHours = ((raHours % 24.0) + 24.0) % 24.0;
  const raDeg = raHours * HOURS_TO_DEG;

  return {
    raDeg: Number(raDeg.toFixed(4)),
    decDeg: Number(decDeg.toFixed(4)),
    hourAngleDeg: Number(haDeg.toFixed(4)),
  };
}

/**
 * Transforms Ecliptic Coordinates (lambda, beta in degrees) to Equatorial Coordinates (RA, Dec in degrees).
 */
export function eclipticToEquatorial(
  eclipticLonDeg: number,
  eclipticLatDeg: number,
  obliquityDeg = MEAN_OBLIQUITY_J2000_DEG
): { raDeg: number; decDeg: number } {
  const lambdaRad = eclipticLonDeg * DEG_TO_RAD;
  const betaRad = eclipticLatDeg * DEG_TO_RAD;
  const epsRad = obliquityDeg * DEG_TO_RAD;

  const sinBeta = Math.sin(betaRad);
  const cosBeta = Math.cos(betaRad);
  const sinEps = Math.sin(epsRad);
  const cosEps = Math.cos(epsRad);
  const sinLambda = Math.sin(lambdaRad);
  const cosLambda = Math.cos(lambdaRad);

  const sinDec = sinBeta * cosEps + cosBeta * sinEps * sinLambda;
  const decRad = Math.asin(Math.max(-1.0, Math.min(1.0, sinDec)));

  const y = sinLambda * cosEps - Math.tan(betaRad) * sinEps;
  const x = cosLambda;
  let raRad = Math.atan2(y, x);
  if (raRad < 0) raRad += 2 * Math.PI;

  return {
    raDeg: Number((raRad * RAD_TO_DEG).toFixed(5)),
    decDeg: Number((decRad * RAD_TO_DEG).toFixed(5)),
  };
}

/**
 * Transforms Equatorial Coordinates (RA, Dec in degrees) to Ecliptic Coordinates (lambda, beta in degrees).
 */
export function equatorialToEcliptic(
  raDeg: number,
  decDeg: number,
  obliquityDeg = MEAN_OBLIQUITY_J2000_DEG
): EclipticCoordinates {
  const raRad = raDeg * DEG_TO_RAD;
  const decRad = decDeg * DEG_TO_RAD;
  const epsRad = obliquityDeg * DEG_TO_RAD;

  const sinDec = Math.sin(decRad);
  const cosDec = Math.cos(decRad);
  const sinEps = Math.sin(epsRad);
  const cosEps = Math.cos(epsRad);
  const sinRa = Math.sin(raRad);
  const cosRa = Math.cos(raRad);

  const sinBeta = sinDec * cosEps - cosDec * sinEps * sinRa;
  const betaRad = Math.asin(Math.max(-1.0, Math.min(1.0, sinBeta)));

  const y = sinRa * cosEps + Math.tan(decRad) * sinEps;
  const x = cosRa;
  let lambdaRad = Math.atan2(y, x);
  if (lambdaRad < 0) lambdaRad += 2 * Math.PI;

  return {
    eclipticLongitudeDeg: Number((lambdaRad * RAD_TO_DEG).toFixed(5)),
    eclipticLatitudeDeg: Number((betaRad * RAD_TO_DEG).toFixed(5)),
  };
}

/**
 * Calculates Rise, Transit (Culmination), and Set Times for an object on a given calendar day.
 *
 * @param raDeg Right Ascension in degrees
 * @param decDeg Declination in degrees
 * @param observerLatDeg Observer latitude in degrees
 * @param observerLonDeg Observer longitude in degrees
 * @param date Reference Date
 * @param horizonStandardAltDeg Standard horizon altitude (-0.5667° for stars, -0.8333° for Sun/Moon)
 */
export function calculateRiseTransitSet(
  raDeg: number,
  decDeg: number,
  observerLatDeg: number,
  observerLonDeg: number,
  date: Date = new Date(),
  horizonStandardAltDeg = -0.5667
): RiseTransitSetResult {
  const latRad = observerLatDeg * DEG_TO_RAD;
  const decRad = decDeg * DEG_TO_RAD;
  const h0Rad = horizonStandardAltDeg * DEG_TO_RAD;

  // Maximum transit / culmination altitude: h_max = 90 - |lat - dec|
  const transitAltitudeDeg = 90.0 - Math.abs(observerLatDeg - decDeg);

  // Cosine of Hour Angle at rise/set:
  // cos(H0) = (sin(h0) - sin(lat) * sin(dec)) / (cos(lat) * cos(dec))
  const cosLatCosDec = Math.cos(latRad) * Math.cos(decRad);

  if (Math.abs(cosLatCosDec) < 1e-7) {
    return {
      riseDate: null,
      transitDate: null,
      setDate: null,
      transitAltitudeDeg: Number(transitAltitudeDeg.toFixed(2)),
      status: "CIRCUMPOLAR",
      message: "Polar singularity",
    };
  }

  const cosH0 = (Math.sin(h0Rad) - Math.sin(latRad) * Math.sin(decRad)) / cosLatCosDec;

  if (cosH0 < -1.0) {
    // Circumpolar (never sets)
    return {
      riseDate: null,
      transitDate: null,
      setDate: null,
      transitAltitudeDeg: Number(transitAltitudeDeg.toFixed(2)),
      status: "CIRCUMPOLAR",
      message: "Object is circumpolar and remains above the horizon all 24 hours.",
    };
  }

  if (cosH0 > 1.0) {
    // Never rises
    return {
      riseDate: null,
      transitDate: null,
      setDate: null,
      transitAltitudeDeg: Number(transitAltitudeDeg.toFixed(2)),
      status: "NEVER_RISES",
      message: "Object is below the observer horizon and never rises at this latitude.",
    };
  }

  const H0Hours = Math.acos(cosH0) * RAD_TO_DEG * DEG_TO_HOURS;

  // Midnight UTC Julian Date on the given date
  const midnightUtc = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0)
  );
  const jd0 = dateToJulianDate(midnightUtc);
  const gmst0Hours = calculateGreenwichMeanSiderealTimeHours(jd0);

  // Approximate transit time in hours from midnight UTC
  const raHours = raDeg * DEG_TO_HOURS;
  let transitUTCHours = raHours - (gmst0Hours + observerLonDeg * DEG_TO_HOURS);
  transitUTCHours = ((transitUTCHours % 24.0) + 24.0) % 24.0;

  // Adjust for sidereal rate ratio (1 solar day = 24.0657 sidereal hours)
  const solarFactor = 24.0 / 24.06570982441908;
  const mTransit = transitUTCHours * solarFactor;
  const mRise = ((transitUTCHours - H0Hours + 24.0) % 24.0) * solarFactor;
  const mSet = ((transitUTCHours + H0Hours) % 24.0) * solarFactor;

  const transitDate = new Date(midnightUtc.getTime() + mTransit * 3600000.0);
  const riseDate = new Date(midnightUtc.getTime() + mRise * 3600000.0);
  const setDate = new Date(midnightUtc.getTime() + mSet * 3600000.0);

  return {
    riseDate,
    transitDate,
    setDate,
    transitAltitudeDeg: Number(transitAltitudeDeg.toFixed(2)),
    status: "NORMAL",
  };
}
