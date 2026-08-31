"use client";

import React, { useState } from "react";
import {
  CosmologyCalculator,
  DEFAULT_PLANCK_COSMOLOGY,
} from "@/lib/astronomy/cosmology/cosmology-calculator";

interface CosmologyPreset {
  id: string;
  name: string;
  tagline: string;
  h0: number;
  omegaMatter: number;
  omegaLambda: number;
  citation: string;
}

const COSMOLOGY_PRESETS: CosmologyPreset[] = [
  {
    id: "planck-2018",
    name: "Planck 2018 (Concordance ΛCDM)",
    tagline: "Standard cosmological benchmark from CMB temperature and polarization power spectra.",
    h0: 70.0,
    omegaMatter: 0.315,
    omegaLambda: 0.685,
    citation: "Planck Collaboration (2020) A&A 641, A6",
  },
  {
    id: "shoes-2022",
    name: "SH0ES (Direct Distance Ladder)",
    tagline: "Cepheid-calibrated Type Ia supernovae local distance scale (Hubble Tension high-H₀).",
    h0: 73.04,
    omegaMatter: 0.3,
    omegaLambda: 0.7,
    citation: "Riess et al. (2022) ApJ 934, L7",
  },
  {
    id: "einstein-de-sitter",
    name: "Einstein–de Sitter (Historical Flat Matter)",
    tagline: "Historical flat universe without Dark Energy (Ω_m = 1.0, Ω_Λ = 0).",
    h0: 70.0,
    omegaMatter: 1.0,
    omegaLambda: 0.0,
    citation: "Einstein & de Sitter (1932) PNAS 18, 213",
  },
];

interface CosmologyConfigSelectorProps {
  onCosmologyChange?: (calculator: CosmologyCalculator) => void;
}

export const CosmologyConfigSelector: React.FC<CosmologyConfigSelectorProps> = ({
  onCosmologyChange,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("planck-2018");
  const [customH0, setCustomH0] = useState<number>(
    DEFAULT_PLANCK_COSMOLOGY.hubbleConstantKmSPerMpc
  );
  const [customOm, setCustomOm] = useState<number>(DEFAULT_PLANCK_COSMOLOGY.omegaMatter);
  const [customOl, setCustomOl] = useState<number>(DEFAULT_PLANCK_COSMOLOGY.omegaLambda);

  const activeCalc = new CosmologyCalculator({
    hubbleConstantKmSPerMpc: customH0,
    omegaMatter: customOm,
    omegaLambda: customOl,
  });

  const universeAgeGyr = activeCalc.calculateUniverseAgeGyr();
  const hubbleTimeGyr = 977.79222 / customH0;
  const hubbleDistanceMpc = 299792.458 / customH0;

  const handleSelectPreset = (preset: CosmologyPreset) => {
    setSelectedPresetId(preset.id);
    setCustomH0(preset.h0);
    setCustomOm(preset.omegaMatter);
    setCustomOl(preset.omegaLambda);

    if (onCosmologyChange) {
      onCosmologyChange(
        new CosmologyCalculator({
          hubbleConstantKmSPerMpc: preset.h0,
          omegaMatter: preset.omegaMatter,
          omegaLambda: preset.omegaLambda,
        })
      );
    }
  };

  return (
    <div
      className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md flex flex-col gap-5 text-slate-200"
      data-testid="cosmology-config-selector"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-100 tracking-tight">
            Cosmology Model Inspector & Calibration
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Friedmann–Lemaître–Robertson–Walker (FLRW) Spacetime Metric
          </p>
        </div>
        <div className="px-3 py-1 rounded-md bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
          CALCULATED AGE t₀ ≈ {universeAgeGyr.toFixed(2)} Gyr
        </div>
      </div>

      {/* Preset Selection Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {COSMOLOGY_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handleSelectPreset(preset)}
            className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between gap-2 ${
              selectedPresetId === preset.id
                ? "bg-cyan-500/10 border-cyan-500/50 shadow-md shadow-cyan-950/40"
                : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700"
            }`}
          >
            <div>
              <div className="text-xs font-bold text-slate-100">{preset.name}</div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                H₀ = {preset.h0} • Ω_m = {preset.omegaMatter} • Ω_Λ = {preset.omegaLambda}
              </div>
            </div>
            <div className="text-[10px] text-slate-500 font-mono border-t border-slate-800/60 pt-1.5">
              {preset.citation}
            </div>
          </button>
        ))}
      </div>

      {/* Parameter Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
        <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400">Hubble Constant H₀</div>
          <div className="text-sm font-bold font-mono text-cyan-300 mt-1">
            {customH0.toFixed(2)} km/s/Mpc
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400">Matter Density Ω_m</div>
          <div className="text-sm font-bold font-mono text-purple-300 mt-1">
            {customOm.toFixed(3)}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400">Dark Energy Ω_Λ</div>
          <div className="text-sm font-bold font-mono text-emerald-300 mt-1">
            {customOl.toFixed(3)}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400">Hubble Time t_H</div>
          <div className="text-sm font-bold font-mono text-amber-300 mt-1">
            {hubbleTimeGyr.toFixed(2)} Gyr
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400">Hubble Distance D_H</div>
          <div className="text-sm font-bold font-mono text-slate-200 mt-1">
            {hubbleDistanceMpc.toFixed(1)} Mpc
          </div>
        </div>
      </div>
    </div>
  );
};
