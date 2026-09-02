import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Rocket, Cpu, Radio, ArrowLeft, ShieldCheck, ExternalLink, Zap, Gauge } from "lucide-react";
import { missionRepo } from "@/lib/data/mission-repository";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SpacecraftProfilePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const spacecraft = missionRepo.getAllSpacecraft();
  return spacecraft.map((sc) => ({ slug: sc.slug }));
}

export default async function SpacecraftProfilePage({ params }: SpacecraftProfilePageProps) {
  const { slug } = await params;
  const sc = missionRepo.getSpacecraftBySlug(slug);

  if (!sc) {
    notFound();
  }

  const parentMission = missionRepo.getById(sc.missionId);
  const instruments = missionRepo
    .getAllInstruments()
    .filter((inst) => sc.instrumentIds.includes(inst.id));

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-6xl animate-fade-in">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link href={parentMission ? `/missions/${parentMission.slug}` : "/missions"}>
          <Button
            variant="ghost"
            size="sm"
            className="font-mono text-xs text-celestial-subtle hover:text-celestial-starlight gap-1.5 pl-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>
              {parentMission ? `BACK TO ${parentMission.name.toUpperCase()}` : "BACK TO MISSIONS"}
            </span>
          </Button>
        </Link>

        <Badge
          variant={sc.status === "ACTIVE" ? "emerald" : "outline"}
          className="text-xs font-mono uppercase"
        >
          {sc.status}
        </Badge>
      </div>

      {/* Spacecraft Header */}
      <div className="relative rounded-2xl overflow-hidden border border-celestial-muted/80 bg-gradient-to-b from-celestial-surface/80 to-celestial-void p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="flex items-center gap-2 text-celestial-cyan">
          <Rocket className="w-5 h-5" />
          <span className="font-mono text-xs uppercase tracking-wider font-semibold">
            {sc.type.replace(/_/g, " ")} • MISSION:{" "}
            {parentMission?.name || "Deep Space Exploration"}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-celestial-starlight tracking-tight">
          {sc.name}
        </h1>

        <p className="text-sm sm:text-base text-celestial-subtle leading-relaxed max-w-4xl">
          {sc.summary}
        </p>
      </div>

      {/* Live State and Flight Telemetry */}
      {sc.currentState && (
        <div className="rounded-2xl border border-celestial-cyan/40 bg-celestial-surface/60 p-6 backdrop-blur-xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-celestial-cyan font-bold font-mono text-sm">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>CURRENT FLIGHT TELEMETRY</span>
            </div>
            {sc.currentState.lastContactDate && (
              <span className="text-xs font-mono text-celestial-subtle">
                Last Contact: {sc.currentState.lastContactDate}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="bg-celestial-void/60 border border-celestial-muted/60 rounded-xl p-3">
              <div className="text-[11px] font-mono text-celestial-subtle">Distance from Sun</div>
              <div className="text-lg font-bold font-mono text-celestial-starlight mt-1">
                {sc.currentState.heliocentricDistanceAu !== undefined
                  ? `${sc.currentState.heliocentricDistanceAu.toFixed(2)} AU`
                  : "N/A"}
              </div>
            </div>

            <div className="bg-celestial-void/60 border border-celestial-muted/60 rounded-xl p-3">
              <div className="text-[11px] font-mono text-celestial-subtle">Speed</div>
              <div className="text-lg font-bold font-mono text-celestial-emerald mt-1">
                {sc.currentState.speedKmS
                  ? `${sc.currentState.speedKmS.toFixed(1)} km/s`
                  : "Orbital"}
              </div>
            </div>

            <div className="bg-celestial-void/60 border border-celestial-muted/60 rounded-xl p-3">
              <div className="text-[11px] font-mono text-celestial-subtle">
                Light Delay (One-Way)
              </div>
              <div className="text-lg font-bold font-mono text-celestial-amber mt-1">
                {sc.currentState.communicationDelayMinutes
                  ? `${sc.currentState.communicationDelayMinutes.toFixed(1)} min`
                  : "Real-time"}
              </div>
            </div>

            <div className="bg-celestial-void/60 border border-celestial-muted/60 rounded-xl p-3">
              <div className="text-[11px] font-mono text-celestial-subtle">
                Constellation / Realm
              </div>
              <div className="text-lg font-bold font-mono text-celestial-purple mt-1">
                {sc.currentState.isInterstellar
                  ? "Interstellar"
                  : sc.currentState.apparentConstellation || "Solar System"}
              </div>
            </div>
          </div>

          {sc.currentState.notes && (
            <p className="text-xs text-celestial-subtle pt-2 border-t border-celestial-muted/40 font-mono">
              {sc.currentState.notes}
            </p>
          )}
        </div>
      )}

      {/* Spacecraft Engineering Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-celestial-muted/80 bg-celestial-surface/50 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 font-bold text-celestial-starlight">
            <Gauge className="w-4 h-4 text-celestial-cyan" />
            <h3>Physical & Mass Specifications</h3>
          </div>

          <div className="space-y-2 text-xs font-mono text-celestial-subtle">
            <div className="flex justify-between py-1.5 border-b border-celestial-muted/40">
              <span>Launch Mass:</span>
              <span className="text-celestial-starlight font-bold">
                {sc.massKg ? `${sc.massKg.toLocaleString()} kg` : "N/A"}
              </span>
            </div>
            {sc.dryMassKg && (
              <div className="flex justify-between py-1.5 border-b border-celestial-muted/40">
                <span>Dry Mass:</span>
                <span className="text-celestial-starlight font-bold">
                  {sc.dryMassKg.toLocaleString()} kg
                </span>
              </div>
            )}
            {sc.powerWatts && (
              <div className="flex justify-between py-1.5 border-b border-celestial-muted/40">
                <span>Electrical Power Output:</span>
                <span className="text-celestial-starlight font-bold">
                  {sc.powerWatts} Watts ({sc.powerSource?.replace(/_/g, " ")})
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-celestial-muted/80 bg-celestial-surface/50 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 font-bold text-celestial-starlight">
            <Zap className="w-4 h-4 text-celestial-amber" />
            <h3>Propulsion & Telemetry Subsystems</h3>
          </div>

          <div className="space-y-3 text-xs text-celestial-subtle">
            {sc.propulsionSystem && (
              <div>
                <span className="font-mono text-celestial-cyan block mb-0.5">
                  Propulsion System:
                </span>
                <p>{sc.propulsionSystem}</p>
              </div>
            )}
            {sc.communicationSystem && (
              <div>
                <span className="font-mono text-celestial-cyan block mb-0.5">
                  Communications High-Gain Suite:
                </span>
                <p>{sc.communicationSystem}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scientific Instruments on this Craft */}
      {instruments.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-celestial-cyan" />
            <h2 className="text-xl font-bold text-celestial-starlight">
              Mounted Scientific Payload ({instruments.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {instruments.map((inst) => (
              <div
                key={inst.id}
                className="rounded-xl border border-celestial-muted/80 bg-celestial-surface/50 p-4 backdrop-blur-md space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-celestial-cyan">
                    {inst.acronym || inst.name}
                  </span>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {inst.type.replace(/_/g, " ")}
                  </Badge>
                </div>
                <h4 className="text-sm font-bold text-celestial-starlight">{inst.name}</h4>
                <p className="text-xs text-celestial-subtle leading-relaxed">
                  {inst.scientificPurpose}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Provenance */}
      <div className="rounded-2xl border border-celestial-muted/80 bg-celestial-surface/40 p-5 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-celestial-emerald shrink-0" />
          <div className="text-xs font-mono text-celestial-subtle">
            Verified Catalog: {sc.provenance.catalogName} ({sc.provenance.authoritativeBody})
          </div>
        </div>
        {sc.provenance.citationUrl && (
          <a
            href={sc.provenance.citationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-celestial-cyan hover:underline flex items-center gap-1"
          >
            <span>Spacecraft Specifications</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
