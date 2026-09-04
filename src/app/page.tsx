"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Telescope,
  Star,
  Orbit,
  Sparkles,
  Globe,
  Network,
  Layers,
  Clock,
  Radio,
  Search,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { EpistemicBadge } from "@/components/ui/epistemic-badge";
import { AmbientStarfieldCanvas } from "@/features/visualization/ambient-starfield-canvas";
import { GlobalSearchDialog } from "@/components/shared/GlobalSearchDialog";

// 1. Cosmic Scale Hierarchy
const COSMIC_SCALES = [
  {
    step: "01",
    label: "Ground Sky",
    scale: "0 – 100 km",
    order: "10² km",
    href: "/sky",
    description: "Alt/Az Horizon & Sidereal Planisphere",
  },
  {
    step: "02",
    label: "Solar System",
    scale: "0.1 – 100 AU",
    order: "10⁸ km",
    href: "/explore",
    description: "Keplerian Orbits & Planetary Telemetry",
  },
  {
    step: "03",
    label: "Stellar Neighborhood",
    scale: "1 – 25 pc",
    order: "10¹³ km",
    href: "/stars",
    description: "Gaia DR3 Astrometry & Star Catalog",
  },
  {
    step: "04",
    label: "Milky Way",
    scale: "0.1 – 50 kpc",
    order: "10¹⁸ km",
    href: "/milky-way",
    description: "Logarithmic Spiral Arms & Sgr A*",
  },
  {
    step: "05",
    label: "Local Group",
    scale: "0.1 – 3 Mpc",
    order: "10²⁰ km",
    href: "/local-group",
    description: "Andromeda, Triangulum & Satellites",
  },
  {
    step: "06",
    label: "Cosmic Web",
    scale: "15 – 350 Mpc",
    order: "10²² km",
    href: "/cosmic-web",
    description: "Superclusters, Filaments & Cosmic Voids",
  },
  {
    step: "07",
    label: "Cosmic Time",
    scale: "0 – 13.8 Gyr",
    order: "4D Spacetime",
    href: "/cosmic-time",
    description: "14 Standard Cosmological Epochs",
  },
  {
    step: "08",
    label: "Observable Universe",
    scale: "0 – 46.5 Gly",
    order: "10²³ km",
    href: "/observable-universe",
    description: "Particle Horizon & CMB Surface (z=1089)",
  },
];

