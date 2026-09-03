import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SpaceWeatherPage from "@/app/(explorer)/space-weather/page";

describe("Space Weather Page Smoke Test", () => {
  it("renders space weather KPI cards and observation implications", () => {
    render(<SpaceWeatherPage />);
    expect(screen.getByText(/Space Weather & Heliophysics Intelligence/i)).toBeDefined();
    expect(screen.getAllByText(/Solar Wind Plasma/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Geomagnetic Kp Index/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Sun → Earth & Astronomical Observation Implications/i)).toBeDefined();
  });
});
