"use client";

import React from "react";
import { Sparkles, Layers, BookOpen } from "lucide-react";
import { DeepSkyFilterOptions } from "@/lib/data/deep-sky-repository";

export interface DeepSkyFilterBarProps {
  filters: DeepSkyFilterOptions;
  onChangeFilters: (filters: DeepSkyFilterOptions) => void;
  className?: string;
}

const CLASSIFICATION_PRESETS = [
  { label: "All Deep Sky", value: "ALL" },
  { label: "Galaxies 🌌", value: "GALAXY" },
  { label: "Nebulae ✨", value: "NEBULA" },
  { label: "Star Clusters ⭐", value: "STAR_CLUSTER" },
  { label: "Planetary Nebulae 🌀", value: "PLANETARY_NEBULA" },
  { label: "Supernova Remnants 💥", value: "SUPERNOVA_REMNANT" },
];

const CATALOG_PRESETS = [
  { label: "All Catalogs", value: "ALL" },
  { label: "Messier (M)", value: "MESSIER" },
  { label: "NGC", value: "NGC" },
  { label: "IC", value: "IC" },
  { label: "Caldwell (C)", value: "CALDWELL" },
];

export function DeepSkyFilterBar({
  filters,
  onChangeFilters,
  className = "",
}: DeepSkyFilterBarProps) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/85 backdrop-blur-xl shadow-subtle-card text-xs font-mono ${className}`}
    >
      {/* Classification Presets */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
        <span className="text-celestial-subtle flex items-center gap-1 shrink-0 mr-1">
          <Layers className="w-3.5 h-3.5 text-celestial-violet" />
          <span className="hidden sm:inline">Type:</span>
        </span>
        {CLASSIFICATION_PRESETS.map((preset) => {
          const isSelected = (filters.classificationCode || "ALL") === preset.value;
          return (
            <button
              key={preset.label}
              onClick={() =>
                onChangeFilters({
                  ...filters,
                  classificationCode:
                    preset.value === "ALL"
                      ? undefined
                      : (preset.value as DeepSkyFilterOptions["classificationCode"]),
                })
              }
              className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap border ${
                isSelected
                  ? "bg-celestial-violet text-celestial-void font-bold border-celestial-violet shadow-sm"
                  : "bg-celestial-deep/80 text-celestial-subtle border-celestial-muted/60 hover:text-celestial-starlight hover:border-celestial-muted"
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* Catalog Selector */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-celestial-muted/80 bg-celestial-deep/80">
          <BookOpen className="w-3.5 h-3.5 text-celestial-cyan" />
          <select
            aria-label="Filter by Catalog"
            value={filters.catalog || "ALL"}
            onChange={(e) =>
              onChangeFilters({
                ...filters,
                catalog:
                  e.target.value === "ALL"
                    ? undefined
                    : (e.target.value as DeepSkyFilterOptions["catalog"]),
              })
            }
            className="bg-transparent text-celestial-starlight font-semibold text-xs focus:outline-none cursor-pointer"
          >
            {CATALOG_PRESETS.map((cat) => (
              <option
                key={cat.value}
                value={cat.value}
                className="bg-celestial-surface text-celestial-starlight"
              >
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Max Apparent Magnitude Filter Preset */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-celestial-muted/80 bg-celestial-deep/80">
          <Sparkles className="w-3.5 h-3.5 text-celestial-amber" />
          <select
            aria-label="Filter by Maximum Magnitude"
            value={filters.maxMagnitudeV !== undefined ? String(filters.maxMagnitudeV) : "ALL"}
            onChange={(e) =>
              onChangeFilters({
                ...filters,
                maxMagnitudeV: e.target.value === "ALL" ? undefined : Number(e.target.value),
              })
            }
            className="bg-transparent text-celestial-starlight font-semibold text-xs focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-celestial-surface text-celestial-starlight">
              All Magnitudes
            </option>
            <option value="6.0" className="bg-celestial-surface text-celestial-starlight">
              Naked-Eye (≤ 6.0 mag)
            </option>
            <option value="9.0" className="bg-celestial-surface text-celestial-starlight">
              Binocular (≤ 9.0 mag)
            </option>
            <option value="12.0" className="bg-celestial-surface text-celestial-starlight">
              Small Telescope (≤ 12.0 mag)
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}
