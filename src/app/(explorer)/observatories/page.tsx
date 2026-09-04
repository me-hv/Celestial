"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Compass, Search, ArrowRight, MapPin } from "lucide-react";
import { observatoryRepo } from "@/lib/data/observatory-repository";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ObservatoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");

  const observatories = useMemo(() => observatoryRepo.getAll(), []);

  const filtered = useMemo(() => {
    return observatories.filter((obs) => {
      if (selectedType !== "ALL" && obs.type !== selectedType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          obs.name.toLowerCase().includes(q) ||
          obs.country.toLowerCase().includes(q) ||
          obs.locationName.toLowerCase().includes(q) ||
          (obs.acronym && obs.acronym.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [observatories, selectedType, searchQuery]);

  return (
    <div className="w-full min-h-screen bg-celestial-void text-celestial-starlight p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-celestial-muted/60 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="cyan" className="font-mono text-xs uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 mr-1" /> Ground & Space Facilities
            </Badge>
            <span className="font-mono text-xs text-celestial-subtle">Observatory Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Astronomical Observatories Directory
          </h1>
          <p className="text-xs sm:text-sm text-celestial-subtle">
            Explore premier optical, infrared, millimeter, and VLBI observatories around the globe
            and in orbit.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-celestial-surface/50 p-4 rounded-2xl border border-celestial-muted/80 backdrop-blur-md">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-celestial-subtle absolute left-3 top-2.5" />
          <Input
            placeholder="Search by name, country, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-celestial-void/60 border-celestial-muted/80"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {["ALL", "OPTICAL", "MILLIMETER", "RADIO"].map((type) => (
            <Button
              key={type}
              size="sm"
              variant={selectedType === type ? "cyan" : "outline"}
              className="h-8 text-xs font-mono uppercase"
              onClick={() => setSelectedType(type)}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {/* Observatories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((obs) => (
          <div
            key={obs.id}
            className="group relative flex flex-col justify-between rounded-2xl border border-celestial-muted/80 bg-celestial-surface/50 hover:bg-celestial-surface/80 p-5 backdrop-blur-lg transition-all duration-300 hover:border-celestial-cyan/50 hover:shadow-xl hover:shadow-celestial-cyan/5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="cyan" className="font-mono text-[10px] uppercase">
                  {obs.type}
                </Badge>
                {obs.acronym && (
                  <span className="font-mono text-xs text-celestial-cyan font-bold">
                    [{obs.acronym}]
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold text-celestial-starlight group-hover:text-celestial-cyan transition">
                  {obs.name}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-celestial-subtle font-mono mt-1">
                  <MapPin className="w-3.5 h-3.5 text-celestial-amber" />
                  <span>
                    {obs.locationName}, {obs.country}
                  </span>
                </div>
              </div>

              <p className="text-xs text-celestial-subtle line-clamp-3 leading-relaxed">
                {obs.summary}
              </p>

              {/* Primary Telescope Info */}
              {obs.primaryTelescopes.length > 0 && (
                <div className="p-2.5 rounded-xl bg-celestial-void/60 border border-celestial-muted/40 text-[11px] font-mono space-y-0.5">
                  <div className="text-celestial-starlight font-bold">
                    {obs.primaryTelescopes[0].name} ({obs.primaryTelescopes[0].apertureMeters}m)
                  </div>
                  <div className="text-celestial-subtle truncate">
                    {obs.primaryTelescopes[0].opticalDesign}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-celestial-muted/40">
              <Link href={`/observatories/${obs.slug}`} className="w-full">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full gap-1.5 font-mono text-xs justify-between group-hover:border-celestial-cyan/50"
                >
                  <span>Inspect Facility</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
