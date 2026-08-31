import React from "react";
import Link from "next/link";

export type CosmicScaleStage =
  | "EARTH"
  | "SOLAR_SYSTEM"
  | "STELLAR_NEIGHBORHOOD"
  | "MILKY_WAY"
  | "LOCAL_GROUP"
  | "LOCAL_VOLUME"
  | "VIRGO_SUPERCLUSTER"
  | "LANIAKEA"
  | "COSMIC_WEB";

interface CosmicLocationBreadcrumbProps {
  currentStage?: CosmicScaleStage;
  className?: string;
}

const STAGES: { stage: CosmicScaleStage; label: string; href?: string }[] = [
  { stage: "EARTH", label: "Earth", href: "/explore" },
  { stage: "SOLAR_SYSTEM", label: "Solar System", href: "/explore" },
  { stage: "MILKY_WAY", label: "Milky Way", href: "/milky-way" },
  { stage: "LOCAL_GROUP", label: "Local Group", href: "/local-group" },
  { stage: "LOCAL_VOLUME", label: "Local Volume", href: "/cosmic-web/local-sheet" },
  {
    stage: "VIRGO_SUPERCLUSTER",
    label: "Virgo Supercluster",
    href: "/cosmic-web/virgo-supercluster",
  },
  { stage: "LANIAKEA", label: "Laniakea", href: "/cosmic-web/laniakea-supercluster" },
  { stage: "COSMIC_WEB", label: "Cosmic Web", href: "/cosmic-web" },
];

export function CosmicLocationBreadcrumb({
  currentStage = "COSMIC_WEB",
  className = "",
}: CosmicLocationBreadcrumbProps) {
  return (
    <nav
      aria-label="Cosmic Location Hierarchy"
      className={`flex items-center flex-wrap gap-1.5 text-xs font-mono rounded-xl bg-slate-900/60 p-2.5 border border-white/5 backdrop-blur-md ${className}`}
    >
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-1">
        Cosmic Address:
      </span>
      {STAGES.map((s, idx) => {
        const isCurrent = s.stage === currentStage;
        return (
          <React.Fragment key={s.stage}>
            {idx > 0 && <span className="text-slate-400">/</span>}
            {s.href && !isCurrent ? (
              <Link
                href={s.href}
                className="text-slate-300 hover:text-cyan-400 transition-colors underline-offset-4 hover:underline"
              >
                {s.label}
              </Link>
            ) : (
              <span className={isCurrent ? "font-bold text-cyan-300" : "text-slate-400"}>
                {s.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
