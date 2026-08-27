"use client";

import React, { useState } from "react";
import { CelestialObject } from "@/domain/celestial-object/types";
import { SolarSystemScene } from "./scene/SolarSystemScene";

export interface ThreeCanvasBoundaryProps {
  selectedObjectId?: string;
  onObjectSelect?: (object: CelestialObject) => void;
  showOrbits?: boolean;
  focusedObjectId?: string;
  className?: string;
  fallbackMessage?: string;
}

/**
 * ThreeCanvasBoundary mounts the real interactive Solar System visualization engine
 * while maintaining clean isolation from non-WebGL UI layers.
 */
export function ThreeCanvasBoundary({
  selectedObjectId,
  onObjectSelect,
  showOrbits = true,
  focusedObjectId,
  className,
}: ThreeCanvasBoundaryProps) {
  const [internalSelectedId, setInternalSelectedId] = useState<string | undefined>(
    selectedObjectId
  );

  const handleSelect = (obj: CelestialObject) => {
    setInternalSelectedId(obj.id);
    onObjectSelect?.(obj);
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      <SolarSystemScene
        selectedObjectId={selectedObjectId || internalSelectedId}
        onObjectSelect={handleSelect}
        showOrbits={showOrbits}
        focusedObjectId={focusedObjectId}
      />
    </div>
  );
}
