import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Compass,
  MapPin,
  ArrowLeft,
  ExternalLink,
  Layers,
  Eye,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { observatoryRepo } from "@/lib/data/observatory-repository";
import { OBSERVATORIES_DATA } from "@/lib/data/observatory-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ObservatoryProfilePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return OBSERVATORIES_DATA.map((obs) => ({
    slug: obs.slug,
  }));
}

export default async function ObservatoryProfilePage({ params }: ObservatoryProfilePageProps) {
  const { slug } = await params;
  const obs = observatoryRepo.getBySlug(slug);

  if (!obs) {
    notFound();
  }

  const visibleTargets = observatoryRepo.getVisibleTargetsTonight(obs);

  return (
    <div className="w-full min-h-screen bg-celestial-void text-celestial-starlight p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Button size="sm" variant="outline" className="gap-1.5 font-mono text-xs">
          <Link href="/observatories">
            <ArrowLeft className="w-4 h-4" /> All Observatories
          </Link>
        </Button>
        <Badge variant="cyan" className="font-mono text-xs uppercase">
          {obs.type}
        </Badge>
      </div>

      {/* Hero Header */}
      <div className="p-6 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/60 backdrop-blur-xl space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-celestial-starlight">
                {obs.name}
              </h1>
              {obs.acronym && (
                <span className="font-mono text-sm text-celestial-cyan font-bold">
                  [{obs.acronym}]
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-celestial-subtle">
              <MapPin className="w-3.5 h-3.5 text-celestial-amber" />
              <span>
                {obs.locationName}, {obs.country}
              </span>
              <span>•</span>
              <span>{obs.coordinates.elevationMeters}m Elevation</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="gap-1.5 font-mono text-xs">
              <Link
                href={`/sky?lat=${obs.coordinates.latitudeDeg}&lon=${obs.coordinates.longitudeDeg}`}
              >
                <Eye className="w-4 h-4 text-celestial-cyan" />
                Live Sky From Here
              </Link>
            </Button>
            {obs.websiteUrl && (
              <Button
                size="sm"
                variant="default"
                className="gap-1.5 font-mono text-xs bg-celestial-cyan/20 border-celestial-cyan/50 text-celestial-cyan hover:bg-celestial-cyan/30"
              >
                <a href={obs.websiteUrl} target="_blank" rel="noreferrer">
                  Official Site <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </Button>
            )}
          </div>
        </div>

        <p className="text-sm text-celestial-subtle leading-relaxed">{obs.summary}</p>
      </div>

      {/* Telescopes & Active Instruments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Telescopes */}
        <div className="p-5 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/50 space-y-4">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-celestial-cyan">
            <Layers className="w-4 h-4" /> Primary Telescopes ({obs.primaryTelescopes.length})
          </div>

          <div className="space-y-3">
            {obs.primaryTelescopes.map((tel, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-celestial-void/60 border border-celestial-muted/50 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-celestial-starlight">
                    {tel.name}
                  </span>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {tel.apertureMeters}m Primary
                  </Badge>
                </div>
                <div className="text-[11px] font-mono text-celestial-subtle">
                  {tel.opticalDesign}
                </div>
                <div className="text-[10px] font-mono text-celestial-cyan">
                  {tel.wavelengthBand}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Discoveries */}
        <div className="p-5 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/50 space-y-4">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-celestial-emerald">
            <ShieldCheck className="w-4 h-4" /> Breakthrough Scientific Discoveries
          </div>

          <div className="space-y-2.5">
            {obs.keyDiscoveries.map((disc, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-celestial-void/60 border border-celestial-muted/50 flex items-start gap-2.5 text-xs text-celestial-starlight"
              >
                <CheckCircle2 className="w-4 h-4 text-celestial-emerald shrink-0 mt-0.5" />
                <span>{disc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What Can This Observatory Observe Tonight? */}
      <div className="p-5 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/50 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-celestial-amber">
            <Compass className="w-4 h-4" /> What Can This Observatory Observe Tonight?
          </div>
          <span className="font-mono text-xs text-celestial-subtle">
            {visibleTargets.length} Observable Targets
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {visibleTargets.slice(0, 8).map((t) => (
            <Link
              key={t.objectId}
              href={`/research?target=${t.objectSlug}`}
              className="p-3 rounded-xl bg-celestial-void/60 border border-celestial-muted/50 hover:border-celestial-cyan/50 transition group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-celestial-starlight group-hover:text-celestial-cyan transition truncate">
                  {t.canonicalName}
                </span>
                <Badge variant="outline" className="text-[9px] py-0 px-1 font-mono">
                  {t.type}
                </Badge>
              </div>
              <div className="text-[11px] font-mono text-celestial-subtle mt-1">
                Alt: {t.horizontal.apparentAltitudeDeg.toFixed(1)}° • Transit:{" "}
                {t.riseTransitSet.transitAltitudeDeg.toFixed(1)}°
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