// 2. Exploration Realm Cards
const EXPLORATION_REALMS = [
  {
    title: "Live Command Center",
    scale: "Real-Time",
    domain: "Space Intelligence",
    description:
      "Integrated real-time telemetry, space weather conditions, ground sky observer state, active probes, and data feeds.",
    href: "/live",
    icon: Radio,
    accent: "text-celestial-cyan",
    borderHover: "hover:border-celestial-cyan/50",
  },
  {
    title: "Scientific Timeline",
    scale: "0 – 13.8 Gyr",
    domain: "Universal Chronology",
    description:
      "Unified temporal intelligence connecting cosmological epochs, space exploration missions, and breakthroughs.",
    href: "/timeline",
    icon: Clock,
    accent: "text-amber-400",
    borderHover: "hover:border-amber-400/50",
  },
  {
    title: "Solar System Explorer",
    scale: "0.1 – 100 AU",
    domain: "Planetary Dynamics",
    description:
      "Heliocentric Keplerian mechanics, NASA JPL ephemerides, 8 planets, moons, and ring systems.",
    href: "/explore",
    icon: Compass,
    accent: "text-celestial-cyan",
    borderHover: "hover:border-celestial-cyan/50",
  },
  {
    title: "Live Sky & Observatory",
    scale: "Local Observer",
    domain: "Ground Astrometry",
    description:
      "3D interior celestial sphere, 2D polar planisphere, 88 IAU constellations, twilights & observation planner.",
    href: "/sky",
    icon: Telescope,
    accent: "text-sky-400",
    borderHover: "hover:border-sky-400/50",
  },
  {
    title: "Stellar Neighborhood",
    scale: "1 – 25 pc",
    domain: "Stellar Astrometry",
    description:
      "ESA Gaia DR3 catalog, spectral classifications (OBAFGKM), distance shells, and true 3D Cartesian coordinates.",
    href: "/stars",
    icon: Star,
    accent: "text-amber-400",
    borderHover: "hover:border-amber-400/50",
  },
  {
    title: "Stellar & Exoplanet Systems",
    scale: "1 – 100 AU",
    domain: "Exoplanetary Science",
    description:
      "NASA Exoplanet Archive integration, Kopparapu habitable zones, and multi-star barycentric hierarchies.",
    href: "/systems",
    icon: Orbit,
    accent: "text-emerald-400",
    borderHover: "hover:border-emerald-400/50",
  },
  {
    title: "Deep Sky Atlas",
    scale: "10 pc – 10 Mpc",
    domain: "Astrophysical Objects",
    description:
      "Messier, NGC, and IC catalogs featuring emission nebulae, globular clusters, and supernova remnants.",
    href: "/deep-sky",
    icon: Sparkles,
    accent: "text-pink-400",
    borderHover: "hover:border-pink-400/50",
  },
  {
    title: "Milky Way Galaxy",
    scale: "0.1 – 50 kpc",
    domain: "Galactic Structure",
    description:
      "Galactocentric cylindrical coordinates, 4 logarithmic spiral arms, central bar, and Sagittarius A* SMBH.",
    href: "/milky-way",
    icon: Globe,
    accent: "text-indigo-400",
    borderHover: "hover:border-indigo-400/50",
  },
  {
    title: "Local Group of Galaxies",
    scale: "0.1 – 3 Mpc",
    domain: "Extragalactic Neighborhood",
    description:
      "Milky Way, Andromeda (M31), Triangulum (M33), and dwarf satellites with galaxy morphological comparison.",
    href: "/local-group",
    icon: Network,
    accent: "text-purple-400",
    borderHover: "hover:border-purple-400/50",
  },
  {
    title: "Cosmic Web & Structure",
    scale: "15 – 350 Mpc",
    domain: "Large-Scale Universe",
    description:
      "Supergalactic coordinates, Laniakea, Shapley Supercluster, Boötes Void, and 3D cosmic filament meshes.",
    href: "/cosmic-web",
    icon: Layers,
    accent: "text-blue-400",
    borderHover: "hover:border-blue-400/50",
  },
  {
    title: "Cosmic Time Machine",
    scale: "0 – 13.8 Gyr",
    domain: "4D Spacetime",
    description:
      "FLRW expansion engine, 14 standard cosmological epochs, 3D Past Light Cone, and spacetime expansion graphs.",
    href: "/cosmic-time",
    icon: Clock,
    accent: "text-amber-300",
    borderHover: "hover:border-amber-300/50",
  },
  {
    title: "Observable Universe & CMB",
    scale: "0 – 46.5 Gly",
    domain: "Cosmological Horizon",
    description:
      "Comoving Particle Horizon, Hubble Sphere, Cosmological Event Horizon, and 3D CMB Decoupling Sphere (z=1089).",
    href: "/observable-universe",
    icon: Radio,
    accent: "text-rose-400",
    borderHover: "hover:border-rose-400/50",
  },
];

