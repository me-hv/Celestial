"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cosmicEpochRepo } from "@/lib/data/cosmic-epoch-repository";
import { defaultCosmology } from "@/lib/astronomy/cosmology/cosmology-calculator";
import { CosmicTimeScene } from "@/features/visualization/cosmic-time/CosmicTimeScene";
import { CosmicTimeMapView2D } from "@/features/visualization/cosmic-time/CosmicTimeMapView2D";
import { CosmicTimeSlider } from "@/features/cosmic-time/components/CosmicTimeSlider";
import { CosmicTimeTelemetryPanel } from "@/features/cosmic-time/components/CosmicTimeTelemetryPanel";
import { CosmicEpochCard } from "@/features/cosmic-time/components/CosmicEpochCard";
import { CosmologyConfigSelector } from "@/features/cosmic-time/components/CosmologyConfigSelector";
import { LightConeObjectMarker } from "@/features/visualization/cosmic-time/cosmic-time-renderer";

const SAMPLE_MARKERS: LightConeObjectMarker[] = [
  {
    id: "m-mw",
    name: "Milky Way Galaxy",
    slug: "milky-way-galaxy",
    raDeg: 266.4,
    decDeg: -29.0,
    redshiftZ: 0.0,
    lookbackGyr: 0.0,
    epochType: "MODERN_UNIVERSE",
    type: "GALAXY",
  },
  {
    id: "m-m31",
    name: "Andromeda Galaxy (M31)",
    slug: "andromeda-galaxy",
    raDeg: 10.68,
    decDeg: 41.27,
    redshiftZ: 0.0001,
    lookbackGyr: 0.0025,
    epochType: "MODERN_UNIVERSE",
    type: "GALAXY",
  },
  {
    id: "m-m87",
    name: "M87 (Virgo A)",
    slug: "m87-galaxy",
    raDeg: 187.7,
    decDeg: 12.39,
    redshiftZ: 0.0044,
    lookbackGyr: 0.054,
    epochType: "MODERN_UNIVERSE",
    type: "GALAXY",
  },
  {
    id: "m-perseus",
    name: "Perseus Cluster Core",
    slug: "perseus-cluster",
    raDeg: 49.95,
    decDeg: 41.51,
    redshiftZ: 0.0179,
    lookbackGyr: 0.24,
    epochType: "MODERN_UNIVERSE",
    type: "CLUSTER",
  },
  {
    id: "m-coma",
    name: "Coma Cluster (Abell 1656)",
    slug: "coma-cluster",
    raDeg: 194.9,
    decDeg: 27.98,
    redshiftZ: 0.0231,
    lookbackGyr: 0.32,
    epochType: "MODERN_UNIVERSE",
    type: "CLUSTER",
  },
  {
    id: "m-gnz11",
    name: "GN-z11 Primeval Galaxy",
    slug: "gn-z11",
    raDeg: 189.1,
    decDeg: 62.24,
    redshiftZ: 10.6,
    lookbackGyr: 13.38,
    epochType: "REIONIZATION",
    type: "GALAXY",
  },
  {
    id: "m-jades",
    name: "JADES-GS-z14-0 Primeval Galaxy",
    slug: "jades-gs-z14-0",
    raDeg: 53.16,
    decDeg: -27.79,
    redshiftZ: 14.32,
    lookbackGyr: 13.51,
    epochType: "FIRST_STARS",
    type: "GALAXY",
  },
];

type ViewMode = "3D_LIGHT_CONE" | "2D_MAP";

