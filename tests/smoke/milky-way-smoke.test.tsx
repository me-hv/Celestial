import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { YouAreHereIndicator } from "@/features/galactic/components/YouAreHereIndicator";
import { GalacticLayerControls } from "@/features/galactic/components/GalacticLayerControls";
import { GalacticTelemetryPanel } from "@/features/galactic/components/GalacticTelemetryPanel";
import { galacticStructureRepo } from "@/lib/data/galactic-structure-repository";

describe("Milky Way UI Smoke Tests", () => {
  const orionSpur = galacticStructureRepo.getBySlug("orion-spur")!;
  const gc = galacticStructureRepo.getBySlug("galactic-center")!;

  it("renders YouAreHereIndicator with all celestial scale stages", () => {
    render(<YouAreHereIndicator currentStage="MILKY_WAY" />);
    expect(screen.getByText(/YOU ARE HERE:/i)).toBeDefined();
    expect(screen.getByText("Earth")).toBeDefined();
    expect(screen.getByText("Solar System")).toBeDefined();
    expect(screen.getByText("Orion Spur")).toBeDefined();
    expect(screen.getByText("Milky Way")).toBeDefined();
    expect(screen.getByText("Local Group")).toBeDefined();
  });

  it("renders GalacticLayerControls and toggles visual layer state", () => {
    const handleLayers = vi.fn();
    const initialLayers = {
      showDisk: true,
      showPlaneGrid: true,
      showBulgeBar: true,
      showSpiralArms: true,
      showSunPosition: true,
      showNearbyStars: false,
      showStellarSystems: false,
      showDeepSkyObjects: false,
    };

    render(<GalacticLayerControls layers={initialLayers} onChangeLayers={handleLayers} />);

    expect(screen.getByText("Galactic Disk")).toBeDefined();
    expect(screen.getByText("Spiral Arms")).toBeDefined();

    fireEvent.click(screen.getByText("Spiral Arms"));
    expect(handleLayers).toHaveBeenCalledWith(
      expect.objectContaining({ showSpiralArms: false })
    );
  });

  it("renders GalacticTelemetryPanel for Orion Spur with model-derived notice", () => {
    const handleClose = vi.fn();
    const handleFocus = vi.fn();

    render(
      <GalacticTelemetryPanel
        structure={orionSpur}
        onClose={handleClose}
        onFocusCamera={handleFocus}
      />
    );

    expect(screen.getByRole("heading", { name: "ORION SPUR / LOCAL ARM" })).toBeDefined();
    expect(screen.getByText(/Model-Derived Structure/i)).toBeDefined();
    expect(screen.getByText(/Structure Profile/i)).toBeDefined();
  });

  it("renders GalacticTelemetryPanel for Galactic Center with Sgr A* details", () => {
    const handleClose = vi.fn();

    render(<GalacticTelemetryPanel structure={gc} onClose={handleClose} />);

    expect(screen.getByRole("heading", { name: "GALACTIC CENTER" })).toBeDefined();
    expect(screen.getByText("Sagittarius A*")).toBeDefined();
  });
});
