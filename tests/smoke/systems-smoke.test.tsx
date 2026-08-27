import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { SystemSelector } from "@/features/exploration/components/SystemSelector";
import { ExplorerControls } from "@/features/exploration/components/ExplorerControls";
import { stellarSystemRepo } from "@/lib/data/stellar-system-repository";
import { celestialRepo } from "@/lib/data/celestial-repository";

describe("Systems UI Smoke Tests", () => {
  const trappistSys = stellarSystemRepo.getBySlug("trappist-1")!;
  const trappist1e = celestialRepo.getBySlug("trappist-1-e")!;

  it("renders SystemSelector with populated star systems", () => {
    const handleSelect = vi.fn();
    render(
      <SystemSelector
        currentSystemSlug="trappist-1"
        onSelectSystem={handleSelect}
      />
    );

    expect(screen.getByRole("combobox")).toBeDefined();
    expect(screen.getByText(/TRAPPIST-1 System/i)).toBeDefined();
    expect(screen.getByText(/Proxima Centauri System/i)).toBeDefined();
    expect(screen.getByText(/Solar System/i)).toBeDefined();
  });

  it("renders ExplorerControls with Habitable Zone toggle for star systems", () => {
    const objects = stellarSystemRepo.getAllObjectsForSystem(trappistSys.id);
    const handleToggleHz = vi.fn();

    render(
      <ExplorerControls
        objects={objects}
        selectedObjectId={trappist1e.id}
        onSelectObject={vi.fn()}
        showOrbits={true}
        onToggleOrbits={vi.fn()}
        showHabitableZone={false}
        onToggleHabitableZone={handleToggleHz}
        hasHabitableZone={true}
        onResetView={vi.fn()}
        onOpenScaleInfo={vi.fn()}
      />
    );

    expect(screen.getByText("TRAPPIST-1 e")).toBeDefined();
    const hzButton = screen.getByRole("button", { name: /Habitable Zone/i });
    expect(hzButton).toBeDefined();

    fireEvent.click(hzButton);
    expect(handleToggleHz).toHaveBeenCalled();
  });
});
