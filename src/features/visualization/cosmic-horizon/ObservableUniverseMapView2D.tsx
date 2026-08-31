"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  RedshiftShell,
  ObservationalLandmark,
  CosmicHorizon,
} from "@/domain/observable-universe/types";
import { defaultCosmology } from "@/lib/astronomy/cosmology/cosmology-calculator";

export type Map2DMode = "COMOVING_VS_LOOKBACK" | "REDSHIFT_VS_AGE" | "ANGULAR_DIAMETER_TURNOVER";

interface ObservableUniverseMapView2DProps {
  shells: RedshiftShell[];
  landmarks: ObservationalLandmark[];
  horizons?: CosmicHorizon[];
  selectedLandmarkSlug?: string;
  onSelectLandmark?: (landmark: ObservationalLandmark) => void;
}

export const ObservableUniverseMapView2D: React.FC<ObservableUniverseMapView2DProps> = ({
  landmarks,
  selectedLandmarkSlug,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mode, setMode] = useState<Map2DMode>("COMOVING_VS_LOOKBACK");

  // Redraw Canvas on Resize or Mode Change
  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = { top: 40, right: 40, bottom: 60, left: 70 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    // Clear Background
    ctx.fillStyle = "#030712"; // Dark slate void
    ctx.fillRect(0, 0, width, height);

    // Draw Grid Lines
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;

    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (plotHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + plotWidth, y);
      ctx.stroke();

      const x = padding.left + (plotWidth / 5) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, padding.top + plotHeight);
      ctx.stroke();
    }

    if (mode === "COMOVING_VS_LOOKBACK") {
      // X = Comoving Distance (0 to 48 Gly), Y = Lookback Time (0 to 13.8 Gyr)
      const maxDistGly = 48.0;
      const maxLookbackGyr = 13.8;

      // Draw FLRW Lookback vs Comoving curve
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      const steps = 150;
      for (let i = 0; i <= steps; i++) {
        const z = (i / steps) * 15.0;
        const distGly = defaultCosmology.calculateComovingDistanceMpc(z) * 0.00326156;
        const lookbackGyr = defaultCosmology.calculateLookbackTimeGyr(z);

        const px = padding.left + (distGly / maxDistGly) * plotWidth;
        const py = padding.top + plotHeight - (lookbackGyr / maxLookbackGyr) * plotHeight;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Axis Labels
      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px monospace";
      ctx.textAlign = "center";
      ctx.fillText(
        "Comoving Distance (Billion Light-Years)",
        padding.left + plotWidth / 2,
        height - 15
      );

      ctx.save();
      ctx.translate(20, padding.top + plotHeight / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText("Lookback Time (Gyr)", 0, 0);
      ctx.restore();

      // X-Ticks
      [0, 10, 20, 30, 40, 48].forEach((val) => {
        const x = padding.left + (val / maxDistGly) * plotWidth;
        ctx.fillText(`${val} Gly`, x, height - 38);
      });

      // Y-Ticks
      ctx.textAlign = "right";
      [0, 3, 6, 9, 12, 13.8].forEach((val) => {
        const y = padding.top + plotHeight - (val / maxLookbackGyr) * plotHeight;
        ctx.fillText(`${val} Gyr`, padding.left - 10, y + 4);
      });

      // Plot Landmarks
      landmarks.forEach((landmark) => {
        const distGly = landmark.comovingDistanceGly;
        const lookback = landmark.lookbackTimeGyr;
        const px = padding.left + (Math.min(distGly, maxDistGly) / maxDistGly) * plotWidth;
        const py =
          padding.top +
          plotHeight -
          (Math.min(lookback, maxLookbackGyr) / maxLookbackGyr) * plotHeight;

        const isSelected = selectedLandmarkSlug === landmark.slug;

        ctx.fillStyle = isSelected ? "#ffffff" : "#f59e0b";
        ctx.beginPath();
        ctx.arc(px, py, isSelected ? 5 : 3.5, 0, 2 * Math.PI);
        ctx.fill();

        if (
          isSelected ||
          landmark.category === "HIGH_Z_GALAXY" ||
          landmark.slug === "quasar-3c-273"
        ) {
          ctx.fillStyle = "#e2e8f0";
          ctx.font = "10px monospace";
          ctx.textAlign = "left";
          ctx.fillText(landmark.name.split(" ")[0], px + 7, py - 4);
        }
      });
    } else if (mode === "REDSHIFT_VS_AGE") {
      // X = Redshift z (0 to 15), Y = Cosmic Age (0 to 13.8 Gyr)
      const maxZ = 15.0;
      const maxAgeGyr = 13.8;

      ctx.strokeStyle = "#a855f7";
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      const steps = 150;
      for (let i = 0; i <= steps; i++) {
        const z = (i / steps) * maxZ;
        const ageGyr = defaultCosmology.calculateCosmicAgeGyr(z);

        const px = padding.left + (z / maxZ) * plotWidth;
        const py = padding.top + plotHeight - (ageGyr / maxAgeGyr) * plotHeight;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Axis Labels
      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px monospace";
      ctx.textAlign = "center";
      ctx.fillText("Redshift (z)", padding.left + plotWidth / 2, height - 15);

      ctx.save();
      ctx.translate(20, padding.top + plotHeight / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText("Cosmic Age at Emission (Gyr)", 0, 0);
      ctx.restore();

      // X-Ticks
      [0, 2, 4, 6, 8, 10, 12, 14].forEach((val) => {
        const x = padding.left + (val / maxZ) * plotWidth;
        ctx.fillText(`z=${val}`, x, height - 38);
      });

      // Y-Ticks
      ctx.textAlign = "right";
      [0, 2, 4, 6, 8, 10, 12, 13.8].forEach((val) => {
        const y = padding.top + plotHeight - (val / maxAgeGyr) * plotHeight;
        ctx.fillText(`${val} Gyr`, padding.left - 10, y + 4);
      });

      // Plot Landmarks
      landmarks.forEach((landmark) => {
        if (landmark.redshiftZ > maxZ) return;
        const z = landmark.redshiftZ;
        const age = landmark.cosmicAgeAtEmissionGyr;
        const px = padding.left + (z / maxZ) * plotWidth;
        const py = padding.top + plotHeight - (age / maxAgeGyr) * plotHeight;

        const isSelected = selectedLandmarkSlug === landmark.slug;

        ctx.fillStyle = isSelected ? "#ffffff" : "#ec4899";
        ctx.beginPath();
        ctx.arc(px, py, isSelected ? 5 : 3.5, 0, 2 * Math.PI);
        ctx.fill();

        if (isSelected || landmark.category === "HIGH_Z_GALAXY") {
          ctx.fillStyle = "#e2e8f0";
          ctx.font = "10px monospace";
          ctx.textAlign = "left";
          ctx.fillText(landmark.name.split(" ")[0], px + 7, py - 4);
        }
      });
    } else {
      // ANGULAR_DIAMETER_TURNOVER: X = Redshift z (0 to 10), Y = Angular Diameter Distance D_A (0 to 2000 Mpc)
      const maxZ = 10.0;
      const maxDaMpc = 2000.0;

      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      const steps = 150;
      for (let i = 0; i <= steps; i++) {
        const z = (i / steps) * maxZ;
        const daMpc = defaultCosmology.calculateAngularDiameterDistanceMpc(z);

        const px = padding.left + (z / maxZ) * plotWidth;
        const py = padding.top + plotHeight - (daMpc / maxDaMpc) * plotHeight;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Peak turnover line at z ~ 1.6
      const peakZ = 1.6;
      const peakDa = defaultCosmology.calculateAngularDiameterDistanceMpc(peakZ);
      const peakX = padding.left + (peakZ / maxZ) * plotWidth;
      const peakY = padding.top + plotHeight - (peakDa / maxDaMpc) * plotHeight;

      ctx.strokeStyle = "#f59e0b";
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(peakX, padding.top + plotHeight);
      ctx.lineTo(peakX, peakY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#f59e0b";
      ctx.font = "10px monospace";
      ctx.textAlign = "center";
      ctx.fillText("Peak D_A at z ≈ 1.6", peakX, peakY - 10);

      // Axis Labels
      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px monospace";
      ctx.textAlign = "center";
      ctx.fillText("Redshift (z)", padding.left + plotWidth / 2, height - 15);

      ctx.save();
      ctx.translate(20, padding.top + plotHeight / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText("Angular Diameter Distance D_A (Mpc)", 0, 0);
      ctx.restore();

      // X-Ticks
      [0, 1.6, 3, 5, 7, 10].forEach((val) => {
        const x = padding.left + (val / maxZ) * plotWidth;
        ctx.fillText(`z=${val}`, x, height - 38);
      });

      // Y-Ticks
      ctx.textAlign = "right";
      [0, 500, 1000, 1500, 2000].forEach((val) => {
        const y = padding.top + plotHeight - (val / maxDaMpc) * plotHeight;
        ctx.fillText(`${val} Mpc`, padding.left - 10, y + 4);
      });
    }
  }, [mode, landmarks, selectedLandmarkSlug]);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  return (
    <div
      className="flex flex-col w-full h-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden"
      data-testid="observable-universe-map-2d"
    >
      {/* Mode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-900/80 border-b border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono font-bold text-slate-200">2D Spacetime Graph:</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setMode("COMOVING_VS_LOOKBACK")}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
              mode === "COMOVING_VS_LOOKBACK"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Distance vs Lookback
          </button>
          <button
            onClick={() => setMode("REDSHIFT_VS_AGE")}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
              mode === "REDSHIFT_VS_AGE"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Redshift vs Age
          </button>
          <button
            onClick={() => setMode("ANGULAR_DIAMETER_TURNOVER")}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
              mode === "ANGULAR_DIAMETER_TURNOVER"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Angular Diameter (D_A)
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative flex-1 min-h-[360px] p-2">
        <canvas ref={canvasRef} width={800} height={400} className="w-full h-full rounded-lg" />
      </div>
    </div>
  );
};
