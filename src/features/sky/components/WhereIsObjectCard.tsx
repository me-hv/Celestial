"use client";

import React from "react";
import Link from "next/link";
import { SkyObjectObservation } from "@/domain/observer/types";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface WhereIsObjectCardProps {
  observation: SkyObjectObservation;
  onFocusInSky?: () => void;
  className?: string;
}

export function WhereIsObjectCard({
  observation,
  onFocusInSky,
  className = "",
}: WhereIsObjectCardProps) {
  const {
    canonicalName,
    standardDesignation,
    horizontal,
    constellation,
    state,
    riseTransitSet,
    apparentMagnitudeV,
  } = observation;

  const isVisible = horizontal.isAboveHorizon;

  return (
    <div
      className={`p-5 rounded-2xl bg-celestial-surface/90 border border-celestial-muted/80 backdrop-blur-md shadow-xl space-y-4 font-mono ${className}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-celestial-muted/60 pb-3">
        <div>
          <div className="text-[10px] text-celestial-cyan uppercase font-bold tracking-wider">
            Where is this object right now?
          </div>
          <h3 className="text-base font-bold text-celestial-starlight">{canonicalName}</h3>
          {standardDesignation && (
            <div className="text-[11px] text-celestial-subtle">{standardDesignation}</div>
          )}
        </div>
        <Badge
          variant="outline"
          className={`text-[10px] uppercase font-bold ${
            isVisible
              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
              : "bg-red-500/10 border-red-500/40 text-red-400"
          }`}
        >
          {state.replace("_", " ")}
        </Badge>
      </div>

      {/* Sky Compass Target Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-celestial-void/80 border border-celestial-muted/50 text-center">
          <div className="text-[10px] text-celestial-subtle">Altitude</div>
          <div className={`text-sm font-bold ${isVisible ? "text-emerald-400" : "text-red-400"}`}>
            {horizontal.apparentAltitudeDeg > 0
              ? `+${horizontal.apparentAltitudeDeg}°`
              : `${horizontal.apparentAltitudeDeg}°`}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-celestial-void/80 border border-celestial-muted/50 text-center">
          <div className="text-[10px] text-celestial-subtle">Azimuth (Heading)</div>
          <div className="text-sm font-bold text-celestial-starlight">
            {horizontal.azimuthDeg}° ({getCompassDirection(horizontal.azimuthDeg)})
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-celestial-void/80 border border-celestial-muted/50 text-center">
          <div className="text-[10px] text-celestial-subtle">Constellation</div>
          <div className="text-sm font-bold text-celestial-cyan truncate">{constellation}</div>
        </div>

        <div className="p-2.5 rounded-xl bg-celestial-void/80 border border-celestial-muted/50 text-center">
          <div className="text-[10px] text-celestial-subtle">Apparent Mag</div>
          <div className="text-sm font-bold text-celestial-starlight">
            {apparentMagnitudeV !== undefined ? `${apparentMagnitudeV.toFixed(2)}` : "N/A"}
          </div>
        </div>
      </div>

      {/* Culmination / Schedule notice */}
      <div className="flex items-center justify-between p-2.5 rounded-lg bg-celestial-void/60 text-xs text-celestial-subtle">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-celestial-cyan" />
          Transit:{" "}
          {riseTransitSet.transitDate
            ? riseTransitSet.transitDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "—"}{" "}
          (Max: {riseTransitSet.transitAltitudeDeg}°)
        </span>
        {onFocusInSky ? (
          <Button
            onClick={onFocusInSky}
            variant="ghost"
            size="sm"
            className="h-7 text-xs font-mono text-celestial-cyan hover:bg-celestial-cyan/10"
          >
            Focus in Sky
          </Button>
        ) : (
          <Link href={`/sky?target=${observation.objectSlug}`}>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs font-mono text-celestial-cyan hover:bg-celestial-cyan/10"
            >
              Focus in Sky
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

function getCompassDirection(azimuthDeg: number): string {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const index = Math.round((azimuthDeg % 360) / 22.5) % 16;
  return directions[index];
}
