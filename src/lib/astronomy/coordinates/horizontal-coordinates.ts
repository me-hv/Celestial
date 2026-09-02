import {
  HorizontalCoordinates,
  EclipticCoordinates,
  RiseTransitSetResult,
} from "@/domain/observer/types";
import {
  calculateGreenwichMeanSiderealTimeHours,
  calculateAtmosphericRefractionDeg,
  equatorialToHorizontal,
  horizontalToEquatorial,
  eclipticToEquatorial,
  equatorialToEcliptic,
  calculateRiseTransitSet,
  MEAN_OBLIQUITY_J2000_DEG,
  dateToJulianDate,
  julianDateToDate,
  calculateLocalMeanSiderealTimeHours,
} from "./horizontal";

export {
  MEAN_OBLIQUITY_J2000_DEG,
  dateToJulianDate,
  julianDateToDate,
  calculateGreenwichMeanSiderealTimeHours,
  calculateLocalMeanSiderealTimeHours,
  calculateAtmosphericRefractionDeg,
  equatorialToHorizontal,
  horizontalToEquatorial,
  eclipticToEquatorial,
  equatorialToEcliptic,
  calculateRiseTransitSet,
};

export type { HorizontalCoordinates, EclipticCoordinates, RiseTransitSetResult };
