import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Compass,
  Globe,
  ShieldCheck,
  ExternalLink,
  Layers,
  Radio,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { deepSkyRepo } from "@/lib/data/deep-sky-repository";
import { CosmicHierarchyBreadcrumb } from "@/features/deep-sky/components/CosmicHierarchyBreadcrumb";
import { LightTravelVsCosmologyBadge } from "@/features/cosmic-time/components/LightTravelVsCosmologyBadge";

interface DeepSkyDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: DeepSkyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const obj = deepSkyRepo.getBySlug(slug);

  if (!obj) {
    return {
      title: "Object Not Found — CELESTIAL",
    };
  }

  return {
    title: `${obj.canonicalName} (${obj.standardDesignation || obj.classification.code}) — CELESTIAL Deep Sky Atlas`,
    description:
      obj.summary || `Astrometry, morphology, and observational data for ${obj.canonicalName}.`,
  };
}

export default async function DeepSkyDetailPage({ params }: DeepSkyDetailPageProps) {
  const { slug } = await params;
  const obj = deepSkyRepo.getBySlug(slug);

  if (!obj) {
    notFound();
  }

  const deepSky = obj.deepSky;
  const distLy = obj.positional.distanceLightYears ?? 0;
  const distMpc = obj.positional.distanceMpc;
  const distKpc = obj.positional.distanceKpc;
  const distUnc = obj.positional.distanceUncertainty;

  let displayDistance = `${distLy.toLocaleString()} ly`;
  if (distMpc !== undefined && distMpc >= 0.1) {
    displayDistance = `${distMpc.toFixed(3)} Mpc (${(distLy / 1000000).toFixed(2)} Million ly)`;
  } else if (distKpc !== undefined && distKpc >= 1.0) {
    displayDistance = `${distKpc.toFixed(2)} kpc (${distLy.toLocaleString()} ly)`;
  }

  const galCoord = obj.positional.galacticCoordinates;

  return (
    <div className="flex-1 py-10">
      <Container size="lg" className="space-y-8">
        {/* Top Navigation & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Link href="/deep-sky">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-celestial-subtle hover:text-celestial-starlight"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Deep Sky Atlas</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/deep-sky">
              <Button variant="cyan" size="sm" className="gap-2 font-mono text-xs">
                <Globe className="w-4 h-4" />
                <span>2D Sky Map</span>
              </Button>
            </Link>
            <Link href="/deep-sky">
              <Button variant="secondary" size="sm" className="gap-2 font-mono text-xs">
                <Compass className="w-4 h-4" />
                <span>3D Universe</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Cosmic Location Hierarchy Breadcrumb */}
        <CosmicHierarchyBreadcrumb object={obj} />

        {/* Hero Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/70 backdrop-blur-xl shadow-subtle-card">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold font-mono tracking-tight text-celestial-starlight">
                {obj.canonicalName.toUpperCase()}
              </h1>
              <Badge variant="cyan">{obj.classification.code.replace(/_/g, " ")}</Badge>
            </div>
            {obj.standardDesignation && (
              <p className="text-sm font-mono text-celestial-subtle">
                Standard Designation: {obj.standardDesignation}
                {obj.physical.constellation && ` · Constellation: ${obj.physical.constellation}`}
              </p>
            )}
            <p className="text-sm text-celestial-starlight/90 max-w-2xl leading-relaxed pt-1">
              {obj.summary}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-celestial-deep/80 border border-celestial-muted font-mono text-xs space-y-1.5 shrink-0">
            <div>
              <span className="text-celestial-subtle">Estimated Distance: </span>
              <span className="font-semibold text-celestial-starlight">{displayDistance}</span>
            </div>
            <div>
              <span className="text-celestial-subtle">Apparent Magnitude (V): </span>
              <span className="font-semibold text-celestial-cyan">
                {obj.physical.apparentMagnitudeV !== undefined
                  ? `${obj.physical.apparentMagnitudeV} mag`
                  : "—"}
              </span>
            </div>
            {deepSky?.galaxy?.morphologicalType && (
              <div>
                <span className="text-celestial-subtle">Morphology: </span>
                <span className="font-semibold text-celestial-violet">
                  {deepSky.galaxy.morphologicalType}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Phase 8 Cosmic Time & Lookback Badge */}
        <LightTravelVsCosmologyBadge
          model={{
            timeType:
              obj.classification.code === "GALAXY" && (deepSky?.galaxy?.redshiftZ ?? 0) > 0.001
                ? "COSMOLOGICAL_LOOKBACK_TIME"
                : "LIGHT_TRAVEL_TIME",
            distanceMpc: distMpc ?? distLy / 3.26156e6,
            distanceLy: distLy,
            lookbackYears: distLy,
            lookbackGyr: distLy / 1e9,
            redshiftZ: deepSky?.galaxy?.redshiftZ,
            scaleFactorA: deepSky?.galaxy?.redshiftZ
              ? 1.0 / (1.0 + Math.max(0, deepSky.galaxy.redshiftZ))
              : 1.0,
            cosmicAgeGyr: 13.8 - distLy / 1e9,
            cosmicAgeYears: 13.8e9 - distLy,
            isCosmological:
              obj.classification.code === "GALAXY" && (deepSky?.galaxy?.redshiftZ ?? 0) > 0.001,
            scientificExplanation:
              obj.classification.code === "GALAXY" && (deepSky?.galaxy?.redshiftZ ?? 0) > 0.001
                ? `Extragalactic object at redshift z = ${deepSky?.galaxy?.redshiftZ}: Light was emitted ~${(distLy / 1e9).toFixed(2)} Billion years ago in an earlier cosmic epoch.`
                : `Galactic Deep Sky Object (${displayDistance}): Light travels through interstellar space at c = 299,792 km/s. Kinematic lookback is ~${distLy >= 1000 ? (distLy / 1000).toFixed(1) + " thousand" : Math.round(distLy)} years.`,
          }}
          objectName={obj.canonicalName}
          showTimelineLink={true}
        />

        {/* Phase 6 Cross-Scale Bridge: Galaxy Profile & Local Group Link */}
        {obj.classification.code === "GALAXY" && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-lg">
                🌌
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-mono">
                  First-Class Galaxy Profile Available
                </h3>
                <p className="text-xs text-slate-400">
                  Explore full kinematics, lookback time, Local Group spatial coordinates, and 3D
                  galaxy visualization.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={
                  obj.slug === "m31"
                    ? "/galaxies/andromeda-galaxy"
                    : obj.slug === "m33"
                      ? "/galaxies/triangulum-galaxy"
                      : `/galaxies/${obj.slug}`
                }
              >
                <Button variant="default" size="sm" className="font-mono text-xs">
                  Open Galaxy Profile →
                </Button>
              </Link>
              <Link href="/local-group">
                <Button variant="outline" size="sm" className="font-mono text-xs">
                  Local Group 3D 🌐
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Two-Column Grid: Coordinates & Morphological Properties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Astrometric & Galactic Coordinates */}
          <Card elevated className="space-y-4">
            <CardHeader className="pb-2 border-b border-celestial-muted/50">
              <CardTitle className="text-lg flex items-center gap-2 text-celestial-cyan font-mono">
                <Compass className="w-4 h-4" />
                <span>Astronomical Coordinates</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                <span className="text-celestial-subtle">Right Ascension (α, J2000):</span>
                <span className="font-semibold text-celestial-starlight">
                  {obj.positional.rightAscensionDeg !== undefined
                    ? `${obj.positional.rightAscensionDeg.toFixed(5)}°`
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                <span className="text-celestial-subtle">Declination (δ, J2000):</span>
                <span className="font-semibold text-celestial-starlight">
                  {obj.positional.declinationDeg !== undefined
                    ? `${obj.positional.declinationDeg.toFixed(5)}°`
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                <span className="text-celestial-subtle">Galactic Longitude (l):</span>
                <span className="font-semibold text-celestial-starlight">
                  {galCoord ? `${galCoord.lDeg.toFixed(4)}°` : "—"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                <span className="text-celestial-subtle">Galactic Latitude (b):</span>
                <span className="font-semibold text-celestial-starlight">
                  {galCoord ? `${galCoord.bDeg.toFixed(4)}°` : "—"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                <span className="text-celestial-subtle">Distance Measurement Method:</span>
                <span className="font-semibold text-celestial-starlight">
                  {deepSky?.distanceMethod
                    ? deepSky.distanceMethod.replace(/_/g, " ")
                    : "Literature Consensus"}
                </span>
              </div>
              {distUnc && (
                <div className="flex justify-between py-1.5">
                  <span className="text-celestial-subtle">Observational Uncertainty:</span>
                  <span className="font-semibold text-celestial-starlight">
                    ±{distUnc.upper?.toLocaleString()} ly ({distUnc.percentage?.toFixed(1)}%)
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 2. Intrinsic Physical & Morphological Properties */}
          <Card elevated className="space-y-4">
            <CardHeader className="pb-2 border-b border-celestial-muted/50">
              <CardTitle className="text-lg flex items-center gap-2 text-celestial-violet font-mono">
                <Layers className="w-4 h-4" />
                <span>Physical & Morphological Characteristics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                <span className="text-celestial-subtle">Apparent Magnitude (V):</span>
                <span className="font-semibold text-celestial-starlight">
                  {obj.physical.apparentMagnitudeV !== undefined
                    ? `${obj.physical.apparentMagnitudeV} mag`
                    : "—"}
                </span>
              </div>

              {/* Galaxy Properties */}
              {deepSky?.galaxy && (
                <>
                  <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                    <span className="text-celestial-subtle">Hubble Classification:</span>
                    <span className="font-semibold text-celestial-starlight">
                      {deepSky.galaxy.morphologicalType}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                    <span className="text-celestial-subtle">Spectroscopic Redshift (z):</span>
                    <span className="font-semibold text-celestial-starlight">
                      {deepSky.galaxy.redshiftZ !== undefined ? deepSky.galaxy.redshiftZ : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                    <span className="text-celestial-subtle">Radial Velocity (v_r):</span>
                    <span className="font-semibold text-celestial-starlight">
                      {deepSky.galaxy.radialVelocityKmS !== undefined
                        ? `${deepSky.galaxy.radialVelocityKmS} km/s`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                    <span className="text-celestial-subtle">Angular Dimensions:</span>
                    <span className="font-semibold text-celestial-starlight">
                      {deepSky.galaxy.majorAxisArcmin}' × {deepSky.galaxy.minorAxisArcmin}'
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-celestial-subtle">Galaxy Group / Cluster:</span>
                    <span className="font-semibold text-celestial-starlight">
                      {deepSky.galaxy.galaxyGroupOrCluster || "Local Group"}
                    </span>
                  </div>
                </>
              )}

              {/* Nebula Properties */}
              {deepSky?.nebula && (
                <>
                  <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                    <span className="text-celestial-subtle">Nebula Subtype:</span>
                    <span className="font-semibold text-celestial-starlight">
                      {deepSky.nebula.nebulaSubtype}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                    <span className="text-celestial-subtle">Angular Diameter:</span>
                    <span className="font-semibold text-celestial-starlight">
                      {deepSky.nebula.angularDiameterArcmin !== undefined
                        ? `${deepSky.nebula.angularDiameterArcmin}'`
                        : "—"}
                    </span>
                  </div>
                  {deepSky.nebula.associatedIonizingStar && (
                    <div className="flex justify-between py-1.5">
                      <span className="text-celestial-subtle">Associated Ionizing Star:</span>
                      <span className="font-semibold text-celestial-starlight">
                        {deepSky.nebula.associatedIonizingStar}
                      </span>
                    </div>
                  )}
                </>
              )}

              {/* Star Cluster Properties */}
              {deepSky?.starCluster && (
                <>
                  <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                    <span className="text-celestial-subtle">Cluster Classification:</span>
                    <span className="font-semibold text-celestial-starlight">
                      {deepSky.starCluster.clusterSubtype.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                    <span className="text-celestial-subtle">Estimated Age:</span>
                    <span className="font-semibold text-celestial-starlight">
                      {deepSky.starCluster.estimatedAgeGyr !== undefined
                        ? `${deepSky.starCluster.estimatedAgeGyr} Gyr`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-celestial-subtle">Estimated Member Count:</span>
                    <span className="font-semibold text-celestial-starlight">
                      {deepSky.starCluster.estimatedMemberCount?.toLocaleString() || "—"} stars
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Multi-Wavelength Observational Archive */}
        {obj.observations && obj.observations.length > 0 && (
          <Card elevated className="space-y-4">
            <CardHeader className="pb-2 border-b border-celestial-muted/50">
              <CardTitle className="text-base flex items-center gap-2 text-celestial-cyan font-mono">
                <Radio className="w-4 h-4" />
                <span>Multi-Wavelength Observational Records</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs pt-1">
              {obj.observations.map((obs) => (
                <div
                  key={obs.id}
                  className="p-3 rounded-xl border border-celestial-muted/60 bg-celestial-deep/60 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="cyan">{obs.wavelengthBand}</Badge>
                    {obs.filterOrFrequency && (
                      <span className="text-[10px] text-celestial-subtle">
                        {obs.filterOrFrequency}
                      </span>
                    )}
                  </div>
                  <div className="font-semibold text-celestial-starlight">
                    {obs.telescopeOrSurvey}
                  </div>
                  {obs.citationOrCredit && (
                    <div className="text-[10px] text-celestial-subtle">{obs.citationOrCredit}</div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Multi-Catalog Identifiers */}
        {obj.catalogIdentifiers && (
          <Card elevated className="space-y-4">
            <CardHeader className="pb-2 border-b border-celestial-muted/50">
              <CardTitle className="text-base flex items-center gap-2 text-celestial-starlight font-mono">
                <Sparkles className="w-4 h-4 text-celestial-amber" />
                <span>Multi-Catalog Astronomical Identifiers</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs pt-1">
              {obj.catalogIdentifiers.messier && (
                <div className="p-2.5 rounded-lg bg-celestial-deep/60 border border-celestial-muted">
                  <span className="text-[10px] text-celestial-subtle block">Messier Catalog</span>
                  <span className="font-semibold text-celestial-starlight">
                    {obj.catalogIdentifiers.messier}
                  </span>
                </div>
              )}
              {obj.catalogIdentifiers.ngc && (
                <div className="p-2.5 rounded-lg bg-celestial-deep/60 border border-celestial-muted">
                  <span className="text-[10px] text-celestial-subtle block">
                    New General Catalogue (NGC)
                  </span>
                  <span className="font-semibold text-celestial-starlight">
                    {obj.catalogIdentifiers.ngc}
                  </span>
                </div>
              )}
              {obj.catalogIdentifiers.ic && (
                <div className="p-2.5 rounded-lg bg-celestial-deep/60 border border-celestial-muted">
                  <span className="text-[10px] text-celestial-subtle block">
                    Index Catalogue (IC)
                  </span>
                  <span className="font-semibold text-celestial-starlight">
                    {obj.catalogIdentifiers.ic}
                  </span>
                </div>
              )}
              {obj.catalogIdentifiers.caldwell && (
                <div className="p-2.5 rounded-lg bg-celestial-deep/60 border border-celestial-muted">
                  <span className="text-[10px] text-celestial-subtle block">Caldwell Catalog</span>
                  <span className="font-semibold text-celestial-starlight">
                    {obj.catalogIdentifiers.caldwell}
                  </span>
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
              <span>Deep Sky Data Provenance & Verification</span>
            </div>
            <Badge variant="cyan">
              Confidence: {(obj.provenance.confidenceScore * 100).toFixed(1)}%
            </Badge>
          </div>
          <div className="text-xs text-celestial-subtle space-y-1">
            <p>
              Authoritative Source:{" "}
              <strong className="text-celestial-starlight">{obj.provenance.catalogName}</strong> (
              {obj.provenance.authoritativeBody})
            </p>
            <p className="font-mono text-[11px]">
              Record Identifier: {obj.provenance.recordIdentifier} | Reference Epoch: J2000.0 (ICRS)
            </p>
          </div>
          {obj.provenance.citationUrl && (
            <div className="pt-1">
              <a
                href={obj.provenance.citationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-celestial-cyan hover:underline font-mono"
              >
                <span>View Authoritative Parameters in SIMBAD / NASA NED Archive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
