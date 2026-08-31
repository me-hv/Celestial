"use client";

import React from "react";
import { AstronomicalEventsReport } from "@/lib/astronomy/events/astronomical-events";
import { Sun, Moon, Sparkles, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface AstronomicalEventsCardProps {
  report: AstronomicalEventsReport;
  className?: string;
}

export function AstronomicalEventsCard({ report, className = "" }: AstronomicalEventsCardProps) {
  const { solar, lunar, planets, location, date } = report;

  const formatTime = (d: Date | null) => {
    if (!d) return "—";
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className={`p-6 rounded-2xl bg-celestial-surface/90 border border-celestial-muted/80 backdrop-blur-md shadow-2xl space-y-6 font-mono ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-celestial-muted/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-celestial-cyan" />
            <h2 className="text-lg font-bold text-celestial-starlight uppercase">
              Astronomical Events & Twilight
            </h2>
          </div>
          <p className="text-xs text-celestial-subtle">
            Calculated for {location.name} on {date.toLocaleDateString()}
          </p>
        </div>
        <Badge variant="cyan" className="text-xs font-mono">
          {solar.nightDarknessHours}h True Darkness
        </Badge>
      </div>

      {/* 1. Solar Events & Twilight Schedule */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-celestial-cyan uppercase">
          <Sun className="w-4 h-4 text-amber-400" />
          Solar & Twilight Schedule
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-celestial-void/80 border border-celestial-muted/50">
            <div className="text-[10px] text-celestial-subtle">Sunrise / Sunset</div>
            <div className="text-sm font-bold text-amber-300">
              {formatTime(solar.sunrise)} / {formatTime(solar.sunset)}
            </div>
            <div className="text-[10px] text-celestial-subtle">Day: {solar.dayLengthHours}h</div>
          </div>
          <div className="p-3 rounded-xl bg-celestial-void/80 border border-celestial-muted/50">
            <div className="text-[10px] text-celestial-subtle">Civil Twilight (6°)</div>
            <div className="text-sm font-bold text-celestial-starlight">
              {formatTime(solar.civilDawn)} – {formatTime(solar.civilDusk)}
            </div>
            <div className="text-[10px] text-celestial-subtle">Horizon visible</div>
          </div>
          <div className="p-3 rounded-xl bg-celestial-void/80 border border-celestial-muted/50">
            <div className="text-[10px] text-celestial-subtle">Nautical Twilight (12°)</div>
            <div className="text-sm font-bold text-celestial-starlight">
              {formatTime(solar.nauticalDawn)} – {formatTime(solar.nauticalDusk)}
            </div>
            <div className="text-[10px] text-celestial-subtle">Navigational stars</div>
          </div>
          <div className="p-3 rounded-xl bg-celestial-void/80 border border-celestial-muted/50">
            <div className="text-[10px] text-celestial-subtle">Astronomical Twilight (18°)</div>
            <div className="text-sm font-bold text-celestial-cyan">
              {formatTime(solar.astronomicalDawn)} – {formatTime(solar.astronomicalDusk)}
            </div>
            <div className="text-[10px] text-celestial-subtle">Deep sky dark sky</div>
          </div>
        </div>
      </div>

      {/* 2. Lunar Ephemeris & Phase */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-celestial-violet uppercase">
          <Moon className="w-4 h-4 text-celestial-violet" />
          Lunar Ephemeris & Phase
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className="p-3.5 rounded-xl bg-celestial-void/80 border border-celestial-muted/50 space-y-1">
            <div className="text-[10px] text-celestial-subtle">Current Phase</div>
            <div className="text-sm font-bold text-celestial-violet">{lunar.phaseDisplayName}</div>
            <div className="text-xs text-celestial-starlight">
              Illumination:{" "}
              <span className="font-bold text-celestial-cyan">{lunar.illuminationPercentage}%</span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-celestial-void/80 border border-celestial-muted/50 space-y-1">
            <div className="text-[10px] text-celestial-subtle">Moon Schedule</div>
            <div className="text-xs text-celestial-starlight">
              Rise: <span className="font-bold">{formatTime(lunar.moonrise)}</span> · Set:{" "}
              <span className="font-bold">{formatTime(lunar.moonset)}</span>
            </div>
            <div className="text-[10px] text-celestial-subtle">
              Transit: {formatTime(lunar.moonTransit)}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-celestial-void/80 border border-celestial-muted/50 space-y-1">
            <div className="text-[10px] text-celestial-subtle">Next Major Phase</div>
            <div className="text-sm font-bold text-celestial-starlight">
              {lunar.nextMajorPhase.name}
            </div>
            <div className="text-[10px] text-celestial-cyan">
              In {lunar.nextMajorPhase.daysUntil} days
            </div>
          </div>
        </div>
      </div>

      {/* 3. Visible Planets Tonight */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-celestial-starlight uppercase">
          <Layers className="w-4 h-4 text-celestial-cyan" />
          Planetary Visibility Schedule
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
          {planets.map((p) => (
            <div
              key={p.planetSlug}
              className={`p-3 rounded-xl border ${
                p.isVisibleTonight
                  ? "bg-celestial-void/90 border-celestial-muted/70"
                  : "bg-celestial-void/40 border-celestial-muted/30 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-celestial-starlight">{p.planetName}</span>
                <Badge
                  variant="outline"
                  className="text-[10px] py-0 border-celestial-muted font-mono"
                >
                  {p.apparentMagnitudeV.toFixed(1)} mag
                </Badge>
              </div>
              <div className="text-[11px] text-celestial-subtle mt-1.5 space-y-0.5">
                <div>
                  Rise: {formatTime(p.riseDate)} · Set: {formatTime(p.setDate)}
                </div>
                <div>
                  Transit: {formatTime(p.transitDate)} (Max Alt: {p.transitAltitudeDeg}°)
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
