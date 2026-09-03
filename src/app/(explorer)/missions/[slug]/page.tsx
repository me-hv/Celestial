import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Rocket,
  Compass,
  Calendar,
  Cpu,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  ExternalLink,
  Target,
  Clock,
  Building2,
  Database,
  Globe,
} from "lucide-react";
import { missionRepo } from "@/lib/data/mission-repository";
import { missionTelemetryService } from "@/domain/mission/mission-telemetry-service";
import { TargetTimelineSection } from "@/features/timeline/components/TargetTimelineSection";
import { datasetRepo } from "@/lib/data/dataset-repository";
import { MissionTrajectoryScene } from "@/features/visualization/mission/MissionTrajectoryScene";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Radio } from "lucide-react";

interface MissionProfilePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const missions = missionRepo.getAll();
  return missions.map((m) => ({ slug: m.slug }));
}

export default async function MissionProfilePage({ params }: MissionProfilePageProps) {
  const { slug } = await params;
  const mission = missionRepo.getBySlug(slug);
  const telemetry = mission
    ? missionTelemetryService.getTelemetryForMission(mission.slug) || mission.telemetry
    : undefined;

  if (!mission) {
    notFound();
  }

  const spacecraft = missionRepo.getSpacecraftForMission(mission.id);
  const instruments = missionRepo.getInstrumentsForMission(mission.id);
  const discoveries = missionRepo.getDiscoveriesForMission(mission.id);
  const events = missionRepo.getEventsForMission(mission.id);
  const trajectory = missionRepo.getTrajectoryForMission(mission.id);
  const datasets = datasetRepo.getByMission(mission.slug);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl animate-fade-in">
      {/* Breadcrumb & Top Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/missions">
          <Button
            variant="ghost"
            size="sm"
            className="font-mono text-xs text-celestial-subtle hover:text-celestial-starlight gap-1.5 pl-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO ALL MISSIONS</span>
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          {mission.country && (
            <Badge variant="outline" className="text-xs font-mono uppercase bg-muted/40">
              {mission.country}
            </Badge>
          )}
          {mission.leadOrganizationSlug ? (
            <Link href={`/organizations/${mission.leadOrganizationSlug}`}>
              <Badge variant="cyan" className="text-xs font-mono uppercase hover:underline">
                {mission.agency}
              </Badge>
            </Link>
          ) : (
            <Badge variant="cyan" className="text-xs font-mono uppercase">
              {mission.agency}
            </Badge>
          )}
          <Badge
            variant={mission.status === "ACTIVE" ? "emerald" : "outline"}
            className="text-xs font-mono uppercase"
          >
            {mission.status}
          </Badge>
        </div>
      </div>

      {/* Mission Hero Card */}
      <div className="relative rounded-2xl overflow-hidden border border-celestial-muted/80 bg-gradient-to-b from-celestial-surface/80 to-celestial-void p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="space-y-4 max-w-4xl">
          <div className="flex items-center gap-2 text-celestial-cyan">
            <Rocket className="w-5 h-5" />
            <span className="font-mono text-xs uppercase tracking-wider font-semibold">
              {mission.type.replace(/_/g, " ")} • DESTINATION: {mission.destination}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-celestial-starlight tracking-tight">
            {mission.name}
          </h1>

          <p className="text-sm sm:text-base text-celestial-subtle leading-relaxed">
            {mission.objective}
          </p>

          {/* Metadata Chips */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono">
            <div className="bg-celestial-surface/80 border border-celestial-muted/80 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-celestial-cyan" />
              <span className="text-celestial-subtle">Launch:</span>
              <span className="text-celestial-starlight font-bold">
                {new Date(mission.launchDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            {mission.launchVehicle && (
              <div className="bg-celestial-surface/80 border border-celestial-muted/80 px-3 py-1.5 rounded-lg flex items-center gap-2">
                <Rocket className="w-3.5 h-3.5 text-celestial-amber" />
                <span className="text-celestial-subtle">Launch Vehicle:</span>
                <span className="text-celestial-starlight font-bold">{mission.launchVehicle}</span>
              </div>
            )}

            <div className="bg-celestial-surface/80 border border-celestial-muted/80 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-celestial-purple" />
              <span className="text-celestial-subtle">Target:</span>
              {mission.primaryTargetId ? (
                <Link
                  href={`/solar/${mission.primaryTargetId}`}
                  className="text-celestial-cyan hover:underline font-bold"
                >
                  {mission.destination}
                </Link>
              ) : (
                <span className="text-celestial-starlight font-bold">{mission.destination}</span>
              )}
            </div>

            <div className="bg-celestial-surface/80 border border-celestial-muted/80 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-celestial-emerald" />
              <span className="text-celestial-subtle">Payloads:</span>
              <span className="text-celestial-starlight font-bold">
                {instruments.length} Scientific Instruments
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Mission Telemetry & Deep Space Status */}
      {telemetry && (
        <div className="rounded-2xl border border-celestial-cyan/40 bg-celestial-surface/70 p-6 backdrop-blur-xl shadow-lg space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-celestial-muted/60 pb-3">
            <div className="flex items-center gap-2 text-celestial-cyan">
              <Radio className="w-5 h-5 animate-pulse text-celestial-cyan" />
              <h2 className="text-lg font-bold font-mono tracking-tight text-celestial-starlight uppercase">
                Live Mission Telemetry & Deep Space Network Link
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {telemetry.telemetryState && (
                <Badge
                  variant={telemetry.telemetryState === "MODEL_DERIVED" ? "amber" : "cyan"}
                  className="font-mono text-xs uppercase"
                >
                  {telemetry.telemetryState}
                </Badge>
              )}
              <Badge variant="cyan" className="font-mono text-xs uppercase">
                {telemetry.currentStatus.replace(/_/g, " ")}
              </Badge>
              <Badge
                variant="outline"
                className="font-mono text-[10px] text-emerald-400 border-emerald-500/40"
              >
                {telemetry.telemetryEpistemicStatus}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {telemetry.distanceFromEarthKm !== undefined && (
              <div className="p-3 rounded-xl bg-celestial-void/60 border border-celestial-muted/60 space-y-1">
                <span className="text-[10px] font-mono uppercase text-celestial-subtle">
                  Earth Distance
                </span>
                <p className="text-base sm:text-lg font-bold font-mono text-celestial-cyan">
                  {(telemetry.distanceFromEarthKm / 1e6).toFixed(2)}M km
                </p>
              </div>
            )}
            {telemetry.distanceFromSunAu !== undefined && (
              <div className="p-3 rounded-xl bg-celestial-void/60 border border-celestial-muted/60 space-y-1">
                <span className="text-[10px] font-mono uppercase text-celestial-subtle">
                  Sun Distance
                </span>
                <p className="text-base sm:text-lg font-bold font-mono text-celestial-amber">
                  {telemetry.distanceFromSunAu.toFixed(2)} AU
                </p>
              </div>
            )}
            {telemetry.velocityKmS !== undefined && (
              <div className="p-3 rounded-xl bg-celestial-void/60 border border-celestial-muted/60 space-y-1">
                <span className="text-[10px] font-mono uppercase text-celestial-subtle">
                  Heliocentric Velocity
                </span>
                <p className="text-base sm:text-lg font-bold font-mono text-emerald-400">
                  {telemetry.velocityKmS.toFixed(1)} km/s
                </p>
              </div>
            )}
            {telemetry.lightTimeMinutes !== undefined && (
              <div className="p-3 rounded-xl bg-celestial-void/60 border border-celestial-muted/60 space-y-1">
                <span className="text-[10px] font-mono uppercase text-celestial-subtle">
                  1-Way Light Time
                </span>
                <p className="text-base sm:text-lg font-bold font-mono text-purple-400">
                  {telemetry.lightTimeMinutes.toFixed(1)} mins
                </p>
              </div>
            )}
          </div>

          <div className="text-xs font-mono text-celestial-subtle flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-celestial-muted/40">
            <span>Phase: {telemetry.missionPhase}</span>
            {telemetry.sourceStation && <span>Ground Station: {telemetry.sourceStation}</span>}
            {telemetry.currentTrajectoryState && (
              <span>Trajectory: {telemetry.currentTrajectoryState}</span>
            )}
          </div>
        </div>
      )}

      {/* Historical State & Timeline Milestones */}
      <TargetTimelineSection targetId={mission.slug} targetName={mission.name} />

      {/* Authenticated Scientific Datasets */}
      {datasets && datasets.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-celestial-cyan" />
              <h2 className="text-xl font-bold text-celestial-starlight">
                Mission Scientific Datasets ({datasets.length})
              </h2>
            </div>
            <Link
              href="/datasets"
              className="text-xs font-mono text-celestial-cyan hover:underline"
            >
              Browse Global Archive →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {datasets.map((ds) => (
              <div
                key={ds.id}
                className="rounded-xl border border-celestial-muted/80 bg-celestial-surface/50 p-4 backdrop-blur-md space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="cyan" className="font-mono text-[10px] uppercase">
                    {ds.discipline.replace(/_/g, " ")}
                  </Badge>
                  <span className="font-mono text-[10px] text-celestial-amber font-bold">
                    [{ds.wavelengthBand}]
                  </span>
                </div>
                <h3 className="font-bold text-sm text-celestial-starlight">
                  <Link href={`/datasets/${ds.slug}`} className="hover:underline">
                    {ds.title}
                  </Link>
                </h3>
                <p className="text-xs text-celestial-subtle line-clamp-2 leading-relaxed">
                  {ds.description}
                </p>
                <div className="pt-2 border-t border-celestial-muted/40 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{ds.epistemicStatus}</span>
                  </div>
                  <Link
                    href={`/datasets/${ds.slug}`}
                    className="text-xs font-mono text-celestial-cyan hover:underline"
                  >
                    Inspect Dataset →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mission Organizations & Collaboration Matrix */}
      {mission.participatingOrganizations && mission.participatingOrganizations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-celestial-starlight">
              Mission Organizations & Collaboration Matrix (
              {mission.participatingOrganizations.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mission.participatingOrganizations.map((part, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border/40 bg-card/50 p-4 backdrop-blur-md space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/organizations/${part.organizationSlug}`}
                    className="font-bold text-foreground hover:text-primary transition-colors text-sm"
                  >
                    {part.organizationName}
                  </Link>
                  <Badge variant="outline" className="text-[10px] uppercase font-mono shrink-0">
                    {part.role.replace(/_/g, " ")}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-primary/70" />
                  <span>{part.organizationCountry}</span>
                </div>
                {part.contributionDescription && (
                  <p className="text-xs text-muted-foreground/90 pt-1 leading-relaxed border-t border-border/30">
                    {part.contributionDescription}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3D Mission Trajectory Visualization */}
      {trajectory && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-celestial-cyan" />
              <h2 className="text-xl font-bold text-celestial-starlight">
                Interactive 3D Flight Trajectory
              </h2>
            </div>
            <Badge
              variant="outline"
              className="text-xs font-mono uppercase text-celestial-amber border-celestial-amber/30"
            >
              {trajectory.accuracy}
            </Badge>
          </div>

          <div className="h-[450px] sm:h-[550px] w-full rounded-2xl overflow-hidden border border-celestial-muted/80 relative shadow-2xl bg-celestial-void">
            <MissionTrajectoryScene trajectory={trajectory} mission={mission} />
          </div>
        </div>
      )}

      {/* Spacecraft Fleet Section */}
      {spacecraft.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-celestial-amber" />
            <h2 className="text-xl font-bold text-celestial-starlight">
              Spacecraft & Probes Fleet ({spacecraft.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {spacecraft.map((sc) => (
              <div
                key={sc.id}
                className="rounded-xl border border-celestial-muted/80 bg-celestial-surface/50 p-5 backdrop-blur-md space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <Badge variant="outline" className="text-[10px] font-mono text-celestial-amber">
                      {sc.type}
                    </Badge>
                    <Badge
                      variant={sc.status === "ACTIVE" ? "emerald" : "outline"}
                      className="text-[10px] font-mono uppercase"
                    >
                      {sc.status}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold text-celestial-starlight">
                    <Link
                      href={`/spacecraft/${sc.slug}`}
                      className="hover:text-celestial-cyan transition-colors"
                    >
                      {sc.name}
                    </Link>
                  </h3>
                  <p className="text-xs text-celestial-subtle line-clamp-3 leading-relaxed">
                    {sc.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-celestial-muted/40 space-y-1 text-[11px] font-mono text-celestial-subtle">
                  {sc.massKg && (
                    <div className="flex justify-between">
                      <span>Launch Mass:</span>
                      <span className="text-celestial-starlight font-bold">{sc.massKg} kg</span>
                    </div>
                  )}
                  {sc.powerWatts && (
                    <div className="flex justify-between">
                      <span>Electrical Power:</span>
                      <span className="text-celestial-starlight">{sc.powerWatts} W</span>
                    </div>
                  )}
                  {sc.currentState?.currentDistanceAu && (
                    <div className="flex justify-between text-celestial-cyan">
                      <span>Current Distance:</span>
                      <span className="font-bold">{sc.currentState.currentDistanceAu} AU</span>
                    </div>
                  )}
                  <div className="pt-2">
                    <Link
                      href={`/spacecraft/${sc.slug}`}
                      className="text-xs text-celestial-cyan hover:underline font-semibold"
                    >
                      View Spacecraft Profile →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scientific Instruments Section */}
      {instruments.length > 0 && (
        <div id="instruments" className="space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-celestial-cyan" />
            <h2 className="text-xl font-bold text-celestial-starlight">
              Scientific Payload & Instruments ({instruments.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {instruments.map((inst) => (
              <div
                key={inst.id}
                className="rounded-xl border border-celestial-muted/80 bg-celestial-surface/50 p-4 backdrop-blur-md space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    {inst.acronym && (
                      <span className="font-mono text-xs font-bold text-celestial-cyan uppercase mr-2">
                        {inst.acronym}
                      </span>
                    )}
                    <h3 className="text-sm font-bold text-celestial-starlight inline">
                      {inst.name}
                    </h3>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono shrink-0">
                    {inst.type.replace(/_/g, " ")}
                  </Badge>
                </div>

                <p className="text-xs text-celestial-subtle leading-relaxed">
                  {inst.scientificPurpose}
                </p>

                {inst.wavelengthRange && (
                  <div className="text-[11px] font-mono text-celestial-subtle bg-celestial-void/40 px-2.5 py-1 rounded border border-celestial-muted/40">
                    <span className="text-celestial-cyan">Band:</span> {inst.wavelengthRange}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scientific Discoveries Section */}
      {discoveries.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-celestial-purple" />
            <h2 className="text-xl font-bold text-celestial-starlight">
              Major Scientific Discoveries ({discoveries.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {discoveries.map((disc) => (
              <div
                key={disc.id}
                className="rounded-2xl border border-celestial-purple/30 bg-celestial-purple/5 p-5 backdrop-blur-lg space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-celestial-starlight">{disc.title}</h3>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-mono uppercase border-celestial-purple/40 text-celestial-purple shrink-0"
                  >
                    {disc.epistemicStatus}
                  </Badge>
                </div>

                <p className="text-xs text-celestial-subtle leading-relaxed">{disc.description}</p>

                <div className="text-xs text-celestial-purple/90 bg-celestial-void/40 p-2.5 rounded-lg border border-celestial-purple/20">
                  <span className="font-bold">Significance:</span> {disc.scientificSignificance}
                </div>

                {disc.citationUrl && (
                  <div className="pt-1 flex justify-end">
                    <a
                      href={disc.citationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono text-celestial-cyan hover:underline flex items-center gap-1"
                    >
                      <span>Primary Scientific Publication</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Archives & Public Repositories */}
      {mission.dataArchives && mission.dataArchives.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-celestial-starlight">
              Public Scientific Data Archives ({mission.dataArchives.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mission.dataArchives.map((archive) => (
              <div
                key={archive.id}
                className="rounded-xl border border-border/40 bg-card/40 p-4 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground text-sm">{archive.name}</span>
                  <Badge
                    variant="outline"
                    className="text-[10px] text-emerald-400 border-emerald-400/30"
                  >
                    {archive.accessLevel}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{archive.description}</p>
                <div className="pt-2">
                  <a
                    href={archive.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Access Scientific Data Repository
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mission Milestones Chronological Timeline */}
      {events.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-celestial-emerald" />
            <h2 className="text-xl font-bold text-celestial-starlight">
              Mission Milestone Timeline
            </h2>
          </div>

          <div className="space-y-3 relative pl-6 border-l-2 border-celestial-muted/80 ml-3">
            {events.map((evt) => (
              <div key={evt.id} className="relative space-y-1">
                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-celestial-cyan border-2 border-celestial-void shadow" />
                <div className="text-[11px] font-mono text-celestial-cyan font-bold">
                  {new Date(evt.timestamp).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="text-sm font-bold text-celestial-starlight">{evt.title}</div>
                <div className="text-xs text-celestial-subtle leading-relaxed">
                  {evt.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Authoritative Scientific Provenance Card */}
      <div className="rounded-2xl border border-celestial-muted/80 bg-celestial-surface/40 p-5 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-celestial-emerald shrink-0" />
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-celestial-starlight font-mono uppercase">
              Authoritative Provenance: {mission.provenance.authoritativeBody}
            </div>
            <div className="text-[11px] text-celestial-subtle font-mono">
              Source: {mission.provenance.catalogName} (Confidence Score:{" "}
              {(mission.provenance.confidenceScore * 100).toFixed(1)}%)
            </div>
          </div>
        </div>

        {mission.provenance.citationUrl && (
          <a
            href={mission.provenance.citationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-celestial-cyan hover:underline flex items-center gap-1.5 shrink-0"
          >
            <span>Official Mission & Science Archive</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
