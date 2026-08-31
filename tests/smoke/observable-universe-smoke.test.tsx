import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ObservableTelemetryPanel } from "@/features/observable-universe/components/ObservableTelemetryPanel";
import { CMBTelemetryPanel } from "@/features/observable-universe/components/CMBTelemetryPanel";
import { UnifiedCosmicScaleSlider } from "@/features/observable-universe/components/UnifiedCosmicScaleSlider";
import { HorizonComparisonCard } from "@/features/observable-universe/components/HorizonComparisonCard";
import { observableUniverseRepo } from "@/lib/data/observable-universe-repository";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/observable-universe",
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

describe("Observable Universe Smoke & UI Rendering Tests", () => {
  it("renders ObservableTelemetryPanel for GN-z11", () => {
    const gnz11 = observableUniverseRepo.getLandmarkBySlug("galaxy-gn-z11");
    expect(gnz11).toBeDefined();

    render(<ObservableTelemetryPanel landmark={gnz11} />);
    expect(screen.getByText("GN-z11 Primeval Galaxy")).toBeDefined();
    expect(screen.getByText("10.603")).toBeDefined();
    expect(screen.getByText("OBSERVED")).toBeDefined();
  });

  it("renders CMBTelemetryPanel with acoustic peaks and missions", () => {
    const cmb = observableUniverseRepo.getCMB();
    render(<CMBTelemetryPanel cmb={cmb} />);

    expect(screen.getAllByText(/Cosmic Microwave Background/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/2.7255 K/i)).toBeDefined();
    expect(screen.getByText(/Planck Satellite/i)).toBeDefined();
    expect(screen.getAllByText(/First Acoustic Peak/i).length).toBeGreaterThan(0);
  });

  it("renders UnifiedCosmicScaleSlider with 10 scale stages", () => {
    render(<UnifiedCosmicScaleSlider currentStageIndex={9} />);
    expect(screen.getByText(/UNIFIED COSMIC SCALE HIERARCHY/i)).toBeDefined();
    expect(screen.getByText(/Particle Horizon/i)).toBeDefined();
  });

  it("renders HorizonComparisonCard with all cosmic boundaries", () => {
    const horizons = observableUniverseRepo.getAllHorizons();
    render(<HorizonComparisonCard horizons={horizons} />);

    expect(screen.getByText(/Comparing Cosmic Horizons & Boundaries/i)).toBeDefined();
    expect(screen.getByText(/Particle Horizon \(Observable Universe Radius\)/i)).toBeDefined();
    expect(screen.getAllByText(/Hubble Sphere/i).length).toBeGreaterThan(0);
  });
});
