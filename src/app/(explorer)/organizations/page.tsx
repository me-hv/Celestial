"use client";

import React, { useState, useMemo } from "react";
import { organizationRepo } from "@/lib/data/organization-repository";
import { GeographicRegion, OrganizationType } from "@/domain/organization/types";
import { OrganizationCard } from "@/features/organization/components/OrganizationCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Search, Globe2 } from "lucide-react";

export default function OrganizationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<GeographicRegion | "ALL">("ALL");
  const [selectedType, setSelectedType] = useState<OrganizationType | "ALL">("ALL");

  const allOrganizations = useMemo(() => organizationRepo.getAll(), []);
  const stats = useMemo(() => organizationRepo.getStatistics(), []);

  const regions: { value: GeographicRegion | "ALL"; label: string }[] = [
    { value: "ALL", label: "All Regions" },
    { value: "SOUTH_ASIA", label: "South Asia (India)" },
    { value: "ASIA_PACIFIC", label: "Asia-Pacific (Japan, China, Korea, Aus)" },
    { value: "EUROPE", label: "Europe (ESA, CNES, DLR, UK, etc.)" },
    { value: "NORTH_AMERICA", label: "North America (NASA, CSA)" },
    { value: "MIDDLE_EAST", label: "Middle East (UAE, Israel)" },
    { value: "LATIN_AMERICA", label: "Latin America (Brazil, Arg)" },
    { value: "AFRICA", label: "Africa (SANSA, SARAO)" },
    { value: "INTERNATIONAL", label: "International Consortia" },
  ];

  const types: { value: OrganizationType | "ALL"; label: string }[] = [
    { value: "ALL", label: "All Types" },
    { value: "SPACE_AGENCY", label: "Space Agencies" },
    { value: "NATIONAL_RESEARCH_INSTITUTE", label: "Research Institutes" },
    { value: "UNIVERSITY", label: "Universities" },
    { value: "OBSERVATORY", label: "Observatories" },
    { value: "SCIENTIFIC_CONSORTIUM", label: "Scientific Consortia" },
    { value: "INTERNATIONAL_ORGANIZATION", label: "International Orgs" },
  ];

  const filteredOrganizations = useMemo(() => {
    let list = allOrganizations;

    if (selectedRegion !== "ALL") {
      list = list.filter((org) => org.region === selectedRegion);
    }

    if (selectedType !== "ALL") {
      list = list.filter((org) => org.organizationType === selectedType);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (org) =>
          org.officialName.toLowerCase().includes(q) ||
          org.shortName.toLowerCase().includes(q) ||
          (org.acronym && org.acronym.toLowerCase().includes(q)) ||
          org.country.toLowerCase().includes(q) ||
          org.primaryFocusAreas.some((f) => f.toLowerCase().includes(q))
      );
    }

    return list;
  }, [allOrganizations, selectedRegion, selectedType, searchQuery]);

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
            Phase 11.5
          </Badge>
          <span className="text-xs text-muted-foreground font-mono">
            Global Space Science Registry
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Global Space & Research Organizations
        </h1>
        <p className="text-muted-foreground max-w-3xl text-sm sm:text-base leading-relaxed">
          Comprehensive, neutral registry of space agencies, national research institutes,
          universities, astronomical observatories, and international scientific consortia driving
          humanity's exploration of space.
        </p>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-lg bg-card/60 border border-border/40 space-y-1">
          <div className="text-2xl font-bold font-mono text-primary">
            {stats.totalOrganizations}
          </div>
          <div className="text-xs text-muted-foreground font-medium uppercase">
            Organizations Registered
          </div>
        </div>
        <div className="p-4 rounded-lg bg-card/60 border border-border/40 space-y-1">
          <div className="text-2xl font-bold font-mono text-cyan-400">{stats.spaceAgencies}</div>
          <div className="text-xs text-muted-foreground font-medium uppercase">
            National Space Agencies
          </div>
        </div>
        <div className="p-4 rounded-lg bg-card/60 border border-border/40 space-y-1">
          <div className="text-2xl font-bold font-mono text-violet-400">
            {stats.countriesRepresented}
          </div>
          <div className="text-xs text-muted-foreground font-medium uppercase">
            Countries & Entities
          </div>
        </div>
        <div className="p-4 rounded-lg bg-card/60 border border-border/40 space-y-1">
          <div className="text-2xl font-bold font-mono text-amber-400">
            {stats.regionsRepresented}
          </div>
          <div className="text-xs text-muted-foreground font-medium uppercase">
            Geographic Regions
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="space-y-4 p-4 rounded-xl bg-card/40 border border-border/40 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search organizations by name, acronym, country, or focus area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background/50"
            />
          </div>
          {(searchQuery || selectedRegion !== "ALL" || selectedType !== "ALL") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedRegion("ALL");
                setSelectedType("ALL");
              }}
              className="text-xs"
            >
              Reset Filters
            </Button>
          )}
        </div>

        {/* Region Pills */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5" />
            Filter by Region:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {regions.map((reg) => (
              <Button
                key={reg.value}
                variant={selectedRegion === reg.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRegion(reg.value)}
                className="text-xs h-7 px-2.5"
              >
                {reg.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Type Pills */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            Filter by Organization Type:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {types.map((t) => (
              <Button
                key={t.value}
                variant={selectedType === t.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(t.value)}
                className="text-xs h-7 px-2.5"
              >
                {t.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing {filteredOrganizations.length} of {allOrganizations.length} organizations
          </span>
        </div>

        {filteredOrganizations.length === 0 ? (
          <div className="text-center py-16 border border-dashed rounded-xl space-y-2">
            <p className="text-muted-foreground text-sm">
              No organizations match your selected filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedRegion("ALL");
                setSelectedType("ALL");
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrganizations.map((org) => {
              const missionCount = organizationRepo.getMissionsForOrganization(org.slug).length;
              return (
                <OrganizationCard key={org.id} organization={org} missionCount={missionCount} />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
