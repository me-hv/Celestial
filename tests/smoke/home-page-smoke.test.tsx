import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("Home Page Smoke Tests", () => {
  it("renders CELESTIAL hero branding and search bar trigger", () => {
    render(<HomePage />);

    expect(screen.getByText("CELESTIAL")).toBeDefined();
    expect(screen.getByText("Interactive Atlas of the Universe")).toBeDefined();
    expect(screen.getByText("JOURNEY THROUGH THE UNIVERSE")).toBeDefined();
    expect(screen.getByText("EXPLORE THE COSMIC REALMS")).toBeDefined();
    expect(screen.getByText("FEATURED CELESTIAL LANDMARKS")).toBeDefined();
  });

  it("renders cosmic scale step cards", () => {
    render(<HomePage />);

    expect(screen.getAllByText("Solar System").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Milky Way").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Local Group").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Cosmic Web").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Observable Universe").length).toBeGreaterThan(0);
  });

  it("renders exploration realm cards", () => {
    render(<HomePage />);

    expect(screen.getByText("Solar System Explorer")).toBeDefined();
    expect(screen.getByText("Live Sky & Observatory")).toBeDefined();
    expect(screen.getAllByText("Stellar Neighborhood").length).toBeGreaterThan(0);
    expect(screen.getByText("Deep Sky Atlas")).toBeDefined();
  });
});
