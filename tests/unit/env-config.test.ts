import { describe, it, expect } from "vitest";
import { getEnv, resolveAppUrl, cleanEnvValue } from "@/lib/config/env";
import { getSupabaseClient } from "@/lib/db/supabase";
import { formatDistance, formatScientificMass, formatTemperature } from "@/lib/utils/formatters";

describe("Environment Configuration & Utilities", () => {
  it("Scenario A: provides valid defaults for local development without Supabase", () => {
    const config = getEnv({});
    expect(config.NEXT_PUBLIC_APP_NAME).toBe("CELESTIAL");
    expect(config.NEXT_PUBLIC_APP_URL).toBe("http://localhost:3000");
    expect(config.NODE_ENV).toBe("development");
    expect(config.NASA_API_KEY).toBe("DEMO_KEY");
    expect(config.HORIZONS_API_BASE_URL).toBe("https://ssd.jpl.nasa.gov/api/horizons.api");
    expect(config.SIMBAD_TAP_URL).toBe("https://simbad.cds.unistra.fr/simbad/sim-tap");
    expect(config.NEXT_PUBLIC_SUPABASE_URL).toBeUndefined();
    expect(config.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeUndefined();
    expect(config.SUPABASE_SERVICE_ROLE_KEY).toBeUndefined();
  });

  it("Scenario B: successfully validates production build environment without Supabase", () => {
    const config = getEnv({
      NODE_ENV: "production",
      NEXT_PUBLIC_APP_URL: "https://celestial.vercel.app",
    });
    expect(config.NODE_ENV).toBe("production");
    expect(config.NEXT_PUBLIC_APP_URL).toBe("https://celestial.vercel.app");
    expect(config.NEXT_PUBLIC_SUPABASE_URL).toBeUndefined();
  });

  it("Scenario C: resolves Vercel deployment URLs correctly with https:// prefix", () => {
    expect(resolveAppUrl({ VERCEL_URL: "celestial-preview.vercel.app" })).toBe(
      "https://celestial-preview.vercel.app"
    );
    expect(
      resolveAppUrl({ VERCEL_PROJECT_PRODUCTION_URL: "celestial.space" })
    ).toBe("https://celestial.space");
    expect(
      resolveAppUrl({ NEXT_PUBLIC_APP_URL: "https://custom-domain.org" })
    ).toBe("https://custom-domain.org");
  });

  it("Scenario D: sanitizes empty string environment variables to prevent invalid URL failures", () => {
    expect(cleanEnvValue("")).toBeUndefined();
    expect(cleanEnvValue("   ")).toBeUndefined();
    expect(cleanEnvValue("https://example.com")).toBe("https://example.com");

    const config = getEnv({
      NEXT_PUBLIC_APP_URL: "",
      NEXT_PUBLIC_SUPABASE_URL: "",
      HORIZONS_API_BASE_URL: "",
      SIMBAD_TAP_URL: "",
    });
    expect(config.NEXT_PUBLIC_APP_URL).toBe("http://localhost:3000");
    expect(config.HORIZONS_API_BASE_URL).toBe("https://ssd.jpl.nasa.gov/api/horizons.api");
    expect(config.SIMBAD_TAP_URL).toBe("https://simbad.cds.unistra.fr/simbad/sim-tap");
    expect(config.NEXT_PUBLIC_SUPABASE_URL).toBeUndefined();
  });

  it("Scenario E: fails with clear configuration error when invalid required URL is provided", () => {
    expect(() =>
      getEnv({
        NEXT_PUBLIC_APP_URL: "not-a-valid-url",
      })
    ).toThrowError(/Invalid environment configuration: NEXT_PUBLIC_APP_URL/);
  });

  it("Scenario F: fails with clear error when invalid Horizons API URL is provided", () => {
    expect(() =>
      getEnv({
        HORIZONS_API_BASE_URL: "invalid://url with spaces",
      })
    ).toThrowError(/Invalid environment configuration: HORIZONS_API_BASE_URL/);
  });

  it("Scenario G: fails with clear error when invalid SIMBAD URL is provided", () => {
    expect(() =>
      getEnv({
        SIMBAD_TAP_URL: "not-a-url",
      })
    ).toThrowError(/Invalid environment configuration: SIMBAD_TAP_URL/);
  });

  it("Scenario H: validates optional Supabase configuration when properly provided", () => {
    const config = getEnv({
      NEXT_PUBLIC_SUPABASE_URL: "https://my-project.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "my-anon-key-12345",
      SUPABASE_SERVICE_ROLE_KEY: "my-service-role-key-67890",
    });
    expect(config.NEXT_PUBLIC_SUPABASE_URL).toBe("https://my-project.supabase.co");
    expect(config.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe("my-anon-key-12345");
    expect(config.SUPABASE_SERVICE_ROLE_KEY).toBe("my-service-role-key-67890");
  });

  it("Scenario I: fails when invalid Supabase URL is explicitly provided", () => {
    expect(() =>
      getEnv({
        NEXT_PUBLIC_SUPABASE_URL: "invalid-supabase-url",
      })
    ).toThrowError(/Invalid environment configuration: NEXT_PUBLIC_SUPABASE_URL/);
  });

  it("Scenario J: getSupabaseClient returns null safely without throwing when unconfigured", () => {
    const client = getSupabaseClient();
    expect(client).toBeNull();
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
