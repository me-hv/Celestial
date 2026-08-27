import Link from "next/link";
import { Compass, Orbit, Rocket, Telescope, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SearchModalTrigger } from "@/components/shared/search-modal-trigger";
import { ThreeCanvasBoundary } from "@/features/visualization/three-boundary";

const EXPLORATION_PILLS = [
  {
    href: "/explore",
    label: "Explore",
    description: "Interactive cosmic atlas & navigation",
    icon: Compass,
    color: "text-celestial-cyan",
    borderColor: "hover:border-celestial-cyan/40",
  },
  {
    href: "/sky",
    label: "Sky",
    description: "Live night sky & observation mode",
    icon: Telescope,
    color: "text-celestial-violet",
    borderColor: "hover:border-celestial-violet/40",
  },
  {
    href: "/objects",
    label: "Objects",
    description: "Planets, stars, nebulae & galaxies",
    icon: Orbit,
    color: "text-celestial-amber",
    borderColor: "hover:border-celestial-amber/40",
  },
  {
    href: "/missions",
    label: "Missions",
    description: "Humanity's voyages across space",
    icon: Rocket,
    color: "text-celestial-emerald",
    borderColor: "hover:border-celestial-emerald/40",
  },
];

export default function HomePage() {
  return (
    <div className="relative flex-1 flex flex-col justify-center items-center py-16 sm:py-24 overflow-hidden">
      {/* Background Cosmic Starfield Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-celestial-cyan/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[300px] bg-celestial-violet/10 rounded-full blur-[120px] pointer-events-none" />

      <Container
        size="lg"
        className="relative z-10 flex flex-col items-center text-center space-y-10"
      >
        {/* Foundation Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-celestial-muted bg-celestial-surface/60 backdrop-blur-md text-xs font-mono text-celestial-subtle">
          <Sparkles className="w-3.5 h-3.5 text-celestial-cyan" />
          <span>PHASE 0 ARCHITECTURE & FOUNDATION</span>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-celestial-starlight uppercase font-mono">
            CELESTIAL
          </h1>
          <p className="text-xl sm:text-2xl font-light text-celestial-subtle">
            Explore the universe.
          </p>
        </div>

        {/* Search Universe Trigger Bar */}
        <div className="w-full flex justify-center">
          <SearchModalTrigger />
        </div>

        {/* Exploration Category Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl pt-4">
          {EXPLORATION_PILLS.map((pill) => {
            const Icon = pill.icon;
            return (
              <Link
                key={pill.href}
                href={pill.href}
                className={`group flex flex-col items-center text-center p-4 rounded-xl border border-celestial-muted bg-celestial-surface/40 backdrop-blur-sm transition-all duration-200 hover:bg-celestial-surface/80 hover:-translate-y-0.5 ${pill.borderColor}`}
              >
                <div
                  className={`p-2.5 rounded-lg bg-celestial-deep/60 border border-celestial-muted/80 mb-3 group-hover:scale-110 transition-transform ${pill.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-celestial-starlight mb-1">
                  {pill.label}
                </span>
                <span className="text-[11px] text-celestial-subtle line-clamp-2">
                  {pill.description}
                </span>
              </Link>
            );
          })}
        </div>

        {/* 3D Visualization Canvas Architectural Boundary */}
        <div className="w-full max-w-3xl pt-8">
          <ThreeCanvasBoundary className="h-56 w-full" />
        </div>
      </Container>
    </div>
  );
}
