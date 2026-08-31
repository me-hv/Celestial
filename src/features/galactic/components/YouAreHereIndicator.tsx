"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Compass } from "lucide-react";

export interface YouAreHereIndicatorProps {
  currentStage?:
    | "EARTH"
    | "SOLAR_SYSTEM"
    | "ORION_SPUR"
    | "MILKY_WAY"
    | "LOCAL_GROUP"
    | "VIRGO_SUPERCLUSTER"
    | "LANIAKEA"
    | "COSMIC_WEB";
  className?: string;
}

export function YouAreHereIndicator({
  currentStage = "LOCAL_GROUP",
  className = "",
}: YouAreHereIndicatorProps) {
  const STAGES = [
    { id: "EARTH", label: "Earth", href: "/explore" },
    { id: "SOLAR_SYSTEM", label: "Solar System", href: "/explore" },
    { id: "ORION_SPUR", label: "Orion Spur", href: "/milky-way/orion-spur" },
    { id: "MILKY_WAY", label: "Milky Way", href: "/milky-way" },
    { id: "LOCAL_GROUP", label: "Local Group", href: "/local-group" },
    {
      id: "VIRGO_SUPERCLUSTER",
      label: "Virgo Supercluster",
      href: "/cosmic-web/virgo-supercluster",
    },
    { id: "LANIAKEA", label: "Laniakea", href: "/cosmic-web/laniakea-supercluster" },
    { id: "COSMIC_WEB", label: "Cosmic Web", href: "/cosmic-web" },
  ];

  return (
    <div
      className={`flex items-center gap-1.5 overflow-x-auto scrollbar-none font-mono text-[11px] p-2.5 rounded-xl border border-celestial-muted/80 bg-celestial-surface/85 backdrop-blur-xl shadow-subtle-card text-celestial-subtle select-none ${className}`}
      aria-label="Cosmic Location Hierarchy"
    >
      <div className="flex items-center gap-1 text-celestial-amber font-bold shrink-0 mr-1">
        <Compass className="w-3.5 h-3.5" />
        <span>YOU ARE HERE:</span>
      </div>

      {STAGES.map((stage, idx) => {
        const isCurrent = stage.id === currentStage;
        return (
          <React.Fragment key={stage.id}>
            {idx > 0 && <ChevronRight className="w-3 h-3 text-celestial-muted shrink-0" />}
            <Link
              href={stage.href}
              className={`px-2 py-0.5 rounded transition-all whitespace-nowrap ${
                isCurrent
                  ? "bg-celestial-cyan/20 text-celestial-cyan border border-celestial-cyan/40 font-bold"
                  : "hover:text-celestial-starlight hover:bg-celestial-muted/40"
              }`}
            >
              {stage.label}
            </Link>
          </React.Fragment>
        );
      })}
    </div>
  );
}
