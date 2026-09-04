import { NextResponse } from "next/server";
import { env } from "@/lib/config/env";

export const dynamic = "force-dynamic";

export async function GET() {
  const isSupabaseConfigured = Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return NextResponse.json({
    status: "ok",
    appName: env.NEXT_PUBLIC_APP_NAME,
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    phase: "Phase 15 (Universal Temporal Intelligence & Event Reconstruction)",
    services: {
      horizonsApi: {
        status: "configured",
        endpoint: env.HORIZONS_API_BASE_URL,
      },
      simbadTap: {
        status: "configured",
        endpoint: env.SIMBAD_TAP_URL,
      },
      nasaApi: {
        status: env.NASA_API_KEY === "DEMO_KEY" ? "demo_key" : "configured",
      },
      database: {
        status: isSupabaseConfigured ? "configured" : "not_configured",
        required: false,
      },
    },
  });
}
