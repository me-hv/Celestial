import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Compass, Globe, ShieldCheck, ExternalLink, Layers, Info } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { galacticStructureRepo } from "@/lib/data/galactic-structure-repository";
import { YouAreHereIndicator } from "@/features/galactic/components/YouAreHereIndicator";

interface GalacticStructureProfilePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: GalacticStructureProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const struct = galacticStructureRepo.getBySlug(slug);

  if (!struct) {
    return {
      title: "Structure Not Found — CELESTIAL",
    };
  }

  return {
    title: `${struct.name} (${struct.type.replace(/_/g, " ")}) — CELESTIAL Milky Way Atlas`,
    description: struct.summary,
  };
}

export default async function GalacticStructureProfilePage({
  params,
}: GalacticStructureProfilePageProps) {
  const { slug } = await params;
  const struct = galacticStructureRepo.getBySlug(slug);

  if (!struct) {
    notFound();
  }

  const ext = struct.spatialExtent;

  let currentStage: "EARTH" | "SOLAR_SYSTEM" | "ORION_SPUR" | "MILKY_WAY" | "LOCAL_GROUP" =
    "MILKY_WAY";
  if (struct.slug === "orion-spur") currentStage = "ORION_SPUR";
  else if (struct.slug === "local-group") currentStage = "LOCAL_GROUP";

  return (
    <div className="flex-1 py-10 space-y-8">
      <Container size="lg" className="space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Link href="/milky-way">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-celestial-subtle hover:text-celestial-starlight"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Milky Way Explorer</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/milky-way">
              <Button variant="cyan" size="sm" className="gap-2 font-mono text-xs">
                <Compass className="w-4 h-4" />
                <span>3D View</span>
              </Button>
            </Link>
            <Link href="/milky-way">
              <Button variant="secondary" size="sm" className="gap-2 font-mono text-xs">
                <Globe className="w-4 h-4" />
                <span>2D Map</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* You Are Here Indicator */}
        <YouAreHereIndicator currentStage={currentStage} />

        {/* Model-Derived Notice */}
        {struct.isModelDerived && (
          <div className="p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-200 font-mono text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 block">Model-Derived Structural Region</strong>
              <span>
                Due to observational obscuration within the Galactic Plane, this structure's
                geometry is reconstructed from radio/infrared tracer models and stellar kinematic
                surveys rather than a direct external photograph (Confidence:{" "}
                {struct.modelConfidence}).
              </span>
            </div>
          </div>
        )}

        {/* Hero Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/70 backdrop-blur-xl shadow-subtle-card">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold font-mono tracking-tight text-celestial-starlight">
                {struct.name.toUpperCase()}
              </h1>
              <Badge variant="cyan">{struct.type.replace(/_/g, " ")}</Badge>
            </div>
            {struct.standardDesignation && (
              <p className="text-sm font-mono text-celestial-subtle">
                Standard Designation: {struct.standardDesignation}
              </p>
            )}
            <p className="text-sm text-celestial-starlight/90 max-w-2xl leading-relaxed pt-1">
              {struct.summary}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-celestial-deep/80 border border-celestial-muted font-mono text-xs space-y-1.5 shrink-0">
            <div>
              <span className="text-celestial-subtle">Galactocentric Span: </span>
              <span className="font-semibold text-celestial-starlight">
                {ext.minGalactocentricRadiusKpc} — {ext.maxGalactocentricRadiusKpc} kpc
              </span>
            </div>
            <div>
              <span className="text-celestial-subtle">Classification: </span>
              <span className="font-semibold text-celestial-cyan">
                {struct.type.replace(/_/g, " ")}
              </span>
            </div>
            <div>
              <span className="text-celestial-subtle">Model Confidence: </span>
              <span className="font-semibold text-celestial-violet">{struct.modelConfidence}</span>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Spatial Bounds & Physical Properties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Spatial Extent */}
          <Card elevated className="space-y-4">
            <CardHeader className="pb-2 border-b border-celestial-muted/50">
              <CardTitle className="text-lg flex items-center gap-2 text-celestial-cyan font-mono">
                <Compass className="w-4 h-4" />
                <span>Galactocentric Spatial Extent</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                <span className="text-celestial-subtle">Minimum Galactocentric Radius:</span>
                <span className="font-semibold text-celestial-starlight">
                  {ext.minGalactocentricRadiusKpc} kpc
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                <span className="text-celestial-subtle">Maximum Galactocentric Radius:</span>
                <span className="font-semibold text-celestial-starlight">
                  {ext.maxGalactocentricRadiusKpc} kpc
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                <span className="text-celestial-subtle">Vertical Extent (Scale Height):</span>
                <span className="font-semibold text-celestial-starlight">
                  {ext.minZHeightPc !== undefined
                    ? `±${ext.maxZHeightPc} pc`
                    : "Unbounded / Extended Halo"}
                </span>
              </div>
              {ext.angularSpanDeg && (
                <div className="flex justify-between py-1.5">
                  <span className="text-celestial-subtle">Azimuthal Angle Span (Theta):</span>
                  <span className="font-semibold text-celestial-starlight">
                    {ext.angularSpanDeg.start}° — {ext.angularSpanDeg.end}°
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 2. Physical & Morphological Parameters */}
          <Card elevated className="space-y-4">
            <CardHeader className="pb-2 border-b border-celestial-muted/50">
              <CardTitle className="text-lg flex items-center gap-2 text-celestial-violet font-mono">
                <Layers className="w-4 h-4" />
                <span>Structural Model Parameters</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 font-mono text-xs">
              {/* Disk */}
              {struct.disk && (
                <>
                  <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                    <span className="text-celestial-subtle">Thin Disk Scale Height:</span>
                    <span className="font-semibold text-celestial-starlight">
                      {struct.disk.thinDiskScaleHeightPc} pc
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                    <span className="text-celestial-subtle">Thick Disk Scale Height:</span>
                    <span className="font-semibold text-celestial-starlight">
                      {struct.disk.thickDiskScaleHeightPc} pc
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                    <span className="text-celestial-subtle">Radial Scale Length:</span>
                    <span className="font-semibold text-celestial-starlight">
                      {struct.disk.scaleLengthPc} pc
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-celestial-subtle">Estimated Rotation Velocity:</span>
                    <span className="font-semibold text-celestial-starlight">
                      ~{struct.disk.estimatedRotationSpeedKmS} km/s
                    </span>
                  </div>
                </>
              )}

              {/* Spiral Arm */}
              {struct.spiralArm && (
                <>
                  <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                    <span className="text-celestial-subtle">Pitch Angle (Psi):</span>
                    <span className="font-semibold text-celestial-starlight">
                      {struct.spiralArm.pitchAngleDeg}°
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                    <span className="text-celestial-subtle">Reference Radius (r_0):</span>
                    <span className="font-semibold text-celestial-starlight">
                      {struct.spiralArm.referenceRadiusKpc} kpc
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                    <span className="text-celestial-subtle">Reference Angle (Theta_0):</span>
                    <span className="font-semibold text-celestial-starlight">
                      {struct.spiralArm.referenceAngleDeg}°
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-celestial-subtle">Structure Classification:</span>
                    <span className="font-semibold text-celestial-starlight">
                      {struct.spiralArm.isSpurOrSegment
                        ? "Local Spur / Branch"
                        : "Primary Spiral Arm"}
                    </span>
                  </div>
                </>
              )}

              {/* Bulge */}
              {struct.bulge && (
                <>
                  <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                    <span className="text-celestial-subtle">Effective Spheroid Radius:</span>
                    <span className="font-semibold text-celestial-starlight">
                      {struct.bulge.effectiveRadiusKpc} kpc
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                    <span className="text-celestial-subtle">Bulge Morphology:</span>
                    <span className="font-semibold text-celestial-starlight">
                      {struct.bulge.morphology.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-celestial-subtle">Estimated Stellar Mass:</span>
                    <span className="font-semibold text-celestial-starlight">
                      ~{(struct.bulge.stellarMassSolar! / 1e10).toFixed(1)} x 10^10 M_sun
                    </span>
                  </div>
                </>
              )}

              {/* Bar */}
              {struct.bar && (
                <>
                  <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                    <span className="text-celestial-subtle">Bar Semi-Major Axis:</span>
                    <span className="font-semibold text-celestial-starlight">
                      {struct.bar.halfLengthKpc} kpc
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                    <span className="text-celestial-subtle">Inclination Angle (Phi):</span>
                    <span className="font-semibold text-celestial-starlight">
                      {struct.bar.orientationAngleDeg}° from Sun-GC axis
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-celestial-subtle">Pattern Speed:</span>
                    <span className="font-semibold text-celestial-starlight">
                      ~{struct.bar.patternSpeedKmSPerKpc} km/s/kpc
                    </span>
                  </div>
                </>
              )}

              {/* Galactic Center */}
              {struct.galacticCenter && (
                <>
                  <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                    <span className="text-celestial-subtle">Distance from Earth:</span>
                    <span className="font-semibold text-celestial-starlight">
                      {struct.galacticCenter.distanceFromSunPc.value.toLocaleString()} ± 26 pc
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                    <span className="text-celestial-subtle">Central Black Hole:</span>
                    <span className="font-semibold text-celestial-starlight">
                      {struct.galacticCenter.centralBlackHoleName}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-celestial-subtle">SMBH Mass:</span>
                    <span className="font-semibold text-celestial-starlight">
                      {(struct.galacticCenter.centralBlackHoleMassSolar.value / 1e6).toFixed(3)}{" "}
                      Million M_sun
                    </span>
                  </div>
                </>
              )}

              {/* Local Group */}
              {struct.localGroup && (
                <>
                  <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                    <span className="text-celestial-subtle">Approximate Diameter:</span>
                    <span className="font-semibold text-celestial-starlight">
                      {struct.localGroup.approximateDiameterMpc} Mpc
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                    <span className="text-celestial-subtle">Member Galaxies Count:</span>
                    <span className="font-semibold text-celestial-starlight">
                      {struct.localGroup.totalGalaxyCountEstimated}+ galaxies
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-celestial-subtle">Dominant Members:</span>
                    <span className="font-semibold text-celestial-starlight">
                      Milky Way & Andromeda (M31)
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Scientific Provenance Citation */}
        <div className="p-6 rounded-2xl border border-celestial-cyan/30 bg-celestial-cyan/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-celestial-cyan font-mono font-semibold text-sm">
              <ShieldCheck className="w-5 h-5" />
              <span>Scientific Provenance & Model Reference</span>
            </div>
            <Badge variant="cyan">
              Confidence: {(struct.provenance.confidenceScore * 100).toFixed(1)}%
            </Badge>
          </div>
          <div className="text-xs text-celestial-subtle space-y-1 font-mono">
            <p>
              Authoritative Body:{" "}
              <strong className="text-celestial-starlight">
                {struct.provenance.authoritativeBody}
              </strong>
            </p>
            <p>
              Model Catalog Reference: {struct.provenance.catalogName} | Record:{" "}
              {struct.provenance.recordIdentifier}
            </p>
          </div>
          {struct.provenance.citationUrl && (
            <div className="pt-1">
              <a
                href={struct.provenance.citationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-celestial-cyan hover:underline font-mono"
              >
                <span>View Model Reference Publication</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
