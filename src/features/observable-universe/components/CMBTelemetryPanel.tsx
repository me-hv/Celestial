"use client";

import React from "react";
import { CMBLastScatteringSurface } from "@/domain/observable-universe/types";

interface CMBTelemetryPanelProps {
  cmb: CMBLastScatteringSurface;
}

export const CMBTelemetryPanel: React.FC<CMBTelemetryPanelProps> = ({ cmb }) => {
  return (
    <div
      className="flex flex-col gap-4 p-4 sm:p-5 rounded-2xl bg-celestial-surface/90 border border-white/[0.08] backdrop-blur-2xl font-mono shadow-xl text-celestial-starlight"
      data-testid="cmb-telemetry-panel"
    >
      <div className="flex items-start justify-between gap-2 border-b border-white/[0.08] pb-3">
        <div>
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
            PRIMARY COSMOLOGICAL BENCHMARK
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white">{cmb.name}</h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          {cmb.status}
        </span>
      </div>

      {/* Core Physical Parameters Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-celestial-deep/60 border border-white/[0.06]">
          <span className="text-[10px] text-celestial-subtle block">Redshift (z)</span>
          <span className="text-amber-400 font-bold text-base">{cmb.redshiftZ.toFixed(1)}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-celestial-deep/60 border border-white/[0.06]">
          <span className="text-[10px] text-celestial-subtle block">Current Temp (T_0)</span>
          <span className="text-celestial-cyan font-bold text-base">
            {cmb.temperatureKelvinToday.toFixed(4)} K
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-celestial-deep/60 border border-white/[0.06]">
          <span className="text-[10px] text-celestial-subtle block">Cosmic Age (t)</span>
          <span className="text-celestial-violet font-bold text-base">
            {(cmb.cosmicAgeYears / 1000).toFixed(0)} kyr
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-celestial-deep/60 border border-white/[0.06]">
          <span className="text-[10px] text-celestial-subtle block">Comoving Dist.</span>
          <span className="text-white font-bold text-base">
            {cmb.comovingDistanceGly.toFixed(1)} Gly
          </span>
        </div>
      </div>

      {/* Acoustic Peaks Table */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
          Acoustic Peaks & Multipoles (C_ℓ)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          {cmb.acousticPeaks.map((peak) => (
            <div
              key={peak.peakNumber}
              className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/50 flex flex-col gap-1"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-orange-300 font-bold">Peak #{peak.peakNumber}</span>
                <span className="text-slate-400">
                  ℓ ≈ {peak.multipoleL} ({peak.angularScaleDeg}°)
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">{peak.physicalMeaning}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Missions Reference */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
          Observational Missions & Telescopes
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {cmb.missions.map((mission) => (
            <div
              key={mission.name}
              className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/40 flex flex-col gap-0.5"
            >
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-cyan-300">{mission.name}</span>
                <span className="text-slate-500">{mission.launchYear}</span>
              </div>
              <p className="text-[10px] text-slate-400">{mission.keyDiscovery}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Provenance */}
      <div className="text-[10px] text-slate-500 border-t border-slate-800 pt-2 flex items-center justify-between">
        <span>Catalog: {cmb.provenance.catalogName}</span>
        <span>Authority: {cmb.provenance.authoritativeBody}</span>
      </div>
    </div>
  );
};
