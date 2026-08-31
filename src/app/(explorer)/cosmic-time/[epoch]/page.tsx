import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cosmicEpochRepo } from "@/lib/data/cosmic-epoch-repository";
import { EPOCH_COLOR_MAP } from "@/features/visualization/cosmic-time/cosmic-time-renderer";

interface EpochPageProps {
  params: Promise<{ epoch: string }>;
}

export async function generateStaticParams() {
  const epochs = cosmicEpochRepo.getAll();
  return epochs.map((e) => ({
    epoch: e.slug,
  }));
}

export default async function EpochDetailPage({ params }: EpochPageProps) {
  const { epoch: epochSlug } = await params;
  const epoch = cosmicEpochRepo.getBySlug(epochSlug);

  if (!epoch) {
    notFound();
  }

  const { prev, next } = cosmicEpochRepo.getSurroundingEpochs(epoch.slug);
  const colorConfig = EPOCH_COLOR_MAP[epoch.type] || { hex: "#38bdf8" };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 max-w-6xl mx-auto gap-8">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-400 border-b border-slate-800 pb-4">
        <Link href="/cosmic-time" className="hover:text-cyan-400 transition-colors">
          Cosmic Time Machine
        </Link>
        <span>/</span>
        <span className="text-slate-500">Epochs</span>
        <span>/</span>
        <span className="text-cyan-400">{epoch.name}</span>
      </div>

      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colorConfig.hex }} />
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              EPOCH {epoch.orderIndex} OF 14 • {epoch.category.replace(/_/g, " ")}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-100">
            {epoch.name}
          </h1>
          <p className="text-sm sm:text-base text-slate-400 font-mono mt-2">{epoch.tagline}</p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2">
          <Link
            href={`/cosmic-time?epoch=${epoch.slug}`}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-cyan-950/40"
          >
            <span>Open in Cosmic Time Machine →</span>
          </Link>
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
              {epoch.observationStatus}
            </span>
            <span className="text-slate-500">•</span>
            <span>{epoch.boundaryConfidence.replace(/_/g, " ")}</span>
          </div>
        </div>
      </div>

      {/* Telemetry Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Cosmic Age</span>
          <div className="text-base sm:text-lg font-bold font-mono text-slate-100 mt-1">
            {epoch.ageRange.minDisplay} – {epoch.ageRange.maxDisplay}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Lookback Time</span>
          <div className="text-base sm:text-lg font-bold font-mono text-cyan-400 mt-1">
            {epoch.lookbackTimeRangeGyr.minGyr.toFixed(2)} –{" "}
            {epoch.lookbackTimeRangeGyr.maxGyr.toFixed(2)} Gyr
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Redshift Range</span>
          <div className="text-base sm:text-lg font-bold font-mono text-purple-400 mt-1">
            {epoch.redshiftRange
              ? `${epoch.redshiftRange.minDisplay} – ${epoch.redshiftRange.maxDisplay}`
              : "N/A"}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Scale Factor a</span>
          <div className="text-base sm:text-lg font-bold font-mono text-emerald-400 mt-1">
            {epoch.scaleFactorRange
              ? `${epoch.scaleFactorRange.minA.toFixed(4)} – ${epoch.scaleFactorRange.maxA.toFixed(4)}`
              : "a → 0"}
          </div>
        </div>
      </div>

      {/* In-Depth Scientific Dossier */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-bold text-slate-100 tracking-tight mb-2">
            Scientific Description & Astrophysical Context
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{epoch.description}</p>
        </div>

        {/* Physical Processes */}
        {epoch.physicalProcesses.length > 0 && (
          <div className="flex flex-col gap-3 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider">
              Underlying Physical Processes & Thermodynamics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {epoch.physicalProcesses.map((proc, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col gap-2"
                >
                  <div className="text-sm font-bold text-slate-100">{proc.title}</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{proc.description}</p>
                  {proc.temperatureKelvin && (
                    <div className="text-[11px] font-mono text-amber-400">
                      Temperature: {proc.temperatureKelvin.value.toExponential(2)} K
                    </div>
                  )}
                  {proc.energyScaleGev && (
                    <div className="text-[11px] font-mono text-cyan-400">
                      Energy Scale: {proc.energyScaleGev.value} GeV
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Observational Evidence */}
        {epoch.observationalEvidence.length > 0 && (
          <div className="flex flex-col gap-3 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider">
              Observational Signatures & Empirical Constraints
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {epoch.observationalEvidence.map((ev, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col gap-1.5"
                >
                  <div className="text-xs font-mono text-cyan-400 font-semibold">
                    {ev.technique}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{ev.primarySignature}</p>
                  {ev.observatoryOrMission && (
                    <div className="text-[11px] font-mono text-slate-400">
                      Facility: {ev.observatoryOrMission}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Milestones */}
        {epoch.keyMilestones.length > 0 && (
          <div className="flex flex-col gap-3 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider">
              Cosmological Milestones
            </h3>
            <div className="flex flex-col gap-2">
              {epoch.keyMilestones.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-3"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-100">{m.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{m.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scientific Provenance */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-500">
          <div>
            Authority: {epoch.provenance.authoritativeBody} • {epoch.provenance.catalogName}
          </div>
          {epoch.provenance.citationUrl && (
            <a
              href={epoch.provenance.citationUrl}
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline"
            >
              Primary Citation Source ↗
            </a>
          )}
        </div>
      </div>

      {/* Surrounding Epochs Pagination Navigation */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-6">
        {prev ? (
          <Link
            href={`/cosmic-time/${prev.slug}`}
            className="flex flex-col items-start p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <span className="text-[10px] font-mono text-slate-500">← PREVIOUS EPOCH</span>
            <span className="text-xs font-mono font-bold text-slate-200">{prev.name}</span>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            href={`/cosmic-time/${next.slug}`}
            className="flex flex-col items-end p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <span className="text-[10px] font-mono text-slate-500">NEXT EPOCH →</span>
            <span className="text-xs font-mono font-bold text-slate-200">{next.name}</span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
