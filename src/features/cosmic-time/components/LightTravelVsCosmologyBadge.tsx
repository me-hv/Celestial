"use client";

import React from "react";
import Link from "next/link";
import { ObservationTimeModel } from "@/domain/cosmic-time/types";

interface LightTravelVsCosmologyBadgeProps {
  model: ObservationTimeModel;
  objectName?: string;
  showTimelineLink?: boolean;
}

export const LightTravelVsCosmologyBadge: React.FC<LightTravelVsCosmologyBadgeProps> = ({
  model,
  objectName,
  showTimelineLink = true,
}) => {
  if (model.timeType === "LIGHT_TRAVEL_TIME") {
    return (
      <div
        className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col gap-2.5 text-slate-200"
        data-testid="light-travel-time-badge"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-xs font-mono font-semibold text-cyan-300 uppercase tracking-wider">
              KINEMATIC LIGHT-TRAVEL TIME (t = d / c)
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
            LOCAL / BOUND SYSTEM
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold font-mono text-slate-100">
            {model.lookbackYears < 1000
              ? `${model.lookbackYears.toFixed(1)} Years`
              : model.lookbackYears < 1e6
                ? `${(model.lookbackYears / 1000).toFixed(1)} Thousand Years`
                : `${(model.lookbackYears / 1e6).toFixed(2)} Million Years`}
          </span>
          <span className="text-xs font-mono text-slate-400">
            ago when light left {objectName ?? "this object"}
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">{model.scientificExplanation}</p>
      </div>
    );
  }

  // COSMOLOGICAL_LOOKBACK_TIME
  return (
    <div
      className="p-4 rounded-xl bg-slate-900/90 border border-purple-500/40 shadow-lg shadow-purple-950/30 flex flex-col gap-3 text-slate-200"
      data-testid="cosmological-lookback-badge"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-xs font-mono font-semibold text-purple-300 uppercase tracking-wider">
            COSMOLOGICAL LOOKBACK TIME (ΛCDM FLRW EXPANSION)
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300 font-semibold">
          EXTRAGALACTIC z = {model.redshiftZ?.toFixed(4)}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-1 text-xs font-mono">
        <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
          <span className="text-slate-500 block text-[10px]">Lookback Time:</span>
          <span className="text-cyan-400 font-bold text-sm">
            {model.lookbackGyr.toFixed(2)} Billion yr
          </span>
        </div>

        <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
          <span className="text-slate-500 block text-[10px]">Cosmic Age Then:</span>
          <span className="text-purple-300 font-bold text-sm">
            ~{model.cosmicAgeGyr?.toFixed(2)} Billion yr
          </span>
        </div>

        <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
          <span className="text-slate-500 block text-[10px]">Scale Factor a:</span>
          <span className="text-emerald-300 font-bold text-sm">
            a ≈ {model.scaleFactorA?.toFixed(3)}
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">{model.scientificExplanation}</p>

      {showTimelineLink && model.redshiftZ !== undefined && (
        <div className="flex justify-end pt-1">
          <Link
            href={`/cosmic-time?z=${model.redshiftZ}`}
            className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
          >
            View in Cosmic Timeline →
          </Link>
        </div>
      )}
    </div>
  );
};
