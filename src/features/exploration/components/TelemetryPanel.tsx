"use client";

import React from "react";
import Link from "next/link";
import {
  X,
  Crosshair,
  ExternalLink,
  ShieldCheck,
  Weight,
  Orbit,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { CelestialObject } from "@/domain/celestial-object/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
        : "violet";

  const unc = object.physical.measurementsWithUncertainty;

  return (
    <aside
      aria-label="Celestial Telemetry Details"
      className="absolute top-20 right-4 z-30 w-full max-w-sm rounded-2xl border border-celestial-muted bg-celestial-surface/90 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-celestial-muted/80 bg-celestial-deep/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-mono text-celestial-starlight tracking-tight">
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
          className="p-1 rounded-lg text-celestial-subtle hover:text-celestial-starlight hover:bg-celestial-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Body */}
      <div className="p-4 space-y-4 max-h-[calc(100vh-14rem)] overflow-y-auto font-sans text-xs scrollbar-thin">
        {/* Summary */}
        {object.summary && (
          <p className="text-celestial-subtle leading-relaxed border-b border-celestial-muted/50 pb-3">
            {object.summary}
          </p>
        )}

        {/* Discovery Info (Exoplanets) */}
        {object.discovery && (
          <div className="p-3 rounded-lg border border-celestial-cyan/20 bg-celestial-cyan/5 space-y-1.5 font-mono">
            <div className="flex items-center gap-1.5 text-celestial-cyan font-semibold text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Discovery Context</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              {object.discovery.year && (
                <div>
                  <span className="text-celestial-subtle">Year: </span>
                  <span className="text-celestial-starlight">{object.discovery.year}</span>
                </div>
              )}
              {object.discovery.method && (
                <div>
                  <span className="text-celestial-subtle">Method: </span>
                  <span className="text-celestial-starlight">{object.discovery.method}</span>
                </div>
              )}
              {object.discovery.facility && (
                <div className="col-span-2 pt-0.5">
                  <span className="text-celestial-subtle">Facility: </span>
                  <span className="text-celestial-starlight">{object.discovery.facility}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Physical Characteristics */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-celestial-cyan font-mono font-semibold text-xs">
            <Weight className="w-3.5 h-3.5" />
            <span>Physical Characteristics</span>
          </div>
          <div className="grid grid-cols-2 gap-2 bg-celestial-deep/40 p-2.5 rounded-lg border border-celestial-muted/40 font-mono">
            {/* Mass */}
            <div>
              <span className="text-[10px] text-celestial-subtle block">Mass</span>
              <span className="font-semibold text-celestial-starlight">
                {object.physical.massEarth ? (
                  <>
                    {object.physical.massEarth} M⊕
                    {unc?.massEarth?.uncertainty && (
                      <span className="text-[9px] text-celestial-subtle block font-normal">
                        ±{unc.massEarth.uncertainty.upper}
                      </span>
                    )}
                  </>
                ) : object.physical.massSolar ? (
                  `${object.physical.massSolar} M☉`
                ) : (
                  formatScientificMass(object.physical.massKg)
                )}
              </span>
            </div>

            {/* Radius */}
            <div>
              <span className="text-[10px] text-celestial-subtle block">Radius</span>
              <span className="font-semibold text-celestial-starlight">
                {object.physical.radiusEarth ? (
                  <>
                    {object.physical.radiusEarth} R⊕
                    {unc?.radiusEarth?.uncertainty && (
                      <span className="text-[9px] text-celestial-subtle block font-normal">
                        ±{unc.radiusEarth.uncertainty.upper}
                      </span>
                    )}
                  </>
                ) : object.physical.radiusSolar ? (
                  `${object.physical.radiusSolar} R☉`
                ) : (
                  `${object.physical.meanRadiusKm?.toLocaleString()} km`
                )}
              </span>
            </div>

            {/* Temperature */}
            {(object.physical.effectiveTemperatureK || object.physical.meanTemperatureK) && (
              <div>
                <span className="text-[10px] text-celestial-subtle block">
                  {isStar ? "T_eff" : "Mean Temp"}
                </span>
                <span className="font-semibold text-celestial-starlight">
                  {formatTemperature(
                    object.physical.effectiveTemperatureK || object.physical.meanTemperatureK
                  )}
                </span>
              </div>
            )}

            {/* Gravity or Distance */}
            <div>
              <span className="text-[10px] text-celestial-subtle block">
                {object.positional.distanceLightYears !== undefined && !isStar
                  ? "Distance (Earth)"
                  : "Gravity"}
              </span>
              <span className="font-semibold text-celestial-starlight">
                {object.positional.distanceLightYears !== undefined && !isStar
                  ? `${object.positional.distanceLightYears.toFixed(2)} ly`
                  : object.physical.surfaceGravityMs2
                    ? `${object.physical.surfaceGravityMs2} m/s²`
                    : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Orbital Characteristics */}
        {object.orbital && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-celestial-amber font-mono font-semibold text-xs">
              <Orbit className="w-3.5 h-3.5" />
              <span>Orbital Mechanics</span>
            </div>
            <div className="grid grid-cols-2 gap-2 bg-celestial-deep/40 p-2.5 rounded-lg border border-celestial-muted/40 font-mono">
              <div>
                <span className="text-[10px] text-celestial-subtle block">Semi-Major Axis</span>
                <span className="font-semibold text-celestial-starlight">
                  {formatDistance(undefined, undefined, object.orbital.semiMajorAxisAu)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-celestial-subtle block">Eccentricity</span>
                <span className="font-semibold text-celestial-starlight">
                  {object.orbital.eccentricity ?? "0.00"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-celestial-subtle block">Period</span>
                <span className="font-semibold text-celestial-starlight">
                  {object.orbital.orbitalPeriodDays
                    ? `${object.orbital.orbitalPeriodDays.toFixed(2)} d`
                    : "—"}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-celestial-subtle block">Inclination</span>
                <span className="font-semibold text-celestial-starlight">
                  {object.orbital.inclinationDeg !== undefined
                    ? `${object.orbital.inclinationDeg}°`
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Provenance Citation */}
        <div className="p-2.5 rounded-lg border border-celestial-muted/50 bg-celestial-deep/70 space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1 text-celestial-cyan font-mono font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{object.provenance.authoritativeBody} Provenance</span>
            </div>
            <span className="font-mono text-[10px] text-celestial-subtle">
              Conf: {(object.provenance.confidenceScore * 100).toFixed(0)}%
            </span>
          </div>
          <p className="text-[10px] text-celestial-subtle font-mono truncate">
            {object.provenance.catalogName}
          </p>
          {object.provenance.citationUrl && (
            <a
              href={object.provenance.citationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] text-celestial-cyan hover:underline font-mono pt-1"
            >
              <span>Source Catalog Data</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
      </div>

      {/* Footer Quick Actions */}
      <div className="p-3 border-t border-celestial-muted/80 bg-celestial-deep/80 flex items-center justify-between gap-2">
        {onFocusCamera && (
          <Button
            variant="cyan"
            size="sm"
            onClick={() => onFocusCamera(object)}
            className="flex-1 gap-1.5 font-mono text-xs"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Focus Camera</span>
          </Button>
        )}
        <Link href={`/objects/${object.slug}`} className="flex-1">
          <Button variant="secondary" size="sm" className="w-full gap-1.5 font-mono text-xs">
            <span>Full Profile</span>
            <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </div>
    </aside>
  );
}
