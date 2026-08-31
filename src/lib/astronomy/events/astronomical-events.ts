import { ObserverLocation } from "@/domain/observer/types";
import { calculatePlanetaryEphemeris } from "../ephemeris/planetary-ephemeris";
import { calculateLunarEphemeris, LunarEphemerisResult } from "../ephemeris/lunar-ephemeris";
import { calculateRiseTransitSet } from "../coordinates/horizontal";

export interface SolarTwilightEvents {
  sunrise: Date | null;
  solarNoon: Date | null;
  sunset: Date | null;
  civilDawn: Date | null;
  civilDusk: Date | null;
  nauticalDawn: Date | null;
  nauticalDusk: Date | null;
  astronomicalDawn: Date | null;
  astronomicalDusk: Date | null;
  dayLengthHours: number;
  nightDarknessHours: number;
}

export interface PlanetaryEventItem {
  planetSlug: string;
  planetName: string;
  apparentMagnitudeV: number;
  riseDate: Date | null;
  transitDate: Date | null;
  setDate: Date | null;
  transitAltitudeDeg: number;
  isVisibleTonight: boolean;
}

export interface AstronomicalEventsReport {
  date: Date;
  location: ObserverLocation;
  solar: SolarTwilightEvents;
  lunar: LunarEphemerisResult & {
    moonrise: Date | null;
    moonset: Date | null;
    moonTransit: Date | null;
  };
  planets: PlanetaryEventItem[];
}

/**
 * Calculates complete daily astronomical events for an observer location on a specified date
 */
export function calculateAstronomicalEvents(
  location: ObserverLocation,
  date: Date = new Date()
): AstronomicalEventsReport {
  const sunEphem = calculatePlanetaryEphemeris("sun", date);

  // 1. Solar Events & Twilights
  const sunStandard = calculateRiseTransitSet(
    sunEphem.raDeg,
    sunEphem.decDeg,
    location.latitudeDeg,
    location.longitudeDeg,
    date,
    -0.8333 // Standard Sun geometric horizon with refraction & semi-diameter
  );

  const sunCivil = calculateRiseTransitSet(
    sunEphem.raDeg,
    sunEphem.decDeg,
    location.latitudeDeg,
    location.longitudeDeg,
    date,
    -6.0 // Civil twilight
  );

  const sunNautical = calculateRiseTransitSet(
    sunEphem.raDeg,
    sunEphem.decDeg,
    location.latitudeDeg,
    location.longitudeDeg,
    date,
    -12.0 // Nautical twilight
  );

  const sunAstro = calculateRiseTransitSet(
    sunEphem.raDeg,
    sunEphem.decDeg,
    location.latitudeDeg,
    location.longitudeDeg,
    date,
    -18.0 // Astronomical twilight (true darkness begins)
  );

  let dayLengthHours = 0;
  if (sunStandard.riseDate && sunStandard.setDate) {
    dayLengthHours = Number(
      (
        Math.abs(sunStandard.setDate.getTime() - sunStandard.riseDate.getTime()) / 3600000.0
      ).toFixed(2)
    );
  }

  let nightDarknessHours = 0;
  if (sunAstro.setDate && sunAstro.riseDate) {
    nightDarknessHours = Number(
      Math.max(
        0,
        24.0 - Math.abs(sunAstro.setDate.getTime() - sunAstro.riseDate.getTime()) / 3600000.0
      ).toFixed(2)
    );
  }

  const solar: SolarTwilightEvents = {
    sunrise: sunStandard.riseDate,
    solarNoon: sunStandard.transitDate,
    sunset: sunStandard.setDate,
    civilDawn: sunCivil.riseDate,
    civilDusk: sunCivil.setDate,
    nauticalDawn: sunNautical.riseDate,
    nauticalDusk: sunNautical.setDate,
    astronomicalDawn: sunAstro.riseDate,
    astronomicalDusk: sunAstro.setDate,
    dayLengthHours,
    nightDarknessHours,
  };

  // 2. Lunar Events
  const lunar = calculateLunarEphemeris(date);
  const lunarRiseSet = calculateRiseTransitSet(
    lunar.raDeg,
    lunar.decDeg,
    location.latitudeDeg,
    location.longitudeDeg,
    date,
    -0.8333
  );

  // 3. Planetary Events
  const planetSlugs = ["mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune"];
  const planets: PlanetaryEventItem[] = [];

  for (const slug of planetSlugs) {
    const ephem = calculatePlanetaryEphemeris(slug, date);
    const rts = calculateRiseTransitSet(
      ephem.raDeg,
      ephem.decDeg,
      location.latitudeDeg,
      location.longitudeDeg,
      date,
      -0.5667
    );

    // Visible tonight if transit altitude > 10 deg and rises during nighttime hours
    const isVisibleTonight = rts.transitAltitudeDeg >= 10.0 && rts.status !== "NEVER_RISES";

    planets.push({
      planetSlug: slug,
      planetName: ephem.bodyName,
      apparentMagnitudeV: ephem.apparentMagnitudeV,
      riseDate: rts.riseDate,
      transitDate: rts.transitDate,
      setDate: rts.setDate,
      transitAltitudeDeg: rts.transitAltitudeDeg,
      isVisibleTonight,
    });
  }

  return {
    date,
    location,
    solar,
    lunar: {
      ...lunar,
      moonrise: lunarRiseSet.riseDate,
      moonset: lunarRiseSet.setDate,
      moonTransit: lunarRiseSet.transitDate,
    },
    planets,
  };
}
