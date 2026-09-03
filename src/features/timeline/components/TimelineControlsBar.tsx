"use client";

import React from "react";
import { Clock, Search, Layers, List, Columns3 } from "lucide-react";
import { TemporalDomain, TemporalScale } from "@/domain/timeline/types";

export interface TimelineControlsBarProps {
  selectedDomain?: TemporalDomain;
  onDomainChange: (domain?: TemporalDomain) => void;
  selectedScale: TemporalScale;
  onScaleChange: (scale: TemporalScale) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: "CANVAS" | "LIST";
  onViewModeChange: (mode: "CANVAS" | "LIST") => void;
  totalEventsCount: number;
}

const ALL_DOMAINS: { id: TemporalDomain; label: string }[] = [
  { id: "COSMOS", label: "Cosmos" },
  { id: "ASTRONOMY", label: "Astronomy" },
  { id: "SPACE_MISSIONS", label: "Missions" },
  { id: "SCIENCE", label: "Science & Discoveries" },
  { id: "SPACE_WEATHER", label: "Space Weather" },
  { id: "DATA", label: "Datasets & Releases" },
];

const ALL_SCALES: { id: TemporalScale; label: string }[] = [
  { id: "YEARS", label: "Years" },
  { id: "DECADES", label: "Decades" },
  { id: "CENTURIES", label: "Centuries" },
  { id: "MILLIONS_OF_YEARS", label: "Deep Time" },
  { id: "BILLIONS_OF_YEARS", label: "Cosmological" },
];

export function TimelineControlsBar({
  selectedDomain,
  onDomainChange,
  selectedScale,
  onScaleChange,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  totalEventsCount,
}: TimelineControlsBarProps) {
  return (
    <div className="p-4 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/70 backdrop-blur-xl shadow-lg space-y-4">
      {/* Top Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-celestial-subtle" />
          <input
            type="text"
            placeholder="Search events (Apollo, Voyager, Carrington, Big Bang)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-celestial-void/60 border border-celestial-muted/70 text-xs font-mono text-celestial-starlight focus:outline-none focus:border-celestial-cyan"
          />
        </div>

        {/* View Mode & Scale Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Scale Selector */}
          <div className="flex items-center rounded-xl bg-celestial-void/60 border border-celestial-muted/60 p-1 gap-1">
            <span className="text-[10px] font-mono text-celestial-subtle px-2 flex items-center gap-1">
              <Clock className="w-3 h-3 text-celestial-cyan" /> Scale:
            </span>
            {ALL_SCALES.map((s) => (
              <button
                key={s.id}
                onClick={() => onScaleChange(s.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                  selectedScale === s.id
                    ? "bg-celestial-cyan/20 border border-celestial-cyan text-celestial-cyan font-bold"
                    : "text-celestial-subtle hover:text-celestial-starlight"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center rounded-xl bg-celestial-void/60 border border-celestial-muted/60 p-1 gap-1">
            <button
              onClick={() => onViewModeChange("CANVAS")}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition flex items-center gap-1.5 ${
                viewMode === "CANVAS"
                  ? "bg-celestial-surface border border-celestial-muted text-celestial-cyan font-bold"
                  : "text-celestial-subtle hover:text-celestial-starlight"
              }`}
            >
              <Columns3 className="w-3.5 h-3.5" /> Lanes
            </button>
            <button
              onClick={() => onViewModeChange("LIST")}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition flex items-center gap-1.5 ${
                viewMode === "LIST"
                  ? "bg-celestial-surface border border-celestial-muted text-celestial-cyan font-bold"
                  : "text-celestial-subtle hover:text-celestial-starlight"
              }`}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
          </div>
        </div>
      </div>

      {/* Domain Lane Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-celestial-muted/40">
        <span className="text-[10px] font-mono uppercase text-celestial-subtle whitespace-nowrap flex items-center gap-1">
          <Layers className="w-3 h-3 text-celestial-cyan" /> Domain:
        </span>
        <button
          onClick={() => onDomainChange(undefined)}
          className={`px-2.5 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition border ${
            selectedDomain === undefined
              ? "bg-celestial-cyan/20 border-celestial-cyan text-celestial-cyan font-bold"
              : "bg-celestial-void/60 border-celestial-muted/60 text-celestial-subtle hover:text-celestial-starlight"
          }`}
        >
          All Domains ({totalEventsCount})
        </button>
        {ALL_DOMAINS.map((d) => (
          <button
            key={d.id}
            onClick={() => onDomainChange(d.id === selectedDomain ? undefined : d.id)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition border ${
              selectedDomain === d.id
                ? "bg-celestial-cyan/20 border-celestial-cyan text-celestial-cyan font-bold"
                : "bg-celestial-void/60 border-celestial-muted/60 text-celestial-subtle hover:text-celestial-starlight"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>
    </div>
  );
}
