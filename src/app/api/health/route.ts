import { NextResponse } from "next/server";
import { env } from "@/lib/config/env";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    appName: env.NEXT_PUBLIC_APP_NAME,
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    phase: "Phase 0 (Foundation & Architecture)",
  });
}
