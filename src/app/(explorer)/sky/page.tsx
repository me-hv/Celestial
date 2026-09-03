"use client";

import React, { useState, useEffect, useMemo, Suspense, useCallback } from "react";
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
import { SkyIntelligenceEngine } from "@/domain/sky-intelligence/sky-intelligence-engine";
import { CelestialSkyScene3D } from "@/features/visualization/sky/CelestialSkyScene3D";
import { AllSkyPlanisphere2D } from "@/features/visualization/sky/AllSkyPlanisphere2D";
import { CelestialSkyView2D } from "@/features/visualization/sky/CelestialSkyView2D";
import { SkyControlsBar, SkyViewMode } from "@/features/sky/components/SkyControlsBar";
import { ObserverLocationModal } from "@/features/sky/components/ObserverLocationModal";
import { SkyTelemetryPanel } from "@/features/sky/components/SkyTelemetryPanel";
import { WhatsVisibleTonightCard } from "@/features/sky/components/WhatsVisibleTonightCard";
import { SkyTimelineCard } from "@/features/sky/components/SkyTimelineCard";
import { Telescope, Calendar, Sparkles, Search } from "lucide-react";
import Link from "next/link";

function SkyExplorerContent() {
  const searchParams = useSearchParams();
  const targetParam = searchParams.get("target");
  const latParam = searchParams.get("lat");
  const lonParam = searchParams.get("lon");
  const dateParam = searchParams.get("date");
  const modeParam = searchParams.get("mode") as SkyViewMode | null;

  // 1. Observer Location State (with local-first persistence)
  const [location, setLocation] = useState<ObserverLocation>(() => {
    if (latParam && lonParam) {
      const lat = parseFloat(latParam);
      const lon = parseFloat(lonParam);
      if (!isNaN(lat) && !isNaN(lon)) {
        return {
          id: "loc-custom-url",
          name: `Custom Location (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`,
          latitudeDeg: lat,
          longitudeDeg: lon,
          elevationMeters: 0,
          timezone: "UTC",
          isCustom: true,
        };
      }
    }
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("celestial_observer_location");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed.latitudeDeg === "number") return parsed;
        }
      } catch {
        // Fallback to Greenwich
      }
    }
    return PRESET_OBSERVER_LOCATIONS[0];
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [date, setDate] = useState<Date>(() => {
    if (dateParam) {
      const parsed = new Date(dateParam);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return new Date();
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [timeSpeed, setTimeSpeed] = useState<number>(1);
  const [viewMode, setViewMode] = useState<SkyViewMode>(modeParam || "3D_SPHERE");
  const [isTracked, setIsTracked] = useState(false);

  const handleSetLocation = (newLoc: ObserverLocation) => {
    setLocation(newLoc);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("celestial_observer_location", JSON.stringify(newLoc));
      } catch {
        // Storage quota or error
      }
    }
  };

  // 2. Search & Selection State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string>(targetParam || "sirius");

  // Sync target param from URL
  useEffect(() => {
    if (targetParam && targetParam !== selectedSlug) {
      setSelectedSlug(targetParam);
    }
  }, [targetParam]);

  // 2.5 Real-time Sky Intelligence
  const skySummary = useMemo(
    () => SkyIntelligenceEngine.getCurrentSkySummary(location, date),
    [location, date]
  );

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

  const handleSelectObject = useCallback((slug: string) => {
    setSelectedSlug(slug);
  }, []);

  return (
    <div className="flex-1 py-6 space-y-6">
      <Container size="xl" className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-celestial-muted/70 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Telescope className="w-6 h-6 text-celestial-cyan" />
              <h1 className="text-2xl font-bold font-mono text-celestial-starlight uppercase">
                Night Sky Observer & Live Observatory
              </h1>
            </div>
            <p className="text-sm text-celestial-subtle font-mono">
              Real-time celestial sphere projection, Alt/Az astrometry, and planetary ephemerides
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link href="/sky/events">
              <Button
                variant="outline"
                size="sm"
                className="font-mono text-xs gap-1.5 border-celestial-muted/80"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Events Schedule
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
            const speeds = [1, 10, 100, 1000, 10000];
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

        {/* Real-Time Sky Intelligence Banner */}
        <div className="p-4 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/60 backdrop-blur-md space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-celestial-cyan uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> What's Happening In Your Sky Right Now
              </span>
              <Badge
                variant="outline"
                className="text-[10px] font-mono text-emerald-400 border-emerald-500/40"
              >
                {skySummary.twilightPhase.replace(/_/g, " ")}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-celestial-subtle">
              <span>
                Darkness Index:{" "}
                <strong className="text-celestial-starlight">
                  {skySummary.skyDarknessScore}/100
                </strong>
              </span>
              <span>•</span>
              <span>
                Moon:{" "}
                <strong className="text-celestial-starlight">
                  {(skySummary.moonIlluminationFraction * 100).toFixed(0)}%
                </strong>
              </span>
            </div>
          </div>

          {/* Top Recommended Observable Targets */}
          {skySummary.topTargetsRightNow.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-celestial-muted/40">
              <span className="text-[10px] font-mono uppercase text-celestial-subtle whitespace-nowrap">
                Top Targets:
              </span>
              {skySummary.topTargetsRightNow.slice(0, 5).map((rec) => (
                <button
                  key={rec.targetSlug}
                  onClick={() => handleSelectObject(rec.targetSlug)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono border whitespace-nowrap transition flex items-center gap-1.5 ${
                    selectedSlug === rec.targetSlug
                      ? "bg-celestial-cyan/20 border-celestial-cyan text-celestial-cyan font-bold"
                      : "bg-celestial-void/60 border-celestial-muted/60 text-celestial-starlight hover:border-celestial-cyan/50"
                  }`}
                >
                  <span>{rec.name}</span>
                  <span className="text-[10px] text-celestial-subtle">({rec.altitudeDeg}°)</span>
                </button>
              ))}
            </div>
          )}
        </div>

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
                    handleSelectObject(obs.objectSlug);
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
          {/* Main Visualizer Canvas & Timeline */}
          <div className="lg:col-span-8 min-h-[620px] flex flex-col space-y-6">
            <div className="flex-1 min-h-[580px]">
              {viewMode === "3D_SPHERE" && (
                <CelestialSkyScene3D
                  location={location}
                  date={date}
                  objects={visibleObjects}
                  selectedObjectId={selectedObservation?.objectId}
                  isTracked={isTracked}
                  onSelectObject={(obs) => handleSelectObject(obs.objectSlug)}
                />
              )}
              {viewMode === "2D_PLANISPHERE" && (
                <AllSkyPlanisphere2D
                  location={location}
                  date={date}
                  objects={visibleObjects}
                  selectedObjectId={selectedObservation?.objectId}
                  onSelectObject={(obs) => handleSelectObject(obs.objectSlug)}
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
                  onSelectObject={(obj) => handleSelectObject(obj.slug)}
                />
              )}
            </div>

            {/* Night Observation Timeline Bar */}
            <SkyTimelineCard location={location} date={date} onDateChange={setDate} />

            {/* "What's Visible Tonight?" Workspace Card */}
            <WhatsVisibleTonightCard
              objects={visibleObjects}
              selectedObjectId={selectedObservation?.objectId}
              onSelectObject={(obs) => handleSelectObject(obs.objectSlug)}
            />
          </div>

          {/* Right Observational Telemetry Side Panel */}
          <div className="lg:col-span-4 space-y-4">
            <SkyTelemetryPanel
              observation={selectedObservation}
              isTracked={isTracked}
              onToggleTrack={() => setIsTracked(!isTracked)}
            />
          </div>
        </div>

        {/* Location Setup Modal */}
        <ObserverLocationModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          currentLocation={location}
          onSelectLocation={handleSetLocation}
        />
      </Container>
    </div>
  );
}

export default function SkyPage() {
  return (
    <Suspense fallback={<div className="flex-1 bg-celestial-void" />}>
      <SkyExplorerContent />
    </Suspense>
  );
}
