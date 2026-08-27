import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Compass,
  ShieldCheck,
  ExternalLink,
  Layers,
  Orbit,
  ArrowRight,
  Info,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { stellarSystemRepo } from "@/lib/data/stellar-system-repository";
import { formatScientificMass, formatDistance } from "@/lib/utils/formatters";

interface SystemDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: SystemDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const system = stellarSystemRepo.getBySlug(slug);

  if (!system) {
    return {
      title: "Stellar System Not Found — CELESTIAL",
    };
  }

  return {
    title: `${system.name} (${system.spectralTypeSummary || "Star System"}) — CELESTIAL Atlas`,
    description:
      system.summary || `Scientific parameters, exoplanets, and habitable zone for ${system.name}.`,
  };
}

export default async function SystemDetailPage({ params }: SystemDetailPageProps) {
  const { slug } = await params;
  const system = stellarSystemRepo.getBySlug(slug);

  if (!system) {
    notFound();
  }

  const hostStars = stellarSystemRepo.getHostStars(system.id);
  const planets = stellarSystemRepo.getPlanets(system.id);

  return (
    <div className="flex-1 py-10">
      <Container size="lg" className="space-y-8">
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link href="/systems">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-celestial-subtle hover:text-celestial-starlight"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Systems Atlas</span>
            </Button>
          </Link>
          <Link href={`/explore?system=${system.slug}`}>
            <Button variant="cyan" size="sm" className="gap-2 font-mono">
              <Compass className="w-4 h-4" />
              <span>Explore in 3D</span>
            </Button>
          </Link>
        </div>

        {/* System Hero Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/70 backdrop-blur-xl shadow-subtle-card">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold font-mono tracking-tight text-celestial-starlight">
                {system.name.toUpperCase()}
              </h1>
              <Badge variant="cyan">{system.architecture.replace(/_/g, " ")}</Badge>
            </div>
            {system.spectralTypeSummary && (
              <p className="text-sm font-mono text-celestial-subtle">
                Spectral Classification: {system.spectralTypeSummary}
              </p>
            )}
            <p className="text-sm text-celestial-starlight/90 max-w-2xl leading-relaxed pt-1">
              {system.summary}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-celestial-deep/80 border border-celestial-muted font-mono text-xs space-y-1.5 shrink-0">
            <div>
              <span className="text-celestial-subtle">Distance (Earth): </span>
              <span className="font-semibold text-celestial-starlight">
                {system.distanceLightYears === 0
                  ? "0 ly (Solar System)"
                  : `${system.distanceLightYears} ly`}
              </span>
            </div>
            <div>
              <span className="text-celestial-subtle">Confirmed Planets: </span>
              <span className="font-semibold text-celestial-cyan">{system.numberOfPlanets}</span>
            </div>
            {system.discoveryFacility && (
              <div>
                <span className="text-celestial-subtle">Facility: </span>
                <span className="text-celestial-starlight">{system.discoveryFacility}</span>
              </div>
            )}
          </div>
        </div>

        {/* Host Stars */}
        <Card elevated className="space-y-4">
          <CardHeader className="pb-2 border-b border-celestial-muted/50">
            <CardTitle className="text-lg flex items-center gap-2 text-celestial-amber font-mono">
              <Sparkles className="w-4 h-4" />
              <span>Host Stars ({hostStars.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {hostStars.map((star) => (
              <div
                key={star.id}
                className="p-4 rounded-xl border border-celestial-muted/60 bg-celestial-deep/50 space-y-2 font-mono text-xs"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-celestial-starlight">
                    {star.canonicalName}
                  </h3>
                  <Badge variant="amber">{star.physical.spectralClass || "STAR"}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] text-celestial-subtle pt-1">
                  <div>
                    <span>Mass: </span>
                    <span className="text-celestial-starlight font-semibold">
                      {star.physical.massSolar
                        ? `${star.physical.massSolar} M☉`
                        : formatScientificMass(star.physical.massKg)}
                    </span>
                  </div>
                  <div>
                    <span>Radius: </span>
                    <span className="text-celestial-starlight font-semibold">
                      {star.physical.radiusSolar
                        ? `${star.physical.radiusSolar} R☉`
                        : `${star.physical.meanRadiusKm} km`}
                    </span>
                  </div>
                  <div>
                    <span>T_eff: </span>
                    <span className="text-celestial-starlight font-semibold">
                      {star.physical.effectiveTemperatureK || star.physical.meanTemperatureK} K
                    </span>
                  </div>
                  <div>
                    <span>Luminosity: </span>
                    <span className="text-celestial-starlight font-semibold">
                      {star.physical.luminositySolar ? `${star.physical.luminositySolar} L☉` : "—"}
                    </span>
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <Link
                    href={`/objects/${star.slug}`}
                    className="inline-flex items-center gap-1 text-celestial-cyan hover:underline text-xs"
                  >
                    <span>Star Profile</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Confirmed Planetary System Table */}
        <Card elevated className="space-y-4">
          <CardHeader className="pb-2 border-b border-celestial-muted/50">
            <CardTitle className="text-lg flex items-center gap-2 text-celestial-cyan font-mono">
              <Orbit className="w-4 h-4" />
              <span>Confirmed Planetary Bodies ({planets.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-celestial-muted/60 text-celestial-subtle text-[11px]">
                    <th className="py-2.5 px-3">Planet Name</th>
                    <th className="py-2.5 px-3">Classification</th>
                    <th className="py-2.5 px-3">Semi-Major Axis</th>
                    <th className="py-2.5 px-3">Period</th>
                    <th className="py-2.5 px-3">Mass</th>
                    <th className="py-2.5 px-3">Radius</th>
                    <th className="py-2.5 px-3">Habitable Zone</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-celestial-muted/30">
                  {planets.map((planet) => {
                    const sma = planet.orbital?.semiMajorAxisAu;
                    const hz = system.habitableZone;
                    const inConservativeHz =
                      hz && sma && sma >= hz.conservativeInnerAu && sma <= hz.conservativeOuterAu;
                    const inOptimisticHz =
                      hz && sma && sma >= hz.optimisticInnerAu && sma <= hz.optimisticOuterAu;

                    return (
                      <tr key={planet.id} className="hover:bg-celestial-muted/20 transition-colors">
                        <td className="py-3 px-3 font-bold text-celestial-starlight">
                          {planet.canonicalName}
                        </td>
                        <td className="py-3 px-3">
                          <Badge variant="outline" className="text-[10px]">
                            {planet.classification.code.replace(/_/g, " ")}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 text-celestial-starlight">
                          {formatDistance(undefined, undefined, planet.orbital?.semiMajorAxisAu)}
                        </td>
                        <td className="py-3 px-3 text-celestial-starlight">
                          {planet.orbital?.orbitalPeriodDays
                            ? `${planet.orbital.orbitalPeriodDays.toFixed(2)} d`
                            : "—"}
                        </td>
                        <td className="py-3 px-3 text-celestial-starlight">
                          {planet.physical.massEarth
                            ? `${planet.physical.massEarth} M⊕`
                            : planet.physical.massJupiter
                              ? `${planet.physical.massJupiter} M_J`
                              : "—"}
                        </td>
                        <td className="py-3 px-3 text-celestial-starlight">
                          {planet.physical.radiusEarth
                            ? `${planet.physical.radiusEarth} R⊕`
                            : planet.physical.radiusJupiter
                              ? `${planet.physical.radiusJupiter} R_J`
                              : planet.physical.meanRadiusKm
                                ? `${planet.physical.meanRadiusKm.toLocaleString()} km`
                                : "—"}
                        </td>
                        <td className="py-3 px-3">
                          {inConservativeHz ? (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-celestial-cyan/20 text-celestial-cyan font-semibold">
                              Conservative HZ
                            </span>
                          ) : inOptimisticHz ? (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-sky-500/20 text-sky-400">
                              Optimistic HZ
                            </span>
                          ) : (
                            <span className="text-celestial-subtle text-[11px]">—</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <Link href={`/objects/${planet.slug}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-celestial-cyan text-xs"
                            >
                              <span>Profile</span>
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Circumstellar Habitable Zone Model */}
        {system.habitableZone && (
          <Card elevated className="space-y-4">
            <CardHeader className="pb-2 border-b border-celestial-muted/50">
              <CardTitle className="text-lg flex items-center gap-2 text-celestial-cyan font-mono">
                <Compass className="w-4 h-4" />
                <span>Circumstellar Habitable Zone (Kopparapu et al. Model)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-lg bg-celestial-deep/50 border border-celestial-muted/50">
                <div>
                  <span className="text-celestial-subtle block text-[11px]">
                    Conservative Habitable Zone:
                  </span>
                  <span className="text-celestial-cyan font-bold text-sm">
                    {system.habitableZone.conservativeInnerAu} AU –{" "}
                    {system.habitableZone.conservativeOuterAu} AU
                  </span>
                  <span className="text-[10px] text-celestial-subtle block">
                    Moist Greenhouse to Maximum Greenhouse limits
                  </span>
                </div>
                <div>
                  <span className="text-celestial-subtle block text-[11px]">
                    Optimistic Habitable Zone:
                  </span>
                  <span className="text-celestial-starlight font-bold text-sm">
                    {system.habitableZone.optimisticInnerAu} AU –{" "}
                    {system.habitableZone.optimisticOuterAu} AU
                  </span>
                  <span className="text-[10px] text-celestial-subtle block">
                    Recent Venus to Early Mars limits
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-celestial-subtle pt-1">
                <Info className="w-3.5 h-3.5 text-celestial-amber" />
                <span>
                  Scientific Note: Residence within the modeled Habitable Zone indicates potential
                  for liquid water under standard planetary atmospheres, not confirmed biological
                  habitability.
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Multi-Star Barycentric Modeling (if present) */}
        {system.barycentricModel && (
          <Card elevated className="space-y-3">
            <CardHeader className="pb-2 border-b border-celestial-muted/50">
              <CardTitle className="text-lg flex items-center gap-2 text-celestial-violet font-mono">
                <Layers className="w-4 h-4" />
                <span>{system.barycentricModel.barycenterName || "Barycentric Architecture"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs font-mono text-celestial-subtle">
              <p>{system.barycentricModel.approximationDescription}</p>
              <div className="flex flex-wrap gap-3 pt-2">
                {system.barycentricModel.centralStars.map((star) => (
                  <div
                    key={star.starId}
                    className="p-2.5 rounded-lg bg-celestial-deep border border-celestial-muted text-celestial-starlight"
                  >
                    <span className="font-bold">{star.starName}</span>: {star.massSolar} M☉ |
                    Semi-major Axis: {star.semiMajorAxisAu} AU | Period: {star.orbitalPeriodYears}{" "}
                    yr
                  </div>
                ))}
              </div>
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
              Confidence: {(system.provenance.confidenceScore * 100).toFixed(1)}%
            </Badge>
          </div>
          <div className="text-xs text-celestial-subtle space-y-1">
            <p>
              Authoritative Source:{" "}
              <strong className="text-celestial-starlight">{system.provenance.catalogName}</strong>{" "}
              ({system.provenance.authoritativeBody})
            </p>
            <p className="font-mono text-[11px]">
              Record Identifier: {system.provenance.recordIdentifier} | Ephemeris Model:{" "}
              {system.provenance.catalogVersion || "PS_2026"}
            </p>
          </div>
          {system.provenance.citationUrl && (
            <div className="pt-1">
              <a
                href={system.provenance.citationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-celestial-cyan hover:underline font-mono"
              >
                <span>View Authoritative Parameters at NASA Exoplanet Archive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
