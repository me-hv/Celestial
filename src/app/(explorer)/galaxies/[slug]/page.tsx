import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { galaxyRepo } from "@/lib/data/galaxy-repository";
import { GalaxyMorphologyBadge } from "@/features/galaxy/components/GalaxyMorphologyBadge";
import { formatGalaxyDistance, formatLookbackTime } from "@/lib/astronomy/cosmology/distance";
import { YouAreHereIndicator } from "@/features/galactic/components/YouAreHereIndicator";
import { LightTravelVsCosmologyBadge } from "@/features/cosmic-time/components/LightTravelVsCosmologyBadge";

interface GalaxyProfilePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const galaxies = galaxyRepo.getAll();
  return galaxies.map((g) => ({ slug: g.slug }));
}

export default async function GalaxyProfilePage({ params }: GalaxyProfilePageProps) {
  const { slug } = await params;
  const galaxy = galaxyRepo.getBySlug(slug);

  if (!galaxy) {
    notFound();
  }

  const isMilkyWay = galaxy.slug === "milky-way-galaxy";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <Container size="lg" className="space-y-8">
        {/* Navigation & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <Link
              href="/galaxies"
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition block mb-2"
            >
              ← Back to Galaxy Catalog
            </Link>
            <div className="flex items-center gap-2">
              <GalaxyMorphologyBadge
                morphologyClass={galaxy.morphology.class}
                hubbleType={galaxy.morphology.hubbleDeVaucouleurs}
              />
              {galaxy.groupMembership && (
                <span className="text-[11px] font-mono text-slate-400 bg-slate-900 border border-white/10 px-2 py-0.5 rounded">
                  {galaxy.groupMembership.groupName}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              {galaxy.name}
            </h1>
            {galaxy.standardDesignation && (
              <p className="text-sm font-mono text-slate-400">{galaxy.standardDesignation}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <YouAreHereIndicator currentStage={isMilkyWay ? "MILKY_WAY" : "LOCAL_GROUP"} />
            <Link href="/local-group">
              <Button variant="outline" className="font-mono text-xs">
                Local Group 3D →
              </Button>
            </Link>
            <Link href="/cosmic-web">
              <Button variant="cyan" className="font-mono text-xs">
                Cosmic Web Context ↗
              </Button>
            </Link>
          </div>
        </div>

        {/* Summary Description */}
        <Card className="bg-slate-900/60 border-white/10 p-6 rounded-2xl">
          <h2 className="text-sm font-mono uppercase tracking-wider text-cyan-400 mb-2 font-semibold">
            Astronomical Overview
          </h2>
          <p className="text-base text-slate-300 leading-relaxed">{galaxy.summary}</p>
        </Card>

        {/* Primary Extragalactic Metric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Distance */}
          <Card className="bg-slate-900/40 border-white/10 p-5 rounded-xl">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Distance (Earth)
            </span>
            <span className="text-xl font-bold text-cyan-400 font-mono mt-1 block">
              {isMilkyWay
                ? "0 ly (Home)"
                : formatGalaxyDistance(
                    galaxy.distance.distanceLy.value,
                    galaxy.distance.distanceLy.uncertainty
                  )}
            </span>
            {!isMilkyWay && (
              <span className="text-xs text-slate-400 font-mono mt-1 block">
                {galaxy.distance.distanceKpc.value.toFixed(1)} kpc ({galaxy.distance.primaryMethod})
              </span>
            )}
          </Card>

          {/* Lookback Time */}
          <Card className="bg-slate-900/40 border-white/10 p-5 rounded-xl">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Lookback Time (t)
            </span>
            <span className="text-xl font-bold text-emerald-400 font-mono mt-1 block">
              {isMilkyWay
                ? "Present Epoch"
                : formatLookbackTime(galaxy.distance.derivedLookbackTimeYears)}
            </span>
            <span className="text-xs text-slate-400 font-mono mt-1 block">
              Light travel: t = d / c
            </span>
          </Card>

          {/* Physical Diameter */}
          <Card className="bg-slate-900/40 border-white/10 p-5 rounded-xl">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Physical Diameter
            </span>
            <span className="text-xl font-bold text-white font-mono mt-1 block">
              ~{Math.round(galaxy.physical.diameterLy.value).toLocaleString()} ly
            </span>
            <span className="text-xs text-slate-400 font-mono mt-1 block">
              {galaxy.physical.diameterKpc.value.toFixed(1)} kpc
            </span>
          </Card>

          {/* Total Virial Mass */}
          <Card className="bg-slate-900/40 border-white/10 p-5 rounded-xl">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Total Halo Mass (M_vir)
            </span>
            <span className="text-xl font-bold text-amber-400 font-mono mt-1 block">
              {galaxy.physical.totalMassSolar
                ? `${(galaxy.physical.totalMassSolar.value / 1e12).toFixed(2)} × 10¹² M☉`
                : "N/A"}
            </span>
            {galaxy.physical.stellarMassSolar && (
              <span className="text-xs text-slate-400 font-mono mt-1 block">
                Stellar: {(galaxy.physical.stellarMassSolar.value / 1e10).toFixed(1)} × 10¹⁰ M☉
              </span>
            )}
          </Card>
        </div>

        {/* Cosmic Time & Lookback Horizon */}
        <LightTravelVsCosmologyBadge
          model={{
            timeType:
              isMilkyWay || Math.abs(galaxy.kinematics.spectroscopicRedshiftZ?.value ?? 0) <= 0.001
                ? "LIGHT_TRAVEL_TIME"
                : "COSMOLOGICAL_LOOKBACK_TIME",
            distanceMpc: galaxy.distance.distanceKpc.value / 1000,
            distanceLy: galaxy.distance.distanceLy.value,
            lookbackYears: galaxy.distance.derivedLookbackTimeYears,
            lookbackGyr: galaxy.distance.derivedLookbackTimeYears / 1e9,
            redshiftZ: galaxy.kinematics.spectroscopicRedshiftZ?.value,
            scaleFactorA: galaxy.kinematics.spectroscopicRedshiftZ?.value
              ? 1.0 / (1.0 + Math.max(0, galaxy.kinematics.spectroscopicRedshiftZ.value))
              : 1.0,
            cosmicAgeGyr: 13.8 - galaxy.distance.derivedLookbackTimeYears / 1e9,
            cosmicAgeYears: 13.8e9 - galaxy.distance.derivedLookbackTimeYears,
            isCosmological:
              !isMilkyWay && (galaxy.kinematics.spectroscopicRedshiftZ?.value ?? 0) > 0.001,
            scientificExplanation: isMilkyWay
              ? "Home Galaxy: We exist inside the Milky Way at the present cosmic observer horizon."
              : Math.abs(galaxy.kinematics.spectroscopicRedshiftZ?.value ?? 0) <= 0.001
                ? `Local Group bound galaxy (${galaxy.distance.distanceKpc.value.toFixed(1)} kpc): Gravitational binding overcomes Hubble expansion. Light takes ${(galaxy.distance.distanceLy.value / 1e6).toFixed(2)} million years to cross the intergalactic space.`
                : `Extragalactic Hubble flow (z = ${galaxy.kinematics.spectroscopicRedshiftZ?.value}): Light was emitted when the Universe was ~${(13.8 - galaxy.distance.derivedLookbackTimeYears / 1e9).toFixed(2)} Gyr old.`,
          }}
          objectName={galaxy.name}
          showTimelineLink={true}
        />

        {/* Detailed Kinematics & Orientation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kinematics */}
          <Card className="bg-slate-900/50 border-white/10 p-6 rounded-2xl space-y-4">
            <h2 className="text-sm font-mono uppercase tracking-wider text-cyan-400 font-semibold border-b border-white/10 pb-2">
              Kinematics & Dynamics
            </h2>
            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Heliocentric Radial Velocity (v_r)</span>
                <span className="font-bold text-white">
                  {galaxy.kinematics.heliocentricRadialVelocityKmS.value > 0 ? "+" : ""}
                  {galaxy.kinematics.heliocentricRadialVelocityKmS.value.toFixed(1)} km/s
                </span>
              </div>
              {galaxy.kinematics.galactocentricRadialVelocityKmS && (
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Galactocentric Radial Velocity</span>
                  <span className="text-cyan-300">
                    {galaxy.kinematics.galactocentricRadialVelocityKmS.value > 0 ? "+" : ""}
                    {galaxy.kinematics.galactocentricRadialVelocityKmS.value.toFixed(1)} km/s
                  </span>
                </div>
              )}
              {galaxy.kinematics.spectroscopicRedshiftZ && (
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Spectroscopic Redshift (z)</span>
                  <span className="text-emerald-400">
                    {galaxy.kinematics.spectroscopicRedshiftZ.value.toFixed(6)}
                  </span>
                </div>
              )}
              {galaxy.kinematics.rotationalVelocityKmS && (
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Circular Rotation Speed (V_rot)</span>
                  <span className="text-white">
                    {galaxy.kinematics.rotationalVelocityKmS.value.toFixed(1)} km/s
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Orientation & Morphology */}
          <Card className="bg-slate-900/50 border-white/10 p-6 rounded-2xl space-y-4">
            <h2 className="text-sm font-mono uppercase tracking-wider text-purple-400 font-semibold border-b border-white/10 pb-2">
              Morphology & Spatial Orientation
            </h2>
            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Inclination Angle (i)</span>
                <span className="font-bold text-white">
                  {galaxy.orientation.inclinationDeg.toFixed(1)}° (0°=face-on, 90°=edge-on)
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Position Angle (PA)</span>
                <span className="text-white">
                  {galaxy.orientation.positionAngleDeg.toFixed(1)}°
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Major / Minor Axes</span>
                <span className="text-white">
                  {galaxy.orientation.majorAxisArcmin.toFixed(1)}′ ×{" "}
                  {galaxy.orientation.minorAxisArcmin.toFixed(1)}′
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Axis Ratio (b/a)</span>
                <span className="text-white">{galaxy.orientation.axisRatio.toFixed(3)}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Known Relationships */}
        {galaxy.relationships && galaxy.relationships.length > 0 && (
          <Card className="bg-slate-900/50 border-white/10 p-6 rounded-2xl space-y-4">
            <h2 className="text-sm font-mono uppercase tracking-wider text-cyan-400 font-semibold border-b border-white/10 pb-2">
              Gravitational Relationships & Interactions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {galaxy.relationships.map((rel, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/60 border border-white/5 p-4 rounded-xl space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/galaxies/${rel.targetGalaxySlug}`}
                      className="font-bold text-cyan-400 hover:underline font-mono text-sm"
                    >
                      {rel.targetGalaxyName} →
                    </Link>
                    <span className="text-[10px] uppercase font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                      {rel.relationshipType.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">{rel.description}</p>
                  {rel.separationKpc && (
                    <span className="text-[11px] font-mono text-slate-400 block pt-1">
                      Separation: {rel.separationKpc} kpc (~
                      {Math.round(rel.separationKpc * 3.262).toLocaleString()} kly)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Provenance Record */}
        <Card className="bg-slate-900/40 border-white/10 p-6 rounded-2xl space-y-2 text-xs">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Scientific Provenance & Catalog References
          </h2>
          <div className="flex flex-wrap items-center justify-between gap-2 text-slate-300 font-mono text-[11px] pt-1">
            <span>Authoritative Body: {galaxy.provenance.authoritativeBody}</span>
            <span>Catalog: {galaxy.provenance.catalogName}</span>
            <span className="text-cyan-400 font-semibold">
              Confidence: {Math.round(galaxy.provenance.confidenceScore * 100)}%
            </span>
          </div>
          {galaxy.provenance.citationUrl && (
            <a
              href={galaxy.provenance.citationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline block truncate font-mono text-[11px] pt-1"
            >
              Primary Citation: {galaxy.provenance.citationUrl}
            </a>
          )}
        </Card>

        {/* Footer CTAs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
          <Link href="/galaxies">
            <Button variant="outline" className="font-mono text-xs">
              ← Return to Galaxy Catalog
            </Button>
          </Link>
          {!isMilkyWay && (
            <Link href={`/galaxies/compare?a=milky-way-galaxy&b=${galaxy.slug}`}>
              <Button variant="default" className="font-mono text-xs">
                Compare with Milky Way ↔
              </Button>
            </Link>
          )}
        </div>
      </Container>
    </main>
  );
}
