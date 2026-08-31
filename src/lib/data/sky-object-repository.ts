import { ObserverLocation, SkyObjectObservation, SkyObjectState } from "@/domain/observer/types";
import {
  dateToJulianDate,
  calculateLocalMeanSiderealTimeHours,
  equatorialToHorizontal,
  calculateRiseTransitSet,
} from "../astronomy/coordinates/horizontal";
import { equatorialToGalactic } from "../astronomy/coordinates/equatorial-to-galactic";
import {
  calculatePlanetaryEphemeris,
  PLANETARY_ORBIT_ELEMENTS,
} from "../astronomy/ephemeris/planetary-ephemeris";
import { calculateLunarEphemeris } from "../astronomy/ephemeris/lunar-ephemeris";
import { starRepository } from "./star-repository";
import { deepSkyRepo } from "./deep-sky-repository";
import { constellationRepo } from "./constellation-repository";

export interface SkyFilterOptions {
  maxMagnitudeV?: number;
  categories?: string[]; // "PLANET", "STAR", "GALAXY", "NEBULA", "PLANETARY_NEBULA", "SUPERNOVA_REMNANT", "MOON"
  onlyAboveHorizon?: boolean;
  constellationIauCode?: string;
}

export class SkyObjectRepository {
  /**
   * Computes a full SkyObjectObservation for a specific object given observer location and date.
   */
  getSkyObservation(
    objectSlugOrId: string,
    location: ObserverLocation,
    date: Date = new Date()
  ): SkyObjectObservation | undefined {
    const slug = objectSlugOrId.trim().toLowerCase();
    const jd = dateToJulianDate(date);
    const lmst = calculateLocalMeanSiderealTimeHours(jd, location.longitudeDeg);

    // 1. Check if it's the Moon
    if (slug === "moon" || slug === "earth-i" || slug === "luna") {
      const lunar = calculateLunarEphemeris(date);
      const horizontal = equatorialToHorizontal(
        lunar.raDeg,
        lunar.decDeg,
        location.latitudeDeg,
        lmst
      );
      const constMatch = constellationRepo.getClosestForCoordinates(lunar.raDeg, lunar.decDeg);
      const riseTransitSet = calculateRiseTransitSet(
        lunar.raDeg,
        lunar.decDeg,
        location.latitudeDeg,
        location.longitudeDeg,
        date,
        -0.8333 // Moon semi-diameter & refraction
      );
      const state = this.determineState(horizontal.altitudeDeg, riseTransitSet, date);

      return {
        objectId: "10000000-0000-0000-0000-000000000005",
        objectSlug: "moon",
        canonicalName: "Moon",
        standardDesignation: "Earth I",
        category: "SATELLITE",
        type: "MOON",
        apparentMagnitudeV: -12.74 + (1.0 - lunar.illuminationPercentage / 100.0) * 10.0,
        raDeg: lunar.raDeg,
        decDeg: lunar.decDeg,
        horizontal,
        constellation: constMatch?.name || "Unknown",
        state,
        riseTransitSet,
        distanceLy: Number((lunar.distanceKm / 9.461e12).toFixed(8)),
        provenance: {
          catalogName: "Analytical Lunar Theory (Meeus/Brown Approximation)",
          authoritativeBody: "NASA",
          recordIdentifier: "EPHEMERIS:MOON",
          confidenceScore: 0.99,
          citationUrl: "https://ssd.jpl.nasa.gov",
        },
      };
    }

    // 2. Check if it's a Solar System planet or Sun
    if (slug === "sun" || PLANETARY_ORBIT_ELEMENTS[slug]) {
      const ephem = calculatePlanetaryEphemeris(slug, date);
      const horizontal = equatorialToHorizontal(
        ephem.raDeg,
        ephem.decDeg,
        location.latitudeDeg,
        lmst
      );
      const constMatch = constellationRepo.getClosestForCoordinates(ephem.raDeg, ephem.decDeg);
      const riseTransitSet = calculateRiseTransitSet(
        ephem.raDeg,
        ephem.decDeg,
        location.latitudeDeg,
        location.longitudeDeg,
        date,
        slug === "sun" ? -0.8333 : -0.5667
      );
      const state = this.determineState(horizontal.altitudeDeg, riseTransitSet, date);

      return {
        objectId: `solar-${ephem.bodySlug}`,
        objectSlug: ephem.bodySlug,
        canonicalName: ephem.bodyName,
        standardDesignation: `Sol ${ephem.bodySlug.toUpperCase()}`,
        category: ephem.bodySlug === "sun" ? "STELLAR" : "PLANETARY",
        type: ephem.bodySlug === "sun" ? "STAR" : "PLANET",
        apparentMagnitudeV: ephem.apparentMagnitudeV,
        raDeg: ephem.raDeg,
        decDeg: ephem.decDeg,
        horizontal,
        constellation: constMatch?.name || "Unknown",
        state,
        riseTransitSet,
        distanceLy: Number((ephem.distanceKm / 9.461e12).toFixed(6)),
        provenance: {
          catalogName: "Keplerian-Geocentric Ephemeris Engine (J2000)",
          authoritativeBody: "NASA",
          recordIdentifier: `EPHEMERIS:${ephem.bodySlug.toUpperCase()}`,
          confidenceScore: 0.99,
          citationUrl: "https://ssd.jpl.nasa.gov",
        },
      };
    }

    // 3. Check if it's a Star
    const star = starRepository.getById(slug) || starRepository.getBySlug(slug);
    if (
      star &&
      star.positional.rightAscensionDeg !== undefined &&
      star.positional.declinationDeg !== undefined
    ) {
      const ra = star.positional.rightAscensionDeg;
      const dec = star.positional.declinationDeg;
      const horizontal = equatorialToHorizontal(ra, dec, location.latitudeDeg, lmst);
      const galactic = equatorialToGalactic(ra, dec);
      const constMatch = constellationRepo.getClosestForCoordinates(ra, dec);
      const riseTransitSet = calculateRiseTransitSet(
        ra,
        dec,
        location.latitudeDeg,
        location.longitudeDeg,
        date
      );
      const state = this.determineState(horizontal.altitudeDeg, riseTransitSet, date);

      return {
        objectId: star.id,
        objectSlug: star.slug,
        canonicalName: star.canonicalName,
        standardDesignation: star.standardDesignation,
        category: "STELLAR",
        type: "STAR",
        apparentMagnitudeV: star.physical.apparentMagnitudeV,
        spectralClass: star.physical.spectralClass,
        raDeg: ra,
        decDeg: dec,
        galacticLongDeg: galactic.lDeg,
        galacticLatDeg: galactic.bDeg,
        horizontal,
        constellation: star.physical.constellation || constMatch?.name || "Unknown",
        state,
        riseTransitSet,
        distanceLy: star.positional.distanceLightYears,
        provenance: star.provenance,
      };
    }

    // 4. Check if it's a Deep Sky Object
    const dso =
      deepSkyRepo.getBySlug(slug) ||
      deepSkyRepo.getById(slug) ||
      deepSkyRepo.getByCatalogIdentifier(slug);
    if (
      dso &&
      dso.positional.rightAscensionDeg !== undefined &&
      dso.positional.declinationDeg !== undefined
    ) {
      const ra = dso.positional.rightAscensionDeg;
      const dec = dso.positional.declinationDeg;
      const horizontal = equatorialToHorizontal(ra, dec, location.latitudeDeg, lmst);
      const galactic = equatorialToGalactic(ra, dec);
      const constMatch = constellationRepo.getClosestForCoordinates(ra, dec);
      const riseTransitSet = calculateRiseTransitSet(
        ra,
        dec,
        location.latitudeDeg,
        location.longitudeDeg,
        date
      );
      const state = this.determineState(horizontal.altitudeDeg, riseTransitSet, date);

      return {
        objectId: dso.id,
        objectSlug: dso.slug,
        canonicalName: dso.canonicalName,
        standardDesignation: dso.standardDesignation,
        category: dso.classification.category,
        type: dso.classification.code,
        apparentMagnitudeV: dso.physical.apparentMagnitudeV,
        raDeg: ra,
        decDeg: dec,
        galacticLongDeg: galactic.lDeg,
        galacticLatDeg: galactic.bDeg,
        horizontal,
        constellation: dso.physical.constellation || constMatch?.name || "Unknown",
        state,
        riseTransitSet,
        distanceLy: dso.positional.distanceLightYears,
        provenance: dso.provenance,
      };
    }

    return undefined;
  }

