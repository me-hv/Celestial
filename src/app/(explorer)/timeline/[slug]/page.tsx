import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Sparkles, Layers } from "lucide-react";
import { timelineRepo } from "@/domain/timeline/timeline-repository";
import { Badge } from "@/components/ui/badge";

export interface TimelineEventPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const events = timelineRepo.getAll();
  return events.map((e) => ({ slug: e.slug }));
}

export default async function TimelineEventPage({ params }: TimelineEventPageProps) {
  const { slug } = await params;
  const event = timelineRepo.getBySlug(slug);

  if (!event) {
    notFound();
  }

  const relations = timelineRepo.getRelationsForEvent(event.id);

  return (
    <div className="w-full min-h-screen bg-celestial-void text-celestial-starlight p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Back Navigation */}
      <div>
        <Link
          href="/timeline"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-celestial-subtle hover:text-celestial-cyan transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Universal Timeline
        </Link>
      </div>

      {/* Event Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-celestial-cyan/40 bg-celestial-surface/70 backdrop-blur-xl shadow-xl space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="cyan" className="font-mono text-xs uppercase">
              {event.domain.replace(/_/g, " ")}
            </Badge>
            <Badge variant="outline" className="font-mono text-xs uppercase">
              {event.eventType.replace(/_/g, " ")}
            </Badge>
            <Badge
              variant="outline"
              className="font-mono text-xs text-emerald-400 border-emerald-500/40"
            >
              {event.epistemicStatus}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-celestial-starlight">
            {event.title}
          </h1>
          <p className="text-sm sm:text-base text-celestial-subtle leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Temporal Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-celestial-muted/60 text-xs font-mono">
          <div className="p-3 rounded-xl bg-celestial-void/60 border border-celestial-muted/60 space-y-1">
            <span className="text-[10px] uppercase text-celestial-subtle">Start Timestamp</span>
            <p className="text-sm font-bold text-celestial-cyan">{event.startTime}</p>
          </div>
          <div className="p-3 rounded-xl bg-celestial-void/60 border border-celestial-muted/60 space-y-1">
            <span className="text-[10px] uppercase text-celestial-subtle">Time Precision</span>
            <p className="text-sm font-bold text-celestial-amber">{event.timePrecision}</p>
          </div>
          <div className="p-3 rounded-xl bg-celestial-void/60 border border-celestial-muted/60 space-y-1">
            <span className="text-[10px] uppercase text-celestial-subtle">Temporal Status</span>
            <p className="text-sm font-bold text-emerald-400">{event.temporalStatus}</p>
          </div>
          <div className="p-3 rounded-xl bg-celestial-void/60 border border-celestial-muted/60 space-y-1">
            <span className="text-[10px] uppercase text-celestial-subtle">Confidence</span>
            <p className="text-sm font-bold text-purple-400">
              {(event.confidenceScore * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Scientific Significance */}
      {event.scientificSignificance && (
        <div className="p-6 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/50 backdrop-blur-lg space-y-3">
          <h2 className="text-lg font-bold text-celestial-starlight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-celestial-cyan" />
            Scientific Significance & Physical Mechanism
          </h2>
          <p className="text-sm text-celestial-subtle leading-relaxed font-mono">
            {event.scientificSignificance}
          </p>
        </div>
      )}

      {/* Relational Graph Connections */}
      {relations.length > 0 && (
        <div className="p-6 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/50 backdrop-blur-lg space-y-4">
          <h2 className="text-lg font-bold text-celestial-starlight flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            Causal & Chronological Graph Relationships ({relations.length})
          </h2>
          <div className="space-y-3">
            {relations.map((rel) => (
              <div
                key={rel.id}
                className="p-4 rounded-xl bg-celestial-void/60 border border-celestial-muted/60 flex items-center justify-between font-mono text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {rel.relationType}
                    </Badge>
                    <span className="text-celestial-starlight font-bold">{rel.description}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] text-emerald-400">
                  {rel.epistemicStatus}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strict Provenance Card */}
      <div className="p-6 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/40 backdrop-blur-md space-y-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-celestial-cyan">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-bold">Authoritative Provenance & Calibration Record</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-celestial-subtle">
          <div>
            <span className="text-[10px] uppercase block">Authoritative Body</span>
            <span className="text-celestial-starlight font-bold">
              {event.provenance.authoritativeBody}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase block">Catalog Record</span>
            <span className="text-celestial-starlight">{event.provenance.catalogName}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase block">Citation URL</span>
            <a
              href={event.provenance.citationUrl}
              target="_blank"
              rel="noreferrer"
              className="text-celestial-cyan hover:underline"
            >
              {event.provenance.citationUrl}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
