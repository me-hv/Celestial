import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { CosmicTimeSlider } from "@/features/cosmic-time/components/CosmicTimeSlider";
import { CosmicTimeTelemetryPanel } from "@/features/cosmic-time/components/CosmicTimeTelemetryPanel";
import { CosmologyConfigSelector } from "@/features/cosmic-time/components/CosmologyConfigSelector";
import { CosmicEpochCard } from "@/features/cosmic-time/components/CosmicEpochCard";
import { LightTravelVsCosmologyBadge } from "@/features/cosmic-time/components/LightTravelVsCosmologyBadge";
import { COSMIC_EPOCHS_DATA } from "@/lib/data/cosmic-epoch-data";
import { createLightTravelObservation, createCosmologicalLookbackObservation } from "@/domain/cosmic-time/observation";

describe("Cosmic Time UI Components Smoke Tests", () => {
  const sampleEpoch = COSMIC_EPOCHS_DATA[12]; // Galaxy Assembly

  it("renders CosmicTimeSlider component", () => {
    render(
      <CosmicTimeSlider
        lookbackGyr={5.0}
        onLookbackChange={() => {}}
        epochs={COSMIC_EPOCHS_DATA}
        selectedEpoch={sampleEpoch}
      />
    );
    expect(screen.getByTestId("cosmic-time-slider-container")).toBeDefined();
    expect(screen.getByText(/LOOKBACK TIME/)).toBeDefined();
  });

  it("renders CosmicTimeTelemetryPanel component", () => {
    render(
      <CosmicTimeTelemetryPanel
        epoch={sampleEpoch}
        lookbackGyr={5.0}
      />
    );
    expect(screen.getByTestId("cosmic-time-telemetry-panel")).toBeDefined();
    expect(screen.getByText(sampleEpoch.name)).toBeDefined();
  });

  it("renders CosmologyConfigSelector component", () => {
    render(<CosmologyConfigSelector />);
    expect(screen.getByTestId("cosmology-config-selector")).toBeDefined();
    expect(screen.getByText(/Planck 2018/)).toBeDefined();
  });

  it("renders CosmicEpochCard component", () => {
    render(<CosmicEpochCard epoch={sampleEpoch} />);
    expect(screen.getByTestId(`cosmic-epoch-card-${sampleEpoch.slug}`)).toBeDefined();
    expect(screen.getByText(sampleEpoch.name)).toBeDefined();
  });

  it("renders LightTravelVsCosmologyBadge for light-travel and cosmological models", () => {
    const lightTravelObs = createLightTravelObservation(8.6);
    const { rerender } = render(
      <LightTravelVsCosmologyBadge model={lightTravelObs} objectName="Sirius" />
    );
    expect(screen.getByTestId("light-travel-time-badge")).toBeDefined();

    const cosmoObs = createCosmologicalLookbackObservation(2.0);
    rerender(
      <LightTravelVsCosmologyBadge model={cosmoObs} objectName="Cosmic Noon Galaxy" />
    );
    expect(screen.getByTestId("cosmological-lookback-badge")).toBeDefined();
  });
});
