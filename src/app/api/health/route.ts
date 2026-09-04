import { NextResponse } from "next/server";
import { getEnv } from "@/lib/config/env";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const config = getEnv();
    const isSupabaseConfigured = Boolean(
      config.NEXT_PUBLIC_SUPABASE_URL && config.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    return NextResponse.json({
      status: "ok",
      appName: config.NEXT_PUBLIC_APP_NAME,
      timestamp: new Date().toISOString(),
      environment: config.NODE_ENV,
      phase: "Phase 15 (Universal Temporal Intelligence & Event Reconstruction)",
      services: {
        horizonsApi: {
          status: "configured",
          endpoint: config.HORIZONS_API_BASE_URL,
        },
        simbadTap: {
          status: "configured",
          endpoint: config.SIMBAD_TAP_URL,
        },
        nasaApi: {
          status: config.NASA_API_KEY === "DEMO_KEY" ? "demo_key" : "configured",
        },
        database: {
          status: isSupabaseConfigured ? "configured" : "not_configured",
          required: false,
        },
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: "error",
        message: err instanceof Error ? err.message : "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
