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
      <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/[0.1] bg-celestial-surface/90 text-xs font-mono text-celestial-starlight backdrop-blur-xl shadow-xl shadow-black/30">
        <Sparkles className="w-3.5 h-3.5 text-celestial-cyan shrink-0" />
        <select
          id="system-select"
          value={currentSystem.slug}
          onChange={(e) => {
            const selected = stellarSystemRepo.getBySlug(e.target.value);
            if (selected) onSelectSystem(selected);
          }}
          className="bg-transparent text-celestial-starlight font-semibold text-xs focus:outline-none cursor-pointer pr-5 appearance-none"
        >
          {allSystems.map((sys) => (
            <option
              key={sys.id}
              value={sys.slug}
              className="bg-celestial-deep text-celestial-starlight"
            >
              {sys.name} ({sys.numberOfPlanets} Planets)
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-celestial-subtle pointer-events-none -ml-4 shrink-0" />
      </div>
    </div>
  );
}
