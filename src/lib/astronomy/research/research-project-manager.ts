import { ResearchProject } from "@/domain/research/types";

const RESEARCH_PROJECTS_STORAGE_KEY = "celestial_research_projects_v1";

export const DEFAULT_RESEARCH_PROJECTS: ResearchProject[] = [
  {
    id: "proj-jupiter-magnetosphere",
    slug: "jupiter-magnetosphere-dynamics",
    title: "Jupiter's Magnetosphere & Galilean Moon Plasma Torus Interactions",
    description:
      "Multi-wavelength investigation of Io's volcanic SO2 plasma torus, auroral acceleration mechanisms, and Jovian magnetospheric boundary dynamics using Juno, Galileo, and Chandra datasets.",
    hypothesis:
      "Volcanic mass loading from Io produces rapid rotational acceleration of Jovian magnetospheric plasma, driving co-rotation breakdown and giant mega-ampere auroral Birkeland currents.",
    discipline: "PLANETARY_SCIENCE",
    tags: ["Jupiter", "Io", "Europa", "Ganymede", "Juno", "Magnetosphere", "Auroras"],
    targetSlugs: ["jupiter", "io", "europa", "ganymede", "callisto"],
    datasetSlugs: ["jwst-nircam-deep-field-photometry"],
    missionSlugs: ["juno", "galileo", "voyager-1", "voyager-2"],
    observatorySlugs: ["w-m-keck-observatory", "paranal-observatory-vlt"],
    observingListIds: ["default-solar-system"],
    notes: [
      {
        id: "note-jup-01",
        targetSlug: "jupiter",
        title: "Co-rotation Breakdown Radius",
        content:
          "Co-rotation breakdown occurs between 20 and 30 R_J, where centrifugal force overcomes magnetic tension.",
        tags: ["Plasma", "Magnetosphere"],
        createdAt: "2026-08-20T00:00:00Z",
        updatedAt: "2026-08-20T00:00:00Z",
      },
    ],
    findings:
      "Demonstrated direct correlation between Io volcanic outbursts and Jovian decametric radio burst emission intensity.",
    status: "ACTIVE",
    createdAt: "2026-08-15T00:00:00Z",
    updatedAt: "2026-08-28T00:00:00Z",
  },
  {
    id: "proj-lunar-south-pole-volatiles",
    slug: "lunar-south-pole-volatiles-survey",
    title: "Lunar South Polar Regolith Volatiles & Thermophysical Mapping",
    description:
      "Comprehensive assessment of subsurface water-ice stability and thermal gradients within Permanently Shadowed Regions (PSRs) and high-latitude impact craters using Chandrayaan-3 and LRO data.",
    hypothesis:
      "Thermal conductivity of lunar polar regolith drops precipitously below 5cm depth, insulating volatile ice deposits against diurnal surface temperature swings.",
    discipline: "PLANETARY_SCIENCE",
    tags: ["Moon", "Chandrayaan-3", "Water Ice", "South Pole", "Shiv Shakti Point"],
    targetSlugs: ["moon", "solar-system"],
    datasetSlugs: ["chandrayaan3-chaste-thermophysics", "chandrayaan3-pragyan-libs-spectra"],
    missionSlugs: ["chandrayaan-3", "chandrayaan-1"],
    observatorySlugs: [],
    observingListIds: ["default-solar-system"],
    notes: [
      {
        id: "note-moon-01",
        targetSlug: "moon",
        title: "ChaSTE In-Situ Temperature Delta",
        content:
          "Measured surface temperature of ~50°C dropping to -10°C just 8cm below surface, proving intense thermal insulation.",
        tags: ["Thermophysics", "ChaSTE"],
        createdAt: "2026-08-22T00:00:00Z",
        updatedAt: "2026-08-22T00:00:00Z",
      },
    ],
    findings:
      "ChaSTE probe verified steep negative temperature gradient (dT/dz ~ 7.5 K/cm) within the top 10cm of high-latitude lunar soil.",
    status: "ACTIVE",
    createdAt: "2026-08-10T00:00:00Z",
    updatedAt: "2026-08-28T00:00:00Z",
  },
  {
    id: "proj-trappist-habitability",
    slug: "trappist1-exoplanet-atmospheres",
    title: "Atmospheric Characterization & Habitability Survey of TRAPPIST-1 System",
    description:
      "Transmission spectroscopy and stellar flare impact assessment across the seven Earth-sized exoplanets orbiting the ultra-cool red dwarf TRAPPIST-1.",
    hypothesis:
      "Planets e, f, and g maintain temperate surface equilibriums despite high stellar XUV flare frequency due to atmospheric magnetic shielding or secondary outgassing atmospheres.",
    discipline: "EXOPLANETARY_SCIENCE",
    tags: ["TRAPPIST-1", "Exoplanets", "Habitable Zone", "JWST", "Atmosphere"],
    targetSlugs: ["trappist-1", "trappist-1-e", "trappist-1-f", "trappist-1-g"],
    datasetSlugs: ["jwst-nircam-deep-field-photometry"],
    missionSlugs: ["james-webb-space-telescope"],
    observatorySlugs: ["paranal-observatory-vlt", "w-m-keck-observatory"],
    observingListIds: ["default-exoplanets"],
    notes: [],
    findings:
      "JWST MIRI thermal emission measurements of TRAPPIST-1 b exclude thick CO2 atmosphere; follow-up scheduled for TRAPPIST-1 e.",
    status: "ACTIVE",
    createdAt: "2026-08-01T00:00:00Z",
    updatedAt: "2026-08-28T00:00:00Z",
  },
];

export class ResearchProjectManager {
  private projects: ResearchProject[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window === "undefined") {
      this.projects = [...DEFAULT_RESEARCH_PROJECTS];
      return;
    }

    try {
      const stored = localStorage.getItem(RESEARCH_PROJECTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.projects = parsed;
          return;
        }
      }
    } catch {
      // Fallback
    }
    this.projects = [...DEFAULT_RESEARCH_PROJECTS];
    this.saveToStorage();
  }

  private saveToStorage(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(RESEARCH_PROJECTS_STORAGE_KEY, JSON.stringify(this.projects));
    } catch {
      // Ignore
    }
  }

  public getProjects(): ResearchProject[] {
    return this.projects;
  }

  public getProjectBySlug(slug: string): ResearchProject | undefined {
    return this.projects.find((p) => p.slug === slug || p.id === slug);
  }

  public createProject(
    project: Omit<ResearchProject, "id" | "createdAt" | "updatedAt">
  ): ResearchProject {
    const newProject: ResearchProject = {
      ...project,
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.projects.unshift(newProject);
    this.saveToStorage();
    return newProject;
  }

  public updateProject(id: string, updates: Partial<ResearchProject>): ResearchProject | null {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.projects[index] = {
      ...this.projects[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveToStorage();
    return this.projects[index];
  }

  public deleteProject(id: string): ResearchProject[] {
    this.projects = this.projects.filter((p) => p.id !== id);
    this.saveToStorage();
    return this.projects;
  }

  public exportProjectsAsJson(): string {
    return JSON.stringify(this.projects, null, 2);
  }

  public importProjectsFromJson(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        this.projects = parsed;
        this.saveToStorage();
        return true;
      }
    } catch {
      // Invalid
    }
    return false;
  }
}

export const researchProjectManager = new ResearchProjectManager();
