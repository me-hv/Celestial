import { describe, it, expect } from "vitest";
import { researchProjectManager } from "@/lib/astronomy/research/research-project-manager";

describe("Phase 13: Research Project Manager", () => {
  it("initializes with default starter research projects", () => {
    const projects = researchProjectManager.getProjects();
    expect(projects.length).toBeGreaterThanOrEqual(3);

    const jupiter = researchProjectManager.getProjectBySlug("jupiter-magnetosphere-dynamics");
    expect(jupiter).toBeDefined();
    expect(jupiter?.targetSlugs).toContain("jupiter");
    expect(jupiter?.status).toBe("ACTIVE");
  });

  it("allows creating, updating, and exporting research projects", () => {
    const created = researchProjectManager.createProject({
      slug: "test-fast-radio-bursts",
      title: "Fast Radio Burst Localization and Dispersion Measure",
      description: "Tracing extragalactic host galaxies of repeater FRBs using CHIME and VLA data.",
      discipline: "ASTROPHYSICS",
      tags: ["FRB", "Radio Astronomy"],
      targetSlugs: ["milky-way-galaxy"],
      datasetSlugs: [],
      missionSlugs: [],
      observatorySlugs: [],
      observingListIds: [],
      notes: [],
      status: "DRAFT",
    });

    expect(created.id).toBeDefined();
    expect(created.title).toContain("Fast Radio Burst");

    const updated = researchProjectManager.updateProject(created.id, {
      findings: "Matched dispersion measure to z=0.19 dwarf galaxy host.",
      status: "ACTIVE",
    });
    expect(updated?.findings).toContain("dispersion measure");

    const exported = researchProjectManager.exportProjectsAsJson();
    expect(typeof exported).toBe("string");
    expect(exported).toContain("Fast Radio Burst");

    // Clean up
    researchProjectManager.deleteProject(created.id);
  });
});
