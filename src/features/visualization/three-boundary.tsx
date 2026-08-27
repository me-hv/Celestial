"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

export interface VisualizationTarget {
  id: string;
  name: string;
  type: string;
  coordinates?: { x: number; y: number; z: number };
}

export interface ThreeCanvasBoundaryProps {
  target?: VisualizationTarget;
  className?: string;
  fallbackMessage?: string;
  onSceneReady?: () => void;
}

/**
 * ThreeCanvasBoundary defines the architectural contract between the UI and the 3D engine.
 * During Phase 0, it renders a performant placeholder canvas container with readiness indicators.
 * In Phase 1, the Three.js WebGL/WebGPU render loop mounts cleanly within this boundary.
 */
export function ThreeCanvasBoundary({
  target,
  className,
  fallbackMessage = "3D Visualization Engine Initialized (Phase 1 Target)",
  onSceneReady,
}: ThreeCanvasBoundaryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulate lightweight boundary readiness
    const timer = setTimeout(() => {
      setIsReady(true);
      onSceneReady?.();
    }, 50);
    return () => clearTimeout(timer);
  }, [onSceneReady]);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="3D Celestial Viewport"
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-xl border border-celestial-muted bg-celestial-deep/50 backdrop-blur-sm",
        className
      )}
    >
      {/* Background Starfield Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />

      {/* Target Crosshair & Metadata Overlay */}
      <div className="relative z-10 text-center p-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-celestial-cyan/30 bg-celestial-cyan/10 text-celestial-cyan text-xs font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-celestial-cyan animate-pulse" />
          {target ? `FOCUS: ${target.name.toUpperCase()}` : "VIEWPORT ACTIVE"}
        </div>
        <p className="text-sm text-celestial-subtle max-w-sm">{fallbackMessage}</p>
      </div>

      {/* Viewport Coordinates Status Bar */}
      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-[10px] font-mono text-celestial-subtle/70 px-2 py-1 bg-celestial-void/60 rounded border border-celestial-muted/50">
        <span>ENGINE: THREE.JS BOUNDARY</span>
        <span>STATUS: {isReady ? "READY" : "MOUNTING..."}</span>
      </div>
    </div>
  );
}
