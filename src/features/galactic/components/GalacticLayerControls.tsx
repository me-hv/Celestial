"use client";

import React from "react";
import { Layers, Eye, EyeOff } from "lucide-react";
import { GalacticLayerVisibility } from "@/features/visualization/galactic/MilkyWayScene";

export interface GalacticLayerControlsProps {
  layers: GalacticLayerVisibility;
  onChangeLayers: (layers: GalacticLayerVisibility) => void;
  className?: string;
}

export function GalacticLayerControls({
  layers,
  onChangeLayers,
  className = "",
}: GalacticLayerControlsProps) {
  const toggle = (key: keyof GalacticLayerVisibility) => {
    onChangeLayers({
      ...layers,
      [key]: !layers[key],
    });
  };

  const ITEMS: Array<{ key: keyof GalacticLayerVisibility; label: string; activeColor: string }> = [
    {
      key: "showDisk",
      label: "Galactic Disk",
      activeColor: "border-sky-500/40 text-sky-400 bg-sky-500/10",
    },
    {
      key: "showPlaneGrid",
      label: "Galactic Plane Grid",
      activeColor: "border-indigo-500/40 text-indigo-400 bg-indigo-500/10",
    },
    {
      key: "showBulgeBar",
      label: "Bulge & Central Bar",
      activeColor: "border-amber-500/40 text-amber-400 bg-amber-500/10",
    },
    {
      key: "showSpiralArms",
      label: "Spiral Arms",
      activeColor: "border-violet-500/40 text-violet-400 bg-violet-500/10",
    },
    {
      key: "showSunPosition",
      label: "Solar Position (Sun)",
      activeColor: "border-yellow-500/40 text-yellow-400 bg-yellow-500/10",
    },
    {
      key: "showNearbyStars",
      label: "Nearby Stars",
      activeColor: "border-cyan-500/40 text-cyan-400 bg-cyan-500/10",
    },
    {
      key: "showStellarSystems",
      label: "Exoplanetary Systems",
      activeColor: "border-purple-500/40 text-purple-400 bg-purple-500/10",
    },
    {
      key: "showDeepSkyObjects",
      label: "Deep Sky Objects",
      activeColor: "border-rose-500/40 text-rose-400 bg-rose-500/10",
    },
  ];

  return (
    <div
      className={`flex flex-wrap items-center gap-1.5 p-2.5 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/85 backdrop-blur-xl shadow-subtle-card text-xs font-mono select-none ${className}`}
    >
      <div className="flex items-center gap-1 text-celestial-subtle mr-1 shrink-0">
        <Layers className="w-3.5 h-3.5 text-celestial-cyan" />
        <span className="hidden sm:inline">Layers:</span>
      </div>

      {ITEMS.map(({ key, label, activeColor }) => {
        const isActive = layers[key];
        return (
          <button
            key={key}
            onClick={() => toggle(key)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-all ${
              isActive
                ? `${activeColor} font-semibold shadow-sm`
                : "border-celestial-muted/60 text-celestial-subtle bg-celestial-deep/60 hover:text-celestial-starlight"
            }`}
          >
            {isActive ? (
              <Eye className="w-3 h-3 shrink-0" />
            ) : (
              <EyeOff className="w-3 h-3 shrink-0 opacity-50" />
            )}
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
