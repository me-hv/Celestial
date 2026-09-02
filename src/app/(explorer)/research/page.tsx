"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, Search, ListFilter, Plus, BookOpen } from "lucide-react";
import { TargetIntelligenceEngine } from "@/lib/astronomy/research/target-intelligence-engine";
import { observingListManager } from "@/lib/astronomy/research/observing-list-manager";
import { ObservingList } from "@/domain/research/types";
import { PRESET_OBSERVER_LOCATIONS } from "@/domain/observer/types";
import { TargetIntelligencePanel } from "@/features/research/components/TargetIntelligencePanel";
import { ObservingListCard } from "@/features/research/components/ObservingListCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SUGGESTED_TARGETS = [
  { slug: "m31-andromeda-galaxy", name: "Andromeda Galaxy (M31)", domain: "DEEP_SKY" },
  { slug: "mars", name: "Mars", domain: "SOLAR_SYSTEM" },
  { slug: "jupiter", name: "Jupiter", domain: "SOLAR_SYSTEM" },
  { slug: "m42-orion-nebula", name: "Orion Nebula (M42)", domain: "DEEP_SKY" },
  { slug: "sirius", name: "Sirius (Alpha CMa)", domain: "STELLAR" },
  { slug: "trappist-1", name: "TRAPPIST-1 System", domain: "EXOPLANET" },
  { slug: "james-webb-space-telescope", name: "James Webb Space Telescope", domain: "MISSION" },
  { slug: "w-m-keck-observatory", name: "W. M. Keck Observatory", domain: "OBSERVATORY" },
];

export default function ResearchPage() {
  const searchParams = useSearchParams();
  const initialTargetParam = searchParams.get("target") || "m31-andromeda-galaxy";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string>(initialTargetParam);
  const [lists, setLists] = useState<ObservingList[]>(() => observingListManager.getLists());
  const [newListName, setNewListName] = useState("");
  const [showAddList, setShowAddList] = useState(false);

  useEffect(() => {
    const target = searchParams.get("target");
    if (target) {
      setSelectedSlug(target);
    }
  }, [searchParams]);

  const targetReport = useMemo(() => {
    return TargetIntelligenceEngine.generateReport(selectedSlug, PRESET_OBSERVER_LOCATIONS[0]);
  }, [selectedSlug]);

  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return SUGGESTED_TARGETS;
    const q = searchQuery.toLowerCase();
    return SUGGESTED_TARGETS.filter(
      (t) => t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    observingListManager.createList(newListName.trim(), "Custom observing session");
    setLists(observingListManager.getLists());
    setNewListName("");
    setShowAddList(false);
  };

  const handleDeleteList = (id: string) => {
    const updated = observingListManager.deleteList(id);
    setLists(updated);
  };

  return (
    <div className="w-full min-h-screen bg-celestial-void text-celestial-starlight p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-celestial-muted/60 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="cyan" className="font-mono text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Scientific Intelligence
            </Badge>
            <span className="font-mono text-xs text-celestial-subtle">Phase 12</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Scientific Research Workspace
          </h1>
          <p className="text-xs sm:text-sm text-celestial-subtle">
            Unified multi-domain cross-referencing: Target ➔ Scientific Context ➔ Observation
            Windows ➔ Missions ➔ Evidence.
          </p>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Target Picker & Observing Lists */}
        <div className="lg:col-span-4 space-y-6">
          {/* Target Search Box */}
          <div className="p-4 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/50 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-celestial-cyan uppercase tracking-wider">
                Select Target
              </span>
              <Badge variant="outline" className="text-[10px] font-mono">
                {filteredSuggestions.length} Available
              </Badge>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-celestial-subtle absolute left-3 top-2.5" />
              <Input
                placeholder="Search target by name or slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs bg-celestial-void/60 border-celestial-muted/80"
              />
            </div>

            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
              {filteredSuggestions.map((item) => (
                <button
                  key={item.slug}
                  onClick={() => setSelectedSlug(item.slug)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-mono transition flex items-center justify-between ${
                    selectedSlug === item.slug
                      ? "bg-celestial-cyan/20 text-celestial-cyan border border-celestial-cyan/50"
                      : "bg-celestial-void/40 text-celestial-starlight hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <span className="truncate">{item.name}</span>
                  <Badge variant="outline" className="text-[9px] py-0 px-1 uppercase font-mono">
                    {item.domain.replace(/_/g, " ")}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Observing Lists */}
          <div className="p-4 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/50 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-celestial-starlight uppercase">
                <ListFilter className="w-4 h-4 text-celestial-amber" />
                Observing Lists
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1 font-mono"
                onClick={() => setShowAddList(!showAddList)}
              >
                <Plus className="w-3 h-3" /> New
              </Button>
            </div>

            {showAddList && (
              <form
                onSubmit={handleCreateList}
                className="space-y-2 p-3 rounded-xl bg-celestial-void/80 border border-celestial-cyan/40"
              >
                <Input
                  placeholder="Observing List Name..."
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="h-8 text-xs bg-transparent"
                  autoFocus
                />
                <div className="flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-6 text-[10px]"
                    onClick={() => setShowAddList(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" variant="cyan" className="h-6 text-[10px]">
                    Create
                  </Button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {lists.map((l) => (
                <ObservingListCard key={l.id} list={l} onDelete={handleDeleteList} />
              ))}
            </div>
          </div>
        </div>

        {/* Center & Right: Target Intelligence Panel */}
        <div className="lg:col-span-8 space-y-6">
          {targetReport ? (
            <TargetIntelligencePanel
              report={targetReport}
              onSelectTarget={(t) => setSelectedSlug(t.slug)}
            />
          ) : (
            <div className="p-12 text-center rounded-2xl border border-celestial-muted/80 bg-celestial-surface/30 space-y-3">
              <BookOpen className="w-8 h-8 text-celestial-subtle mx-auto" />
              <div className="font-mono text-sm text-celestial-starlight font-bold">
                Select a target to inspect scientific intelligence
              </div>
              <p className="text-xs text-celestial-subtle max-w-md mx-auto">
                Search or pick an astronomical target from the left panel to load observation
                conditions, connected space missions, and evidence records.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
