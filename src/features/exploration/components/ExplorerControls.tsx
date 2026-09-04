"use client";

import React from "react";
import { Eye, EyeOff, RotateCcw, Info, Compass } from "lucide-react";
import { CelestialObject } from "@/domain/celestial-object/types";
import { Button } from "@/components/ui/button";

export interface ExplorerControlsProps {
  objects: CelestialObject[];
  selectedObjectId?: string;
  onSelectObject: (object: CelestialObject) => void;
  showOrbits: boolean;
  onToggleOrbits: () => void;
  showHabitableZone?: boolean;
  onToggleHabitableZone?: () => void;
  hasHabitableZone?: boolean;
  onResetView: () => void;
  onOpenScaleInfo: () => void;
}

export function ExplorerControls({
  objects,
  selectedObjectId,
  onSelectObject,
  showOrbits,
  onToggleOrbits,
  showHabitableZone = false,
  onToggleHabitableZone,
  hasHabitableZone = false,
  onResetView,
  onOpenScaleInfo,
}: ExplorerControlsProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-3 w-full">
      {/* Body Selector Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none py-1">
        {objects.map((obj) => {
          const isSelected = obj.id === selectedObjectId;
          const isStar = obj.classification.code === "STAR";

          return (
            <button
              key={obj.id}
              onClick={() => onSelectObject(obj)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap border ${
                isSelected
                  ? "bg-celestial-cyan text-celestial-void font-bold border-celestial-cyan shadow-sm shadow-celestial-cyan/20"
                  : isStar
                    ? "bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25"
                    : "bg-celestial-surface/80 text-celestial-subtle border-white/[0.08] hover:text-celestial-starlight hover:border-white/[0.16]"
              }`}
            >
              {obj.canonicalName}
            </button>
          );
        })}
      </div>

      {/* Action Buttons: Orbit Toggle, Habitable Zone Toggle, Reset, Scale Info */}
      <div className="flex items-center gap-2 shrink-0">
        {hasHabitableZone && onToggleHabitableZone && (
          <Button
            variant={showHabitableZone ? "cyan" : "secondary"}
            size="sm"
            onClick={onToggleHabitableZone}
            title={showHabitableZone ? "Hide Habitable Zone" : "Show Habitable Zone"}
            className="gap-1.5 font-mono text-xs"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Habitable Zone</span>
          </Button>
        )}

        <Button
          variant={showOrbits ? "secondary" : "ghost"}
          size="sm"
          onClick={onToggleOrbits}
          title={showOrbits ? "Hide Orbits" : "Show Orbits"}
          className="gap-1.5 font-mono text-xs"
        >
          {showOrbits ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">Orbits</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onResetView}
          title="Reset Camera View"
          className="gap-1.5 font-mono text-xs text-celestial-subtle hover:text-celestial-starlight"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenScaleInfo}
          title="Visualization Scale Paradigm"
          className="p-2 text-celestial-subtle hover:text-celestial-cyan"
        >
          <Info className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
