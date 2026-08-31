"use client";

import React from "react";
import Link from "next/link";
import { Galaxy } from "@/domain/galaxy/types";
import { formatGalaxyDistance, formatLookbackTime } from "@/lib/astronomy/cosmology/distance";
import { GalaxyMorphologyBadge } from "./GalaxyMorphologyBadge";
import { Button } from "@/components/ui/button";

export interface GalaxyTelemetryPanelProps {
  galaxy: Galaxy;
  onClose?: () => void;
  className?: string;
}

export const GalaxyTelemetryPanel: React.FC<GalaxyTelemetryPanelProps> = ({
  galaxy,
  onClose,
  className = "",
}) => {
  const isMilkyWay = galaxy.slug === "milky-way-galaxy";

  return (
    <div
      className={`bg-slate-950/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 overflow-y-auto max-h-[85vh] text-slate-200 ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GalaxyMorphologyBadge
              morphologyClass={galaxy.morphology.class}
              hubbleType={galaxy.morphology.hubbleDeVaucouleurs}
            />
            {galaxy.groupMembership && (
              <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                {galaxy.groupMembership.groupName}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{galaxy.name}</h2>
          {galaxy.standardDesignation && (
            <p className="text-xs font-mono text-slate-400 mt-0.5">{galaxy.standardDesignation}</p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            aria-label="Close panel"
          >
            ✕
          </button>
        )}
      </div>

      {/* Summary */}
      <p className="text-sm text-slate-300 leading-relaxed">{galaxy.summary}</p>

      {/* Primary Extragalactic Telemetry */}
      <div className="grid grid-cols-2 gap-3 bg-slate-900/60 border border-white/5 rounded-xl p-4">
        <div>
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Distance
          </span>
          <span className="text-sm font-semibold text-cyan-300 font-mono">
            {isMilkyWay
              ? "Home Galaxy"
              : formatGalaxyDistance(
                  galaxy.distance.distanceLy.value,
                  galaxy.distance.distanceLy.uncertainty
                )}
          </span>
          {!isMilkyWay && (
            <span className="text-[10px] text-slate-400 block font-mono">
              {galaxy.distance.distanceKpc.value.toFixed(1)} kpc ({galaxy.distance.primaryMethod})
            </span>
          )}
        </div>

        <div>
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Lookback Time
          </span>
          <span className="text-sm font-semibold text-emerald-300 font-mono">
            {isMilkyWay
              ? "Present Epoch"
              : formatLookbackTime(galaxy.distance.derivedLookbackTimeYears)}
          </span>
          {!isMilkyWay && (
            <span className="text-[10px] text-slate-400 block font-mono">
              t = d / c light travel
            </span>
          )}
        </div>

        <div>
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Diameter
          </span>
          <span className="text-sm font-semibold text-white font-mono">
            ~{Math.round(galaxy.physical.diameterLy.value).toLocaleString()} ly
          </span>
          <span className="text-[10px] text-slate-400 block font-mono">
            {galaxy.physical.diameterKpc.value.toFixed(1)} kpc
          </span>
        </div>

        <div>
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Total Mass (M_virial)
          </span>
          <span className="text-sm font-semibold text-amber-300 font-mono">
            {galaxy.physical.totalMassSolar
              ? `${(galaxy.physical.totalMassSolar.value / 1e12).toFixed(2)} × 10¹² M☉`
              : "N/A"}
          </span>
          {galaxy.physical.stellarMassSolar && (
            <span className="text-[10px] text-slate-400 block font-mono">
              Stellar: {(galaxy.physical.stellarMassSolar.value / 1e10).toFixed(1)} × 10¹⁰ M☉
            </span>
          )}
        </div>
      </div>

      {/* Kinematics & Orientation */}
      <div className="space-y-2">
        <h3 className="text-xs font-mono font-semibold uppercase text-slate-400 tracking-wider">
          Kinematics & Orientation
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-900/40 p-2.5 rounded-lg border border-white/5">
            <span className="text-slate-400 block text-[10px]">Radial Velocity (v_r)</span>
            <span className="font-mono font-semibold text-white">
              {galaxy.kinematics.heliocentricRadialVelocityKmS.value > 0 ? "+" : ""}
              {galaxy.kinematics.heliocentricRadialVelocityKmS.value.toFixed(1)} km/s
            </span>
            {galaxy.kinematics.spectroscopicRedshiftZ && (
              <span className="text-[10px] text-slate-400 block font-mono">
                z = {galaxy.kinematics.spectroscopicRedshiftZ.value.toFixed(6)}
              </span>
            )}
          </div>

          <div className="bg-slate-900/40 p-2.5 rounded-lg border border-white/5">
            <span className="text-slate-400 block text-[10px]">Inclination & PA</span>
            <span className="font-mono font-semibold text-white">
              i = {galaxy.orientation.inclinationDeg.toFixed(1)}° | PA ={" "}
              {galaxy.orientation.positionAngleDeg.toFixed(1)}°
            </span>
            <span className="text-[10px] text-slate-400 block font-mono">
              b/a = {galaxy.orientation.axisRatio.toFixed(3)}
            </span>
          </div>
        </div>
      </div>

      {/* Known Relationships */}
      {galaxy.relationships && galaxy.relationships.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-semibold uppercase text-slate-400 tracking-wider">
            Key Relationships & Interactions
          </h3>
          <div className="space-y-2">
            {galaxy.relationships.map((rel, idx) => (
              <div
                key={idx}
                className="bg-slate-900/40 border border-white/5 p-2.5 rounded-lg text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-cyan-300">{rel.targetGalaxyName}</span>
                  <span className="text-[10px] font-mono uppercase bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                    {rel.relationshipType.replace(/_/g, " ")}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">{rel.description}</p>
                {rel.separationKpc && (
                  <span className="text-[10px] font-mono text-slate-500 block">
                    Separation: {rel.separationKpc} kpc (~
                    {Math.round(rel.separationKpc * 3.262).toLocaleString()} kly)
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Provenance & Citation */}
      <div className="border-t border-white/10 pt-3 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center justify-between">
          <span>Source: {galaxy.provenance.catalogName}</span>
          <span className="font-mono text-cyan-400 font-semibold">
            {Math.round(galaxy.provenance.confidenceScore * 100)}% Confidence
          </span>
        </div>
        {galaxy.provenance.citationUrl && (
          <a
            href={galaxy.provenance.citationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline block truncate text-[10px]"
          >
            {galaxy.provenance.citationUrl}
          </a>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-1">
        <Link href={`/galaxies/${galaxy.slug}`} className="flex-1">
          <Button variant="default" className="w-full text-xs font-mono">
            Full Galaxy Profile →
          </Button>
        </Link>
        {!isMilkyWay && (
          <Link href={`/galaxies/compare?a=milky-way-galaxy&b=${galaxy.slug}`} className="flex-1">
            <Button variant="outline" className="w-full text-xs font-mono">
              Compare with MW
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
