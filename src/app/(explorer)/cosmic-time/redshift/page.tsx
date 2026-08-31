"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { defaultCosmology } from "@/lib/astronomy/cosmology/cosmology-calculator";
import { formatCosmicAge } from "@/lib/astronomy/cosmology/cosmic-timeline";
import { cosmicEpochRepo } from "@/lib/data/cosmic-epoch-repository";

const REDSHIFT_PRESETS = [
  { label: "Virgo Cluster Core (M87)", z: 0.0044 },
  { label: "Coma Cluster (Abell 1656)", z: 0.0231 },
  { label: "3C 273 (First Identified Quasar)", z: 0.158 },
  { label: "Cosmic Noon (Peak Star Formation)", z: 2.0 },
  { label: "End of Reionization Horizon", z: 6.0 },
  { label: "GN-z11 Primeval Galaxy", z: 10.6 },
  { label: "JADES-GS-z14-0 (JWST Record)", z: 14.32 },
  { label: "CMB Decoupling Surface", z: 1089.0 },
];

export default function RedshiftExplorerPage() {
  const [inputZ, setInputZ] = useState<number>(2.0);

  const calc = useMemo(() => {
    return defaultCosmology.calculateAll(Math.max(0, inputZ));
  }, [inputZ]);

  const activeEpoch = useMemo(() => {
    return cosmicEpochRepo.getEpochForRedshift(inputZ);
  }, [inputZ]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 max-w-5xl mx-auto gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link href="/cosmic-time" className="hover:text-cyan-400 transition-colors">
            Cosmic Time Machine
          </Link>
          <span>/</span>
          <span className="text-cyan-400">Redshift Explorer</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100">
          Cosmological Redshift & Distance Engine
        </h1>
        <p className="text-sm text-slate-400 font-mono">
          Interactive FLRW metric calculator solving the expansion of spacetime.
        </p>
      </div>

      {/* Input & Presets Section */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="z-input"
              className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider"
            >
              Spectroscopic Redshift (z)
            </label>
            <span className="text-xs text-slate-400 font-mono">
              Enter any value from z = 0 (Present Day) to z = 1500 (Early Universe)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg font-mono text-slate-400">z =</span>
            <input
              id="z-input"
              type="number"
              min={0}
              max={2000}
              step={0.01}
              value={inputZ}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) setInputZ(val);
              }}
              className="w-32 px-3 py-2 rounded-xl bg-slate-950 border border-cyan-500/50 text-cyan-300 text-lg font-bold font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Quick Benchmark Buttons */}
        <div className="flex flex-col gap-2 pt-3 border-t border-slate-800">
          <span className="text-[11px] font-mono text-slate-400">Famous Benchmark Redshifts:</span>
          <div className="flex flex-wrap gap-2">
            {REDSHIFT_PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setInputZ(p.z)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-colors ${
                  inputZ === p.z
                    ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {p.label} (z = {p.z})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Epoch Association Header Banner */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/30 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
          <div>
            <div className="text-xs font-mono text-slate-400">Corresponding Cosmic Era:</div>
            <div className="text-base font-bold text-slate-100">{activeEpoch.name}</div>
          </div>
        </div>
        <Link
          href={`/cosmic-time/${activeEpoch.slug}`}
          className="text-xs font-mono text-cyan-400 hover:underline"
        >
          View Epoch Profile →
        </Link>
      </div>

      {/* Primary Calculated Spacetime Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Lookback Time</span>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
            {calc.lookbackTimeGyr.toFixed(3)} Gyr
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
            ~{Math.round(calc.lookbackTimeYears).toLocaleString()} years
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Cosmic Age (Then)</span>
          <div className="text-xl font-bold font-mono text-purple-400 mt-1">
            {formatCosmicAge(calc.cosmicAgeYears)}
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
            {calc.cosmicAgeGyr.toFixed(3)} Gyr post-Big Bang
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Scale Factor a</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            a = {calc.scaleFactorA.toFixed(4)}
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
            Universe was {(calc.scaleFactorA * 100).toFixed(2)}% present size
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Comoving Distance</span>
          <div className="text-xl font-bold font-mono text-slate-100 mt-1">
            {(calc.comovingDistanceMpc / 1000).toFixed(2)} Gpc
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
            {Math.round(calc.comovingDistanceMpc).toLocaleString()} Mpc
          </div>
        </div>
      </div>

      {/* Secondary Cosmological Distances Grid */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col gap-4">
        <h2 className="text-base font-bold text-slate-100 tracking-tight">
          Comprehensive FLRW Distance Measures
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400 block font-bold">Luminosity Distance D_L:</span>
            <span className="text-slate-100 text-sm font-semibold mt-1 block">
              {(calc.luminosityDistanceMpc / 1000).toFixed(2)} Gpc
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              D_L = (1+z) D_M (accounts for flux dilution & time dilation)
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400 block font-bold">Angular Diameter Distance D_A:</span>
            <span className="text-slate-100 text-sm font-semibold mt-1 block">
              {(calc.angularDiameterDistanceMpc / 1000).toFixed(2)} Gpc
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              D_A = D_M / (1+z) (peaks at z ~ 1.6 and decreases at high z!)
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-slate-400 block font-bold">Linear Hubble Deviation:</span>
            <span className="text-amber-400 text-sm font-semibold mt-1 block">
              {calc.linearApproximationErrorPercent.toFixed(1)}% Error
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Naive v = cz deviates severely at high z
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 leading-relaxed">
          <span className="font-bold text-slate-300">Scientific Note: </span>
          {calc.scientificNotes}
        </div>
      </div>
    </div>
  );
}
