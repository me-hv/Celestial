"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap,
  Compass,
  Telescope,
  Star,
  Orbit,
  Sparkles,
  Disc,
  Globe,
  Globe2,
  Network,
  Layers,
  Clock,
  Radio,
  Rocket,
  PanelLeftClose,
  PanelLeftOpen,
  Calendar,
  Eye,
  Activity,
  Home,
  BookOpen,
  Building2,
  Database,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface NavItem {
  href: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const SIDEBAR_NAV_SECTIONS: NavSection[] = [
  {
    title: "EXPLORE",
    items: [
      {
        href: "/live",
        label: "Live Command",
        description: "Real-time telemetry and space intelligence",
        icon: Radio,
        exact: true,
      },
      {
        href: "/timeline",
        label: "Timeline",
        description: "Universal scientific chronology & history",
        icon: Clock,
        exact: true,
      },
      {
        href: "/space-weather",
        label: "Space Weather",
        description: "NOAA SWPC solar & geomagnetic feeds",
        icon: Zap,
        exact: true,
      },
      {
        href: "/explore",
        label: "Solar System",
        description: "Keplerian 3D orbital planetary explorer",
        icon: Compass,
      },
      {
        href: "/sky",
        label: "Live Sky",
        description: "Ground observer alt/az planisphere",
        icon: Telescope,
        exact: true,
      },
    ],
  },
  {
    title: "CATALOGS",
    items: [
      {
        href: "/stars",
        label: "Stars",
        description: "Gaia DR3 stellar neighborhood catalog",
        icon: Star,
      },
      {
        href: "/systems",
        label: "Stellar Systems",
        description: "Exoplanets and circumstellar habitable zones",
        icon: Orbit,
      },
      {
        href: "/deep-sky",
        label: "Deep Sky",
        description: "Messier, NGC, IC nebulae and clusters",
        icon: Sparkles,
      },
      {
        href: "/galaxies",
        label: "Galaxies",
        description: "Extragalactic morphology catalog",
        icon: Disc,
      },
      {
        href: "/objects",
        label: "All Objects",
        description: "Unified astronomical object index",
        icon: Globe2,
      },
    ],
  },
  {
    title: "COSMIC SCALE",
    items: [
      {
        href: "/milky-way",
        label: "Milky Way",
        description: "Galactocentric structure and Sgr A*",
        icon: Globe,
      },
      {
        href: "/local-group",
        label: "Local Group",
        description: "Megaparsec galactic neighborhood",
        icon: Network,
      },
      {
        href: "/cosmic-web",
        label: "Cosmic Web",
        description: "Superclusters, filaments, and voids",
        icon: Layers,
      },
      {
        href: "/cosmic-time",
        label: "Cosmic Time",
        description: "14 cosmological epochs & past light cone",
        icon: Clock,
      },
      {
        href: "/observable-universe",
        label: "Universe",
        description: "Particle horizon and cosmic boundary",
        icon: Radio,
        exact: true,
      },
    ],
  },
  {
    title: "OBSERVATION",
    items: [
      {
        href: "/observable-universe/cmb",
        label: "CMB Surface",
        description: "Photon decoupling surface z≈1089",
        icon: Activity,
      },
      {
        href: "/observable-universe/horizon",
        label: "Horizons",
        description: "Hubble sphere, event and particle limits",
        icon: Eye,
      },
      {
        href: "/sky/events",
        label: "Sky Events",
        description: "Solar twilights & lunar schedule",
        icon: Calendar,
      },
      {
        href: "/sky/planner",
        label: "Session Planner",
        description: "Observation target ranking & limits",
        icon: Compass,
      },
    ],
  },
  {
    title: "MISSIONS",
    items: [
      {
        href: "/missions",
        label: "Missions Hub",
        description: "Spacecraft, trajectories & flights",
        icon: Rocket,
        exact: true,
      },
      {
        href: "/missions/discoveries",
        label: "Discoveries",
        description: "Authoritative science breakthroughs",
        icon: Sparkles,
      },
    ],
  },
  {
    title: "RESEARCH",
    items: [
      {
        href: "/research",
        label: "Research Hub",
        description: "Unified target intelligence & evidence",
        icon: BookOpen,
        exact: true,
      },
      {
        href: "/observatories",
        label: "Observatories",
        description: "Global & orbital facilities",
        icon: Telescope,
      },
      {
        href: "/organizations",
        label: "Organizations",
        description: "Global space agencies & institutes",
        icon: Building2,
      },
      {
        href: "/datasets",
        label: "Datasets",
        description: "PDS4 & multi-agency data archive",
        icon: Database,
      },
    ],
  },
];

export interface AppSidebarProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  className?: string;
}

