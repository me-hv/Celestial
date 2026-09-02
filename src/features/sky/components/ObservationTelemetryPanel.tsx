"use client";

import React from "react";
import Link from "next/link";
import { SkyObjectObservation } from "@/domain/observer/types";
import {
  Compass,
  Clock,
  ExternalLink,
  ShieldCheck,
  Globe,
  Crosshair,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { calculateAirmass } from "@/lib/astronomy/observation/visibility";

export interface ObservationTelemetryPanelProps {
  observation: SkyObjectObservation | null;
  isTracked?: boolean;
  onToggleTrack?: () => void;
  onFocusCamera?: () => void;
  className?: string;
}

export function ObservationTelemetryPanel({
  observation,
  isTracked = false,
  onToggleTrack,
  onFocusCamera,
  className = "",
}: ObservationTelemetryPanelProps) {
  if (!observation) {
    return (
      <div
        className={`p-6 rounded-2xl bg-celestial-surface/85 border border-celestial-muted/80 backdrop-blur-md text-center space-y-3 font-mono ${className}`}
      >
        <Compass className="w-8 h-8 text-celestial-cyan/60 mx-auto animate-pulse" />
        <div className="text-sm font-semibold text-celestial-starlight">No Sky Object Selected</div>
        <p className="text-xs text-celestial-subtle max-w-xs mx-auto">
          Click any star, planet, or deep-sky object in the sky map or search bar to inspect live
          observational telemetry.
        </p>
      </div>
    );
  }

  const {
    canonicalName,
    standardDesignation,
    type,
    category,
    apparentMagnitudeV,
    spectralClass,
    horizontal,
    constellation,
    state,
    riseTransitSet,
    distanceLy,
    provenance,
    objectSlug,
    raDeg,
    decDeg,
    galacticLongDeg,
    galacticLatDeg,
  } = observation;

  const isAboveHorizon = horizontal.isAboveHorizon;
  const airmass = isAboveHorizon ? calculateAirmass(horizontal.apparentAltitudeDeg) : null;

  // Observation Quality Heuristic Classification
  let qualityLabel = "NOT_VISIBLE";
  let qualityBadgeVariant: "cyan" | "amber" | "violet" | "outline" = "outline";
  if (!isAboveHorizon) {
    qualityLabel = "BELOW_HORIZON";
    qualityBadgeVariant = "outline";
  } else if (horizontal.apparentAltitudeDeg >= 45) {
    qualityLabel = "EXCELLENT";
    qualityBadgeVariant = "cyan";
  } else if (horizontal.apparentAltitudeDeg >= 30) {
    qualityLabel = "GOOD";
    qualityBadgeVariant = "cyan";
  } else if (horizontal.apparentAltitudeDeg >= 15) {
    qualityLabel = "FAIR";
    qualityBadgeVariant = "amber";
  } else {
    qualityLabel = "LOW_HORIZON";
    qualityBadgeVariant = "violet";
  }

  // Determine canonical profile route
  let profileUrl = `/objects/${objectSlug}`;
  if (type === "STAR") {
    profileUrl = `/stars/${objectSlug}`;
  } else if (
    category === "DEEP_SKY" ||
    type === "GALAXY" ||
    type === "NEBULA" ||
    type === "PLANETARY_NEBULA" ||
    type === "SUPERNOVA_REMNANT"
  ) {
    profileUrl = `/deep-sky/${objectSlug}`;
  }

  return (
    <div
      className={`p-5 rounded-2xl bg-celestial-surface/90 border border-celestial-muted/80 backdrop-blur-md shadow-2xl space-y-5 font-mono ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-celestial-muted/70 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-bold text-celestial-starlight">{canonicalName}</h3>
            <Badge
              variant="outline"
              className={`text-[10px] uppercase font-bold py-0.5 border ${
                state === "ABOVE_HORIZON" || state === "CULMINATING"
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                  : "bg-red-500/10 border-red-500/40 text-red-400"
              }`}
            >
              {state.replace("_", " ")}
            </Badge>
          </div>
          {standardDesignation && (
            <div className="text-xs text-celestial-subtle font-mono">{standardDesignation}</div>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge variant="cyan" className="text-[10px] uppercase tracking-wider">
            {type}
          </Badge>
          <Badge variant={qualityBadgeVariant} className="text-[9px] uppercase tracking-wider">
            {qualityLabel}
          </Badge>
        </div>
      </div>

      {/* Target Tracking & Quick Focus Action */}
      <div className="flex items-center gap-2">
        {onToggleTrack && (
          <Button
            onClick={onToggleTrack}
            variant={isTracked ? "cyan" : "outline"}
            size="sm"
            className="flex-1 gap-1.5 font-mono text-xs"
          >
            <Crosshair className={`w-3.5 h-3.5 ${isTracked ? "animate-spin" : ""}`} />
            {isTracked ? "Tracking Active" : "Track Object"}
          </Button>
        )}
        {onFocusCamera && (
          <Button
            onClick={onFocusCamera}
            variant="outline"
            size="sm"
            className="gap-1.5 font-mono text-xs border-celestial-muted/70 text-celestial-starlight"
            title="Focus camera onto this object"
          >
            <Compass className="w-3.5 h-3.5 text-celestial-cyan" />
            Center
          </Button>
        )}
      </div>

      {/* 1. Live Horizontal Sky Coordinates */}
      <div className="space-y-2">
        <div className="text-[11px] text-celestial-subtle uppercase tracking-wider flex items-center gap-1.5 font-semibold">
          <Compass className="w-3.5 h-3.5 text-celestial-cyan" />
          Observer Coordinates (Alt / Az)
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-celestial-void/80 border border-celestial-muted/50">
            <div className="text-[10px] text-celestial-subtle">Apparent Altitude</div>
            <div className="text-sm font-bold text-celestial-starlight">
              {horizontal.apparentAltitudeDeg > 0
                ? `+${horizontal.apparentAltitudeDeg}°`
                : `${horizontal.apparentAltitudeDeg}°`}
            </div>
            <div className="text-[10px] text-celestial-subtle">
              {airmass
                ? `Airmass: X = ${airmass.toFixed(2)}`
                : "True: " + horizontal.altitudeDeg + "°"}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-celestial-void/80 border border-celestial-muted/50">
            <div className="text-[10px] text-celestial-subtle">Azimuth (Bearing)</div>
            <div className="text-sm font-bold text-celestial-starlight">
              {horizontal.azimuthDeg}°
            </div>
            <div className="text-[10px] text-celestial-subtle">
              HA: {horizontal.hourAngleHours.toFixed(2)}h
            </div>
          </div>
        </div>
      </div>

      {/* 2. Astrometric (ICRS J2000) & Galactic Coordinates */}
      <div className="space-y-2">
        <div className="text-[11px] text-celestial-subtle uppercase tracking-wider flex items-center gap-1.5 font-semibold">
          <Globe className="w-3.5 h-3.5 text-celestial-violet" />
          Astrometric (ICRS) & Galactic
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-lg bg-celestial-void/60 border border-celestial-muted/40">
            <div className="text-[10px] text-celestial-subtle">Right Ascension</div>
            <div className="font-semibold text-celestial-starlight">
              {raDeg.toFixed(4)}° ({(raDeg / 15).toFixed(2)}h)
            </div>
          </div>
          <div className="p-2 rounded-lg bg-celestial-void/60 border border-celestial-muted/40">
            <div className="text-[10px] text-celestial-subtle">Declination</div>
            <div className="font-semibold text-celestial-starlight">
              {decDeg > 0 ? `+${decDeg.toFixed(4)}°` : `${decDeg.toFixed(4)}°`}
            </div>
          </div>
          {galacticLongDeg !== undefined && (
            <div className="p-2 rounded-lg bg-celestial-void/60 border border-celestial-muted/40 col-span-2">
              <div className="text-[10px] text-celestial-subtle">Galactic Coordinates (l, b)</div>
              <div className="font-semibold text-celestial-starlight">
                l = {galacticLongDeg.toFixed(2)}°, b = {galacticLatDeg?.toFixed(2)}°
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Physical & Observational Properties */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 rounded-lg bg-celestial-void/60 border border-celestial-muted/40">
          <div className="text-[10px] text-celestial-subtle">Apparent Magnitude</div>
          <div className="font-bold text-celestial-starlight">
            {apparentMagnitudeV !== undefined ? `${apparentMagnitudeV.toFixed(2)} mag` : "N/A"}
          </div>
        </div>
        <div className="p-2 rounded-lg bg-celestial-void/60 border border-celestial-muted/40">
          <div className="text-[10px] text-celestial-subtle">Constellation</div>
          <div className="font-bold text-celestial-cyan">{constellation}</div>
        </div>
        {spectralClass && (
          <div className="p-2 rounded-lg bg-celestial-void/60 border border-celestial-muted/40">
            <div className="text-[10px] text-celestial-subtle">Spectral Class</div>
            <div className="font-semibold text-celestial-starlight">{spectralClass}</div>
          </div>
        )}
        {distanceLy !== undefined && (
          <div className="p-2 rounded-lg bg-celestial-void/60 border border-celestial-muted/40">
            <div className="text-[10px] text-celestial-subtle">Distance</div>
            <div className="font-semibold text-celestial-starlight">
              {distanceLy < 0.01
                ? `${(distanceLy * 9.461e12).toLocaleString()} km`
                : `${distanceLy.toLocaleString()} ly`}
            </div>
          </div>
        )}
      </div>

      {/* 4. Rise, Transit & Set Schedule */}
      <div className="p-3 rounded-xl bg-celestial-void/80 border border-celestial-muted/60 space-y-2 text-xs">
        <div className="text-[10px] text-celestial-subtle uppercase font-semibold flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-celestial-cyan" />
          Daily Ephemeris Schedule
        </div>
        <div className="grid grid-cols-3 gap-1 text-center">
          <div>
            <div className="text-[10px] text-celestial-subtle">Rise</div>
            <div className="font-bold text-celestial-starlight">
              {riseTransitSet.riseDate
                ? riseTransitSet.riseDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-celestial-subtle">
              Transit ({riseTransitSet.transitAltitudeDeg}°)
            </div>
            <div className="font-bold text-celestial-cyan">
              {riseTransitSet.transitDate
                ? riseTransitSet.transitDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-celestial-subtle">Set</div>
            <div className="font-bold text-celestial-starlight">
              {riseTransitSet.setDate
                ? riseTransitSet.setDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Epistemic Status & Provenance */}
      <div className="space-y-3 pt-1 border-t border-celestial-muted/60">
        <div className="flex items-center justify-between text-[10px] text-celestial-subtle">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            {provenance.authoritativeBody} ({provenance.catalogName})
          </span>
          <span>Confidence: {(provenance.confidenceScore * 100).toFixed(0)}%</span>
        </div>

        {/* Cross-Scale Navigation Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <Link href={profileUrl} className="w-full">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1.5 font-mono text-xs text-celestial-starlight border-celestial-cyan/40 hover:bg-celestial-cyan/10 hover:text-celestial-cyan"
            >
              <ExternalLink className="w-3 h-3" />
              Object Profile
            </Button>
          </Link>

          {type === "PLANET" || type === "MOON" ? (
            <Link href={`/explore?system=solar-system&target=${objectSlug}`} className="w-full">
              <Button variant="cyan" size="sm" className="w-full gap-1.5 font-mono text-xs">
                <Compass className="w-3 h-3" />
                Solar System 3D
              </Button>
            </Link>
          ) : type === "STAR" ? (
            <Link href={`/stars/${objectSlug}`} className="w-full">
              <Button variant="cyan" size="sm" className="w-full gap-1.5 font-mono text-xs">
                <Sparkles className="w-3 h-3" />
                Star Catalog
              </Button>
            </Link>
          ) : (
            <Link href={`/deep-sky/${objectSlug}`} className="w-full">
              <Button variant="cyan" size="sm" className="w-full gap-1.5 font-mono text-xs">
                <Globe className="w-3 h-3" />
                Deep Sky Atlas
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default ObservationTelemetryPanel;
