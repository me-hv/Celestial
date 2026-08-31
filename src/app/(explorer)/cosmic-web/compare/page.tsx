"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cosmicStructureRepo } from "@/lib/data/cosmic-structure-repository";
import { CosmicStructureComparisonTable } from "@/features/cosmic-web/components/CosmicStructureComparisonTable";
import { CosmicLocationBreadcrumb } from "@/features/cosmic-web/components/CosmicLocationBreadcrumb";
import { Button } from "@/components/ui/button";

export default function CosmicStructureComparePage() {
  const searchParams = useSearchParams();
  const allStructures = useMemo(() => cosmicStructureRepo.getAll(), []);

  const initialSlugA = searchParams.get("a") || "local-group";
  const initialSlugB = searchParams.get("b") || "virgo-cluster";

  const [slugA, setSlugA] = useState(initialSlugA);
  const [slugB, setSlugB] = useState(initialSlugB);

  const structA = cosmicStructureRepo.getBySlug(slugA) || allStructures[0];
  const structB = cosmicStructureRepo.getBySlug(slugB) || allStructures[1];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Header */}
      <div className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl sticky top-16 z-30 px-4 py-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
              COSMOLOGICAL COMPARATIVE ANALYSIS
            </span>
            <h1 className="text-2xl font-bold font-mono text-white mt-1">Structure Comparison</h1>
          </div>

          <div className="flex items-center gap-3">
            <CosmicLocationBreadcrumb currentStage="COSMIC_WEB" />
            <Link href="/cosmic-web">
              <Button variant="cyan" size="sm" className="text-xs font-mono">
                ← 3D Explorer
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 pt-8 flex flex-col gap-8">
        {/* Selector Pickers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-2xl bg-slate-900/60 p-6 border border-white/5 backdrop-blur-md">
          {/* Structure A Picker */}
          <div className="space-y-2 font-mono text-xs">
            <label className="text-cyan-400 font-bold uppercase tracking-wider block">
              Structure A (Reference):
            </label>
            <select
              value={slugA}
              onChange={(e) => setSlugA(e.target.value)}
              className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl p-3 text-sm text-white font-semibold focus:outline-none focus:border-cyan-500"
            >
              {allStructures.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name} ({s.type.replace(/_/g, " ")}) — {s.coordinates.distanceMpc.value} Mpc
                </option>
              ))}
            </select>
          </div>

          {/* Structure B Picker */}
          <div className="space-y-2 font-mono text-xs">
            <label className="text-purple-400 font-bold uppercase tracking-wider block">
              Structure B (Target):
            </label>
            <select
              value={slugB}
              onChange={(e) => setSlugB(e.target.value)}
              className="w-full bg-slate-950 border border-purple-500/30 rounded-xl p-3 text-sm text-white font-semibold focus:outline-none focus:border-purple-500"
            >
              {allStructures.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name} ({s.type.replace(/_/g, " ")}) — {s.coordinates.distanceMpc.value} Mpc
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Table */}
        {structA && structB ? (
          <CosmicStructureComparisonTable structureA={structA} structureB={structB} />
        ) : (
          <p className="text-sm font-mono text-slate-400 text-center py-12">
            Select two structures above to begin comparative analysis.
          </p>
        )}
      </div>
    </div>
  );
}
