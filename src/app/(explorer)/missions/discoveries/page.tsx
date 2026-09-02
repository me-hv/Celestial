"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Sparkles, Search, ArrowLeft, ExternalLink, Target, Rocket, Calendar } from "lucide-react";
import { missionRepo } from "@/lib/data/mission-repository";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DiscoveriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedEpistemic, setSelectedEpistemic] = useState<string>("ALL");

  const allDiscoveries = useMemo(() => missionRepo.getAllDiscoveries(), []);

  const filteredDiscoveries = useMemo(() => {
    return allDiscoveries.filter((d) => {
      if (selectedType !== "ALL" && d.discoveryType !== selectedType) {
        return false;
      }
      if (selectedEpistemic !== "ALL" && d.epistemicStatus !== selectedEpistemic) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = d.title.toLowerCase().includes(q);
        const matchDesc = d.description.toLowerCase().includes(q);
        const matchTarget = d.targetName?.toLowerCase().includes(q);
        const matchSig = d.scientificSignificance.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchTarget && !matchSig) {
          return false;
        }
      }
      return true;
    });
  }, [allDiscoveries, selectedType, selectedEpistemic, searchQuery]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl animate-fade-in">
      {/* Navigation and Header */}
      <div className="space-y-4">
        <Link href="/missions">
          <Button
            variant="ghost"
            size="sm"
            className="font-mono text-xs text-celestial-subtle hover:text-celestial-starlight gap-1.5 pl-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO MISSIONS EXPLORER</span>
          </Button>
        </Link>

        <div className="relative rounded-2xl overflow-hidden border border-celestial-purple/40 bg-gradient-to-b from-celestial-purple/15 to-celestial-void p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-2 text-celestial-purple mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-mono text-xs uppercase tracking-wider font-semibold">
              Scientific Discoveries & Astronomical Provenance
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-celestial-starlight tracking-tight">
            Major Space Science Discoveries
          </h1>
          <p className="text-sm text-celestial-subtle leading-relaxed max-w-3xl mt-2">
            Authoritative scientific breakthroughs discovered through robotic exploration and space
            astronomy. Each discovery includes its epistemic classification, observational evidence,
            and primary publication citation.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-celestial-surface/40 p-4 rounded-xl border border-celestial-muted/80 backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-celestial-subtle" />
          <Input
            type="text"
            placeholder="Search discoveries by target, title, or physical mechanism..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-celestial-surface/80 border-celestial-muted/80 text-celestial-starlight text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-celestial-surface border border-celestial-muted/80 text-celestial-starlight text-xs rounded-lg px-3 py-2 font-mono outline-none focus:border-celestial-cyan"
            aria-label="Filter by Discovery Type"
          >
            <option value="ALL">All Discovery Types</option>
            <option value="WATER_EVIDENCE">Water Evidence & Oceans</option>
            <option value="ORGANIC_MOLECULES">Organic Molecules</option>
            <option value="GEOLOGICAL_DISCOVERY">Geological Dynamics</option>
            <option value="COSMOLOGICAL_DISCOVERY">Cosmology & Early Galaxies</option>
            <option value="SOLAR_PHYSICS">Solar & Coronal Physics</option>
            <option value="PLASMA_PHYSICS">Plasma & Heliopause</option>
            <option value="ATMOSPHERIC_DISCOVERY">Atmospheric Dynamics</option>
          </select>

          {/* Epistemic Status Filter */}
          <select
            value={selectedEpistemic}
            onChange={(e) => setSelectedEpistemic(e.target.value)}
            className="bg-celestial-surface border border-celestial-muted/80 text-celestial-starlight text-xs rounded-lg px-3 py-2 font-mono outline-none focus:border-celestial-cyan"
            aria-label="Filter by Epistemic Status"
          >
            <option value="ALL">All Epistemic Classes</option>
            <option value="OBSERVED">OBSERVED (Direct In-Situ / Empirical)</option>
            <option value="INFERRED">INFERRED (Spectroscopic / Indirect)</option>
            <option value="MODEL_DERIVED">MODEL DERIVED (Theoretical / Parametric)</option>
          </select>
        </div>
      </div>

      {/* Discoveries List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDiscoveries.map((disc) => {
          const parentMission = missionRepo.getById(disc.missionId);

          return (
            <div
              key={disc.id}
              className="rounded-2xl border border-celestial-purple/30 bg-celestial-surface/50 hover:bg-celestial-surface/80 p-6 backdrop-blur-lg transition-all duration-300 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge
                    variant="outline"
                    className="text-[10px] font-mono uppercase border-celestial-purple/40 text-celestial-purple"
                  >
                    {disc.epistemicStatus}
                  </Badge>

                  <div className="flex items-center gap-1.5 text-xs font-mono text-celestial-subtle">
                    <Calendar className="w-3.5 h-3.5 text-celestial-cyan" />
                    <span>
                      {new Date(disc.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-celestial-starlight leading-snug">
                  {disc.title}
                </h2>

                {/* Target & Mission Chip */}
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  {disc.targetName && (
                    <span className="bg-celestial-void/60 border border-celestial-muted/60 px-2 py-1 rounded text-celestial-cyan flex items-center gap-1">
                      <Target className="w-3 h-3" /> {disc.targetName}
                    </span>
                  )}
                  {parentMission && (
                    <Link href={`/missions/${parentMission.slug}`} className="hover:underline">
                      <span className="bg-celestial-void/60 border border-celestial-muted/60 px-2 py-1 rounded text-celestial-starlight flex items-center gap-1">
                        <Rocket className="w-3 h-3 text-celestial-amber" /> {parentMission.name}
                      </span>
                    </Link>
                  )}
                </div>

                <p className="text-xs text-celestial-subtle leading-relaxed">{disc.description}</p>

                <div className="text-xs text-celestial-purple/90 bg-celestial-purple/5 p-3 rounded-xl border border-celestial-purple/20">
                  <span className="font-bold">Scientific Significance:</span>{" "}
                  {disc.scientificSignificance}
                </div>
              </div>

              {disc.citationUrl && (
                <div className="pt-3 border-t border-celestial-muted/60 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-celestial-subtle">
                    Verified Primary Source
                  </span>
                  <a
                    href={disc.citationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-celestial-cyan hover:underline flex items-center gap-1"
                  >
                    <span>Journal Paper (DOI)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