// 3. Featured Astronomical Landmarks
const FEATURED_LANDMARKS = [
  {
    name: "Earth",
    type: "PLANET",
    scale: "1.0 AU",
    href: "/explore?system=solar-system&target=earth",
  },
  { name: "Sun", type: "STAR", scale: "G2V Host", href: "/explore?system=solar-system&target=sun" },
  {
    name: "Moon",
    type: "MOON",
    scale: "384,400 km",
    href: "/explore?system=solar-system&target=moon",
  },
  { name: "Proxima Centauri", type: "STAR", scale: "1.30 pc", href: "/stars/proxima-centauri" },
  { name: "TRAPPIST-1 e", type: "EXOPLANET", scale: "12.1 pc (HZ)", href: "/systems/trappist-1" },
  {
    name: "Sagittarius A*",
    type: "BLACK_HOLE",
    scale: "8.18 kpc",
    href: "/milky-way/sagittarius-a-star",
  },
  { name: "Andromeda (M31)", type: "GALAXY", scale: "0.77 Mpc", href: "/galaxies/andromeda" },
  {
    name: "Orion Nebula (M42)",
    type: "NEBULA",
    scale: "412 pc",
    href: "/deep-sky/m42-orion-nebula",
  },
  { name: "CMB Surface", type: "CMB", scale: "z = 1089", href: "/observable-universe/cmb" },
];

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="relative flex-1 flex flex-col min-h-screen bg-celestial-void overflow-x-hidden font-sans select-none">
      {/* 2D Canvas Ambient Cosmic Starfield */}
      <AmbientStarfieldCanvas className="z-0 opacity-80" />

      {/* Hero Section */}
      <section className="relative z-10 pt-10 sm:pt-16 md:pt-20 pb-10 sm:pb-14 flex flex-col items-center text-center px-4">
        <Container size="lg" className="flex flex-col items-center space-y-6 max-w-4xl">
          {/* Scientific Platform Indicator */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-celestial-cyan/35 bg-celestial-surface/75 backdrop-blur-xl text-xs font-mono text-celestial-cyan shadow-glow-cyan/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="tracking-wide">SCIENTIFIC ASTRONOMICAL ATLAS · GROUND TO COSMOS</span>
          </div>

          {/* Hero Branding */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-celestial-starlight uppercase font-mono drop-shadow-sm">
              CELESTIAL
            </h1>
            <p className="text-lg sm:text-2xl font-light text-celestial-subtle max-w-2xl mx-auto">
              Interactive Atlas of the Universe
            </p>
            <p className="text-xs sm:text-sm text-celestial-subtle/80 max-w-xl mx-auto font-mono leading-relaxed">
              Explore from Earth to the edge of the observable universe across spatial, temporal,
              and cosmological scales.
            </p>
          </div>

          {/* Universal Search Command Bar Trigger */}
          <div className="w-full max-w-xl pt-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full h-12 sm:h-14 px-4 rounded-2xl border border-white/[0.1] hover:border-celestial-cyan/50 bg-celestial-surface/75 hover:bg-celestial-surface text-celestial-starlight text-sm flex items-center justify-between shadow-xl shadow-black/40 backdrop-blur-xl transition-all duration-200 group active:scale-[0.99]"
              aria-label="Search the Universe"
            >
              <div className="flex items-center gap-3 text-celestial-subtle group-hover:text-celestial-starlight transition-colors min-w-0">
                <Search className="w-4 h-4 text-celestial-cyan shrink-0" />
                <span className="text-xs sm:text-sm font-normal truncate">
                  Search planets, stars, galaxies, epochs, horizons...
                </span>
              </div>
              <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-lg bg-white/[0.08] text-[11px] font-mono text-celestial-subtle border border-white/[0.1] shrink-0">
                ⌘K
              </kbd>
            </button>
          </div>
        </Container>
      </section>

      {/* Cosmic Scale Progression ("Journey Through the Universe") */}
      <section className="relative z-10 py-8 sm:py-10 border-y border-white/[0.07] bg-celestial-surface/30 backdrop-blur-xl">
        <Container size="xl" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1">
            <div>
              <span className="text-[11px] font-mono text-celestial-cyan tracking-wider uppercase font-semibold">
                Universal Hierarchy
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-celestial-starlight font-mono">
                JOURNEY THROUGH THE UNIVERSE
              </h2>
            </div>
            <p className="text-xs font-mono text-celestial-subtle">
              Orders of magnitude from 10² km to 10²³ km
            </p>
          </div>

          {/* Scale Step Hierarchy Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
            {COSMIC_SCALES.map((item) => (
              <Link
                key={item.step}
                href={item.href}
                className="group flex flex-col justify-between p-3.5 rounded-2xl border border-white/[0.07] bg-celestial-surface/60 hover:bg-celestial-surface/90 hover:border-celestial-cyan/40 transition-all duration-200 text-left shadow-lg shadow-black/20 hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-celestial-cyan">
                      {item.step}
                    </span>
                    <span className="text-[9px] font-mono text-celestial-subtle/80">
                      {item.order}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-celestial-starlight group-hover:text-celestial-cyan transition-colors truncate">
                    {item.label}
                  </h3>
                  <span className="text-[10px] font-mono text-celestial-subtle truncate block mt-0.5">
                    {item.scale}
                  </span>
                </div>
                <div className="mt-2.5 pt-2 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-celestial-cyan/80 group-hover:text-celestial-cyan">
                  <span>Explore</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Exploration Realm Grid */}
      <section className="relative z-10 py-12 sm:py-16">
        <Container size="xl" className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1">
            <div>
              <span className="text-[11px] font-mono text-celestial-cyan tracking-wider uppercase font-semibold">
                Interactive Portals
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-celestial-starlight font-mono">
                EXPLORE THE COSMIC REALMS
              </h2>
            </div>
            <p className="text-xs font-mono text-celestial-subtle">
              Select a domain to initialize real-time 3D simulation
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {EXPLORATION_REALMS.map((realm) => {
              const Icon = realm.icon;
              return (
                <Link
                  key={realm.title}
                  href={realm.href}
                  className={`group flex flex-col justify-between p-5 sm:p-6 rounded-2xl border border-white/[0.08] bg-celestial-surface/65 backdrop-blur-xl transition-all duration-200 hover:bg-celestial-surface/90 hover:-translate-y-1 shadow-xl shadow-black/40 ${realm.borderHover}`}
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div
                        className={`p-3 rounded-xl bg-white/[0.05] border border-white/[0.08] ${realm.accent}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <Badge
                        variant="outline"
                        className="font-mono text-[10px] uppercase py-0.5 px-2.5 bg-white/[0.04] text-celestial-subtle border-white/[0.1]"
                      >
                        {realm.scale}
                      </Badge>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-celestial-subtle/80 uppercase tracking-widest font-semibold">
                        {realm.domain}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-celestial-starlight group-hover:text-celestial-cyan transition-colors mt-0.5 font-mono">
                        {realm.title}
                      </h3>
                    </div>

                    <p className="text-xs text-celestial-subtle leading-relaxed line-clamp-2">
                      {realm.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-celestial-cyan">
                    <span className="font-semibold">Launch Atlas</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Featured Astronomical Landmarks */}
      <section className="relative z-10 py-10 border-t border-white/[0.07] bg-celestial-surface/20">
        <Container size="xl" className="space-y-5">
          <div className="flex items-center justify-between px-1">
            <div>
              <span className="text-[11px] font-mono text-celestial-cyan tracking-wider uppercase font-semibold">
                Direct Telemetry
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-celestial-starlight font-mono">
                FEATURED CELESTIAL LANDMARKS
              </h2>
            </div>
            <span className="text-xs font-mono text-celestial-subtle hidden sm:inline">
              Authoritative Catalog Datasets
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 gap-2 sm:gap-2.5">
            {FEATURED_LANDMARKS.map((landmark) => (
              <Link
                key={landmark.name}
                href={landmark.href}
                className="flex flex-col justify-between p-3 rounded-2xl border border-white/[0.07] bg-celestial-surface/60 hover:bg-celestial-surface/90 hover:border-celestial-cyan/40 transition-all duration-200 text-left group shadow-sm"
              >
                <div>
                  <span className="text-xs font-bold text-celestial-starlight group-hover:text-celestial-cyan transition-colors truncate block">
                    {landmark.name}
                  </span>
                  <span className="text-[10px] font-mono text-celestial-subtle truncate mt-0.5 block">
                    {landmark.scale}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="mt-2 text-[9px] font-mono uppercase px-1.5 py-0 justify-center w-full bg-white/[0.03] border-white/[0.08]"
                >
                  {landmark.type}
                </Badge>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Scientific Honesty & Provenance Statement */}
      <section className="relative z-10 py-10 border-t border-white/[0.07] bg-celestial-void/90 text-center">
        <Container size="md" className="space-y-3.5">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <EpistemicBadge status="OBSERVED" />
            <EpistemicBadge status="INFERRED" />
            <EpistemicBadge status="MODEL_DERIVED" />
            <EpistemicBadge status="ILLUSTRATIVE" />
          </div>
          <p className="text-xs font-mono text-celestial-subtle max-w-xl mx-auto leading-relaxed">
            CELESTIAL derives all orbital, astrometric, and cosmological metrics directly from
            peer-reviewed physical formulations and authoritative datasets (IAU, NASA JPL SSD, ESA
            Gaia DR3, Planck 2018).
          </p>
        </Container>
      </section>

      {/* Global Search Dialog */}
      <GlobalSearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}

