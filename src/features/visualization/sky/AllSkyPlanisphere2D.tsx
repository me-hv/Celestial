"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { ObserverLocation, SkyObjectObservation } from "@/domain/observer/types";
import { constellationRepo } from "@/lib/data/constellation-repository";
import {
  projectHorizontalTo2D,
  CelestialProjectionType,
} from "@/lib/astronomy/coordinates/projections";
import { Compass, ZoomIn, ZoomOut, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface AllSkyPlanisphere2DProps {
  location: ObserverLocation;
  date: Date;
  objects: SkyObjectObservation[];
  selectedObjectId?: string;
  onSelectObject?: (object: SkyObjectObservation) => void;
  className?: string;
}

export function AllSkyPlanisphere2D({
  location,
  date,
  objects,
  selectedObjectId,
  onSelectObject,
  className = "",
}: AllSkyPlanisphere2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredObject, setHoveredObject] = useState<SkyObjectObservation | null>(null);
  const [zoom, setZoom] = useState(1.0);
  const [showConstellations, setShowConstellations] = useState(true);
  const [projection, setProjection] = useState<CelestialProjectionType>("AZIMUTHAL_EQUIDISTANT");

  // Helper: Map (Alt, Az) to 2D Planisphere (x, y) coordinates via Projections Engine
  const project = useCallback(
    (altDeg: number, azDeg: number, centerX: number, centerY: number, maxRadius: number) => {
      const pt = projectHorizontalTo2D(
        altDeg,
        azDeg,
        { centerX, centerY, maxRadius, zoom },
        projection
      );
      return { x: pt.x, y: pt.y, r: Math.sqrt((pt.x - centerX) ** 2 + (pt.y - centerY) ** 2) };
    },
    [projection, zoom]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.clientWidth || 650;
    const height = canvas.clientHeight || 650;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear Background
    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.44 * zoom;

    // 1. Draw Horizon Circular Mask & Base Sky
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#09121d";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#22c55e"; // Emerald horizon ring
    ctx.stroke();

    // 2. Draw Altitude Circles (30°, 60°)
    [30, 60].forEach((alt) => {
      const r = maxRadius * ((90.0 - alt) / 90.0);
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(71, 85, 105, 0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = "rgba(148, 163, 184, 0.4)";
      ctx.font = "9px monospace";
      ctx.fillText(`${alt}°`, centerX + 4, centerY - r + 10);
    });

    // 3. Draw Azimuth Radials (N-S, E-W)
    ctx.strokeStyle = "rgba(71, 85, 105, 0.25)";
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - maxRadius);
    ctx.lineTo(centerX, centerY + maxRadius);
    ctx.moveTo(centerX - maxRadius, centerY);
    ctx.lineTo(centerX + maxRadius, centerY);
    ctx.stroke();

    // 4. Draw Cardinal Markers (N, E, S, W)
    ctx.font = "bold 12px monospace";
    ctx.fillStyle = "#ef4444"; // North is Red
    ctx.fillText("N", centerX - 4, centerY - maxRadius - 10);
    ctx.fillStyle = "#38bdf8"; // East, South, West are Cyan
    ctx.fillText("E", centerX - maxRadius - 18, centerY + 4);
    ctx.fillText("S", centerX - 4, centerY + maxRadius + 18);
    ctx.fillText("W", centerX + maxRadius + 8, centerY + 4);

    // 5. Draw Constellation Asterism Lines
    if (showConstellations) {
      ctx.strokeStyle = "rgba(99, 102, 241, 0.5)"; // Indigo line glow
      ctx.lineWidth = 1.2;

      const constellations = constellationRepo.getAll();
      constellations.forEach((c) => {
        c.asterismLines.forEach((line) => {
          const startObs = objects.find(
            (o) =>
              Math.hypot(o.raDeg - line.startCoords.raDeg, o.decDeg - line.startCoords.decDeg) < 3.0
          );
          const endObs = objects.find(
            (o) =>
              Math.hypot(o.raDeg - line.endCoords.raDeg, o.decDeg - line.endCoords.decDeg) < 3.0
          );

          if (
            startObs &&
            endObs &&
            startObs.horizontal.isAboveHorizon &&
            endObs.horizontal.isAboveHorizon
          ) {
            const p1 = project(
              startObs.horizontal.apparentAltitudeDeg,
              startObs.horizontal.azimuthDeg,
              centerX,
              centerY,
              maxRadius
            );
            const p2 = project(
              endObs.horizontal.apparentAltitudeDeg,
              endObs.horizontal.azimuthDeg,
              centerX,
              centerY,
              maxRadius
            );

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });
    }

    // 6. Draw Celestial Objects (Stars, Planets, Moon, Deep Sky)
    objects.forEach((obj) => {
      if (!obj.horizontal.isAboveHorizon) return;

      const p = project(
        obj.horizontal.apparentAltitudeDeg,
        obj.horizontal.azimuthDeg,
        centerX,
        centerY,
        maxRadius
      );

      const isSelected = obj.objectId === selectedObjectId;
      const isHovered = obj.objectId === hoveredObject?.objectId;

      let radius = 2.5;
      let color = "#ffffff";

      if (obj.type === "PLANET") {
        radius = 5.0;
        color = "#38bdf8";
      } else if (obj.type === "MOON") {
        radius = 7.0;
        color = "#fef08a";
      } else if (
        obj.type === "GALAXY" ||
        obj.type === "NEBULA" ||
        obj.type === "PLANETARY_NEBULA"
      ) {
        radius = 4.0;
        color = "#c084fc";
      } else {
        const mag = obj.apparentMagnitudeV ?? 5.0;
        radius = Math.max(1.8, (6.5 - mag) * 1.2);
        color = mag < 1.0 ? "#f8fafc" : "#cbd5e1";
      }

      // Main Node
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, isSelected ? radius + 2 : radius, 0, Math.PI * 2);
      ctx.fill();

      // Outer Selection Ring
      if (isSelected || isHovered) {
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius + 4, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 10px monospace";
        ctx.fillText(obj.canonicalName, p.x + radius + 5, p.y + 3);
      }
    });
  }, [location, date, objects, selectedObjectId, hoveredObject, zoom, showConstellations, project]);

  // Pointer Interaction
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) * 0.44 * zoom;

    let found: SkyObjectObservation | null = null;
    for (const obj of objects) {
      if (obj.horizontal.isAboveHorizon) {
        const p = project(
          obj.horizontal.apparentAltitudeDeg,
          obj.horizontal.azimuthDeg,
          centerX,
          centerY,
          maxRadius
        );
        const dist = Math.hypot(mouseX - p.x, mouseY - p.y);
        if (dist <= 12) {
          found = obj;
          break;
        }
      }
    }
    setHoveredObject(found);
  };

  const handleClick = () => {
    if (hoveredObject && onSelectObject) {
      onSelectObject(hoveredObject);
    }
  };

  return (
    <div
      className={`relative w-full h-full min-h-[580px] rounded-2xl overflow-hidden bg-celestial-void border border-celestial-muted/80 shadow-2xl select-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        onClick={handleClick}
        className="w-full h-full cursor-crosshair"
      />

      {/* Floating Canvas Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 p-1.5 rounded-xl bg-celestial-surface/85 border border-celestial-muted/80 backdrop-blur-md flex-wrap">
        <div className="flex items-center bg-celestial-void/60 rounded-lg p-0.5 border border-celestial-muted/50 text-[10px] font-mono">
          <button
            onClick={() => setProjection("AZIMUTHAL_EQUIDISTANT")}
            className={`px-2 py-1 rounded transition ${
              projection === "AZIMUTHAL_EQUIDISTANT"
                ? "bg-celestial-cyan/20 text-celestial-cyan font-bold"
                : "text-celestial-subtle hover:text-celestial-starlight"
            }`}
            title="Azimuthal Equidistant (Linear Zenith Angle)"
          >
            Equidistant
          </button>
          <button
            onClick={() => setProjection("STEREOGRAPHIC")}
            className={`px-2 py-1 rounded transition ${
              projection === "STEREOGRAPHIC"
                ? "bg-celestial-cyan/20 text-celestial-cyan font-bold"
                : "text-celestial-subtle hover:text-celestial-starlight"
            }`}
            title="Stereographic (Conformal, true shape preservation)"
          >
            Stereographic
          </button>
          <button
            onClick={() => setProjection("ORTHOGRAPHIC")}
            className={`px-2 py-1 rounded transition ${
              projection === "ORTHOGRAPHIC"
                ? "bg-celestial-cyan/20 text-celestial-cyan font-bold"
                : "text-celestial-subtle hover:text-celestial-starlight"
            }`}
            title="Orthographic (Perspective 3D dome)"
          >
            Orthographic
          </button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowConstellations((s) => !s)}
          className={`p-1.5 h-8 px-2 text-xs font-mono gap-1 ${
            showConstellations ? "text-celestial-cyan" : "text-celestial-subtle"
          }`}
          title="Toggle Constellations"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Constellations</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setZoom((z) => Math.min(2.0, z * 1.2))}
          className="p-1.5 h-8 w-8 text-celestial-starlight"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setZoom((z) => Math.max(0.8, z / 1.2))}
          className="p-1.5 h-8 w-8 text-celestial-starlight"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setZoom(1.0)}
          className="p-1.5 h-8 w-8 text-celestial-starlight"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Reference Overlay */}
      <div className="absolute top-4 left-4 z-10 font-mono text-[11px] text-celestial-subtle bg-celestial-surface/85 px-3 py-1.5 rounded-lg border border-celestial-muted/80 backdrop-blur-md pointer-events-none">
        <div className="flex items-center gap-1.5 text-celestial-starlight font-semibold">
          <Compass className="w-3.5 h-3.5 text-celestial-cyan" />
          <span>
            All-Sky Planisphere (
            {projection === "AZIMUTHAL_EQUIDISTANT"
              ? "Azimuthal Equidistant Projection"
              : projection === "STEREOGRAPHIC"
                ? "Conformal Stereographic Projection"
                : "Orthographic Dome Projection"}
            )
          </span>
        </div>
      </div>
    </div>
  );
}
