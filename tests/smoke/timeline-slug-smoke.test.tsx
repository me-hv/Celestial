import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TimelineEventPage from "@/app/(explorer)/timeline/[slug]/page";

describe("Timeline Event Detail Page Smoke Test", () => {
  it("renders event dossier for voyager-1-launch", async () => {
    const pageComponent = await TimelineEventPage({
      params: Promise.resolve({ slug: "voyager-1-launch" }),
    });
    render(pageComponent);
    expect(screen.getByText(/Voyager 1 Launch/i)).toBeDefined();
    expect(screen.getByText(/Start Timestamp/i)).toBeDefined();
    expect(screen.getByText(/Authoritative Provenance & Calibration Record/i)).toBeDefined();
  });
});
