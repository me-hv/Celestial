"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { CelestialObject } from "@/domain/celestial-object/types";
import { DeepSkyScale } from "@/lib/astronomy/coordinates/deep-sky-scale";
import { getDeepSkyPalette } from "../scene/deep-sky-renderer";
import { ZoomIn, ZoomOut, RotateCcw, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CelestialSkyView2DProps {
  objects: CelestialObject[];
  selectedObjectId?: string;
  onSelectObject?: (object: CelestialObject) => void;
  showGalacticGrid?: boolean;
  className?: string;
}

export function CelestialSkyView2D({
  objects,
  selectedObjectId,
  onSelectObject,
  showGalacticGrid = true,
  className = "",
}: CelestialSkyView2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredObject, setHoveredObject] = useState<CelestialObject | null>(null);

  const resetView = useCallback(() => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleZoomIn = () => setZoom((z) => Math.min(4.0, z * 1.25));
  const handleZoomOut = () => setZoom((z) => Math.max(0.75, z / 1.25));

  // Render 2D Celestial Sky Map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.clientWidth || 800;
    const height = canvas.clientHeight || 550;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear Background
    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2 + pan.x;
    const centerY = height / 2 + pan.y;
    const mapWidth = width * 0.88 * zoom;
    const mapHeight = height * 0.82 * zoom;

    // Helper: Map RA [0, 360) and Dec [-90, +90] to canvas X, Y
    const project = (raDeg: number, decDeg: number) => {
      // RA runs right to left in astronomy (East is Left)
      let raNormalized = (raDeg - 180) / 360.0;
      if (raNormalized > 0.5) raNormalized -= 1.0;
      if (raNormalized < -0.5) raNormalized += 1.0;

      const px = centerX - raNormalized * mapWidth;
      const py = centerY - (decDeg / 180.0) * mapHeight;
      return { x: px, y: py };
    };

    // 1. Draw Equatorial Coordinate Grid (RA / Dec)
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(71, 85, 105, 0.25)";
    ctx.fillStyle = "rgba(148, 163, 184, 0.5)";
    ctx.font = "10px monospace";

    // Declination parallels (-60, -30, 0, +30, +60)
    for (let dec = -60; dec <= 60; dec += 30) {
      const pLeft = project(0, dec);
      const pRight = project(360, dec);
      ctx.beginPath();
      ctx.moveTo(centerX - mapWidth / 2, pLeft.y);
      ctx.lineTo(centerX + mapWidth / 2, pRight.y);
      ctx.stroke();

      const decLabel = `${dec > 0 ? "+" : ""}${dec}°`;
      ctx.fillText(decLabel, centerX - mapWidth / 2 - 28, pLeft.y + 3);
    }

    // Right Ascension meridians (0h, 4h, 8h, 12h, 16h, 20h)
    for (let ra = 0; ra < 360; ra += 60) {
      const pTop = project(ra, 80);
      const pBottom = project(ra, -80);
      ctx.beginPath();
      ctx.moveTo(pTop.x, centerY - mapHeight / 2);
      ctx.lineTo(pBottom.x, centerY + mapHeight / 2);
      ctx.stroke();

      const raHours = `${Math.round(ra / 15)}h`;
      ctx.fillText(raHours, pTop.x - 6, centerY + mapHeight / 2 + 14);
    }

    // 2. Draw Galactic Plane reference equator if enabled
    if (showGalacticGrid) {
      ctx.strokeStyle = "rgba(99, 102, 241, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();

      for (let l = 0; l <= 360; l += 5) {
        // Approximate Galactic Equator (b = 0) in Equatorial RA/Dec
        // using inverse transformation
        const lRad = (l * Math.PI) / 180.0;
        const sinDec =
          Math.cos(27.128 * (Math.PI / 180)) * Math.sin((122.932 - l) * (Math.PI / 180));
        const decRad = Math.asin(Math.max(-1, Math.min(1, sinDec)));
        const decDeg = (decRad * 180) / Math.PI;

        const y = Math.cos(lRad);
        const x = -Math.sin(27.128 * (Math.PI / 180)) * Math.sin(lRad);
        let raRad = (192.86 * Math.PI) / 180 + Math.atan2(y, x);
        const raDeg = ((raRad * 180) / Math.PI) % 360;

        const p = project(raDeg, decDeg);
        if (l === 0) {
          ctx.moveTo(p.x, p.y);
        } else {
          ctx.lineTo(p.x, p.y);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 3. Draw Celestial Objects
    objects.forEach((obj) => {
      if (
        obj.positional.rightAscensionDeg === undefined ||
        obj.positional.declinationDeg === undefined
      ) {
        return;
      }

      const p = project(obj.positional.rightAscensionDeg, obj.positional.declinationDeg);

      // Check if inside canvas viewport
      if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) return;

      const isSelected = obj.id === selectedObjectId;
      const isHovered = obj.id === hoveredObject?.id;
      const palette = getDeepSkyPalette(obj.classification.code);
      const scaling = DeepSkyScale.calculateMagnitudeScaling(
        obj.physical.apparentMagnitudeV,
        obj.classification.code
      );
      const radius = (scaling.radius * 2.2 + (isSelected ? 3 : 0)) * Math.min(1.5, zoom);

      // Object Icon Marker
      ctx.fillStyle = palette.primary;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(2.5, radius), 0, Math.PI * 2);
      ctx.fill();

      // Outer Corona Glow
      ctx.strokeStyle = isSelected ? "#38BDF8" : palette.emissive;
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(4.5, radius + 3), 0, Math.PI * 2);
      ctx.stroke();

      // Label (for selected, hovered, or bright objects)
      if (
        isSelected ||
        isHovered ||
        (obj.physical.apparentMagnitudeV !== undefined && obj.physical.apparentMagnitudeV <= 6.0)
      ) {
        ctx.fillStyle = isSelected ? "#38BDF8" : "#E2E8F0";
        ctx.font = isSelected ? "bold 11px monospace" : "10px monospace";
        const label = obj.standardDesignation || obj.canonicalName;
        ctx.fillText(label, p.x + radius + 5, p.y + 3);
      }
    });
  }, [objects, selectedObjectId, hoveredObject, zoom, pan, showGalacticGrid]);

  // Pointer Interaction Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const centerX = width / 2 + pan.x;
    const centerY = height / 2 + pan.y;
    const mapWidth = width * 0.88 * zoom;
    const mapHeight = height * 0.82 * zoom;

    let found: CelestialObject | null = null;
    for (const obj of objects) {
      if (
        obj.positional.rightAscensionDeg !== undefined &&
        obj.positional.declinationDeg !== undefined
      ) {
        let raNormalized = (obj.positional.rightAscensionDeg - 180) / 360.0;
        if (raNormalized > 0.5) raNormalized -= 1.0;
        if (raNormalized < -0.5) raNormalized += 1.0;

        const px = centerX - raNormalized * mapWidth;
        const py = centerY - (obj.positional.declinationDeg / 180.0) * mapHeight;

        const dist = Math.hypot(mouseX - px, mouseY - py);
        if (dist <= 12) {
          found = obj;
          break;
        }
      }
    }
    setHoveredObject(found);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    if (hoveredObject && onSelectObject) {
      onSelectObject(hoveredObject);
    }
  };

  return (
    <div
      className={`relative w-full h-full min-h-[550px] rounded-2xl overflow-hidden bg-celestial-void border border-celestial-muted/80 shadow-2xl select-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleClick}
        className="w-full h-full cursor-crosshair active:cursor-grabbing"
      />

      {/* Floating Canvas View Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 p-1.5 rounded-xl bg-celestial-surface/85 border border-celestial-muted/80 backdrop-blur-md">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          className="p-1.5 h-8 w-8 text-celestial-starlight"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          className="p-1.5 h-8 w-8 text-celestial-starlight"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetView}
          className="p-1.5 h-8 w-8 text-celestial-starlight"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Reference Information Overlay */}
      <div className="absolute top-4 left-4 z-10 font-mono text-[11px] text-celestial-subtle bg-celestial-surface/85 px-3 py-1.5 rounded-lg border border-celestial-muted/80 backdrop-blur-md pointer-events-none">
        <div className="flex items-center gap-1.5 text-celestial-starlight font-semibold">
          <Compass className="w-3.5 h-3.5 text-celestial-cyan" />
          <span>
            Equatorial Projection (J2000) {showGalacticGrid && "· Galactic Equator (Dashed)"}
          </span>
        </div>
      </div>
    </div>
  );
}
