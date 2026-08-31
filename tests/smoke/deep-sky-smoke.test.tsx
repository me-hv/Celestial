import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { DeepSkyFilterBar } from "@/features/deep-sky/components/DeepSkyFilterBar";
import { DeepSkyTelemetryPanel } from "@/features/deep-sky/components/DeepSkyTelemetryPanel";
import { deepSkyRepo } from "@/lib/data/deep-sky-repository";

describe("Deep Sky UI Smoke Tests", () => {
  const m31 = deepSkyRepo.getBySlug("m31-andromeda-galaxy")!;
  const m42 = deepSkyRepo.getBySlug("m42-orion-nebula")!;

  it("renders DeepSkyFilterBar with category presets and triggers filter change", () => {
    const handleChange = vi.fn();
    render(
      <DeepSkyFilterBar
        filters={{}}
        onChangeFilters={handleChange}
      />
    );

    expect(screen.getByText("Galaxies 🌌")).toBeDefined();
    expect(screen.getByText("Nebulae ✨")).toBeDefined();
    expect(screen.getByText("Star Clusters ⭐")).toBeDefined();

    fireEvent.click(screen.getByText(/Galaxies/i));
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ classificationCode: "GALAXY" })
    );
  });

  it("renders DeepSkyTelemetryPanel for Andromeda Galaxy (M31)", () => {
    const handleClose = vi.fn();
    const handleFocus = vi.fn();

    render(
      <DeepSkyTelemetryPanel
        object={m31}
        onClose={handleClose}
        onFocusCamera={handleFocus}
      />
    );

    expect(screen.getByText("ANDROMEDA GALAXY")).toBeDefined();
    expect(screen.getAllByText(/GALAXY/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Distance & Measurement/i)).toBeDefined();
    expect(screen.getByText(/Full Profile/i)).toBeDefined();
  });

  it("renders DeepSkyTelemetryPanel for Orion Nebula (M42)", () => {
    const handleClose = vi.fn();

    render(
      <DeepSkyTelemetryPanel
        object={m42}
        onClose={handleClose}
      />
    );

    expect(screen.getByText("ORION NEBULA")).toBeDefined();
    expect(screen.getAllByText(/NEBULA/i).length).toBeGreaterThan(0);
  });
});
