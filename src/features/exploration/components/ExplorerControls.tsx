"use client";

import React from "react";
import { Eye, EyeOff, RotateCcw, Info } from "lucide-react";
import { CelestialObject } from "@/domain/celestial-object/types";
import { Button } from "@/components/ui/button";

export interface ExplorerControlsProps {
  objects: CelestialObject[];
  selectedObjectId?: string;
  onSelectObject: (object: CelestialObject) => void;
  showOrbits: boolean;
  onToggleOrbits: () => void;
  onResetView: () => void;
  onOpenScaleInfo: () => void;
}

export function ExplorerControls({
  objects,
  selectedObjectId,
  onSelectObject,
  showOrbits,
  onToggleOrbits,
  onResetView,
  onOpenScaleInfo,
}: ExplorerControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 w-full">
      {/* Quick Celestial Object Selector Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 max-w-full no-scrollbar">
        {objects.map((obj) => {
          const isSelected = obj.id === selectedObjectId;
          return (
            <button
              key={obj.id}
              onClick={() => onSelectObject(obj)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap border ${
                isSelected
                  ? "bg-celestial-cyan text-celestial-void border-celestial-cyan shadow-glow-cyan"
                  : "bg-celestial-surface/80 text-celestial-subtle border-celestial-muted/80 hover:text-celestial-starlight hover:bg-celestial-surface"
              }`}
            >
              {obj.canonicalName}
            </button>
          );
        })}
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onToggleOrbits}
          className="gap-1.5 text-xs font-mono"
          title="Toggle Orbit Lines"
        >
          {showOrbits ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">Orbits</span>
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={onResetView}
          className="gap-1.5 text-xs font-mono"
          title="Reset Camera Overview"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset View</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenScaleInfo}
          className="p-2 text-celestial-subtle hover:text-celestial-cyan"
          title="Visualization Scale Explained"
        >
          <Info className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
