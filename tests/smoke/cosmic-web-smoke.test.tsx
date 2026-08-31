import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CosmicStructureTypeBadge } from "@/features/cosmic-web/components/CosmicStructureTypeBadge";
import { CosmicLocationBreadcrumb } from "@/features/cosmic-web/components/CosmicLocationBreadcrumb";
import { CosmicStructureTelemetryPanel } from "@/features/cosmic-web/components/CosmicStructureTelemetryPanel";
import { CosmicStructureComparisonTable } from "@/features/cosmic-web/components/CosmicStructureComparisonTable";
import { CosmicWebLayerControls } from "@/features/cosmic-web/components/CosmicWebLayerControls";
import { DEFAULT_COSMIC_LAYERS } from "@/features/visualization/cosmic-web/CosmicWebScene";
import { COSMIC_STRUCTURES_DATA } from "@/lib/data/cosmic-structure-data";

describe("Cosmic Web UI Smoke Tests", () => {
  const virgo = COSMIC_STRUCTURES_DATA.find((s) => s.slug === "virgo-cluster")!;
  const localGroup = COSMIC_STRUCTURES_DATA.find((s) => s.slug === "local-group")!;

  it("renders CosmicStructureTypeBadge correctly", () => {
    render(<CosmicStructureTypeBadge type="GALAXY_CLUSTER" observationStatus="OBSERVED" />);
    expect(screen.getByText("GALAXY CLUSTER")).toBeDefined();
    expect(screen.getByText("OBSERVED")).toBeDefined();
  });

  it("renders CosmicLocationBreadcrumb hierarchy", () => {
    render(<CosmicLocationBreadcrumb currentStage="COSMIC_WEB" />);
    expect(screen.getByText("Cosmic Address:")).toBeDefined();
    expect(screen.getByText("Milky Way")).toBeDefined();
    expect(screen.getByText("Local Group")).toBeDefined();
    expect(screen.getByText("Virgo Supercluster")).toBeDefined();
    expect(screen.getByText("Laniakea")).toBeDefined();
    expect(screen.getByText("Cosmic Web")).toBeDefined();
  });

  it("renders CosmicStructureTelemetryPanel with metrics", () => {
    render(<CosmicStructureTelemetryPanel structure={virgo} />);
    expect(screen.getByText("Virgo Cluster")).toBeDefined();
    expect(screen.getByText("16.5 ± 0.5 Mpc")).toBeDefined();
    expect(screen.getByText("Lookback Time")).toBeDefined();
    expect(screen.getByText("Gravitational Mass")).toBeDefined();
  });

  it("renders CosmicStructureComparisonTable side-by-side", () => {
    render(<CosmicStructureComparisonTable structureA={localGroup} structureB={virgo} />);
    expect(screen.getByText("Local Group of Galaxies")).toBeDefined();
    expect(screen.getByText("Virgo Cluster")).toBeDefined();
    expect(screen.getByText("3D Spatial Separation in the Cosmic Web")).toBeDefined();
  });

  it("renders CosmicWebLayerControls buttons", () => {
    render(<CosmicWebLayerControls layers={DEFAULT_COSMIC_LAYERS} onChange={() => {}} />);
    expect(screen.getByText("Clusters")).toBeDefined();
    expect(screen.getByText("Superclusters")).toBeDefined();
    expect(screen.getByText("Cosmic Voids")).toBeDefined();
    expect(screen.getByText("Sheets & Walls")).toBeDefined();
  });
});
