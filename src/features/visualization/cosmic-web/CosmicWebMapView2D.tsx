"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { CosmicStructure } from "@/domain/cosmic-structure/types";
import {
  cosmicMpcToCanvas2D,
  CosmicMapScalePreset,
  SCALE_PRESET_BOUNDS_MPC,
} from "@/lib/astronomy/coordinates/cosmic-scale";

interface CosmicWebMapView2DProps {
  structures: CosmicStructure[];
  selectedSlug?: string;
  onSelectStructure?: (structure: CosmicStructure) => void;
  scalePreset?: CosmicMapScalePreset;
  onScalePresetChange?: (preset: CosmicMapScalePreset) => void;
  coordinateMode?: "SUPERGALACTIC" | "GALACTOCENTRIC";
}

export function CosmicWebMapView2D({
  structures,
  selectedSlug,
  onSelectStructure,
  scalePreset = "LOCAL_SUPERCLUSTER",
  onScalePresetChange,
  coordinateMode = "SUPERGALACTIC",
}: CosmicWebMapView2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredStructure, setHoveredStructure] = useState<{
    structure: CosmicStructure;
    x: number;
    y: number;
  } | null>(null);

  const maxMpcSpan = SCALE_PRESET_BOUNDS_MPC[scalePreset];

  // Render 2D map on canvas
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, width, height);

    // Draw reference distance rings
    const ringRadii =
      scalePreset === "LOCAL_VOLUME"
        ? [2, 5, 10, 15]
        : scalePreset === "LOCAL_SUPERCLUSTER"
          ? [10, 25, 50]
          : scalePreset === "LANIAKEA"
            ? [25, 50, 100, 150]
            : [50, 100, 200, 300];

    ringRadii.forEach((radiusMpc) => {
      const { px, py } = cosmicMpcToCanvas2D(0, 0, width, height, maxMpcSpan, zoom, pan.x, pan.y);
      const halfMin = Math.min(width, height) * 0.45;
      const rPixels = (halfMin / maxMpcSpan) * zoom * radiusMpc;

      ctx.beginPath();
      ctx.arc(px, py, rPixels, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.15)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label
      ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
      ctx.font = "10px monospace";
      ctx.fillText(`${radiusMpc} Mpc`, px + rPixels + 4, py - 2);
    });

    // Draw coordinate axes
    const center = cosmicMpcToCanvas2D(0, 0, width, height, maxMpcSpan, zoom, pan.x, pan.y);
    ctx.beginPath();
    ctx.moveTo(center.px, 0);
    ctx.lineTo(center.px, height);
    ctx.moveTo(0, center.py);
    ctx.lineTo(width, center.py);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw structures
    structures.forEach((struct) => {
      const isSuper = coordinateMode === "SUPERGALACTIC" && struct.coordinates.supergalactic;
      const xMpc = isSuper
        ? struct.coordinates.supergalactic!.sgxMpc
        : struct.coordinates.galactocentricCartesianMpc.xMpc;
      const yMpc = isSuper
        ? struct.coordinates.supergalactic!.sgyMpc
        : struct.coordinates.galactocentricCartesianMpc.yMpc;

      const { px, py, isVisible } = cosmicMpcToCanvas2D(
        xMpc,
        yMpc,
        width,
        height,
        maxMpcSpan,
        zoom,
        pan.x,
        pan.y
      );

      if (!isVisible) return;

      const isSelected = selectedSlug === struct.slug;

      // Color mapping by structure type
      let fillColor = "#38bdf8";
      let radius = 5;

      switch (struct.type) {
        case "GALAXY_CLUSTER":
          fillColor = "#f59e0b"; // Amber
          radius = 8;
          break;
        case "GALAXY_GROUP":
          fillColor = "#38bdf8"; // Cyan
          radius = 5;
          break;
        case "SUPERCLUSTER":
          fillColor = "#a855f7"; // Purple
          radius = 12;
          break;
        case "VOID":
          fillColor = "#64748b"; // Slate
          radius = 14;
          break;
        case "WALL":
        case "SHEET":
          fillColor = "#10b981"; // Emerald
          radius = 7;
          break;
        case "FILAMENT":
          fillColor = "#06b6d4";
          radius = 6;
          break;
      }

      // Draw boundary aura for superclusters / voids
      if (struct.type === "SUPERCLUSTER" || struct.type === "VOID") {
        ctx.beginPath();
        const halfMin = Math.min(width, height) * 0.45;
        const charRadius = struct.dimensions.characteristicRadiusMpc ?? 20;
        const hullRPixels = (halfMin / maxMpcSpan) * zoom * charRadius;
        ctx.arc(px, py, hullRPixels, 0, 2 * Math.PI);
        ctx.fillStyle =
          struct.type === "VOID" ? "rgba(15, 23, 42, 0.4)" : "rgba(168, 85, 247, 0.08)";
        ctx.fill();
        ctx.strokeStyle =
          struct.type === "VOID" ? "rgba(100, 116, 139, 0.3)" : "rgba(168, 85, 247, 0.25)";
        ctx.setLineDash([2, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, 2 * Math.PI);
      ctx.fillStyle = fillColor;
      ctx.fill();

      if (isSelected) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();

        // Target reticle
        ctx.beginPath();
        ctx.arc(px, py, radius + 5, 0, 2 * Math.PI);
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Label text
      ctx.fillStyle = isSelected ? "#ffffff" : "rgba(226, 232, 240, 0.85)";
      ctx.font = isSelected ? "bold 11px monospace" : "10px monospace";
      ctx.fillText(struct.name, px + radius + 4, py + 3);
    });

    // You Are Here indicator at (0, 0)
    const yah = cosmicMpcToCanvas2D(0, 0, width, height, maxMpcSpan, zoom, pan.x, pan.y);
    ctx.beginPath();
    ctx.arc(yah.px, yah.py, 4, 0, 2 * Math.PI);
    ctx.fillStyle = "#38bdf8";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 10px monospace";
    ctx.fillText("YOU ARE HERE (Milky Way)", yah.px + 8, yah.py - 6);
  }, [structures, selectedSlug, scalePreset, maxMpcSpan, zoom, pan, coordinateMode]);

  // Handle canvas sizing and re-render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    render();
  }, [render]);

  // Mouse interaction handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Check hit test against structures
    let found: CosmicStructure | null = null;
    structures.forEach((struct) => {
      const isSuper = coordinateMode === "SUPERGALACTIC" && struct.coordinates.supergalactic;
      const xMpc = isSuper
        ? struct.coordinates.supergalactic!.sgxMpc
        : struct.coordinates.galactocentricCartesianMpc.xMpc;
      const yMpc = isSuper
        ? struct.coordinates.supergalactic!.sgyMpc
        : struct.coordinates.galactocentricCartesianMpc.yMpc;

      const { px, py } = cosmicMpcToCanvas2D(
        xMpc,
        yMpc,
        canvas.width,
        canvas.height,
        maxMpcSpan,
        zoom,
        pan.x,
        pan.y
      );

      const dist = Math.hypot(mouseX - px, mouseY - py);
      if (dist <= 14) {
        found = struct;
      }
    });

    if (found) {
      setHoveredStructure({ structure: found, x: mouseX, y: mouseY });
      canvas.style.cursor = "pointer";
    } else {
      setHoveredStructure(null);
      canvas.style.cursor = "default";
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 0.85;
    setZoom((prev) => Math.max(0.5, Math.min(6.0, prev * factor)));
  };

  const handleClick = (_e: React.MouseEvent<HTMLCanvasElement>) => {
    if (hoveredStructure && onSelectStructure) {
      onSelectStructure(hoveredStructure.structure);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleClick}
        className="w-full h-full"
      />

      {/* Scale Preset Selector Bar */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-1.5 rounded-xl bg-slate-900/80 p-1.5 backdrop-blur-md border border-white/10 text-xs font-mono">
        <span className="px-2 text-[11px] text-slate-400 font-semibold">Scale:</span>
        {(["LOCAL_VOLUME", "LOCAL_SUPERCLUSTER", "LANIAKEA", "COSMIC_WEB"] as const).map(
          (preset) => (
            <button
              key={preset}
              onClick={() => {
                if (onScalePresetChange) onScalePresetChange(preset);
                setZoom(1.0);
                setPan({ x: 0, y: 0 });
              }}
              className={`rounded-lg px-2.5 py-1 transition-all ${
                scalePreset === preset
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-glow-cyan"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {preset.replace(/_/g, " ")} (±{SCALE_PRESET_BOUNDS_MPC[preset]} Mpc)
            </button>
          )
        )}
      </div>

      {/* Hover tooltip */}
      {hoveredStructure && (
        <div
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-lg border border-cyan-500/30 bg-slate-900/90 px-3 py-2 text-xs shadow-xl backdrop-blur-md"
          style={{
            left: `${hoveredStructure.x}px`,
            top: `${hoveredStructure.y - 10}px`,
          }}
        >
          <p className="font-semibold text-white font-mono">{hoveredStructure.structure.name}</p>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-300 font-mono">
            <span className="text-cyan-400">
              {hoveredStructure.structure.type.replace(/_/g, " ")}
            </span>
            <span>•</span>
            <span>{hoveredStructure.structure.coordinates.distanceMpc.value.toFixed(1)} Mpc</span>
          </div>
        </div>
      )}

      {/* Bottom controls & watermark */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex flex-col gap-1 rounded-lg bg-slate-900/60 p-2 text-[11px] text-slate-400 backdrop-blur-sm border border-white/5 font-mono">
        <span className="text-white font-semibold">2D EXTRAGALACTIC MAP</span>
        <span>
          Projection:{" "}
          {coordinateMode === "SUPERGALACTIC"
            ? "Supergalactic (SGX, SGY)"
            : "Galactocentric (X, Y)"}
        </span>
        <span>Drag to Pan • Scroll to Zoom</span>
      </div>
    </div>
  );
}
