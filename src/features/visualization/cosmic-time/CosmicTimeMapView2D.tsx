"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { CosmicEpoch } from "@/domain/cosmic-time/types";
import { defaultCosmology } from "@/lib/astronomy/cosmology/cosmology-calculator";
import { EPOCH_COLOR_MAP } from "./cosmic-time-renderer";

interface LandmarkObject {
  name: string;
  slug: string;
  redshiftZ: number;
  lookbackGyr: number;
  description: string;
}

const LANDMARK_OBJECTS: LandmarkObject[] = [
  {
    name: "Milky Way Galaxy",
    slug: "milky-way-galaxy",
    redshiftZ: 0.0,
    lookbackGyr: 0.0,
    description: "Our home galaxy at present observational epoch.",
  },
  {
    name: "Andromeda Galaxy (M31)",
    slug: "andromeda-galaxy",
    redshiftZ: 0.0001,
    lookbackGyr: 0.0025,
    description: "Nearest major spiral galaxy (~2.5 Mly).",
  },
  {
    name: "M87 (Virgo Cluster Core)",
    slug: "m87-galaxy",
    redshiftZ: 0.0044,
    lookbackGyr: 0.054,
    description: "Giant central elliptical in Virgo Cluster (~54 Mly).",
  },
  {
    name: "Coma Cluster (Abell 1656)",
    slug: "coma-cluster",
    redshiftZ: 0.0231,
    lookbackGyr: 0.32,
    description: "Dense rich galaxy cluster (~320 Mly).",
  },
  {
    name: "Cosmic Noon Peak",
    slug: "cosmic-noon",
    redshiftZ: 2.0,
    lookbackGyr: 10.5,
    description: "Peak star formation rate density of the Universe.",
  },
  {
    name: "GN-z11",
    slug: "gn-z11",
    redshiftZ: 10.6,
    lookbackGyr: 13.38,
    description: "Luminous primeval galaxy in Ursa Major observed by HST/JWST.",
  },
  {
    name: "JADES-GS-z14-0",
    slug: "jades-gs-z14-0",
    redshiftZ: 14.32,
    lookbackGyr: 13.51,
    description: "Spectroscopically confirmed primeval galaxy 290 Myr post-Big Bang.",
  },
  {
    name: "CMB Decoupling Surface",
    slug: "recombination",
    redshiftZ: 1089.0,
    lookbackGyr: 13.79,
    description: "Last scattering surface of primordial photons.",
  },
];

interface CosmicTimeMapView2DProps {
  epochs: CosmicEpoch[];
  selectedEpochSlug?: string;
  onSelectEpoch?: (slug: string) => void;
  currentLookbackGyr?: number;
  onTimeChange?: (lookbackGyr: number) => void;
}

