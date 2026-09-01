import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { SolarSystemScene } from "@/features/visualization/scene/SolarSystemScene";
import { StellarSystemScene } from "@/features/visualization/scene/StellarSystemScene";

describe("Solar & Stellar System Interaction Smoke Tests", () => {
  it("renders SolarSystemScene container with accessible label", () => {
    render(<SolarSystemScene selectedObjectId="earth" />);
    const canvasRegion = screen.getByRole("region", { name: /3D Interactive Solar System Canvas/i });
    expect(canvasRegion).toBeDefined();
  });

  it("renders StellarSystemScene container for TRAPPIST-1", () => {
    render(<StellarSystemScene systemSlug="trappist-1" selectedObjectId="trappist-1-e" />);
    const canvasRegion = screen.getByRole("region", { name: /3D Interactive Stellar System Canvas/i });
    expect(canvasRegion).toBeDefined();
  });
});