function CosmicTimeContent() {
  const searchParams = useSearchParams();
  const epochs = useMemo(() => cosmicEpochRepo.getAll(), []);

  const [viewMode, setViewMode] = useState<ViewMode>("3D_LIGHT_CONE");
  const [lookbackGyr, setLookbackGyr] = useState<number>(0.0);
  const [selectedEpochSlug, setSelectedEpochSlug] = useState<string>("modern-universe");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  // Read search param ?z=... or ?epoch=...
  useEffect(() => {
    const zParam = searchParams.get("z");
    const epochParam = searchParams.get("epoch");

    if (zParam) {
      const z = parseFloat(zParam);
      if (!isNaN(z) && z >= 0) {
        const tL = defaultCosmology.calculateLookbackTimeGyr(z);
        setLookbackGyr(tL);
        const resolvedEpoch = cosmicEpochRepo.getEpochForRedshift(z);
        setSelectedEpochSlug(resolvedEpoch.slug);
      }
    } else if (epochParam) {
      const resolved = cosmicEpochRepo.getBySlug(epochParam);
      if (resolved) {
        setSelectedEpochSlug(resolved.slug);
        const avgLookback =
          (resolved.lookbackTimeRangeGyr.minGyr + resolved.lookbackTimeRangeGyr.maxGyr) / 2.0;
        setLookbackGyr(avgLookback);
      }
    }
  }, [searchParams]);

  // Sync active epoch with lookbackGyr changes
  useEffect(() => {
    const epoch = cosmicEpochRepo.getEpochForLookbackTime(lookbackGyr);
    if (epoch && epoch.slug !== selectedEpochSlug) {
      setSelectedEpochSlug(epoch.slug);
    }
  }, [lookbackGyr, selectedEpochSlug]);

  const activeEpoch = useMemo(() => {
    return cosmicEpochRepo.getBySlug(selectedEpochSlug) ?? epochs[epochs.length - 1];
  }, [selectedEpochSlug, epochs]);

  const filteredEpochs = useMemo(() => {
    if (categoryFilter === "ALL") return epochs;
    return epochs.filter((e) => e.category === categoryFilter);
  }, [epochs, categoryFilter]);

  const handleSelectEpoch = (slug: string) => {
    setSelectedEpochSlug(slug);
    const epoch = cosmicEpochRepo.getBySlug(slug);
    if (epoch) {
      const avgLookback =
        (epoch.lookbackTimeRangeGyr.minGyr + epoch.lookbackTimeRangeGyr.maxGyr) / 2.0;
      setLookbackGyr(avgLookback);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 gap-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono tracking-wider uppercase text-cyan-400 font-semibold">
              CELESTIAL COSMIC TIME MACHINE • UNIVERSE TIMELINE
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100">
            Cosmic Time & Spacetime Horizon
          </h1>
          <p className="text-sm text-slate-400 font-mono mt-1">
            Looking farther into space means looking deeper into cosmic history.
          </p>
        </div>

        {/* View Mode Controls & Observable Universe Bridge */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/observable-universe"
            className="px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-300 border border-orange-500/30 hover:bg-orange-500/20 text-xs font-mono transition-colors flex items-center gap-1.5"
          >
            <span>Observable Universe</span>
          </Link>

          <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setViewMode("3D_LIGHT_CONE")}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                viewMode === "3D_LIGHT_CONE"
                  ? "bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>3D PAST LIGHT CONE</span>
            </button>
            <button
              onClick={() => setViewMode("2D_MAP")}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                viewMode === "2D_MAP"
                  ? "bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>2D SPACETIME MAP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Visualizer Viewport */}
      <div className="w-full h-[520px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
        {viewMode === "3D_LIGHT_CONE" ? (
          <CosmicTimeScene
            epochs={epochs}
            selectedEpochSlug={selectedEpochSlug}
            onSelectEpoch={handleSelectEpoch}
            markers={SAMPLE_MARKERS}
          />
        ) : (
          <CosmicTimeMapView2D
            epochs={epochs}
            selectedEpochSlug={selectedEpochSlug}
            onSelectEpoch={handleSelectEpoch}
            currentLookbackGyr={lookbackGyr}
            onTimeChange={(t) => setLookbackGyr(t)}
          />
        )}
      </div>

      {/* Interactive Time Slider Controller */}
      <CosmicTimeSlider
        lookbackGyr={lookbackGyr}
        onLookbackChange={(t) => setLookbackGyr(t)}
        epochs={epochs}
        selectedEpoch={activeEpoch}
        onSelectEpoch={handleSelectEpoch}
      />

      {/* Real-Time Telemetry & Epoch Dossier Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CosmicTimeTelemetryPanel epoch={activeEpoch} lookbackGyr={lookbackGyr} />
        </div>
        <div>
          <CosmologyConfigSelector />
        </div>
      </div>

      {/* Cosmic Epochs Directory & Explorer */}
      <div className="flex flex-col gap-5 pt-6 border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">
              Cosmological Epochs Directory (14 Eras)
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              From the Planck Singularity (t = 0) to Present Day Cosmic Acceleration
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 text-xs font-mono">
            {[
              "ALL",
              "VERY_EARLY_UNIVERSE",
              "EARLY_UNIVERSE",
              "STRUCTURE_FORMATION",
              "MODERN_UNIVERSE",
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg border transition-colors ${
                  categoryFilter === cat
                    ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300 font-semibold"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {cat.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEpochs.map((ep) => (
            <CosmicEpochCard
              key={ep.id}
              epoch={ep}
              isSelected={ep.slug === selectedEpochSlug}
              onSelect={handleSelectEpoch}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CosmicTimePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-slate-950 text-cyan-400 font-mono">
          Loading Cosmic Time Machine...
        </div>
      }
    >
      <CosmicTimeContent />
    </Suspense>
  );
}
