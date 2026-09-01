import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { AppSidebar } from "@/components/layout/AppSidebar";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/explore",
}));

describe("AppSidebar Component Smoke Tests", () => {
  it("renders expanded sidebar with categorized sections", () => {
    const handleToggle = vi.fn();
    render(<AppSidebar isExpanded={true} onToggleExpand={handleToggle} />);

    expect(screen.getByText("CELESTIAL")).toBeDefined();
    expect(screen.getByText("EXPLORE")).toBeDefined();
    expect(screen.getByText("Solar System")).toBeDefined();
    expect(screen.getByText("Live Sky")).toBeDefined();
    expect(screen.getByText("CATALOGS")).toBeDefined();
    expect(screen.getByText("COSMIC SCALE")).toBeDefined();
    expect(screen.getByText("OBSERVATION")).toBeDefined();
  });

  it("handles sidebar collapse toggle", () => {
    const handleToggle = vi.fn();
    render(<AppSidebar isExpanded={true} onToggleExpand={handleToggle} />);

    const toggleBtn = screen.getByLabelText("Collapse Sidebar");
    fireEvent.click(toggleBtn);
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it("renders collapsed sidebar with expand button", () => {
    const handleToggle = vi.fn();
    render(<AppSidebar isExpanded={false} onToggleExpand={handleToggle} />);

    const expandBtn = screen.getByLabelText("Expand Sidebar");
    expect(expandBtn).toBeDefined();
  });
});
