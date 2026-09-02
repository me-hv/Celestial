"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Rocket,
  Compass,
  Sparkles,
  Search,
  Activity,
  Radio,
  Telescope,
  Layers,
  ArrowRight,
  Building2,
} from "lucide-react";
import { missionRepo } from "@/lib/data/mission-repository";
import { MissionType, MissionStatus } from "@/domain/mission/types";
import { GeographicRegion } from "@/domain/organization/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MissionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL");
  const [selectedAgency, setSelectedAgency] = useState<string>("ALL");

  const stats = useMemo(() => missionRepo.getStatistics(), []);
  const discoveries = useMemo(() => missionRepo.getAllDiscoveries(), []);

  const filteredMissions = useMemo(() => {
    return missionRepo.getFiltered({
      type: selectedType !== "ALL" ? (selectedType as MissionType) : undefined,
      status: selectedStatus !== "ALL" ? (selectedStatus as MissionStatus) : undefined,
      region: selectedRegion !== "ALL" ? (selectedRegion as GeographicRegion) : undefined,
      agency: selectedAgency !== "ALL" ? selectedAgency : undefined,
      organizationSlug: selectedAgency !== "ALL" ? selectedAgency.toLowerCase() : undefined,
      search: searchQuery || undefined,
    });
  }, [selectedType, selectedStatus, selectedRegion, selectedAgency, searchQuery]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl animate-fade-in">
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-celestial-muted/80 bg-gradient-to-b from-celestial-surface/80 to-celestial-void p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-celestial-cyan">
              <Rocket className="w-5 h-5" />
              <span className="font-mono text-xs uppercase tracking-wider font-semibold">
                Phase 11.5 • Global Space Missions & Research Explorer
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-celestial-starlight tracking-tight">
              Space Missions & Discoveries
            </h1>
            <p className="text-sm sm:text-base text-celestial-subtle leading-relaxed">
              Explore humanity&apos;s journeys beyond Earth across all world space agencies,
              national institutes, and international consortia. Track lunar landings, Mars rovers,
              solar observatories, space telescopes, and astronomical discoveries.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/organizations">
              <Button
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary/15 gap-2 font-mono text-xs"
              >
                <Building2 className="w-4 h-4" />
                <span>ORGANIZATIONS REGISTRY</span>
              </Button>
            </Link>
            <Link href="/missions/discoveries">
              <Button
                variant="outline"
                className="border-celestial-purple/50 text-celestial-purple hover:bg-celestial-purple/15 gap-2 font-mono text-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>DISCOVERIES ARCHIVE ({discoveries.length})</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistical Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6 mt-6 border-t border-celestial-muted/60">
          <div className="bg-celestial-surface/60 border border-celestial-muted/60 rounded-xl p-3">
            <div className="text-[11px] font-mono text-celestial-subtle flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-celestial-cyan" /> Total Missions
            </div>
            <div className="text-xl font-bold font-mono text-celestial-starlight mt-1">
              {stats.totalMissions}
            </div>
          </div>

          <div className="bg-celestial-surface/60 border border-celestial-muted/60 rounded-xl p-3">
            <div className="text-[11px] font-mono text-celestial-subtle flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-celestial-emerald" /> Active Fleets
            </div>
            <div className="text-xl font-bold font-mono text-celestial-emerald mt-1">
              {stats.activeMissions}
            </div>
          </div>

          <div className="bg-celestial-surface/60 border border-celestial-muted/60 rounded-xl p-3">
            <div className="text-[11px] font-mono text-celestial-subtle flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-celestial-amber" /> Planetary & Lunar
            </div>
            <div className="text-xl font-bold font-mono text-celestial-amber mt-1">
              {stats.planetaryMissions}
            </div>
          </div>

          <div className="bg-celestial-surface/60 border border-celestial-muted/60 rounded-xl p-3">
            <div className="text-[11px] font-mono text-celestial-subtle flex items-center gap-1.5">
              <Telescope className="w-3.5 h-3.5 text-celestial-blue" /> Observatories
            </div>
            <div className="text-xl font-bold font-mono text-celestial-blue mt-1">
              {stats.spaceObservatories}
            </div>
          </div>

          <div className="bg-celestial-surface/60 border border-celestial-muted/60 rounded-xl p-3">
            <div className="text-[11px] font-mono text-celestial-subtle flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-celestial-purple" /> Interstellar
            </div>
            <div className="text-xl font-bold font-mono text-celestial-purple mt-1">
              {stats.interstellarMissions}
            </div>
          </div>

          <div className="bg-celestial-surface/60 border border-celestial-muted/60 rounded-xl p-3">
            <div className="text-[11px] font-mono text-celestial-subtle flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-celestial-pink" /> Discoveries
            </div>
            <div className="text-xl font-bold font-mono text-celestial-pink mt-1">
              {stats.totalDiscoveries}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-celestial-surface/40 p-4 rounded-xl border border-celestial-muted/80 backdrop-blur-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-celestial-subtle" />
          <Input
            type="text"
            placeholder="Search missions by name, country, destination, agency, or target..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-celestial-surface/80 border-celestial-muted/80 text-celestial-starlight text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Region Filter */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-celestial-surface border border-celestial-muted/80 text-celestial-starlight text-xs rounded-lg px-3 py-2 font-mono outline-none focus:border-celestial-cyan"
            aria-label="Filter by Region"
          >
            <option value="ALL">All Regions</option>
            <option value="SOUTH_ASIA">South Asia (India)</option>
            <option value="ASIA_PACIFIC">Asia-Pacific (Japan, China, Korea)</option>
            <option value="EUROPE">Europe (ESA, France, Germany, Russia)</option>
            <option value="NORTH_AMERICA">North America (USA, Canada)</option>
            <option value="MIDDLE_EAST">Middle East (UAE)</option>
          </select>

          {/* Agency Filter */}
          <select
            value={selectedAgency}
            onChange={(e) => setSelectedAgency(e.target.value)}
            className="bg-celestial-surface border border-celestial-muted/80 text-celestial-starlight text-xs rounded-lg px-3 py-2 font-mono outline-none focus:border-celestial-cyan"
            aria-label="Filter by Agency"
          >
            <option value="ALL">All Agencies / Orgs</option>
            <option value="ISRO">ISRO (India)</option>
            <option value="JAXA">JAXA (Japan)</option>
            <option value="CNSA">CNSA (China)</option>
            <option value="Soviet Space Program">Soviet Space Program</option>
            <option value="Roscosmos">Roscosmos (Russia)</option>
            <option value="KARI">KARI (South Korea)</option>
            <option value="UAE Space Agency">UAE Space Agency</option>
            <option value="ESA">ESA (Europe)</option>
            <option value="NASA">NASA (USA)</option>
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-celestial-surface border border-celestial-muted/80 text-celestial-starlight text-xs rounded-lg px-3 py-2 font-mono outline-none focus:border-celestial-cyan"
            aria-label="Filter by Mission Type"
          >
            <option value="ALL">All Mission Types</option>
            <option value="LUNAR_EXPLORATION">Lunar Exploration</option>
            <option value="MARS_EXPLORATION">Mars Exploration</option>
            <option value="SOLAR_PHYSICS">Solar Physics</option>
            <option value="ASTROPHYSICS">Astrophysics</option>
            <option value="COSMOLOGY">Cosmology</option>
            <option value="ASTROMETRY">Astrometry</option>
            <option value="SAMPLE_RETURN">Sample Return</option>
            <option value="SPACE_TELESCOPE">Space Telescope</option>
            <option value="INTERSTELLAR">Interstellar</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-celestial-surface border border-celestial-muted/80 text-celestial-starlight text-xs rounded-lg px-3 py-2 font-mono outline-none focus:border-celestial-cyan"
            aria-label="Filter by Mission Status"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="EXTENDED">Extended</option>
            <option value="DEVELOPING">Developing</option>
          </select>
        </div>
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMissions.map((mission) => {
          const missionDiscoveries = missionRepo.getDiscoveriesForMission(mission.id);
          const hasTrajectory = !!mission.trajectoryId;

          return (
            <div
              key={mission.id}
              className="group flex flex-col justify-between rounded-xl border border-celestial-muted/80 bg-celestial-surface/50 hover:bg-celestial-surface/80 hover:border-celestial-cyan/50 p-5 backdrop-blur-sm transition-all duration-200 shadow-lg hover:shadow-celestial-cyan/10"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] text-celestial-cyan border-celestial-cyan/30"
                    >
                      {mission.type}
                    </Badge>
                    {mission.country && (
                      <Badge variant="outline" className="text-[10px] font-mono bg-muted/40">
                        {mission.country}
                      </Badge>
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className={`font-mono text-[10px] uppercase ${
                      mission.status === "ACTIVE"
                        ? "text-celestial-emerald border-celestial-emerald/40 bg-celestial-emerald/10"
                        : mission.status === "EXTENDED"
                          ? "text-celestial-cyan border-celestial-cyan/40 bg-celestial-cyan/10"
                          : "text-celestial-subtle border-celestial-muted/80"
                    }`}
                  >
                    {mission.status}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-celestial-starlight group-hover:text-celestial-cyan transition-colors">
                    <Link href={`/missions/${mission.slug}`}>{mission.name}</Link>
                  </h3>
                  <div className="text-xs font-mono text-celestial-subtle mt-1 flex items-center justify-between">
                    <span>{mission.agency}</span>
                    <span>Launch: {new Date(mission.launchDate).getFullYear()}</span>
                  </div>
                </div>

                <p className="text-xs text-celestial-subtle line-clamp-3 leading-relaxed">
                  {mission.summary}
                </p>

                <div className="pt-2 border-t border-celestial-muted/40 space-y-1.5 text-[11px] font-mono">
                  <div className="flex items-center justify-between text-celestial-subtle">
                    <span>Target Destination:</span>
                    <span className="text-celestial-starlight font-semibold">
                      {mission.destination}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-celestial-subtle">
                    <span>Spacecraft Fleet:</span>
                    <span className="text-celestial-starlight">
                      {mission.spacecraftIds.length} Vehicle(s)
                    </span>
                  </div>
                  {mission.participatingOrganizations &&
                    mission.participatingOrganizations.length > 1 && (
                      <div className="flex items-center justify-between text-celestial-subtle">
                        <span>Collaborators:</span>
                        <span className="text-celestial-starlight">
                          {mission.participatingOrganizations.length} Partners
                        </span>
                      </div>
                    )}
                  {missionDiscoveries.length > 0 && (
                    <div className="flex items-center justify-between text-celestial-pink">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Discoveries:
                      </span>
                      <span className="font-bold">{missionDiscoveries.length}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-celestial-muted/40 flex items-center justify-between">
                <Link
                  href={`/missions/${mission.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-celestial-cyan hover:text-celestial-starlight transition-colors"
                >
                  <span>MISSION PROFILE</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
                {hasTrajectory && (
                  <Badge
                    variant="outline"
                    className="text-[10px] font-mono text-celestial-amber border-celestial-amber/30"
                  >
                    3D TRAJECTORY
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredMissions.length === 0 && (
        <div className="text-center py-16 border border-dashed border-celestial-muted/80 rounded-2xl space-y-3">
          <p className="text-sm font-mono text-celestial-subtle">
            No missions found matching your search and filter criteria.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedType("ALL");
              setSelectedStatus("ALL");
              setSelectedRegion("ALL");
              setSelectedAgency("ALL");
            }}
            className="text-xs font-mono border-celestial-cyan/40 text-celestial-cyan"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
