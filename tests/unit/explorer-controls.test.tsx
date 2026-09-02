import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ExplorerControls } from "@/features/exploration/components/ExplorerControls";
import { SOLAR_SYSTEM_OBJECTS } from "@/lib/data/solar-system-data";

describe("ExplorerControls Component", () => {
  it("renders planet buttons and handles selection callback", () => {
    const onSelectObject = vi.fn();
    const onToggleOrbits = vi.fn();
    const onResetView = vi.fn();
    const onOpenScaleInfo = vi.fn();

    render(
      <ExplorerControls
        objects={SOLAR_SYSTEM_OBJECTS}
        selectedObjectId={SOLAR_SYSTEM_OBJECTS[1].id} // Mercury
        onSelectObject={onSelectObject}
        showOrbits={true}
        onToggleOrbits={onToggleOrbits}
        onResetView={onResetView}
        onOpenScaleInfo={onOpenScaleInfo}
      />
    );

    const earthBtn = screen.getByRole("button", { name: "Earth" });
    expect(earthBtn).toBeDefined();

    fireEvent.click(earthBtn);

    expect(onSelectObject).toHaveBeenCalledTimes(1);
    expect(onSelectObject).toHaveBeenCalledWith(
      expect.objectContaining({ slug: "earth", canonicalName: "Earth" })
    );
  });
});
