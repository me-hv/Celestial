"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { galaxyRepo } from "@/lib/data/galaxy-repository";
import {
  LocalGroupScene,
  LocalGroupLayerVisibility,
} from "@/features/visualization/local-group/LocalGroupScene";
import { LocalGroupMapView2D } from "@/features/visualization/local-group/LocalGroupMapView2D";
import { LocalGroupLayerControls } from "@/features/galaxy/components/LocalGroupLayerControls";
import { GalaxyTelemetryPanel } from "@/features/galaxy/components/GalaxyTelemetryPanel";
import { GalaxyMorphologyBadge } from "@/features/galaxy/components/GalaxyMorphologyBadge";
import { YouAreHereIndicator } from "@/features/galactic/components/YouAreHereIndicator";
import { formatGalaxyDistance } from "@/lib/astronomy/cosmology/distance";

type ViewMode = "3D_SCENE" | "2D_MAP" | "CATALOG";

export default function LocalGroupExplorerPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("3D_SCENE");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGalaxySlug, setSelectedGalaxySlug] = useState<string>("milky-way-galaxy");
  const [layers, setLayers] = useState<LocalGroupLayerVisibility>({
    galaxies: true,
    distanceShells: true,
    relationshipLines: true,
    subgroups: true,
    labels: true,
    grid: true,
  });

  const allGalaxies = useMemo(() => galaxyRepo.getAll(), []);
  const localGroupMembers = useMemo(() => galaxyRepo.getLocalGroupMembers(), []);

  const filteredGalaxies = useMemo(() => {
    if (!searchQuery.trim()) return localGroupMembers;
    return galaxyRepo.filter({ query: searchQuery });
  }, [searchQuery, localGroupMembers]);

  const selectedGalaxy = useMemo(() => {
    return galaxyRepo.getBySlug(selectedGalaxySlug) || allGalaxies[0];
  }, [selectedGalaxySlug, allGalaxies]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Banner & Orientation */}
      <section className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md py-4">
        <Container
          size="xl"
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono tracking-widest uppercase text-cyan-400 font-semibold">
                EXTRAGALACTIC SCALE · ~3 MEGAPARSECS
              </span>
              <span className="text-xs text-slate-500">•</span>
              <Link
                href="/local-group/overview"
                className="text-xs font-mono text-cyan-400/80 hover:text-cyan-300 underline underline-offset-4"
              >
                Scientific Overview →
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Local Group & Galaxy Explorer
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
            <YouAreHereIndicator currentStage="LOCAL_GROUP" />
            <Link href="/cosmic-web">
              <Button variant="cyan" className="font-mono text-xs whitespace-nowrap">
                Zoom Out to Cosmic Web ↗
              </Button>
            </Link>
            <Link href="/galaxies/compare?a=milky-way-galaxy&b=andromeda-galaxy">
              <Button variant="outline" className="font-mono text-xs whitespace-nowrap">
                MW vs Andromeda ↔
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Main View Area */}
      <section className="flex-1 relative flex flex-col">
        {/* View Switcher & Toolbar */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
          <div className="flex bg-slate-900/90 backdrop-blur-md border border-white/10 p-1 rounded-xl shadow-lg">
            <button
              onClick={() => setViewMode("3D_SCENE")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                viewMode === "3D_SCENE"
                  ? "bg-cyan-500 text-slate-950 font-bold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              3D Space View
            </button>
            <button
              onClick={() => setViewMode("2D_MAP")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                viewMode === "2D_MAP"
                  ? "bg-cyan-500 text-slate-950 font-bold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              2D Extragalactic Map
            </button>
            <button
              onClick={() => setViewMode("CATALOG")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                viewMode === "CATALOG"
                  ? "bg-cyan-500 text-slate-950 font-bold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Member Directory ({localGroupMembers.length})
            </button>
          </div>

          {viewMode === "3D_SCENE" && (
            <LocalGroupLayerControls layers={layers} onChange={setLayers} />
          )}
        </div>

        {/* Dynamic Scene Content */}
        {viewMode === "3D_SCENE" && (
          <div className="w-full h-[78vh] relative">
            <LocalGroupScene
              galaxies={allGalaxies}
              selectedGalaxySlug={selectedGalaxySlug}
              onSelectGalaxy={(g) => setSelectedGalaxySlug(g.slug)}
              layers={layers}
              className="w-full h-full"
            />
          </div>
        )}

        {viewMode === "2D_MAP" && (
          <div className="w-full h-[78vh] relative">
            <LocalGroupMapView2D
              galaxies={allGalaxies}
              selectedGalaxySlug={selectedGalaxySlug}
              onSelectGalaxy={(g) => setSelectedGalaxySlug(g.slug)}
              className="w-full h-full"
            />
          </div>
        )}

        {viewMode === "CATALOG" && (
          <Container size="xl" className="py-8 flex-1">
            <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-80">
                <Input
                  type="text"
                  placeholder="Filter by name, Messier, NGC, type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-900/80 border-white/10 text-white placeholder:text-slate-500 font-mono text-xs"
                />
              </div>
              <span className="text-xs font-mono text-slate-400">
                Showing {filteredGalaxies.length} galaxies
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGalaxies.map((galaxy) => (
                <Card
                  key={galaxy.id}
                  onClick={() => setSelectedGalaxySlug(galaxy.slug)}
                  className={`p-5 rounded-xl border transition cursor-pointer ${
                    selectedGalaxySlug === galaxy.slug
                      ? "bg-slate-900 border-cyan-500/50 shadow-glow-cyan"
                      : "bg-slate-900/50 border-white/10 hover:border-white/20 hover:bg-slate-900/80"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-bold text-white tracking-tight">{galaxy.name}</h3>
                    <GalaxyMorphologyBadge
                      morphologyClass={galaxy.morphology.class}
                      hubbleType={galaxy.morphology.hubbleDeVaucouleurs}
                    />
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-4">{galaxy.summary}</p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 pt-3 border-t border-white/5">
                    <div>
                      <span className="text-slate-500 block">Distance</span>
                      <span className="text-cyan-400 font-semibold">
                        {galaxy.slug === "milky-way-galaxy"
                          ? "Home"
                          : formatGalaxyDistance(galaxy.distance.distanceLy.value)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Diameter</span>
                      <span className="text-white">
                        ~{Math.round(galaxy.physical.diameterLy.value).toLocaleString()} ly
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <Link
                      href={`/galaxies/${galaxy.slug}`}
                      className="text-xs font-mono text-cyan-400 hover:underline"
                    >
                      View Profile →
                    </Link>
                    {galaxy.groupMembership && (
                      <span className="text-[10px] uppercase font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {galaxy.groupMembership.membershipType.replace(/_/g, " ")}
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        )}

        {/* Floating Telemetry Drawer for Selected Galaxy in 3D / 2D modes */}
        {viewMode !== "CATALOG" && selectedGalaxy && (
          <div className="absolute top-16 right-4 z-20 w-full max-w-sm">
            <GalaxyTelemetryPanel galaxy={selectedGalaxy} />
          </div>
        )}
      </section>
    </main>
  );
}
