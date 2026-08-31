import React from "react";
import Link from "next/link";
import { CosmicStructure } from "@/domain/cosmic-structure/types";
import { CosmicStructureTypeBadge } from "./CosmicStructureTypeBadge";
import { formatLookbackTime } from "@/lib/astronomy/cosmology/distance";
import { Button } from "@/components/ui/button";

interface CosmicStructureTelemetryPanelProps {
  structure: CosmicStructure;
  onClose?: () => void;
  onFocusCamera?: () => void;
}

export function CosmicStructureTelemetryPanel({
  structure,
  onClose,
  onFocusCamera,
}: CosmicStructureTelemetryPanelProps) {
  const distMpc = structure.coordinates.distanceMpc.value;
  const distLy = structure.coordinates.distanceLy.value;
  const distErrMpc = structure.coordinates.distanceMpc.uncertainty?.upper;

  const majorMpc = structure.dimensions.majorAxisMpc.value;
  const majorLy = majorMpc * 3.26156e6;

  const massSolar = structure.physical.estimatedMassSolar?.value;
  const galaxyCount = structure.physical.galaxyCountEstimated?.value;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-xl max-w-md w-full text-slate-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-white/5 pb-3">
        <div>
          <CosmicStructureTypeBadge
            type={structure.type}
            observationStatus={structure.observationStatus}
          />
          <h2 className="text-xl font-bold tracking-tight text-white font-mono mt-2">
            {structure.name}
          </h2>
          {structure.standardDesignation && (
            <span className="text-xs text-slate-400 font-mono block">
              {structure.standardDesignation}
            </span>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Summary */}
      <p className="text-xs text-slate-300 leading-relaxed font-sans">{structure.summary}</p>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-2 gap-2.5 bg-slate-900/60 border border-white/5 rounded-xl p-3.5 text-xs font-mono">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
            Distance
          </span>
          <span className="text-sm font-semibold text-cyan-300">
            {distMpc === 0
              ? "0 Mpc (Home)"
              : `${distMpc.toFixed(1)}${distErrMpc ? ` ± ${distErrMpc}` : ""} Mpc`}
          </span>
          <span className="text-[10px] text-slate-400 block">
            ~{(distLy / 1e6).toFixed(1)} Million ly
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
            Lookback Time
          </span>
          <span className="text-sm font-semibold text-emerald-300">
            {formatLookbackTime(structure.coordinates.lookbackTimeYears)}
          </span>
          <span className="text-[10px] text-slate-400 block">
            z = {structure.coordinates.spectroscopicRedshiftZ?.value.toFixed(4) ?? "0.0000"}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
            Major Span
          </span>
          <span className="text-sm font-semibold text-white">{majorMpc.toFixed(1)} Mpc</span>
          <span className="text-[10px] text-slate-400 block">
            ~{(majorLy / 1e6).toFixed(1)} Mly
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
            Gravitational Mass
          </span>
          <span className="text-sm font-semibold text-amber-300">
            {massSolar ? `${(massSolar / 1e12).toFixed(1)} × 10¹² M☉` : "Unknown"}
          </span>
          <span className="text-[10px] text-slate-400 block">
            {galaxyCount ? `~${galaxyCount.toLocaleString()} galaxies` : "Diffuse"}
          </span>
        </div>
      </div>

      {/* Physics & Kinematics */}
      <div className="space-y-1.5 text-xs">
        <h3 className="text-[11px] font-mono font-semibold uppercase text-slate-400 tracking-wider">
          Astrophysical Context
        </h3>
        <div className="grid grid-cols-2 gap-2 bg-slate-900/40 p-2.5 rounded-lg border border-white/5 font-mono text-[11px]">
          <div>
            <span className="text-slate-400 block text-[10px]">Radial Velocity</span>
            <span className="text-white font-medium">
              {structure.coordinates.heliocentricRadialVelocityKmS
                ? `${structure.coordinates.heliocentricRadialVelocityKmS.value} km/s`
                : "Dominant Infall"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Velocity Dispersion</span>
            <span className="text-white font-medium">
              {structure.physical.meanVelocityDispersionKmS
                ? `σ = ${structure.physical.meanVelocityDispersionKmS.value} km/s`
                : structure.physical.densityContrastDelta !== undefined
                  ? `δ = ${structure.physical.densityContrastDelta}`
                  : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Hierarchy Context */}
      {structure.parentStructure && (
        <div className="rounded-lg bg-purple-950/20 border border-purple-500/20 p-2.5 text-xs font-mono">
          <span className="text-[10px] text-purple-300 block uppercase">Parent Structure</span>
          <span className="text-white font-semibold">{structure.parentStructure.name}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Relationship: {structure.parentStructure.relationshipType} (
            {structure.parentStructure.confidence})
          </span>
        </div>
      )}

      {/* Scientific Provenance Citation */}
      <div className="border-t border-white/5 pt-2 text-[10px] font-mono text-slate-400">
        <span>Catalog: {structure.provenance.catalogName}</span>
        <span className="block truncate text-slate-400">
          Record: {structure.provenance.recordIdentifier} ({structure.provenance.authoritativeBody})
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        {onFocusCamera && (
          <Button variant="secondary" size="sm" onClick={onFocusCamera} className="flex-1 text-xs">
            Center Camera
          </Button>
        )}
        <Link href={`/cosmic-web/${structure.slug}`} className="flex-1">
          <Button variant="cyan" size="sm" className="w-full text-xs">
            Full Profile →
          </Button>
        </Link>
        <Link href={`/cosmic-web/compare?a=${structure.slug}&b=virgo-cluster`}>
          <Button variant="outline" size="sm" className="text-xs px-2.5">
            Compare
          </Button>
        </Link>
      </div>
    </div>
  );
}
