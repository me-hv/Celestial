import {
  calculateHeliocentricPosition,
  dateToJulianDate,
  KeplerianElements,
} from "../kepler-solver";
import { eclipticToEquatorial } from "../coordinates/horizontal";

export interface PlanetaryEphemerisResult {
  bodySlug: string;
  bodyName: string;
  julianDate: number;
  // Geocentric Position
  raDeg: number;
  decDeg: number;
  distanceAu: number;
  distanceKm: number;
  // Observational Characteristics
  phaseAngleDeg: number;
  illuminationPercentage: number; // 0 to 100%
  elongationFromSunDeg: number;
  apparentMagnitudeV: number;
  angularDiameterArcsec: number;
  // Heliocentric Coordinates
  heliocentricDistanceAu: number;
  heliocentricLonDeg: number;
  heliocentricLatDeg: number;
}

// Authoritative Mean Radii (km) for Angular Diameter calculation
const PLANETARY_RADII_KM: Record<string, number> = {
  mercury: 2439.7,
  venus: 6051.8,
  mars: 3389.5,
  jupiter: 69911.0,
  saturn: 58232.0,
  uranus: 25362.0,
  neptune: 24622.0,
  pluto: 1188.3,
  sun: 696340.0,
};

// Standard Keplerian Elements (J2000) for major Solar System bodies
export const PLANETARY_ORBIT_ELEMENTS: Record<string, KeplerianElements> = {
  earth: {
    semiMajorAxisAu: 1.00000011,
    eccentricity: 0.01671022,
    inclinationDeg: 0.00005,
    longitudeAscendingNodeDeg: 348.74,
    argumentPeriapsisDeg: 102.947,
    meanAnomalyEpochDeg: 100.464,
    orbitalPeriodDays: 365.256,
  },
  mercury: {
    semiMajorAxisAu: 0.387098,
    eccentricity: 0.20563,
    inclinationDeg: 7.005,
    longitudeAscendingNodeDeg: 48.331,
    argumentPeriapsisDeg: 29.124,
    meanAnomalyEpochDeg: 174.796,
    orbitalPeriodDays: 87.969,
  },
  venus: {
    semiMajorAxisAu: 0.723332,
    eccentricity: 0.006772,
    inclinationDeg: 3.39458,
    longitudeAscendingNodeDeg: 76.68,
    argumentPeriapsisDeg: 54.884,
    meanAnomalyEpochDeg: 50.115,
    orbitalPeriodDays: 224.701,
  },
  mars: {
    semiMajorAxisAu: 1.523662,
    eccentricity: 0.093412,
    inclinationDeg: 1.85,
    longitudeAscendingNodeDeg: 49.578,
    argumentPeriapsisDeg: 286.502,
    meanAnomalyEpochDeg: 19.373,
    orbitalPeriodDays: 686.98,
  },
  jupiter: {
    semiMajorAxisAu: 5.203363,
    eccentricity: 0.048392,
    inclinationDeg: 1.3053,
    longitudeAscendingNodeDeg: 100.556,
    argumentPeriapsisDeg: 273.867,
    meanAnomalyEpochDeg: 20.02,
    orbitalPeriodDays: 4332.589,
  },
  saturn: {
    semiMajorAxisAu: 9.53707,
    eccentricity: 0.05415,
    inclinationDeg: 2.48446,
    longitudeAscendingNodeDeg: 113.715,
    argumentPeriapsisDeg: 339.392,
    meanAnomalyEpochDeg: 317.02,
    orbitalPeriodDays: 10759.22,
  },
  uranus: {
    semiMajorAxisAu: 19.19126,
    eccentricity: 0.047168,
    inclinationDeg: 0.76986,
    longitudeAscendingNodeDeg: 74.22988,
    argumentPeriapsisDeg: 96.734,
    meanAnomalyEpochDeg: 142.2386,
    orbitalPeriodDays: 30688.5,
  },
  neptune: {
    semiMajorAxisAu: 30.06896,
    eccentricity: 0.008586,
    inclinationDeg: 1.76917,
    longitudeAscendingNodeDeg: 131.72169,
    argumentPeriapsisDeg: 273.187,
    meanAnomalyEpochDeg: 256.228,
    orbitalPeriodDays: 60182.0,
  },
  pluto: {
    semiMajorAxisAu: 39.482,
    eccentricity: 0.2488,
    inclinationDeg: 17.16,
    longitudeAscendingNodeDeg: 110.303,
    argumentPeriapsisDeg: 113.763,
    meanAnomalyEpochDeg: 14.53,
    orbitalPeriodDays: 90560.0,
  },
};

