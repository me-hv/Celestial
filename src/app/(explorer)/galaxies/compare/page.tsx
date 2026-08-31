"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { galaxyRepo } from "@/lib/data/galaxy-repository";
import { GalaxyComparisonTable } from "@/features/galaxy/components/GalaxyComparisonTable";

function GalaxyCompareContent() {
  const searchParams = useSearchParams();
  const initialA = searchParams.get("a") || "milky-way-galaxy";
  const initialB = searchParams.get("b") || "andromeda-galaxy";

  const [slugA, setSlugA] = useState<string>(initialA);
  const [slugB, setSlugB] = useState<string>(initialB);

  const allGalaxies = useMemo(() => galaxyRepo.getAll(), []);

  const galaxyA = useMemo(
    () => galaxyRepo.getBySlug(slugA) || allGalaxies[0],
    [slugA, allGalaxies]
  );
  const galaxyB = useMemo(
    () => galaxyRepo.getBySlug(slugB) || allGalaxies[1],
    [slugB, allGalaxies]
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <Container size="xl" className="space-y-8">
        {/* Header */}
        <div className="space-y-3 border-b border-white/10 pb-6">
          <Link
            href="/galaxies"
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition"
          >
            ← Back to Galaxy Catalog
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold block">
                EXTRAGALACTIC COMPARISON ENGINE
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
                Galaxy Comparison Workbench
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/local-group">
                <Button variant="default" className="font-mono text-xs">
                  3D Local Group Space →
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Selection Selectors */}
        <Card className="bg-slate-900/60 border-white/10 p-5 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-2 font-semibold">
                Galaxy A (Primary Baseline)
              </label>
              <select
                value={slugA}
                onChange={(e) => setSlugA(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-cyan-500"
              >
                {allGalaxies.map((g) => (
                  <option key={g.slug} value={g.slug}>
                    {g.name} ({g.morphology.hubbleDeVaucouleurs})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-purple-400 uppercase tracking-wider block mb-2 font-semibold">
                Galaxy B (Comparison Target)
              </label>
              <select
                value={slugB}
                onChange={(e) => setSlugB(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-purple-500"
              >
                {allGalaxies.map((g) => (
                  <option key={g.slug} value={g.slug}>
                    {g.name} ({g.morphology.hubbleDeVaucouleurs})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Comparison Table */}
        <Card className="bg-slate-900/40 border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-tight font-mono">
              Side-by-Side Metric Comparison
            </h2>
            <span className="text-xs font-mono text-slate-400">
              Uncertainty-Aware Observational Values
            </span>
          </div>
          <GalaxyComparisonTable galaxyA={galaxyA} galaxyB={galaxyB} />
        </Card>

        {/* Quick Comparison Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-mono text-slate-400 mr-2">Quick Presets:</span>
          <button
            onClick={() => {
              setSlugA("milky-way-galaxy");
              setSlugB("andromeda-galaxy");
            }}
            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-mono text-cyan-400 rounded-lg"
          >
            Milky Way vs Andromeda
          </button>
          <button
            onClick={() => {
              setSlugA("andromeda-galaxy");
              setSlugB("triangulum-galaxy");
            }}
            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-mono text-purple-400 rounded-lg"
          >
            Andromeda vs Triangulum
          </button>
          <button
            onClick={() => {
              setSlugA("large-magellanic-cloud");
              setSlugB("small-magellanic-cloud");
            }}
            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-mono text-amber-400 rounded-lg"
          >
            LMC vs SMC
          </button>
        </div>
      </Container>
    </main>
  );
}

export default function GalaxyComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 p-10 text-white font-mono">
          Loading Comparison Workbench...
        </div>
      }
    >
      <GalaxyCompareContent />
    </Suspense>
  );
}
