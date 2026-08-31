"use client";

import React from "react";
import Link from "next/link";
import { CosmicEpoch } from "@/domain/cosmic-time/types";
import { defaultCosmology } from "@/lib/astronomy/cosmology/cosmology-calculator";
import { formatCosmicAge } from "@/lib/astronomy/cosmology/cosmic-timeline";
import { EPOCH_COLOR_MAP } from "@/features/visualization/cosmic-time/cosmic-time-renderer";

interface CosmicTimeTelemetryPanelProps {
  epoch: CosmicEpoch;
  lookbackGyr: number;
}

export const CosmicTimeTelemetryPanel: React.FC<CosmicTimeTelemetryPanelProps> = ({
  epoch,
  lookbackGyr,
}) => {
  const universeAgeGyr = defaultCosmology.calculateUniverseAgeGyr();
  const cosmicAgeGyr = Math.max(0, universeAgeGyr - lookbackGyr);
  const redshiftZ = defaultCosmology.cosmicAgeToRedshift(Math.max(0.0001, cosmicAgeGyr));
  const scaleFactorA = defaultCosmology.redshiftToScaleFactor(redshiftZ);
  const comovingDistMpc = defaultCosmology.calculateComovingDistanceMpc(redshiftZ);

  const colorConfig = EPOCH_COLOR_MAP[epoch.type] || { primary: 0x06b6d4, hex: "#06b6d4" };

  return (
    <div
      className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col gap-5 text-slate-200"
      data-testid="cosmic-time-telemetry-panel"
    >
      {/* Header with Epoch Badge */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: colorConfig.hex }}
            />
            <span className="text-xs font-mono tracking-wider uppercase text-cyan-400 font-semibold">
              EPOCH {epoch.orderIndex} OF 14 • {epoch.category.replace(/_/g, " ")}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">{epoch.name}</h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">{epoch.tagline}</p>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <span
            className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold border ${
              epoch.observationStatus === "OBSERVED"
                ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                : epoch.observationStatus === "INFERRED"
                  ? "bg-cyan-950/60 border-cyan-500/40 text-cyan-300"
                  : epoch.observationStatus === "MODEL_DERIVED"
                    ? "bg-purple-950/60 border-purple-500/40 text-purple-300"
                    : "bg-amber-950/60 border-amber-500/40 text-amber-300"
            }`}
          >
            {epoch.observationStatus} STATUS
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            {epoch.boundaryConfidence.replace(/_/g, " ")}
          </span>
        </div>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            Cosmic Age
          </div>
          <div className="text-lg font-bold text-slate-100 font-mono mt-1">
            {formatCosmicAge(cosmicAgeGyr * 1e9)}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            Range: {epoch.ageRange.minDisplay} – {epoch.ageRange.maxDisplay}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            Lookback Time
          </div>
          <div className="text-lg font-bold text-cyan-400 font-mono mt-1">
            {lookbackGyr.toFixed(2)} Gyr
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            {((lookbackGyr / universeAgeGyr) * 100).toFixed(1)}% of cosmic history
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            Redshift (z)
          </div>
          <div className="text-lg font-bold text-purple-400 font-mono mt-1">
            z ≈ {redshiftZ < 10 ? redshiftZ.toFixed(2) : Math.round(redshiftZ)}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            Scale Factor a ≈ {scaleFactorA.toFixed(4)}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            Comoving Distance
          </div>
          <div className="text-lg font-bold text-emerald-400 font-mono mt-1">
            {comovingDistMpc > 0 ? `${(comovingDistMpc / 1000).toFixed(2)} Gpc` : "0 Mpc"}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            ~{(comovingDistMpc * 3.26156).toFixed(1)} Mly
          </div>
        </div>
      </div>

      {/* Epoch Summary & Physical Processes */}
      <div className="flex flex-col gap-2">
        <div className="text-xs font-mono font-semibold text-slate-400 uppercase">
          Epoch Overview
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">{epoch.summary}</p>
      </div>

      {/* Key Physical Processes */}
      {epoch.physicalProcesses.length > 0 && (
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/80">
          <div className="text-xs font-mono font-semibold text-slate-400 uppercase">
            Primary Physical Processes
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {epoch.physicalProcesses.map((proc, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60"
              >
                <div className="text-xs font-semibold text-slate-200">{proc.title}</div>
                <div className="text-[11px] text-slate-400 mt-1 leading-snug">
                  {proc.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Link to Detailed Dossier */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs font-mono">
        <span className="text-slate-500">
          Source: {epoch.provenance.catalogName} ({epoch.provenance.recordIdentifier})
        </span>
        <Link
          href={`/cosmic-time/${epoch.slug}`}
          className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors font-semibold"
        >
          View Full Epoch Dossier →
        </Link>
      </div>
    </div>
  );
};
