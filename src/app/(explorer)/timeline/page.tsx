"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Clock } from "lucide-react";
import { timelineRepo } from "@/domain/timeline/timeline-repository";
import { TemporalDomain, TemporalScale } from "@/domain/timeline/types";
import { TimelineControlsBar } from "@/features/timeline/components/TimelineControlsBar";
import { TimelineVisualizer } from "@/features/timeline/components/TimelineVisualizer";
import { TimelineListView } from "@/features/timeline/components/TimelineListView";
import { Badge } from "@/components/ui/badge";

export default function UniversalTimelinePage() {
  const searchParams = useSearchParams();
  const initialDomain = searchParams.get("domain") as TemporalDomain | null;
  const initialTarget = searchParams.get("target") || undefined;

  const [selectedDomain, setSelectedDomain] = useState<TemporalDomain | undefined>(
    initialDomain || undefined
  );
  const [selectedScale, setSelectedScale] = useState<TemporalScale>("YEARS");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"CANVAS" | "LIST">("CANVAS");

  const filteredEvents = useMemo(() => {
    return timelineRepo.query({
      domain: selectedDomain,
      targetId: initialTarget,
      searchQuery: searchQuery || undefined,
    });
  }, [selectedDomain, initialTarget, searchQuery]);

  return (
    <div className="w-full min-h-screen bg-celestial-void text-celestial-starlight p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-celestial-muted/60 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="cyan" className="font-mono text-xs uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 mr-1 text-celestial-cyan" /> Universal Scientific
              Chronology
            </Badge>
            <span className="font-mono text-xs text-celestial-subtle">Phase 15</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            CELESTIAL Scientific Timeline & Historical State
          </h1>
          <p className="text-xs sm:text-sm text-celestial-subtle">
            Unified temporal intelligence connecting cosmological epochs, human space missions,
            astrophysical discoveries, space-weather events, and observations.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-celestial-subtle">
          <span className="text-celestial-cyan font-bold">
            {filteredEvents.length} Events Indexed
          </span>
        </div>
      </div>

      {/* Controls Bar */}
      <TimelineControlsBar
        selectedDomain={selectedDomain}
        onDomainChange={setSelectedDomain}
        selectedScale={selectedScale}
        onScaleChange={setSelectedScale}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalEventsCount={timelineRepo.getAll().length}
      />

      {/* Main View: Canvas or List */}
      {viewMode === "CANVAS" ? (
        <TimelineVisualizer events={filteredEvents} selectedDomain={selectedDomain} />
      ) : (
        <TimelineListView events={filteredEvents} />
      )}
    </div>
  );
}
