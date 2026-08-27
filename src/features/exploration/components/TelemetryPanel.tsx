"use client";

import React from "react";
import Link from "next/link";
import {
  X,
  Crosshair,
  ExternalLink,
  ShieldCheck,
  Thermometer,
  Weight,
  Maximize2,
  Orbit,
  ArrowRight,
} from "lucide-react";
import { CelestialObject } from "@/domain/celestial-object/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatScientificMass, formatTemperature, formatDistance } from "@/lib/utils/formatters";

export interface TelemetryPanelProps {
  object: CelestialObject | null;
  onClose: () => void;
  onFocusCamera?: (object: CelestialObject) => void;
}

export function TelemetryPanel({ object, onClose, onFocusCamera }: TelemetryPanelProps) {
  if (!object) return null;

  const isStar = object.classification.code === "STAR";
  const badgeVariant =
    object.classification.category === "PLANETARY"
      ? "cyan"
      : object.classification.category === "STELLAR"
        ? "amber"
        : object.classification.category === "SATELLITE"
          ? "violet"
          : "default";

  return (
    <aside
      aria-label="Celestial Object Telemetry"
      className="absolute top-4 right-4 bottom-4 w-80 sm:w-96 flex flex-col rounded-2xl border border-celestial-muted/80 bg-celestial-surface/90 backdrop-blur-xl shadow-2xl z-30 text-celestial-starlight overflow-hidden animate-in fade-in slide-in-from-right-4 duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between p-5 border-b border-celestial-muted/70 bg-celestial-deep/50">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-mono tracking-tight text-celestial-starlight">
              {object.canonicalName.toUpperCase()}
            </h2>
            <Badge variant={badgeVariant}>{object.classification.code.replace(/_/g, " ")}</Badge>
          </div>
          {object.standardDesignation && (
            <p className="text-xs font-mono text-celestial-subtle">{object.standardDesignation}</p>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label="Close telemetry panel"
          className="p-1.5 rounded-lg text-celestial-subtle hover:text-celestial-starlight hover:bg-celestial-muted/60 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-celestial-muted/50 bg-celestial-void/40">
        {onFocusCamera && (
          <Button
            variant="cyan"
            size="sm"
            onClick={() => onFocusCamera(object)}
            className="flex-1 gap-1.5 text-xs"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Focus Camera</span>
          </Button>
        )}
        <Link href={`/objects/${object.slug}`} className="flex-1">
          <Button variant="secondary" size="sm" className="w-full gap-1.5 text-xs">
            <span>Full Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* Scrollable Telemetry Metrics */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm">
        {/* Summary Description */}
        {object.summary && (
          <p className="text-xs text-celestial-subtle leading-relaxed">{object.summary}</p>
        )}

        {/* Physical Metrics Grid */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-celestial-subtle">
            Physical Telemetry
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            {/* Mass */}
            <div className="p-2.5 rounded-lg bg-celestial-deep/60 border border-celestial-muted/50">
              <div className="flex items-center gap-1.5 text-celestial-subtle text-xs mb-1">
                <Weight className="w-3.5 h-3.5 text-celestial-cyan" />
                <span>Mass</span>
              </div>
              <span className="font-mono text-xs font-semibold">
                {formatScientificMass(object.physical.massKg)}
              </span>
              {object.physical.massEarth && !isStar && (
                <div className="text-[10px] text-celestial-subtle font-mono">
                  {object.physical.massEarth} M⊕
                </div>
              )}
            </div>

            {/* Mean Radius */}
            <div className="p-2.5 rounded-lg bg-celestial-deep/60 border border-celestial-muted/50">
              <div className="flex items-center gap-1.5 text-celestial-subtle text-xs mb-1">
                <Maximize2 className="w-3.5 h-3.5 text-celestial-amber" />
                <span>Mean Radius</span>
              </div>
              <span className="font-mono text-xs font-semibold">
                {object.physical.meanRadiusKm?.toLocaleString()} km
              </span>
            </div>

            {/* Surface Gravity */}
            <div className="p-2.5 rounded-lg bg-celestial-deep/60 border border-celestial-muted/50">
              <div className="flex items-center gap-1.5 text-celestial-subtle text-xs mb-1">
                <Orbit className="w-3.5 h-3.5 text-celestial-violet" />
                <span>Gravity</span>
              </div>
              <span className="font-mono text-xs font-semibold">
                {object.physical.surfaceGravityMs2} m/s²
              </span>
            </div>

            {/* Mean Temperature */}
            <div className="p-2.5 rounded-lg bg-celestial-deep/60 border border-celestial-muted/50">
              <div className="flex items-center gap-1.5 text-celestial-subtle text-xs mb-1">
                <Thermometer className="w-3.5 h-3.5 text-celestial-emerald" />
                <span>Mean Temp</span>
              </div>
              <span className="font-mono text-xs font-semibold">
                {formatTemperature(object.physical.meanTemperatureK)}
              </span>
            </div>
          </div>
        </div>

        {/* Orbital Mechanics (if available) */}
        {object.orbital && (
          <div className="space-y-2.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-celestial-subtle">
              Orbital Parameters (Keplerian)
            </span>
            <div className="space-y-1.5 p-3 rounded-lg bg-celestial-deep/60 border border-celestial-muted/50 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-celestial-subtle">Semi-Major Axis:</span>
                <span className="font-semibold text-celestial-starlight">
                  {formatDistance(
                    object.orbital.semiMajorAxisKm,
                    undefined,
                    object.orbital.semiMajorAxisAu
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-celestial-subtle">Eccentricity:</span>
                <span className="font-semibold text-celestial-starlight">
                  {object.orbital.eccentricity}
                </span>
              </div>
              {object.orbital.orbitalPeriodDays && (
                <div className="flex justify-between">
                  <span className="text-celestial-subtle">Orbital Period:</span>
                  <span className="font-semibold text-celestial-starlight">
                    {object.orbital.orbitalPeriodDays >= 365.25
                      ? `${(object.orbital.orbitalPeriodDays / 365.256).toFixed(2)} yr`
                      : `${object.orbital.orbitalPeriodDays} d`}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-celestial-subtle">Inclination:</span>
                <span className="font-semibold text-celestial-starlight">
                  {object.orbital.inclinationDeg}°
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Atmospheric Composition */}
        {object.physical.atmosphereComposition &&
          object.physical.atmosphereComposition.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-celestial-subtle">
                Atmosphere Profile
              </span>
              <div className="space-y-1.5">
                {object.physical.atmosphereComposition.map((gas) => (
                  <div key={gas.molecule} className="space-y-0.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span>{gas.molecule}</span>
                      <span className="text-celestial-subtle">{gas.percentage}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-celestial-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-celestial-cyan rounded-full"
                        style={{ width: `${gas.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Scientific Provenance Citation Card */}
        <div className="p-3 rounded-lg border border-celestial-cyan/20 bg-celestial-cyan/5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-celestial-cyan text-xs font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Scientific Provenance</span>
          </div>
          <p className="text-[11px] text-celestial-subtle">
            Source: {object.provenance.catalogName} ({object.provenance.authoritativeBody})
          </p>
          {object.provenance.citationUrl && (
            <a
              href={object.provenance.citationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] text-celestial-cyan hover:underline font-mono"
            >
              <span>Verify at NASA JPL SSD</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
      </div>
    </aside>
  );
}
