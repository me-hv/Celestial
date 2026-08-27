"use client";

import React from "react";
import { Sparkles, ChevronDown } from "lucide-react";
import { StellarSystem } from "@/domain/stellar-system/types";
import { stellarSystemRepo } from "@/lib/data/stellar-system-repository";

export interface SystemSelectorProps {
  currentSystemSlug: string;
  onSelectSystem: (system: StellarSystem) => void;
  className?: string;
}

export function SystemSelector({
  currentSystemSlug,
  onSelectSystem,
  className = "",
}: SystemSelectorProps) {
  const allSystems = stellarSystemRepo.getAll();
  const currentSystem = stellarSystemRepo.getBySlug(currentSystemSlug) || allSystems[0];

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <label htmlFor="system-select" className="sr-only">
        Select Stellar System
      </label>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-celestial-muted/80 bg-celestial-surface/90 text-xs font-mono text-celestial-starlight backdrop-blur-md shadow-subtle-card">
        <Sparkles className="w-3.5 h-3.5 text-celestial-cyan" />
        <select
          id="system-select"
          value={currentSystem.slug}
          onChange={(e) => {
            const selected = stellarSystemRepo.getBySlug(e.target.value);
            if (selected) onSelectSystem(selected);
          }}
          className="bg-transparent text-celestial-starlight font-semibold text-xs focus:outline-none cursor-pointer pr-4 appearance-none"
        >
          {allSystems.map((sys) => (
            <option
              key={sys.id}
              value={sys.slug}
              className="bg-celestial-surface text-celestial-starlight"
            >
              {sys.name} ({sys.numberOfPlanets} Planets)
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-celestial-subtle pointer-events-none -ml-4" />
      </div>
    </div>
  );
}
