"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ObserverLocation, PRESET_OBSERVER_LOCATIONS } from "@/domain/observer/types";
import { ObservationPlannerCard } from "@/features/sky/components/ObservationPlannerCard";
import { ObserverLocationModal } from "@/features/sky/components/ObserverLocationModal";
import { Telescope, MapPin, ArrowLeft } from "lucide-react";

export default function ObservationPlannerPage() {
  const [location, setLocation] = useState<ObserverLocation>(PRESET_OBSERVER_LOCATIONS[0]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [date] = useState<Date>(new Date());

  return (
    <div className="flex-1 py-8 space-y-6">
      <Container size="xl" className="space-y-6">
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
              <Telescope className="w-6 h-6 text-celestial-cyan" />
              <h1 className="text-2xl font-bold font-mono text-celestial-starlight uppercase">
                Night Sky Observation Planner
              </h1>
            </div>
            <p className="text-sm text-celestial-subtle">
              Automated target ranking and culmination schedule tailored to your telescope aperture
              and location
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
              SESSION PLANNER
            </Badge>
          </div>
        </div>

        {/* Observation Planner Component */}
        <ObservationPlannerCard location={location} date={date} />

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
