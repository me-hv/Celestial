"use client";

import React from "react";
import { CosmicHorizon } from "@/domain/observable-universe/types";

interface HorizonComparisonCardProps {
  horizons: CosmicHorizon[];
}

export const HorizonComparisonCard: React.FC<HorizonComparisonCardProps> = ({ horizons }) => {
  return (
    <div
      className="flex flex-col gap-3 p-4 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md font-mono"
      data-testid="horizon-comparison-card"
    >
      <div className="border-b border-slate-800 pb-2">
        <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">
          COSMOLOGICAL HORIZON ANALYSIS
        </span>
        <h3 className="text-base font-bold text-slate-100">
          Comparing Cosmic Horizons & Boundaries
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Why the Observable Universe radius is 46.5 Billion Light-Years, not 13.8 Billion
          Light-Years.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {horizons.map((horizon) => (
          <div
            key={horizon.slug}
            className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60 flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">{horizon.name}</span>
              <span className="text-xs font-bold text-rose-400">
                {horizon.comovingRadiusGly.toFixed(1)} Gly
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">{horizon.summary}</p>
            {horizon.commonMisconception && (
              <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-200">
                {horizon.commonMisconception}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
