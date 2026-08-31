"use client";

import React, { useState } from "react";
import { CosmicEpoch } from "@/domain/cosmic-time/types";
import { defaultCosmology } from "@/lib/astronomy/cosmology/cosmology-calculator";
import { formatCosmicAge } from "@/lib/astronomy/cosmology/cosmic-timeline";

interface CosmicTimeSliderProps {
  lookbackGyr: number;
  onLookbackChange: (lookbackGyr: number) => void;
  epochs: CosmicEpoch[];
  selectedEpoch?: CosmicEpoch;
  onSelectEpoch?: (slug: string) => void;
}

type ControlMode = "TIME" | "REDSHIFT" | "SCALE_FACTOR";

export const CosmicTimeSlider: React.FC<CosmicTimeSliderProps> = ({
  lookbackGyr,
  onLookbackChange,
  epochs,
  selectedEpoch,
  onSelectEpoch,
}) => {
  const [controlMode, setControlMode] = useState<ControlMode>("TIME");
  const universeAgeGyr = defaultCosmology.calculateUniverseAgeGyr();

  const cosmicAgeGyr = Math.max(0, universeAgeGyr - lookbackGyr);
  const redshiftZ = defaultCosmology.cosmicAgeToRedshift(Math.max(0.0001, cosmicAgeGyr));
  const scaleFactorA = defaultCosmology.redshiftToScaleFactor(redshiftZ);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onLookbackChange(val);
  };

  const handleRedshiftInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const z = parseFloat(e.target.value);
    if (!isNaN(z) && z >= 0) {
      const tL = defaultCosmology.calculateLookbackTimeGyr(z);
      onLookbackChange(tL);
    }
  };

  const handleScaleFactorInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = parseFloat(e.target.value);
    if (!isNaN(a) && a > 0 && a <= 1.0) {
      const z = defaultCosmology.scaleFactorToRedshift(a);
      const tL = defaultCosmology.calculateLookbackTimeGyr(z);
      onLookbackChange(tL);
    }
  };

  return (
    <div
      className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md flex flex-col gap-4"
      data-testid="cosmic-time-slider-container"
    >
      {/* Mode Toggles & Readout */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-slate-400">
            CONTROLLING QUANTITY:
          </span>
          <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setControlMode("TIME")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                controlMode === "TIME"
                  ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              LOOKBACK TIME
            </button>
            <button
              onClick={() => setControlMode("REDSHIFT")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                controlMode === "REDSHIFT"
                  ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              REDSHIFT z
            </button>
            <button
              onClick={() => setControlMode("SCALE_FACTOR")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                controlMode === "SCALE_FACTOR"
                  ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              SCALE FACTOR a
            </button>
          </div>
        </div>

        {/* Quick Epoch Preset Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="epoch-select" className="text-xs font-mono text-slate-400">
            EPOCH:
          </label>
          <select
            id="epoch-select"
            value={selectedEpoch?.slug ?? ""}
            onChange={(e) => {
              const epoch = epochs.find((ep) => ep.slug === e.target.value);
              if (epoch) {
                const avgLookback =
                  (epoch.lookbackTimeRangeGyr.minGyr + epoch.lookbackTimeRangeGyr.maxGyr) / 2.0;
                onLookbackChange(avgLookback);
                if (onSelectEpoch) onSelectEpoch(epoch.slug);
              }
            }}
            className="bg-slate-950 border border-slate-800 text-cyan-300 text-xs font-mono rounded-lg px-2.5 py-1 focus:outline-none focus:border-cyan-500"
          >
            {epochs.map((ep) => (
              <option key={ep.id} value={ep.slug}>
                {ep.orderIndex}. {ep.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Interactive Scrub Slider */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>PRESENT (t = 0 Gyr)</span>
          <span className="text-cyan-400 font-bold text-sm">
            {lookbackGyr.toFixed(2)} Gyr Lookback • Cosmic Age:{" "}
            {formatCosmicAge(cosmicAgeGyr * 1e9)}
          </span>
          <span>BIG BANG (13.8 Gyr)</span>
        </div>

        <input
          type="range"
          min={0}
          max={universeAgeGyr}
          step={0.01}
          value={lookbackGyr}
          onChange={handleSliderChange}
          className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          aria-label="Cosmic time lookback slider"
        />

        {/* Milestone Tick Marks */}
        <div className="flex justify-between text-[10px] font-mono text-slate-500 px-1 pt-1">
          <span>z = 0 (Today)</span>
          <span>z ~ 0.4 (Acc.)</span>
          <span>z ~ 2 (Noon)</span>
          <span>z ~ 6 (Reion.)</span>
          <span>z ~ 20 (Dawn)</span>
          <span>z = 1089 (CMB)</span>
        </div>
      </div>

      {/* Direct Numeric Input Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
        <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400">Lookback Time (Gyr)</span>
          <input
            type="number"
            min={0}
            max={universeAgeGyr}
            step={0.1}
            value={Number(lookbackGyr.toFixed(2))}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) onLookbackChange(Math.max(0, Math.min(universeAgeGyr, val)));
            }}
            className="bg-transparent text-sm font-mono text-slate-200 focus:outline-none focus:text-cyan-300"
          />
        </div>

        <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400">Redshift (z)</span>
          <input
            type="number"
            min={0}
            max={1500}
            step={0.05}
            value={Number(redshiftZ.toFixed(3))}
            onChange={handleRedshiftInput}
            className="bg-transparent text-sm font-mono text-slate-200 focus:outline-none focus:text-cyan-300"
          />
        </div>

        <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400">Scale Factor a = 1/(1+z)</span>
          <input
            type="number"
            min={0.0001}
            max={1.0}
            step={0.01}
            value={Number(scaleFactorA.toFixed(4))}
            onChange={handleScaleFactorInput}
            className="bg-transparent text-sm font-mono text-slate-200 focus:outline-none focus:text-cyan-300"
          />
        </div>
      </div>
    </div>
  );
};
