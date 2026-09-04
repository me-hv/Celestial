import { z } from "zod";

/**
 * Strips whitespace, unwraps quotes, and normalizes placeholder/empty strings to undefined.
 * Handles cases where environment variables contain literal quotes ('"..."' or ''...'') from UI pastes.
 */
export function cleanEnvValue(value: string | undefined): string | undefined {
  if (value === undefined || value === null) return undefined;
  let trimmed = String(value).trim();

  // Strip leading and trailing quotes if present
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    trimmed = trimmed.slice(1, -1).trim();
  }

  // Treat common placeholders, empty strings, and stringified null/undefined as undefined
  if (
    trimmed === "" ||
    trimmed === "undefined" ||
    trimmed === "null" ||
    trimmed.toUpperCase() === "YOUR_URL" ||
    trimmed.toUpperCase() === "YOUR_APP_URL" ||
    trimmed.toUpperCase() === "YOUR_PROJECT_URL" ||
    trimmed.toUpperCase() === "YOUR_KEY" ||
    trimmed.toUpperCase() === "YOUR_API_KEY"
  ) {
    return undefined;
  }

  return trimmed;
}

/**
 * Cleans a URL value, unwrapping quotes and ensuring a valid http/https protocol prefix
 * if a valid hostname/domain was supplied without a protocol.
 */
export function cleanUrlValue(
  value: string | undefined,
  defaultProtocol: "http://" | "https://" = "https://"
): string | undefined {
  const cleaned = cleanEnvValue(value);
  if (!cleaned) return undefined;

  if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
    return cleaned;
  }

  if (cleaned.startsWith("localhost") || cleaned.startsWith("127.0.0.1")) {
    return `http://${cleaned}`;
  }

  // If provided as a domain (e.g., celestial.vercel.app or ssd.jpl.nasa.gov/...)
  return `${defaultProtocol}${cleaned}`;
}

/**
 * Resolves the application URL:
 * 1. Explicit NEXT_PUBLIC_APP_URL if provided
 * 2. Vercel deployment URL (VERCEL_PROJECT_PRODUCTION_URL or VERCEL_URL) if running on Vercel
 * 3. Default fallback to local development URL (http://localhost:3000)
 */
export function resolveAppUrl(envSource: Record<string, string | undefined> = process.env): string {
  const explicitUrl = cleanUrlValue(envSource.NEXT_PUBLIC_APP_URL, "https://");
  if (explicitUrl) {
    return explicitUrl;
  }

  const vercelProd = cleanUrlValue(envSource.VERCEL_PROJECT_PRODUCTION_URL, "https://");
  if (vercelProd) {
    return vercelProd;
  }

  const vercelUrl = cleanUrlValue(
    envSource.NEXT_PUBLIC_VERCEL_URL || envSource.VERCEL_URL,
    "https://"
  );
  if (vercelUrl) {
    return vercelUrl;
  }

  return "http://localhost:3000";
}

export function resolveHorizonsUrl(
  envSource: Record<string, string | undefined> = process.env
): string {
  const custom = cleanUrlValue(envSource.HORIZONS_API_BASE_URL, "https://");
  return custom || "https://ssd.jpl.nasa.gov/api/horizons.api";
}

export function resolveSimbadUrl(
  envSource: Record<string, string | undefined> = process.env
): string {
  const custom = cleanUrlValue(envSource.SIMBAD_TAP_URL, "https://");
  return custom || "https://simbad.cds.unistra.fr/simbad/sim-tap";
}

export function resolveSupabaseUrl(
  envSource: Record<string, string | undefined> = process.env
): string | undefined {
  return cleanUrlValue(envSource.NEXT_PUBLIC_SUPABASE_URL, "https://");
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
    NODE_ENV: cleanEnvValue(source.NODE_ENV) || "development",
    NEXT_PUBLIC_APP_NAME: cleanEnvValue(source.NEXT_PUBLIC_APP_NAME) || "CELESTIAL",
    NEXT_PUBLIC_APP_URL: resolveAppUrl(source),
    NEXT_PUBLIC_SUPABASE_URL: resolveSupabaseUrl(source),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: cleanEnvValue(source.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    SUPABASE_SERVICE_ROLE_KEY: cleanEnvValue(source.SUPABASE_SERVICE_ROLE_KEY),
    NASA_API_KEY: cleanEnvValue(source.NASA_API_KEY) || "DEMO_KEY",
    HORIZONS_API_BASE_URL: resolveHorizonsUrl(source),
    SIMBAD_TAP_URL: resolveSimbadUrl(source),
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
