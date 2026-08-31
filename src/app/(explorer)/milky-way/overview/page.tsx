import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Compass, Globe, ShieldCheck, Layers, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { YouAreHereIndicator } from "@/features/galactic/components/YouAreHereIndicator";

export const metadata: Metadata = {
  title: "Milky Way Galaxy Scientific Overview — CELESTIAL",
  description:
    "Scientific overview of the Milky Way galaxy: barred spiral structure, Galactocentric coordinates, Solar position, and multi-component morphology.",
};

export default function MilkyWayOverviewPage() {
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
                <span>3D Galaxy View</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* You Are Here Indicator */}
        <YouAreHereIndicator currentStage="MILKY_WAY" />

        {/* Hero Header */}
        <div className="p-8 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/70 backdrop-blur-xl shadow-subtle-card space-y-3">
          <div className="flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-celestial-cyan" />
            <h1 className="text-4xl font-bold font-mono tracking-tight text-celestial-starlight">
              THE MILKY WAY GALAXY
            </h1>
            <Badge variant="cyan">SB(rs)bc</Badge>
          </div>
          <p className="text-sm text-celestial-starlight/90 max-w-3xl leading-relaxed">
            The Milky Way is a barred spiral galaxy with a total mass of roughly 1.15 × 10^12 solar
            masses (including dark matter) and an optical stellar disk spanning approximately
            100,000 light-years in diameter. Our Solar System resides on the inner edge of the Orion
            Spur at a distance of 8,178 parsecs (26,670 light-years) from the Galactic Center.
          </p>
        </div>

        {/* Primary Parameter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card elevated className="p-4 space-y-1 font-mono">
            <span className="text-[10px] text-celestial-subtle block">Galactic Classification</span>
            <span className="text-base font-bold text-celestial-starlight">
              Barred Spiral SB(rs)bc
            </span>
            <p className="text-[10px] text-celestial-subtle pt-1">
              Central bar with logarithmic spiral arms
            </p>
          </Card>

          <Card elevated className="p-4 space-y-1 font-mono">
            <span className="text-[10px] text-celestial-subtle block">
              Solar Distance to Center (R_0)
            </span>
            <span className="text-base font-bold text-celestial-cyan">8,178 ± 26 pc</span>
            <p className="text-[10px] text-celestial-subtle pt-1">
              26,670 ly (GRAVITY Collaboration 2019)
            </p>
          </Card>

          <Card elevated className="p-4 space-y-1 font-mono">
            <span className="text-[10px] text-celestial-subtle block">Solar Height (z_0)</span>
            <span className="text-base font-bold text-celestial-starlight">+20.8 ± 0.3 pc</span>
            <p className="text-[10px] text-celestial-subtle pt-1">
              North of the true Galactic Midplane
            </p>
          </Card>

          <Card elevated className="p-4 space-y-1 font-mono">
            <span className="text-[10px] text-celestial-subtle block">
              Galactic Year (Orbit Period)
            </span>
            <span className="text-base font-bold text-celestial-violet">~225 — 250 Myr</span>
            <p className="text-[10px] text-celestial-subtle pt-1">
              Circular rotation velocity ~234 km/s
            </p>
          </Card>
        </div>

        {/* Structural Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Thin & Thick Disk */}
          <Card elevated className="space-y-4">
            <CardHeader className="pb-2 border-b border-celestial-muted/50">
              <CardTitle className="text-lg flex items-center gap-2 text-celestial-cyan font-mono">
                <Layers className="w-4 h-4" />
                <span>The Stellar & Interstellar Disk</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs leading-relaxed text-celestial-subtle">
              <p>The Milky Way disk is composed of two distinct populations:</p>
              <ul className="space-y-2 font-mono text-[11px] list-disc list-inside text-celestial-starlight">
                <li>
                  <strong>Thin Disk:</strong> Scale height ~300 pc, scale length ~2.6 kpc. Contains
                  85% of disk stars, young Population I stars, molecular gas, and active star
                  formation regions.
                </li>
                <li>
                  <strong>Thick Disk:</strong> Scale height ~900 pc. Composed of older, metal-poor
                  Population II stars with higher velocity dispersion.
                </li>
              </ul>
              <p>
                The disk exhibits a radial truncation cutoff between 15 and 25 kpc, beyond which
                stellar density drops precipitously.
              </p>
            </CardContent>
          </Card>

          {/* 2. Bulge & Central Bar */}
          <Card elevated className="space-y-4">
            <CardHeader className="pb-2 border-b border-celestial-muted/50">
              <CardTitle className="text-lg flex items-center gap-2 text-celestial-amber font-mono">
                <Globe className="w-4 h-4" />
                <span>Galactic Bulge & Rotating Bar</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs leading-relaxed text-celestial-subtle">
              <p>
                The central 2 kiloparsecs of the Milky Way contain an evolved triaxial bar and
                bulge:
              </p>
              <ul className="space-y-2 font-mono text-[11px] list-disc list-inside text-celestial-starlight">
                <li>
                  <strong>Primary Bar:</strong> Half-length ~5.0 kpc, oriented at an angle of ~29°
                  with respect to the Sun-Galactic Center line, rotating at a pattern speed of ~39
                  km/s/kpc.
                </li>
                <li>
                  <strong>Boxy/Peanut Bulge:</strong> Arises from vertical buckling instabilities in
                  the central bar, harboring an estimated stellar mass of 1.8 × 10^10 solar masses.
                </li>
              </ul>
              <p>
                At the exact dynamical core lies <strong>Sagittarius A*</strong>, a 4.154 million
                solar mass supermassive black hole.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Galactocentric Coordinate Convention Documentation */}
        <Card elevated className="space-y-4">
          <CardHeader className="pb-2 border-b border-celestial-muted/50">
            <CardTitle className="text-lg flex items-center gap-2 text-celestial-starlight font-mono">
              <Compass className="w-4 h-4 text-celestial-cyan" />
              <span>Standard Galactocentric Coordinate System</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 font-mono text-xs text-celestial-subtle leading-relaxed">
            <p>
              CELESTIAL employs the accepted IAU / modern astronomical standard right-handed
              Galactocentric Cartesian system (X, Y, Z)_GC:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-celestial-deep/60 border border-celestial-muted/60 text-celestial-starlight text-[11px]">
              <div>
                <strong className="text-celestial-cyan block">+X Axis</strong>
                <span>Points from the Sun toward the Galactic Center (projected on midplane).</span>
              </div>
              <div>
                <strong className="text-celestial-violet block">+Y Axis</strong>
                <span>Points in the direction of Galactic rotation (l = 90°, b = 0°).</span>
              </div>
              <div>
                <strong className="text-celestial-amber block">+Z Axis</strong>
                <span>Points toward the North Galactic Pole (b = +90°).</span>
              </div>
            </div>
            <p>The Sun is located at coordinates x_sun = (-8,178 pc, 0 pc, +20.8 pc).</p>
          </CardContent>
        </Card>

        {/* Scientific References */}
        <div className="p-6 rounded-2xl border border-celestial-cyan/30 bg-celestial-cyan/5 space-y-3">
          <div className="flex items-center gap-2 text-celestial-cyan font-mono font-semibold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>Authoritative Scientific Model Sources</span>
          </div>
          <ul className="text-xs text-celestial-subtle space-y-1.5 font-mono">
            <li>
              • <strong>Bland-Hawthorn & Gerhard (2016)</strong> —{" "}
              <em>
                &quot;The Galaxy in Context: Structural, Kinematic, and Integrated Properties&quot;
              </em>
              , Annual Review of Astronomy and Astrophysics.
            </li>
            <li>
              • <strong>GRAVITY Collaboration, Abuter et al. (2019)</strong> —{" "}
              <em>
                &quot;A geometric distance measurement to the Galactic center black hole with 0.3%
                uncertainty&quot;
              </em>
              , Astronomy &amp; Astrophysics.
            </li>
            <li>
              • <strong>Reid et al. (2019)</strong> —{" "}
              <em>
                &quot;Trigonometric Parallaxes of High-mass Star-forming Regions: Our View of the
                Milky Way&quot;
              </em>
              , The Astrophysical Journal.
            </li>
          </ul>
        </div>
      </Container>
    </div>
  );
}
