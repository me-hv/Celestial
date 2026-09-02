import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Download,
  CheckCircle2,
  Layers,
  GitBranch,
} from "lucide-react";
import { datasetRepo } from "@/lib/data/dataset-repository";
import { SCIENTIFIC_DATASETS } from "@/lib/data/dataset-data";
import { Badge } from "@/components/ui/badge";

interface DatasetPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SCIENTIFIC_DATASETS.map((ds) => ({
    slug: ds.slug,
  }));
}

export default async function DatasetProfilePage({ params }: DatasetPageProps) {
  const { slug } = await params;
  const ds = datasetRepo.getBySlug(slug);

  if (!ds) {
    notFound();
  }

  return (
    <div className="w-full min-h-screen bg-celestial-void text-celestial-starlight p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/datasets"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-celestial-muted/80 bg-celestial-surface/60 hover:bg-celestial-surface text-xs font-mono text-celestial-starlight transition"
        >
          <ArrowLeft className="w-4 h-4" /> All Datasets
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="cyan" className="font-mono text-xs uppercase">
            {ds.discipline.replace(/_/g, " ")}
          </Badge>
          <Badge variant="amber" className="font-mono text-xs uppercase">
            {ds.wavelengthBand}
          </Badge>
        </div>
      </div>

      {/* Hero Header */}
      <div className="p-6 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/60 backdrop-blur-xl space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-celestial-cyan font-bold uppercase">
                [{ds.organizationName}]
              </span>
              {ds.missionName && (
                <span className="font-mono text-xs text-celestial-subtle">• {ds.missionName}</span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-celestial-starlight">
              {ds.title}
            </h1>
            <div className="flex items-center gap-2 text-xs font-mono text-celestial-subtle">
              <span>Data Version: {ds.dataVersion}</span>
              <span>•</span>
              <span>Format: {ds.dataType}</span>
              {ds.recordCount && <span>• {ds.recordCount.toLocaleString()} Records</span>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {ds.downloadUrl && (
              <a
                href={ds.downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs bg-celestial-cyan/20 border border-celestial-cyan/50 text-celestial-cyan hover:bg-celestial-cyan/30 transition"
              >
                <Download className="w-4 h-4" /> Download Bundle
              </a>
            )}
            <a
              href={ds.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs border border-celestial-muted/80 bg-celestial-surface/60 hover:bg-celestial-surface text-celestial-starlight transition"
            >
              Archive Portal <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <p className="text-sm text-celestial-subtle leading-relaxed">{ds.description}</p>
      </div>

      {/* Main Grid: Parameters & Provenance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Measured Parameters & Metadata */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/50 backdrop-blur-lg space-y-4">
            <h2 className="text-lg font-bold text-celestial-starlight flex items-center gap-2">
              <Layers className="w-5 h-5 text-celestial-cyan" />
              Physical Parameters Measured
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ds.parametersMeasured.map((param, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-3 rounded-xl bg-celestial-void/60 border border-celestial-muted/60 text-xs font-mono text-celestial-starlight"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{param}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transformation Pipeline Audit Trail */}
          <div className="p-6 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/50 backdrop-blur-lg space-y-4">
            <h2 className="text-lg font-bold text-celestial-starlight flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-celestial-cyan" />
              Data Pipeline & Transformation History
            </h2>
            <div className="space-y-4">
              {ds.transformationHistory.map((step) => (
                <div
                  key={step.stepIndex}
                  className="p-4 rounded-xl bg-celestial-void/60 border border-celestial-muted/60 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-celestial-cyan">
                      Step {step.stepIndex}: {step.stepName}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] font-mono text-emerald-400 border-emerald-500/40"
                    >
                      {step.epistemicStatus}
                    </Badge>
                  </div>
                  <p className="text-xs text-celestial-subtle leading-relaxed">
                    {step.description}
                  </p>
                  <div className="text-[11px] font-mono text-celestial-subtle/80 flex items-center gap-2">
                    <span>Algorithm: {step.appliedAlgorithm}</span>
                    {step.softwareVersion && <span>• v{step.softwareVersion}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Provenance & Citation */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/50 backdrop-blur-lg space-y-4">
            <h2 className="text-lg font-bold text-celestial-starlight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-celestial-cyan" />
              Provenance & Scientific Citation
            </h2>
            <div className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-celestial-subtle uppercase text-[10px]">
                  Authoritative Body
                </span>
                <p className="font-bold text-celestial-starlight">
                  {ds.provenance.authoritativeBody}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-celestial-subtle uppercase text-[10px]">License</span>
                <p className="text-celestial-starlight">{ds.license}</p>
              </div>
              {ds.citationDoi && (
                <div className="space-y-1">
                  <span className="text-celestial-subtle uppercase text-[10px]">
                    Peer-Reviewed DOI
                  </span>
                  <p className="text-celestial-cyan break-all">
                    <a
                      href={`https://doi.org/${ds.citationDoi}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      doi:{ds.citationDoi}
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
