import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Globe } from "lucide-react";
import { Container } from "@/components/ui/container";
import { observableUniverseRepo } from "@/lib/data/observable-universe-repository";
import { ObservableTelemetryPanel } from "@/features/observable-universe/components/ObservableTelemetryPanel";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const landmarks = observableUniverseRepo.getAllLandmarks();
  return landmarks.map((l) => ({ slug: l.slug }));
}

export default async function LandmarkProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const landmark = observableUniverseRepo.getLandmarkBySlug(slug);

  if (!landmark) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 font-sans">
      {/* Header Bar */}
      <section className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <Container
          size="xl"
          className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-1">
              <Globe className="w-3.5 h-3.5" />
              <span>Observational Landmark • {landmark.category}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-mono font-bold tracking-tight text-white flex items-center gap-2.5">
              {landmark.name}
            </h1>
            <p className="text-xs md:text-sm text-slate-400 font-mono mt-0.5">
              Redshift z = {landmark.redshiftZ.toFixed(3)} • Comoving Distance:{" "}
              {landmark.comovingDistanceGly.toFixed(2)} Gly (
              {landmark.comovingDistanceMpc.toFixed(1)} Mpc)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/observable-universe"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-800 text-xs font-mono transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Landmarks</span>
            </Link>
          </div>
        </Container>
      </section>

      {/* Main Content Workspace */}
      <Container size="xl" className="py-8 flex flex-col gap-6 flex-1 max-w-4xl">
        {/* Telemetry Dossier Panel */}
        <ObservableTelemetryPanel landmark={landmark} />

        {/* Detailed FLRW Distance Breakdown Card */}
        <div className="flex flex-col gap-3 p-5 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs text-slate-300 backdrop-blur-md">
          <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
            Cosmological Distance Measures (ΛCDM FLRW Metric)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-[10px] text-slate-500 block uppercase">
                1. Comoving Distance (D_C)
              </span>
              <span className="text-slate-100 font-bold text-sm">
                {landmark.comovingDistanceGly.toFixed(2)} Gly (
                {landmark.comovingDistanceMpc.toFixed(1)} Mpc)
              </span>
              <p className="text-[10px] text-slate-400 mt-1">
                Distance factoring out the cosmic expansion since emission.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-[10px] text-slate-500 block uppercase">
                2. Proper Distance at Emission (D_proper)
              </span>
              <span className="text-purple-300 font-bold text-sm">
                {landmark.properDistanceEmissionMpc < 1.0
                  ? `${(landmark.properDistanceEmissionMpc * 1000).toFixed(0)} kpc`
                  : `${landmark.properDistanceEmissionMpc.toFixed(1)} Mpc`}
              </span>
              <p className="text-[10px] text-slate-400 mt-1">
                Actual physical distance when the observed photons were emitted: D_proper = a(z) ·
                D_C.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-[10px] text-slate-500 block uppercase">
                3. Angular Diameter Distance (D_A)
              </span>
              <span className="text-emerald-300 font-bold text-sm">
                {landmark.angularDiameterDistanceMpc < 1.0
                  ? `${(landmark.angularDiameterDistanceMpc * 1000).toFixed(0)} kpc`
                  : `${landmark.angularDiameterDistanceMpc.toFixed(1)} Mpc`}
              </span>
              <p className="text-[10px] text-slate-400 mt-1">
                Distance used to calculate transverse physical size from observed angular diameter.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60">
              <span className="text-[10px] text-slate-500 block uppercase">
                4. Luminosity Distance (D_L)
              </span>
              <span className="text-amber-300 font-bold text-sm">
                {landmark.luminosityDistanceMpc > 1000
                  ? `${(landmark.luminosityDistanceMpc / 1000).toFixed(2)} Gpc`
                  : `${landmark.luminosityDistanceMpc.toFixed(1)} Mpc`}
              </span>
              <p className="text-[10px] text-slate-400 mt-1">
                Distance used for flux/apparent magnitude dimming: D_L = (1+z)² · D_A.
              </p>
            </div>
          </div>
        </div>

        {/* Cross-Scale Navigation Bridges */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800 font-mono text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4 text-purple-400" />
            <span>Connect this observation to Cosmic Time Machine:</span>
          </div>

          <Link
            href="/cosmic-time"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
          >
            <span>Cosmic Time Machine</span>
          </Link>
        </div>
      </Container>
    </div>
  );
}
