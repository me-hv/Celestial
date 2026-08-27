"use client";

import React, { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface SearchModalTriggerProps {
  placeholder?: string;
  className?: string;
  onSearchSubmit?: (query: string) => void;
}

export function SearchModalTrigger({
  placeholder = "Search the universe...",
  className,
  onSearchSubmit,
}: SearchModalTriggerProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearchSubmit?.(query.trim());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("relative flex items-center w-full max-w-2xl group transition-all", className)}
    >
      <div className="absolute left-4 text-celestial-subtle group-focus-within:text-celestial-cyan transition-colors pointer-events-none">
        <Search className="w-5 h-5" />
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Search the universe"
        className="w-full h-14 pl-12 pr-28 rounded-xl border border-celestial-muted bg-celestial-surface/80 text-celestial-starlight placeholder:text-celestial-subtle/50 text-base shadow-subtle-card backdrop-blur-md focus:outline-none focus:border-celestial-cyan/80 focus:ring-2 focus:ring-celestial-cyan/20 transition-all font-sans"
      />

      <div className="absolute right-3 flex items-center gap-1.5 pointer-events-none">
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono font-medium text-celestial-subtle bg-celestial-muted/80 rounded border border-celestial-border/40">
          <Sparkles className="w-3 h-3 text-celestial-cyan" />
          <span>ESC</span>
        </kbd>
      </div>
    </form>
  );
}
