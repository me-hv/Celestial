"use client";

import React from "react";
import { ObserverLocation } from "@/domain/observer/types";
import { Play, Pause, RotateCcw, FastForward, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export type SkyViewMode = "3D_SPHERE" | "2D_PLANISPHERE" | "2D_EQUATORIAL";

export interface SkyControlsBarProps {
  location: ObserverLocation;
  onOpenLocationModal: () => void;
  date: Date;
  onDateChange: (date: Date) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  timeSpeed: number;
  onCycleTimeSpeed: () => void;
  onResetToNow: () => void;
  viewMode: SkyViewMode;
  onViewModeChange: (mode: SkyViewMode) => void;
  className?: string;
}

export function SkyControlsBar({
  location,
  onOpenLocationModal,
  date,
  onDateChange,
  isPlaying,
  onTogglePlay,
  timeSpeed,
  onCycleTimeSpeed,
  onResetToNow,
  viewMode,
  onViewModeChange,
  className = "",
}: SkyControlsBarProps) {
  const stepTime = (hoursDelta: number) => {
    const newDate = new Date(date.getTime() + hoursDelta * 3600000);
    onDateChange(newDate);
  };

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-celestial-surface/90 border border-celestial-muted/80 backdrop-blur-md shadow-xl ${className}`}
    >
      {/* 1. Observer Location Selector */}
      <div className="flex items-center gap-2">
        <Button
          onClick={onOpenLocationModal}
          variant="outline"
          size="sm"
          className="gap-2 font-mono text-xs text-celestial-starlight border-celestial-muted/80 hover:border-celestial-cyan hover:text-celestial-cyan"
        >
          <MapPin className="w-3.5 h-3.5 text-celestial-cyan" />
          <span className="max-w-[180px] sm:max-w-[240px] truncate">{location.name}</span>
        </Button>
      </div>

      {/* 2. Time Progression & Date Controls */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <Button
          onClick={onResetToNow}
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs font-mono text-celestial-subtle hover:text-celestial-cyan gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          Now
        </Button>

        <Button
          onClick={() => stepTime(-1)}
          variant="outline"
          size="sm"
          className="h-8 px-2 font-mono text-xs text-celestial-starlight border-celestial-muted/60"
        >
          -1h
        </Button>

        <Button
          onClick={onTogglePlay}
          variant="default"
          size="sm"
          className={`h-8 px-3 font-mono text-xs gap-1.5 ${
            isPlaying
              ? "bg-amber-500 hover:bg-amber-600 text-black"
              : "bg-celestial-cyan hover:bg-celestial-cyan/90 text-black"
          }`}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {isPlaying ? "Pause" : "Play"}
        </Button>

        <Button
          onClick={() => stepTime(1)}
          variant="outline"
          size="sm"
          className="h-8 px-2 font-mono text-xs text-celestial-starlight border-celestial-muted/60"
        >
          +1h
        </Button>

        <Button
          onClick={onCycleTimeSpeed}
          variant="outline"
          size="sm"
          className="h-8 px-2.5 font-mono text-xs text-celestial-starlight border-celestial-muted/60 gap-1"
        >
          <FastForward className="w-3.5 h-3.5 text-celestial-cyan" />
          {timeSpeed}x
        </Button>
      </div>

      {/* 3. View Mode Switcher */}
      <div className="flex items-center gap-1 bg-celestial-void p-1 rounded-xl border border-celestial-muted/60">
        <Button
          onClick={() => onViewModeChange("3D_SPHERE")}
          variant="ghost"
          size="sm"
          className={`h-7 px-2.5 text-xs font-mono rounded-lg ${
            viewMode === "3D_SPHERE"
              ? "bg-celestial-cyan text-celestial-void font-bold shadow"
              : "text-celestial-subtle hover:text-celestial-starlight"
          }`}
        >
          3D Sphere
        </Button>
        <Button
          onClick={() => onViewModeChange("2D_PLANISPHERE")}
          variant="ghost"
          size="sm"
          className={`h-7 px-2.5 text-xs font-mono rounded-lg ${
            viewMode === "2D_PLANISPHERE"
              ? "bg-celestial-cyan text-celestial-void font-bold shadow"
              : "text-celestial-subtle hover:text-celestial-starlight"
          }`}
        >
          All-Sky (2D)
        </Button>
        <Button
          onClick={() => onViewModeChange("2D_EQUATORIAL")}
          variant="ghost"
          size="sm"
          className={`h-7 px-2.5 text-xs font-mono rounded-lg ${
            viewMode === "2D_EQUATORIAL"
              ? "bg-celestial-cyan text-celestial-void font-bold shadow"
              : "text-celestial-subtle hover:text-celestial-starlight"
          }`}
        >
          Equatorial (2D)
        </Button>
      </div>
    </div>
  );
}
