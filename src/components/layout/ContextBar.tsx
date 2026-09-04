"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface ContextBarProps {
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  className?: string;
}

interface BreadcrumbPart {
  label: string;
  href?: string;
}

export function ContextBar({ onOpenMobileMenu, onOpenSearch, className = "" }: ContextBarProps) {
  const pathname = usePathname();

  // Compute dynamic scientific breadcrumbs from active route
  const breadcrumbs: BreadcrumbPart[] = useMemo(() => {
    if (pathname === "/") {
      return [{ label: "Home Portal" }];
    }

    const parts: BreadcrumbPart[] = [];
    const segments = pathname.split("/").filter(Boolean);

    if (segments[0] === "explore") {
      parts.push({ label: "Explore", href: "/explore" });
      parts.push({ label: "Solar System" });
    } else if (segments[0] === "sky") {
      parts.push({ label: "Live Sky", href: "/sky" });
      if (segments[1] === "events") parts.push({ label: "Astronomical Events" });
      else if (segments[1] === "planner") parts.push({ label: "Session Planner" });
      else if (segments[1] === "where-is") parts.push({ label: `Where Is ${segments[2] || ""}` });
    } else if (segments[0] === "live") {
      parts.push({ label: "Live Command" });
    } else if (segments[0] === "timeline") {
      parts.push({ label: "Scientific Timeline" });
      if (segments[1]) parts.push({ label: segments[1] });
    } else if (segments[0] === "space-weather") {
      parts.push({ label: "Space Weather" });
    } else if (segments[0] === "stars") {
      parts.push({ label: "Stars Catalog", href: "/stars" });
      if (segments[1]) parts.push({ label: segments[1] });
    } else if (segments[0] === "systems") {
      parts.push({ label: "Stellar Systems", href: "/systems" });
      if (segments[1]) parts.push({ label: segments[1] });
    } else if (segments[0] === "deep-sky") {
      parts.push({ label: "Deep Sky Atlas", href: "/deep-sky" });
      if (segments[1]) parts.push({ label: segments[1] });
    } else if (segments[0] === "galaxies") {
      parts.push({ label: "Galaxies Catalog", href: "/galaxies" });
      if (segments[1]) parts.push({ label: segments[1] });
    } else if (segments[0] === "milky-way") {
      parts.push({ label: "Milky Way", href: "/milky-way" });
      if (segments[1] === "overview") parts.push({ label: "Galactic Overview" });
      else if (segments[1]) parts.push({ label: segments[1] });
    } else if (segments[0] === "local-group") {
      parts.push({ label: "Local Group", href: "/local-group" });
      if (segments[1]) parts.push({ label: segments[1] });
    } else if (segments[0] === "cosmic-web") {
      parts.push({ label: "Cosmic Web", href: "/cosmic-web" });
      if (segments[1]) parts.push({ label: segments[1] });
    } else if (segments[0] === "cosmic-time") {
      parts.push({ label: "Cosmic Time", href: "/cosmic-time" });
      if (segments[1] === "redshift") parts.push({ label: "Cosmological Redshift" });
      else if (segments[1]) parts.push({ label: segments[1].replace(/-/g, " ") });
    } else if (segments[0] === "observable-universe") {
      parts.push({ label: "Observable Universe", href: "/observable-universe" });
      if (segments[1] === "cmb") parts.push({ label: "CMB Last-Scattering" });
      else if (segments[1] === "horizon") parts.push({ label: "Cosmic Horizons" });
      else if (segments[1] === "redshift") parts.push({ label: "Redshift Distances" });
      else if (segments[1]) parts.push({ label: segments[1] });
    } else if (segments[0] === "missions") {
      parts.push({ label: "Space Missions", href: "/missions" });
      if (segments[1]) parts.push({ label: segments[1] });
    } else if (segments[0] === "objects") {
      parts.push({ label: "Astronomical Objects", href: "/objects" });
      if (segments[1]) parts.push({ label: segments[1] });
    } else if (segments[0] === "research") {
      parts.push({ label: "Research Hub", href: "/research" });
      if (segments[1]) parts.push({ label: segments[1] });
    } else if (segments[0] === "observatories") {
      parts.push({ label: "Observatories", href: "/observatories" });
      if (segments[1]) parts.push({ label: segments[1] });
    } else if (segments[0] === "organizations") {
      parts.push({ label: "Organizations", href: "/organizations" });
      if (segments[1]) parts.push({ label: segments[1] });
    } else if (segments[0] === "datasets") {
      parts.push({ label: "Datasets", href: "/datasets" });
      if (segments[1]) parts.push({ label: segments[1] });
    } else {
      segments.forEach((seg) => parts.push({ label: seg }));
    }

    return parts;
  }, [pathname]);

  const getScaleBadge = () => {
    if (pathname.startsWith("/explore")) return "AU Scale (Solar System)";
    if (pathname.startsWith("/stars") || pathname.startsWith("/systems"))
      return "Parsec Scale (1–25 pc)";
    if (pathname.startsWith("/milky-way")) return "Kiloparsec Scale (~50 kpc)";
    if (pathname.startsWith("/local-group")) return "Megaparsec Scale (0.1–3 Mpc)";
    if (pathname.startsWith("/cosmic-web")) return "Supergalactic (15–350 Mpc)";
    if (pathname.startsWith("/cosmic-time")) return "4D Spacetime (0–13.8 Gyr)";
    if (pathname.startsWith("/observable-universe")) return "Cosmic Horizon (0–46.5 Gly)";
    if (pathname.startsWith("/sky")) return "Ground Observer (Alt/Az)";
    if (pathname.startsWith("/live")) return "Real-Time Telemetry";
    if (pathname.startsWith("/timeline")) return "Cosmic Timeline";
    return null;
  };

  const scaleBadge = getScaleBadge();

  return (
    <header
      className={`h-14 border-b border-white/[0.07] bg-celestial-deep/80 backdrop-blur-xl px-3 sm:px-4 flex items-center justify-between z-20 shrink-0 select-none ${className}`}
    >
      {/* Left: Mobile Drawer Trigger + Breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-celestial-subtle hover:text-celestial-starlight hover:bg-white/[0.06] focus:outline-none transition shrink-0"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dynamic Breadcrumbs */}
        <nav aria-label="Breadcrumbs" className="flex items-center gap-1 sm:gap-1.5 text-xs font-mono min-w-0">
          <Link
            href="/"
            className="text-celestial-subtle hover:text-celestial-cyan transition-colors font-semibold hidden sm:inline shrink-0"
          >
            CELESTIAL
          </Link>

          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3.5 h-3.5 text-celestial-subtle/50 hidden sm:inline shrink-0" />
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-celestial-subtle hover:text-celestial-starlight transition-colors truncate max-w-[100px] sm:max-w-[160px] md:max-w-[200px]"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-celestial-starlight font-semibold truncate max-w-[120px] sm:max-w-[200px] md:max-w-[260px]">
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Scale Indicator + Global Search Trigger */}
      <div className="flex items-center gap-2 shrink-0">
        {scaleBadge && (
          <Badge
            variant="cyan"
            className="hidden lg:inline-flex font-mono text-[10px] uppercase py-0.5 px-2 bg-celestial-cyan/10 text-celestial-cyan border-celestial-cyan/30 shadow-sm shadow-celestial-cyan/10"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            {scaleBadge}
          </Badge>
        )}

        {/* Universal Search Command Trigger */}
        <Button
          onClick={onOpenSearch}
          variant="outline"
          size="sm"
          className="h-9 px-2.5 sm:px-3 text-xs font-mono text-celestial-subtle hover:text-celestial-starlight border-white/[0.1] hover:border-celestial-cyan/60 bg-celestial-surface/70 hover:bg-celestial-surface backdrop-blur-md gap-2 rounded-xl transition shadow-sm"
          aria-label="Universal Search (Command+K)"
        >
          <Search className="w-3.5 h-3.5 text-celestial-cyan" />
          <span className="hidden sm:inline">Search universe...</span>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-white/[0.08] text-[10px] text-celestial-subtle border border-white/[0.1]">
            ⌘K
          </kbd>
        </Button>
      </div>
    </header>
  );
}

