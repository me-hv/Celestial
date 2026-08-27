import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { TelemetryPanel } from "@/features/exploration/components/TelemetryPanel";
import { ExplorerControls } from "@/features/exploration/components/ExplorerControls";
import { ScaleInfoModal } from "@/features/exploration/components/ScaleInfoModal";
import { celestialRepo } from "@/lib/data/celestial-repository";

describe("Explorer UI Components Smoke Tests", () => {
  const earth = celestialRepo.getBySlug("earth")!;

  it("renders TelemetryPanel with complete physical and provenance data for Earth", () => {
    const handleClose = vi.fn();
    const handleFocus = vi.fn();

    render(
      <TelemetryPanel
        object={earth}
        onClose={handleClose}
        onFocusCamera={handleFocus}
      />
    );

    expect(screen.getByText("EARTH")).toBeDefined();
    expect(screen.getByText("Sol III")).toBeDefined();
    expect(screen.getByText("TERRESTRIAL PLANET")).toBeDefined();
    expect(screen.getByText("6,371 km")).toBeDefined();
    expect(screen.getByText("9.807 m/s²")).toBeDefined();
    expect(screen.getByText(/Provenance/i)).toBeDefined();
  });

  it("triggers focus camera action when Focus Camera button is clicked", () => {
    const handleClose = vi.fn();
    const handleFocus = vi.fn();

    render(
      <TelemetryPanel
        object={earth}
        onClose={handleClose}
        onFocusCamera={handleFocus}
      />
    );

    const focusBtn = screen.getByRole("button", { name: /Focus Camera/i });
    fireEvent.click(focusBtn);
    expect(handleFocus).toHaveBeenCalledWith(earth);
  });

  it("renders ExplorerControls with all celestial body selector chips", () => {
    const objects = celestialRepo.getChildrenOf(earth.parentId || "");
    const handleSelect = vi.fn();

    render(
      <ExplorerControls
        objects={objects.length > 0 ? objects : [earth]}
        selectedObjectId={earth.id}
        onSelectObject={handleSelect}
        showOrbits={true}
        onToggleOrbits={vi.fn()}
        onResetView={vi.fn()}
        onOpenScaleInfo={vi.fn()}
      />
    );

    expect(screen.getByText("Earth")).toBeDefined();
  });

  it("renders ScaleInfoModal when open", () => {
    render(<ScaleInfoModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText("Visualization Scale Protocol")).toBeDefined();
    expect(screen.getByText("Dual-Scale Paradigm")).toBeDefined();
  });
});
