import { ObserverLocation } from "@/domain/observer/types";
import { calculatePlanetaryEphemeris } from "../ephemeris/planetary-ephemeris";
import { dateToJulianDate, calculateLocalMeanSiderealTimeHours } from "../coordinates/horizontal";
import { equatorialToHorizontal } from "../coordinates/horizontal";

export type SolarTwilightState =
  "DAY" | "CIVIL_TWILIGHT" | "NAUTICAL_TWILIGHT" | "ASTRONOMICAL_TWILIGHT" | "NIGHT";

export interface InstantaneousTwilight {
  solarAltitudeDeg: number;
  solarAzimuthDeg: number;
  state: SolarTwilightState;
  isDarkSky: boolean; // Astronomical twilight or full night (h_sun <= -12°)
  skyDomeColor: string;
  horizonGlowColor: string;
}

/**
 * Computes instantaneous twilight status and atmospheric shading colors for an observer location & time
 */
export function getInstantaneousTwilight(
  location: ObserverLocation,
  date: Date = new Date()
): InstantaneousTwilight {
  const jd = dateToJulianDate(date);
  const lmst = calculateLocalMeanSiderealTimeHours(jd, location.longitudeDeg);
  const sunEphem = calculatePlanetaryEphemeris("sun", date);
  const sunHoriz = equatorialToHorizontal(
    sunEphem.raDeg,
    sunEphem.decDeg,
    location.latitudeDeg,
    lmst
  );

  const h = sunHoriz.apparentAltitudeDeg;

  let state: SolarTwilightState = "NIGHT";
  let skyDomeColor = "#030712";
  let horizonGlowColor = "rgba(56, 189, 248, 0.05)";
  let isDarkSky = true;

  if (h > -0.8333) {
    state = "DAY";
    skyDomeColor = "#0C2340";
    horizonGlowColor = "rgba(96, 165, 250, 0.35)";
    isDarkSky = false;
  } else if (h > -6.0) {
    state = "CIVIL_TWILIGHT";
    skyDomeColor = "#1E1B4B";
    horizonGlowColor = "rgba(245, 158, 11, 0.28)";
    isDarkSky = false;
  } else if (h > -12.0) {
    state = "NAUTICAL_TWILIGHT";
    skyDomeColor = "#0F172A";
    horizonGlowColor = "rgba(139, 92, 246, 0.18)";
    isDarkSky = false;
  } else if (h > -18.0) {
    state = "ASTRONOMICAL_TWILIGHT";
    skyDomeColor = "#050B14";
    horizonGlowColor = "rgba(56, 189, 248, 0.08)";
    isDarkSky = true;
  } else {
    state = "NIGHT";
    skyDomeColor = "#030712";
    horizonGlowColor = "rgba(56, 189, 248, 0.03)";
    isDarkSky = true;
  }

  return {
    solarAltitudeDeg: h,
    solarAzimuthDeg: sunHoriz.azimuthDeg,
    state,
    isDarkSky,
    skyDomeColor,
    horizonGlowColor,
  };
}
