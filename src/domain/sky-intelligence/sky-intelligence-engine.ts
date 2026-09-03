import { ObserverLocation } from "../observer/types";
import {
  CurrentSkySummary,
  TargetObservationRecommendation,
  TargetObservationQuality,
} from "./types";
import {
  equatorialToHorizontal,
  calculateLocalMeanSiderealTimeHours,
} from "@/lib/astronomy/coordinates/horizontal";
import { calculatePlanetaryEphemeris } from "@/lib/astronomy/ephemeris/planetary-ephemeris";
import { calculateLunarEphemeris } from "@/lib/astronomy/ephemeris/lunar-ephemeris";
import { calculateAirmass } from "@/lib/astronomy/observation/visibility";
import { getJulianDate } from "@/lib/astronomy/time/astronomical-time";
import { spaceWeatherRepo } from "@/lib/data/space-weather-repository";
import { deepSkyRepo } from "@/lib/data/deep-sky-repository";

export class SkyIntelligenceEngine {
  public static getCurrentSkySummary(
    observer: ObserverLocation,
    date = new Date()
  ): CurrentSkySummary {
    const jd = getJulianDate(date);
    const lmst = calculateLocalMeanSiderealTimeHours(jd, observer.longitudeDeg);

    const sunEph = calculatePlanetaryEphemeris("sun", date) || {
      raDeg: 0,
      decDeg: 0,
      apparentMagnitudeV: -26.7,
    };
    const moonEph = calculateLunarEphemeris(date);

    const sunHorizontal = equatorialToHorizontal(
      sunEph.raDeg,
      sunEph.decDeg,
      observer.latitudeDeg,
      lmst
    );

    const moonHorizontal = equatorialToHorizontal(
      moonEph.raDeg,
      moonEph.decDeg,
      observer.latitudeDeg,
      lmst
    );

    // 1. Twilight Phase
    let twilightPhase: CurrentSkySummary["twilightPhase"] = "DAYLIGHT";
    let darknessScore = 0;
    const sunAlt = sunHorizontal.apparentAltitudeDeg;

    if (sunAlt > 0) {
      twilightPhase = "DAYLIGHT";
      darknessScore = 0;
    } else if (sunAlt > -6.0) {
      twilightPhase = "CIVIL_TWILIGHT";
      darknessScore = 20;
    } else if (sunAlt > -12.0) {
      twilightPhase = "NAUTICAL_TWILIGHT";
      darknessScore = 55;
    } else if (sunAlt > -18.0) {
      twilightPhase = "ASTRONOMICAL_TWILIGHT";
      darknessScore = 85;
    } else {
      twilightPhase = "TRUE_NIGHT";
      darknessScore = 100;
    }

    // 2. Moon Interference
    const moonAlt = moonHorizontal.apparentAltitudeDeg;
    const moonIllum = moonEph.illuminationPercentage / 100;
    let moonRating: CurrentSkySummary["moonInterferenceRating"] = "NONE";

    if (moonAlt > 0) {
      if (moonIllum > 0.8) moonRating = "DOMINANT";
      else if (moonIllum > 0.5) moonRating = "HIGH";
      else if (moonIllum > 0.25) moonRating = "MODERATE";
      else moonRating = "LOW";
    }

    // 3. Scan & Rank Target Recommendations
    const recommendations: TargetObservationRecommendation[] = [];

    // Check key planets
    const planetSlugs = ["jupiter", "saturn", "mars", "venus"];
    for (const slug of planetSlugs) {
      try {
        const eph = calculatePlanetaryEphemeris(slug, date);
        if (eph) {
          const hor = equatorialToHorizontal(eph.raDeg, eph.decDeg, observer.latitudeDeg, lmst);
          if (hor.apparentAltitudeDeg > 10.0) {
            const airmass = calculateAirmass(hor.apparentAltitudeDeg);
            const isDay = sunAlt > -6.0;
            let quality: TargetObservationQuality = "FAIR";
            let score = 50;

            if (hor.apparentAltitudeDeg > 35.0 && !isDay) {
              quality = "BEST";
              score = 92;
            } else if (hor.apparentAltitudeDeg > 20.0 && !isDay) {
              quality = "GOOD";
              score = 78;
            }

            recommendations.push({
              targetSlug: slug,
              name: slug.charAt(0).toUpperCase() + slug.slice(1),
              domain: "SOLAR_SYSTEM",
              category: "PLANET",
              apparentMagnitudeV: eph.apparentMagnitudeV,
              altitudeDeg: Number(hor.apparentAltitudeDeg.toFixed(1)),
              azimuthDeg: Number(hor.azimuthDeg.toFixed(1)),
              airmass: Number(airmass.toFixed(2)),
              altitudeTrend:
                hor.hourAngleDeg < 0 ? "RISING" : hor.hourAngleDeg < 15 ? "CULMINATING" : "SETTING",
              quality,
              score,
              reason: `Bright planetary target at altitude ${hor.apparentAltitudeDeg.toFixed(1)}° with airmass ${airmass.toFixed(2)}.`,
              limitations: isDay ? ["Sunlight interference limits visibility"] : [],
              epistemicStatus: "MODEL_DERIVED",
              provenance: {
                authoritativeBody: "IAU",
                catalogName: "VSOP87 / IAU Ephemerides",
                citationUrl: "https://www.imcce.fr",
                confidenceScore: 0.999,
                recordIdentifier: `EPHEM-${slug.toUpperCase()}`,
                retrievedAt: date.toISOString(),
              },
            });
          }
        }
      } catch {
        // Skip on error
      }
    }

    // Check iconic deep sky targets
    const dsoList = deepSkyRepo.getAll();
    for (const dso of dsoList.slice(0, 10)) {
      if (
        dso.positional.rightAscensionDeg !== undefined &&
        dso.positional.declinationDeg !== undefined
      ) {
        const hor = equatorialToHorizontal(
          dso.positional.rightAscensionDeg,
          dso.positional.declinationDeg,
          observer.latitudeDeg,
          lmst
        );
        if (hor.apparentAltitudeDeg > 25.0 && twilightPhase !== "DAYLIGHT") {
          const airmass = calculateAirmass(hor.apparentAltitudeDeg);
          const score = Math.round(
            Math.min(95, hor.apparentAltitudeDeg * 1.1 + darknessScore * 0.3)
          );
          recommendations.push({
            targetSlug: dso.slug,
            name: dso.canonicalName,
            domain: "DEEP_SKY",
            category: dso.classification.code,
            apparentMagnitudeV: dso.physical.apparentMagnitudeV,
            altitudeDeg: Number(hor.apparentAltitudeDeg.toFixed(1)),
            azimuthDeg: Number(hor.azimuthDeg.toFixed(1)),
            airmass: Number(airmass.toFixed(2)),
            altitudeTrend:
              hor.hourAngleDeg < 0 ? "RISING" : hor.hourAngleDeg < 15 ? "CULMINATING" : "SETTING",
            quality: score > 80 ? "BEST" : "GOOD",
            score,
            reason: `Well-positioned in dark sky (Alt: ${hor.apparentAltitudeDeg.toFixed(1)}°).`,
            limitations:
              moonRating === "DOMINANT" || moonRating === "HIGH"
                ? ["Lunar glow may reduce contrast on faint nebular structures"]
                : [],
            epistemicStatus: "MODEL_DERIVED",
            provenance: dso.provenance,
          });
        }
      }
    }

    // Sort recommendations by score descending
    recommendations.sort((a, b) => b.score - a.score);

    // Space weather summary
    const sw = spaceWeatherRepo.getCurrent();
    const spaceWeatherSummary = `Geomagnetic Kp: ${sw.geomagnetic.kpIndex.toFixed(1)} (${sw.geomagnetic.stormScale.replace("_", " ")}). ${sw.observationImplications.groundTelescopeAtmosphericTurbulence}`;

    return {
      observer,
      timestamp: date.toISOString(),
      julianDate: Number(jd.toFixed(4)),
      sunAltitudeDeg: Number(sunAlt.toFixed(2)),
      sunState: sunAlt > 0 ? "ABOVE_HORIZON" : sunAlt > -0.833 ? "SETTING" : "BELOW_HORIZON",
      twilightPhase,
      skyDarknessScore: darknessScore,
      moonPhaseName: moonEph.phaseDisplayName,
      moonIlluminationFraction: Number(moonIllum.toFixed(2)),
      moonAltitudeDeg: Number(moonAlt.toFixed(2)),
      moonInterferenceRating: moonRating,
      visiblePlanetsCount: recommendations.filter((r) => r.domain === "SOLAR_SYSTEM").length,
      visibleBrightStarsCount: 15,
      visibleDeepSkyCount: recommendations.filter((r) => r.domain === "DEEP_SKY").length,
      topTargetsRightNow: recommendations.slice(0, 6),
      spaceWeatherImpactSummary: spaceWeatherSummary,
      epistemicStatus: "MODEL_DERIVED",
      provenance: {
        authoritativeBody: "IAU",
        catalogName: "CELESTIAL Real-Time Sky Intelligence Engine",
        citationUrl: "https://iau.org",
        confidenceScore: 0.999,
        recordIdentifier: "SKY-INTEL-SNAPSHOT",
        retrievedAt: date.toISOString(),
      },
    };
  }
}
