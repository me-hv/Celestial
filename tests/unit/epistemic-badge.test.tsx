import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { EpistemicBadge } from "@/components/ui/epistemic-badge";

describe("EpistemicBadge Component", () => {
  it("renders Observed status badge", () => {
    render(<EpistemicBadge status="OBSERVED" />);
    expect(screen.getByText("Observed")).toBeDefined();
  });

  it("renders Inferred status badge", () => {
    render(<EpistemicBadge status="INFERRED" />);
    expect(screen.getByText("Inferred")).toBeDefined();
  });

  it("renders Model-Derived status badge", () => {
    render(<EpistemicBadge status="MODEL_DERIVED" />);
    expect(screen.getByText("Model-Derived")).toBeDefined();
  });

  it("renders Illustrative status badge", () => {
    render(<EpistemicBadge status="ILLUSTRATIVE" />);
    expect(screen.getByText("Illustrative")).toBeDefined();
  });
});
