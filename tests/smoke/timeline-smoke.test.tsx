import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import UniversalTimelinePage from "@/app/(explorer)/timeline/page";

describe("Universal Timeline Page Smoke Test", () => {
  it("renders timeline header, controls bar, and chronological stream", () => {
    render(<UniversalTimelinePage />);
    expect(screen.getByText(/CELESTIAL Scientific Timeline & Historical State/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/Search events/i)).toBeDefined();
    expect(screen.getByText(/Chronological Synchronized Stream/i)).toBeDefined();
  });
});
