import { GeomagneticStormScale, SolarActivityLevel, SpaceWeatherObservation } from "./types";

/**
 * Calculates geomagnetic storm level from planetary Kp index
 */
export function calculateGeomagneticStormScale(kp: number): GeomagneticStormScale {
  if (kp >= 9) return "G5_EXTREME";
  if (kp >= 8) return "G4_SEVERE";
  if (kp >= 7) return "G3_STRONG";
  if (kp >= 6) return "G2_MODERATE";
  if (kp >= 5) return "G1_MINOR";
  return "NONE";
}

/**
 * Calculates theoretical lowest geomagnetic equatorward auroral boundary
 * Empirical relationship: Latitude_min ≈ 66° - 2.1 * Kp
 */
export function calculateAuroralBoundaryLatitude(kp: number): number {
  const lat = 66.0 - 2.1 * kp;
  return Number(Math.max(40.0, lat).toFixed(1));
}

/**
 * Classifies solar activity from GOES X-ray flux in Watts/m^2 (0.1 - 0.8 nm band)
 */
export function classifySolarActivityLevel(xrayFluxWm2: number): SolarActivityLevel {
  if (xrayFluxWm2 >= 1e-4) return "EXTREME"; // X10+
  if (xrayFluxWm2 >= 1e-5) return "VERY_HIGH"; // X1+
  if (xrayFluxWm2 >= 1e-6) return "HIGH"; // M1+
  if (xrayFluxWm2 >= 1e-7) return "MODERATE"; // C1+
  if (xrayFluxWm2 >= 1e-8) return "LOW"; // B1+
  return "VERY_LOW"; // A class
}

/**
 * Generates scientific observation implications from space weather parameters
 */
export function deriveObservationImplications(
  kpIndex: number,
  xrayFluxWm2: number,
  solarWindSpeedKmS: number,
  imfBzNanotesla: number
): SpaceWeatherObservation["observationImplications"] {
  const storm = calculateGeomagneticStormScale(kpIndex);
  const auroralLat = calculateAuroralBoundaryLatitude(kpIndex);

  let auroralRec = `Auroral oval restricted to polar latitudes (> ${auroralLat}° geomagnetic). Unlikely at mid-latitudes.`;
  if (storm === "G5_EXTREME" || storm === "G4_SEVERE") {
    auroralRec = `Major auroral storm in progress! Visible down to geomagnetic latitude ~${auroralLat}°. Excellent high/mid-latitude visual and photographic opportunities.`;
  } else if (storm === "G3_STRONG" || storm === "G2_MODERATE") {
    auroralRec = `Substorm expansion active. Auroral displays probable down to ~${auroralLat}° geomagnetic under dark skies.`;
  } else if (storm === "G1_MINOR" && imfBzNanotesla < -3.0) {
    auroralRec = `Minor geomagnetic disturbance with southward IMF Bz (${imfBzNanotesla} nT). Auroral arcs possible above ~${auroralLat}°.`;
  }

  let radioCondition = "HF radio propagation nominal across all terrestrial bands.";
  if (xrayFluxWm2 >= 1e-4) {
    radioCondition =
      "Extreme R5 radio blackout on sunlit side of Earth; widespread loss of HF communications.";
  } else if (xrayFluxWm2 >= 1e-5) {
    radioCondition =
      "Strong R3 radio blackout; degraded daylight HF signals and GNSS positioning errors.";
  } else if (xrayFluxWm2 >= 1e-6) {
    radioCondition =
      "Minor R1 radio blackout; brief daylight HF absorption events on low frequencies.";
  }

  let turbulence = "Nominal upper atmospheric density and ionospheric scintillation.";
  if (kpIndex >= 6 || solarWindSpeedKmS > 650) {
    turbulence =
      "Elevated ionospheric total electron content (TEC) gradients; potential radio interferometry phase delays.";
  }

  let hazardScore = 1;
  if (storm === "G5_EXTREME") hazardScore = 9;
  else if (storm === "G4_SEVERE") hazardScore = 7;
  else if (storm === "G3_STRONG") hazardScore = 5;
  else if (storm === "G2_MODERATE") hazardScore = 3;

  return {
    auroralVisibilityRecommendation: auroralRec,
    radioPropagationCondition: radioCondition,
    groundTelescopeAtmosphericTurbulence: turbulence,
    satelliteSensorHazardScore: hazardScore,
  };
}
