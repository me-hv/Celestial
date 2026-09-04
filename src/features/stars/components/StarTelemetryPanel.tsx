"use client";

import React from "react";
import Link from "next/link";
import {
  X,
  Crosshair,
  ExternalLink,
  ShieldCheck,
  Weight,
  ArrowRight,
  Orbit,
  Compass,
} from "lucide-react";
import { CelestialObject } from "@/domain/celestial-object/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { stellarSystemRepo } from "@/lib/data/stellar-system-repository";
import { formatTemperature } from "@/lib/utils/formatters";

export interface StarTelemetryPanelProps {
  star: CelestialObject | null;
  onClose: () => void;
  onFocusCamera?: (star: CelestialObject) => void;
}

export function StarTelemetryPanel({ star, onClose, onFocusCamera }: StarTelemetryPanelProps) {
  if (!star) return null;

  const isSun = star.slug === "sun";
  const hostSystem = star.hostSystemId
    ? stellarSystemRepo.getBySlug(star.hostSystemId) || stellarSystemRepo.getById(star.hostSystemId)
    : null;

  const distPc = star.positional.distanceParsecs ?? 0;
  const distLy = star.positional.distanceLightYears ?? 0;

  return (
    <aside
      aria-label="Star Telemetry Details"
      className="absolute inset-x-3 bottom-4 top-auto sm:inset-x-auto sm:top-20 sm:bottom-auto sm:right-4 z-30 w-auto sm:w-full sm:max-w-sm max-h-[60vh] sm:max-h-[calc(100vh-14rem)] flex flex-col rounded-2xl border border-white/[0.1] bg-celestial-surface/95 backdrop-blur-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-right-4 duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-white/[0.08] bg-celestial-deep/80 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-mono text-celestial-starlight tracking-tight">
              {star.canonicalName.toUpperCase()}
            </h2>
            <Badge variant="amber">{star.physical.spectralClass || "STAR"}</Badge>
          </div>
          {star.standardDesignation && (
            <p className="text-xs font-mono text-celestial-subtle">
              {star.standardDesignation}{" "}
              {star.physical.constellation && `(${star.physical.constellation})`}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label="Close star telemetry panel"
          className="p-1.5 rounded-xl text-celestial-subtle hover:text-celestial-starlight hover:bg-white/[0.06] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Content */}
      <div className="p-4 space-y-4 max-h-[calc(100vh-14rem)] overflow-y-auto font-sans text-xs scrollbar-thin">
        {/* Summary */}
        {star.summary && (
          <p className="text-celestial-subtle leading-relaxed border-b border-celestial-muted/50 pb-3">
            {star.summary}
          </p>
        )}

        {/* Known Planetary System Bridge */}
        <div className="p-3 rounded-xl border border-celestial-cyan/30 bg-celestial-cyan/5 space-y-2 font-mono">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-celestial-cyan font-semibold">
              <Orbit className="w-3.5 h-3.5" />
              <span>Planetary System Status</span>
            </div>
            {hostSystem && <Badge variant="cyan">{hostSystem.numberOfPlanets} Planets</Badge>}
          </div>

          {hostSystem ? (
            <div className="space-y-1.5 pt-0.5">
              <p className="text-celestial-starlight text-xs">
                Hosts the <strong>{hostSystem.name}</strong> with {hostSystem.numberOfPlanets}{" "}
                confirmed planets.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <Link href={`/systems/${hostSystem.slug}`} className="flex-1">
                  <Button variant="cyan" size="sm" className="w-full text-xs h-7 gap-1">
                    <span>System Profile</span>
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
                <Link href={`/explore?system=${hostSystem.slug}`} className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full text-xs h-7 gap-1">
                    <Compass className="w-3 h-3" />
                    <span>3D Orbits</span>
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-celestial-subtle text-[11px] leading-relaxed">
              No confirmed planetary system in the current catalog.
            </p>
          )}
        </div>

        {/* Astrometric Position */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-celestial-cyan font-mono font-semibold text-xs">
            <Compass className="w-3.5 h-3.5" />
            <span>Astrometric Coordinates</span>
          </div>
          <div className="grid grid-cols-2 gap-2 bg-celestial-deep/40 p-2.5 rounded-lg border border-celestial-muted/40 font-mono text-[11px]">
            <div>
              <span className="text-[10px] text-celestial-subtle block">Distance</span>
              <span className="font-semibold text-celestial-starlight">
                {isSun ? "0.00 ly (Origin)" : `${distLy.toFixed(2)} ly (${distPc.toFixed(2)} pc)`}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-celestial-subtle block">Parallax</span>
              <span className="font-semibold text-celestial-starlight">
                {isSun ? "—" : `${star.positional.parallaxMas?.toFixed(2)} mas`}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-celestial-subtle block">Right Ascension</span>
              <span className="font-semibold text-celestial-starlight">
                {star.positional.rightAscensionDeg !== undefined
                  ? `${star.positional.rightAscensionDeg.toFixed(3)}°`
                  : "—"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-celestial-subtle block">Declination</span>
              <span className="font-semibold text-celestial-starlight">
                {star.positional.declinationDeg !== undefined
                  ? `${star.positional.declinationDeg.toFixed(3)}°`
                  : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Photometric & Physical Characteristics */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-celestial-amber font-mono font-semibold text-xs">
            <Weight className="w-3.5 h-3.5" />
            <span>Photometry & Physical Properties</span>
          </div>
          <div className="grid grid-cols-2 gap-2 bg-celestial-deep/40 p-2.5 rounded-lg border border-celestial-muted/40 font-mono text-[11px]">
            <div>
              <span className="text-[10px] text-celestial-subtle block">Apparent Mag (V)</span>
              <span className="font-semibold text-celestial-starlight">
                {star.physical.apparentMagnitudeV !== undefined
                  ? star.physical.apparentMagnitudeV
                  : "—"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-celestial-subtle block">Absolute Mag (M_V)</span>
              <span className="font-semibold text-celestial-starlight">
                {star.physical.absoluteMagnitudeV !== undefined
                  ? star.physical.absoluteMagnitudeV
                  : "—"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-celestial-subtle block">T_eff (Temp)</span>
              <span className="font-semibold text-celestial-starlight">
                {formatTemperature(
                  star.physical.effectiveTemperatureK || star.physical.meanTemperatureK
                )}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-celestial-subtle block">Luminosity</span>
              <span className="font-semibold text-celestial-starlight">
                {star.physical.luminositySolar !== undefined
                  ? `${star.physical.luminositySolar} L☉`
                  : "—"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-celestial-subtle block">Mass</span>
              <span className="font-semibold text-celestial-starlight">
                {star.physical.massSolar !== undefined ? `${star.physical.massSolar} M☉` : "—"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-celestial-subtle block">Radius</span>
              <span className="font-semibold text-celestial-starlight">
                {star.physical.radiusSolar !== undefined ? `${star.physical.radiusSolar} R☉` : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Multi-Catalog Identifiers */}
        {star.catalogIdentifiers && (
          <div className="p-2.5 rounded-lg border border-celestial-muted/50 bg-celestial-deep/60 space-y-1 font-mono text-[10px]">
            <span className="text-celestial-subtle font-semibold block text-[11px]">
              Catalog Identifiers
            </span>
            <div className="grid grid-cols-2 gap-1 text-celestial-starlight">
              {star.catalogIdentifiers.gaiaDr3 && <div>{star.catalogIdentifiers.gaiaDr3}</div>}
              {star.catalogIdentifiers.hip && <div>{star.catalogIdentifiers.hip}</div>}
              {star.catalogIdentifiers.hd && <div>{star.catalogIdentifiers.hd}</div>}
              {star.catalogIdentifiers.gliese && <div>{star.catalogIdentifiers.gliese}</div>}
            </div>
          </div>
        )}

        {/* Scientific Provenance */}
        <div className="p-2.5 rounded-lg border border-celestial-muted/50 bg-celestial-deep/70 space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1 text-celestial-cyan font-mono font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{star.provenance.authoritativeBody} Astrometry</span>
            </div>
            <span className="font-mono text-[10px] text-celestial-subtle">
              Conf: {(star.provenance.confidenceScore * 100).toFixed(1)}%
            </span>
          </div>
          <p className="text-[10px] text-celestial-subtle font-mono truncate">
            {star.provenance.catalogName}
          </p>
          {star.provenance.citationUrl && (
            <a
              href={star.provenance.citationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] text-celestial-cyan hover:underline font-mono pt-1"
            >
              <span>Catalog Source Data</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-celestial-muted/80 bg-celestial-deep/80 flex items-center justify-between gap-2">
        {onFocusCamera && (
          <Button
            variant="cyan"
            size="sm"
            onClick={() => onFocusCamera(star)}
            className="flex-1 gap-1.5 font-mono text-xs"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Focus Camera</span>
          </Button>
        )}
        <Link href={`/stars/${star.slug}`} className="flex-1">
          <Button variant="secondary" size="sm" className="w-full gap-1.5 font-mono text-xs">
            <span>Star Profile</span>
            <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </div>
    </aside>
  );
}
