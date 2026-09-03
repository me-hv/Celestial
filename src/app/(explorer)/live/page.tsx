"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Radio, Telescope, Sun, Rocket, Activity, ArrowRight } from "lucide-react";
import { PRESET_OBSERVER_LOCATIONS } from "@/domain/observer/types";
import { SkyIntelligenceEngine } from "@/domain/sky-intelligence/sky-intelligence-engine";
import { spaceWeatherRepo } from "@/lib/data/space-weather-repository";
import { missionRepo } from "@/lib/data/mission-repository";
import { liveDataService } from "@/lib/live-data/live-data-service";
import { Badge } from "@/components/ui/badge";

export default function LiveCommandCenterPage() {
  const [observer] = useState(PRESET_OBSERVER_LOCATIONS[0]);
  const [date, setDate] = useState(new Date());

  const skySummary = SkyIntelligenceEngine.getCurrentSkySummary(observer, date);
  const sw = spaceWeatherRepo.getCurrent();
  const activeMissions = missionRepo.getActiveMissions();
  const healthList = liveDataService.getAllHealth();

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full min-h-screen bg-celestial-void text-celestial-starlight p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-celestial-muted/60 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="cyan" className="font-mono text-xs uppercase tracking-wider">
              <Radio className="w-3.5 h-3.5 mr-1 animate-pulse text-celestial-cyan" /> Real-Time
              Command Center
            </Badge>
            <span className="font-mono text-xs text-celestial-subtle">Phase 14</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            CELESTIAL Live Intelligence Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-celestial-subtle">
            Integrated real-time telemetry, space weather conditions, observer sky state, active
            exploration probes, and primary agency data streams.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-celestial-subtle">
          <span className="text-emerald-400 font-bold">● SYSTEM LIVE</span>
          <span>•</span>
          <span>{date.toLocaleTimeString()} UTC</span>
        </div>
      </div>

      {/* Main Command Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Current Sky Intelligence */}
        <div className="p-6 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/50 backdrop-blur-lg flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-celestial-cyan font-bold uppercase flex items-center gap-1.5">
                <Telescope className="w-4 h-4" /> Sky Observer State
              </span>
              <Badge variant="outline" className="text-[10px] font-mono">
                {skySummary.twilightPhase.replace("_", " ")}
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="text-xl font-bold font-mono">
                {skySummary.sunState === "ABOVE_HORIZON"
                  ? "Daylight Sky"
                  : "Dark Sky (Index: " + skySummary.skyDarknessScore + "/100)"}
              </div>
              <p className="text-xs text-celestial-subtle font-mono">
                Observer: {observer.name} ({observer.latitudeDeg.toFixed(1)}°N)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-celestial-muted/40 text-xs font-mono">
              <div>
                <span className="text-celestial-subtle text-[10px] uppercase block">
                  Moon Phase
                </span>
                <span className="text-celestial-starlight">
                  {skySummary.moonPhaseName} (
                  {(skySummary.moonIlluminationFraction * 100).toFixed(0)}%)
                </span>
              </div>
              <div>
                <span className="text-celestial-subtle text-[10px] uppercase block">
                  Top Target
                </span>
                <span className="text-celestial-cyan">
                  {skySummary.topTargetsRightNow[0]?.name || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/sky"
            className="inline-flex items-center justify-between px-3 py-2 rounded-xl bg-celestial-void/60 border border-celestial-muted/60 text-xs font-mono text-celestial-cyan hover:bg-celestial-surface transition"
          >
            <span>Open Interactive Sky Dome</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 2. Space Weather Snapshot */}
        <div className="p-6 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/50 backdrop-blur-lg flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-amber-400 font-bold uppercase flex items-center gap-1.5">
                <Sun className="w-4 h-4" /> Space Weather (NOAA)
              </span>
              <Badge variant="amber" className="text-[10px] font-mono">
                {sw.solarActivity}
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="text-xl font-bold font-mono">
                Geomagnetic Kp {sw.geomagnetic.kpIndex.toFixed(1)}
              </div>
              <p className="text-xs text-emerald-400 font-mono">
                Storm Scale: {sw.geomagnetic.stormScale.replace("_", " ")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-celestial-muted/40 text-xs font-mono">
              <div>
                <span className="text-celestial-subtle text-[10px] uppercase block">
                  Solar Wind Speed
                </span>
                <span className="text-celestial-starlight">
                  {sw.solarWind.speedKmS.toFixed(0)} km/s
                </span>
              </div>
              <div>
                <span className="text-celestial-subtle text-[10px] uppercase block">IMF Bz</span>
                <span className="text-celestial-starlight">
                  {sw.solarWind.imfBzNanotesla.toFixed(1)} nT
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/space-weather"
            className="inline-flex items-center justify-between px-3 py-2 rounded-xl bg-celestial-void/60 border border-celestial-muted/60 text-xs font-mono text-amber-400 hover:bg-celestial-surface transition"
          >
            <span>Space Weather Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3. Deep Space Missions Telemetry */}
        <div className="p-6 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/50 backdrop-blur-lg flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-violet-400 font-bold uppercase flex items-center gap-1.5">
                <Rocket className="w-4 h-4" /> Deep Space Fleet
              </span>
              <span className="font-mono text-xs text-celestial-subtle">
                {activeMissions.length} Active Probes
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono p-2 rounded-lg bg-celestial-void/60 border border-celestial-muted/40">
                <span className="font-bold text-celestial-starlight">Voyager 1</span>
                <span className="text-celestial-cyan">~165.2 AU (Interstellar)</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono p-2 rounded-lg bg-celestial-void/60 border border-celestial-muted/40">
                <span className="font-bold text-celestial-starlight">Voyager 2</span>
                <span className="text-celestial-cyan">~138.1 AU (Interstellar)</span>
              </div>
            </div>
          </div>

          <Link
            href="/missions"
            className="inline-flex items-center justify-between px-3 py-2 rounded-xl bg-celestial-void/60 border border-celestial-muted/60 text-xs font-mono text-violet-400 hover:bg-celestial-surface transition"
          >
            <span>Inspect All Missions & Trajectories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Primary Data Ingestion & Provider Health Matrix */}
      <div className="p-6 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/50 backdrop-blur-lg space-y-4">
        <h2 className="text-lg font-bold text-celestial-starlight flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          Scientific Data Provider Stream Health & Latency
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {healthList.map((h) => (
            <div
              key={h.sourceId}
              className="p-4 rounded-xl bg-celestial-void/60 border border-celestial-muted/60 space-y-2 font-mono text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-celestial-starlight truncate">{h.sourceName}</span>
                <Badge
                  variant={h.status === "LIVE" ? "cyan" : "outline"}
                  className="text-[9px] uppercase"
                >
                  {h.status.replace(/_/g, " ")}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-[11px] text-celestial-subtle pt-1 border-t border-celestial-muted/40">
                <span>
                  Latency: {h.responseLatencyMs ? `${h.responseLatencyMs} ms` : "N/A (Batch)"}
                </span>
                <span className="text-emerald-400">{h.currentFreshness}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
