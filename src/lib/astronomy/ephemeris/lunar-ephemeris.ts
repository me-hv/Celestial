import { dateToJulianDate } from "../kepler-solver";
import { eclipticToEquatorial } from "../coordinates/horizontal";
import { J2000_EPOCH_JD } from "../constants";

export type LunarPhaseName =
  | "NEW_MOON"
  | "WAXING_CRESCENT"
  | "FIRST_QUARTER"
  | "WAXING_GIBBOUS"
  | "FULL_MOON"
  | "WANING_GIBBOUS"
  | "THIRD_QUARTER"
  | "WANING_CRESCENT";

export interface LunarEphemerisResult {
  julianDate: number;
  // Equatorial Geocentric Coordinates
  raDeg: number;
  decDeg: number;
  distanceKm: number;
  distanceEarthRadii: number;
  // Lunar Phase & Illumination
  phaseName: LunarPhaseName;
  phaseDisplayName: string;
  illuminationPercentage: number; // 0 to 100%
  phaseAngleDeg: number;
  elongationFromSunDeg: number;
  angularDiameterArcmin: number;
  // Age in current synodic cycle
  synodicAgeDays: number;
  nextMajorPhase: {
    name: string;
    daysUntil: number;
  };
}

const DEG_TO_RAD = Math.PI / 180.0;
const RAD_TO_DEG = 180.0 / Math.PI;
const EARTH_RADIUS_KM = 6371.0;
const MOON_RADIUS_KM = 1737.4;
const SYNODIC_MONTH_DAYS = 29.530588853;

/**
 * Normalizes an angle in degrees to [0, 360)
 */
function normalizeDeg(deg: number): number {
  return ((deg % 360.0) + 360.0) % 360.0;
}

/**
 * Calculates high-accuracy analytical Lunar Ephemeris (Meeus Chapter 47 / Brown Theory approximation)
 */
export function calculateLunarEphemeris(date: Date = new Date()): LunarEphemerisResult {
  const jd = dateToJulianDate(date);
  const T = (jd - J2000_EPOCH_JD) / 36525.0; // Julian centuries since J2000.0

  // 1. Fundamental Arguments of the Moon (Meeus 47.1 - 47.5)
  // Moon's Mean Longitude L'
  const Lprime = normalizeDeg(218.3164477 + 481267.88123421 * T);
  // Mean Elongation of the Moon D
  const D = normalizeDeg(297.8501921 + 445267.1114034 * T);
  // Sun's Mean Anomaly M
  const M = normalizeDeg(357.5291092 + 35999.0502909 * T);
  // Moon's Mean Anomaly M'
  const Mprime = normalizeDeg(134.9633964 + 477198.8675055 * T);
  // Moon's Argument of Latitude F
  const F = normalizeDeg(93.272095 + 483202.0175233 * T);

  // Radians
  const D_rad = D * DEG_TO_RAD;
  const M_rad = M * DEG_TO_RAD;
  const Mprime_rad = Mprime * DEG_TO_RAD;
  const F_rad = F * DEG_TO_RAD;

  // 2. Periodic Terms in Ecliptic Longitude Sigma_l
  const deltaLon =
    6.288774 * Math.sin(Mprime_rad) +
    1.274027 * Math.sin(2 * D_rad - Mprime_rad) +
    0.658314 * Math.sin(2 * D_rad) +
    0.213618 * Math.sin(2 * Mprime_rad) -
    0.185116 * Math.sin(M_rad) -
    0.114332 * Math.sin(2 * F_rad) +
    0.058793 * Math.sin(2 * D_rad - 2 * Mprime_rad) +
    0.057066 * Math.sin(2 * D_rad - M_rad - Mprime_rad) +
    0.05332 * Math.sin(2 * D_rad + Mprime_rad) +
    0.045758 * Math.sin(2 * D_rad - M_rad) -
    0.040923 * Math.sin(M_rad - Mprime_rad) -
    0.03472 * Math.sin(D_rad) -
    0.030383 * Math.sin(M_rad + Mprime_rad);

  const eclipticLonDeg = normalizeDeg(Lprime + deltaLon);

  // 3. Periodic Terms in Ecliptic Latitude Sigma_b
  const deltaLat =
    5.128122 * Math.sin(F_rad) +
    0.280602 * Math.sin(Mprime_rad + F_rad) +
    0.277693 * Math.sin(Mprime_rad - F_rad) +
    0.173237 * Math.sin(2 * D_rad - F_rad) +
    0.055413 * Math.sin(2 * D_rad - Mprime_rad + F_rad) +
    0.046271 * Math.sin(2 * D_rad - Mprime_rad - F_rad) +
    0.032573 * Math.sin(2 * D_rad + F_rad) +
    0.017198 * Math.sin(2 * Mprime_rad + F_rad);

  const eclipticLatDeg = deltaLat;

  // 4. Distance in Kilometers Sigma_r
  const distanceKm =
    385000.56 -
    20905.355 * Math.cos(Mprime_rad) -
    3699.111 * Math.cos(2 * D_rad - Mprime_rad) -
    2955.968 * Math.cos(2 * D_rad) -
    569.925 * Math.cos(2 * Mprime_rad) +
    246.158 * Math.cos(2 * D_rad - 2 * Mprime_rad) -
    152.138 * Math.cos(2 * D_rad - M_rad - Mprime_rad) -
    170.733 * Math.cos(2 * D_rad + Mprime_rad) -
    204.586 * Math.cos(2 * D_rad - M_rad);

  // 5. Equatorial Coordinates (RA, Dec)
  const { raDeg, decDeg } = eclipticToEquatorial(eclipticLonDeg, eclipticLatDeg);

  // 6. Phase Angle i and Illumination Percentage
  // Phase angle approx (Meeus 48.4)
  const phaseAngleRad =
    Math.PI -
    D_rad -
    6.289 * DEG_TO_RAD * Math.sin(Mprime_rad) +
    2.1 * DEG_TO_RAD * Math.sin(M_rad) -
    1.274 * DEG_TO_RAD * Math.sin(2 * D_rad - Mprime_rad);

  let phaseAngleDeg = phaseAngleRad * RAD_TO_DEG;
  phaseAngleDeg = ((phaseAngleDeg % 360.0) + 360.0) % 360.0;

  // Illumination fraction k = (1 + cos(phaseAngle)) / 2
  const illuminationFraction = (1.0 + Math.cos(phaseAngleRad)) / 2.0;
  const illuminationPercentage = Number((illuminationFraction * 100.0).toFixed(1));

  // Elongation from Sun
  const elongationFromSunDeg = D;

  // Angular Diameter theta = 2 * arcsin(R_moon / distance)
  const angularDiameterArcmin = Number(
    (2.0 * Math.asin(MOON_RADIUS_KM / distanceKm) * RAD_TO_DEG * 60.0).toFixed(2)
  );

  // Synodic Age in Days
  const synodicAgeDays = Number(((D / 360.0) * SYNODIC_MONTH_DAYS).toFixed(2));

  // Determine Phase Name & Next Major Phase
  const { phaseName, phaseDisplayName, nextMajorPhase } = determineLunarPhase(D, synodicAgeDays);

  return {
    julianDate: jd,
    raDeg,
    decDeg,
    distanceKm: Number(distanceKm.toFixed(1)),
    distanceEarthRadii: Number((distanceKm / EARTH_RADIUS_KM).toFixed(2)),
    phaseName,
    phaseDisplayName,
    illuminationPercentage,
    phaseAngleDeg: Number(phaseAngleDeg.toFixed(2)),
    elongationFromSunDeg: Number(elongationFromSunDeg.toFixed(2)),
    angularDiameterArcmin,
    synodicAgeDays,
    nextMajorPhase,
  };
}