export const CosmicTimeMapView2D: React.FC<CosmicTimeMapView2DProps> = ({
  epochs,
  selectedEpochSlug,
  onSelectEpoch: _onSelectEpoch,
  currentLookbackGyr = 0,
  onTimeChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [hoveredObject, setHoveredObject] = useState<{
    name: string;
    text: string;
    x: number;
    y: number;
  } | null>(null);

  const universeAgeGyr = defaultCosmology.calculateUniverseAgeGyr();

  const drawMap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background
    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, width, height);

    const paddingLeft = 60;
    const paddingRight = 40;
    const paddingTop = 40;
    const paddingBottom = 60;

    const plotWidth = width - paddingLeft - paddingRight;
    const plotHeight = height - paddingTop - paddingBottom;

    // 1. Draw Epoch Color Bands
    epochs.forEach((epoch) => {
      const minLookback = epoch.lookbackTimeRangeGyr.minGyr;
      const maxLookback = epoch.lookbackTimeRangeGyr.maxGyr;

      const x1 = paddingLeft + (minLookback / universeAgeGyr) * plotWidth;
      const x2 = paddingLeft + (maxLookback / universeAgeGyr) * plotWidth;
      const bandWidth = Math.max(2, x2 - x1);

      const colorHex = EPOCH_COLOR_MAP[epoch.type]?.hex ?? "#38bdf8";
      const isSelected = selectedEpochSlug === epoch.slug;

      ctx.fillStyle = colorHex;
      ctx.globalAlpha = isSelected ? 0.35 : 0.12;
      ctx.fillRect(x1, paddingTop, bandWidth, plotHeight);

      // Epoch boundary line
      ctx.strokeStyle = colorHex;
      ctx.globalAlpha = isSelected ? 0.9 : 0.3;
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(x1, paddingTop);
      ctx.lineTo(x1, paddingTop + plotHeight);
      ctx.stroke();
    });

    ctx.globalAlpha = 1.0;

    // 2. Draw Scale Factor Curve a(t)
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    const sampleSteps = 200;
    for (let i = 0; i <= sampleSteps; i++) {
      const tLookback = (i / sampleSteps) * universeAgeGyr;
      const tAge = Math.max(0.001, universeAgeGyr - tLookback);
      const z = defaultCosmology.cosmicAgeToRedshift(tAge);
      const a = defaultCosmology.redshiftToScaleFactor(z);

      const px = paddingLeft + (tLookback / universeAgeGyr) * plotWidth;
      const py = paddingTop + plotHeight - a * plotHeight;

      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // 3. Grid Lines and Axis Labels
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#64748b";
    ctx.font = "10px monospace";

    // Y Axis (Scale Factor a: 0.0, 0.2, 0.4, 0.6, 0.8, 1.0)
    for (let aVal = 0; aVal <= 1.0; aVal += 0.2) {
      const py = paddingTop + plotHeight - aVal * plotHeight;
      ctx.beginPath();
      ctx.moveTo(paddingLeft, py);
      ctx.lineTo(paddingLeft + plotWidth, py);
      ctx.stroke();

      ctx.fillText(aVal.toFixed(1), paddingLeft - 30, py + 3);
    }

    // X Axis (Lookback Time Gyr: 0, 2, 4, 6, 8, 10, 12, 13.8)
    const xTicks = [0, 2, 4, 6, 8, 10, 12, 13.8];
    xTicks.forEach((tVal) => {
      const px = paddingLeft + (tVal / universeAgeGyr) * plotWidth;
      ctx.beginPath();
      ctx.moveTo(px, paddingTop);
      ctx.lineTo(px, paddingTop + plotHeight);
      ctx.stroke();

      ctx.fillText(`${tVal} Gyr`, px - 18, paddingTop + plotHeight + 18);
    });

    // Axis Titles
    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px monospace";
    ctx.fillText("LOOKBACK TIME (Gyr)", paddingLeft + plotWidth / 2 - 60, height - 15);

    ctx.save();
    ctx.translate(18, paddingTop + plotHeight / 2 + 50);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("SCALE FACTOR a(t)", 0, 0);
    ctx.restore();

    // 4. Current Time Cursor
    const cursorX = paddingLeft + (currentLookbackGyr / universeAgeGyr) * plotWidth;
    ctx.strokeStyle = "#22d3ee";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cursorX, paddingTop);
    ctx.lineTo(cursorX, paddingTop + plotHeight);
    ctx.stroke();
    ctx.setLineDash([]);

    // 5. Plot Landmark Objects
    LANDMARK_OBJECTS.forEach((obj) => {
      const a = defaultCosmology.redshiftToScaleFactor(obj.redshiftZ);

      const px = paddingLeft + (obj.lookbackGyr / universeAgeGyr) * plotWidth;
      const py = paddingTop + plotHeight - a * plotHeight;

      ctx.fillStyle = "#f8fafc";
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "9px monospace";
      ctx.fillText(obj.name, px + 8, py - 4);
    });
  }, [epochs, selectedEpochSlug, currentLookbackGyr, universeAgeGyr]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      canvasRef.current.width = containerRef.current.clientWidth;
      canvasRef.current.height = containerRef.current.clientHeight || 360;
      drawMap();
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawMap]);

  useEffect(() => {
    drawMap();
  }, [drawMap]);

  const handlePointer = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const paddingLeft = 60;
    const paddingRight = 40;
    const plotWidth = canvas.width - paddingLeft - paddingRight;

    if (x >= paddingLeft && x <= paddingLeft + plotWidth) {
      const lookbackGyr = ((x - paddingLeft) / plotWidth) * universeAgeGyr;
      const clampedGyr = Math.max(0, Math.min(universeAgeGyr, lookbackGyr));

      if (onTimeChange) {
        onTimeChange(clampedGyr);
      }

      // Check if near any landmark object
      const matched = LANDMARK_OBJECTS.find((obj) => {
        const objX = paddingLeft + (obj.lookbackGyr / universeAgeGyr) * plotWidth;
        return Math.abs(x - objX) < 12;
      });

      if (matched) {
        setHoveredObject({
          name: matched.name,
          text: `z = ${matched.redshiftZ} • Lookback: ${matched.lookbackGyr} Gyr\n${matched.description}`,
          x: x + 10,
          y: y + 10,
        });
      } else {
        setHoveredObject(null);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[360px] bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden"
      data-testid="cosmic-time-map-2d-container"
    >
      <div className="absolute top-3 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <span className="text-xs font-mono font-semibold text-slate-300">
          SPACETIME EXPANSION MAP 2D [a(t) vs LOOKBACK TIME]
        </span>
      </div>

      <canvas
        ref={canvasRef}
        onMouseMove={handlePointer}
        onClick={handlePointer}
        className="w-full h-full cursor-crosshair"
      />

      {hoveredObject && (
        <div
          className="absolute z-20 pointer-events-none px-3 py-2 rounded-md bg-slate-900/95 border border-cyan-500/60 shadow-xl shadow-cyan-950/60 backdrop-blur-md text-xs font-mono text-slate-200"
          style={{ left: hoveredObject.x, top: hoveredObject.y }}
        >
          <div className="font-semibold text-cyan-300">{hoveredObject.name}</div>
          <div className="text-[11px] text-slate-400 whitespace-pre-line">{hoveredObject.text}</div>
        </div>
      )}
    </div>
  );
};
