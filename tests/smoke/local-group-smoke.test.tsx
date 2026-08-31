import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { galaxyRepo } from "@/lib/data/galaxy-repository";
import { GalaxyTelemetryPanel } from "@/features/galaxy/components/GalaxyTelemetryPanel";
import { GalaxyMorphologyBadge } from "@/features/galaxy/components/GalaxyMorphologyBadge";
import { LocalGroupLayerControls } from "@/features/galaxy/components/LocalGroupLayerControls";
import { GalaxyComparisonTable } from "@/features/galaxy/components/GalaxyComparisonTable";

describe("Local Group & Galaxy Explorer Smoke Tests", () => {
  const m31 = galaxyRepo.getBySlug("andromeda-galaxy")!;
  const mw = galaxyRepo.getBySlug("milky-way-galaxy")!;

  it("renders GalaxyMorphologyBadge with correct classes", () => {
    render(<GalaxyMorphologyBadge morphologyClass="BARRED_SPIRAL" hubbleType="SBb" />);
    expect(screen.getByText("BARRED SPIRAL")).toBeDefined();
    expect(screen.getByText("SBb")).toBeDefined();
  });

  it("renders GalaxyTelemetryPanel for Andromeda Galaxy with kinematics and lookback time", () => {
    const handleClose = vi.fn();
    render(<GalaxyTelemetryPanel galaxy={m31} onClose={handleClose} />);

    expect(screen.getByRole("heading", { name: "Andromeda Galaxy" })).toBeDefined();
    expect(screen.getAllByText(/2.54/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/-301.0 km\/s/i)).toBeDefined();
    expect(screen.getByText("Full Galaxy Profile →")).toBeDefined();
  });

  it("renders LocalGroupLayerControls and handles layer toggles", () => {
    const handleChange = vi.fn();
    const layers = {
      galaxies: true,
      distanceShells: true,
      relationshipLines: true,
      subgroups: true,
      labels: true,
      grid: true,
    };

    render(<LocalGroupLayerControls layers={layers} onChange={handleChange} />);

    expect(screen.getByText("Galaxies")).toBeDefined();
    expect(screen.getByText("Distance Shells")).toBeDefined();
    expect(screen.getByText("Interactions")).toBeDefined();

    fireEvent.click(screen.getByText("Distance Shells"));
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ distanceShells: false })
    );
  });

  it("renders GalaxyComparisonTable comparing Milky Way and Andromeda", () => {
    render(<GalaxyComparisonTable galaxyA={mw} galaxyB={m31} />);

    expect(screen.getByText("Milky Way Galaxy")).toBeDefined();
    expect(screen.getByText("Andromeda Galaxy")).toBeDefined();
    expect(screen.getByText("Total Halo Mass (M_virial)")).toBeDefined();
    expect(screen.getByText("Heliocentric Radial Velocity (v_r)")).toBeDefined();
  });
});
