"use client";

import React from "react";
import { Sparkles, Orbit, Compass } from "lucide-react";
import { StarFilterOptions } from "@/lib/data/star-repository";

export interface StarFilterBarProps {
  filters: StarFilterOptions;
  onChangeFilters: (filters: StarFilterOptions) => void;
  className?: string;
}

const DISTANCE_PRESETS = [
  { label: "All Radius (25 pc)", value: undefined },
  { label: "< 5 pc (16.3 ly)", value: 5 },
  { label: "< 10 pc (32.6 ly)", value: 10 },
  { label: "< 20 pc (65.2 ly)", value: 20 },
];

const SPECTRAL_CLASSES = [
  { label: "All Classes", value: "ALL" },
  { label: "O / B", value: "B" },
  { label: "A (White)", value: "A" },
  { label: "F (Yellow-White)", value: "F" },
  { label: "G (Solar)", value: "G" },
  { label: "K (Orange)", value: "K" },
  { label: "M (Red Dwarf)", value: "M" },
  { label: "D (White Dwarf)", value: "D" },
];

export function StarFilterBar({ filters, onChangeFilters, className = "" }: StarFilterBarProps) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/85 backdrop-blur-xl shadow-subtle-card text-xs font-mono ${className}`}
    >
      {/* Distance Presets */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
        <span className="text-celestial-subtle flex items-center gap-1 shrink-0 mr-1">
          <Compass className="w-3.5 h-3.5 text-celestial-cyan" />
          <span className="hidden sm:inline">Distance:</span>
        </span>
        {DISTANCE_PRESETS.map((preset) => {
          const isSelected = filters.maxDistancePc === preset.value;
          return (
            <button
              key={preset.label}
              onClick={() => onChangeFilters({ ...filters, maxDistancePc: preset.value })}
              className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap border ${
                isSelected
                  ? "bg-celestial-cyan text-celestial-void font-bold border-celestial-cyan shadow-sm"
                  : "bg-celestial-deep/80 text-celestial-subtle border-celestial-muted/60 hover:text-celestial-starlight hover:border-celestial-muted"
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* Spectral Class Filter & Planetary Status Toggle */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Spectral Dropdown */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-celestial-muted/80 bg-celestial-deep/80">
          <Sparkles className="w-3.5 h-3.5 text-celestial-amber" />
          <select
            aria-label="Filter by Spectral Class"
            value={filters.spectralClass || "ALL"}
            onChange={(e) =>
              onChangeFilters({
                ...filters,
                spectralClass: e.target.value === "ALL" ? undefined : e.target.value,
              })
            }
            className="bg-transparent text-celestial-starlight font-semibold text-xs focus:outline-none cursor-pointer"
          >
            {SPECTRAL_CLASSES.map((sp) => (
              <option
                key={sp.value}
                value={sp.value}
                className="bg-celestial-surface text-celestial-starlight"
              >
                {sp.label}
              </option>
            ))}
          </select>
        </div>

        {/* Known Planetary System Toggle */}
        <button
          onClick={() =>
            onChangeFilters({
              ...filters,
              hasPlanetarySystem: filters.hasPlanetarySystem === undefined ? true : undefined,
            })
          }
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
            filters.hasPlanetarySystem
              ? "bg-celestial-cyan/20 text-celestial-cyan border-celestial-cyan font-bold"
              : "bg-celestial-deep/80 text-celestial-subtle border-celestial-muted/60 hover:text-celestial-starlight hover:border-celestial-muted"
          }`}
          title="Toggle stars with known confirmed exoplanets"
        >
          <Orbit className="w-3.5 h-3.5" />
          <span>Has Exoplanets</span>
        </button>
      </div>
    </div>
  );
}
