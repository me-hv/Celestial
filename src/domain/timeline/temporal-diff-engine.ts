import { StateDiffResult } from "./types";
import { TemporalStateEngine } from "./temporal-state-engine";

export class TemporalDiffEngine {
  /**
   * Calculates physical, orbital, and operational state differences between two time epochs T1 and T2
   */
  public static diffStates(targetSlug: string, dateA: Date, dateB: Date): StateDiffResult {
    const stateA = TemporalStateEngine.getStateAt(targetSlug, dateA);
    const stateB = TemporalStateEngine.getStateAt(targetSlug, dateB);

    const deltaMs = Math.abs(dateB.getTime() - dateA.getTime());
    const deltaDays = Number((deltaMs / (1000 * 60 * 60 * 24)).toFixed(2));

    const distDeltaAu =
      stateA.distanceFromSunAu !== undefined && stateB.distanceFromSunAu !== undefined
        ? Number(Math.abs(stateB.distanceFromSunAu - stateA.distanceFromSunAu).toFixed(3))
        : undefined;

    const velDeltaKmS =
      stateA.heliocentricVelocityKmS !== undefined && stateB.heliocentricVelocityKmS !== undefined
        ? Number(
            Math.abs(stateB.heliocentricVelocityKmS - stateA.heliocentricVelocityKmS).toFixed(2)
          )
        : undefined;

    const statusChanged = stateA.operationalStatus !== stateB.operationalStatus;
    const phaseChanged = stateA.missionPhase !== stateB.missionPhase;

    let summary = `Over ${deltaDays} days, ${stateB.targetName} traversed an orbital/trajectory interval.`;
    if (distDeltaAu !== undefined) {
      summary += ` Radial solar distance shifted by ${distDeltaAu} AU.`;
    }
    if (statusChanged) {
      summary += ` Status transitioned from ${stateA.operationalStatus} to ${stateB.operationalStatus}.`;
    }

    return {
      targetId: targetSlug,
      timestampA: dateA.toISOString(),
      timestampB: dateB.toISOString(),
      timeDeltaDays: deltaDays,
      distanceDeltaAu: distDeltaAu,
      velocityDeltaKmS: velDeltaKmS,
      statusChanged,
      previousStatus: stateA.operationalStatus,
      currentStatus: stateB.operationalStatus,
      phaseChanged,
      previousPhase: stateA.missionPhase,
      currentPhase: stateB.missionPhase,
      scientificSummary: summary,
    };
  }
}
