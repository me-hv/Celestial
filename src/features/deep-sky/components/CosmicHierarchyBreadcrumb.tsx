"use client";

import React from "react";
import { ChevronRight, Globe } from "lucide-react";
import { CelestialObject } from "@/domain/celestial-object/types";

export interface CosmicHierarchyBreadcrumbProps {
  object: CelestialObject;
  className?: string;
}

export function CosmicHierarchyBreadcrumb({
  object,
  className = "",
}: CosmicHierarchyBreadcrumbProps) {
  const deepSky = object.deepSky;
  const hierarchy = deepSky?.cosmicHierarchy;

  const items: string[] = ["Universe"];

  if (hierarchy?.supercluster) {
    items.push(hierarchy.supercluster);
  }

  if (hierarchy?.clusterOrGroup) {
    items.push(hierarchy.clusterOrGroup);
  }

  if (hierarchy?.hostStructure) {
    items.push(...hierarchy.hostStructure.split(">").map((s) => s.trim()));
  }

  items.push(object.canonicalName);

  return (
    <div
      className={`flex items-center gap-1.5 overflow-x-auto scrollbar-none font-mono text-[11px] p-2.5 rounded-xl border border-celestial-muted/70 bg-celestial-deep/60 text-celestial-subtle ${className}`}
      aria-label="Cosmic Hierarchy Location Indicator"
    >
      <Globe className="w-3.5 h-3.5 text-celestial-cyan shrink-0" />
      <span className="font-semibold text-celestial-cyan">Cosmic Location:</span>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={`${item}-${index}`}>
            {index > 0 && <ChevronRight className="w-3 h-3 text-celestial-muted shrink-0" />}
            <span
              className={
                isLast
                  ? "text-celestial-starlight font-bold truncate"
                  : "text-celestial-subtle hover:text-celestial-starlight transition-colors whitespace-nowrap"
              }
            >
              {item}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}
