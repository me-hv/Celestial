import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LiveCommandCenterPage from "@/app/(explorer)/live/page";

describe("Live Command Center Smoke Test", () => {
  it("renders real-time sky, space weather, and telemetry widgets", () => {
    render(<LiveCommandCenterPage />);
    expect(screen.getByText(/CELESTIAL Live Intelligence Dashboard/i)).toBeDefined();
    expect(screen.getByText(/Sky Observer State/i)).toBeDefined();
    expect(screen.getByText(/Space Weather \(NOAA\)/i)).toBeDefined();
    expect(screen.getByText(/Deep Space Fleet/i)).toBeDefined();
    expect(screen.getByText(/Scientific Data Provider Stream Health/i)).toBeDefined();
  });
});
