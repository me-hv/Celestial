import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cosmicStructureRepo } from "@/lib/data/cosmic-structure-repository";
import { COSMIC_STRUCTURES_DATA } from "@/lib/data/cosmic-structure-data";
import { CosmicStructureTypeBadge } from "@/features/cosmic-web/components/CosmicStructureTypeBadge";
import { CosmicLocationBreadcrumb } from "@/features/cosmic-web/components/CosmicLocationBreadcrumb";
import { formatLookbackTime } from "@/lib/astronomy/cosmology/distance";
import { Button } from "@/components/ui/button";
import { Layers, Sparkles, ExternalLink } from "lucide-react";

interface CosmicStructurePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return COSMIC_STRUCTURES_DATA.map((struct) => ({
    slug: struct.slug,
  }));
}

export default async function CosmicStructureDetailPage({ params }: CosmicStructurePageProps) {
  const { slug } = await params;
  const structure = cosmicStructureRepo.getBySlug(slug);

  if (!structure) {
    notFound();
  }

  const ancestry = cosmicStructureRepo.getAncestryChain(structure.slug);
  const children = cosmicStructureRepo.getChildren(structure.slug);

  const distMpc = structure.coordinates.distanceMpc.value;
  const distLy = structure.coordinates.distanceLy.value;
  const distErrMpc = structure.coordinates.distanceMpc.uncertainty?.upper;

  const majorMpc = structure.dimensions.majorAxisMpc.value;
  const majorLy = majorMpc * 3.26156e6;

  const massSolar = structure.physical.estimatedMassSolar?.value;
  const galaxyCount = structure.physical.galaxyCountEstimated?.value;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Breadcrumb Header */}
      <div className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl sticky top-16 z-30 px-4 py-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/cosmic-web">
              <Button variant="outline" size="sm" className="text-xs font-mono">
                ← Cosmic Web
              </Button>
            </Link>
            <div>
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                EXTRAGALACTIC DOSSIER
              </span>
              <h1 className="text-2xl font-bold font-mono text-white mt-0.5">{structure.name}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CosmicLocationBreadcrumb currentStage="COSMIC_WEB" />
            <Link href={`/cosmic-web/compare?a=${structure.slug}&b=virgo-cluster`}>
              <Button variant="cyan" size="sm" className="text-xs font-mono">
                Compare Structure
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 pt-8 flex flex-col gap-8">
        {/* Hero Banner with Badges & Actions */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 rounded-3xl bg-slate-900/60 p-6 sm:p-8 border border-white/5 backdrop-blur-md shadow-2xl">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center flex-wrap gap-2">
              <CosmicStructureTypeBadge
                type={structure.type}
                observationStatus={structure.observationStatus}
              />
              {structure.standardDesignation && (
                <span className="rounded-full bg-slate-800/60 border border-white/10 px-2.5 py-0.5 text-xs font-mono text-slate-300">
                  {structure.standardDesignation}
                </span>
              )}
            </div>

            <p className="text-base text-slate-200 leading-relaxed font-sans">
              {structure.description}
            </p>

            {structure.uncertaintyCaveats && (
              <div className="rounded-xl bg-amber-950/20 border border-amber-500/20 p-3 text-xs font-mono text-amber-200/90">
                <span className="font-bold text-amber-400 block mb-1">
                  Scientific Note / Boundary Caveat:
                </span>
                {structure.uncertaintyCaveats}
              </div>
            )}
          </div>

          {/* Quick Jump Hero Card */}
          <div className="w-full lg:w-80 rounded-2xl bg-slate-950/80 border border-white/10 p-5 font-mono text-xs space-y-3">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
              Spatial Coordinates
            </span>

            <div className="space-y-1.5 text-slate-300">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-slate-400">Right Ascension (RA):</span>
                <span className="text-white font-semibold">
                  {structure.coordinates.raDeg.toFixed(3)}°
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-slate-400">Declination (Dec):</span>
                <span className="text-white font-semibold">
                  {structure.coordinates.decDeg.toFixed(3)}°
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-slate-400">Galactocentric X, Y, Z:</span>
                <span className="text-white">
                  ({structure.coordinates.galactocentricCartesianMpc.xMpc},{" "}
                  {structure.coordinates.galactocentricCartesianMpc.yMpc},{" "}
                  {structure.coordinates.galactocentricCartesianMpc.zMpc}) Mpc
                </span>
              </div>
              {structure.coordinates.supergalactic && (
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-slate-400">Supergalactic (SGL, SGB):</span>
                  <span className="text-cyan-300 font-semibold">
                    {structure.coordinates.supergalactic.sglDeg}°,{" "}
                    {structure.coordinates.supergalactic.sgbDeg}°
                  </span>
                </div>
              )}
            </div>

            <Link href="/cosmic-web" className="block pt-2">
              <Button variant="cyan" size="sm" className="w-full text-xs">
                Explore in 3D Cosmic Web →
              </Button>
            </Link>
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-slate-900/40 border border-white/5 p-5 font-mono">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
              Heliocentric Distance
            </span>
            <span className="text-2xl font-bold text-cyan-300 mt-1 block">
              {distMpc === 0
                ? "0 Mpc (Home)"
                : `${distMpc.toFixed(1)}${distErrMpc ? ` ± ${distErrMpc}` : ""} Mpc`}
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              ~{(distLy / 1e6).toFixed(1)} Million light-years
            </span>
          </div>

          <div className="rounded-2xl bg-slate-900/40 border border-white/5 p-5 font-mono">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
              Lookback Time & Redshift
            </span>
            <span className="text-2xl font-bold text-emerald-300 mt-1 block">
              {formatLookbackTime(structure.coordinates.lookbackTimeYears)}
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              Spectroscopic z ={" "}
              {structure.coordinates.spectroscopicRedshiftZ?.value.toFixed(4) ?? "0.0000"}
            </span>
          </div>

          <div className="rounded-2xl bg-slate-900/40 border border-white/5 p-5 font-mono">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
              Major Span (Diameter)
            </span>
            <span className="text-2xl font-bold text-white mt-1 block">
              {majorMpc.toFixed(1)} Mpc
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              ~{(majorLy / 1e6).toFixed(1)} Million light-years
            </span>
          </div>

          <div className="rounded-2xl bg-slate-900/40 border border-white/5 p-5 font-mono">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
              Total Gravitational Mass
            </span>
            <span className="text-2xl font-bold text-amber-300 mt-1 block">
              {massSolar ? `${(massSolar / 1e12).toFixed(1)} × 10¹² M☉` : "Diffuse / Void"}
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              {galaxyCount
                ? `~${galaxyCount.toLocaleString()} member galaxies`
                : "Low galaxy density"}
            </span>
          </div>
        </div>

        {/* Hierarchy Context & Member Galaxy Census */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hierarchy Ancestry Chain */}
          <div className="rounded-2xl bg-slate-900/40 border border-white/5 p-6 space-y-4">
            <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Hierarchical Structural Context</span>
            </h2>

            {ancestry.length > 1 ? (
              <div className="space-y-3 font-mono text-xs">
                <span className="text-slate-400 block text-[11px]">
                  Nested structural ascending hierarchy:
                </span>
                <div className="flex flex-col gap-2">
                  {ancestry.map((node, index) => (
                    <div
                      key={node.slug}
                      className={`flex items-center justify-between p-3 rounded-xl border ${
                        node.slug === structure.slug
                          ? "bg-cyan-950/30 border-cyan-500/40 text-cyan-300 font-bold"
                          : "bg-slate-950/60 border-white/5 text-slate-300 hover:border-white/20"
                      }`}
                    >
                      <Link href={`/cosmic-web/${node.slug}`} className="hover:underline">
                        {index + 1}. {node.name}
                      </Link>
                      <CosmicStructureTypeBadge type={node.type} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-mono">
                This structure is a top-level independent cosmic entity in the current model.
              </p>
            )}

            {children.length > 0 && (
              <div className="pt-3 border-t border-white/5 space-y-2">
                <span className="text-[11px] font-mono text-slate-400 block uppercase">
                  Sub-structures & Member Groups ({children.length}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                  {children.map((child) => (
                    <Link
                      key={child.slug}
                      href={`/cosmic-web/${child.slug}`}
                      className="p-2.5 rounded-lg bg-slate-950/80 border border-white/5 hover:border-cyan-500/40 text-slate-200 hover:text-white transition-all flex items-center justify-between"
                    >
                      <span className="truncate">{child.name}</span>
                      <span className="text-[10px] text-cyan-400 ml-2">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Member Galaxies / Dominant Nuclei */}
          <div className="rounded-2xl bg-slate-900/40 border border-white/5 p-6 space-y-4">
            <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Prominent Member Galaxies & Cores</span>
            </h2>

            {structure.memberGalaxies && structure.memberGalaxies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
                {structure.memberGalaxies.map((gal) => (
                  <div
                    key={gal.name}
                    className="p-3 rounded-xl bg-slate-950/60 border border-white/5 flex flex-col justify-between"
                  >
                    <span className="font-bold text-white">{gal.name}</span>
                    {gal.catalogId && (
                      <span className="text-[10px] text-slate-400 mt-0.5">{gal.catalogId}</span>
                    )}
                    {gal.isPrimaryMember && (
                      <span className="text-[10px] text-amber-400 mt-1 font-semibold">
                        Primary Dominant Core
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-mono">
                No individual member galaxies currently cataloged in the local database.
              </p>
            )}

            {/* Central Dominant Galaxy Callout */}
            {structure.physical.centralDominantGalaxy && (
              <div className="rounded-xl bg-amber-950/15 border border-amber-500/20 p-3.5 font-mono text-xs">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                  Central Dominant cD Galaxy / Nexus
                </span>
                <span className="text-sm font-bold text-white mt-1 block">
                  {structure.physical.centralDominantGalaxy.name}
                </span>
                {structure.physical.centralDominantGalaxy.catalogId && (
                  <span className="text-xs text-slate-400 block mt-0.5">
                    Catalog ID: {structure.physical.centralDominantGalaxy.catalogId}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Scientific Provenance Citation */}
        <div className="rounded-2xl bg-slate-900/30 border border-white/5 p-6 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              Scientific Provenance & Primary Citation
            </span>
            <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-cyan-300">
              Confidence: {Math.round(structure.provenance.confidenceScore * 100)}%
            </span>
          </div>
          <p className="text-slate-200">
            Catalog: {structure.provenance.catalogName} • Record ID:{" "}
            {structure.provenance.recordIdentifier}
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
            <span>Authoritative Body: {structure.provenance.authoritativeBody}</span>
            {structure.provenance.retrievedAt && (
              <span>Retrieved: {structure.provenance.retrievedAt}</span>
            )}
            {structure.provenance.citationUrl && (
              <a
                href={structure.provenance.citationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>Journal Reference</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
