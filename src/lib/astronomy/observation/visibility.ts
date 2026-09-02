import {
  HorizontalCoordinates,
  RiseTransitSetResult,
  SkyObjectState,
} from "@/domain/observer/types";

export type ObservationalVisibilityClass =
  | "PRIME_OBSERVATION" // High in dark sky (>30° altitude)
  | "MODERATE_OBSERVATION" // Above 15° altitude
  | "LOW_HORIZON" // 0° to 15° altitude (heavy airmass)
  | "BELOW_HORIZON" // Not visible
  | "DAYLIGHT_WASHED"; // Lost in daylight

export interface VisibilityAnalysis {
  state: SkyObjectState;
  visibilityClass: ObservationalVisibilityClass;
  isNakedEyeVisible: boolean;
  zenithAngleDeg: number;
  airmassApprox: number;
  qualityScore: number; // 0 to 100
  summary: string;
}

/**
 * Calculates plane-parallel / Young airmass approximation
 * Formula: X ≈ 1 / (cos(z) + 0.025 * exp(-11 * cos(z)))
 */
export function calculateAirmass(altitudeDeg: number): number {
  if (altitudeDeg <= 0) return 99.0;
  const zRad = (90.0 - altitudeDeg) * (Math.PI / 180.0);
  const cosZ = Math.cos(zRad);
  return 1.0 / (cosZ + 0.025 * Math.exp(-11.0 * cosZ));
}

/**
 * Evaluates the complete visibility state and observational quality of an astronomical object
 */
export function evaluateVisibility(
  horizontal: HorizontalCoordinates,
  rts: RiseTransitSetResult,
  apparentMagnitudeV = 5.0,
  isDarkSky = true
): VisibilityAnalysis {
  const { apparentAltitudeDeg, hourAngleDeg, isAboveHorizon } = horizontal;
  const zenithAngleDeg = Math.max(0, 90.0 - apparentAltitudeDeg);
  const airmass = calculateAirmass(apparentAltitudeDeg);

  // 1. Determine Geometric State
  let state: SkyObjectState = "BELOW_HORIZON";

  if (rts.status === "NEVER_RISES") {
    state = "BELOW_HORIZON";
  } else if (!isAboveHorizon) {
    state = "BELOW_HORIZON";
  } else if (Math.abs(hourAngleDeg) < 8.0) {
    state = "CULMINATING";
  } else if (hourAngleDeg < 0.0) {
    state = "RISING";
  } else {
    state = "SETTING";
  }

  // 2. Determine Observational Quality Class
  let visibilityClass: ObservationalVisibilityClass = "BELOW_HORIZON";
  if (!isDarkSky && apparentMagnitudeV > -1.0) {
    // Only Sun, Moon, and Venus are visible in full daylight
    visibilityClass = isAboveHorizon ? "DAYLIGHT_WASHED" : "BELOW_HORIZON";
  } else if (apparentAltitudeDeg >= 30.0) {
    visibilityClass = "PRIME_OBSERVATION";
  } else if (apparentAltitudeDeg >= 15.0) {
    visibilityClass = "MODERATE_OBSERVATION";
  } else if (apparentAltitudeDeg >= 0.0) {
    visibilityClass = "LOW_HORIZON";
  }

  // 3. Compute Quality Score (0 to 100)
  let qualityScore = 0;
  if (isAboveHorizon) {
    // Altitude factor: 0 at horizon to 60 at zenith
    const altFactor = Math.min(60, (apparentAltitudeDeg / 90.0) * 60);
    // Magnitude factor: 0 for mag 6 down to 30 for mag -1
    const magFactor = Math.max(0, Math.min(30, (6.0 - apparentMagnitudeV) * 5));
    // Culmination bonus
    const culminationBonus = Math.abs(hourAngleDeg) < 15.0 ? 10 : 0;

    qualityScore = Math.min(100, Math.round(altFactor + magFactor + culminationBonus));
  }

  // 4. Naked eye visibility threshold (approx mag 6.0 in Bortle 1-2 dark sky)
  const isNakedEyeVisible = isAboveHorizon && isDarkSky && apparentMagnitudeV <= 6.0;

  // 5. Build Summary
  let summary = "";
  if (!isAboveHorizon) {
    summary =
      rts.status === "NEVER_RISES"
        ? "Never rises above observer horizon at this latitude."
        : `Below horizon. Transit at altitude ${rts.transitAltitudeDeg}°.`;
  } else if (state === "CULMINATING") {
    summary = `Near upper transit (highest point) at altitude ${apparentAltitudeDeg}°.`;
  } else if (state === "RISING") {
    summary = `Rising in the eastern sky at altitude ${apparentAltitudeDeg}°.`;
  } else {
    summary = `Setting in the western sky at altitude ${apparentAltitudeDeg}°.`;
  }

  return {
    state,
    visibilityClass,
    isNakedEyeVisible,
    zenithAngleDeg: Number(zenithAngleDeg.toFixed(2)),
    airmassApprox: Number(airmass.toFixed(2)),
    qualityScore,
    summary,
  };
}