const AU_KM = 149597870.7;

/**
 * Calculates geocentric planetary ephemeris for a given body at a specified date
 */
export function calculatePlanetaryEphemeris(
  bodySlug: string,
  date: Date = new Date()
): PlanetaryEphemerisResult {
  const jd = dateToJulianDate(date);
  const earthElements = PLANETARY_ORBIT_ELEMENTS["earth"];
  const earthPos = calculateHeliocentricPosition(earthElements, jd);

  // Special Case: Sun
  if (bodySlug === "sun") {
    // Geocentric position of the Sun is the opposite of the Heliocentric position of Earth
    const sunGeoX = -earthPos.xAu;
    const sunGeoY = -earthPos.yAu;
    const sunGeoZ = -earthPos.zAu;
    const distAu = Math.sqrt(sunGeoX * sunGeoX + sunGeoY * sunGeoY + sunGeoZ * sunGeoZ);

    const eclipticLonRad = Math.atan2(sunGeoY, sunGeoX);
    let eclipticLonDeg = (eclipticLonRad * 180.0) / Math.PI;
    eclipticLonDeg = ((eclipticLonDeg % 360.0) + 360.0) % 360.0;
    const eclipticLatDeg = 0.0;

    const { raDeg, decDeg } = eclipticToEquatorial(eclipticLonDeg, eclipticLatDeg);
    const angularDiameterArcsec = (2.0 * PLANETARY_RADII_KM["sun"] * 206265.0) / (distAu * AU_KM);

    return {
      bodySlug: "sun",
      bodyName: "Sun",
      julianDate: jd,
      raDeg,
      decDeg,
      distanceAu: Number(distAu.toFixed(6)),
      distanceKm: Number((distAu * AU_KM).toFixed(1)),
      phaseAngleDeg: 0.0,
      illuminationPercentage: 100.0,
      elongationFromSunDeg: 0.0,
      apparentMagnitudeV: -26.74,
      angularDiameterArcsec: Number(angularDiameterArcsec.toFixed(2)),
      heliocentricDistanceAu: 0.0,
      heliocentricLonDeg: 0.0,
      heliocentricLatDeg: 0.0,
    };
  }

  const elements = PLANETARY_ORBIT_ELEMENTS[bodySlug.toLowerCase()];
  if (!elements) {
    throw new Error(`Unsupported planetary ephemeris body: ${bodySlug}`);
  }

  const planetPos = calculateHeliocentricPosition(elements, jd);

  // Geocentric Cartesian Vector: r_geo = r_planet - r_earth
  const geoX = planetPos.xAu - earthPos.xAu;
  const geoY = planetPos.yAu - earthPos.yAu;
  const geoZ = planetPos.zAu - earthPos.zAu;

  const geoDistAu = Math.sqrt(geoX * geoX + geoY * geoY + geoZ * geoZ);
  const geoDistKm = geoDistAu * AU_KM;

  // Geocentric Ecliptic Longitude and Latitude
  const geoEclipticLonRad = Math.atan2(geoY, geoX);
  let geoEclipticLonDeg = (geoEclipticLonRad * 180.0) / Math.PI;
  geoEclipticLonDeg = ((geoEclipticLonDeg % 360.0) + 360.0) % 360.0;

  const geoEclipticLatRad = Math.asin(Math.max(-1.0, Math.min(1.0, geoZ / geoDistAu)));
  const geoEclipticLatDeg = (geoEclipticLatRad * 180.0) / Math.PI;

  // Equatorial RA and Dec
  const { raDeg, decDeg } = eclipticToEquatorial(geoEclipticLonDeg, geoEclipticLatDeg);

  // Phase Angle phi (Sun - Planet - Earth angle)
  const rPlanet = planetPos.distanceAu;
  const rEarth = earthPos.distanceAu;
  const cosPhi =
    (rPlanet * rPlanet + geoDistAu * geoDistAu - rEarth * rEarth) /
    (2.0 * Math.max(1e-6, rPlanet * geoDistAu));
  const phiRad = Math.acos(Math.max(-1.0, Math.min(1.0, cosPhi)));
  const phaseAngleDeg = (phiRad * 180.0) / Math.PI;

  // Illuminated Fraction k = (1 + cos(phi)) / 2
  const illuminationPercentage = ((1.0 + Math.cos(phiRad)) / 2.0) * 100.0;

  // Elongation from Sun psi (Sun - Earth - Planet angle)
  const cosPsi =
    (rEarth * rEarth + geoDistAu * geoDistAu - rPlanet * rPlanet) /
    (2.0 * Math.max(1e-6, rEarth * geoDistAu));
  const psiRad = Math.acos(Math.max(-1.0, Math.min(1.0, cosPsi)));
  const elongationFromSunDeg = (psiRad * 180.0) / Math.PI;

  // Apparent Magnitude V approximation (Mallama & Hilton 2018 / Astronomical Almanac)
  const apparentMagnitudeV = calculatePlanetaryApparentMagnitude(
    bodySlug.toLowerCase(),
    rPlanet,
    geoDistAu,
    phaseAngleDeg
  );

  // Angular Diameter in arcseconds: theta = (2 * R / d) * 206265
  const radiusKm = PLANETARY_RADII_KM[bodySlug.toLowerCase()] ?? 3000.0;
  const angularDiameterArcsec = (2.0 * radiusKm * 206265.0) / geoDistKm;

  // Capitalized Name
  const bodyName = bodySlug.charAt(0).toUpperCase() + bodySlug.slice(1);

  return {
    bodySlug: bodySlug.toLowerCase(),
    bodyName,
    julianDate: jd,
    raDeg,
    decDeg,
    distanceAu: Number(geoDistAu.toFixed(5)),
    distanceKm: Number(geoDistKm.toFixed(1)),
    phaseAngleDeg: Number(phaseAngleDeg.toFixed(2)),
    illuminationPercentage: Number(illuminationPercentage.toFixed(1)),
    elongationFromSunDeg: Number(elongationFromSunDeg.toFixed(2)),
    apparentMagnitudeV: Number(apparentMagnitudeV.toFixed(2)),
    angularDiameterArcsec: Number(angularDiameterArcsec.toFixed(2)),
    heliocentricDistanceAu: Number(rPlanet.toFixed(5)),
    heliocentricLonDeg: Number(planetPos.trueAnomalyDeg.toFixed(2)),
    heliocentricLatDeg: Number((elements.inclinationDeg ?? 0).toFixed(2)),
  };
}

/**
 * Calculates planetary apparent visual magnitude V using Astronomical Almanac polynomials
 */
export function calculatePlanetaryApparentMagnitude(
  slug: string,
  rAu: number,
  dAu: number,
  phaseDeg: number
): number {
  const baseMag = 5.0 * Math.log10(Math.max(1e-4, rAu * dAu));

  switch (slug) {
    case "mercury":
      return -0.42 + baseMag + 0.038 * phaseDeg - 0.000273 * phaseDeg * phaseDeg;
    case "venus":
      return -4.4 + baseMag + 0.0009 * phaseDeg + 0.000239 * phaseDeg * phaseDeg;
    case "mars":
      return -1.52 + baseMag + 0.016 * phaseDeg;
    case "jupiter":
      return -9.4 + baseMag + 0.005 * phaseDeg;
    case "saturn":
      return -8.88 + baseMag + 0.044 * phaseDeg;
    case "uranus":
      return -7.19 + baseMag + 0.0028 * phaseDeg;
    case "neptune":
      return -6.87 + baseMag;
    case "pluto":
      return -1.0 + baseMag + 0.041 * phaseDeg;
    default:
      return 0.0 + baseMag;
  }
}
