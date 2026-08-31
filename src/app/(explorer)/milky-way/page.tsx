"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Compass,
  LayoutGrid,
  Globe,
  ArrowRight,
  Search,
  ShieldCheck,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { galacticStructureRepo } from "@/lib/data/galactic-structure-repository";
import { starRepo } from "@/lib/data/star-repository";
import { stellarSystemRepo } from "@/lib/data/stellar-system-repository";
import { deepSkyRepo } from "@/lib/data/deep-sky-repository";
import { GalacticStructure, GalacticStructureType } from "@/domain/galactic-structure/types";
import { CelestialObject } from "@/domain/celestial-object/types";
import {
  MilkyWayScene,
  GalacticLayerVisibility,
} from "@/features/visualization/galactic/MilkyWayScene";
import { GalacticMapView2D } from "@/features/visualization/galactic/GalacticMapView2D";
import { GalacticTelemetryPanel } from "@/features/galactic/components/GalacticTelemetryPanel";
import { GalacticLayerControls } from "@/features/galactic/components/GalacticLayerControls";
import { YouAreHereIndicator } from "@/features/galactic/components/YouAreHereIndicator";
import { GalacticScale } from "@/lib/astronomy/coordinates/galactic-scale";

export default function MilkyWayExplorerPage() {
  const [viewMode, setViewMode] = useState<"3D" | "2D" | "CATALOG">("3D");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<GalacticStructureType | "ALL">("ALL");

  const [layers, setLayers] = useState<GalacticLayerVisibility>({
    showDisk: true,
    showPlaneGrid: true,
    showBulgeBar: true,
    showSpiralArms: true,
    showSunPosition: true,
    showNearbyStars: false,
    showStellarSystems: false,
    showDeepSkyObjects: false,
  });

  const [selectedStructure, setSelectedStructure] = useState<GalacticStructure | null>(() => {
    return galacticStructureRepo.getBySlug("orion-spur") || galacticStructureRepo.getAll()[0];
  });
  const [focusedPosition, setFocusedPosition] = useState<
    { x: number; y: number; z: number } | undefined
  >(undefined);

  // Datasets
  const allStructures = useMemo(() => galacticStructureRepo.getAll(), []);
  const nearbyStars = useMemo(() => starRepo.getAll().slice(0, 15), []);
  const stellarSystems = useMemo(() => {
    return stellarSystemRepo
      .getAll()
      .map((sys) => {
        const primaryId = sys.centralBodyIds[0];
        return starRepo.getById(primaryId) || starRepo.getAll()[0];
      })
      .filter(Boolean);
  }, []);
  const deepSkyObjects = useMemo(() => deepSkyRepo.getAll().slice(0, 20), []);

  // Filtered Structures
  const filteredStructures = useMemo(() => {
    return galacticStructureRepo.filter({
      query: searchQuery,
      type: selectedType === "ALL" ? undefined : selectedType,
    });
  }, [searchQuery, selectedType]);

  const handleSelectStructure = (struct: GalacticStructure) => {
    setSelectedStructure(struct);
  };

  const handleSelectObject = (obj: CelestialObject) => {
    // If selecting Sagittarius A*, select the galactic center structure
    if (obj.slug === "sagittarius-a-star") {
      setSelectedStructure(galacticStructureRepo.getGalacticCenter());
    } else {
      // Find containing structure (e.g. Orion Spur for nearby stars)
      setSelectedStructure(galacticStructureRepo.getBySlug("orion-spur") || null);
    }
  };

  const handleFocusCamera = (struct: GalacticStructure) => {
    if (struct.slug === "galactic-center" || struct.type === "GALACTIC_BULGE") {
      setFocusedPosition({ x: 0, y: 0, z: 0 });
    } else if (struct.slug === "orion-spur") {
      const sunPos = GalacticScale.getSunScenePosition();
      setFocusedPosition(sunPos);
    } else if (struct.spiralArm) {
      const rScene = struct.spiralArm.referenceRadiusKpc * GalacticScale.KPC_TO_SCENE_UNITS;
      const thRad = (struct.spiralArm.referenceAngleDeg * Math.PI) / 180.0;
      setFocusedPosition({
        x: rScene * Math.cos(thRad),
        y: 0,
        z: rScene * Math.sin(thRad),
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col py-6 space-y-6">
      <Container size="xl" className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-celestial-muted/70 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-celestial-cyan" />
              <h1 className="text-3xl font-bold font-mono text-celestial-starlight uppercase">
                Milky Way & Galactic Structure
              </h1>
            </div>
            <p className="text-sm text-celestial-subtle">
              Interactive 3D Galactic space, 2D top-down map, and spatial orientation from Earth to
              the Local Group
            </p>
          </div>

          {/* Tri-Mode View Switcher & Overview Link */}
          <div className="flex items-center flex-wrap gap-3">
            <Link href="/cosmic-web">
              <Button variant="cyan" size="sm" className="gap-1.5 font-mono text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cosmic Web ↗</span>
              </Button>
            </Link>
            <Link href="/milky-way/overview">
              <Button variant="secondary" size="sm" className="gap-1.5 font-mono text-xs">
                <Info className="w-3.5 h-3.5 text-celestial-cyan" />
                <span>Scientific Overview</span>
              </Button>
            </Link>

            <div className="flex items-center p-1 rounded-xl border border-celestial-muted/80 bg-celestial-surface/80">
              <button
                onClick={() => setViewMode("3D")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  viewMode === "3D"
                    ? "bg-celestial-cyan text-celestial-void font-bold shadow-sm"
                    : "text-celestial-subtle hover:text-celestial-starlight"
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>3D Galaxy</span>
              </button>
              <button
                onClick={() => setViewMode("2D")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  viewMode === "2D"
                    ? "bg-celestial-cyan text-celestial-void font-bold shadow-sm"
                    : "text-celestial-subtle hover:text-celestial-starlight"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>2D Map</span>
              </button>
              <button
                onClick={() => setViewMode("CATALOG")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  viewMode === "CATALOG"
                    ? "bg-celestial-cyan text-celestial-void font-bold shadow-sm"
                    : "text-celestial-subtle hover:text-celestial-starlight"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Structures</span>
              </button>
            </div>
          </div>
        </div>

        {/* You Are Here Indicator */}
        <YouAreHereIndicator currentStage="MILKY_WAY" />

        {/* Search & Filter Toolbar */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-celestial-subtle pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search galactic structures (e.g. Orion Spur, Galactic Center, Perseus Arm, Bar, Bulge)..."
                className="w-full h-10 pl-10 pr-10 rounded-xl border border-celestial-muted bg-celestial-surface/80 text-sm text-celestial-starlight placeholder:text-celestial-subtle/60 backdrop-blur-md focus:outline-none focus:border-celestial-cyan font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-celestial-subtle hover:text-celestial-starlight"
                >
                  CLEAR
                </button>
              )}
            </div>

            {/* Structure Type Filter */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-celestial-muted/80 bg-celestial-surface/80 text-xs font-mono shrink-0">
              <Layers className="w-3.5 h-3.5 text-celestial-violet" />
              <select
                aria-label="Filter by Structure Type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as GalacticStructureType | "ALL")}
                className="bg-transparent text-celestial-starlight font-semibold focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-celestial-surface text-celestial-starlight">
                  All Structure Types
                </option>
                <option
                  value="SPIRAL_ARM"
                  className="bg-celestial-surface text-celestial-starlight"
                >
                  Spiral Arms
                </option>
                <option
                  value="GALACTIC_CENTER"
                  className="bg-celestial-surface text-celestial-starlight"
                >
                  Galactic Center
                </option>
                <option
                  value="GALACTIC_DISK"
                  className="bg-celestial-surface text-celestial-starlight"
                >
                  Galactic Disk
                </option>
                <option
                  value="GALACTIC_BULGE"
                  className="bg-celestial-surface text-celestial-starlight"
                >
                  Galactic Bulge
                </option>
                <option
                  value="GALACTIC_BAR"
                  className="bg-celestial-surface text-celestial-starlight"
                >
                  Galactic Bar
                </option>
                <option
                  value="GALACTIC_HALO"
                  className="bg-celestial-surface text-celestial-starlight"
                >
                  Galactic Halo
                </option>
                <option
                  value="LOCAL_GROUP"
                  className="bg-celestial-surface text-celestial-starlight"
                >
                  Local Group
                </option>
              </select>
            </div>
          </div>

          {/* Layer Visibility Controls */}
          {viewMode === "3D" && (
            <GalacticLayerControls layers={layers} onChangeLayers={setLayers} />
          )}
        </div>

        {/* Dynamic Viewport */}
        {viewMode === "3D" ? (
          /* 3D Interactive Milky Way Scene */
          <div className="relative w-full h-[650px] rounded-2xl overflow-hidden border border-celestial-muted/80 shadow-2xl bg-celestial-void">
            <MilkyWayScene
              structures={allStructures}
              nearbyStars={nearbyStars}
              stellarSystems={stellarSystems}
              deepSkyObjects={deepSkyObjects}
              selectedStructureSlug={selectedStructure?.slug}
              onSelectStructure={handleSelectStructure}
              onSelectObject={handleSelectObject}
              layers={layers}
              focusedTargetPosition={focusedPosition}
              className="w-full h-full"
            />

            <GalacticTelemetryPanel
              structure={selectedStructure}
              onClose={() => setSelectedStructure(null)}
              onFocusCamera={handleFocusCamera}
            />
          </div>
        ) : viewMode === "2D" ? (
          /* 2D Top-Down Galactic Map View */
          <div className="relative w-full h-[650px] rounded-2xl overflow-hidden border border-celestial-muted/80 shadow-2xl bg-celestial-void">
            <GalacticMapView2D
              structures={allStructures}
              nearbyStars={nearbyStars}
              stellarSystems={stellarSystems}
              deepSkyObjects={deepSkyObjects}
              selectedStructureSlug={selectedStructure?.slug}
              onSelectStructure={handleSelectStructure}
              onSelectObject={handleSelectObject}
              showOverlayObjects={true}
              className="w-full h-full"
            />

            <GalacticTelemetryPanel
              structure={selectedStructure}
              onClose={() => setSelectedStructure(null)}
              onFocusCamera={handleFocusCamera}
            />
          </div>
        ) : (
          /* Structure Catalog Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStructures.map((struct) => {
              const ext = struct.spatialExtent;
              return (
                <Card
                  key={struct.id}
                  elevated
                  className="group hover:border-celestial-cyan/50 transition-all flex flex-col justify-between"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg group-hover:text-celestial-cyan transition-colors">
                          {struct.name}
                        </CardTitle>
                        {struct.standardDesignation && (
                          <p className="text-xs font-mono text-celestial-subtle mt-0.5">
                            {struct.standardDesignation}
                          </p>
                        )}
                      </div>
                      <Badge variant="cyan" className="text-[11px] font-mono">
                        {struct.type.replace(/_/g, " ")}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-celestial-subtle line-clamp-2 leading-relaxed">
                      {struct.summary}
                    </p>

                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-celestial-deep/70 border border-celestial-muted/50 font-mono text-xs">
                      <div>
                        <span className="text-[10px] text-celestial-subtle block">Radius Span</span>
                        <span className="font-semibold text-celestial-starlight">
                          {ext.minGalactocentricRadiusKpc} — {ext.maxGalactocentricRadiusKpc} kpc
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-celestial-subtle block">
                          Model Confidence
                        </span>
                        <span className="font-semibold text-celestial-cyan">
                          {struct.modelConfidence}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-celestial-muted/40 text-xs font-mono">
                      <div className="flex items-center gap-1 text-[10px] text-celestial-subtle">
                        <ShieldCheck className="w-3 h-3 text-celestial-cyan" />
                        <span>{struct.provenance.authoritativeBody}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedStructure(struct);
                            setViewMode("3D");
                            handleFocusCamera(struct);
                          }}
                          className="inline-flex items-center gap-1 text-celestial-violet hover:underline text-xs"
                        >
                          <Compass className="w-3 h-3" />
                          <span>3D View</span>
                        </button>
                        <span className="text-celestial-muted">|</span>
                        <Link
                          href={`/milky-way/${struct.slug}`}
                          className="inline-flex items-center gap-1 text-celestial-cyan hover:underline text-xs"
                        >
                          <span>Profile</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}
