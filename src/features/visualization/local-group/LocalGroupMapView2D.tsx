"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Galaxy } from "@/domain/galaxy/types";
import { equatorialToLocalGroup } from "@/lib/astronomy/coordinates/local-group";
import { LocalGroupScale } from "@/lib/astronomy/coordinates/local-group-scale";

export interface LocalGroupMapView2DProps {
  galaxies: Galaxy[];
  selectedGalaxySlug?: string;
  onSelectGalaxy?: (galaxy: Galaxy) => void;
  className?: string;
}

export const LocalGroupMapView2D: React.FC<LocalGroupMapView2DProps> = ({
  galaxies,
  selectedGalaxySlug,
  onSelectGalaxy,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredGalaxy, setHoveredGalaxy] = useState<Galaxy | null>(null);

  // Galaxy 2D Positions cache
  const galaxyPositionsRef = useRef<
    Map<string, { xPix: number; yPix: number; xKpc: number; yKpc: number; galaxy: Galaxy }>
  >(new Map());

  // Render Loop
  const drawMap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // 1. Clear background
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, width, height);

    // 2. Draw Subtle Radial Star Background
    const centerX = width / 2 + pan.x;
    const centerY = height / 2 + pan.y;

    const bgGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      10,
      centerX,
      centerY,
      Math.max(width, height) * 0.7
    );
    bgGradient.addColorStop(0, "rgba(15, 23, 42, 0.9)");
    bgGradient.addColorStop(1, "rgba(2, 6, 23, 1.0)");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 3. Draw Concentric Distance Rings (100 kpc, 250 kpc, 500 kpc, 1000 kpc, 1500 kpc)
    const rings = [
      { rKpc: 100, label: "100 kpc (~326 kly)" },
      { rKpc: 250, label: "250 kpc (~815 kly)" },
      { rKpc: 500, label: "500 kpc (~1.63 Mly)" },
      { rKpc: 1000, label: "1.0 Mpc (~3.26 Mly)" },
      { rKpc: 1500, label: "1.5 Mpc (~4.89 Mly)" },
    ];

    rings.forEach((ring) => {
      const p = LocalGroupScale.localGroupToMap2D(ring.rKpc, 0, width, height, zoom, pan);
      const rPix = Math.abs(p.x - centerX);

      ctx.beginPath();
      ctx.arc(centerX, centerY, rPix, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.15)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Ring Label
      ctx.fillStyle = "rgba(148, 163, 184, 0.5)";
      ctx.font = "10px monospace";
      ctx.fillText(ring.label, centerX + 6, centerY - rPix + 12);
    });

    // 4. Draw Reference Grid Axes
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // 5. Calculate and Draw Galaxy Nodes
    galaxyPositionsRef.current.clear();

    galaxies.forEach((galaxy) => {
      let xKpc = 0;
      let yKpc = 0;

      if (galaxy.slug === "milky-way-galaxy") {
        xKpc = 0;
        yKpc = 0;
      } else if (
        galaxy.positional.rightAscensionDeg !== undefined &&
        galaxy.positional.declinationDeg !== undefined
      ) {
        const coords = equatorialToLocalGroup(
          galaxy.positional.rightAscensionDeg,
          galaxy.positional.declinationDeg,
          galaxy.distance.distanceKpc.value
        );
        xKpc = coords.xKpc;
        yKpc = coords.yKpc;
      }

      const pPix = LocalGroupScale.localGroupToMap2D(xKpc, yKpc, width, height, zoom, pan);
      galaxyPositionsRef.current.set(galaxy.slug, {
        xPix: pPix.x,
        yPix: pPix.y,
        xKpc,
        yKpc,
        galaxy,
      });
    });

    // 6. Draw Inter-Galaxy Interaction Vectors
    galaxies.forEach((galaxy) => {
      const posA = galaxyPositionsRef.current.get(galaxy.slug);
      if (!posA || !galaxy.relationships) return;

      galaxy.relationships.forEach((rel) => {
        const posB = galaxyPositionsRef.current.get(rel.targetGalaxySlug);
        if (!posB) return;

        ctx.beginPath();
        ctx.moveTo(posA.xPix, posA.yPix);
        ctx.lineTo(posB.xPix, posB.yPix);

        if (rel.relationshipType === "APPROACHING") {
          ctx.strokeStyle = "rgba(244, 63, 94, 0.4)";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 3]);
        } else if (rel.relationshipType === "SATELLITE_OF" || rel.relationshipType === "HOST_TO") {
          ctx.strokeStyle = "rgba(52, 211, 153, 0.3)";
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 2]);
        } else {
          ctx.strokeStyle = "rgba(56, 189, 248, 0.2)";
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
        }

        ctx.stroke();
        ctx.setLineDash([]);
      });
    });

    // 7. Render Galaxy Markers and Badges
    galaxyPositionsRef.current.forEach(({ xPix, yPix, galaxy }) => {
      const isSelected = selectedGalaxySlug === galaxy.slug;
      const isHovered = hoveredGalaxy?.slug === galaxy.slug;

      let radius = 6;
      let markerColor = "#38bdf8";

      if (galaxy.slug === "milky-way-galaxy") {
        radius = 8;
        markerColor = "#f59e0b"; // Warm gold for home galaxy
      } else if (galaxy.slug === "andromeda-galaxy") {
        radius = 9;
        markerColor = "#ec4899"; // Magenta for Andromeda
      } else if (galaxy.slug === "triangulum-galaxy") {
        radius = 7;
        markerColor = "#06b6d4"; // Cyan for Triangulum
      } else if (
        galaxy.morphology.class === "IRREGULAR" ||
        galaxy.morphology.class === "DWARF_IRREGULAR"
      ) {
        markerColor = "#a855f7"; // Purple for Magellanic irregulars
      }

      // Selection Glow
      if (isSelected || isHovered) {
        ctx.beginPath();
        ctx.arc(xPix, yPix, radius + 8, 0, 2 * Math.PI);
        ctx.fillStyle = isSelected ? "rgba(56, 189, 248, 0.3)" : "rgba(255, 255, 255, 0.15)";
        ctx.fill();
      }

      // Marker Core
      ctx.beginPath();
      ctx.arc(xPix, yPix, radius, 0, 2 * Math.PI);
      ctx.fillStyle = markerColor;
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.stroke();

      // Label
      ctx.fillStyle = isSelected ? "#38bdf8" : "#f1f5f9";
      ctx.font = isSelected ? "bold 12px sans-serif" : "11px sans-serif";
      ctx.fillText(galaxy.name, xPix + radius + 6, yPix + 4);

      // Distance tag
      if (galaxy.slug !== "milky-way-galaxy") {
        ctx.fillStyle = "rgba(148, 163, 184, 0.8)";
        ctx.font = "10px monospace";
        ctx.fillText(
          `${galaxy.distance.distanceMpc.value.toFixed(2)} Mpc`,
          xPix + radius + 6,
          yPix + 16
        );
      } else {
        ctx.fillStyle = "rgba(245, 158, 11, 0.9)";
        ctx.font = "10px monospace";
        ctx.fillText("YOU ARE HERE", xPix + radius + 6, yPix + 16);
      }
    });
  }, [galaxies, selectedGalaxySlug, hoveredGalaxy, zoom, pan]);

  // Handle Resize & Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);
      drawMap();
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [drawMap]);

  useEffect(() => {
    drawMap();
  }, [drawMap]);

  // Mouse Interaction (Pan, Zoom, Click)
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);

    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
      return;
    }

    // Hit Testing for hover
    let found: Galaxy | null = null;
    galaxyPositionsRef.current.forEach(({ xPix, yPix, galaxy }) => {
      const dist = Math.hypot(mouseX - xPix, mouseY - yPix);
      if (dist < 16) {
        found = galaxy;
      }
    });

    setHoveredGalaxy(found);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);

    galaxyPositionsRef.current.forEach(({ xPix, yPix, galaxy }) => {
      const dist = Math.hypot(mouseX - xPix, mouseY - yPix);
      if (dist < 18) {
        onSelectGalaxy?.(galaxy);
      }
    });
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    setZoom((prev) => Math.max(0.4, Math.min(4.0, prev * zoomFactor)));
  };

  return (
    <div className={`relative w-full h-full min-h-[500px] overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        onWheel={handleWheel}
      />

      {/* Floating Zoom & Pan Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 bg-slate-900/80 backdrop-blur-md border border-white/10 p-1.5 rounded-xl shadow-lg">
        <button
          onClick={() => setZoom((z) => Math.min(4.0, z * 1.25))}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono text-sm"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.4, z / 1.25))}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono text-sm"
          title="Zoom Out"
        >
          -
        </button>
        <button
          onClick={() => {
            setZoom(1.0);
            setPan({ x: 0, y: 0 });
          }}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
          title="Reset View"
        >
          1x
        </button>
      </div>

      {/* Projection Disclaimer */}
      <div className="absolute bottom-4 right-4 z-10 text-[10px] text-slate-400 bg-slate-950/70 backdrop-blur-sm border border-white/5 rounded-lg px-2.5 py-1">
        2D Top-Down Projection (Galactocentric XY Midplane)
      </div>
    </div>
  );
};
