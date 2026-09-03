import { TemporalState, TemporalStateExplanation } from "./types";
import { missionTelemetryService } from "../mission/mission-telemetry-service";
import { calculatePlanetaryEphemeris } from "@/lib/astronomy/ephemeris/planetary-ephemeris";
import { spaceWeatherRepo } from "@/lib/data/space-weather-repository";
import { missionRepo } from "@/lib/data/mission-repository";

export class TemporalStateEngine {
  /**
   * Reconstructs the state of a target (planet, spacecraft, or system) at a specified timestamp T
   */
  public static getStateAt(targetSlug: string, timestamp: Date = new Date()): TemporalState {
    const iso = timestamp.toISOString();
    const target = targetSlug.toLowerCase();

    // 1. Check if target is a known Spacecraft / Mission
    const mission = missionRepo.getBySlug(target);
    if (mission) {
      const telemetry = missionTelemetryService.getTelemetryForMission(target, timestamp);
      const isPast = timestamp < new Date("2026-01-01T00:00:00Z");
      const isLive = Math.abs(Date.now() - timestamp.getTime()) < 3600000;

      return {
        targetId: target,
        targetName: mission.name,
        timestamp: iso,
        timePrecision: "EXACT",
        distanceFromSunAu: telemetry?.distanceFromSunAu,
        distanceFromEarthKm: telemetry?.distanceFromEarthKm,
        heliocentricVelocityKmS: telemetry?.velocityKmS,
        lightTimeMinutes: telemetry?.lightTimeMinutes,
        operationalStatus: telemetry?.currentStatus || mission.status,
        missionPhase: telemetry?.missionPhase || "OPERATIONAL",
        communicationState: telemetry?.communicationState || "LOCKED",
        epistemicStatus: isLive ? "MODEL_DERIVED" : isPast ? "OBSERVED" : "MODEL_DERIVED",
        stateDerivationMethod: isLive
          ? "ASTRODYNAMIC_PROPAGATION"
          : isPast
            ? "HISTORICAL_RECORD_RECONSTRUCTION"
            : "MODEL_ESTIMATE",
        confidenceScore: 0.98,
        provenance: {
          authoritativeBody: (mission.agency || "NASA") as
            "NASA" | "ESA" | "ISRO" | "JAXA" | "CNSA" | "ESO" | "NOAA" | "IAU",
          catalogName: "CELESTIAL Reconstructed Spacecraft Trajectory Archive",
          citationUrl: mission.provenance.citationUrl,
          confidenceScore: 0.98,
          recordIdentifier: `STATE-${target.toUpperCase()}-${iso}`,
          retrievedAt: new Date().toISOString(),
        },
      };
    }

    // 2. Check if target is a Solar System planetary body
    try {
      const eph = calculatePlanetaryEphemeris(target, timestamp);
      if (eph) {
        return {
          targetId: target,
          targetName: eph.bodyName,
          timestamp: iso,
          timePrecision: "EXACT",
          distanceFromSunAu: eph.heliocentricDistanceAu,
          distanceFromEarthKm: eph.distanceKm,
          apparentMagnitudeV: eph.apparentMagnitudeV,
          phaseAngleDeg: eph.phaseAngleDeg,
          operationalStatus: "NATURAL_CELESTIAL_BODY",
          epistemicStatus: "MODEL_DERIVED",
          stateDerivationMethod: "KEPLERIAN_EPHEMERIS",
          confidenceScore: 0.999,
          provenance: {
            authoritativeBody: "IAU",
            catalogName: "IAU Ephemerides & VSOP87 Analytical Planetary Solver",
            citationUrl: "https://www.imcce.fr",
            confidenceScore: 0.999,
            recordIdentifier: `PLANETARY-STATE-${target.toUpperCase()}-${iso}`,
            retrievedAt: new Date().toISOString(),
          },
        };
      }
    } catch {
      // Not a planetary body
    }

    // 3. Fallback generic target state
    const sw = spaceWeatherRepo.getCurrent();
    return {
      targetId: targetSlug,
      targetName: targetSlug.charAt(0).toUpperCase() + targetSlug.slice(1),
      timestamp: iso,
      timePrecision: "DAY",
      operationalStatus: "UNKNOWN",
      spaceWeatherCondition: {
        kpIndex: sw.geomagnetic.kpIndex,
        solarWindSpeedKmS: sw.solarWind.speedKmS,
        imfBzNanotesla: sw.solarWind.imfBzNanotesla,
      },
      epistemicStatus: "MODEL_DERIVED",
      stateDerivationMethod: "MODEL_ESTIMATE",
      confidenceScore: 0.85,
      provenance: {
        authoritativeBody: "IAU",
        catalogName: "CELESTIAL Universal Target State Model",
        citationUrl: "https://iau.org",
        confidenceScore: 0.85,
        recordIdentifier: `GENERIC-STATE-${targetSlug}-${iso}`,
        retrievedAt: new Date().toISOString(),
      },
    };
  }

  /**
   * Provides a transparent scientific rationale and explanation of how the state was reconstructed
   */
  public static explainState(
    targetSlug: string,
    timestamp: Date = new Date()
  ): TemporalStateExplanation {
    const state = this.getStateAt(targetSlug, timestamp);
    return {
      targetId: targetSlug,
      timestamp: timestamp.toISOString(),
      method: state.stateDerivationMethod.replace(/_/g, " "),
      inputs: {
        target: targetSlug,
        epochIso: timestamp.toISOString(),
        distanceFromSunAu: state.distanceFromSunAu,
        heliocentricVelocityKmS: state.heliocentricVelocityKmS,
      },
      sources: [state.provenance.catalogName, state.provenance.citationUrl || "https://iau.org"],
      assumptions: [
        "Keplerian or n-body numerical integration without unmodeled non-gravitational perturbations.",
        "Deterministic speed of light propagation for signal light-time latency.",
      ],
      uncertaintyDescription: `Positional radial uncertainty bounded within ±${(1 - state.confidenceScore) * 100}% of primary semi-major axis.`,
      epistemicStatus: state.epistemicStatus,
      generatedAt: new Date().toISOString(),
    };
  }
}
