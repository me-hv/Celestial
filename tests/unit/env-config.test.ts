import { describe, it, expect } from "vitest";
import { getEnv } from "@/lib/config/env";
import { formatDistance, formatScientificMass, formatTemperature } from "@/lib/utils/formatters";

describe("Environment Configuration & Utilities", () => {
  it("provides valid default environment settings", () => {
    const config = getEnv();
    expect(config.NEXT_PUBLIC_APP_NAME).toBe("CELESTIAL");
    expect(config.NASA_API_KEY).toBeDefined();
    expect(config.HORIZONS_API_BASE_URL).toContain("jpl.nasa.gov");
  });

  it("formats distances across units correctly", () => {
    expect(formatDistance(undefined, 4.24, undefined)).toBe("4.24 ly");
    expect(formatDistance(undefined, undefined, 1.0)).toBe("1 AU");
    expect(formatDistance(149597870, undefined, undefined)).toBe("149,597,870 km");
    expect(formatDistance()).toBe("Unknown");
  });

  it("formats mass in scientific notation", () => {
    expect(formatScientificMass(5.972e24)).toBe("5.97 × 10^24 kg");
    expect(formatScientificMass()).toBe("Unknown");
  });

  it("formats kelvin temperatures to Celsius", () => {
    expect(formatTemperature(288.15)).toBe("288.15 K (15.0 °C)");
    expect(formatTemperature()).toBe("Unknown");
  });
});
