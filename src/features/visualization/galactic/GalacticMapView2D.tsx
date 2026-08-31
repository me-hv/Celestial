"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { GalacticStructure } from "@/domain/galactic-structure/types";
import { CelestialObject } from "@/domain/celestial-object/types";
import {
  SPIRAL_ARM_DEFINITIONS,
  generateSpiralArmPoints,
} from "@/lib/astronomy/galactic/spiral-arms";
import {
  GALACTOCENTRIC_CONSTANTS,
  equatorialToGalactocentric,
} from "@/lib/astronomy/coordinates/galactocentric";
import { ZoomIn, ZoomOut, RotateCcw, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface GalacticMapView2DProps {
  structures: GalacticStructure[];
  nearbyStars?: CelestialObject[];
  stellarSystems?: CelestialObject[];
  deepSkyObjects?: CelestialObject[];
  selectedStructureSlug?: string;
  onSelectStructure?: (structure: GalacticStructure) => void;
  onSelectObject?: (object: CelestialObject) => void;
  showOverlayObjects?: boolean;
  className?: string;
}

export function GalacticMapView2D({
  structures,
  nearbyStars = [],
  stellarSystems = [],
  deepSkyObjects = [],
  onSelectStructure,
  onSelectObject: _onSelectObject,
  showOverlayObjects = false,
  className = "",
}: GalacticMapView2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredStructure, setHoveredStructure] = useState<GalacticStructure | null>(null);

  const resetView = useCallback(() => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleZoomIn = () => setZoom((z) => Math.min(4.0, z * 1.25));
  const handleZoomOut = () => setZoom((z) => Math.max(0.75, z / 1.25));

  // Render 2D Top-Down Galactic Map
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

    // 1. Background Void
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2 + pan.x;
    const centerY = height / 2 + pan.y;

    const basePixelsPerKpc = (Math.min(width, height) * 0.42) / 25.0;
    const scale = basePixelsPerKpc * zoom;

    const project = (xKpc: number, yKpc: number) => {
      return {
        x: centerX + xKpc * scale,
        y: centerY - yKpc * scale,
      };
    };

    // 2. Concentric Galactocentric Radius Rings (4, 8, 12, 16, 20, 24 kpc)
    const radiusGrid = [4, 8.178, 12, 16, 20, 24];
    ctx.font = "10px monospace";

    radiusGrid.forEach((rKpc) => {
      const isSolar = Math.abs(rKpc - 8.178) < 0.1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, rKpc * scale, 0, Math.PI * 2);
      ctx.strokeStyle = isSolar ? "rgba(56, 189, 248, 0.45)" : "rgba(71, 85, 105, 0.25)";
      ctx.lineWidth = isSolar ? 1.5 : 1.0;
      if (!isSolar) ctx.setLineDash([4, 4]);
      else ctx.setLineDash([]);
      ctx.stroke();

      // Radius Label
      ctx.fillStyle = isSolar ? "#38BDF8" : "rgba(148, 163, 184, 0.5)";
      const label = isSolar ? `Solar Orbit (~8.18 kpc)` : `${rKpc} kpc`;
      ctx.fillText(label, centerX + 6, centerY - rKpc * scale + 12);
    });
    ctx.setLineDash([]);

    // 3. Principal Galactocentric Axes
    ctx.strokeStyle = "rgba(71, 85, 105, 0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX - 25 * scale, centerY);
    ctx.lineTo(centerX + 25 * scale, centerY);
    ctx.moveTo(centerX, centerY - 25 * scale);
    ctx.lineTo(centerX, centerY + 25 * scale);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = "rgba(148, 163, 184, 0.4)";
    ctx.fillText("+X (GC Axis)", centerX + 23 * scale, centerY - 4);
    ctx.fillText("+Y (Rotation l=90°)", centerX + 4, centerY - 23 * scale);

    // 4. Central Bar Representation (Length ~ 10 kpc, Angle ~ 29°)
    const barAngleRad = (29.0 * Math.PI) / 180.0;
    const barHalfKpc = 5.0;
    const barP1 = project(-barHalfKpc * Math.cos(barAngleRad), -barHalfKpc * Math.sin(barAngleRad));
    const barP2 = project(barHalfKpc * Math.cos(barAngleRad), barHalfKpc * Math.sin(barAngleRad));

    ctx.strokeStyle = "rgba(245, 158, 11, 0.35)";
    ctx.lineWidth = 14 * zoom;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(barP1.x, barP1.y);
    ctx.lineTo(barP2.x, barP2.y);
    ctx.stroke();

    // Central Bulge Circle (Radius ~ 2 kpc)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 2.0 * scale, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(253, 224, 71, 0.25)";
    ctx.fill();

    // 5. Draw Parametric Logarithmic Spiral Arms
    SPIRAL_ARM_DEFINITIONS.forEach((arm) => {
      const points = generateSpiralArmPoints(arm, 1.0);
      if (points.length === 0) return;

      // Soft Width Envelope
      ctx.lineWidth = (arm.isSpur ? 8 : 14) * (zoom * 0.8);
      ctx.strokeStyle = arm.color;
      ctx.globalAlpha = arm.isSpur ? 0.25 : 0.18;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      const p0 = project(points[0].xKpc, points[0].yKpc);
      ctx.moveTo(p0.x, p0.y);
      for (let i = 1; i < points.length; i++) {
        const pt = project(points[i].xKpc, points[i].yKpc);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();

      // Sharp Core Centerline
      ctx.lineWidth = arm.isSpur ? 2.0 : 1.5;
      ctx.globalAlpha = 0.85;
      ctx.stroke();

      // Arm Label near midpoint
      const midIdx = Math.floor(points.length / 2);
      const midP = project(points[midIdx].xKpc, points[midIdx].yKpc);
      ctx.fillStyle = arm.color;
      ctx.font = "bold 10px monospace";
      ctx.fillText(arm.shortName, midP.x + 8, midP.y - 4);
    });
    ctx.globalAlpha = 1.0;

    // 6. Galactic Center & Sgr A* Core Marker
    ctx.fillStyle = "#F59E0B";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 10px monospace";
    ctx.fillText("Galactic Center (Sgr A*)", centerX + 8, centerY + 3);

    // 7. Sun / Solar System "YOU ARE HERE" Marker
    const sunKpc = -GALACTOCENTRIC_CONSTANTS.SUN_DISTANCE_TO_GC_PC / 1000.0;
    const sunP = project(sunKpc, 0.0);

    // Beacon Glow Ring
    ctx.strokeStyle = "#38BDF8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sunP.x, sunP.y, 8, 0, Math.PI * 2);
    ctx.stroke();

    // Solar Center Point
    ctx.fillStyle = "#FACC15";
    ctx.beginPath();
    ctx.arc(sunP.x, sunP.y, 4, 0, Math.PI * 2);
    ctx.fill();

    // Solar Label
    ctx.fillStyle = "#38BDF8";
    ctx.font = "bold 11px monospace";
    ctx.fillText("🌞 YOU ARE HERE (Sun / Solar System)", sunP.x + 12, sunP.y + 4);

    // 8. Optional Overlay Objects (Nearby Stars, Exoplanet Systems, Deep Sky)
    if (showOverlayObjects) {
      // Nearby Stars (Cyan dots around Sun)
      nearbyStars.forEach((star) => {
        if (
          star.positional.rightAscensionDeg !== undefined &&
          star.positional.declinationDeg !== undefined &&
          star.positional.distanceLightYears !== undefined
        ) {
          const distPc = star.positional.distanceLightYears / 3.26156;
          const gc = equatorialToGalactocentric(
            star.positional.rightAscensionDeg,
            star.positional.declinationDeg,
            distPc
          );
          const p = project(gc.xPc / 1000.0, gc.yPc / 1000.0);
          ctx.fillStyle = "#38BDF8";
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Deep Sky Objects
      deepSkyObjects.forEach((dso) => {
        if (
          dso.positional.rightAscensionDeg !== undefined &&
          dso.positional.declinationDeg !== undefined &&
          dso.positional.distanceLightYears !== undefined
        ) {
          const distPc = dso.positional.distanceLightYears / 3.26156;
          if (distPc <= 25000) {
            const gc = equatorialToGalactocentric(
              dso.positional.rightAscensionDeg,
              dso.positional.declinationDeg,
              distPc
            );
            const p = project(gc.xPc / 1000.0, gc.yPc / 1000.0);
            ctx.fillStyle = "#F43F5E";
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });
    }
  }, [structures, nearbyStars, stellarSystems, deepSkyObjects, showOverlayObjects, zoom, pan]);

  // Pointer Interaction
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
    const basePixelsPerKpc = (Math.min(width, height) * 0.42) / 25.0;
    const scale = basePixelsPerKpc * zoom;

    const mouseXkpc = (mouseX - centerX) / scale;
    const mouseYkpc = -(mouseY - centerY) / scale;
    const rMouse = Math.sqrt(mouseXkpc * mouseXkpc + mouseYkpc * mouseYkpc);

    // Hit detect Sun / Orion Spur / GC
    if (Math.hypot(mouseXkpc - -8.178, mouseYkpc - 0) < 2.0) {
      setHoveredStructure(structures.find((s) => s.slug === "orion-spur") || null);
    } else if (rMouse < 2.5) {
      setHoveredStructure(structures.find((s) => s.slug === "galactic-center") || null);
    } else {
      setHoveredStructure(null);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    if (hoveredStructure && onSelectStructure) {
      onSelectStructure(hoveredStructure);
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

      {/* Floating Canvas Controls */}
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
          <span>Top-Down Galactocentric Projection (X-Y Plane) · Scale: 1 unit = 1 kpc</span>
        </div>
      </div>
    </div>
  );
}