export function AppSidebar({
  isExpanded,
  onToggleExpand,
  isMobileOpen = false,
  onCloseMobile,
  className = "",
}: AppSidebarProps) {
  const pathname = usePathname();

  const isItemActive = (item: NavItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    if (item.href === "/") {
      return pathname === "/";
    }
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  const renderSidebarContent = (isMobileView = false) => {
    const showExpanded = isMobileView || isExpanded;

    return (
      <div className="flex flex-col h-full bg-celestial-deep/95 backdrop-blur-2xl border-r border-white/[0.07] select-none shadow-2xl">
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/[0.07] shrink-0 bg-celestial-surface/40">
          <Link
            href="/"
            onClick={onCloseMobile}
            className="flex items-center gap-3 text-celestial-starlight hover:opacity-90 transition-opacity focus:outline-none min-w-0"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-celestial-cyan/15 border border-celestial-cyan/40 text-celestial-cyan shadow-glow-cyan shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            {showExpanded && (
              <div className="min-w-0 flex flex-col">
                <span className="font-mono text-sm font-bold tracking-widest text-celestial-starlight uppercase truncate">
                  CELESTIAL
                </span>
                <span className="text-[10px] font-mono text-celestial-cyan tracking-wider">
                  ASTRONOMICAL ATLAS
                </span>
              </div>
            )}
          </Link>

          {/* Action buttons in header */}
          {isMobileView ? (
            <button
              onClick={onCloseMobile}
              className="p-2 rounded-xl text-celestial-subtle hover:text-celestial-starlight hover:bg-white/[0.06] transition focus:outline-none"
              aria-label="Close Navigation Menu"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={onToggleExpand}
              className="hidden md:flex p-1.5 rounded-lg text-celestial-subtle hover:text-celestial-cyan hover:bg-white/[0.06] transition focus:outline-none"
              title={isExpanded ? "Collapse Sidebar (Compact)" : "Expand Sidebar"}
              aria-label={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              {isExpanded ? (
                <PanelLeftClose className="w-4 h-4" />
              ) : (
                <PanelLeftOpen className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-4 font-sans custom-scrollbar">
          {/* Home Link */}
          <div className="space-y-1">
            <Link
              href="/"
              onClick={onCloseMobile}
              title={!showExpanded ? "Home" : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative min-h-[40px]",
                pathname === "/"
                  ? "bg-celestial-cyan/15 text-celestial-cyan border border-celestial-cyan/40 font-semibold shadow-sm shadow-celestial-cyan/10"
                  : "text-celestial-subtle hover:text-celestial-starlight hover:bg-white/[0.05]"
              )}
            >
              <Home
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  pathname === "/" ? "text-celestial-cyan" : "text-celestial-subtle group-hover:text-celestial-starlight"
                )}
              />
              {showExpanded && (
                <span className="font-semibold text-celestial-starlight truncate">Home Portal</span>
              )}
              {!showExpanded && (
                <div className="absolute left-full ml-2 px-2.5 py-1 bg-celestial-surface border border-white/[0.1] rounded-md text-xs font-medium text-celestial-starlight whitespace-nowrap shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                  Home Portal
                </div>
              )}
            </Link>
          </div>

          {/* Categorized Navigation Sections */}
          {SIDEBAR_NAV_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-1">
              {showExpanded ? (
                <div className="px-3 py-1 text-[10px] font-mono font-bold tracking-widest text-celestial-subtle/70 uppercase">
                  {section.title}
                </div>
              ) : (
                <div className="h-px bg-white/[0.06] my-2 mx-1" />
              )}

              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(item);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    title={!showExpanded ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all group relative min-h-[40px]",
                      active
                        ? "bg-celestial-cyan/15 text-celestial-cyan border border-celestial-cyan/35 font-semibold shadow-sm shadow-celestial-cyan/10"
                        : "text-celestial-subtle hover:text-celestial-starlight hover:bg-white/[0.05] font-medium"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 shrink-0 transition-colors",
                        active
                          ? "text-celestial-cyan"
                          : "text-celestial-subtle group-hover:text-celestial-starlight"
                      )}
                    />

                    {showExpanded && (
                      <div className="min-w-0 flex flex-col">
                        <span className="text-xs truncate">{item.label}</span>
                      </div>
                    )}

                    {/* Tooltip on Collapsed Hover */}
                    {!showExpanded && (
                      <div className="absolute left-full ml-2 px-2.5 py-1 bg-celestial-surface border border-white/[0.1] rounded-md text-xs font-medium text-celestial-starlight whitespace-nowrap shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                        {item.label}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer Metadata */}
        {showExpanded && (
          <div className="p-3 border-t border-white/[0.07] bg-celestial-surface/30 text-[10px] font-mono text-celestial-subtle/80 flex items-center justify-between shrink-0">
            <span>IAU · NASA · GAIA DR3</span>
            <span className="text-celestial-cyan font-bold">v1.0</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={cn(
          "hidden md:block shrink-0 transition-all duration-300 ease-in-out z-30 sticky top-0 h-screen h-[100dvh]",
          isExpanded ? "w-64" : "w-[68px]",
          className
        )}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-celestial-void/80 backdrop-blur-md transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 animate-in slide-in-from-left duration-200 shadow-2xl">
            {renderSidebarContent(true)}
          </div>
        </div>
      )}
    </>
  );
}

