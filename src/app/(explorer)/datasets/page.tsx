"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Database,
  Search,
  ArrowRight,
  Filter,
  ShieldCheck,
  Radio,
} from "lucide-react";
import { datasetRepo } from "@/lib/data/dataset-repository";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScientificDiscipline, WavelengthBand } from "@/domain/data-provider/types";

export default function DatasetsHubPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("ALL");
  const [selectedWavelength, setSelectedWavelength] = useState<string>("ALL");

  const filtered = useMemo(() => {
    return datasetRepo.filter({
      search: searchQuery,
      discipline: selectedDiscipline !== "ALL" ? (selectedDiscipline as ScientificDiscipline) : undefined,
      wavelengthBand: selectedWavelength !== "ALL" ? (selectedWavelength as WavelengthBand) : undefined,
    });
  }, [searchQuery, selectedDiscipline, selectedWavelength]);

  return (
    <div className="w-full min-h-screen bg-celestial-void text-celestial-starlight p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-celestial-muted/60 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="cyan" className="font-mono text-xs uppercase tracking-wider">
              <Database className="w-3.5 h-3.5 mr-1" /> Multi-Agency Data Archive
            </Badge>
            <span className="font-mono text-xs text-celestial-subtle">Phase 13</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Scientific Datasets & Primary Archives
          </h1>
          <p className="text-xs sm:text-sm text-celestial-subtle">
            Access authenticated, PDS4-compliant datasets, spectra, and catalogs from ISRO, NASA, ESA, JAXA, CNSA, ESO, and NOAA with full pipeline transformation provenance.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 sm:p-6 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/50 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-celestial-subtle absolute left-3 top-2.5" />
            <Input
              placeholder="Search datasets by target, mission, instrument, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-celestial-void/60 border-celestial-muted/80"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-celestial-subtle">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Strict Epistemic Provenance</span>
          </div>
        </div>

        {/* Multi-facet Filter Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-celestial-muted/40">
          <div className="flex items-center gap-1 text-[11px] font-mono text-celestial-subtle uppercase mr-2">
            <Filter className="w-3 h-3 text-celestial-cyan" /> Discipline:
          </div>
          {["ALL", "PLANETARY_SCIENCE", "ASTROPHYSICS", "COSMOLOGY", "SOLAR_PHYSICS", "ASTROMETRY"].map((d) => (
            <Button
              key={d}
              size="sm"
              variant={selectedDiscipline === d ? "cyan" : "outline"}
              className="h-7 text-[10px] font-mono uppercase"
              onClick={() => setSelectedDiscipline(d)}
            >
              {d.replace("_", " ")}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-celestial-muted/40">
          <div className="flex items-center gap-1 text-[11px] font-mono text-celestial-subtle uppercase mr-2">
            <Radio className="w-3 h-3 text-celestial-amber" /> Band:
          </div>
          {["ALL", "OPTICAL", "INFRARED", "RADIO", "XRAY", "PARTICLE"].map((w) => (
            <Button
              key={w}
              size="sm"
              variant={selectedWavelength === w ? "cyan" : "outline"}
              className="h-7 text-[10px] font-mono uppercase"
              onClick={() => setSelectedWavelength(w)}
            >
              {w}
            </Button>
          ))}
        </div>
      </div>

      {/* Dataset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((ds) => (
          <div
            key={ds.id}
            className="group relative flex flex-col justify-between rounded-2xl border border-celestial-muted/80 bg-celestial-surface/50 hover:bg-celestial-surface/80 p-5 backdrop-blur-lg transition-all duration-300 hover:border-celestial-cyan/50 hover:shadow-xl hover:shadow-celestial-cyan/5 space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="cyan" className="font-mono text-[10px] uppercase">
                  {ds.discipline.replace(/_/g, " ")}
                </Badge>
                <span className="font-mono text-[10px] text-celestial-amber uppercase font-bold">
                  [{ds.wavelengthBand}]
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-celestial-starlight group-hover:text-celestial-cyan transition">
                  {ds.title}
                </h3>
                <div className="flex items-center gap-2 text-xs font-mono text-celestial-cyan mt-1">
                  <span>{ds.organizationName}</span>
                  {ds.missionName && <span>• {ds.missionName}</span>}
                </div>
              </div>

              <p className="text-xs text-celestial-subtle line-clamp-3 leading-relaxed">
                {ds.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {ds.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-celestial-muted/30 text-[10px] font-mono text-celestial-subtle"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-celestial-muted/40 flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{ds.epistemicStatus}</span>
              </div>

              <Link
                href={`/datasets/${ds.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-celestial-muted/80 bg-celestial-surface/60 hover:bg-celestial-surface text-xs font-mono text-celestial-cyan hover:underline transition"
              >
                Inspect Dataset <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