  /**
   * Retrieves all observable sky objects given an observer location and date with optional filters.
   */
  getVisibleSkyObjects(
    location: ObserverLocation,
    date: Date = new Date(),
    filters: SkyFilterOptions = {}
  ): SkyObjectObservation[] {
    const results: SkyObjectObservation[] = [];
    const seenSlugs = new Set<string>();

    // 1. Planets + Sun + Moon
    const solarBodies = [
      "sun",
      "moon",
      "mercury",
      "venus",
      "mars",
      "jupiter",
      "saturn",
      "uranus",
      "neptune",
      "pluto",
    ];

    for (const body of solarBodies) {
      const obs = this.getSkyObservation(body, location, date);
      if (obs && !seenSlugs.has(obs.objectSlug)) {
        seenSlugs.add(obs.objectSlug);
        if (this.matchesFilter(obs, filters)) {
          results.push(obs);
        }
      }
    }

    // 2. Stars
    const allStars = starRepository.getAll();
    for (const star of allStars) {
      if (!seenSlugs.has(star.slug)) {
        const obs = this.getSkyObservation(star.slug, location, date);
        if (obs) {
          seenSlugs.add(star.slug);
          if (this.matchesFilter(obs, filters)) {
            results.push(obs);
          }
        }
      }
    }

    // 3. Deep Sky Objects
    const allDso = deepSkyRepo.getAll();
    for (const dso of allDso) {
      if (!seenSlugs.has(dso.slug)) {
        const obs = this.getSkyObservation(dso.slug, location, date);
        if (obs) {
          seenSlugs.add(dso.slug);
          if (this.matchesFilter(obs, filters)) {
            results.push(obs);
          }
        }
      }
    }

    // Sort by apparent brightness (ascending magnitude)
    return results.sort((a, b) => {
      const magA = a.apparentMagnitudeV ?? 99;
      const magB = b.apparentMagnitudeV ?? 99;
      return magA - magB;
    });
  }

