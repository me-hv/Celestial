import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import OrganizationsPage from "@/app/(explorer)/organizations/page";
import MissionsPage from "@/app/(explorer)/missions/page";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: () => null,
  }),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => "/organizations",
}));

describe("Phase 11.5 Smoke Tests", () => {
  it("renders Global Organizations Directory without crashing", () => {
    render(<OrganizationsPage />);
    expect(screen.getByText(/Global Space & Research Organizations/i)).toBeDefined();
    expect(screen.getByText(/Filter by Region:/i)).toBeDefined();
  });

  it("renders Global Missions Hub without crashing", () => {
    render(<MissionsPage />);
    expect(screen.getByText(/Space Missions & Discoveries/i)).toBeDefined();
    expect(screen.getByText(/ORGANIZATIONS REGISTRY/i)).toBeDefined();
  });
});
