"use client";

import React from "react";
import Link from "next/link";
import {
  X,
  Crosshair,
  ExternalLink,
  ShieldCheck,
  Compass,
  ArrowRight,
  Layers,
  Radio,
} from "lucide-react";
import { CelestialObject } from "@/domain/celestial-object/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface DeepSkyTelemetryPanelProps {
  object: CelestialObject | null;
  onClose: () => void;
  onFocusCamera?: (object: CelestialObject) => void;
}

export function DeepSkyTelemetryPanel({
  object,
  onClose,
  onFocusCamera,
}: DeepSkyTelemetryPanelProps) {
  if (!object) return null;

  const deepSky = object.deepSky;
  const distLy = object.positional.distanceLightYears ?? 0;
  const distMpc = object.positional.distanceMpc;
  const distKpc = object.positional.distanceKpc;
  const distUnc = object.positional.distanceUncertainty;

  let formattedDistance = `${distLy.toLocaleString()} ly`;
  if (distMpc !== undefined && distMpc >= 0.1) {
    formattedDistance = `${distMpc.toFixed(2)} Mpc (${(distLy / 1000000).toFixed(2)} Mly)`;
  } else if (distKpc !== undefined && distKpc >= 1.0) {
    formattedDistance = `${distKpc.toFixed(2)} kpc (${distLy.toLocaleString()} ly)`;
  }

  const galCoord = object.positional.galacticCoordinates;

  return (
    <aside
      aria-label="Deep Sky Telemetry Details"
      className="absolute inset-x-3 bottom-4 top-auto sm:inset-x-auto sm:top-20 sm:bottom-auto sm:right-4 z-30 w-auto sm:w-full sm:max-w-sm max-h-[60vh] sm:max-h-[calc(100vh-14rem)] flex flex-col rounded-2xl border border-white/[0.1] bg-celestial-surface/95 backdrop-blur-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-right-4 duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-white/[0.08] bg-celestial-deep/80 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-mono text-celestial-starlight tracking-tight">
              {object.canonicalName.toUpperCase()}
            </h2>
            <Badge variant="cyan">{object.classification.code.replace(/_/g, " ")}</Badge>
          </div>
          {object.standardDesignation && (
            <p className="text-xs font-mono text-celestial-subtle">
              {object.standardDesignation}{" "}
              {object.physical.constellation && `· ${object.physical.constellation}`}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label="Close telemetry panel"
          className="p-1.5 rounded-xl text-celestial-subtle hover:text-celestial-starlight hover:bg-white/[0.06] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Content */}
      <div className="p-4 space-y-4 max-h-[calc(100vh-14rem)] overflow-y-auto font-sans text-xs scrollbar-thin">
        {/* Summary */}
        {object.summary && (
          <p className="text-celestial-subtle leading-relaxed border-b border-celestial-muted/50 pb-3">
            {object.summary}
          </p>
        )}

        {/* Distance & Scientific Uncertainty */}
        <div className="p-3 rounded-xl border border-celestial-cyan/30 bg-celestial-cyan/5 space-y-1.5 font-mono">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-celestial-cyan font-semibold">Distance & Measurement</span>
            {deepSky?.distanceMethod && (
              <span className="text-[10px] text-celestial-subtle truncate max-w-[140px]">
                {deepSky.distanceMethod.replace(/_/g, " ")}
              </span>
            )}
          </div>
          <div className="text-sm font-bold text-celestial-starlight">{formattedDistance}</div>
          {distUnc && (
            <div className="text-[10px] text-celestial-subtle">
              Uncertainty: ±{distUnc.upper?.toLocaleString()} ly ({distUnc.percentage?.toFixed(1)}%)
            </div>
          )}
        </div>

        {/* Positional Coordinates (Equatorial & Galactic) */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-celestial-cyan font-mono font-semibold text-xs">
            <Compass className="w-3.5 h-3.5" />
            <span>Astronomical Coordinates</span>
          </div>
          <div className="grid grid-cols-2 gap-2 bg-celestial-deep/40 p-2.5 rounded-lg border border-celestial-muted/40 font-mono text-[11px]">
            <div>
              <span className="text-[10px] text-celestial-subtle block">Right Ascension (α)</span>
              <span className="font-semibold text-celestial-starlight">
                {object.positional.rightAscensionDeg !== undefined
                  ? `${object.positional.rightAscensionDeg.toFixed(4)}°`
                  : "—"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-celestial-subtle block">Declination (δ)</span>
              <span className="font-semibold text-celestial-starlight">
                {object.positional.declinationDeg !== undefined
                  ? `${object.positional.declinationDeg.toFixed(4)}°`
                  : "—"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-celestial-subtle block">
                Galactic Longitude (l)
              </span>
              <span className="font-semibold text-celestial-starlight">
                {galCoord ? `${galCoord.lDeg.toFixed(2)}°` : "—"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-celestial-subtle block">Galactic Latitude (b)</span>
              <span className="font-semibold text-celestial-starlight">
                {galCoord ? `${galCoord.bDeg.toFixed(2)}°` : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Intrinsic Deep-Sky Properties */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-celestial-violet font-mono font-semibold text-xs">
            <Layers className="w-3.5 h-3.5" />
            <span>Deep Sky Morphology & Properties</span>
          </div>
          <div className="grid grid-cols-2 gap-2 bg-celestial-deep/40 p-2.5 rounded-lg border border-celestial-muted/40 font-mono text-[11px]">
            <div>
              <span className="text-[10px] text-celestial-subtle block">Apparent Mag (V)</span>
              <span className="font-semibold text-celestial-starlight">
                {object.physical.apparentMagnitudeV !== undefined
                  ? `${object.physical.apparentMagnitudeV} mag`
                  : "—"}
              </span>
            </div>

            {/* Galaxy Details */}
            {deepSky?.galaxy && (
              <>
                <div>
                  <span className="text-[10px] text-celestial-subtle block">Morphology</span>
                  <span className="font-semibold text-celestial-starlight">
                    {deepSky.galaxy.morphologicalType}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-celestial-subtle block">Redshift (z)</span>
                  <span className="font-semibold text-celestial-starlight">
                    {deepSky.galaxy.redshiftZ !== undefined ? deepSky.galaxy.redshiftZ : "—"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-celestial-subtle block">Angular Size</span>
                  <span className="font-semibold text-celestial-starlight">
                    {deepSky.galaxy.majorAxisArcmin !== undefined
                      ? `${deepSky.galaxy.majorAxisArcmin}' × ${deepSky.galaxy.minorAxisArcmin}'`
                      : "—"}
                  </span>
                </div>
              </>
            )}

            {/* Nebula Details */}
            {deepSky?.nebula && (
              <>
                <div>
                  <span className="text-[10px] text-celestial-subtle block">Subtype</span>
                  <span className="font-semibold text-celestial-starlight">
                    {deepSky.nebula.nebulaSubtype}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-celestial-subtle block">Angular Diameter</span>
                  <span className="font-semibold text-celestial-starlight">
                    {deepSky.nebula.angularDiameterArcmin !== undefined
                      ? `${deepSky.nebula.angularDiameterArcmin}'`
                      : "—"}
                  </span>
                </div>
              </>
            )}

            {/* Star Cluster Details */}
            {deepSky?.starCluster && (
              <>
                <div>
                  <span className="text-[10px] text-celestial-subtle block">Cluster Subtype</span>
                  <span className="font-semibold text-celestial-starlight">
                    {deepSky.starCluster.clusterSubtype.replace(/_/g, " ")}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-celestial-subtle block">Estimated Age</span>
                  <span className="font-semibold text-celestial-starlight">
                    {deepSky.starCluster.estimatedAgeGyr !== undefined
                      ? `${deepSky.starCluster.estimatedAgeGyr} Gyr`
                      : "—"}
                  </span>
                </div>
              </>
            )}

            {/* Planetary Nebula & Supernova Remnant Details */}
            {deepSky?.planetaryNebula && (
              <div>
                <span className="text-[10px] text-celestial-subtle block">Central Star</span>
                <span className="font-semibold text-celestial-starlight truncate block">
                  {deepSky.planetaryNebula.centralStarName || "White Dwarf"}
                </span>
              </div>
            )}
            {deepSky?.supernovaRemnant && (
              <div>
                <span className="text-[10px] text-celestial-subtle block">Progenitor</span>
                <span className="font-semibold text-celestial-starlight">
                  {deepSky.supernovaRemnant.progenitorType || "Core-Collapse"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Multi-Catalog Identifiers */}
        {object.catalogIdentifiers && (
          <div className="p-2.5 rounded-lg border border-celestial-muted/50 bg-celestial-deep/60 space-y-1 font-mono text-[10px]">
            <span className="text-celestial-subtle font-semibold block text-[11px]">
              Catalog Identifiers
            </span>
            <div className="grid grid-cols-2 gap-1 text-celestial-starlight">
              {object.catalogIdentifiers.messier && <div>{object.catalogIdentifiers.messier}</div>}
              {object.catalogIdentifiers.ngc && <div>{object.catalogIdentifiers.ngc}</div>}
              {object.catalogIdentifiers.ic && <div>{object.catalogIdentifiers.ic}</div>}
              {object.catalogIdentifiers.caldwell && (
                <div>{object.catalogIdentifiers.caldwell}</div>
              )}
              {object.catalogIdentifiers.pgc && <div>{object.catalogIdentifiers.pgc}</div>}
            </div>
          </div>
        )}

        {/* Multi-Wavelength Observations */}
        {object.observations && object.observations.length > 0 && (
          <div className="p-2.5 rounded-lg border border-celestial-violet/30 bg-celestial-violet/5 space-y-1 font-mono text-[10px]">
            <div className="flex items-center gap-1 text-celestial-violet font-semibold">
              <Radio className="w-3 h-3" />
              <span>Multi-Wavelength Observations ({object.observations.length})</span>
            </div>
            {object.observations.slice(0, 2).map((obs) => (
              <div key={obs.id} className="text-celestial-subtle truncate">
                <span className="text-celestial-starlight">{obs.wavelengthBand}:</span>{" "}
                {obs.telescopeOrSurvey} {obs.filterOrFrequency && `(${obs.filterOrFrequency})`}
              </div>
            ))}
          </div>
        )}

        {/* Scientific Provenance */}
        <div className="p-2.5 rounded-lg border border-celestial-muted/50 bg-celestial-deep/70 space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1 text-celestial-cyan font-mono font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{object.provenance.authoritativeBody} Data</span>
            </div>
            <span className="font-mono text-[10px] text-celestial-subtle">
              Conf: {(object.provenance.confidenceScore * 100).toFixed(1)}%
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
              <span>Catalog Source Record</span>
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
            onClick={() => onFocusCamera(object)}
            className="flex-1 gap-1.5 font-mono text-xs"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Focus Camera</span>
          </Button>
        )}
        <Link href={`/deep-sky/${object.slug}`} className="flex-1">
          <Button variant="secondary" size="sm" className="w-full gap-1.5 font-mono text-xs">
            <span>Full Profile</span>
            <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </div>
    </aside>
  );
}
