"use client";

import React from "react";
import {
  ObservationalLandmark,
  RedshiftShell,
  CosmicHorizon,
} from "@/domain/observable-universe/types";

interface ObservableTelemetryPanelProps {
  landmark?: ObservationalLandmark | null;
  shell?: RedshiftShell | null;
  horizon?: CosmicHorizon | null;
}

export const ObservableTelemetryPanel: React.FC<ObservableTelemetryPanelProps> = ({
  landmark,
  shell,
  horizon,
}) => {
  if (!landmark && !shell && !horizon) {
    return (
      <div className="p-4 rounded-xl bg-celestial-surface/80 border border-white/[0.08] text-celestial-subtle font-mono text-xs backdrop-blur-xl">
        Select a landmark, redshift shell, or cosmic horizon to view physical telemetry.
      </div>
    );
  }

  // Render Landmark Telemetry
  if (landmark) {
    return (
      <div
        className="flex flex-col gap-3 p-4 rounded-2xl bg-celestial-surface/90 border border-white/[0.08] backdrop-blur-2xl font-mono shadow-xl"
        data-testid="observable-telemetry-landmark"
      >
        <div className="flex items-start justify-between gap-2 border-b border-white/[0.08] pb-2.5">
          <div>
            <span className="text-[10px] text-celestial-cyan font-bold uppercase tracking-wider">
              {landmark.category} • OBSERVATIONAL LANDMARK
            </span>
            <h3 className="text-base font-bold text-celestial-starlight">{landmark.name}</h3>
            {landmark.standardDesignation && (
              <span className="text-xs text-celestial-subtle">{landmark.standardDesignation}</span>
            )}
          </div>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              landmark.status === "OBSERVED"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : landmark.status === "MODEL_DERIVED"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
            }`}
          >
            {landmark.status}
          </span>
        </div>

        {/* Telemetry Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <div className="p-2 rounded-lg bg-celestial-deep/60 border border-white/[0.06]">
            <span className="text-[10px] text-slate-500 block">Redshift (z)</span>
            <span className="text-slate-100 font-bold text-sm">
              {landmark.redshiftZ.toFixed(3)}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] text-slate-500 block">Lookback Time</span>
            <span className="text-cyan-300 font-bold text-sm">
              {landmark.lookbackTimeGyr < 0.01
                ? `${(landmark.lookbackTimeGyr * 1e6).toFixed(0)} yr`
                : `${landmark.lookbackTimeGyr.toFixed(2)} Gyr`}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] text-slate-500 block">Cosmic Age at Emission</span>
            <span className="text-purple-300 font-bold text-sm">
              {landmark.cosmicAgeAtEmissionGyr < 0.01
                ? `${(landmark.cosmicAgeAtEmissionGyr * 1e6).toFixed(0)} yr`
                : `${landmark.cosmicAgeAtEmissionGyr.toFixed(2)} Gyr`}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] text-slate-500 block">Comoving Distance</span>
            <span className="text-slate-100 font-bold text-sm">
              {landmark.comovingDistanceGly.toFixed(2)} Gly
              <span className="text-[10px] text-slate-500 block">
                ({landmark.comovingDistanceMpc.toFixed(1)} Mpc)
              </span>
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] text-slate-500 block">Scale Factor a(z)</span>
            <span className="text-amber-300 font-bold text-sm">
              {landmark.scaleFactorA.toFixed(4)}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] text-slate-500 block">Proper Dist. at Emission</span>
            <span className="text-slate-100 font-bold text-sm">
              {landmark.properDistanceEmissionMpc < 1.0
                ? `${(landmark.properDistanceEmissionMpc * 1000).toFixed(0)} kpc`
                : `${landmark.properDistanceEmissionMpc.toFixed(1)} Mpc`}
            </span>
          </div>
        </div>

        {/* Physical Summary */}
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/40">
          {landmark.summary}
        </p>

        {/* Provenance */}
        <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] text-slate-500 border-t border-slate-800 pt-2">
          <span>Authority: {landmark.provenance.authoritativeBody}</span>
          <span>Catalog: {landmark.provenance.catalogName}</span>
        </div>
      </div>
    );
  }

  // Render Redshift Shell Telemetry
  if (shell) {
    return (
      <div
        className="flex flex-col gap-3 p-4 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md font-mono"
        data-testid="observable-telemetry-shell"
      >
        <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5">
          <div>
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
              REDSHIFT SHELL #{shell.orderIndex}
            </span>
            <h3 className="text-base font-bold text-slate-100">{shell.name}</h3>
          </div>
          <span
            className="px-2 py-0.5 rounded text-[10px] font-bold"
            style={{ backgroundColor: `${shell.colorHex}20`, color: shell.colorHex }}
          >
            z = {shell.minRedshiftZ} – {shell.maxRedshiftZ}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] text-slate-500 block">Comoving Range</span>
            <span className="text-slate-100 font-bold text-xs">
              {(shell.minComovingDistanceMpc * 0.00326).toFixed(1)} –{" "}
              {(shell.maxComovingDistanceMpc * 0.00326).toFixed(1)} Gly
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] text-slate-500 block">Lookback Range</span>
            <span className="text-cyan-300 font-bold text-xs">
              {shell.minLookbackTimeGyr.toFixed(2)} – {shell.maxLookbackTimeGyr.toFixed(2)} Gyr
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/40">
          {shell.description}
        </p>

        <div className="text-[11px] text-slate-400">
          <span className="text-slate-500 block text-[10px] uppercase font-bold">
            Representative Targets:
          </span>
          {shell.representativeObjects.join(" • ")}
        </div>
      </div>
    );
  }

  // Render Horizon Telemetry
  if (horizon) {
    return (
      <div
        className="flex flex-col gap-3 p-4 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md font-mono"
        data-testid="observable-telemetry-horizon"
      >
        <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5">
          <div>
            <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">
              COSMIC HORIZON
            </span>
            <h3 className="text-base font-bold text-slate-100">{horizon.name}</h3>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            {horizon.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] text-slate-500 block">Comoving Radius</span>
            <span className="text-rose-300 font-bold text-sm">
              {horizon.comovingRadiusGly.toFixed(1)} Gly
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] text-slate-500 block">Lookback Time</span>
            <span className="text-slate-100 font-bold text-sm">
              {horizon.lookbackTimeGyr.toFixed(2)} Gyr
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/40">
          {horizon.physicalMeaning}
        </p>

        {horizon.commonMisconception && (
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200">
            {horizon.commonMisconception}
          </div>
        )}
      </div>
    );
  }

  return null;
};
