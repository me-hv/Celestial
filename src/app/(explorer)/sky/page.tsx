"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ObserverLocation, PRESET_OBSERVER_LOCATIONS } from "@/domain/observer/types";
import {
  CelestialCategory,
  CelestialClassificationCode,
} from "@/domain/celestial-object/classification";
import { skyObjectRepo } from "@/lib/data/sky-object-repository";
import { CelestialSkyScene3D } from "@/features/visualization/sky/CelestialSkyScene3D";
import { AllSkyPlanisphere2D } from "@/features/visualization/sky/AllSkyPlanisphere2D";
import { CelestialSkyView2D } from "@/features/visualization/sky/CelestialSkyView2D";
import { SkyControlsBar, SkyViewMode } from "@/features/sky/components/SkyControlsBar";
import { ObserverLocationModal } from "@/features/sky/components/ObserverLocationModal";
import { SkyTelemetryPanel } from "@/features/sky/components/SkyTelemetryPanel";
import { Telescope, Calendar, Sparkles, Search } from "lucide-react";
import Link from "next/link";

export default function SkyPage() {
  const searchParams = useSearchParams();
  const targetParam = searchParams.get("target");

  // 1. Observer Location & Time State
  const [location, setLocation] = useState<ObserverLocation>(PRESET_OBSERVER_LOCATIONS[0]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeSpeed, setTimeSpeed] = useState<number>(1);
  const [viewMode, setViewMode] = useState<SkyViewMode>("3D_SPHERE");

  // 2. Search & Selection State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string>(targetParam || "sirius");

  // Sync target param from URL
  useEffect(() => {
    if (targetParam) {
      setSelectedSlug(targetParam);
    }
  }, [targetParam]);

  // 3. Time Progression Animation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setDate((prev) => new Date(prev.getTime() + 1000 * timeSpeed));
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, timeSpeed]);

  // 4. Compute Live Sky Objects
  const visibleObjects = useMemo(() => {
    return skyObjectRepo.getVisibleSkyObjects(location, date);
  }, [location, date]);

  // 5. Selected Object Observation
  const selectedObservation = useMemo(() => {
    return skyObjectRepo.getSkyObservation(selectedSlug, location, date) || null;
  }, [selectedSlug, location, date]);

  // 6. Search Filtered Objects
  const searchFilteredObjects = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return skyObjectRepo.searchSky(searchQuery, location, date);
  }, [searchQuery, location, date]);

  return (
    <div className="flex-1 py-8 space-y-6">
      <Container size="xl" className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-celestial-muted/70 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Telescope className="w-6 h-6 text-celestial-cyan" />
              <h1 className="text-2xl font-bold font-mono text-celestial-starlight uppercase">
                Night Sky Observer & Live Observatory
              </h1>
            </div>
            <p className="text-sm text-celestial-subtle">
              Real-time celestial sphere projection and live astronomical ephemeris from ground
              coordinates
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/sky/events">
              <Button
                variant="outline"
                size="sm"
                className="font-mono text-xs gap-1.5 border-celestial-muted/80"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Events
              </Button>
            </Link>
            <Link href="/sky/planner">
              <Button
                variant="outline"
                size="sm"
                className="font-mono text-xs gap-1.5 border-celestial-muted/80"
              >
                <Sparkles className="w-3.5 h-3.5 text-celestial-cyan" />
                Session Planner
              </Button>
            </Link>
            <Badge variant="cyan" className="font-mono text-xs">
              LIVE OBSERVATORY
            </Badge>
          </div>
        </div>

        {/* Global Observer Controls Bar */}
        <SkyControlsBar
          location={location}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
          date={date}
          onDateChange={setDate}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          timeSpeed={timeSpeed}
          onCycleTimeSpeed={() => {
            const speeds = [1, 10, 100, 1000];
            const nextIdx = (speeds.indexOf(timeSpeed) + 1) % speeds.length;
            setTimeSpeed(speeds[nextIdx]);
          }}
          onResetToNow={() => {
            setDate(new Date());
            setIsPlaying(false);
          }}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Search & Quick Filter Bar */}
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-celestial-subtle" />
            <input
              type="text"
              placeholder="Search stars (Sirius, Betelgeuse), planets (Jupiter, Mars), or deep sky (M31, M42)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-celestial-surface/80 border border-celestial-muted/70 text-xs font-mono text-celestial-starlight focus:outline-none focus:border-celestial-cyan backdrop-blur-md"
            />
          </div>

          {searchFilteredObjects.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-30 mt-1 max-h-60 overflow-y-auto rounded-xl bg-celestial-surface border border-celestial-muted/80 shadow-2xl p-1.5 space-y-1">
              {searchFilteredObjects.slice(0, 8).map((obs) => (
                <button
                  key={obs.objectId}
                  onClick={() => {
                    setSelectedSlug(obs.objectSlug);
                    setSearchQuery("");
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-left text-xs font-mono hover:bg-celestial-void transition text-celestial-starlight"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{obs.canonicalName}</span>
                    <Badge
                      variant="outline"
                      className="text-[9px] uppercase py-0 border-celestial-muted"
                    >
                      {obs.type}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-celestial-subtle">
                    Alt: {obs.horizontal.apparentAltitudeDeg}° · {obs.constellation}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Explorer Workspace (Canvas + Telemetry) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Visualizer Canvas */}
          <div className="lg:col-span-8 min-h-[620px]">
            {viewMode === "3D_SPHERE" && (
              <CelestialSkyScene3D
                location={location}
                date={date}
                objects={visibleObjects}
                selectedObjectId={selectedObservation?.objectId}
                onSelectObject={(obs) => setSelectedSlug(obs.objectSlug)}
              />
            )}
            {viewMode === "2D_PLANISPHERE" && (
              <AllSkyPlanisphere2D
                location={location}
                date={date}
                objects={visibleObjects}
                selectedObjectId={selectedObservation?.objectId}
                onSelectObject={(obs) => setSelectedSlug(obs.objectSlug)}
              />
            )}
            {viewMode === "2D_EQUATORIAL" && (
              <CelestialSkyView2D
                objects={visibleObjects.map((obs) => ({
                  id: obs.objectId,
                  slug: obs.objectSlug,
                  canonicalName: obs.canonicalName,
                  standardDesignation: obs.standardDesignation,
                  aliases: [],
                  classification: {
                    category: obs.category as unknown as CelestialCategory,
                    code: obs.type as unknown as CelestialClassificationCode,
                  },
                  physical: { apparentMagnitudeV: obs.apparentMagnitudeV },
                  positional: { rightAscensionDeg: obs.raDeg, declinationDeg: obs.decDeg },
                  provenance: obs.provenance,
                  summary: `Observed in ${obs.constellation}`,
                }))}
                selectedObjectId={selectedObservation?.objectId}
                onSelectObject={(obj) => setSelectedSlug(obj.slug)}
              />
            )}
          </div>

          {/* Right Observational Telemetry Side Panel */}
          <div className="lg:col-span-4 space-y-4">
            <SkyTelemetryPanel observation={selectedObservation} />
          </div>
        </div>

        {/* Location Setup Modal */}
        <ObserverLocationModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          currentLocation={location}
          onSelectLocation={setLocation}
        />
      </Container>
    </div>
  );
}
