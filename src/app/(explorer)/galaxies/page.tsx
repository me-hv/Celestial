"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { galaxyRepo } from "@/lib/data/galaxy-repository";
import { GalaxyMorphologyClass, GroupMembershipType } from "@/domain/galaxy/types";
import { GalaxyMorphologyBadge } from "@/features/galaxy/components/GalaxyMorphologyBadge";
import { formatGalaxyDistance } from "@/lib/astronomy/cosmology/distance";

type SortOption = "NAME" | "DIAMETER" | "MASS" | "DISTANCE" | "VELOCITY";

export default function GalaxiesCatalogPage() {
  const [query, setQuery] = useState<string>("");
  const [selectedMorphology, setSelectedMorphology] = useState<GalaxyMorphologyClass | "ALL">(
    "ALL"
  );
  const [selectedMembership, setSelectedMembership] = useState<GroupMembershipType | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("DISTANCE");

  const filteredGalaxies = useMemo(() => {
    let list = galaxyRepo.filter({
      query,
      morphologyClass: selectedMorphology,
      membershipType: selectedMembership,
    });

    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case "NAME":
          return a.name.localeCompare(b.name);
        case "DIAMETER":
          return b.physical.diameterLy.value - a.physical.diameterLy.value;
        case "MASS":
          return (b.physical.totalMassSolar?.value || 0) - (a.physical.totalMassSolar?.value || 0);
        case "DISTANCE":
          return a.distance.distanceKpc.value - b.distance.distanceKpc.value;
        case "VELOCITY":
          return (
            a.kinematics.heliocentricRadialVelocityKmS.value -
            b.kinematics.heliocentricRadialVelocityKmS.value
          );
        default:
          return 0;
      }
    });

    return list;
  }, [query, selectedMorphology, selectedMembership, sortBy]);

  const morphologyOptions: { label: string; value: GalaxyMorphologyClass | "ALL" }[] = [
    { label: "All Morphologies", value: "ALL" },
    { label: "Barred Spiral", value: "BARRED_SPIRAL" },
    { label: "Spiral", value: "SPIRAL" },
    { label: "Elliptical", value: "ELLIPTICAL" },
    { label: "Irregular", value: "IRREGULAR" },
    { label: "Dwarf Spheroidal", value: "DWARF_SPHEROIDAL" },
    { label: "Dwarf Irregular", value: "DWARF_IRREGULAR" },
    { label: "Dwarf Elliptical", value: "DWARF_ELLIPTICAL" },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <Container size="xl" className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold block">
              EXTRAGALACTIC ATLAS · GALAXY DIRECTORY
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
              Galaxy Catalog
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Authoritative catalog of Local Group and nearby galaxies with morphology, kinematics,
              and physical measurements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/local-group">
              <Button variant="default" className="font-mono text-xs">
                3D Local Group Space →
              </Button>
            </Link>
            <Link href="/galaxies/compare">
              <Button variant="outline" className="font-mono text-xs">
                Galaxy Comparison ↔
              </Button>
            </Link>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1.5">
                Search Galaxies / Catalogs
              </label>
              <Input
                type="text"
                placeholder="Search by name, Messier, NGC, UGC, PGC..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-slate-950 border-white/10 text-white placeholder:text-slate-500 font-mono text-xs"
              />
            </div>

            {/* Morphology Filter */}
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1.5">
                Morphology Class
              </label>
              <select
                value={selectedMorphology}
                onChange={(e) =>
                  setSelectedMorphology(e.target.value as GalaxyMorphologyClass | "ALL")
                }
                className="w-full bg-slate-950 border border-white/10 text-white rounded-md px-3 py-2 text-xs font-mono focus:outline-none focus:border-cyan-500"
              >
                {morphologyOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1.5">Sort Ordering</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full bg-slate-950 border border-white/10 text-white rounded-md px-3 py-2 text-xs font-mono focus:outline-none focus:border-cyan-500"
              >
                <option value="DISTANCE">Distance (Closest to Furthest)</option>
                <option value="DIAMETER">Physical Diameter (Largest First)</option>
                <option value="MASS">Total Virial Mass (Largest First)</option>
                <option value="VELOCITY">Radial Velocity</option>
                <option value="NAME">Alphabetical (A - Z)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-white/5">
            <span>
              Found <strong className="text-cyan-400">{filteredGalaxies.length}</strong> galaxies
            </span>
            {(query || selectedMorphology !== "ALL" || selectedMembership !== "ALL") && (
              <button
                onClick={() => {
                  setQuery("");
                  setSelectedMorphology("ALL");
                  setSelectedMembership("ALL");
                }}
                className="text-cyan-400 hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Galaxy Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGalaxies.map((galaxy) => (
            <Card
              key={galaxy.id}
              className="bg-slate-900/60 border-white/10 hover:border-cyan-500/40 transition-all p-5 rounded-2xl flex flex-col justify-between hover:shadow-xl hover:bg-slate-900/80"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-white tracking-tight">{galaxy.name}</h3>
                  <GalaxyMorphologyBadge
                    morphologyClass={galaxy.morphology.class}
                    hubbleType={galaxy.morphology.hubbleDeVaucouleurs}
                  />
                </div>

                {galaxy.standardDesignation && (
                  <p className="text-[11px] font-mono text-slate-400 mb-2">
                    {galaxy.standardDesignation}
                  </p>
                )}

                <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                  {galaxy.summary}
                </p>

                {/* Primary Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950/60 p-3 rounded-xl border border-white/5 mb-4">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Distance</span>
                    <span className="text-cyan-400 font-semibold">
                      {galaxy.slug === "milky-way-galaxy"
                        ? "Home"
                        : formatGalaxyDistance(galaxy.distance.distanceLy.value)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Diameter</span>
                    <span className="text-white">
                      ~{Math.round(galaxy.physical.diameterLy.value).toLocaleString()} ly
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">
                      Radial Velocity
                    </span>
                    <span className="text-slate-300">
                      {galaxy.kinematics.heliocentricRadialVelocityKmS.value > 0 ? "+" : ""}
                      {galaxy.kinematics.heliocentricRadialVelocityKmS.value.toFixed(1)} km/s
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Total Mass</span>
                    <span className="text-amber-400">
                      {galaxy.physical.totalMassSolar
                        ? `${(galaxy.physical.totalMassSolar.value / 1e12).toFixed(2)} × 10¹² M☉`
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Links */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <Link
                  href={`/galaxies/${galaxy.slug}`}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
                >
                  Full Profile →
                </Link>
                {galaxy.slug !== "milky-way-galaxy" && (
                  <Link
                    href={`/galaxies/compare?a=milky-way-galaxy&b=${galaxy.slug}`}
                    className="text-[11px] font-mono text-slate-400 hover:text-slate-200"
                  >
                    Compare with MW ↔
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </main>
  );
}
