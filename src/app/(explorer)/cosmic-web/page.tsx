"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { cosmicStructureRepo } from "@/lib/data/cosmic-structure-repository";
import { CosmicStructure } from "@/domain/cosmic-structure/types";
import {
  CosmicWebScene,
  CosmicWebLayerVisibility,
  DEFAULT_COSMIC_LAYERS,
} from "@/features/visualization/cosmic-web/CosmicWebScene";
import { CosmicWebMapView2D } from "@/features/visualization/cosmic-web/CosmicWebMapView2D";
import { CosmicStructureTelemetryPanel } from "@/features/cosmic-web/components/CosmicStructureTelemetryPanel";
import { CosmicWebLayerControls } from "@/features/cosmic-web/components/CosmicWebLayerControls";
import { CosmicLocationBreadcrumb } from "@/features/cosmic-web/components/CosmicLocationBreadcrumb";
import { CosmicMapScalePreset } from "@/lib/astronomy/coordinates/cosmic-scale";
import { Button } from "@/components/ui/button";
import { Layers, Compass, Network } from "lucide-react";

export default function CosmicWebExplorerPage() {
  const allStructures = useMemo(() => cosmicStructureRepo.getAll(), []);

  const [selectedStructure, setSelectedStructure] = useState<CosmicStructure | null>(
    () => cosmicStructureRepo.getBySlug("virgo-cluster") || allStructures[0] || null
  );
  const [viewMode, setViewMode] = useState<"3D" | "2D">("3D");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [layers, setLayers] = useState<CosmicWebLayerVisibility>(DEFAULT_COSMIC_LAYERS);
  const [showLayerControls, setShowLayerControls] = useState(false);
  const [scalePreset, setScalePreset] = useState<CosmicMapScalePreset>("LOCAL_SUPERCLUSTER");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStructures = useMemo(() => {
    return allStructures.filter((s) => {
      if (filterType !== "ALL" && s.type !== filterType) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesDesig = s.standardDesignation?.toLowerCase().includes(q);
        const matchesAliases = s.aliases?.some((a) => a.toLowerCase().includes(q));
        if (!matchesName && !matchesDesig && !matchesAliases) return false;
      }
      return true;
    });
  }, [allStructures, filterType, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Top Header & Breadcrumb */}
      <div className="border-b border-white/10 bg-slate-950/60 backdrop-blur-xl sticky top-16 z-30 px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                COSMIC WEB & LARGE-SCALE STRUCTURE EXPLORER
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-mono mt-1">
              Cosmic Web & Superclusters
            </h1>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <CosmicLocationBreadcrumb currentStage="COSMIC_WEB" />
            <Link href="/cosmic-time">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-mono text-purple-300 border-purple-500/40 hover:bg-purple-950/40"
              >
                Cosmic Time Machine ⏳
              </Button>
            </Link>
            <Link href="/observable-universe">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-mono text-orange-300 border-orange-500/40 hover:bg-orange-950/40"
              >
                Observable Universe 🌐
              </Button>
            </Link>
            <Link href="/cosmic-web/overview">
              <Button variant="outline" size="sm" className="text-xs font-mono">
                Catalog Overview →
              </Button>
            </Link>
            <Link href="/cosmic-web/compare">
              <Button variant="outline" size="sm" className="text-xs font-mono">
                Compare Structures
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Exploration Workspace */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 pt-6 flex flex-col gap-6">
        {/* Navigation & Controls Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 rounded-2xl bg-slate-900/60 p-3 border border-white/5 backdrop-blur-md">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-white/10 text-xs font-mono">
            <button
              onClick={() => setViewMode("3D")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === "3D"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>3D Cosmic Space</span>
            </button>
            <button
              onClick={() => setViewMode("2D")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === "2D"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>2D Extragalactic Map</span>
            </button>
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center flex-wrap gap-1.5 text-xs font-mono">
            {[
              { id: "ALL", label: "All" },
              { id: "GALAXY_CLUSTER", label: "Clusters" },
              { id: "SUPERCLUSTER", label: "Superclusters" },
              { id: "GALAXY_GROUP", label: "Groups" },
              { id: "VOID", label: "Voids" },
              { id: "WALL", label: "Walls & Sheets" },
              { id: "FILAMENT", label: "Filaments" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`rounded-lg px-2.5 py-1 border transition-all ${
                  filterType === tab.id
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold"
                    : "bg-slate-950/40 text-slate-400 border-white/5 hover:text-white hover:border-white/20"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input & Layer Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Filter structures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950/80 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 w-full sm:w-44"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLayerControls(!showLayerControls)}
              className="text-xs font-mono flex items-center gap-1.5 shrink-0"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Layers</span>
            </Button>
          </div>
        </div>

        {/* Viewport Canvas and Interactive Overlay */}
        <div className="relative w-full h-[650px] rounded-3xl border border-white/10 overflow-hidden bg-slate-950 shadow-2xl">
          {viewMode === "3D" ? (
            <CosmicWebScene
              structures={filteredStructures}
              selectedSlug={selectedStructure?.slug}
              onSelectStructure={(s) => setSelectedStructure(s)}
              layers={layers}
            />
          ) : (
            <CosmicWebMapView2D
              structures={filteredStructures}
              selectedSlug={selectedStructure?.slug}
              onSelectStructure={(s) => setSelectedStructure(s)}
              scalePreset={scalePreset}
              onScalePresetChange={setScalePreset}
              coordinateMode={
                layers.useSupergalacticCoordinates ? "SUPERGALACTIC" : "GALACTOCENTRIC"
              }
            />
          )}

          {/* Floating Layer Controls */}
          {showLayerControls && (
            <div className="absolute top-4 right-4 z-20 w-72">
              <CosmicWebLayerControls layers={layers} onChange={setLayers} />
            </div>
          )}

          {/* Floating Selected Structure Telemetry */}
          {selectedStructure && (
            <div className="absolute top-4 left-4 z-20 max-w-sm">
              <CosmicStructureTelemetryPanel
                structure={selectedStructure}
                onClose={() => setSelectedStructure(null)}
              />
            </div>
          )}
        </div>

        {/* Featured Large-Scale Structures Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div>
              <h2 className="text-lg font-bold font-mono text-white">
                Iconic Extragalactic Overdensities & Voids
              </h2>
              <p className="text-xs text-slate-400">
                Key gravitational anchors, flow basins, and voids shaping the local cosmic web.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400">
              {filteredStructures.length} structures indexed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStructures.slice(0, 9).map((struct) => {
              const isSelected = selectedStructure?.slug === struct.slug;
              return (
                <div
                  key={struct.slug}
                  onClick={() => setSelectedStructure(struct)}
                  className={`flex flex-col justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-cyan-950/20 border-cyan-500/50 shadow-glow-cyan"
                      : "bg-slate-900/40 border-white/5 hover:border-white/20 hover:bg-slate-900/70"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono text-cyan-400 font-semibold uppercase">
                        {struct.type.replace(/_/g, " ")}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {struct.coordinates.distanceMpc.value === 0
                          ? "0 Mpc (Home)"
                          : `${struct.coordinates.distanceMpc.value.toFixed(1)} Mpc`}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white font-mono mt-1">{struct.name}</h3>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-1.5 leading-relaxed font-sans">
                      {struct.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5 text-[11px] font-mono text-slate-400">
                    <span>Span: {struct.dimensions.majorAxisMpc.value} Mpc</span>
                    <Link
                      href={`/cosmic-web/${struct.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-cyan-400 hover:underline"
                    >
                      Details →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
