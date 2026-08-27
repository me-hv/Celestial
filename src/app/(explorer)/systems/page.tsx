import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Compass, ArrowRight, ShieldCheck, Orbit } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { stellarSystemRepo } from "@/lib/data/stellar-system-repository";

export const metadata: Metadata = {
  title: "Stellar Systems Atlas — CELESTIAL",
  description:
    "Explore confirmed exoplanetary systems, binary stars, and compact multi-planet systems from NASA Exoplanet Archive.",
};

export default function SystemsPage() {
  const systems = stellarSystemRepo.getAll();

  return (
    <div className="flex-1 py-10">
      <Container size="xl" className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-celestial-muted/70 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-celestial-cyan" />
              <h1 className="text-3xl font-bold font-mono text-celestial-starlight uppercase">
                Stellar Systems Atlas
              </h1>
            </div>
            <p className="text-sm text-celestial-subtle">
              Catalog of confirmed planetary systems, binary stars, and exoplanet hosts (NASA
              Exoplanet Archive)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="cyan">{systems.length} SYSTEMS INDEXED</Badge>
            <Link href="/explore">
              <Button variant="cyan" size="sm" className="gap-2">
                <Compass className="w-4 h-4" />
                <span>3D Explorer</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Systems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {systems.map((sys) => {
            return (
              <Card
                key={sys.id}
                elevated
                className="group hover:border-celestial-cyan/50 transition-all flex flex-col justify-between"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl group-hover:text-celestial-cyan transition-colors">
                        {sys.name}
                      </CardTitle>
                      {sys.spectralTypeSummary && (
                        <p className="text-xs font-mono text-celestial-subtle mt-0.5">
                          {sys.spectralTypeSummary}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className="text-[11px] font-mono">
                      {sys.architecture.replace(/_/g, " ")}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-celestial-subtle line-clamp-2 leading-relaxed">
                    {sys.summary}
                  </p>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-celestial-deep/70 border border-celestial-muted/50 font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-celestial-subtle block">Planets</span>
                      <span className="font-semibold text-celestial-starlight">
                        {sys.numberOfPlanets} Confirmed
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-celestial-subtle block">Stars</span>
                      <span className="font-semibold text-celestial-starlight">
                        {sys.numberOfStars}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-celestial-subtle block">
                        Distance (Earth)
                      </span>
                      <span className="font-semibold text-celestial-starlight">
                        {sys.distanceLightYears !== undefined
                          ? sys.distanceLightYears === 0
                            ? "0 ly (Home)"
                            : `${sys.distanceLightYears.toLocaleString()} ly`
                          : "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-celestial-subtle block">
                        Habitable Zone
                      </span>
                      <span className="font-semibold text-celestial-cyan">
                        {sys.habitableZone
                          ? `${sys.habitableZone.conservativeInnerAu}–${sys.habitableZone.conservativeOuterAu} AU`
                          : "—"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-celestial-muted/40 text-xs">
                    <div className="flex items-center gap-1 text-[11px] text-celestial-subtle">
                      <ShieldCheck className="w-3.5 h-3.5 text-celestial-cyan" />
                      <span>{sys.provenance.authoritativeBody} Provenance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/explore?system=${sys.slug}`}
                        className="inline-flex items-center gap-1 text-celestial-amber hover:underline font-mono text-xs"
                      >
                        <Orbit className="w-3 h-3" />
                        <span>3D View</span>
                      </Link>
                      <span className="text-celestial-muted">|</span>
                      <Link
                        href={`/systems/${sys.slug}`}
                        className="inline-flex items-center gap-1 text-celestial-cyan hover:underline font-mono text-xs"
                      >
                        <span>Profile</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
