"use client";

import React from "react";
import Link from "next/link";
import { CosmicEpoch } from "@/domain/cosmic-time/types";
import { EPOCH_COLOR_MAP } from "@/features/visualization/cosmic-time/cosmic-time-renderer";

interface CosmicEpochCardProps {
  epoch: CosmicEpoch;
  isSelected?: boolean;
  onSelect?: (slug: string) => void;
}

export const CosmicEpochCard: React.FC<CosmicEpochCardProps> = ({
  epoch,
  isSelected = false,
  onSelect,
}) => {
  const colorConfig = EPOCH_COLOR_MAP[epoch.type] || { hex: "#38bdf8" };

  return (
    <div
      onClick={() => onSelect && onSelect(epoch.slug)}
      className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
        isSelected
          ? "bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-950/40"
          : "bg-slate-950/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60"
      }`}
      data-testid={`cosmic-epoch-card-${epoch.slug}`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: colorConfig.hex }}
            />
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              EPOCH {epoch.orderIndex} • {epoch.category.replace(/_/g, " ")}
            </span>
          </div>

          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
              epoch.observationStatus === "OBSERVED"
                ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                : epoch.observationStatus === "INFERRED"
                  ? "bg-cyan-950/40 border-cyan-500/30 text-cyan-300"
                  : "bg-purple-950/40 border-purple-500/30 text-purple-300"
            }`}
          >
            {epoch.observationStatus}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-100 tracking-tight">{epoch.name}</h3>
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{epoch.summary}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/60 text-[11px] font-mono">
        <div>
          <span className="text-slate-500 block">Cosmic Age:</span>
          <span className="text-slate-300 font-semibold">
            {epoch.ageRange.minDisplay} – {epoch.ageRange.maxDisplay}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block">Lookback:</span>
          <span className="text-cyan-400 font-semibold">
            {epoch.lookbackTimeRangeGyr.minGyr.toFixed(1)} –{" "}
            {epoch.lookbackTimeRangeGyr.maxGyr.toFixed(1)} Gyr
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800/40">
        <span className="text-[10px] font-mono text-slate-500">
          {epoch.boundaryConfidence.replace(/_/g, " ")}
        </span>
        <Link
          href={`/cosmic-time/${epoch.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1"
        >
          Details →
        </Link>
      </div>
    </div>
  );
};
