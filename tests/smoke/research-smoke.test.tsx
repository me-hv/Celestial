import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ResearchPage from "@/app/(explorer)/research/page";
import ObservatoriesPage from "@/app/(explorer)/observatories/page";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string) => (key === "target" ? "m31-andromeda-galaxy" : null),
  }),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => "/research",
}));

describe("Phase 12 Smoke Tests", () => {
  it("renders Research Hub page without crash", () => {
    render(<ResearchPage />);
    expect(screen.getByText(/Scientific Research Workspace/i)).toBeDefined();
    expect(screen.getByText(/Observing Lists/i)).toBeDefined();
  });

  it("renders Observatories Directory page without crash", () => {
    render(<ObservatoriesPage />);
    expect(screen.getByText(/Astronomical Observatories Directory/i)).toBeDefined();
    expect(screen.getByText(/W. M. Keck Observatory/i)).toBeDefined();
  });
});
