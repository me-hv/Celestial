"use client";

import React from "react";
import Link from "next/link";
import { Eye, ArrowLeft, BookOpen } from "lucide-react";
import { Container } from "@/components/ui/container";
import { observableUniverseRepo } from "@/lib/data/observable-universe-repository";
import { HorizonComparisonCard } from "@/features/observable-universe/components/HorizonComparisonCard";

export default function CosmicHorizonsPage() {
  const horizons = observableUniverseRepo.getAllHorizons();

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <section className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <Container
          size="xl"
          className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-rose-400 font-bold uppercase tracking-wider mb-1">
              <Eye className="w-3.5 h-3.5" />
              <span>Cosmological Boundaries &amp; Horizons</span>
            </div>
            <h1 className="text-xl md:text-2xl font-mono font-bold tracking-tight text-white flex items-center gap-2.5">
              Cosmic Horizons Guide
            </h1>
            <p className="text-xs md:text-sm text-slate-400 font-mono mt-0.5">
              Understanding Particle Horizon, Hubble Sphere, Cosmological Event Horizon, and
              Light-Travel Limits
            </p>
          </div>

          <Link
            href="/observable-universe"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-800 text-xs font-mono transition-colors self-start md:self-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Observable Universe</span>
          </Link>
        </Container>
      </section>

      {/* Main Content */}
      <Container size="xl" className="py-6 flex flex-col gap-6 flex-1 max-w-5xl">
        {/* Horizon Comparison Component */}
        <HorizonComparisonCard horizons={horizons} />

        {/* Mathematical Formulations Section */}
        <div className="flex flex-col gap-4 p-5 rounded-xl bg-slate-900/60 border border-slate-800 font-mono text-xs text-slate-300">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
            <BookOpen className="w-4 h-4" />
            <span>Mathematical Foundations in FLRW Spacetime</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60 flex flex-col gap-1.5">
              <span className="font-bold text-rose-400">
                1. Particle Horizon (Observable Radius)
              </span>
              <code className="p-2 rounded bg-slate-900 text-cyan-300 text-[11px] block">
                {"χ_p = D_H ∫_0^∞ dz / E(z) ≈ 14,250 Mpc (~46.5 Gly)"}
              </code>
              <p className="text-[11px] text-slate-400">
                The maximum distance from which particles could have traveled to the observer in the
                age of the Universe.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60 flex flex-col gap-1.5">
              <span className="font-bold text-cyan-400">2. Hubble Radius (Hubble Sphere)</span>
              <code className="p-2 rounded bg-slate-900 text-cyan-300 text-[11px] block">
                {"R_H = c / H_0 ≈ 4,283 Mpc (~14.0 Gly)"}
              </code>
              <p className="text-[11px] text-slate-400">
                The distance where the recession velocity due to the Hubble flow reaches the speed
                of light (v = c).
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60 flex flex-col gap-1.5">
              <span className="font-bold text-purple-400">3. Cosmological Event Horizon</span>
              <code className="p-2 rounded bg-slate-900 text-cyan-300 text-[11px] block">
                {"χ_e = D_H ∫_0^1 da / [a² E(1/a - 1)] ≈ 5,200 Mpc (~17.0 Gly)"}
              </code>
              <p className="text-[11px] text-slate-400">
                The greatest comoving distance from which light emitted today will ever be able to
                reach the observer in the infinite future.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60 flex flex-col gap-1.5">
              <span className="font-bold text-orange-400">4. CMB Last-Scattering Distance</span>
              <code className="p-2 rounded bg-slate-900 text-cyan-300 text-[11px] block">
                {"D_C(z=1089) = D_H ∫_0^1089 dz / E(z) ≈ 14,000 Mpc (~45.7 Gly)"}
              </code>
              <p className="text-[11px] text-slate-400">
                The present comoving distance to the epoch where photons decoupled from baryonic
                matter 379,000 years after the Big Bang.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
