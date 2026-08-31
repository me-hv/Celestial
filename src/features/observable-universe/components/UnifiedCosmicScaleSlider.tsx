"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export interface CosmicScaleStage {
  id: string;
  name: string;
  shortLabel: string;
  physicalScale: string;
  routeHref: string;
  redshiftApprox?: string;
  description: string;
}

export const COSMIC_SCALE_STAGES: CosmicScaleStage[] = [
  {
    id: "stage-earth",
    name: "Earth & Terrestrial Origin",
    shortLabel: "Earth",
    physicalScale: "12,742 km",
    routeHref: "/explore",
    description: "The planetary observer origin (r = 0).",
  },
  {
    id: "stage-solar-system",
    name: "Solar System",
    shortLabel: "Solar System",
    physicalScale: "100 AU (~0.0015 ly)",
    routeHref: "/systems/solar-system",
    description: "Heliosphere and planetary orbits.",
  },
  {
    id: "stage-stars",
    name: "Stellar Neighborhood",
    shortLabel: "Stars",
    physicalScale: "10 pc (32.6 ly)",
    routeHref: "/stars",
    description: "Nearest stellar systems within the local interstellar cloud.",
  },
  {
    id: "stage-milky-way",
    name: "Milky Way Galaxy",
    shortLabel: "Milky Way",
    physicalScale: "30 kpc (100,000 ly)",
    routeHref: "/milky-way",
    description: "Barred spiral galaxy hosting 100-400 billion stars.",
  },
  {
    id: "stage-local-group",
    name: "Local Group of Galaxies",
    shortLabel: "Local Group",
    physicalScale: "3 Mpc (10 Mly)",
    routeHref: "/local-group",
    description: "Gravitationally bound system including Andromeda (M31) & Triangulum (M33).",
  },
  {
    id: "stage-cosmic-web",
    name: "Cosmic Web & Superclusters",
    shortLabel: "Cosmic Web",
    physicalScale: "100 Mpc (326 Mly)",
    routeHref: "/cosmic-web",
    description: "Large-scale structure filaments, clusters, and cosmological voids.",
  },
  {
    id: "stage-cosmic-noon",
    name: "Distant Universe (Cosmic Noon)",
    shortLabel: "Cosmic Noon",
    physicalScale: "5.2 Gpc (17 Gly)",
    redshiftApprox: "z ~ 2",
    routeHref: "/cosmic-time",
    description: "Peak epoch of galaxy assembly and star formation rate density.",
  },
  {
    id: "stage-cosmic-dawn",
    name: "Cosmic Dawn (First Stars & JWST Galaxies)",
    shortLabel: "Cosmic Dawn",
    physicalScale: "10 Gpc (32 Gly)",
    redshiftApprox: "z ~ 10-15",
    routeHref: "/observable-universe/galaxy-jades-gs-z14-0",
    description: "JWST frontier with early galaxy candidates and Population III stars.",
  },
  {
    id: "stage-cmb",
    name: "CMB Last-Scattering Surface",
    shortLabel: "CMB Surface",
    physicalScale: "14.0 Gpc (45.7 Gly)",
    redshiftApprox: "z = 1089",
    routeHref: "/observable-universe/cmb",
    description: "Surface of photon decoupling and thermal Big Bang relic radiation.",
  },
  {
    id: "stage-observable-universe",
    name: "Particle Horizon (Observable Universe)",
    shortLabel: "Observable Universe",
    physicalScale: "14.25 Gpc (46.5 Gly)",
    redshiftApprox: "z → ∞",
    routeHref: "/observable-universe/horizon",
    description: "Outer boundary of information and causal observability.",
  },
];

interface UnifiedCosmicScaleSliderProps {
  currentStageIndex: number;
  onStageChange?: (index: number) => void;
}

export const UnifiedCosmicScaleSlider: React.FC<UnifiedCosmicScaleSliderProps> = ({
  currentStageIndex,
  onStageChange,
}) => {
  const activeStage =
    COSMIC_SCALE_STAGES[currentStageIndex] || COSMIC_SCALE_STAGES[COSMIC_SCALE_STAGES.length - 1];

  return (
    <div
      className="flex flex-col gap-3 p-4 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md font-mono"
      data-testid="unified-cosmic-scale-slider"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            UNIFIED COSMIC SCALE HIERARCHY
          </span>
        </div>
        <span className="text-xs text-slate-400">
          Scale {currentStageIndex + 1} of {COSMIC_SCALE_STAGES.length}
        </span>
      </div>

      {/* Interactive Step Track */}
      <div className="relative flex items-center justify-between w-full pt-2 pb-1">
        <div className="absolute left-0 right-0 h-1 bg-slate-800 rounded-full" />
        <div
          className="absolute left-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-rose-500 rounded-full transition-all duration-300"
          style={{ width: `${(currentStageIndex / (COSMIC_SCALE_STAGES.length - 1)) * 100}%` }}
        />

        {COSMIC_SCALE_STAGES.map((stage, idx) => {
          const isActive = idx === currentStageIndex;
          const isPassed = idx < currentStageIndex;

          return (
            <button
              key={stage.id}
              onClick={() => onStageChange?.(idx)}
              className={`relative z-10 w-4 h-4 rounded-full border-2 transition-all ${
                isActive
                  ? "bg-cyan-400 border-white scale-125 shadow-lg shadow-cyan-400/50"
                  : isPassed
                    ? "bg-cyan-600 border-cyan-400"
                    : "bg-slate-900 border-slate-700 hover:border-slate-500"
              }`}
              title={`${stage.name} (${stage.physicalScale})`}
            />
          );
        })}
      </div>

      {/* Active Stage Dossier & Bridge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-cyan-300">{activeStage.name}</span>
            {activeStage.redshiftApprox && (
              <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[10px]">
                {activeStage.redshiftApprox}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Physical Comoving Scale:{" "}
            <span className="text-slate-200 font-bold">{activeStage.physicalScale}</span> •{" "}
            {activeStage.description}
          </p>
        </div>

        <Link
          href={activeStage.routeHref}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 text-xs transition-colors shrink-0"
        >
          <span>Open Explorer</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
