import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PRESET_OBSERVER_LOCATIONS } from "@/domain/observer/types";
import { skyObjectRepo } from "@/lib/data/sky-object-repository";
import { calculateAstronomicalEvents } from "@/lib/astronomy/events/astronomical-events";
import { SkyControlsBar } from "@/features/sky/components/SkyControlsBar";
import { SkyTelemetryPanel } from "@/features/sky/components/SkyTelemetryPanel";
import { WhereIsObjectCard } from "@/features/sky/components/WhereIsObjectCard";
import { AstronomicalEventsCard } from "@/features/sky/components/AstronomicalEventsCard";
import { ObservationPlannerCard } from "@/features/sky/components/ObservationPlannerCard";
import { ObserverLocationModal } from "@/features/sky/components/ObserverLocationModal";
import { WhatsVisibleTonightCard } from "@/features/sky/components/WhatsVisibleTonightCard";

describe("Sky Explorer Smoke & UI Rendering Tests", () => {
  const location = PRESET_OBSERVER_LOCATIONS[0];
  const date = new Date();
  const siriusObs = skyObjectRepo.getSkyObservation("sirius-a", location, date)!;
  const visibleObjects = skyObjectRepo.getVisibleSkyObjects(location, date);
  const eventsReport = calculateAstronomicalEvents(location, date);

  it("renders SkyControlsBar correctly", () => {
    render(
      <SkyControlsBar
        location={location}
        onOpenLocationModal={vi.fn()}
        date={date}
        onDateChange={vi.fn()}
        isPlaying={false}
        onTogglePlay={vi.fn()}
        timeSpeed={1}
        onCycleTimeSpeed={vi.fn()}
        onResetToNow={vi.fn()}
        viewMode="3D_SPHERE"
        onViewModeChange={vi.fn()}
      />
    );

    expect(screen.getByText(location.name)).toBeDefined();
    expect(screen.getByText("Play")).toBeDefined();
    expect(screen.getByText("3D Sphere")).toBeDefined();
  });

  it("renders SkyTelemetryPanel with live observation", () => {
    render(<SkyTelemetryPanel observation={siriusObs} />);
    expect(screen.getByText("Sirius A")).toBeDefined();
    expect(screen.getByText("Canis Major")).toBeDefined();
    expect(screen.getByText("Object Profile")).toBeDefined();
  });

  it("renders WhatsVisibleTonightCard correctly", () => {
    render(
      <WhatsVisibleTonightCard
        objects={visibleObjects}
        selectedObjectId={siriusObs.objectId}
        onSelectObject={vi.fn()}
      />
    );
    expect(screen.getByText(/What's Visible Tonight/i)).toBeDefined();
    expect(screen.getByText(/Best Tonight/i)).toBeDefined();
    expect(screen.getByText(/High in Sky/i)).toBeDefined();
  });

  it("renders WhereIsObjectCard correctly", () => {
    render(<WhereIsObjectCard observation={siriusObs} />);
    expect(screen.getByText("Sirius A")).toBeDefined();
    expect(screen.getByText(/Where is this object right now\?/i)).toBeDefined();
  });

  it("renders AstronomicalEventsCard correctly", () => {
    render(<AstronomicalEventsCard report={eventsReport} />);
    expect(screen.getByText(/Astronomical Events & Twilight/i)).toBeDefined();
    expect(screen.getByText(/Lunar Ephemeris & Phase/i)).toBeDefined();
  });

  it("renders ObservationPlannerCard correctly", () => {
    render(<ObservationPlannerCard location={location} date={date} />);
    expect(screen.getByText(/Night Sky Observation Session Planner/i)).toBeDefined();
    expect(screen.getByText(/Faintest Magnitude/i)).toBeDefined();
  });

  it("renders ObserverLocationModal when opened", () => {
    render(
      <ObserverLocationModal
        isOpen={true}
        onClose={vi.fn()}
        currentLocation={location}
        onSelectLocation={vi.fn()}
      />
    );
    expect(screen.getByText(/Observer Location Setup/i)).toBeDefined();
    expect(screen.getByText(/Device Geolocation/i)).toBeDefined();
  });
});
