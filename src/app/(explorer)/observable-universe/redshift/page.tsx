"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sliders, ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { defaultCosmology } from "@/lib/astronomy/cosmology/cosmology-calculator";
import { observableUniverseRepo } from "@/lib/data/observable-universe-repository";

export default function RedshiftWorkbenchPage() {
  const [redshift, setRedshift] = useState<number>(2.0);

  const matchedShell = observableUniverseRepo.getShellForRedshift(redshift);
  const scaleFactor = defaultCosmology.redshiftToScaleFactor(redshift);
  const lookbackGyr = defaultCosmology.calculateLookbackTimeGyr(redshift);
  const cosmicAgeGyr = defaultCosmology.calculateCosmicAgeGyr(redshift);
  const comovingMpc = defaultCosmology.calculateComovingDistanceMpc(redshift);
  const comovingGly = comovingMpc * 0.003261563777;
  const properEmissionMpc = defaultCosmology.properDistanceAtEmissionMpc(redshift);
  const cmbTempK = defaultCosmology.calculateCMBTemperatureK(redshift);

  const PRESET_REDSHIFTS = [
    { label: "Local (z=0.01)", z: 0.01 },
    { label: "Quasar 3C 273 (z=0.158)", z: 0.158 },
    { label: "Cosmic Noon (z=2.0)", z: 2.0 },
    { label: "Reionization (z=7.0)", z: 7.0 },
    { label: "GN-z11 (z=10.6)", z: 10.6 },
    { label: "JADES-GS-z14-0 (z=14.32)", z: 14.32 },
    { label: "Dark Ages (z=100)", z: 100.0 },
    { label: "CMB (z=1089)", z: 1089.0 },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <section className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <Container
          size="xl"
          className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-1">
              <Sliders className="w-3.5 h-3.5" />
              <span>Cosmological Calculator &amp; Workbench</span>
            </div>
            <h1 className="text-xl md:text-2xl font-mono font-bold tracking-tight text-white flex items-center gap-2.5">
              Redshift &amp; Distance Workbench
            </h1>
            <p className="text-xs md:text-sm text-slate-400 font-mono mt-0.5">
              Compute exact FLRW cosmological distances, lookback times, scale factors, and CMB bath
              temperatures.
            </p>
          </div>

          <Link
            href="/observable-universe"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-800 text-xs font-mono transition-colors self-start md:self-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Observable Universe</span>
          </Link>
        </Container>
      </section>

      {/* Main Workspace */}
      <Container size="xl" className="py-6 flex flex-col gap-6 flex-1 max-w-4xl">
        {/* Interactive Redshift Controller */}
        <div className="flex flex-col gap-4 p-5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md font-mono">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              TARGET REDSHIFT (z):
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="1500"
                step="0.01"
                value={redshift}
                onChange={(e) =>
                  setRedshift(Math.max(0, Math.min(1500, parseFloat(e.target.value) || 0)))
                }
                className="w-28 px-2.5 py-1 rounded bg-slate-950 border border-slate-700 text-cyan-300 font-bold text-sm text-right focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Slider */}
          <input
            type="range"
            min="0"
            max="15"
            step="0.01"
            value={Math.min(15, redshift)}
            onChange={(e) => setRedshift(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] text-slate-500 uppercase mr-1">Key Milestones:</span>
            {PRESET_REDSHIFTS.map((p) => (
              <button
                key={p.label}
                onClick={() => setRedshift(p.z)}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  Math.abs(redshift - p.z) < 0.01
                    ? "bg-cyan-500/30 text-cyan-300 border border-cyan-500/50"
                    : "bg-slate-950/60 text-slate-400 border border-slate-800/60 hover:text-slate-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Calculated Results Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">
              Scale Factor a(z)
            </span>
            <span className="text-amber-300 font-bold text-lg">{scaleFactor.toFixed(5)}</span>
            <p className="text-[10px] text-slate-400 mt-1">
              Universe was {(scaleFactor * 100).toFixed(2)}% of current size.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">
              Lookback Time
            </span>
            <span className="text-cyan-300 font-bold text-lg">{lookbackGyr.toFixed(3)} Gyr</span>
            <p className="text-[10px] text-slate-400 mt-1">
              Light traveled for {(lookbackGyr * 1e9).toLocaleString()} years.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">
              Cosmic Age at Emission
            </span>
            <span className="text-purple-300 font-bold text-lg">
              {cosmicAgeGyr < 0.01
                ? `${(cosmicAgeGyr * 1e6).toFixed(0)} kyr`
                : `${cosmicAgeGyr.toFixed(3)} Gyr`}
            </span>
            <p className="text-[10px] text-slate-400 mt-1">
              Time elapsed since the Big Singularity.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">
              Comoving Distance (D_C)
            </span>
            <span className="text-slate-100 font-bold text-lg">{comovingGly.toFixed(2)} Gly</span>
            <p className="text-[10px] text-slate-400 mt-1">
              {comovingMpc.toFixed(1)} Mpc (Current coordinate distance).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">
              Proper Distance (D_proper)
            </span>
            <span className="text-emerald-300 font-bold text-lg">
              {properEmissionMpc < 1.0
                ? `${(properEmissionMpc * 1000).toFixed(0)} kpc`
                : properEmissionMpc > 1000
                  ? `${(properEmissionMpc / 1000).toFixed(2)} Gpc`
                  : `${properEmissionMpc.toFixed(1)} Mpc`}
            </span>
            <p className="text-[10px] text-slate-400 mt-1">
              Physical distance when photons were emitted.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">
              CMB Bath Temperature
            </span>
            <span className="text-orange-400 font-bold text-lg">{cmbTempK.toFixed(2)} K</span>
            <p className="text-[10px] text-slate-400 mt-1">T(z) = 2.7255 K · (1 + z)</p>
          </div>
        </div>

        {/* Matched Redshift Shell Info */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 font-mono text-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-cyan-300">Cosmological Layer: {matchedShell.name}</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-bold">
              Shell #{matchedShell.orderIndex}
            </span>
          </div>
          <p className="text-slate-300 text-xs">{matchedShell.description}</p>
        </div>
      </Container>
    </div>
  );
}
