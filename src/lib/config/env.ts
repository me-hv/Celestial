import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_NAME: z.string().default("CELESTIAL"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),

  // Supabase Configuration (Optional during local Phase 0 development)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // External Astronomy Data APIs
  NASA_API_KEY: z.string().default("DEMO_KEY"),
  HORIZONS_API_BASE_URL: z.string().url().default("https://ssd.jpl.nasa.gov/api/horizons.api"),
  SIMBAD_TAP_URL: z.string().url().default("https://simbad.cds.unistra.fr/simbad/sim-tap"),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validates environment variables safely at runtime
 */
export function getEnv(): Env {
  const parsed = envSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NASA_API_KEY: process.env.NASA_API_KEY,
    HORIZONS_API_BASE_URL: process.env.HORIZONS_API_BASE_URL,
    SIMBAD_TAP_URL: process.env.SIMBAD_TAP_URL,
  });

  if (!parsed.success) {
    console.error("❌ Invalid environment variables configuration:", parsed.error.format());
    throw new Error("Invalid environment configuration.");
  }

  return parsed.data;
}

export const env = getEnv();
