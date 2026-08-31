import React from "react";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { PRESET_OBSERVER_LOCATIONS } from "@/domain/observer/types";
import { skyObjectRepo } from "@/lib/data/sky-object-repository";
import { WhereIsObjectCard } from "@/features/sky/components/WhereIsObjectCard";
import { SkyTelemetryPanel } from "@/features/sky/components/SkyTelemetryPanel";
import { starRepository } from "@/lib/data/star-repository";
import { deepSkyRepo } from "@/lib/data/deep-sky-repository";
import { Compass, Telescope, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface WhereIsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const solarSlugs = [
    "sun",
    "moon",
    "mercury",
    "venus",
    "mars",
    "jupiter",
    "saturn",
    "uranus",
    "neptune",
    "pluto",
  ];
  const starSlugs = starRepository.getAll().map((s: { slug: string }) => s.slug);
  const dsoSlugs = deepSkyRepo.getAll().map((d: { slug: string }) => d.slug);

  const uniqueSlugs = Array.from(new Set([...solarSlugs, ...starSlugs, ...dsoSlugs]));
  return uniqueSlugs.map((slug) => ({ slug }));
}

export default async function WhereIsObjectPage({ params }: WhereIsPageProps) {
  const { slug } = await params;
  const defaultLocation = PRESET_OBSERVER_LOCATIONS[0]; // Greenwich reference
  const now = new Date();

  const observation = skyObjectRepo.getSkyObservation(slug, defaultLocation, now);

  if (!observation) {
    notFound();
  }

  return (
    <div className="flex-1 py-8 space-y-6">
      <Container size="xl" className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-celestial-muted/70 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/sky"
                className="text-celestial-subtle hover:text-celestial-cyan transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Compass className="w-6 h-6 text-celestial-cyan" />
              <h1 className="text-2xl font-bold font-mono text-celestial-starlight uppercase">
                Where is {observation.canonicalName} in the Sky?
              </h1>
            </div>
            <p className="text-sm text-celestial-subtle">
              Current horizontal coordinates, heading, altitude, and culmination time
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/sky?target=${observation.objectSlug}`}>
              <Button
                variant="default"
                size="sm"
                className="font-mono text-xs gap-1.5 bg-celestial-cyan text-black hover:bg-celestial-cyan/90"
              >
                <Telescope className="w-3.5 h-3.5" />
                Open Live Sky Map
              </Button>
            </Link>
          </div>
        </div>

        {/* Where Is Card + Side Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-6">
            <WhereIsObjectCard observation={observation} />
          </div>

          <div className="lg:col-span-5 space-y-4">
            <SkyTelemetryPanel observation={observation} />
          </div>
        </div>
      </Container>
    </div>
  );
}
