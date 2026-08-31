"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Globe, Radio, Eye, Sliders } from "lucide-react";
import { Container } from "@/components/ui/container";
import { observableUniverseRepo } from "@/lib/data/observable-universe-repository";
import { ObservationalLandmark, RedshiftShell } from "@/domain/observable-universe/types";
import {
  ObservableUniverseScene,
  DEFAULT_OBSERVABLE_LAYERS,
  ObservableUniverseLayers,
} from "@/features/visualization/cosmic-horizon/ObservableUniverseScene";
import { ObservableUniverseMapView2D } from "@/features/visualization/cosmic-horizon/ObservableUniverseMapView2D";
import { ObservableTelemetryPanel } from "@/features/observable-universe/components/ObservableTelemetryPanel";
import { UnifiedCosmicScaleSlider } from "@/features/observable-universe/components/UnifiedCosmicScaleSlider";
import { RedshiftShellCard } from "@/features/observable-universe/components/RedshiftShellCard";

export default function ObservableUniversePage() {
  const shells = observableUniverseRepo.getAllShells();
  const landmarks = observableUniverseRepo.getAllLandmarks();
  const horizons = observableUniverseRepo.getAllHorizons();

  const [viewMode, setViewMode] = useState<"3D" | "2D">("3D");
  const [selectedLandmark, setSelectedLandmark] = useState<ObservationalLandmark | null>(
    landmarks.find((l) => l.slug === "galaxy-jades-gs-z14-0") || landmarks[0]
  );
  const [selectedShell, setSelectedShell] = useState<RedshiftShell | null>(null);
  const [layers, setLayers] = useState<ObservableUniverseLayers>(DEFAULT_OBSERVABLE_LAYERS);
  const [scaleStageIndex, setScaleStageIndex] = useState<number>(9); // Observable Universe stage by default

  const handleSelectLandmark = (landmark: ObservationalLandmark) => {
    setSelectedLandmark(landmark);
    setSelectedShell(null);
  };

  const handleSelectShell = (shell: RedshiftShell) => {
    setSelectedShell(shell);
    setSelectedLandmark(null);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 font-sans">
      {/* Header Bar */}
      <section className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <Container
          size="xl"
          className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-1">
              <Globe className="w-3.5 h-3.5" />
              <span>Phase 9 • The Ultimate Cosmological Frame</span>
            </div>
            <h1 className="text-xl md:text-2xl font-mono font-bold tracking-tight text-white flex items-center gap-2.5">
              Observable Universe &amp; Cosmic Horizons
            </h1>
            <p className="text-xs md:text-sm text-slate-400 font-mono mt-0.5">
              Explore the boundaries of observability: Comoving Radius ≈ 46.5 Billion Light-Years
              (14.25 Gpc) • CMB z ≈ 1089
            </p>
          </div>

          {/* Quick Sub-Explorer Bridges */}
          <div className="flex items-center gap-2">
            <Link
              href="/observable-universe/cmb"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-300 border border-orange-500/30 hover:bg-orange-500/20 text-xs font-mono transition-colors"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>CMB Surface</span>
            </Link>

            <Link
              href="/observable-universe/horizon"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 text-xs font-mono transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Cosmic Horizons</span>
            </Link>

            <Link
              href="/observable-universe/redshift"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 text-xs font-mono transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Redshift Workbench</span>
            </Link>
          </div>
        </Container>
      </section>

      {/* Main Workspace */}
      <Container size="xl" className="py-6 flex flex-col gap-6 flex-1">
        {/* Unified Cosmic Scale Slider */}
        <UnifiedCosmicScaleSlider
          currentStageIndex={scaleStageIndex}
          onStageChange={(idx) => setScaleStageIndex(idx)}
        />

        {/* Viewport & Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Visualizer Area (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* View Mode Toggle & Layer Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setViewMode("3D")}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                    viewMode === "3D"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-md shadow-cyan-950/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  3D Space &amp; Horizons
                </button>
                <button
                  onClick={() => setViewMode("2D")}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                    viewMode === "2D"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-md shadow-cyan-950/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  2D Spacetime Graph
                </button>
              </div>

              {/* 3D Layer Toggles */}
              {viewMode === "3D" && (
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-slate-300">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={layers.showRedshiftShells}
                      onChange={(e) =>
                        setLayers((prev) => ({ ...prev, showRedshiftShells: e.target.checked }))
                      }
                      className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                    />
                    <span>Shells</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={layers.showCMBSphere}
                      onChange={(e) =>
                        setLayers((prev) => ({ ...prev, showCMBSphere: e.target.checked }))
                      }
                      className="rounded border-slate-700 text-orange-500 focus:ring-0"
                    />
                    <span>CMB</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={layers.showParticleHorizon}
                      onChange={(e) =>
                        setLayers((prev) => ({ ...prev, showParticleHorizon: e.target.checked }))
                      }
                      className="rounded border-slate-700 text-rose-500 focus:ring-0"
                    />
                    <span>Horizon</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={layers.showLandmarkMarkers}
                      onChange={(e) =>
                        setLayers((prev) => ({ ...prev, showLandmarkMarkers: e.target.checked }))
                      }
                      className="rounded border-slate-700 text-amber-500 focus:ring-0"
                    />
                    <span>Landmarks</span>
                  </label>
                </div>
              )}
            </div>

            {/* Viewport Canvas Container */}
            <div className="relative w-full h-[540px] rounded-xl border border-slate-800 overflow-hidden shadow-2xl bg-slate-950">
              {viewMode === "3D" ? (
                <ObservableUniverseScene
                  shells={shells}
                  landmarks={landmarks}
                  horizons={horizons}
                  selectedLandmarkSlug={selectedLandmark?.slug}
                  onSelectLandmark={handleSelectLandmark}
                  layers={layers}
                />
              ) : (
                <ObservableUniverseMapView2D
                  shells={shells}
                  landmarks={landmarks}
                  horizons={horizons}
                  selectedLandmarkSlug={selectedLandmark?.slug}
                  onSelectLandmark={handleSelectLandmark}
                />
              )}
            </div>

            {/* Landmark Quick Picker Bar */}
            <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800 font-mono">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Observational Landmarks (Sorted by Redshift):
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {landmarks.map((l) => (
                  <button
                    key={l.slug}
                    onClick={() => handleSelectLandmark(l)}
                    className={`px-2.5 py-1 rounded-lg text-xs shrink-0 transition-colors ${
                      selectedLandmark?.slug === l.slug
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                        : "bg-slate-950/60 text-slate-400 border border-slate-800/60 hover:text-slate-200"
                    }`}
                  >
                    {l.name.split(" ")[0]} (z={l.redshiftZ.toFixed(1)})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Telemetry & Shells (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Telemetry Dossier Panel */}
            <ObservableTelemetryPanel
              landmark={selectedLandmark}
              shell={selectedShell}
              horizon={null}
            />

            {/* Redshift Shells Card */}
            <RedshiftShellCard
              shells={shells}
              selectedShellSlug={selectedShell?.slug}
              onSelectShell={handleSelectShell}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
