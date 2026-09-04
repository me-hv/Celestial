import { z } from "zod";

/**
 * Strips whitespace and normalizes empty string environment variables to undefined.
 * This ensures empty string values in CI / Vercel do not fail optional or defaulted validations.
 */
export function cleanEnvValue(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

/**
 * Resolves the default application URL:
 * 1. Explicit NEXT_PUBLIC_APP_URL if provided
 * 2. Vercel deployment URL (VERCEL_PROJECT_PRODUCTION_URL or VERCEL_URL) if running on Vercel
 * 3. Default fallback to local development URL (http://localhost:3000)
 */
export function resolveAppUrl(envSource: Record<string, string | undefined> = process.env): string {
  const explicitUrl = cleanEnvValue(envSource.NEXT_PUBLIC_APP_URL);
  if (explicitUrl) {
    return explicitUrl;
  }

  const vercelProd = cleanEnvValue(envSource.VERCEL_PROJECT_PRODUCTION_URL);
  if (vercelProd) {
    return vercelProd.startsWith("http://") || vercelProd.startsWith("https://")
      ? vercelProd
      : `https://${vercelProd}`;
  }

  const vercelUrl = cleanEnvValue(envSource.NEXT_PUBLIC_VERCEL_URL || envSource.VERCEL_URL);
  if (vercelUrl) {
    return vercelUrl.startsWith("http://") || vercelUrl.startsWith("https://")
      ? vercelUrl
      : `https://${vercelUrl}`;
  }

  return "http://localhost:3000";
}

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("CELESTIAL"),
  NEXT_PUBLIC_APP_URL: z.string().url(),

  // Supabase Configuration (Strictly optional, not required for deployment)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  // External Astronomy Data APIs (Valid defaults provided)
  NASA_API_KEY: z.string().min(1).default("DEMO_KEY"),
  HORIZONS_API_BASE_URL: z.string().url().default("https://ssd.jpl.nasa.gov/api/horizons.api"),
  SIMBAD_TAP_URL: z.string().url().default("https://simbad.cds.unistra.fr/simbad/sim-tap"),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validates environment variables safely with sanitized inputs and descriptive error formatting.
 */
export function getEnv(customEnv?: Record<string, string | undefined>): Env {
  const source = customEnv || process.env;

  const raw = {
    NODE_ENV: cleanEnvValue(source.NODE_ENV),
    NEXT_PUBLIC_APP_NAME: cleanEnvValue(source.NEXT_PUBLIC_APP_NAME),
    NEXT_PUBLIC_APP_URL: resolveAppUrl(source),
    NEXT_PUBLIC_SUPABASE_URL: cleanEnvValue(source.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: cleanEnvValue(source.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    SUPABASE_SERVICE_ROLE_KEY: cleanEnvValue(source.SUPABASE_SERVICE_ROLE_KEY),
    NASA_API_KEY: cleanEnvValue(source.NASA_API_KEY),
    HORIZONS_API_BASE_URL: cleanEnvValue(source.HORIZONS_API_BASE_URL),
    SIMBAD_TAP_URL: cleanEnvValue(source.SIMBAD_TAP_URL),
  };

  const parsed = envSchema.safeParse(raw);

  if (!parsed.success) {
    const formattedError = parsed.error.format();
    const errorDetails = Object.entries(formattedError)
      .filter(([key]) => key !== "_errors")
      .map(([key, value]) => {
        const errors = (value as { _errors?: string[] })?._errors || [];
        return `${key}: ${errors.join(", ")}`;
      })
      .join("; ");

    console.error("❌ Invalid environment variables configuration:", formattedError);
    throw new Error(`Invalid environment configuration: ${errorDetails || "Validation failed."}`);
  }

  return parsed.data;
}

export const env = getEnv();
