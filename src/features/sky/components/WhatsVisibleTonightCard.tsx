"use client";

import React, { useState, useMemo } from "react";
import { SkyObjectObservation } from "@/domain/observer/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowUpRight, Sun, Moon, Star, Orbit, Disc, Compass } from "lucide-react";

export interface WhatsVisibleTonightCardProps {
  objects: SkyObjectObservation[];
  selectedObjectId?: string;
  onSelectObject: (obs: SkyObjectObservation) => void;
  className?: string;
}

type FilterCategory = "ALL" | "BEST" | "RISING" | "CULMINATING" | "SETTING";

export function WhatsVisibleTonightCard({
  objects,
  selectedObjectId,
  onSelectObject,
  className = "",
}: WhatsVisibleTonightCardProps) {
  const [activeTab, setActiveTab] = useState<FilterCategory>("BEST");

  // Partition objects into categorized observation lists
  const categorized = useMemo(() => {
    const aboveHorizon = objects.filter((o) => o.horizontal.isAboveHorizon);

    // 1. Best Tonight: Brightest objects with altitude > 25°
    const best = [...aboveHorizon]
      .filter((o) => o.horizontal.apparentAltitudeDeg >= 25.0)
      .sort((a, b) => (a.apparentMagnitudeV ?? 10) - (b.apparentMagnitudeV ?? 10));

    // 2. Rising: Above horizon and hourAngle < 0, or rising state
    const rising = aboveHorizon.filter(
      (o) =>
        o.state === "RISING" ||
        (o.horizontal.apparentAltitudeDeg < 30 && o.horizontal.hourAngleDeg < 0)
    );

    // 3. Culminating: Near upper transit (abs(hourAngle) < 15°)
    const culminating = aboveHorizon.filter(
      (o) => o.state === "CULMINATING" || Math.abs(o.horizontal.hourAngleDeg) <= 15.0
    );

    // 4. Setting: Descending in the west (hourAngle > 0 and altitude < 30°)
    const setting = aboveHorizon.filter(
      (o) =>
        o.state === "SETTING" ||
        (o.horizontal.apparentAltitudeDeg < 30 && o.horizontal.hourAngleDeg > 0)
    );

    return { best, rising, culminating, setting, all: aboveHorizon };
  }, [objects]);

  const currentList = useMemo(() => {
    switch (activeTab) {
      case "BEST":
        return categorized.best.length > 0 ? categorized.best : categorized.all;
      case "RISING":
        return categorized.rising;
      case "CULMINATING":
        return categorized.culminating;
      case "SETTING":
        return categorized.setting;
      case "ALL":
      default:
        return categorized.all;
    }
  }, [activeTab, categorized]);

  const getTypeIcon = (category: string, type: string) => {
    if (type === "STAR") return <Star className="w-3.5 h-3.5 text-amber-400" />;
    if (type === "PLANET") return <Orbit className="w-3.5 h-3.5 text-cyan-400" />;
    if (type === "MOON") return <Moon className="w-3.5 h-3.5 text-slate-200" />;
    if (type === "GALAXY") return <Disc className="w-3.5 h-3.5 text-purple-400" />;
    return <Sparkles className="w-3.5 h-3.5 text-pink-400" />;
  };

  return (
    <Card
      className={`border-celestial-muted/80 bg-celestial-surface/85 backdrop-blur-xl shadow-xl font-sans ${className}`}
    >
      <CardHeader className="pb-3 border-b border-celestial-muted/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-celestial-cyan" />
            <CardTitle className="text-sm font-bold font-mono uppercase text-celestial-starlight tracking-wider">
              What&apos;s Visible Tonight
            </CardTitle>
          </div>
          <Badge
            variant="outline"
            className="font-mono text-[10px] uppercase text-celestial-cyan border-celestial-cyan/30"
          >
            {categorized.all.length} Visible
          </Badge>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 pt-2 overflow-x-auto">
          {[
            { key: "BEST", label: "Best Tonight", count: categorized.best.length },
            { key: "CULMINATING", label: "High in Sky", count: categorized.culminating.length },
            { key: "RISING", label: "Rising", count: categorized.rising.length },
            { key: "SETTING", label: "Setting", count: categorized.setting.length },
            { key: "ALL", label: "All Visible", count: categorized.all.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as FilterCategory)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-celestial-cyan/20 text-celestial-cyan border border-celestial-cyan/40 font-semibold"
                  : "text-celestial-subtle hover:text-celestial-starlight hover:bg-celestial-muted/40"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-2 max-h-[380px] overflow-y-auto space-y-1 custom-scrollbar">
        {currentList.length > 0 ? (
          currentList.map((obs) => {
            const isSelected = obs.objectId === selectedObjectId;
            const rts = obs.riseTransitSet;

            return (
              <div
                key={`${obs.objectId}-${obs.objectSlug}`}
                onClick={() => onSelectObject(obs)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all text-left group ${
                  isSelected
                    ? "bg-celestial-cyan/15 border border-celestial-cyan/50 text-celestial-starlight shadow-sm"
                    : "hover:bg-celestial-muted/40 border border-transparent text-celestial-subtle"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div
                    className={`p-1.5 rounded-lg shrink-0 ${
                      isSelected ? "bg-celestial-cyan/25" : "bg-celestial-muted/50"
                    }`}
                  >
                    {getTypeIcon(obs.category, obs.type)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-xs text-celestial-starlight group-hover:text-celestial-cyan transition-colors truncate">
                        {obs.canonicalName}
                      </span>
                      {obs.apparentMagnitudeV !== undefined && (
                        <span className="text-[10px] font-mono text-celestial-subtle">
                          (V: {obs.apparentMagnitudeV.toFixed(1)})
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-celestial-subtle/80 truncate">
                      {obs.constellation} · Alt:{" "}
                      <span className="text-celestial-cyan font-semibold">
                        {obs.horizontal.apparentAltitudeDeg}°
                      </span>{" "}
                      · Az: {obs.horizontal.azimuthDeg}°
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {rts.transitDate && (
                    <div className="hidden sm:flex flex-col text-right text-[10px] font-mono text-celestial-subtle">
                      <span>Max Alt: {rts.transitAltitudeDeg}°</span>
                      <span className="text-celestial-cyan">
                        Transit:{" "}
                        {rts.transitDate.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}

                  <ArrowUpRight
                    className={`w-4 h-4 text-celestial-subtle group-hover:text-celestial-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform ${
                      isSelected ? "text-celestial-cyan" : ""
                    }`}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center text-celestial-subtle text-xs font-mono space-y-1">
            <Sun className="w-5 h-5 mx-auto text-amber-400/50 mb-1" />
            <p>No objects matching the current filter are visible right now.</p>
            <p className="text-[10px] text-celestial-subtle/70">
              Try switching tabs or adjusting the observation time.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
