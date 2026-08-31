"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { cosmicStructureRepo } from "@/lib/data/cosmic-structure-repository";
import { CosmicStructureTypeBadge } from "@/features/cosmic-web/components/CosmicStructureTypeBadge";
import { CosmicLocationBreadcrumb } from "@/features/cosmic-web/components/CosmicLocationBreadcrumb";
import { formatLookbackTime } from "@/lib/astronomy/cosmology/distance";
import { Button } from "@/components/ui/button";

export default function CosmicWebOverviewPage() {
  const allStructures = useMemo(() => cosmicStructureRepo.getAll(), []);

  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"distance" | "mass" | "size" | "name">("distance");
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = useMemo(() => {
    return allStructures
      .filter((s) => {
        if (typeFilter !== "ALL" && s.type !== typeFilter) return false;
        if (statusFilter !== "ALL" && s.observationStatus !== statusFilter) return false;
        if (search.trim()) {
          const q = search.toLowerCase().trim();
          const matchesName = s.name.toLowerCase().includes(q);
          const matchesDesig = s.standardDesignation?.toLowerCase().includes(q);
          const matchesAliases = s.aliases?.some((a) => a.toLowerCase().includes(q));
          if (!matchesName && !matchesDesig && !matchesAliases) return false;
        }
        return true;
      })
      .sort((a, b) => {
        let valA = 0;
        let valB = 0;
        if (sortField === "distance") {
          valA = a.coordinates.distanceMpc.value;
          valB = b.coordinates.distanceMpc.value;
        } else if (sortField === "mass") {
          valA = a.physical.estimatedMassSolar?.value ?? 0;
          valB = b.physical.estimatedMassSolar?.value ?? 0;
        } else if (sortField === "size") {
          valA = a.dimensions.majorAxisMpc.value;
          valB = b.dimensions.majorAxisMpc.value;
        } else if (sortField === "name") {
          return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }
        return sortAsc ? valA - valB : valB - valA;
      });
  }, [allStructures, typeFilter, statusFilter, search, sortField, sortAsc]);

  const toggleSort = (field: "distance" | "mass" | "size" | "name") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Header */}
      <div className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl sticky top-16 z-30 px-4 py-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
              EXTRAGALACTIC CENSUS & STRUCTURE CATALOG
            </span>
            <h1 className="text-2xl font-bold font-mono text-white mt-1">Cosmic Web Directory</h1>
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

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 pt-8 flex flex-col gap-6">
        {/* Filters and Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-900/60 p-4 border border-white/5 backdrop-blur-md">
          {/* Search */}
          <input
            type="text"
            placeholder="Search catalog by name, designation, or alias..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 w-full md:w-80"
          />

          {/* Type Filter */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="GALAXY_CLUSTER">Clusters</option>
              <option value="SUPERCLUSTER">Superclusters</option>
              <option value="GALAXY_GROUP">Groups</option>
              <option value="VOID">Voids</option>
              <option value="WALL">Walls & Sheets</option>
              <option value="FILAMENT">Filaments</option>
            </select>
          </div>

          {/* Observation Status Filter */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="OBSERVED">Observed</option>
              <option value="MODEL_DERIVED">Model-Derived</option>
              <option value="INFERRED">Inferred</option>
            </select>
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/60 shadow-2xl backdrop-blur-md">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 bg-slate-900/60 text-slate-400">
                <th
                  onClick={() => toggleSort("name")}
                  className="p-3.5 font-semibold cursor-pointer hover:text-white transition-colors"
                >
                  Structure Name {sortField === "name" && (sortAsc ? "↑" : "↓")}
                </th>
                <th className="p-3.5 font-semibold">Classification</th>
                <th
                  onClick={() => toggleSort("distance")}
                  className="p-3.5 font-semibold cursor-pointer hover:text-white transition-colors"
                >
                  Distance {sortField === "distance" && (sortAsc ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => toggleSort("size")}
                  className="p-3.5 font-semibold cursor-pointer hover:text-white transition-colors"
                >
                  Major Span {sortField === "size" && (sortAsc ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => toggleSort("mass")}
                  className="p-3.5 font-semibold cursor-pointer hover:text-white transition-colors"
                >
                  Est. Mass {sortField === "mass" && (sortAsc ? "↑" : "↓")}
                </th>
                <th className="p-3.5 font-semibold">Lookback / Redshift</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((struct) => (
                <tr key={struct.slug} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3.5">
                    <Link
                      href={`/cosmic-web/${struct.slug}`}
                      className="font-bold text-white hover:text-cyan-400 transition-colors block"
                    >
                      {struct.name}
                    </Link>
                    {struct.standardDesignation && (
                      <span className="text-[10px] text-slate-400 block">
                        {struct.standardDesignation}
                      </span>
                    )}
                  </td>

                  <td className="p-3.5">
                    <CosmicStructureTypeBadge
                      type={struct.type}
                      observationStatus={struct.observationStatus}
                    />
                  </td>

                  <td className="p-3.5">
                    <span className="text-cyan-300 font-semibold">
                      {struct.coordinates.distanceMpc.value === 0
                        ? "0 Mpc (Home)"
                        : `${struct.coordinates.distanceMpc.value.toFixed(1)} Mpc`}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      ~{(struct.coordinates.distanceLy.value / 1e6).toFixed(1)} Mly
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span className="text-white">
                      {struct.dimensions.majorAxisMpc.value.toFixed(1)} Mpc
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span className="text-amber-300 font-semibold">
                      {struct.physical.estimatedMassSolar?.value
                        ? `${(struct.physical.estimatedMassSolar.value / 1e12).toFixed(1)} × 10¹² M☉`
                        : "Diffuse / Void"}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <span className="text-emerald-300">
                      z = {struct.coordinates.spectroscopicRedshiftZ?.value.toFixed(4) ?? "0.0000"}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {formatLookbackTime(struct.coordinates.lookbackTimeYears)}
                    </span>
                  </td>

                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/cosmic-web/${struct.slug}`}>
                        <Button variant="outline" size="sm" className="text-xs px-2.5">
                          View
                        </Button>
                      </Link>
                      <Link href={`/cosmic-web/compare?a=${struct.slug}&b=virgo-cluster`}>
                        <Button variant="secondary" size="sm" className="text-xs px-2.5">
                          Compare
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
