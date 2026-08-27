import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Orbit,
  Weight,
  ShieldCheck,
  ExternalLink,
  Compass,
  Layers,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { celestialRepo } from "@/lib/data/celestial-repository";
import { stellarSystemRepo } from "@/lib/data/stellar-system-repository";
import { formatScientificMass, formatTemperature, formatDistance } from "@/lib/utils/formatters";

interface ObjectDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ObjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const object = celestialRepo.getBySlug(slug);

  if (!object) {
    return {
      title: "Object Not Found — CELESTIAL",
    };
  }

  return {
    title: `${object.canonicalName} (${object.standardDesignation || "Celestial Body"}) — CELESTIAL Atlas`,
    description:
      object.summary ||
      `Scientific parameters, orbital mechanics, and observations for ${object.canonicalName}.`,
  };
}

export default async function ObjectDetailPage({ params }: ObjectDetailPageProps) {
  const { slug } = await params;
  const object = celestialRepo.getBySlug(slug);

  if (!object) {
    notFound();
  }

  const isStar = object.classification.code === "STAR";
  const parentObject = object.parentId ? celestialRepo.getById(object.parentId) : null;
  const hostSystem = object.hostSystemId
    ? stellarSystemRepo.getById(object.hostSystemId) ||
      stellarSystemRepo.getBySlug(object.hostSystemId)
    : null;
  const childObjects = celestialRepo.getChildrenOf(object.id);
  const unc = object.physical.measurementsWithUncertainty;

  const badgeVariant =
    object.classification.category === "PLANETARY"
      ? "cyan"
      : object.classification.category === "STELLAR"
        ? "amber"
        : "violet";

  return (
    <div className="flex-1 py-10">
      <Container size="lg" className="space-y-8">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/objects">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-celestial-subtle hover:text-celestial-starlight"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Objects Atlas</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            {hostSystem && (
              <Link href={`/systems/${hostSystem.slug}`}>
                <Button variant="secondary" size="sm" className="gap-1.5 font-mono text-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{hostSystem.name}</span>
                </Button>
              </Link>
            )}
            <Link href={hostSystem ? `/explore?system=${hostSystem.slug}` : "/explore"}>
              <Button variant="cyan" size="sm" className="gap-2 font-mono text-xs">
                <Compass className="w-4 h-4" />
                <span>View in 3D</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Object Header Hero */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/70 backdrop-blur-xl shadow-subtle-card">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold font-mono tracking-tight text-celestial-starlight">
                {object.canonicalName.toUpperCase()}
              </h1>
              <Badge variant={badgeVariant}>{object.classification.code.replace(/_/g, " ")}</Badge>
            </div>
            {object.standardDesignation && (
              <p className="text-sm font-mono text-celestial-subtle">
                Standard Designation: {object.standardDesignation}
              </p>
            )}
            <p className="text-sm text-celestial-starlight/90 max-w-2xl leading-relaxed pt-1">
              {object.summary}
            </p>
          </div>
        </div>

        {/* Discovery Information Card (Exoplanets) */}
        {object.discovery && (
          <Card elevated className="space-y-3">
            <CardHeader className="pb-2 border-b border-celestial-muted/50">
              <CardTitle className="text-base flex items-center gap-2 text-celestial-cyan font-mono">
                <Sparkles className="w-4 h-4" />
                <span>Exoplanetary Discovery Context</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs pt-1">
              {object.discovery.year && (
                <div>
                  <span className="text-celestial-subtle text-[11px] block">Discovery Year</span>
                  <span className="font-semibold text-celestial-starlight">
                    {object.discovery.year}
                  </span>
                </div>
              )}
              {object.discovery.method && (
                <div>
                  <span className="text-celestial-subtle text-[11px] block">Discovery Method</span>
                  <span className="font-semibold text-celestial-starlight">
                    {object.discovery.method}
                  </span>
                </div>
              )}
              {object.discovery.facility && (
                <div className="col-span-2">
                  <span className="text-celestial-subtle text-[11px] block">
                    Discovery Facility / Mission
                  </span>
                  <span className="font-semibold text-celestial-starlight">
                    {object.discovery.facility}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Multi-Catalog Aliases */}
        {object.aliases.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-mono text-celestial-subtle">Catalog Aliases:</span>
            {object.aliases.map((alias) => (
              <span
                key={alias.name}
                className="px-2.5 py-1 rounded-md bg-celestial-deep/80 border border-celestial-muted text-celestial-starlight font-mono"
              >
                {alias.name}{" "}
                <span className="text-[10px] text-celestial-subtle">({alias.type})</span>
              </span>
            ))}
          </div>
        )}

        {/* Two-Column Grid: Physical Characteristics & Orbital Mechanics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Physical Characteristics */}
          <Card elevated className="space-y-4">
            <CardHeader className="pb-2 border-b border-celestial-muted/50">
              <CardTitle className="text-lg flex items-center gap-2 text-celestial-cyan font-mono">
                <Weight className="w-4 h-4" />
                <span>Physical Characteristics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 font-mono text-xs">
              {/* Mass */}
              <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                <span className="text-celestial-subtle">Mass:</span>
                <span className="font-semibold text-celestial-starlight text-right">
                  {object.physical.massEarth ? (
                    <>
                      {object.physical.massEarth} M⊕
                      {unc?.massEarth?.uncertainty && (
                        <span className="text-celestial-subtle text-[10px] block font-normal">
                          +{unc.massEarth.uncertainty.upper} / {unc.massEarth.uncertainty.lower}
                        </span>
                      )}
                    </>
                  ) : object.physical.massSolar ? (
                    `${object.physical.massSolar} M☉`
                  ) : object.physical.massJupiter ? (
                    `${object.physical.massJupiter} M_J`
                  ) : (
                    formatScientificMass(object.physical.massKg)
                  )}
                </span>
              </div>

              {/* Radius */}
              <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                <span className="text-celestial-subtle">Radius:</span>
                <span className="font-semibold text-celestial-starlight text-right">
                  {object.physical.radiusEarth ? (
                    <>
                      {object.physical.radiusEarth} R⊕
                      {unc?.radiusEarth?.uncertainty && (
                        <span className="text-celestial-subtle text-[10px] block font-normal">
                          +{unc.radiusEarth.uncertainty.upper} / {unc.radiusEarth.uncertainty.lower}
                        </span>
                      )}
                    </>
                  ) : object.physical.radiusSolar ? (
                    `${object.physical.radiusSolar} R☉`
                  ) : object.physical.radiusJupiter ? (
                    `${object.physical.radiusJupiter} R_J`
                  ) : (
                    `${object.physical.meanRadiusKm?.toLocaleString()} km`
                  )}
                </span>
              </div>

              {/* Surface Gravity */}
              {object.physical.surfaceGravityMs2 && (
                <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                  <span className="text-celestial-subtle">Surface Gravity:</span>
                  <span className="font-semibold text-celestial-starlight">
                    {object.physical.surfaceGravityMs2} m/s²
                  </span>
                </div>
              )}

              {/* Density */}
              {object.physical.densityGcm3 && (
                <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                  <span className="text-celestial-subtle">Mean Density:</span>
                  <span className="font-semibold text-celestial-starlight">
                    {object.physical.densityGcm3} g/cm³
                  </span>
                </div>
              )}

              {/* Temperature */}
              {(object.physical.effectiveTemperatureK || object.physical.meanTemperatureK) && (
                <div className="flex justify-between py-1.5">
                  <span className="text-celestial-subtle">
                    {isStar ? "Effective Temperature:" : "Mean Temperature:"}
                  </span>
                  <span className="font-semibold text-celestial-starlight">
                    {formatTemperature(
                      object.physical.effectiveTemperatureK || object.physical.meanTemperatureK
                    )}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 2. Orbital Mechanics */}
          <Card elevated className="space-y-4">
            <CardHeader className="pb-2 border-b border-celestial-muted/50">
              <CardTitle className="text-lg flex items-center gap-2 text-celestial-amber font-mono">
                <Orbit className="w-4 h-4" />
                <span>Orbital Mechanics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 font-mono text-xs">
              {object.orbital ? (
                <>
                  <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                    <span className="text-celestial-subtle">Semi-Major Axis (a):</span>
                    <span className="font-semibold text-celestial-starlight">
                      {formatDistance(
                        object.orbital.semiMajorAxisKm,
                        undefined,
                        object.orbital.semiMajorAxisAu
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                    <span className="text-celestial-subtle">Orbital Eccentricity (e):</span>
                    <span className="font-semibold text-celestial-starlight">
                      {object.orbital.eccentricity ?? "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                    <span className="text-celestial-subtle">Orbital Period:</span>
                    <span className="font-semibold text-celestial-starlight">
                      {object.orbital.orbitalPeriodDays
                        ? `${object.orbital.orbitalPeriodDays.toFixed(3)} days`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-celestial-subtle">Orbital Inclination (i):</span>
                    <span className="font-semibold text-celestial-starlight">
                      {object.orbital.inclinationDeg !== undefined
                        ? `${object.orbital.inclinationDeg}°`
                        : "—"}
                    </span>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-celestial-subtle">
                  Central host star of the planetary system.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Hierarchical Relationships */}
        {(parentObject || childObjects.length > 0) && (
          <Card elevated className="space-y-4">
            <CardHeader className="pb-2 border-b border-celestial-muted/50">
              <CardTitle className="text-lg flex items-center gap-2 text-celestial-violet font-mono">
                <Layers className="w-4 h-4" />
                <span>Hierarchical Relationships</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {parentObject && (
                <div className="space-y-1 text-xs">
                  <span className="text-celestial-subtle font-mono">Host Star / Parent Body:</span>
                  <div className="pt-1">
                    <Link href={`/objects/${parentObject.slug}`}>
                      <Button variant="secondary" size="sm" className="gap-2">
                        <span>{parentObject.canonicalName}</span>
                        <span className="text-celestial-subtle text-[11px]">
                          ({parentObject.classification.code})
                        </span>
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {childObjects.length > 0 && (
                <div className="space-y-1.5 text-xs">
                  <span className="text-celestial-subtle font-mono">
                    Satellites & Planetary Bodies ({childObjects.length}):
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {childObjects.map((child) => (
                      <Link key={child.id} href={`/objects/${child.slug}`}>
                        <Button variant="secondary" size="sm" className="gap-1.5 font-mono text-xs">
                          <span>{child.canonicalName}</span>
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Scientific Provenance Citation */}
        <div className="p-6 rounded-2xl border border-celestial-cyan/30 bg-celestial-cyan/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-celestial-cyan font-mono font-semibold text-sm">
              <ShieldCheck className="w-5 h-5" />
              <span>Scientific Data Provenance & Verification</span>
            </div>
            <Badge variant="cyan">
              Confidence: {(object.provenance.confidenceScore * 100).toFixed(1)}%
            </Badge>
          </div>
          <div className="text-xs text-celestial-subtle space-y-1">
            <p>
              Authoritative Source:{" "}
              <strong className="text-celestial-starlight">{object.provenance.catalogName}</strong>{" "}
              ({object.provenance.authoritativeBody})
            </p>
            <p className="font-mono text-[11px]">
              Record Identifier: {object.provenance.recordIdentifier} | Version:{" "}
              {object.provenance.catalogVersion || "PS_2026"}
            </p>
          </div>
          {object.provenance.citationUrl && (
            <div className="pt-1">
              <a
                href={object.provenance.citationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-celestial-cyan hover:underline font-mono"
              >
                <span>View Authoritative Parameters at {object.provenance.authoritativeBody}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
