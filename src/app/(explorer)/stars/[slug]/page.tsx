import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Compass,
  ShieldCheck,
  ExternalLink,
  Weight,
  Orbit,
  ArrowRight,
  Layers,
  Info,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { starRepo } from "@/lib/data/star-repository";
import { stellarSystemRepo } from "@/lib/data/stellar-system-repository";
import { formatScientificMass, formatTemperature } from "@/lib/utils/formatters";
import { LightTravelVsCosmologyBadge } from "@/features/cosmic-time/components/LightTravelVsCosmologyBadge";

interface StarDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: StarDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const star = starRepo.getBySlug(slug);

  if (!star) {
    return {
      title: "Star Not Found — CELESTIAL",
    };
  }

  return {
    title: `${star.canonicalName} (${star.physical.spectralClass || "Star"}) — CELESTIAL Stellar Atlas`,
    description:
      star.summary || `Astrometry, photometry, and physical properties for ${star.canonicalName}.`,
  };
}

export default async function StarDetailPage({ params }: StarDetailPageProps) {
  const { slug } = await params;
  const star = starRepo.getBySlug(slug);

  if (!star) {
    notFound();
  }

  const isSun = star.slug === "sun";
  const hostSystem = star.hostSystemId
    ? stellarSystemRepo.getBySlug(star.hostSystemId) || stellarSystemRepo.getById(star.hostSystemId)
    : null;

  const unc = star.physical.measurementsWithUncertainty;
  const posUnc = star.positional.distanceUncertainty;

  return (
    <div className="flex-1 py-10">
      <Container size="lg" className="space-y-8">
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link href="/stars">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-celestial-subtle hover:text-celestial-starlight"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Stellar Atlas</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            {hostSystem && (
              <Link href={`/systems/${hostSystem.slug}`}>
                <Button variant="secondary" size="sm" className="gap-1.5 font-mono text-xs">
                  <Orbit className="w-3.5 h-3.5" />
                  <span>{hostSystem.name}</span>
                </Button>
              </Link>
            )}
            <Link href="/stars">
              <Button variant="cyan" size="sm" className="gap-2 font-mono text-xs">
                <Compass className="w-4 h-4" />
                <span>3D Neighborhood</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/70 backdrop-blur-xl shadow-subtle-card">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold font-mono tracking-tight text-celestial-starlight">
                {star.canonicalName.toUpperCase()}
              </h1>
              <Badge variant="amber">{star.physical.spectralClass || "STAR"}</Badge>
            </div>
            {star.standardDesignation && (
              <p className="text-sm font-mono text-celestial-subtle">
                Standard Designation: {star.standardDesignation}
                {star.physical.constellation && ` · Constellation: ${star.physical.constellation}`}
              </p>
            )}
            <p className="text-sm text-celestial-starlight/90 max-w-2xl leading-relaxed pt-1">
              {star.summary}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-celestial-deep/80 border border-celestial-muted font-mono text-xs space-y-1.5 shrink-0">
            <div>
              <span className="text-celestial-subtle">Distance (Sun): </span>
              <span className="font-semibold text-celestial-starlight">
                {isSun
                  ? "0.00 ly (Reference Origin)"
                  : `${star.positional.distanceLightYears?.toFixed(2)} ly`}
              </span>
            </div>
            <div>
              <span className="text-celestial-subtle">Apparent Mag (V): </span>
              <span className="font-semibold text-celestial-cyan">
                {star.physical.apparentMagnitudeV !== undefined
                  ? star.physical.apparentMagnitudeV
                  : "—"}
              </span>
            </div>
            <div>
              <span className="text-celestial-subtle">T_eff (Temp): </span>
              <span className="font-semibold text-celestial-amber">
                {formatTemperature(
                  star.physical.effectiveTemperatureK || star.physical.meanTemperatureK
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Kinematic Light-Travel Time Badge */}
        <LightTravelVsCosmologyBadge
          model={{
            timeType: "LIGHT_TRAVEL_TIME",
            distanceMpc: (star.positional.distanceLightYears ?? 0) / 3.26156e6,
            distanceLy: star.positional.distanceLightYears ?? 0,
            lookbackYears: star.positional.distanceLightYears ?? 0,
            lookbackGyr: (star.positional.distanceLightYears ?? 0) / 1e9,
            isCosmological: false,
            scientificExplanation: isSun
              ? "Sun: Reference Origin. Solar photons reach Earth in approximately 8 minutes 20 seconds (1 AU / c)."
              : `Nearby Stellar Neighborhood: Light from ${star.canonicalName} takes ${(star.positional.distanceLightYears ?? 0).toFixed(2)} years to reach Earth across interstellar space. Spacetime expansion is negligible within the gravitationally bound Milky Way.`,
          }}
          objectName={star.canonicalName}
          showTimelineLink={false}
        />

        {/* Known Planetary System Bridge */}
        <Card elevated className="space-y-4">
          <CardHeader className="pb-2 border-b border-celestial-muted/50">
            <CardTitle className="text-lg flex items-center gap-2 text-celestial-cyan font-mono">
              <Orbit className="w-4 h-4" />
              <span>Known Planetary System Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 font-mono text-xs pt-1">
            {hostSystem ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-celestial-cyan/30 bg-celestial-cyan/5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-celestial-starlight">
                      {hostSystem.name}
                    </span>
                    <Badge variant="cyan">{hostSystem.numberOfPlanets} Confirmed Planets</Badge>
                  </div>
                  <p className="text-celestial-subtle text-xs">
                    {hostSystem.summary ||
                      "Confirmed extrasolar planetary system discovered around this host star."}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/systems/${hostSystem.slug}`}>
                    <Button variant="cyan" size="sm" className="gap-1.5 text-xs">
                      <span>View System</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                  <Link href={`/explore?system=${hostSystem.slug}`}>
                    <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                      <Compass className="w-3.5 h-3.5" />
                      <span>3D Orbits</span>
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-celestial-muted/50 bg-celestial-deep/50 space-y-2">
                <div className="flex items-center gap-2 text-celestial-subtle font-semibold text-xs">
                  <Info className="w-4 h-4 text-celestial-amber" />
                  <span>No Confirmed Planetary System in Current Catalog</span>
                </div>
                <p className="text-celestial-subtle text-[11px] leading-relaxed">
                  Scientific Note: Current observational surveys (Gaia DR3 / SIMBAD / Transit /
                  Radial Velocity) have not detected confirmed exoplanets orbiting this star.
                  Non-detection does not preclude the existence of undiscovered planetary bodies.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Two-Column Grid: Astrometry & Physical Properties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Astrometric Parameters */}
          <Card elevated className="space-y-4">
            <CardHeader className="pb-2 border-b border-celestial-muted/50">
              <CardTitle className="text-lg flex items-center gap-2 text-celestial-cyan font-mono">
                <Compass className="w-4 h-4" />
                <span>Astrometric Coordinates (ICRS)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                <span className="text-celestial-subtle">Right Ascension (α):</span>
                <span className="font-semibold text-celestial-starlight">
                  {star.positional.rightAscensionDeg !== undefined
                    ? `${star.positional.rightAscensionDeg.toFixed(5)}°`
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                <span className="text-celestial-subtle">Declination (δ):</span>
                <span className="font-semibold text-celestial-starlight">
                  {star.positional.declinationDeg !== undefined
                    ? `${star.positional.declinationDeg.toFixed(5)}°`
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                <span className="text-celestial-subtle">Trigonometric Parallax (ϖ):</span>
                <span className="font-semibold text-celestial-starlight text-right">
                  {star.positional.parallaxMas !== undefined ? (
                    <>
                      {star.positional.parallaxMas.toFixed(4)} mas
                      {unc?.parallaxMas?.uncertainty && (
                        <span className="text-celestial-subtle text-[10px] block font-normal">
                          ±{unc.parallaxMas.uncertainty.upper} mas
                        </span>
                      )}
                    </>
                  ) : (
                    "—"
                  )}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                <span className="text-celestial-subtle">Distance (Parsecs / Light-Years):</span>
                <span className="font-semibold text-celestial-starlight text-right">
                  {isSun ? (
                    "0.00 pc (Reference Origin)"
                  ) : star.positional.distanceParsecs !== undefined ? (
                    <>
                      {star.positional.distanceParsecs.toFixed(3)} pc (
                      {star.positional.distanceLightYears?.toFixed(2)} ly)
                      {posUnc && (
                        <span className="text-celestial-subtle text-[10px] block font-normal">
                          +{posUnc.upper} / {posUnc.lower} ly
                        </span>
                      )}
                    </>
                  ) : (
                    "—"
                  )}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                <span className="text-celestial-subtle">Proper Motion (μ_α, μ_δ):</span>
                <span className="font-semibold text-celestial-starlight">
                  {star.positional.properMotionRaMasYr !== undefined &&
                  star.positional.properMotionDecMasYr !== undefined
                    ? `${star.positional.properMotionRaMasYr.toFixed(1)}, ${star.positional.properMotionDecMasYr.toFixed(1)} mas/yr`
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-celestial-subtle">Radial Velocity (v_r):</span>
                <span className="font-semibold text-celestial-starlight">
                  {star.positional.radialVelocityKmS !== undefined
                    ? `${star.positional.radialVelocityKmS.toFixed(1)} km/s`
                    : "—"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 2. Photometric & Physical Characteristics */}
          <Card elevated className="space-y-4">
            <CardHeader className="pb-2 border-b border-celestial-muted/50">
              <CardTitle className="text-lg flex items-center gap-2 text-celestial-amber font-mono">
                <Weight className="w-4 h-4" />
                <span>Photometry & Physical Properties</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                <span className="text-celestial-subtle">Apparent Magnitude (V):</span>
                <span className="font-semibold text-celestial-starlight">
                  {star.physical.apparentMagnitudeV !== undefined
                    ? star.physical.apparentMagnitudeV
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                <span className="text-celestial-subtle">Absolute Magnitude (M_V):</span>
                <span className="font-semibold text-celestial-starlight">
                  {star.physical.absoluteMagnitudeV !== undefined
                    ? star.physical.absoluteMagnitudeV
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                <span className="text-celestial-subtle">Effective Temperature (T_eff):</span>
                <span className="font-semibold text-celestial-starlight">
                  {formatTemperature(
                    star.physical.effectiveTemperatureK || star.physical.meanTemperatureK
                  )}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                <span className="text-celestial-subtle">Luminosity (L_☉):</span>
                <span className="font-semibold text-celestial-starlight">
                  {star.physical.luminositySolar !== undefined
                    ? `${star.physical.luminositySolar} L☉`
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-celestial-muted/30">
                <span className="text-celestial-subtle">Stellar Mass (M_☉):</span>
                <span className="font-semibold text-celestial-starlight">
                  {star.physical.massSolar !== undefined
                    ? `${star.physical.massSolar} M☉`
                    : formatScientificMass(star.physical.massKg)}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-celestial-subtle">Stellar Radius (R_☉):</span>
                <span className="font-semibold text-celestial-starlight">
                  {star.physical.radiusSolar !== undefined
                    ? `${star.physical.radiusSolar} R☉`
                    : "—"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Multi-Catalog Identifiers */}
        {star.catalogIdentifiers && (
          <Card elevated className="space-y-4">
            <CardHeader className="pb-2 border-b border-celestial-muted/50">
              <CardTitle className="text-base flex items-center gap-2 text-celestial-starlight font-mono">
                <Sparkles className="w-4 h-4 text-celestial-amber" />
                <span>Multi-Catalog Astronomical Identifiers</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs pt-1">
              {star.catalogIdentifiers.gaiaDr3 && (
                <div className="p-2.5 rounded-lg bg-celestial-deep/60 border border-celestial-muted">
                  <span className="text-[10px] text-celestial-subtle block">
                    Gaia DR3 Source ID
                  </span>
                  <span className="font-semibold text-celestial-starlight">
                    {star.catalogIdentifiers.gaiaDr3}
                  </span>
                </div>
              )}
              {star.catalogIdentifiers.hip && (
                <div className="p-2.5 rounded-lg bg-celestial-deep/60 border border-celestial-muted">
                  <span className="text-[10px] text-celestial-subtle block">Hipparcos (HIP)</span>
                  <span className="font-semibold text-celestial-starlight">
                    {star.catalogIdentifiers.hip}
                  </span>
                </div>
              )}
              {star.catalogIdentifiers.hd && (
                <div className="p-2.5 rounded-lg bg-celestial-deep/60 border border-celestial-muted">
                  <span className="text-[10px] text-celestial-subtle block">Henry Draper (HD)</span>
                  <span className="font-semibold text-celestial-starlight">
                    {star.catalogIdentifiers.hd}
                  </span>
                </div>
              )}
              {star.catalogIdentifiers.gliese && (
                <div className="p-2.5 rounded-lg bg-celestial-deep/60 border border-celestial-muted">
                  <span className="text-[10px] text-celestial-subtle block">Gliese (CNS)</span>
                  <span className="font-semibold text-celestial-starlight">
                    {star.catalogIdentifiers.gliese}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Multiple Star System Relationships */}
        {star.physical.isMultipleStarMember && star.physical.multipleStarSystemSlug && (
          <Card elevated className="space-y-3">
            <CardHeader className="pb-2 border-b border-celestial-muted/50">
              <CardTitle className="text-base flex items-center gap-2 text-celestial-violet font-mono">
                <Layers className="w-4 h-4" />
                <span>Multiple Star System Architecture</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs font-mono text-celestial-subtle">
              <p>
                Member of the gravitationally bound multiple star system{" "}
                <strong>{star.physical.multipleStarSystemSlug.toUpperCase()}</strong>.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Scientific Provenance Citation */}
        <div className="p-6 rounded-2xl border border-celestial-cyan/30 bg-celestial-cyan/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-celestial-cyan font-mono font-semibold text-sm">
              <ShieldCheck className="w-5 h-5" />
              <span>Astrometric Data Provenance & Verification</span>
            </div>
            <Badge variant="cyan">
              Confidence: {(star.provenance.confidenceScore * 100).toFixed(1)}%
            </Badge>
          </div>
          <div className="text-xs text-celestial-subtle space-y-1">
            <p>
              Authoritative Source:{" "}
              <strong className="text-celestial-starlight">{star.provenance.catalogName}</strong> (
              {star.provenance.authoritativeBody})
            </p>
            <p className="font-mono text-[11px]">
              Record Identifier: {star.provenance.recordIdentifier} | Reference Epoch: J2016.5
              (ICRS)
            </p>
          </div>
          {star.provenance.citationUrl && (
            <div className="pt-1">
              <a
                href={star.provenance.citationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-celestial-cyan hover:underline font-mono"
              >
                <span>View Authoritative Parameters in ESA Gaia Archive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
