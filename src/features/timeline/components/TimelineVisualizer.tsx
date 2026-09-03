"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TemporalEvent, TemporalDomain } from "@/domain/timeline/types";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Rocket, Sparkles, Sun, Database, Globe } from "lucide-react";

export interface TimelineVisualizerProps {
  events: TemporalEvent[];
  selectedDomain?: TemporalDomain;
}

const DOMAIN_ICONS: Record<TemporalDomain, React.ComponentType<{ className?: string }>> = {
  COSMOS: Globe,
  ASTRONOMY: Sparkles,
  SPACE_MISSIONS: Rocket,
  SCIENCE: Sparkles,
  SPACE_WEATHER: Sun,
  OBSERVATIONS: Clock,
  DATA: Database,
};

export function TimelineVisualizer({
  events,
  selectedDomain: _selectedDomain,
}: TimelineVisualizerProps) {
  const [activeEventId, setActiveEventId] = useState<string | null>(events[0]?.id || null);

  const activeEvent = events.find((e) => e.id === activeEventId) || events[0];

  return (
    <div className="space-y-6">
      {/* Horizontal Multi-Domain Stream Canvas */}
      <div className="p-6 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/50 backdrop-blur-xl shadow-lg space-y-4 overflow-hidden">
        <div className="flex items-center justify-between border-b border-celestial-muted/60 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-celestial-cyan animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-celestial-starlight">
              Chronological Synchronized Stream ({events.length} Events)
            </span>
          </div>
          <span className="font-mono text-[11px] text-celestial-subtle">
            Click event node to inspect evidence & state
          </span>
        </div>

        {/* Scrollable Event Stream */}
        <div className="relative overflow-x-auto py-6 custom-scrollbar">
          {/* Central Chronological Baseline */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-celestial-cyan/20 via-celestial-cyan/60 to-celestial-cyan/20 -translate-y-1/2" />

          <div className="flex items-center gap-6 min-w-max px-4">
            {events.map((ev, idx) => {
              const Icon = DOMAIN_ICONS[ev.domain] || Clock;
              const isSelected = ev.id === activeEventId;

              return (
                <div
                  key={ev.id}
                  onClick={() => setActiveEventId(ev.id)}
                  className={`relative flex flex-col items-center cursor-pointer group transition-all duration-200 ${
                    idx % 2 === 0 ? "-translate-y-4" : "translate-y-4"
                  }`}
                >
                  {/* Event Node Badge */}
                  <div
                    className={`px-3 py-2 rounded-xl border backdrop-blur-md shadow-md flex flex-col items-center gap-1 transition-all ${
                      isSelected
                        ? "bg-celestial-cyan/20 border-celestial-cyan ring-2 ring-celestial-cyan/40 scale-105"
                        : "bg-celestial-void/80 border-celestial-muted/70 hover:border-celestial-cyan/60"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-mono text-[10px]">
                      <Icon className="w-3 h-3 text-celestial-cyan" />
                      <span className="text-celestial-starlight font-bold truncate max-w-[140px]">
                        {ev.title}
                      </span>
                    </div>
                    <span className="font-mono text-[9px] text-celestial-subtle">
                      {ev.timePrecision === "COSMOLOGICAL"
                        ? ev.startTime
                        : ev.startTime.slice(0, 10)}
                    </span>
                  </div>

                  {/* Connecting Node Pin */}
                  <div
                    className={`w-3 h-3 rounded-full border-2 transition-all mt-2 ${
                      isSelected
                        ? "bg-celestial-cyan border-celestial-starlight scale-125"
                        : "bg-celestial-void border-celestial-muted group-hover:border-celestial-cyan"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Event Focus Card */}
      {activeEvent && (
        <div className="p-6 rounded-2xl border border-celestial-cyan/40 bg-celestial-surface/70 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-celestial-muted/60 pb-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="cyan" className="font-mono text-[10px] uppercase">
                  {activeEvent.domain.replace(/_/g, " ")}
                </Badge>
                <Badge variant="outline" className="font-mono text-[10px] uppercase">
                  {activeEvent.eventType.replace(/_/g, " ")}
                </Badge>
                <span className="font-mono text-xs text-celestial-subtle">
                  Precision: {activeEvent.timePrecision}
                </span>
              </div>
              <h2 className="text-xl font-bold text-celestial-starlight tracking-tight">
                {activeEvent.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="font-mono text-xs text-emerald-400 border-emerald-500/40"
              >
                {activeEvent.epistemicStatus}
              </Badge>
              <Link
                href={`/timeline/${activeEvent.slug}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-celestial-cyan/20 border border-celestial-cyan text-xs font-mono text-celestial-cyan font-bold hover:bg-celestial-cyan/30 transition"
              >
                <span>Full Event Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <p className="text-sm text-celestial-starlight/90 leading-relaxed">
            {activeEvent.description}
          </p>

          {activeEvent.scientificSignificance && (
            <div className="p-4 rounded-xl bg-celestial-void/60 border border-celestial-muted/60 space-y-1 text-xs font-mono">
              <span className="text-celestial-cyan font-bold uppercase block">
                Scientific Significance & Evidence
              </span>
              <p className="text-celestial-subtle leading-relaxed">
                {activeEvent.scientificSignificance}
              </p>
            </div>
          )}

          {/* Metadata Footer */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono text-celestial-subtle border-t border-celestial-muted/40">
            <div>
              <span className="text-[10px] uppercase block">Start Time</span>
              <span className="text-celestial-starlight font-bold">{activeEvent.startTime}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase block">Authoritative Body</span>
              <span className="text-celestial-starlight font-bold">
                {activeEvent.provenance.authoritativeBody}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase block">Confidence Score</span>
              <span className="text-emerald-400 font-bold">
                {(activeEvent.confidenceScore * 100).toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase block">Catalog Record</span>
              <span className="text-celestial-starlight truncate block">
                {activeEvent.provenance.recordIdentifier}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
