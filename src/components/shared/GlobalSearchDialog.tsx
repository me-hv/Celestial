"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Sparkles,
  Globe2,
  Orbit,
  Star,
  Disc,
  Layers,
  Clock,
  Radio,
  Compass,
  Rocket,
  Cpu,
  Telescope,
  Building2,
  X,
  CornerDownLeft,
} from "lucide-react";
import { celestialRepo } from "@/lib/data/celestial-repository";
import { SearchResultItem } from "@/features/search/types";
import { Badge } from "@/components/ui/badge";

export interface GlobalSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchDialog({ isOpen, onClose }: GlobalSearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Execute search with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const response = await celestialRepo.search({ query: query.trim(), limit: 10 });
        setResults(response.results);
        setSelectedIndex(0);
      } catch (err) {
        console.error("Search query failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [query]);

  // Determine appropriate route for search result
  const resolveItemRoute = useCallback((item: SearchResultItem): string => {
    switch (item.objectType) {
      case "STAR":
        return `/stars/${item.slug}`;
      case "GALAXY":
        return `/galaxies/${item.slug}`;
      case "NEBULA":
      case "STAR_CLUSTER":
      case "PLANETARY_NEBULA":
      case "SUPERNOVA_REMNANT":
      case "BLACK_HOLE":
      case "DEEP_SKY":
        return `/deep-sky/${item.slug}`;
      case "COSMIC_STRUCTURE":
        return `/cosmic-web/${item.slug}`;
      case "COSMIC_EPOCH":
        return `/cosmic-time/${item.slug}`;
      case "OBSERVABLE_LANDMARK":
      case "COSMIC_HORIZON":
        return `/observable-universe/${item.slug}`;
      case "CMB":
        return `/observable-universe/cmb`;
      case "CONSTELLATION":
        return `/sky?target=${item.slug}`;
      case "PLANET":
      case "MOON":
        return `/explore?system=solar-system&target=${item.slug}`;
      case "EXOPLANET":
        return item.hostSystemId ? `/systems/${item.hostSystemId}` : `/systems`;
      case "MISSION":
        return `/missions/${item.slug}`;
      case "SPACECRAFT":
        return `/missions/spacecraft/${item.slug}`;
      case "INSTRUMENT":
        return item.missionSlug ? `/missions/${item.missionSlug}` : `/missions`;
      case "DISCOVERY":
        return `/missions/discoveries`;
      case "OBSERVATORY":
        return `/observatories/${item.slug}`;
      case "ORGANIZATION":
        return `/organizations/${item.slug}`;
      default:
        return `/objects/${item.slug}`;
    }
  }, []);

  const handleSelectResult = useCallback(
    (item: SearchResultItem) => {
      const url = resolveItemRoute(item);
      onClose();
      router.push(url);
    },
    [resolveItemRoute, onClose, router]
  );

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        results.length > 0 ? (prev - 1 + results.length) % results.length : 0
      );
    } else if (e.key === "Enter" && results.length > 0) {
      e.preventDefault();
      const target = results[selectedIndex] || results[0];
      if (target) {
        handleSelectResult(target);
      }
    }
  };

  const getTypeIcon = (type: SearchResultItem["objectType"]) => {
    switch (type) {
      case "STAR":
        return <Star className="w-4 h-4 text-amber-400" />;
      case "EXOPLANET":
      case "MOON":
        return <Orbit className="w-4 h-4 text-cyan-400" />;
      case "GALAXY":
        return <Disc className="w-4 h-4 text-purple-400" />;
      case "COSMIC_STRUCTURE":
        return <Layers className="w-4 h-4 text-blue-400" />;
      case "COSMIC_EPOCH":
        return <Clock className="w-4 h-4 text-emerald-400" />;
      case "CMB":
      case "COSMIC_HORIZON":
      case "OBSERVABLE_LANDMARK":
        return <Radio className="w-4 h-4 text-rose-400" />;
      case "CONSTELLATION":
        return <Compass className="w-4 h-4 text-celestial-cyan" />;
      case "MISSION":
        return <Rocket className="w-4 h-4 text-celestial-cyan" />;
      case "SPACECRAFT":
        return <Telescope className="w-4 h-4 text-amber-400" />;
      case "INSTRUMENT":
        return <Cpu className="w-4 h-4 text-emerald-400" />;
      case "DISCOVERY":
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case "OBSERVATORY":
      case "ORGANIZATION":
        return <Building2 className="w-4 h-4 text-primary" />;
      default:
        return <Globe2 className="w-4 h-4 text-celestial-cyan" />;
    }
  };

  const getTypeBadgeClass = (type: SearchResultItem["objectType"]) => {
    switch (type) {
      case "STAR":
        return "bg-amber-500/10 text-amber-300 border-amber-500/30";
      case "PLANET":
        return "bg-cyan-500/10 text-cyan-300 border-cyan-500/30";
      case "EXOPLANET":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
      case "GALAXY":
        return "bg-purple-500/10 text-purple-300 border-purple-500/30";
      case "NEBULA":
      case "STAR_CLUSTER":
      case "PLANETARY_NEBULA":
      case "SUPERNOVA_REMNANT":
        return "bg-pink-500/10 text-pink-300 border-pink-500/30";
      case "COSMIC_STRUCTURE":
        return "bg-blue-500/10 text-blue-300 border-blue-500/30";
      case "COSMIC_EPOCH":
        return "bg-amber-500/10 text-amber-300 border-amber-500/30";
      case "CMB":
      case "COSMIC_HORIZON":
        return "bg-rose-500/10 text-rose-300 border-rose-500/30";
      case "CONSTELLATION":
        return "bg-sky-500/10 text-sky-300 border-sky-500/30";
      case "MISSION":
        return "bg-cyan-500/10 text-cyan-300 border-cyan-500/30";
      case "SPACECRAFT":
        return "bg-amber-500/10 text-amber-300 border-amber-500/30";
      case "INSTRUMENT":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
      case "DISCOVERY":
        return "bg-purple-500/10 text-purple-300 border-purple-500/30";
      case "OBSERVATORY":
        return "bg-indigo-500/10 text-indigo-300 border-indigo-500/30";
      case "ORGANIZATION":
        return "bg-primary/10 text-primary border-primary/30";
      default:
        return "bg-celestial-muted/60 text-celestial-starlight border-celestial-muted";
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-20 px-3 sm:px-4 bg-celestial-void/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Universal Search Command Dialog"
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-white/[0.1] bg-celestial-surface/95 backdrop-blur-2xl shadow-2xl overflow-hidden font-sans flex flex-col max-h-[85vh] max-h-[85dvh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-white/[0.08] px-4 h-14 shrink-0 bg-celestial-surface/50">
          <Search className="w-5 h-5 text-celestial-cyan mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search planets, stars, galaxies, epochs, constellations..."
            className="w-full bg-transparent text-sm sm:text-base text-celestial-starlight placeholder:text-celestial-subtle/50 focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1.5 rounded-lg text-celestial-subtle hover:text-celestial-starlight hover:bg-white/[0.06] transition"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {isSearching && (
            <div className="w-4 h-4 border-2 border-celestial-cyan border-t-transparent rounded-full animate-spin shrink-0 ml-2" />
          )}
        </div>

        {/* Results Container */}
        <div ref={resultsContainerRef} className="overflow-y-auto p-2 space-y-1 max-h-[480px]">
          {results.length > 0 ? (
            results.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectResult(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? "bg-celestial-cyan/15 border border-celestial-cyan/40 text-celestial-starlight shadow-sm"
                      : "hover:bg-white/[0.04] border border-transparent text-celestial-subtle"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 ${
                        isSelected ? "bg-celestial-cyan/25 text-celestial-cyan" : "bg-white/[0.05]"
                      }`}
                    >
                      {getTypeIcon(item.objectType)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-celestial-starlight truncate">
                          {item.canonicalName}
                        </span>
                        {item.matchedAlias && (
                          <span className="text-[11px] font-mono text-celestial-cyan">
                            (matches &ldquo;{item.matchedAlias}&rdquo;)
                          </span>
                        )}
                      </div>

                      {item.summary && (
                        <p className="text-xs text-celestial-subtle/80 line-clamp-1 mt-0.5">
                          {item.summary}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant="outline"
                      className={`font-mono text-[10px] uppercase py-0.5 px-2 ${getTypeBadgeClass(
                        item.objectType
                      )}`}
                    >
                      {item.objectType?.replace(/_/g, " ") || item.classificationCode}
                    </Badge>
                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-celestial-cyan hidden sm:block" />
                    )}
                  </div>
                </div>
              );
            })
          ) : query.trim() ? (
            <div className="text-center py-10 text-celestial-subtle space-y-1">
              <Sparkles className="w-6 h-6 mx-auto text-celestial-subtle/50 mb-2" />
              <p className="text-sm font-medium text-celestial-starlight">
                No celestial records found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-celestial-subtle">
                Try searching by catalog name, constellation, designation, or epoch
              </p>
            </div>
          ) : (
            <div className="p-3 sm:p-4 space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-widest text-celestial-subtle font-semibold px-1">
                Suggested Scales & Catalogs
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { name: "Live Command", href: "/live", type: "MISSION" },
                  { name: "Timeline", href: "/timeline", type: "COSMIC_EPOCH" },
                  { name: "Solar System", href: "/explore", type: "PLANET" },
                  { name: "Live Sky", href: "/sky", type: "CONSTELLATION" },
                  { name: "Star Catalog", href: "/stars", type: "STAR" },
                  { name: "TRAPPIST-1", href: "/systems/trappist-1", type: "EXOPLANET" },
                  { name: "Milky Way", href: "/milky-way", type: "GALAXY" },
                  { name: "Cosmic Web", href: "/cosmic-web", type: "COSMIC_STRUCTURE" },
                  { name: "Observable Universe", href: "/observable-universe", type: "CMB" },
                ].map((sug) => (
                  <button
                    key={sug.name}
                    onClick={() => {
                      onClose();
                      router.push(sug.href);
                    }}
                    className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.08] hover:border-celestial-cyan/30 text-left transition active:scale-[0.98]"
                  >
                    {getTypeIcon(sug.type as SearchResultItem["objectType"])}
                    <span className="text-xs text-celestial-starlight font-medium truncate">
                      {sug.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div className="border-t border-white/[0.08] px-4 py-2.5 bg-celestial-deep/80 flex items-center justify-between text-[11px] font-mono text-celestial-subtle shrink-0">
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] border border-white/[0.1] text-[10px]">
                ↑
              </kbd>{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] border border-white/[0.1] text-[10px]">
                ↓
              </kbd>{" "}
              navigate
            </span>
            <span className="hidden sm:inline">
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] border border-white/[0.1] text-[10px]">
                ↵
              </kbd>{" "}
              open
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] border border-white/[0.1] text-[10px]">
                ESC
              </kbd>{" "}
              close
            </span>
          </div>
          <span className="text-celestial-cyan font-bold tracking-wider">CELESTIAL ATLAS</span>
        </div>
      </div>
    </div>
  );
}
