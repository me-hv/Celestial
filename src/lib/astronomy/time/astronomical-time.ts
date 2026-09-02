import { J2000_EPOCH_JD } from "../constants";

const DEG_TO_HOURS = 1.0 / 15.0;

/**
 * Calculates Julian Date (JD) from a JavaScript Date or Unix timestamp
 * Formula: JD = (Unix Timestamp in ms / 86400000.0) + 2440587.5
 */
export function getJulianDate(date: Date = new Date()): number {
  return date.getTime() / 86400000.0 + 2440587.5;
}

/**
 * Calculates Modified Julian Date (MJD)
 * Formula: MJD = JD - 2400000.5
 */
export function getModifiedJulianDate(date: Date = new Date()): number {
  return getJulianDate(date) - 2400000.5;
}

/**
 * Converts Julian Date (JD) back to a JavaScript Date object
 */
export function julianDateToDate(jd: number): Date {
  return new Date((jd - 2440587.5) * 86400000.0);
}

/**
 * Computes Julian Centuries elapsed since J2000.0 (JD 2451545.0)
 * T = (JD - 2451545.0) / 36525.0
 */
export function getJulianCenturies(julianDate: number): number {
  return (julianDate - J2000_EPOCH_JD) / 36525.0;
}

/**
 * Computes Greenwich Mean Sidereal Time (GMST) in hours [0, 24) for a given Julian Date
 * Uses IAU 2000/2006 standard polynomial approximation:
 * GMST(d) = 280.46061837° + 360.98564736629° * d + 0.000387933° * T^2 - (T^3 / 38710000.0)
 */
export function getGreenwichMeanSiderealTimeHours(julianDate: number): number {
  const d = julianDate - J2000_EPOCH_JD;
  const T = d / 36525.0;

  // GMST in degrees
  let gmstDeg = 280.46061837 + 360.98564736629 * d + 0.000387933 * T * T - (T * T * T) / 38710000.0;

  // Normalize into range [0, 360)
  gmstDeg = ((gmstDeg % 360.0) + 360.0) % 360.0;

  return gmstDeg * DEG_TO_HOURS;
}

/**
 * Computes Local Mean Sidereal Time (LMST) in hours [0, 24)
 * Formula: LMST = GMST + (Observer Longitude in Deg / 15.0)
 *
 * @param julianDate Julian Date
 * @param longitudeDeg Observer longitude in degrees (-180 West to +180 East)
 */
export function getLocalSiderealTimeHours(julianDate: number, longitudeDeg: number): number {
  const gmst = getGreenwichMeanSiderealTimeHours(julianDate);
  const lmst = (gmst + longitudeDeg * DEG_TO_HOURS) % 24.0;
  return (lmst + 24.0) % 24.0;
}

/**
 * Formats decimal hours into standard HH:MM:SS format
 */
export function formatSiderealTime(decimalHours: number): string {
  const normalized = ((decimalHours % 24.0) + 24.0) % 24.0;
  const h = Math.floor(normalized);
  const m = Math.floor((normalized - h) * 60.0);
  const s = Math.floor(((normalized - h) * 60.0 - m) * 60.0);

  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}
