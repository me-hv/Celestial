import React from "react";
import { CosmicWebLayerVisibility } from "@/features/visualization/cosmic-web/CosmicWebScene";

interface CosmicWebLayerControlsProps {
  layers: CosmicWebLayerVisibility;
  onChange: (updated: CosmicWebLayerVisibility) => void;
  className?: string;
}

export function CosmicWebLayerControls({
  layers,
  onChange,
  className = "",
}: CosmicWebLayerControlsProps) {
  const toggle = (key: keyof CosmicWebLayerVisibility) => {
    onChange({
      ...layers,
      [key]: !layers[key],
    });
  };

  return (
    <div
      className={`flex flex-col gap-2 rounded-xl border border-white/10 bg-slate-950/80 p-3.5 shadow-xl backdrop-blur-md text-xs font-mono ${className}`}
    >
      <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block border-b border-white/5 pb-1.5">
        Cosmic Web Layers
      </span>

      <div className="grid grid-cols-2 gap-1.5">
        <button
          onClick={() => toggle("showClusters")}
          className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 border transition-all ${
            layers.showClusters
              ? "bg-amber-500/15 border-amber-500/30 text-amber-300 font-semibold"
              : "bg-slate-900/40 border-white/5 text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>Clusters</span>
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
        </button>

        <button
          onClick={() => toggle("showGroups")}
          className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 border transition-all ${
            layers.showGroups
              ? "bg-sky-500/15 border-sky-500/30 text-sky-300 font-semibold"
              : "bg-slate-900/40 border-white/5 text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>Groups</span>
          <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
        </button>

        <button
          onClick={() => toggle("showSuperclusters")}
          className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 border transition-all ${
            layers.showSuperclusters
              ? "bg-purple-500/15 border-purple-500/30 text-purple-300 font-semibold"
              : "bg-slate-900/40 border-white/5 text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>Superclusters</span>
          <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
        </button>

        <button
          onClick={() => toggle("showFilaments")}
          className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 border transition-all ${
            layers.showFilaments
              ? "bg-teal-500/15 border-teal-500/30 text-teal-300 font-semibold"
              : "bg-slate-900/40 border-white/5 text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>Filaments</span>
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
        </button>

        <button
          onClick={() => toggle("showVoids")}
          className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 border transition-all ${
            layers.showVoids
              ? "bg-slate-700/40 border-slate-600/40 text-slate-200 font-semibold"
              : "bg-slate-900/40 border-white/5 text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>Cosmic Voids</span>
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
        </button>

        <button
          onClick={() => toggle("showSheets")}
          className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 border transition-all ${
            layers.showSheets
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300 font-semibold"
              : "bg-slate-900/40 border-white/5 text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>Sheets & Walls</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </button>

        <button
          onClick={() => toggle("showDistanceShells")}
          className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 border transition-all ${
            layers.showDistanceShells
              ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-300 font-semibold"
              : "bg-slate-900/40 border-white/5 text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>Distance Shells</span>
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
        </button>

        <button
          onClick={() => toggle("showSupergalacticGrid")}
          className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 border transition-all ${
            layers.showSupergalacticGrid
              ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-300 font-semibold"
              : "bg-slate-900/40 border-white/5 text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>Grid (SGB=0)</span>
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
        </button>
      </div>

      {/* Coordinate system toggle */}
      <div className="border-t border-white/5 pt-2 flex items-center justify-between text-[11px]">
        <span className="text-slate-400">Frame:</span>
        <button
          onClick={() => toggle("useSupergalacticCoordinates")}
          className="rounded-lg bg-slate-900 px-2 py-1 text-cyan-300 border border-white/10 hover:bg-slate-800 transition-colors"
        >
          {layers.useSupergalacticCoordinates
            ? "Supergalactic (SGL, SGB)"
            : "Galactocentric Megaparsec"}
        </button>
      </div>
    </div>
  );
}
