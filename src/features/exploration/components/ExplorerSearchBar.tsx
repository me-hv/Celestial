"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Sparkles, Orbit, Globe2 } from "lucide-react";
import { CelestialObject } from "@/domain/celestial-object/types";
import { celestialRepo } from "@/lib/data/celestial-repository";
import { SearchResultItem } from "@/features/search/types";
import { Badge } from "@/components/ui/badge";

export interface ExplorerSearchBarProps {
  onSelectObject: (object: CelestialObject) => void;
  className?: string;
}

export function ExplorerSearchBar({ onSelectObject, className = "" }: ExplorerSearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      const response = await celestialRepo.search({ query: query.trim(), limit: 7 });
      setResults(response.results);
      setIsOpen(response.results.length > 0);
    };

    const timer = setTimeout(handleSearch, 100);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemClick = (item: SearchResultItem) => {
    const obj = celestialRepo.getById(item.id);
    if (obj) {
      onSelectObject(obj);
      setQuery("");
      setIsOpen(false);
    }
  };

  const getIcon = (type: SearchResultItem["objectType"]) => {
    switch (type) {
      case "STAR":
        return <Sparkles className="w-4 h-4 text-celestial-amber" />;
      case "EXOPLANET":
        return <Orbit className="w-4 h-4 text-celestial-cyan" />;
      case "MOON":
        return <Orbit className="w-4 h-4 text-celestial-subtle" />;
      default:
        return <Globe2 className="w-4 h-4 text-celestial-cyan" />;
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full max-w-md ${className}`}>
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-celestial-subtle pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stars, exoplanets (e.g. TRAPPIST-1 e, Proxima b, Mars)..."
          className="w-full h-10 pl-10 pr-10 rounded-lg border border-celestial-muted bg-celestial-surface/80 text-sm text-celestial-starlight placeholder:text-celestial-subtle/60 backdrop-blur-md focus:outline-none focus:border-celestial-cyan focus:ring-1 focus:ring-celestial-cyan font-sans"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 text-xs font-mono text-celestial-subtle hover:text-celestial-starlight"
          >
            CLEAR
          </button>
        )}
      </div>

      {/* Search Dropdown */}
      {isOpen && (
        <div className="absolute top-12 left-0 right-0 rounded-xl border border-celestial-muted bg-celestial-surface/95 backdrop-blur-xl shadow-2xl z-40 overflow-hidden py-1.5 space-y-0.5">
          {results.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-celestial-muted/60 transition-colors text-left group"
            >
              <div className="flex items-center gap-2.5">
                {getIcon(item.objectType)}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-celestial-starlight">
                      {item.canonicalName}
                    </span>
                    {item.matchedAlias && (
                      <span className="text-[11px] font-mono text-celestial-cyan">
                        (matches &quot;{item.matchedAlias}&quot;)
                      </span>
                    )}
                  </div>
                  {item.standardDesignation && (
                    <span className="text-[11px] font-mono text-celestial-subtle">
                      {item.standardDesignation}
                    </span>
                  )}
                </div>
              </div>
              <Badge variant="outline" className="text-[10px]">
                {item.objectType || item.classificationCode.replace(/_/g, " ")}
              </Badge>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
