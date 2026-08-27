/**
 * Astronomical measurement formatters
 */

export function formatDistance(km?: number, lightYears?: number, au?: number): string {
  if (lightYears !== undefined && lightYears >= 0.01) {
    return `${lightYears.toLocaleString(undefined, { maximumFractionDigits: 2 })} ly`;
  }
  if (au !== undefined && au >= 0.01) {
    return `${au.toLocaleString(undefined, { maximumFractionDigits: 3 })} AU`;
  }
  if (km !== undefined) {
    return `${km.toLocaleString(undefined, { maximumFractionDigits: 0 })} km`;
  }
  return "Unknown";
}

export function formatScientificMass(kg?: number): string {
  if (!kg) return "Unknown";
  const exponent = Math.floor(Math.log10(kg));
  const mantissa = (kg / Math.pow(10, exponent)).toFixed(2);
  return `${mantissa} × 10^${exponent} kg`;
}

export function formatTemperature(kelvin?: number): string {
  if (kelvin === undefined) return "Unknown";
  const celsius = kelvin - 273.15;
  return `${kelvin.toLocaleString()} K (${celsius.toFixed(1)} °C)`;
}
