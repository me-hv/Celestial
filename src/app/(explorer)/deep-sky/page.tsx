"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  Compass,
  LayoutGrid,
  Globe,
  ArrowRight,
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deepSkyRepo, DeepSkyFilterOptions } from "@/lib/data/deep-sky-repository";
import { CelestialObject } from "@/domain/celestial-object/types";
import { DeepSkyScene } from "@/features/visualization/scene/DeepSkyScene";
import { CelestialSkyView2D } from "@/features/visualization/sky/CelestialSkyView2D";
import { DeepSkyTelemetryPanel } from "@/features/deep-sky/components/DeepSkyTelemetryPanel";
import { DeepSkyFilterBar } from "@/features/deep-sky/components/DeepSkyFilterBar";

export default function DeepSkyPage() {
  const [viewMode, setViewMode] = useState<"2D" | "3D" | "CATALOG">("2D");
  const [filters, setFilters] = useState<DeepSkyFilterOptions>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const [selectedObject, setSelectedObject] = useState<CelestialObject | null>(() => {
    return deepSkyRepo.getBySlug("m31-andromeda-galaxy") || deepSkyRepo.getAll()[0];
  });
  const [focusedObjectId, setFocusedObjectId] = useState<string | undefined>(undefined);
  const [showGalacticGrid, setShowGalacticGrid] = useState(true);

  // Filtered deep sky objects list
  const activeFilters = useMemo(
    () => ({
      ...filters,
      query: searchQuery,
    }),
    [filters, searchQuery]
  );

  const filteredObjects = useMemo(() => {
    return deepSkyRepo.filter(activeFilters);
  }, [activeFilters]);

  // Paginated objects for Catalog View
  const paginatedResult = useMemo(() => {
    return deepSkyRepo.paginate(activeFilters, {
      page,
      pageSize,
      sortBy: "distance",
      sortDirection: "asc",
    });
  }, [activeFilters, page]);

  const handleSelectObject = (obj: CelestialObject) => {
    setSelectedObject(obj);
  };

  const handleFocusCamera = (obj: CelestialObject) => {
    setFocusedObjectId(obj.id);
  };

  return (
    <div className="flex-1 flex flex-col py-6 space-y-6">
      <Container size="xl" className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-celestial-muted/70 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-celestial-violet" />
              <h1 className="text-3xl font-bold font-mono text-celestial-starlight uppercase">
                Deep Sky & Galactic Explorer
              </h1>
            </div>
            <p className="text-sm text-celestial-subtle">
              Interactive 2D celestial sky mapping, 3D galactic space, and authoritative atlas of
              Galaxies, Nebulae, and Clusters
            </p>
          </div>

          {/* Tri-Mode View Switcher & Stats */}
          <div className="flex items-center gap-3">
            <Badge variant="cyan">{filteredObjects.length} OBJECTS IN SCOPE</Badge>
            <div className="flex items-center p-1 rounded-xl border border-celestial-muted/80 bg-celestial-surface/80">
              <button
                onClick={() => setViewMode("2D")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  viewMode === "2D"
                    ? "bg-celestial-violet text-celestial-void font-bold shadow-sm"
                    : "text-celestial-subtle hover:text-celestial-starlight"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>2D Sky</span>
              </button>
              <button
                onClick={() => setViewMode("3D")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  viewMode === "3D"
                    ? "bg-celestial-violet text-celestial-void font-bold shadow-sm"
                    : "text-celestial-subtle hover:text-celestial-starlight"
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>3D Universe</span>
              </button>
              <button
                onClick={() => setViewMode("CATALOG")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  viewMode === "CATALOG"
                    ? "bg-celestial-violet text-celestial-void font-bold shadow-sm"
                    : "text-celestial-subtle hover:text-celestial-starlight"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Catalog View</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-celestial-subtle pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search deep sky by name or catalog ID (e.g. M31, NGC 224, Orion Nebula, Pleiades, Cas A, Helix)..."
                className="w-full h-10 pl-10 pr-10 rounded-xl border border-celestial-muted bg-celestial-surface/80 text-sm text-celestial-starlight placeholder:text-celestial-subtle/60 backdrop-blur-md focus:outline-none focus:border-celestial-violet font-sans"
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

            {viewMode !== "CATALOG" && (
              <Button
                variant={showGalacticGrid ? "cyan" : "secondary"}
                size="sm"
                onClick={() => setShowGalacticGrid(!showGalacticGrid)}
                className="gap-1.5 font-mono text-xs shrink-0"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Galactic Plane Grid</span>
              </Button>
            )}
          </div>

          <DeepSkyFilterBar
            filters={filters}
            onChangeFilters={(f) => {
              setFilters(f);
              setPage(1);
            }}
          />
        </div>

        {/* Dynamic Viewport */}
        {viewMode === "2D" ? (
          /* 2D Celestial Sky Projection View */
          <div className="relative w-full h-[650px] rounded-2xl overflow-hidden border border-celestial-muted/80 shadow-2xl bg-celestial-void">
            <CelestialSkyView2D
              objects={filteredObjects}
              selectedObjectId={selectedObject?.id}
              showGalacticGrid={showGalacticGrid}
              onSelectObject={handleSelectObject}
              className="w-full h-full"
            />

            <DeepSkyTelemetryPanel
              object={selectedObject}
              onClose={() => setSelectedObject(null)}
              onFocusCamera={handleFocusCamera}
            />
          </div>
        ) : viewMode === "3D" ? (
          /* 3D Deep Sky Spatial Universe View */
          <div className="relative w-full h-[650px] rounded-2xl overflow-hidden border border-celestial-muted/80 shadow-2xl bg-celestial-void">
            <DeepSkyScene
              objects={filteredObjects}
              selectedObjectId={selectedObject?.id}
              focusedObjectId={focusedObjectId}
              showGalacticGrid={showGalacticGrid}
              onSelectObject={handleSelectObject}
              className="w-full h-full"
            />

            <DeepSkyTelemetryPanel
              object={selectedObject}
              onClose={() => setSelectedObject(null)}
              onFocusCamera={handleFocusCamera}
            />
          </div>
        ) : (
          /* Catalog Grid & Table View */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedResult.objects.map((obj) => {
                const distLy = obj.positional.distanceLightYears ?? 0;
                const distMpc = obj.positional.distanceMpc;
                let displayDistance = `${distLy.toLocaleString()} ly`;
                if (distMpc && distMpc >= 0.1) {
                  displayDistance = `${distMpc.toFixed(2)} Mpc (${(distLy / 1000000).toFixed(2)} Mly)`;
                }

                return (
                  <Card
                    key={obj.id}
                    elevated
                    className="group hover:border-celestial-violet/50 transition-all flex flex-col justify-between"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg group-hover:text-celestial-violet transition-colors">
                            {obj.canonicalName}
                          </CardTitle>
                          {obj.standardDesignation && (
                            <p className="text-xs font-mono text-celestial-subtle mt-0.5">
                              {obj.standardDesignation}{" "}
                              {obj.physical.constellation && `· ${obj.physical.constellation}`}
                            </p>
                          )}
                        </div>
                        <Badge variant="cyan" className="text-[11px] font-mono">
                          {obj.classification.code.replace(/_/g, " ")}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                      <p className="text-xs text-celestial-subtle line-clamp-2 leading-relaxed">
                        {obj.summary}
                      </p>

                      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-celestial-deep/70 border border-celestial-muted/50 font-mono text-xs">
                        <div>
                          <span className="text-[10px] text-celestial-subtle block">Distance</span>
                          <span className="font-semibold text-celestial-starlight truncate block">
                            {displayDistance}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-celestial-subtle block">
                            Apparent Mag
                          </span>
                          <span className="font-semibold text-celestial-starlight">
                            {obj.physical.apparentMagnitudeV !== undefined
                              ? `${obj.physical.apparentMagnitudeV} mag`
                              : "—"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-celestial-subtle block">
                            Right Ascension
                          </span>
                          <span className="font-semibold text-celestial-starlight">
                            {obj.positional.rightAscensionDeg !== undefined
                              ? `${obj.positional.rightAscensionDeg.toFixed(2)}°`
                              : "—"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-celestial-subtle block">
                            Declination
                          </span>
                          <span className="font-semibold text-celestial-starlight">
                            {obj.positional.declinationDeg !== undefined
                              ? `${obj.positional.declinationDeg.toFixed(2)}°`
                              : "—"}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-celestial-muted/40 text-xs font-mono">
                        <div className="flex items-center gap-1 text-[10px] text-celestial-subtle">
                          <ShieldCheck className="w-3 h-3 text-celestial-cyan" />
                          <span>{obj.provenance.authoritativeBody}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedObject(obj);
                              setViewMode("3D");
                              handleFocusCamera(obj);
                            }}
                            className="inline-flex items-center gap-1 text-celestial-violet hover:underline text-xs"
                          >
                            <Compass className="w-3 h-3" />
                            <span>3D View</span>
                          </button>
                          <span className="text-celestial-muted">|</span>
                          <Link
                            href={`/deep-sky/${obj.slug}`}
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

            {/* Pagination Controls */}
            {paginatedResult.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-celestial-muted/60 pt-4 font-mono text-xs">
                <span className="text-celestial-subtle">
                  Page {paginatedResult.page} of {paginatedResult.totalPages} (
                  {paginatedResult.totalMatches} objects)
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="gap-1 text-xs"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={page >= paginatedResult.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="gap-1 text-xs"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
