"use client";

import React from "react";
import { LocalGroupLayerVisibility } from "@/features/visualization/local-group/LocalGroupScene";

interface LocalGroupLayerControlsProps {
  layers: LocalGroupLayerVisibility;
  onChange: (layers: LocalGroupLayerVisibility) => void;
  className?: string;
}

export const LocalGroupLayerControls: React.FC<LocalGroupLayerControlsProps> = ({
  layers,
  onChange,
  className = "",
}) => {
  const toggle = (key: keyof LocalGroupLayerVisibility) => {
    onChange({
      ...layers,
      [key]: !layers[key],
    });
  };

  const controls: { key: keyof LocalGroupLayerVisibility; label: string; icon: string }[] = [
    { key: "galaxies", label: "Galaxies", icon: "🌌" },
    { key: "distanceShells", label: "Distance Shells", icon: "🌐" },
    { key: "relationshipLines", label: "Interactions", icon: "↔" },
    { key: "grid", label: "Reference Grid", icon: "📐" },
  ];

  return (
    <div
      className={`flex flex-wrap items-center gap-1.5 bg-slate-950/80 backdrop-blur-md border border-white/10 p-1.5 rounded-xl shadow-lg ${className}`}
    >
      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2">
        Layers:
      </span>
      {controls.map((c) => {
        const active = layers[c.key];
        return (
          <button
            key={c.key}
            onClick={() => toggle(c.key)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
              active
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                : "bg-slate-900/40 text-slate-400 border border-transparent hover:bg-slate-800"
            }`}
          >
            <span>{c.icon}</span>
            <span>{c.label}</span>
          </button>
        );
      })}
    </div>
  );
};
