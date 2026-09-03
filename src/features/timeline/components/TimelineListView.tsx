"use client";

import React from "react";
import Link from "next/link";
import { TemporalEvent } from "@/domain/timeline/types";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export interface TimelineListViewProps {
  events: TemporalEvent[];
}

export function TimelineListView({ events }: TimelineListViewProps) {
  if (events.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl border border-celestial-muted/80 bg-celestial-surface/50 text-celestial-subtle font-mono text-xs">
        No events match the selected criteria.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((ev) => (
        <div
          key={ev.id}
          className="p-5 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/50 backdrop-blur-md space-y-3 hover:border-celestial-cyan/60 transition"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-celestial-muted/40 pb-2">
            <div className="flex items-center gap-2 font-mono text-xs">
              <Badge variant="cyan" className="text-[10px] uppercase">
                {ev.domain.replace(/_/g, " ")}
              </Badge>
              <Badge variant="outline" className="text-[10px] uppercase">
                {ev.eventType.replace(/_/g, " ")}
              </Badge>
              <span className="text-celestial-cyan font-bold">{ev.startTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="font-mono text-[10px] text-emerald-400 border-emerald-500/40"
              >
                {ev.epistemicStatus}
              </Badge>
              <Link
                href={`/timeline/${ev.slug}`}
                className="text-xs font-mono text-celestial-cyan hover:underline inline-flex items-center gap-1"
              >
                <span>Inspect</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-celestial-starlight">{ev.title}</h3>
            <p className="text-xs text-celestial-subtle leading-relaxed">{ev.description}</p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-celestial-muted/40 text-[11px] font-mono text-celestial-subtle">
            <span>
              Provider: {ev.provenance.authoritativeBody} ({ev.provenance.catalogName})
            </span>
            <span>Precision: {ev.timePrecision}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
