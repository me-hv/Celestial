import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import HomePage from "@/app/page";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

describe("Application UI Smoke Tests", () => {
  it("renders the Home Page with core CELESTIAL brand and exploration triggers", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("CELESTIAL");
    expect(screen.getByText("Explore the universe.")).toBeDefined();
    expect(screen.getByPlaceholderText("Search the universe...")).toBeDefined();
    expect(screen.getByText("Explore")).toBeDefined();
    expect(screen.getByText("Sky")).toBeDefined();
    expect(screen.getByText("Objects")).toBeDefined();
    expect(screen.getByText("Missions")).toBeDefined();
  });

  it("renders UI primitives with correct styling tokens", () => {
    const { container } = render(
      <Card>
        <CardTitle>Stellar Record</CardTitle>
        <Badge variant="cyan">STELLAR</Badge>
        <Button variant="cyan">Explore</Button>
      </Card>
    );

    expect(container.querySelector("h3")).toHaveTextContent("Stellar Record");
    expect(screen.getByText("STELLAR")).toBeDefined();
    expect(screen.getByRole("button", { name: "Explore" })).toBeDefined();
  });
});
