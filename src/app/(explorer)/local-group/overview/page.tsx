import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { YouAreHereIndicator } from "@/features/galactic/components/YouAreHereIndicator";

export const metadata = {
  title: "Local Group Scientific Overview | CELESTIAL",
  description:
    "Scientific overview of the Local Group of galaxies: gravitational dynamics, virial mass, subgroups, and the Milky Way–Andromeda collision.",
};

export default function LocalGroupOverviewPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-10">
      <Container size="lg" className="space-y-8">
        {/* Header */}
        <div className="space-y-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-2">
            <Link
              href="/local-group"
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition"
            >
              ← Back to Local Group Explorer
            </Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold block">
                EXTRAGALACTIC ATLAS · SCIENTIFIC OVERVIEW
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
                The Local Group of Galaxies
              </h1>
            </div>
            <YouAreHereIndicator currentStage="LOCAL_GROUP" />
          </div>
        </div>

        {/* Narrative & Scientific Sections */}
        <div className="prose prose-invert max-w-none space-y-8 text-slate-300 leading-relaxed text-sm sm:text-base">
          {/* Section 1: Overview */}
          <section className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-mono">
              <span className="text-cyan-400">01.</span> Gravitational Architecture & Scale
            </h2>
            <p>
              The <strong>Local Group</strong> is the gravitationally bound galaxy group that
              encompasses our home galaxy, the <strong>Milky Way</strong>, the massive{" "}
              <strong>Andromeda Galaxy (M31)</strong>, the smaller spiral{" "}
              <strong>Triangulum Galaxy (M33)</strong>, and more than 80 confirmed dwarf and
              satellite galaxies spanning a diameter of approximately{" "}
              <strong>3 Megaparsecs (10 million light-years)</strong>.
            </p>
            <p>
              Unlike the broader expanding Universe where the cosmic Hubble flow causes galaxies to
              recede from one another, the mutual gravitational attraction among Local Group members
              overcomes the cosmic expansion rate. Consequently, member galaxies exhibit peculiar
              orbital motions around the collective barycenter.
            </p>
          </section>

          {/* Section 2: Subgroup Breakdown */}
          <section className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-mono">
              <span className="text-cyan-400">02.</span> Primary Subgroups
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
              <div className="bg-slate-950/60 border border-white/5 p-4 rounded-xl space-y-2">
                <h3 className="text-sm font-bold text-amber-400 font-mono">
                  A. Milky Way Subgroup
                </h3>
                <p className="text-xs text-slate-300">
                  Dominated by the Milky Way ($M \approx 1.15 \times 10^{12} M_\odot$). Its primary
                  satellites include the Large Magellanic Cloud (LMC), Small Magellanic Cloud (SMC),
                  Sagittarius dSph, and over 50 ultra-faint dwarf spheroidal galaxies.
                </p>
              </div>
              <div className="bg-slate-950/60 border border-white/5 p-4 rounded-xl space-y-2">
                <h3 className="text-sm font-bold text-purple-400 font-mono">
                  B. Andromeda Subgroup
                </h3>
                <p className="text-xs text-slate-300">
                  Dominated by the Andromeda Galaxy ($M \approx 1.5 \times 10^{12} M_\odot$).
                  Includes major companions M32, M110, NGC 185, NGC 147, and the Triangulum Galaxy
                  (M33).
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Milky Way – Andromeda Interaction */}
          <section className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-mono">
              <span className="text-cyan-400">03.</span> Milky Way ↔ Andromeda Future Encounter
            </h2>
            <p>
              High-precision astrometric measurements from the Hubble Space Telescope and Gaia
              indicate that Andromeda is approaching the Milky Way at a radial speed of
              approximately <strong>110 km/s</strong> (blueshift $z = -0.001001$).
            </p>
            <p>
              In approximately <strong>4.5 billion years</strong>, the two giant stellar disks will
              undergo a direct gravitational collision and tidal interaction, culminating in the
              coalescence of both galaxies into a giant elliptical galaxy often referred to as{" "}
              <em>"Milkomeda"</em>.
            </p>
          </section>

          {/* Section 4: Physical Metrics Table */}
          <section className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-mono">
              <span className="text-cyan-400">04.</span> Group Dynamics & Mass Budget
            </h2>
            <div className="overflow-x-auto not-prose">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="py-2.5 px-3">Parameter</th>
                    <th className="py-2.5 px-3">Scientific Value</th>
                    <th className="py-2.5 px-3">Primary Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  <tr>
                    <td className="py-2 px-3 text-slate-400">Total Virial Mass (M_vir)</td>
                    <td className="py-2 px-3 text-cyan-400 font-semibold">(2.5 ± 0.4) × 10¹² M☉</td>
                    <td className="py-2 px-3 text-slate-500">van der Marel et al. (2012)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-slate-400">Milky Way–Andromeda Distance</td>
                    <td className="py-2 px-3 text-cyan-400 font-semibold">
                      778 ± 17 kpc (~2.54 Mly)
                    </td>
                    <td className="py-2 px-3 text-slate-500">Riess et al. (2012) / TRGB</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-slate-400">Milky Way–Andromeda Approach Speed</td>
                    <td className="py-2 px-3 text-cyan-400 font-semibold">110 ± 4 km/s</td>
                    <td className="py-2 px-3 text-slate-500">
                      HST Proper Motions / Sohn et al. (2012)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-slate-400">Local Group Zero-Velocity Radius</td>
                    <td className="py-2 px-3 text-cyan-400 font-semibold">0.96 ± 0.03 Mpc</td>
                    <td className="py-2 px-3 text-slate-500">Karachentsev et al. (2009)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Footer CTAs */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <Link href="/local-group">
            <Button variant="default" className="font-mono text-xs">
              Explore 3D Local Group Space →
            </Button>
          </Link>
          <Link href="/galaxies">
            <Button variant="outline" className="font-mono text-xs">
              Browse Galaxy Catalog →
            </Button>
          </Link>
        </div>
      </Container>
    </main>
  );
}
