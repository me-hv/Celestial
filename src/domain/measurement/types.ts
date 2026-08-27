import { ProvenanceRecord } from "../provenance/types";

/**
 * Scientific Measurement with Explicit Uncertainty & Units
 *
 * Distinguishes:
 * 1. Measured Value
 * 2. Canonical SI/Astronomical Unit
 * 3. Upper & Lower Uncertainty (Error Bars)
 * 4. Provenance Record
 */
export interface ScientificMeasurement<T = number> {
  value: T;
  unit: string; // e.g. "kg", "km", "AU", "M_earth", "R_earth", "M_sun", "R_sun", "K", "days", "ly"
  uncertainty?: {
    upper?: number; // Positive offset (+Δ)
    lower?: number; // Negative offset (-Δ)
  };
  provenance?: ProvenanceRecord;
}

/**
 * Helper to construct a ScientificMeasurement object safely
 */
export function createMeasurement<T>(
  value: T,
  unit: string,
  uncertainty?: { upper?: number; lower?: number },
  provenance?: ProvenanceRecord
): ScientificMeasurement<T> {
  return {
    value,
    unit,
    ...(uncertainty && { uncertainty }),
    ...(provenance && { provenance }),
  };
}
