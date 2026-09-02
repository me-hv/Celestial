"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TargetIntelligenceReport, ResearchTargetReference } from "@/domain/research/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Compass,
  Rocket,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Eye,
  Layers,
  Box,
} from "lucide-react";
import { ScientificGraph2D } from "@/features/visualization/research/ScientificGraph2D";

interface TargetIntelligencePanelProps {
  report: TargetIntelligenceReport;
  onSelectTarget?: (target: ResearchTargetReference) => void;
}

export const TargetIntelligencePanel: React.FC<TargetIntelligencePanelProps> = ({
  report,
  onSelectTarget,
}) => {
  const { target, observationSummary, associatedMissions, scientificEvidence } = report;

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    properties: true,
    observation: true,
    missions: true,
    evidence: true,
    graph: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="space-y-6">
      {/* Target Hero Header */}
      <div className="p-6 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/60 backdrop-blur-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant={target.badgeColor || "cyan"} className="font-mono text-xs">
                {target.domain.replace(/_/g, " ")}
              </Badge>
              {target.standardDesignation && (
                <span className="font-mono text-xs text-celestial-subtle">
                  [{target.standardDesignation}]
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-celestial-starlight">
              {target.canonicalName}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-9 gap-1.5">
              <Link href={`/sky?target=${target.slug}`}>
                <Eye className="w-4 h-4 text-celestial-cyan" />
                Observe in Sky
              </Link>
            </Button>
            <Button
              size="sm"
              variant="default"
              className="h-9 gap-1.5 bg-celestial-cyan/20 border-celestial-cyan/50 text-celestial-cyan hover:bg-celestial-cyan/30"
            >
              <Link href={report.context3DRoute}>
                <Box className="w-4 h-4" />
                3D Context
              </Link>
            </Button>
          </div>
        </div>

        <p className="text-sm text-celestial-subtle leading-relaxed">{target.summary}</p>
      </div>

      {/* Observation Conditions & Windows */}
      {observationSummary && (
        <div className="rounded-2xl border border-celestial-muted/80 bg-celestial-surface/50 backdrop-blur-lg overflow-hidden">
          <button
            onClick={() => toggleSection("observation")}
            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition"
          >
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-celestial-cyan">
              <Compass className="w-4 h-4" />
              Observation Conditions & Windows
            </div>
            {openSections.observation ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {openSections.observation && (
            <div className="p-4 pt-0 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-celestial-void/60 border border-celestial-muted/50">
                  <div className="text-[10px] font-mono text-celestial-subtle uppercase">
                    Peak Altitude
                  </div>
                  <div className="text-lg font-bold font-mono text-celestial-starlight">
                    {observationSummary.transitAltitudeDeg
                      ? `${observationSummary.transitAltitudeDeg.toFixed(1)}°`
                      : "N/A"}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-celestial-void/60 border border-celestial-muted/50">
                  <div className="text-[10px] font-mono text-celestial-subtle uppercase">
                    Minimum Airmass
                  </div>
                  <div className="text-lg font-bold font-mono text-celestial-starlight">
                    {observationSummary.airmass ? observationSummary.airmass.toFixed(2) : "N/A"}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-celestial-void/60 border border-celestial-muted/50">
                  <div className="text-[10px] font-mono text-celestial-subtle uppercase">
                    Quality Heuristic
                  </div>
                  <div className="text-lg font-bold font-mono text-celestial-cyan">
                    {observationSummary.bestWindow ? observationSummary.bestWindow.quality : "POOR"}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-celestial-void/60 border border-celestial-muted/50">
                  <div className="text-[10px] font-mono text-celestial-subtle uppercase">
                    Observing Windows
                  </div>
                  <div className="text-lg font-bold font-mono text-celestial-amber">
                    {observationSummary.windows.length}
                  </div>
                </div>
              </div>

              {observationSummary.bestWindow && (
                <div className="p-3 rounded-xl bg-celestial-cyan/10 border border-celestial-cyan/30 text-xs font-mono space-y-1">
                  <div className="text-celestial-cyan font-bold">Recommended Window:</div>
                  <div className="text-celestial-subtle">
                    {new Date(observationSummary.bestWindow.start).toLocaleTimeString()} –{" "}
                    {new Date(observationSummary.bestWindow.end).toLocaleTimeString()} (
                    {observationSummary.bestWindow.durationMinutes} min)
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2D Scientific Relation Graph */}
      <div className="rounded-2xl border border-celestial-muted/80 bg-celestial-surface/50 backdrop-blur-lg overflow-hidden">
        <button
          onClick={() => toggleSection("graph")}
          className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition"
        >
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-celestial-starlight">
            <Layers className="w-4 h-4 text-celestial-cyan" />
            Connected Knowledge Graph ({report.relations.length} Relations)
          </div>
          {openSections.graph ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {openSections.graph && (
          <div className="p-4 pt-0">
            <ScientificGraph2D
              centerTarget={target}
              relations={report.relations}
              onSelectNode={(id) => {
                const found = report.relatedTargets.find((r) => r.id === id);
                if (found && onSelectTarget) onSelectTarget(found);
              }}
            />
          </div>
        )}
      </div>

      {/* Associated Space Missions */}
      {associatedMissions.length > 0 && (
        <div className="rounded-2xl border border-celestial-muted/80 bg-celestial-surface/50 backdrop-blur-lg overflow-hidden">
          <button
            onClick={() => toggleSection("missions")}
            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition"
          >
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-celestial-cyan">
              <Rocket className="w-4 h-4" />
              Exploring Space Missions ({associatedMissions.length})
            </div>
            {openSections.missions ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {openSections.missions && (
            <div className="p-4 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {associatedMissions.map((m) => (
                <Link
                  key={m.id}
                  href={`/missions/${m.slug}`}
                  className="p-3 rounded-xl bg-celestial-void/60 border border-celestial-muted/50 hover:border-celestial-cyan/50 transition group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-celestial-starlight group-hover:text-celestial-cyan transition">
                      {m.name}
                    </span>
                    <Badge variant="outline" className="text-[10px] py-0 px-1 font-mono">
                      {m.agency}
                    </Badge>
                  </div>
                  <div className="text-[11px] font-mono text-celestial-subtle mt-1">{m.role}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Scientific Evidence & Provenance */}
      <div className="rounded-2xl border border-celestial-muted/80 bg-celestial-surface/50 backdrop-blur-lg overflow-hidden">
        <button
          onClick={() => toggleSection("evidence")}
          className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition"
        >
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-celestial-emerald">
            <ShieldCheck className="w-4 h-4" />
            Scientific Evidence & Epistemic Records ({scientificEvidence.length})
          </div>
          {openSections.evidence ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {openSections.evidence && (
          <div className="p-4 pt-0 space-y-3">
            {scientificEvidence.map((ev) => (
              <div
                key={ev.id}
                className="p-3 rounded-xl bg-celestial-void/60 border border-celestial-muted/50 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-celestial-starlight">{ev.claim}</span>
                  <Badge variant="emerald" className="text-[10px] py-0 px-1.5 uppercase font-mono">
                    {ev.epistemicStatus}
                  </Badge>
                </div>
                <div className="text-[11px] font-mono text-celestial-subtle flex items-center justify-between">
                  <span>Source: {ev.source}</span>
                  {ev.url && (
                    <a
                      href={ev.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-celestial-cyan hover:underline flex items-center gap-1"
                    >
                      Citation <ExternalLink className="w-3 h-3 inline" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