  /**
   * Searches the sky for matching objects and computes their live observational state.
   */
  searchSky(
    query: string,
    location: ObserverLocation,
    date: Date = new Date()
  ): SkyObjectObservation[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const allObjects = this.getVisibleSkyObjects(location, date);
    return allObjects.filter(
      (obs) =>
        obs.canonicalName.toLowerCase().includes(q) ||
        (obs.standardDesignation && obs.standardDesignation.toLowerCase().includes(q)) ||
        obs.constellation.toLowerCase().includes(q) ||
        obs.type.toLowerCase().includes(q)
    );
  }

  private matchesFilter(obs: SkyObjectObservation, filters: SkyFilterOptions): boolean {
    if (filters.onlyAboveHorizon && !obs.horizontal.isAboveHorizon) {
      return false;
    }

    if (
      filters.maxMagnitudeV !== undefined &&
      obs.apparentMagnitudeV !== undefined &&
      obs.apparentMagnitudeV > filters.maxMagnitudeV
    ) {
      return false;
    }

    if (filters.categories && filters.categories.length > 0) {
      if (!filters.categories.includes(obs.type) && !filters.categories.includes(obs.category)) {
        return false;
      }
    }

    if (filters.constellationIauCode) {
      const constObj = constellationRepo.getByCode(filters.constellationIauCode);
      if (constObj && obs.constellation !== constObj.name) {
        return false;
      }
    }

    return true;
  }

  private determineState(
    altDeg: number,
    riseTransitSet: { transitDate: Date | null },
    now: Date
  ): SkyObjectState {
    if (altDeg < 0.0) {
      return "BELOW_HORIZON";
    }

    if (riseTransitSet.transitDate) {
      const timeDiffMinutes =
        Math.abs(now.getTime() - riseTransitSet.transitDate.getTime()) / 60000.0;
      if (timeDiffMinutes < 30.0) {
        return "CULMINATING";
      }
    }

    if (altDeg < 15.0) {
      return "RISING";
    }

    return "ABOVE_HORIZON";
  }
}

export const skyObjectRepo = new SkyObjectRepository();
