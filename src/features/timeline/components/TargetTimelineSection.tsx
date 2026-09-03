"use client";

import React from "react";
import Link from "next/link";
import { timelineService } from "@/domain/timeline/timeline-service";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight } from "lucide-react";

export interface TargetTimelineSectionProps {
  targetId: string;
  targetName: string;
}

export function TargetTimelineSection({
  targetId,
  targetName: _targetName,
}: TargetTimelineSectionProps) {
  const events = timelineService.getTargetTimeline(targetId);

  if (events.length === 0) return null;

  return (
    <div className="p-6 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/50 backdrop-blur-xl shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-celestial-muted/60 pb-3">
        <div className="flex items-center gap-2 text-celestial-cyan">
          <Clock className="w-5 h-5 text-celestial-cyan" />
          <h2 className="text-lg font-bold font-mono tracking-tight text-celestial-starlight uppercase">
            Historical State & Milestone Chronology ({events.length})
          </h2>
        </div>
        <Link
          href={`/timeline?target=${targetId}`}
          className="text-xs font-mono text-celestial-cyan hover:underline inline-flex items-center gap-1"
        >
          <span>Open in Universal Timeline</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="p-4 rounded-xl bg-celestial-void/60 border border-celestial-muted/60 space-y-2 font-mono text-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-celestial-cyan font-bold">{ev.startTime.slice(0, 10)}</span>
                <span className="font-bold text-celestial-starlight">{ev.title}</span>
              </div>
              <Badge variant="outline" className="text-[9px] uppercase">
                {ev.epistemicStatus}
              </Badge>
            </div>
            <p className="text-celestial-subtle text-[11px] leading-relaxed">{ev.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
