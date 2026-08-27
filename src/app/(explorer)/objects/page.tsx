import { Metadata } from "next";
import Link from "next/link";
import { Orbit, Compass, ArrowRight, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { celestialRepo } from "@/lib/data/celestial-repository";
import { formatScientificMass, formatDistance } from "@/lib/utils/formatters";

export const metadata: Metadata = {
  title: "Solar System Atlas — CELESTIAL",
  description:
    "Scientific atlas of the Sun, planets, and moons with authoritative NASA JPL physical and orbital parameters.",
};

export default function ObjectsPage() {
  const objects = celestialRepo.getAll();

  return (
    <div className="flex-1 py-10">
      <Container size="xl" className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-celestial-muted/70 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <Orbit className="w-6 h-6 text-celestial-amber" />
              <h1 className="text-3xl font-bold font-mono text-celestial-starlight uppercase">
                Solar System Atlas
              </h1>
            </div>
            <p className="text-sm text-celestial-subtle">
              Authoritative catalog of primary Solar System bodies (NASA JPL SSD ephemerides)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="amber">{objects.length} BODIES INGESTED</Badge>
            <Link href="/explore">
              <Button variant="cyan" size="sm" className="gap-2">
                <Compass className="w-4 h-4" />
                <span>3D Explorer</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Objects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {objects.map((obj) => {
            const isStar = obj.classification.code === "STAR";
            const badgeVariant =
              obj.classification.category === "PLANETARY"
                ? "cyan"
                : obj.classification.category === "STELLAR"
                  ? "amber"
                  : "violet";

            return (
              <Card
                key={obj.id}
                elevated
                className="group hover:border-celestial-cyan/50 transition-all flex flex-col justify-between"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl group-hover:text-celestial-cyan transition-colors">
                        {obj.canonicalName}
                      </CardTitle>
                      {obj.standardDesignation && (
                        <p className="text-xs font-mono text-celestial-subtle mt-0.5">
                          {obj.standardDesignation}
                        </p>
                      )}
                    </div>
                    <Badge variant={badgeVariant}>
                      {obj.classification.code.replace(/_/g, " ")}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-celestial-subtle line-clamp-2 leading-relaxed">
                    {obj.summary}
                  </p>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-celestial-deep/70 border border-celestial-muted/50 font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-celestial-subtle block">Mass</span>
                      <span className="font-semibold text-celestial-starlight">
                        {formatScientificMass(obj.physical.massKg)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-celestial-subtle block">Radius</span>
                      <span className="font-semibold text-celestial-starlight">
                        {obj.physical.meanRadiusKm?.toLocaleString()} km
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-celestial-subtle block">
                        {isStar ? "Surface Temp" : "Distance (Sun)"}
                      </span>
                      <span className="font-semibold text-celestial-starlight">
                        {isStar
                          ? `${obj.physical.meanTemperatureK} K`
                          : formatDistance(undefined, undefined, obj.positional.distanceAu)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-celestial-subtle block">Gravity</span>
                      <span className="font-semibold text-celestial-starlight">
                        {obj.physical.surfaceGravityMs2} m/s²
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-celestial-muted/40 text-xs">
                    <div className="flex items-center gap-1 text-[11px] text-celestial-subtle">
                      <ShieldCheck className="w-3.5 h-3.5 text-celestial-cyan" />
                      <span>{obj.provenance.authoritativeBody} Provenance</span>
                    </div>
                    <Link
                      href={`/objects/${obj.slug}`}
                      className="inline-flex items-center gap-1 text-celestial-cyan hover:underline font-mono text-xs"
                    >
                      <span>Profile</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
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
