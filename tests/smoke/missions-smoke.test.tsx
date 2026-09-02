import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import MissionsPage from "@/app/(explorer)/missions/page";
import DiscoveriesPage from "@/app/(explorer)/missions/discoveries/page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/missions",
  notFound: vi.fn(),
}));

describe("Phase 11 Missions UI Smoke Tests", () => {
  it("should render the Missions Hub page without crashing", () => {
    render(<MissionsPage />);
    expect(screen.getByText("Space Missions & Discoveries")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search missions/i)).toBeInTheDocument();
  });

  it("should render the Discoveries Archive page without crashing", () => {
    render(<DiscoveriesPage />);
    expect(screen.getByText("Major Space Science Discoveries")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search discoveries/i)).toBeInTheDocument();
  });
});
