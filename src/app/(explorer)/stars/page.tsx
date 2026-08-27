"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  Compass,
  LayoutGrid,
  Orbit,
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
import { starRepo, StarFilterOptions } from "@/lib/data/star-repository";
import { CelestialObject } from "@/domain/celestial-object/types";
import { StellarNeighborhoodScene } from "@/features/visualization/scene/StellarNeighborhoodScene";
import { StarTelemetryPanel } from "@/features/stars/components/StarTelemetryPanel";
import { StarFilterBar } from "@/features/stars/components/StarFilterBar";
import { formatTemperature } from "@/lib/utils/formatters";

export default function StarsPage() {
  const [viewMode, setViewMode] = useState<"3D" | "CATALOG">("3D");
  const [filters, setFilters] = useState<StarFilterOptions>({
    maxDistancePc: 25,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const [selectedStar, setSelectedStar] = useState<CelestialObject | null>(() => {
    return starRepo.getBySlug("proxima-centauri") || starRepo.getAll()[0];
  });
  const [focusedStarId, setFocusedStarId] = useState<string | undefined>(undefined);
  const [showDistanceShells, setShowDistanceShells] = useState(true);

  // Filtered stars list for 3D visualization
  const activeFilters = useMemo(
    () => ({
      ...filters,
      query: searchQuery,
    }),
    [filters, searchQuery]
  );

  const filteredStars = useMemo(() => {
    return starRepo.filter(activeFilters);
  }, [activeFilters]);

  // Paginated stars for Catalog View
  const paginatedResult = useMemo(() => {
    return starRepo.paginate(activeFilters, {
      page,
      pageSize,
      sortBy: "distance",
      sortDirection: "asc",
    });
  }, [activeFilters, page]);

  const handleSelectStar = (star: CelestialObject) => {
    setSelectedStar(star);
  };

  const handleFocusCamera = (star: CelestialObject) => {
    setFocusedStarId(star.id);
  };

  return (
    <div className="flex-1 flex flex-col py-6 space-y-6">
      <Container size="xl" className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-celestial-muted/70 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-celestial-amber" />
              <h1 className="text-3xl font-bold font-mono text-celestial-starlight uppercase">
                Stellar Atlas & Neighborhood
              </h1>
            </div>
            <p className="text-sm text-celestial-subtle">
              Astrometric 3D mapping and catalog of nearby stars within 25 parsecs (Gaia DR3 /
              SIMBAD)
            </p>
          </div>

          {/* View Mode Switcher & Stats */}
          <div className="flex items-center gap-3">
            <Badge variant="amber">{filteredStars.length} STARS IN SCOPE</Badge>
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
                <span>3D View</span>
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
                placeholder="Search stars by name, Bayer designation, or catalog ID (e.g. Sirius, Vega, HIP 70890, Gl 699)..."
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

            {viewMode === "3D" && (
              <Button
                variant={showDistanceShells ? "cyan" : "secondary"}
                size="sm"
                onClick={() => setShowDistanceShells(!showDistanceShells)}
                className="gap-1.5 font-mono text-xs shrink-0"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Distance Shells</span>
              </Button>
            )}
          </div>

          <StarFilterBar
            filters={filters}
            onChangeFilters={(f) => {
              setFilters(f);
              setPage(1);
            }}
          />
        </div>

        {/* Dynamic Mode Viewport */}
        {viewMode === "3D" ? (
          /* 3D Neighborhood Interactive Mode */
          <div className="relative w-full h-[650px] rounded-2xl overflow-hidden border border-celestial-muted/80 shadow-2xl bg-celestial-void">
            <StellarNeighborhoodScene
              stars={filteredStars}
              selectedStarId={selectedStar?.id}
              focusedStarId={focusedStarId}
              showDistanceShells={showDistanceShells}
              onSelectStar={handleSelectStar}
              className="w-full h-full"
            />

            {/* Floating Telemetry Detail Panel */}
            <StarTelemetryPanel
              star={selectedStar}
              onClose={() => setSelectedStar(null)}
              onFocusCamera={handleFocusCamera}
            />
          </div>
        ) : (
          /* Catalog Grid & Table Mode */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedResult.stars.map((star) => {
                const isSun = star.slug === "sun";
                const distLy = star.positional.distanceLightYears ?? 0;

                return (
                  <Card
                    key={star.id}
                    elevated
                    className="group hover:border-celestial-amber/50 transition-all flex flex-col justify-between"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg group-hover:text-celestial-amber transition-colors">
                            {star.canonicalName}
                          </CardTitle>
                          {star.standardDesignation && (
                            <p className="text-xs font-mono text-celestial-subtle mt-0.5">
                              {star.standardDesignation}{" "}
                              {star.physical.constellation && `· ${star.physical.constellation}`}
                            </p>
                          )}
                        </div>
                        <Badge variant="amber" className="text-[11px] font-mono">
                          {star.physical.spectralClass || "STAR"}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                      <p className="text-xs text-celestial-subtle line-clamp-2 leading-relaxed">
                        {star.summary}
                      </p>

                      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-celestial-deep/70 border border-celestial-muted/50 font-mono text-xs">
                        <div>
                          <span className="text-[10px] text-celestial-subtle block">Distance</span>
                          <span className="font-semibold text-celestial-starlight">
                            {isSun ? "0.0 ly (Origin)" : `${distLy.toFixed(2)} ly`}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-celestial-subtle block">Parallax</span>
                          <span className="font-semibold text-celestial-starlight">
                            {isSun ? "—" : `${star.positional.parallaxMas?.toFixed(2)} mas`}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-celestial-subtle block">
                            T_eff (Temp)
                          </span>
                          <span className="font-semibold text-celestial-starlight">
                            {formatTemperature(
                              star.physical.effectiveTemperatureK || star.physical.meanTemperatureK
                            )}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-celestial-subtle block">
                            Luminosity
                          </span>
                          <span className="font-semibold text-celestial-starlight">
                            {star.physical.luminositySolar !== undefined
                              ? `${star.physical.luminositySolar} L☉`
                              : "—"}
                          </span>
                        </div>
                      </div>

                      {star.hostSystemId && (
                        <div className="flex items-center gap-1 text-[11px] text-celestial-cyan font-mono">
                          <Orbit className="w-3.5 h-3.5 shrink-0" />
                          <span>Known Planetary System</span>
                        </div>
                      )}

                      <div className="pt-2 flex items-center justify-between border-t border-celestial-muted/40 text-xs font-mono">
                        <div className="flex items-center gap-1 text-[10px] text-celestial-subtle">
                          <ShieldCheck className="w-3 h-3 text-celestial-cyan" />
                          <span>{star.provenance.authoritativeBody}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedStar(star);
                              setViewMode("3D");
                              handleFocusCamera(star);
                            }}
                            className="inline-flex items-center gap-1 text-celestial-amber hover:underline text-xs"
                          >
                            <Compass className="w-3 h-3" />
                            <span>3D View</span>
                          </button>
                          <span className="text-celestial-muted">|</span>
                          <Link
                            href={`/stars/${star.slug}`}
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
                  {paginatedResult.totalMatches} stars)
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
