"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ObserverLocation, PRESET_OBSERVER_LOCATIONS } from "@/domain/observer/types";
import { calculateAstronomicalEvents } from "@/lib/astronomy/events/astronomical-events";
import { astronomicalEventRepo } from "@/lib/data/astronomical-event-repository";
import { AstronomicalEventsCard } from "@/features/sky/components/AstronomicalEventsCard";
import { ObserverLocationModal } from "@/features/sky/components/ObserverLocationModal";
import {
  Calendar,
  MapPin,
  ArrowLeft,
  Sparkles,
  Compass,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import { AstronomicalEventType } from "@/domain/astronomical-event/types";

export default function AstronomicalEventsPage() {
  const [location, setLocation] = useState<ObserverLocation>(PRESET_OBSERVER_LOCATIONS[0]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [date] = useState<Date>(new Date());
  const [selectedEventType, setSelectedEventType] = useState<string>("ALL");

  const ephemerisReport = useMemo(() => {
    return calculateAstronomicalEvents(location, date);
  }, [location, date]);

  const landmarkEvents = useMemo(() => {
    return astronomicalEventRepo.filter({
      eventType:
        selectedEventType !== "ALL" ? (selectedEventType as AstronomicalEventType) : undefined,
    });
  }, [selectedEventType]);

  return (
    <div className="flex-1 py-8 space-y-8">
      <Container size="xl" className="space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-celestial-muted/70 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/sky"
                className="text-celestial-subtle hover:text-celestial-cyan transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Calendar className="w-6 h-6 text-amber-400" />
              <h1 className="text-2xl font-bold font-mono text-celestial-starlight uppercase">
                Astronomical Events & Ephemeris Schedule
              </h1>
            </div>
            <p className="text-sm text-celestial-subtle">
              Solar twilight boundaries, lunar phase cycles, and major celestial events connecting
              directly into observation planning.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsLocationModalOpen(true)}
              variant="outline"
              size="sm"
              className="gap-2 font-mono text-xs text-celestial-starlight border-celestial-muted/80 hover:border-celestial-cyan"
            >
              <MapPin className="w-3.5 h-3.5 text-celestial-cyan" />
              <span className="max-w-[160px] truncate">{location.name}</span>
            </Button>
            <Badge variant="cyan" className="font-mono text-xs">
              LIVE EPHEMERIS
            </Badge>
          </div>
        </div>

        {/* 1. Daily Observer Ephemeris & Twilights */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-celestial-cyan flex items-center gap-2">
              <Compass className="w-4 h-4" /> Today's Solar & Lunar Ephemeris
            </h2>
          </div>
          <AstronomicalEventsCard report={ephemerisReport} />
        </div>

        {/* 2. Major Landmark Astronomical Events Calendar */}
        <div className="space-y-4 pt-4 border-t border-celestial-muted/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-celestial-starlight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-celestial-amber" />
                Landmark Celestial Events Calendar (2026–2027)
              </h2>
              <p className="text-xs text-celestial-subtle">
                Conjunctions, oppositions, eclipses, meteor showers, and close cometary flybys with
                direct observation bridges.
              </p>
            </div>

            {/* Event Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                "ALL",
                "OPPOSITION",
                "CONJUNCTION",
                "SOLAR_ECLIPSE",
                "LUNAR_ECLIPSE",
                "METEOR_SHOWER",
                "COMET_APPROACH",
              ].map((type) => (
                <Button
                  key={type}
                  size="sm"
                  variant={selectedEventType === type ? "cyan" : "outline"}
                  className="h-7 text-[10px] font-mono uppercase shrink-0"
                  onClick={() => setSelectedEventType(type)}
                >
                  {type.replace("_", " ")}
                </Button>
              ))}
            </div>
          </div>

          {/* Landmark Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {landmarkEvents.map((evt) => (
              <div
                key={evt.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-celestial-muted/80 bg-celestial-surface/50 hover:bg-celestial-surface/80 p-5 backdrop-blur-lg transition-all duration-300 hover:border-celestial-amber/50 hover:shadow-xl hover:shadow-celestial-amber/5 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="amber" className="font-mono text-[10px] uppercase">
                      {evt.eventType.replace("_", " ")}
                    </Badge>
                    <span className="font-mono text-xs text-celestial-subtle">
                      {new Date(evt.eventDate).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-celestial-starlight group-hover:text-celestial-amber transition">
                      {evt.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-mono text-celestial-cyan mt-1">
                      <span>{evt.primaryTargetName}</span>
                      {evt.secondaryTargetName && <span>• {evt.secondaryTargetName}</span>}
                      {evt.constellation && <span>[{evt.constellation}]</span>}
                    </div>
                  </div>

                  <p className="text-xs text-celestial-subtle leading-relaxed line-clamp-3">
                    {evt.description}
                  </p>

                  <div className="p-3 rounded-xl bg-celestial-void/60 border border-celestial-muted/60 text-[11px] font-mono text-celestial-subtle space-y-1">
                    <div>
                      <span className="text-celestial-amber font-semibold">Visibility: </span>
                      <span>{evt.visibilityDescription}</span>
                    </div>
                    <div>
                      <span className="text-celestial-cyan font-semibold">Optics: </span>
                      <span>{evt.recommendedOptics.replace("_", " ")}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-celestial-muted/40 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 font-mono text-[10px] text-emerald-400">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{evt.epistemicStatus}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link href={`/research?target=${evt.targetSlugs[0]}`}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-[10px] font-mono text-celestial-purple hover:bg-celestial-purple/10 flex items-center gap-1"
                      >
                        <BookOpen className="w-3 h-3" /> Research
                      </Button>
                    </Link>
                    <Link
                      href={`/sky/planner?target=${evt.targetSlugs[0]}&date=${evt.eventDate.slice(0, 10)}`}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-[10px] font-mono text-celestial-cyan hover:bg-celestial-cyan/10 flex items-center gap-1"
                      >
                        <Compass className="w-3 h-3" /> Plan
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Observer Location Modal */}
        <ObserverLocationModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          currentLocation={location}
          onSelectLocation={setLocation}
        />
      </Container>
    </div>
  );
}
