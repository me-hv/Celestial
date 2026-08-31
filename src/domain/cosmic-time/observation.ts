import { ObservationTimeModel } from "./types";
import { LY_PER_MPC } from "@/lib/astronomy/coordinates/local-group";
import { defaultCosmology } from "@/lib/astronomy/cosmology/cosmology-calculator";

/**
 * Creates an ObservationTimeModel for nearby stars, planets, and local objects (d < 1 Mpc).
 * Uses kinematic light-travel time: t = d / c.
 */
export function createLightTravelObservation(distanceLy: number): ObservationTimeModel {
  const distanceMpc = distanceLy / LY_PER_MPC;
  const lookbackYears = distanceLy;
  const lookbackGyr = lookbackYears / 1e9;

  let explanation = "";
  if (distanceLy < 0.001) {
    explanation = "Within the immediate Solar System: light arrives in minutes to hours.";
  } else if (distanceLy < 100) {
    explanation = `Nearby stellar neighborhood: we observe this star as it emitted light approximately ${distanceLy.toFixed(1)} years ago.`;
  } else {
    explanation = `Galactic scale: light-travel time across interstellar space is ${(distanceLy / 1000).toFixed(1)} thousand years. Spacetime expansion is negligible within the gravitationally bound Milky Way.`;
  }

  return {
    timeType: "LIGHT_TRAVEL_TIME",
    distanceMpc,
    distanceLy,
    lookbackYears,
    lookbackGyr,
    isCosmological: false,
    scientificExplanation: explanation,
  };
}

/**
 * Creates an ObservationTimeModel for extragalactic objects where cosmological expansion applies (z > 0.001).
 * Uses Lambda-CDM FLRW metric integration.
 */
export function createCosmologicalLookbackObservation(
  redshiftZ: number,
  distanceMpc?: number
): ObservationTimeModel {
  const cosmology = defaultCosmology;
  const universeAgeGyr = cosmology.calculateUniverseAgeGyr();

  if (redshiftZ <= 0.001) {
    const dMpc = distanceMpc ?? 1.0;
    const dLy = dMpc * LY_PER_MPC;
    return {
      timeType: "LIGHT_TRAVEL_TIME",
      distanceMpc: dMpc,
      distanceLy: dLy,
      lookbackYears: dLy,
      lookbackGyr: dLy / 1e9,
      redshiftZ,
      scaleFactorA: 1.0,
      cosmicAgeGyr: universeAgeGyr - dLy / 1e9,
      cosmicAgeYears: universeAgeGyr * 1e9 - dLy,
      isCosmological: false,
      scientificExplanation:
        "Local Group gravitationally bound object: internal kinematics overcome cosmic expansion.",
    };
  }

  const lookbackTimeGyr = cosmology.calculateLookbackTimeGyr(redshiftZ);
  const lookbackYears = lookbackTimeGyr * 1e9;
  const cosmicAgeGyr = Math.max(0, universeAgeGyr - lookbackTimeGyr);
  const cosmicAgeYears = cosmicAgeGyr * 1e9;
  const scaleFactorA = 1.0 / (1.0 + redshiftZ);
  const comovingDistMpc = cosmology.calculateComovingDistanceMpc(redshiftZ);
  const comovingDistLy = comovingDistMpc * LY_PER_MPC;

  return {
    timeType: "COSMOLOGICAL_LOOKBACK_TIME",
    distanceMpc: distanceMpc ?? comovingDistMpc,
    distanceLy: distanceMpc ? distanceMpc * LY_PER_MPC : comovingDistLy,
    lookbackYears,
    lookbackGyr: lookbackTimeGyr,
    redshiftZ,
    scaleFactorA: Number(scaleFactorA.toFixed(4)),
    cosmicAgeGyr: Number(cosmicAgeGyr.toFixed(3)),
    cosmicAgeYears,
    isCosmological: true,
    scientificExplanation: `Cosmological redshift z = ${redshiftZ.toFixed(4)}: light was emitted when the Universe was ~${cosmicAgeGyr.toFixed(2)} Gyr old (scale factor a = ${scaleFactorA.toFixed(3)}), looking back ~${lookbackTimeGyr.toFixed(2)} Billion years into cosmic history.`,
  };
}

/**
 * Universal helper that safely routes an astronomical object to either
 * Light-Travel Time or Cosmological Lookback Time.
 */
export function deriveObservationTimeForObject(params: {
  distanceLy: number;
  redshiftZ?: number;
  isExtragalactic?: boolean;
}): ObservationTimeModel {
  const { distanceLy, redshiftZ, isExtragalactic } = params;
  const distanceMpc = distanceLy / LY_PER_MPC;

  if (isExtragalactic && redshiftZ !== undefined && redshiftZ > 0.001) {
    return createCosmologicalLookbackObservation(redshiftZ, distanceMpc);
  }

  return createLightTravelObservation(distanceLy);
}