/**
 * Determines Lunar Phase classification and next upcoming quarter/full/new phase
 */
function determineLunarPhase(
  elongationDeg: number,
  _ageDays: number
): {
  phaseName: LunarPhaseName;
  phaseDisplayName: string;
  nextMajorPhase: { name: string; daysUntil: number };
} {
  const d = normalizeDeg(elongationDeg);

  let phaseName: LunarPhaseName;
  let phaseDisplayName: string;

  if (d >= 355.0 || d < 5.0) {
    phaseName = "NEW_MOON";
    phaseDisplayName = "New Moon";
  } else if (d >= 5.0 && d < 85.0) {
    phaseName = "WAXING_CRESCENT";
    phaseDisplayName = "Waxing Crescent";
  } else if (d >= 85.0 && d < 95.0) {
    phaseName = "FIRST_QUARTER";
    phaseDisplayName = "First Quarter";
  } else if (d >= 95.0 && d < 175.0) {
    phaseName = "WAXING_GIBBOUS";
    phaseDisplayName = "Waxing Gibbous";
  } else if (d >= 175.0 && d < 185.0) {
    phaseName = "FULL_MOON";
    phaseDisplayName = "Full Moon";
  } else if (d >= 185.0 && d < 265.0) {
    phaseName = "WANING_GIBBOUS";
    phaseDisplayName = "Waning Gibbous";
  } else if (d >= 265.0 && d < 275.0) {
    phaseName = "THIRD_QUARTER";
    phaseDisplayName = "Third Quarter";
  } else {
    phaseName = "WANING_CRESCENT";
    phaseDisplayName = "Waning Crescent";
  }

  // Next Major Phase Target (0 deg = New, 90 = First Quarter, 180 = Full, 270 = Third Quarter)
  let nextTargetDeg: number;
  let nextPhaseName: string;

  if (d < 90.0) {
    nextTargetDeg = 90.0;
    nextPhaseName = "First Quarter";
  } else if (d < 180.0) {
    nextTargetDeg = 180.0;
    nextPhaseName = "Full Moon";
  } else if (d < 270.0) {
    nextTargetDeg = 270.0;
    nextPhaseName = "Third Quarter";
  } else {
    nextTargetDeg = 360.0;
    nextPhaseName = "New Moon";
  }

  const degRemaining = nextTargetDeg - d;
  const daysUntil = Number(((degRemaining / 360.0) * SYNODIC_MONTH_DAYS).toFixed(1));

  return {
    phaseName,
    phaseDisplayName,
    nextMajorPhase: {
      name: nextPhaseName,
      daysUntil,
    },
  };
}
