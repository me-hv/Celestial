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
  Info,
} from "lucide-react";
import { GalacticStructure } from "@/domain/galactic-structure/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface GalacticTelemetryPanelProps {
  structure: GalacticStructure | null;
  onClose: () => void;
  onFocusCamera?: (structure: GalacticStructure) => void;
}

export function GalacticTelemetryPanel({
  structure,
  onClose,
  onFocusCamera,
}: GalacticTelemetryPanelProps) {
  if (!structure) return null;

  const ext = structure.spatialExtent;

  return (
    <aside
      aria-label="Galactic Structure Telemetry Details"
      className="absolute inset-x-3 bottom-4 top-auto sm:inset-x-auto sm:top-20 sm:bottom-auto sm:right-4 z-30 w-auto sm:w-full sm:max-w-sm max-h-[60vh] sm:max-h-[calc(100vh-14rem)] flex flex-col rounded-2xl border border-white/[0.1] bg-celestial-surface/95 backdrop-blur-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-right-4 duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-white/[0.08] bg-celestial-deep/80 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-mono text-celestial-starlight tracking-tight">
              {structure.name.toUpperCase()}
            </h2>
            <Badge variant="cyan">{structure.type.replace(/_/g, " ")}</Badge>
          </div>
          {structure.standardDesignation && (
            <p className="text-xs font-mono text-celestial-subtle">
              {structure.standardDesignation}
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
        {/* Model-derived Caution / Notice */}
        {structure.isModelDerived && (
          <div className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 font-mono text-[11px] flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-amber-300">Model-Derived Structure</span>
              <span>
                Internal Galactic geometry is inferred from stellar tracers and maser parallaxes
                (Confidence: {structure.modelConfidence}).
              </span>
            </div>
          </div>
        )}

        {/* Summary */}
        <p className="text-celestial-subtle leading-relaxed border-b border-celestial-muted/50 pb-3">
          {structure.summary}
        </p>

        {/* Galactocentric Spatial Extent */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-celestial-cyan font-mono font-semibold text-xs">
            <Compass className="w-3.5 h-3.5" />
            <span>Galactocentric Extent</span>
          </div>
          <div className="grid grid-cols-2 gap-2 bg-celestial-deep/40 p-2.5 rounded-lg border border-celestial-muted/40 font-mono text-[11px]">
            <div>
              <span className="text-[10px] text-celestial-subtle block">Radius Span (R_GC)</span>
              <span className="font-semibold text-celestial-starlight">
                {ext.minGalactocentricRadiusKpc} — {ext.maxGalactocentricRadiusKpc} kpc
              </span>
            </div>
            <div>
              <span className="text-[10px] text-celestial-subtle block">Vertical Extent (z)</span>
              <span className="font-semibold text-celestial-starlight">
                {ext.minZHeightPc !== undefined ? `±${ext.maxZHeightPc} pc` : "Full Halo"}
              </span>
            </div>
          </div>
        </div>

        {/* Structural Model Characteristics */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-celestial-violet font-mono font-semibold text-xs">
            <Layers className="w-3.5 h-3.5" />
            <span>Physical & Model Parameters</span>
          </div>
          <div className="grid grid-cols-2 gap-2 bg-celestial-deep/40 p-2.5 rounded-lg border border-celestial-muted/40 font-mono text-[11px]">
            {/* Disk Properties */}
            {structure.disk && (
              <>
                <div>
                  <span className="text-[10px] text-celestial-subtle block">Thin Disk Height</span>
                  <span className="font-semibold text-celestial-starlight">
                    {structure.disk.thinDiskScaleHeightPc} pc
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-celestial-subtle block">Thick Disk Height</span>
                  <span className="font-semibold text-celestial-starlight">
                    {structure.disk.thickDiskScaleHeightPc} pc
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-celestial-subtle block">
                    Radial Scale Length
                  </span>
                  <span className="font-semibold text-celestial-starlight">
                    {structure.disk.scaleLengthPc} pc
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-celestial-subtle block">Rotation Speed</span>
                  <span className="font-semibold text-celestial-starlight">
                    ~{structure.disk.estimatedRotationSpeedKmS} km/s
                  </span>
                </div>
              </>
            )}

            {/* Bulge Properties */}
            {structure.bulge && (
              <>
                <div>
                  <span className="text-[10px] text-celestial-subtle block">Effective Radius</span>
                  <span className="font-semibold text-celestial-starlight">
                    {structure.bulge.effectiveRadiusKpc} kpc
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-celestial-subtle block">Morphology</span>
                  <span className="font-semibold text-celestial-starlight">
                    {structure.bulge.morphology.replace(/_/g, " ")}
                  </span>
                </div>
              </>
            )}

            {/* Bar Properties */}
            {structure.bar && (
              <>
                <div>
                  <span className="text-[10px] text-celestial-subtle block">Half-Length</span>
                  <span className="font-semibold text-celestial-starlight">
                    {structure.bar.halfLengthKpc} kpc
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-celestial-subtle block">Tilt Angle (Phi)</span>
                  <span className="font-semibold text-celestial-starlight">
                    {structure.bar.orientationAngleDeg}° relative to Sun-GC
                  </span>
                </div>
              </>
            )}

            {/* Spiral Arm Properties */}
            {structure.spiralArm && (
              <>
                <div>
                  <span className="text-[10px] text-celestial-subtle block">Pitch Angle (Psi)</span>
                  <span className="font-semibold text-celestial-starlight">
                    {structure.spiralArm.pitchAngleDeg}°
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-celestial-subtle block">Ref Radius (r_0)</span>
                  <span className="font-semibold text-celestial-starlight">
                    {structure.spiralArm.referenceRadiusKpc} kpc
                  </span>
                </div>
              </>
            )}

            {/* Galactic Center Properties */}
            {structure.galacticCenter && (
              <>
                <div>
                  <span className="text-[10px] text-celestial-subtle block">Distance to Sun</span>
                  <span className="font-semibold text-celestial-starlight">
                    {structure.galacticCenter.distanceFromSunPc.value.toLocaleString()} pc
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-celestial-subtle block">Central SMBH</span>
                  <span className="font-semibold text-celestial-starlight">
                    {structure.galacticCenter.centralBlackHoleName}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-celestial-subtle block">SMBH Mass</span>
                  <span className="font-semibold text-celestial-starlight">
                    ~{(structure.galacticCenter.centralBlackHoleMassSolar.value / 1e6).toFixed(3)}{" "}
                    Million M_sun
                  </span>
                </div>
              </>
            )}

            {/* Local Group Properties */}
            {structure.localGroup && (
              <>
                <div>
                  <span className="text-[10px] text-celestial-subtle block">Approx Diameter</span>
                  <span className="font-semibold text-celestial-starlight">
                    {structure.localGroup.approximateDiameterMpc} Mpc (~10 Mly)
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-celestial-subtle block">Member Galaxies</span>
                  <span className="font-semibold text-celestial-starlight">
                    {structure.localGroup.totalGalaxyCountEstimated}+ galaxies
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Scientific Provenance */}
        <div className="p-2.5 rounded-lg border border-celestial-muted/50 bg-celestial-deep/70 space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1 text-celestial-cyan font-mono font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{structure.provenance.authoritativeBody} Model</span>
            </div>
            <span className="font-mono text-[10px] text-celestial-subtle">
              Conf: {(structure.provenance.confidenceScore * 100).toFixed(1)}%
            </span>
          </div>
          <p className="text-[10px] text-celestial-subtle font-mono truncate">
            {structure.provenance.catalogName}
          </p>
          {structure.provenance.citationUrl && (
            <a
              href={structure.provenance.citationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] text-celestial-cyan hover:underline font-mono pt-1"
            >
              <span>Model Reference Publication</span>
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
            onClick={() => onFocusCamera(structure)}
            className="flex-1 gap-1.5 font-mono text-xs"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Focus Region</span>
          </Button>
        )}
        <Link href={`/milky-way/${structure.slug}`} className="flex-1">
          <Button variant="secondary" size="sm" className="w-full gap-1.5 font-mono text-xs">
            <span>Structure Profile</span>
            <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </div>
    </aside>
  );
}
