"use client";

import React, { useMemo } from "react";
import { ObserverLocation } from "@/domain/observer/types";
import { calculateRiseTransitSet } from "@/lib/astronomy/coordinates/horizontal";
import { calculatePlanetaryEphemeris } from "@/lib/astronomy/ephemeris/planetary-ephemeris";
import { calculateLunarEphemeris } from "@/lib/astronomy/ephemeris/lunar-ephemeris";
import { Sun, Moon, Clock, ChevronLeft, ChevronRight, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SkyTimelineCardProps {
  location: ObserverLocation;
  date: Date;
  onDateChange: (newDate: Date) => void;
  className?: string;
}

export function SkyTimelineCard({
  location,
  date,
  onDateChange,
  className = "",
}: SkyTimelineCardProps) {
  // Compute Sun & Moon ephemerides and rise/transit/set events for the date
  const timelineEvents = useMemo(() => {
    const sunEphem = calculatePlanetaryEphemeris("sun", date);
    const sunRts = calculateRiseTransitSet(
      sunEphem.raDeg,
      sunEphem.decDeg,
      location.latitudeDeg,
      location.longitudeDeg,
      date,
      -0.8333 // Sun horizon with refraction
    );

    const lunarEphem = calculateLunarEphemeris(date);
    const moonRts = calculateRiseTransitSet(
      lunarEphem.raDeg,
      lunarEphem.decDeg,
      location.latitudeDeg,
      location.longitudeDeg,
      date,
      -0.8333 // Moon horizon with refraction
    );

    // Compute twilight thresholds (Civil -6°, Nautical -12°, Astronomical -18°)
    const civilDusk = calculateRiseTransitSet(
      sunEphem.raDeg,
      sunEphem.decDeg,
      location.latitudeDeg,
      location.longitudeDeg,
      date,
      -6.0
    );
    const nauticalDusk = calculateRiseTransitSet(
      sunEphem.raDeg,
      sunEphem.decDeg,
      location.latitudeDeg,
      location.longitudeDeg,
      date,
      -12.0
    );
    const astroDusk = calculateRiseTransitSet(
      sunEphem.raDeg,
      sunEphem.decDeg,
      location.latitudeDeg,
      location.longitudeDeg,
      date,
      -18.0
    );

    return {
      sunRts,
      moonRts,
      lunarEphem,
      civilDusk,
      nauticalDusk,
      astroDusk,
    };
  }, [location, date]);

  // Current time position in percentage across 24h day (0% at 00:00, 100% at 24:00)
  const currentHours = date.getHours() + date.getMinutes() / 60.0 + date.getSeconds() / 3600.0;
  const currentPercent = (currentHours / 24.0) * 100;

  const handleStepTime = (minutes: number) => {
    onDateChange(new Date(date.getTime() + minutes * 60 * 1000));
  };

  const handleScrubTimeline = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const fraction = clickX / rect.width;
    const targetHours = fraction * 24.0;

    const newDate = new Date(date);
    const hour = Math.floor(targetHours);
    const minute = Math.floor((targetHours - hour) * 60);
    newDate.setHours(hour, minute, 0, 0);
    onDateChange(newDate);
  };

  const formatTime = (d: Date | null | undefined) => {
    if (!d) return "—";
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className={`p-4 rounded-2xl bg-celestial-surface/90 border border-celestial-muted/80 backdrop-blur-md shadow-2xl space-y-4 font-mono ${className}`}
    >
      {/* Header with quick step controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-celestial-muted/70 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-celestial-cyan" />
          <span className="text-xs font-bold text-celestial-starlight uppercase tracking-wider">
            Night Observation Timeline (24h Astro-Clock)
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStepTime(-60)}
            className="h-7 px-2 text-[11px] font-mono text-celestial-subtle hover:text-celestial-starlight"
            title="Step back 1 hour"
          >
            <ChevronLeft className="w-3 h-3 mr-0.5" />
            -1h
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStepTime(-10)}
            className="h-7 px-2 text-[11px] font-mono text-celestial-subtle hover:text-celestial-starlight"
            title="Step back 10 minutes"
          >
            -10m
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDateChange(new Date())}
            className="h-7 px-2.5 text-[11px] font-mono bg-celestial-void text-celestial-cyan border border-celestial-cyan/30 hover:bg-celestial-cyan/10"
            title="Reset to live system clock"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Live Now
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStepTime(10)}
            className="h-7 px-2 text-[11px] font-mono text-celestial-subtle hover:text-celestial-starlight"
            title="Step forward 10 minutes"
          >
            +10m
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStepTime(60)}
            className="h-7 px-2 text-[11px] font-mono text-celestial-subtle hover:text-celestial-starlight"
            title="Step forward 1 hour"
          >
            +1h
            <ChevronRight className="w-3 h-3 ml-0.5" />
          </Button>
        </div>
      </div>

      {/* 24-Hour Visual Sky Light / Twilight Band */}
      <div className="space-y-1.5">
        <div
          onClick={handleScrubTimeline}
          className="relative w-full h-8 rounded-xl bg-gradient-to-r from-celestial-void via-blue-950/70 to-celestial-void border border-celestial-muted/80 cursor-pointer overflow-hidden group shadow-inner"
        >
          {/* Day & Twilight Shading Regions */}
          <div className="absolute inset-0 flex">
            <div className="w-[25%] bg-slate-950/90 border-r border-celestial-muted/30" />
            <div className="w-[25%] bg-amber-950/40 border-r border-celestial-muted/30" />
            <div className="w-[25%] bg-blue-950/60 border-r border-celestial-muted/30" />
            <div className="w-[25%] bg-slate-950/90" />
          </div>

          {/* Current Time Cursor Marker */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-celestial-cyan shadow-[0_0_8px_#38bdf8] z-10 transition-all pointer-events-none"
            style={{ left: `${currentPercent}%` }}
          >
            <div className="absolute -top-1 -left-1.5 w-4 h-2 rounded-full bg-celestial-cyan shadow-sm" />
          </div>
        </div>

        {/* 24h Axis Labels */}
        <div className="flex justify-between text-[9px] text-celestial-subtle font-mono px-1">
          <span>00:00</span>
          <span>04:00</span>
          <span>08:00</span>
          <span>12:00 (Noon)</span>
          <span>16:00</span>
          <span>20:00</span>
          <span>24:00</span>
        </div>
      </div>

      {/* Ephemeris Event Key Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {/* Sunrise */}
        <div className="p-2 rounded-xl bg-celestial-void/60 border border-celestial-muted/50 flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <div className="text-[10px] text-celestial-subtle">Sunrise</div>
            <div className="font-bold text-celestial-starlight">
              {formatTime(timelineEvents.sunRts.riseDate)}
            </div>
          </div>
        </div>

        {/* Sunset */}
        <div className="p-2 rounded-xl bg-celestial-void/60 border border-celestial-muted/50 flex items-center gap-2">
          <Sun className="w-4 h-4 text-orange-400 shrink-0" />
          <div>
            <div className="text-[10px] text-celestial-subtle">Sunset</div>
            <div className="font-bold text-celestial-starlight">
              {formatTime(timelineEvents.sunRts.setDate)}
            </div>
          </div>
        </div>

        {/* Moon Transit & Illumination */}
        <div className="p-2 rounded-xl bg-celestial-void/60 border border-celestial-muted/50 flex items-center gap-2">
          <Moon className="w-4 h-4 text-celestial-cyan shrink-0" />
          <div>
            <div className="text-[10px] text-celestial-subtle">
              Moon ({timelineEvents.lunarEphem.illuminationPercentage.toFixed(0)}%)
            </div>
            <div className="font-bold text-celestial-cyan">
              {timelineEvents.lunarEphem.phaseName}
            </div>
          </div>
        </div>

        {/* Astro Dark Window */}
        <div className="p-2 rounded-xl bg-celestial-void/60 border border-celestial-muted/50 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
          <div>
            <div className="text-[10px] text-celestial-subtle">Astro Dark</div>
            <div className="font-bold text-violet-300">
              {formatTime(timelineEvents.astroDusk.setDate)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
