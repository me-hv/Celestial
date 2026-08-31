import { ProvenanceRecord } from "../provenance/types";

/**
 * Observer Location Model
 */
export interface ObserverLocation {
  id: string;
  name: string;
  latitudeDeg: number; // -90 (South Pole) to +90 (North Pole)
  longitudeDeg: number; // -180 (West) to +180 (East)
  elevationMeters: number;
  timezone: string; // e.g. "UTC", "America/New_York", "Pacific/Honolulu"
  isCustom?: boolean;
}

/**
 * Standard Major Astronomical Observatories & Preset Locations
 */
export const PRESET_OBSERVER_LOCATIONS: ObserverLocation[] = [
  {
    id: "loc-greenwich",
    name: "Royal Observatory Greenwich (UK)",
    latitudeDeg: 51.4769,
    longitudeDeg: 0.0,
    elevationMeters: 46,
    timezone: "Europe/London",
  },
  {
    id: "loc-mauna-kea",
    name: "Mauna Kea Observatories (Hawaii, USA)",
    latitudeDeg: 19.8207,
    longitudeDeg: -155.4681,
    elevationMeters: 4205,
    timezone: "Pacific/Honolulu",
  },
  {
    id: "loc-paranal",
    name: "ESO Paranal Observatory / VLT (Chile)",
    latitudeDeg: -24.6272,
    longitudeDeg: -70.4042,
    elevationMeters: 2635,
    timezone: "America/Santiago",
  },
  {
    id: "loc-la-palma",
    name: "Roque de los Muchachos (La Palma, Spain)",
    latitudeDeg: 28.7567,
    longitudeDeg: -17.8917,
    elevationMeters: 2396,
    timezone: "Atlantic/Canary",
  },
  {
    id: "loc-kitt-peak",
    name: "Kitt Peak National Observatory (Arizona, USA)",
    latitudeDeg: 31.9583,
    longitudeDeg: -111.5967,
    elevationMeters: 2096,
    timezone: "America/Phoenix",
  },
  {
    id: "loc-siding-spring",
    name: "Siding Spring Observatory (Australia)",
    latitudeDeg: -31.275,
    longitudeDeg: 149.0667,
    elevationMeters: 1165,
    timezone: "Australia/Sydney",
  },
  {
    id: "loc-new-york",
    name: "New York City (USA)",
    latitudeDeg: 40.7128,
    longitudeDeg: -74.006,
    elevationMeters: 10,
    timezone: "America/New_York",
  },
  {
    id: "loc-tokyo",
    name: "Tokyo (Japan)",
    latitudeDeg: 35.6762,
    longitudeDeg: 139.6503,
    elevationMeters: 40,
    timezone: "Asia/Tokyo",
  },
  {
    id: "loc-delhi",
    name: "New Delhi (India)",
    latitudeDeg: 28.6139,
    longitudeDeg: 77.209,
    elevationMeters: 216,
    timezone: "Asia/Kolkata",
  },
  {
    id: "loc-sydney",
    name: "Sydney (Australia)",
    latitudeDeg: -33.8688,
    longitudeDeg: 151.2093,
    elevationMeters: 19,
    timezone: "Australia/Sydney",
  },
  {
    id: "loc-south-pole",
    name: "Amundsen-Scott South Pole Station (Antarctica)",
    latitudeDeg: -90.0,
    longitudeDeg: 0.0,
    elevationMeters: 2835,
    timezone: "Antarctica/South_Pole",
  },
];

/**
 * Observer Time State
 */
export interface ObserverTimeState {
  targetDate: Date;
  julianDate: number;
  gmstHours: number;
  lmstHours: number;
  timeSpeed: number; // 0 (paused), 1 (realtime), 10, 100, 1000
  isPaused: boolean;
}

/**
 * Horizontal Coordinates (Altitude / Azimuth)
 */
export interface HorizontalCoordinates {
  altitudeDeg: number; // -90 (Nadir) to +90 (Zenith)
  azimuthDeg: number; // 0 (North), 90 (East), 180 (South), 270 (West)
  apparentAltitudeDeg: number; // Altitude corrected for atmospheric refraction
  hourAngleDeg: number; // Hour angle [-180, +180] or [0, 360)
  hourAngleHours: number; // Hour angle in hours [0, 24)
  isAboveHorizon: boolean;
}

/**
 * Ecliptic Coordinates
 */
export interface EclipticCoordinates {
  eclipticLongitudeDeg: number; // lambda [0, 360)
  eclipticLatitudeDeg: number; // beta [-90, +90]
}

/**
 * Rise, Transit (Culmination), and Set Times
 */
export interface RiseTransitSetResult {
  riseDate: Date | null;
  transitDate: Date | null;
  setDate: Date | null;
  transitAltitudeDeg: number;
  status: "NORMAL" | "CIRCUMPOLAR" | "NEVER_RISES";
  message?: string;
}

/**
 * Sky Observation State of a Celestial Object
 */
export type SkyObjectState =
  "ABOVE_HORIZON" | "BELOW_HORIZON" | "RISING" | "SETTING" | "CULMINATING";

export interface SkyObjectObservation {
  objectId: string;
  objectSlug: string;
  canonicalName: string;
  standardDesignation?: string;
  category: string;
  type: string;
  apparentMagnitudeV?: number;
  spectralClass?: string;
  raDeg: number;
  decDeg: number;
  galacticLongDeg?: number;
  galacticLatDeg?: number;
  horizontal: HorizontalCoordinates;
  constellation: string;
  state: SkyObjectState;
  riseTransitSet: RiseTransitSetResult;
  distanceLy?: number;
  provenance: ProvenanceRecord;
}
