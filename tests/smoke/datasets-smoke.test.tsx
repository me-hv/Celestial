import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DatasetsHubPage from "@/app/(explorer)/datasets/page";

describe("DatasetsHubPage Smoke Test", () => {
  it("renders Datasets hub page heading and dataset cards", () => {
    render(<DatasetsHubPage />);
    expect(screen.getByText("Scientific Datasets & Primary Archives")).toBeDefined();
    expect(screen.getByPlaceholderText(/Search datasets/i)).toBeDefined();
  });
});
