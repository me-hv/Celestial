import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { StarFilterBar } from "@/features/stars/components/StarFilterBar";
import { StarTelemetryPanel } from "@/features/stars/components/StarTelemetryPanel";
import { starRepo } from "@/lib/data/star-repository";

describe("Stars UI Smoke Tests", () => {
  const proxima = starRepo.getBySlug("proxima-centauri")!;
  const sirius = starRepo.getBySlug("sirius-a")!;

  it("renders StarFilterBar with distance presets and triggers filter change", () => {
    const handleChange = vi.fn();
    render(
      <StarFilterBar
        filters={{ maxDistancePc: 25 }}
        onChangeFilters={handleChange}
      />
    );

    expect(screen.getByText(/< 5 pc/i)).toBeDefined();
    expect(screen.getByText(/< 10 pc/i)).toBeDefined();
    expect(screen.getByText(/Has Exoplanets/i)).toBeDefined();

    fireEvent.click(screen.getByText(/< 5 pc/i));
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ maxDistancePc: 5 })
    );
  });

  it("renders StarTelemetryPanel for star with confirmed planetary system (Proxima Centauri)", () => {
    const handleClose = vi.fn();
    const handleFocus = vi.fn();

    render(
      <StarTelemetryPanel
        star={proxima}
        onClose={handleClose}
        onFocusCamera={handleFocus}
      />
    );

    expect(screen.getByText("PROXIMA CENTAURI")).toBeDefined();
    expect(screen.getByText("M5.5Ve")).toBeDefined();
    expect(screen.getByText(/Planetary System Status/i)).toBeDefined();
    expect(screen.getByText(/System Profile/i)).toBeDefined();
  });

  it("renders StarTelemetryPanel for star with no confirmed planets (Sirius A)", () => {
    const handleClose = vi.fn();

    render(
      <StarTelemetryPanel
        star={sirius}
        onClose={handleClose}
      />
    );

    expect(screen.getByText("SIRIUS A")).toBeDefined();
    expect(screen.getByText(/No confirmed planetary system in the current catalog/i)).toBeDefined();
  });
});
