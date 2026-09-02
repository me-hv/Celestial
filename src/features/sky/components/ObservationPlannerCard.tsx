"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ObserverLocation } from "@/domain/observer/types";
import { generateObservationPlan } from "@/lib/astronomy/planner/observation-planner";
import { Telescope } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface ObservationPlannerCardProps {
  location: ObserverLocation;
  date: Date;
  onSelectTarget?: (slug: string) => void;
  className?: string;
}

export function ObservationPlannerCard({
  location,
  date,
  onSelectTarget,
  className = "",
}: ObservationPlannerCardProps) {
  const [maxMag, setMaxMag] = useState(8.5);
  const [minAlt, setMinAlt] = useState(20.0);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = [
    "ALL",
    "PLANET",
    "STAR",
    "GALAXY",
    "NEBULA",
    "PLANETARY_NEBULA",
    "SUPERNOVA_REMNANT",
  ];

  const plan = useMemo(() => {
    return generateObservationPlan({
      location,
      date,
      maxMagnitudeV: maxMag,
      minAltitudeDeg: minAlt,
      targetTypes: selectedCategory !== "ALL" ? [selectedCategory] : undefined,
    });
  }, [location, date, maxMag, minAlt, selectedCategory]);

  return (
    <div
      className={`p-6 rounded-2xl bg-celestial-surface/90 border border-celestial-muted/80 backdrop-blur-md shadow-2xl space-y-6 font-mono ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-celestial-muted/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Telescope className="w-5 h-5 text-celestial-cyan" />
            <h2 className="text-lg font-bold text-celestial-starlight uppercase">
              Night Sky Observation Session Planner
            </h2>
          </div>
          <p className="text-xs text-celestial-subtle">
            Optimal observational targets for {location.name} on {date.toLocaleDateString()}
          </p>
        </div>
        <Badge variant="cyan" className="text-xs font-mono">
          {plan.totalVisibleTargets} Targets Visible
        </Badge>
      </div>

      {/* 1. Observation Parameters Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-celestial-void/80 border border-celestial-muted/60 text-xs">
        <div className="space-y-1.5">
          <label className="text-[10px] text-celestial-subtle uppercase flex justify-between">
            <span>Faintest Magnitude (Limit)</span>
            <span className="text-celestial-cyan font-bold">≤ {maxMag.toFixed(1)} mag</span>
          </label>
          <input
            type="range"
            min="1.0"
            max="14.0"
            step="0.5"
            value={maxMag}
            onChange={(e) => setMaxMag(parseFloat(e.target.value))}
            className="w-full accent-celestial-cyan cursor-pointer"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-celestial-subtle uppercase flex justify-between">
            <span>Min Culmination Altitude</span>
            <span className="text-celestial-cyan font-bold">≥ {minAlt.toFixed(0)}°</span>
          </label>
          <input
            type="range"
            min="5.0"
            max="80.0"
            step="5.0"
            value={minAlt}
            onChange={(e) => setMinAlt(parseFloat(e.target.value))}
            className="w-full accent-celestial-cyan cursor-pointer"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] text-celestial-subtle uppercase">Target Class Filter</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg bg-celestial-surface border border-celestial-muted text-celestial-starlight text-xs font-mono focus:outline-none focus:border-celestial-cyan"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Target Observation List Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse font-mono">
          <thead>
            <tr className="border-b border-celestial-muted/70 text-[10px] text-celestial-subtle uppercase tracking-wider">
              <th className="py-2.5 px-3">Target</th>
              <th className="py-2.5 px-3">Class</th>
              <th className="py-2.5 px-3">Constellation</th>
              <th className="py-2.5 px-3">V Mag</th>
              <th className="py-2.5 px-3">Culmination</th>
              <th className="py-2.5 px-3">Recommended Gear</th>
              <th className="py-2.5 px-3">Score</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-celestial-muted/40">
            {plan.targets.slice(0, 15).map((target) => (
              <tr
                key={`${target.objectId}-${target.objectSlug}`}
                className="hover:bg-celestial-void/60 transition"
              >
                <td className="py-2.5 px-3 font-semibold text-celestial-starlight">
                  {target.canonicalName}
                </td>
                <td className="py-2.5 px-3">
                  <Badge
                    variant="outline"
                    className="text-[9px] uppercase py-0 border-celestial-muted"
                  >
                    {target.type}
                  </Badge>
                </td>
                <td className="py-2.5 px-3 text-celestial-cyan">{target.constellation}</td>
                <td className="py-2.5 px-3">
                  {target.apparentMagnitudeV !== undefined
                    ? target.apparentMagnitudeV.toFixed(2)
                    : "—"}
                </td>
                <td className="py-2.5 px-3">
                  <span className="font-bold text-celestial-starlight">
                    +{target.transitAltitudeDeg}°
                  </span>{" "}
                  <span className="text-[10px] text-celestial-subtle">
                    (
                    {target.transitTime
                      ? target.transitTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                    )
                  </span>
                </td>
                <td className="py-2.5 px-3">
                  <Badge variant="violet" className="text-[9px] uppercase">
                    {target.recommendedEquipment.replace("_", " ")}
                  </Badge>
                </td>
                <td className="py-2.5 px-3">
                  <span className="text-emerald-400 font-bold">{target.observingScore}/100</span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/research?target=${target.objectSlug}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-[10px] font-mono text-celestial-purple hover:bg-celestial-purple/10"
                      >
                        Research
                      </Button>
                    </Link>
                    {onSelectTarget ? (
                      <Button
                        onClick={() => onSelectTarget(target.objectSlug)}
                        variant="ghost"
                        size="sm"
                        className="h-6 text-[10px] font-mono text-celestial-cyan hover:bg-celestial-cyan/10"
                      >
                        Focus
                      </Button>
                    ) : (
                      <Link href={`/sky?target=${target.objectSlug}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[10px] font-mono text-celestial-cyan hover:bg-celestial-cyan/10"
                        >
                          Focus
                        </Button>
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
