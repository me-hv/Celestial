import { ObservingList } from "@/domain/research/types";

const STORAGE_KEY = "celestial_observing_lists_v1";

const DEFAULT_LISTS: ObservingList[] = [
  {
    id: "list-messier-highlights",
    name: "Messier Showcase & Deep Sky",
    description: "Iconic deep-sky targets suitable for backyard telescopes and dark sky sites.",
    targetSlugs: [
      "andromeda-galaxy-m31",
      "orion-nebula-m42",
      "pleiades-m45",
      "whirlpool-galaxy-m51",
      "ring-nebula-m57",
    ],
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z",
    constraints: {
      minAltitudeDeg: 20,
      twilightRequirement: "ASTRONOMICAL",
      maxMoonIllumination: 0.6,
    },
  },
  {
    id: "list-planetary-tour",
    name: "Solar System Planetary Tour",
    description: "High-contrast naked-eye and telescopic planetary targets visible this season.",
    targetSlugs: ["jupiter", "saturn", "mars", "venus"],
    createdAt: "2026-08-15T00:00:00.000Z",
    updatedAt: "2026-08-15T00:00:00.000Z",
    constraints: {
      minAltitudeDeg: 15,
      twilightRequirement: "CIVIL",
    },
  },
];

export class ObservingListManager {
  private static instance: ObservingListManager;

  private constructor() {}

  public static getInstance(): ObservingListManager {
    if (!ObservingListManager.instance) {
      ObservingListManager.instance = new ObservingListManager();
    }
    return ObservingListManager.instance;
  }

  public getLists(): ObservingList[] {
    if (typeof window === "undefined") {
      return DEFAULT_LISTS;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_LISTS;
  }

  public saveLists(lists: ObservingList[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
    } catch (err) {
      console.warn("Failed to persist observing lists to localStorage", err);
    }
  }

  public addTargetToList(listId: string, targetSlug: string): ObservingList[] {
    const lists = this.getLists();
    const targetList = lists.find((l) => l.id === listId);
    if (targetList && !targetList.targetSlugs.includes(targetSlug)) {
      targetList.targetSlugs.push(targetSlug);
      targetList.updatedAt = new Date().toISOString();
      this.saveLists(lists);
    }
    return lists;
  }

  public removeTargetFromList(listId: string, targetSlug: string): ObservingList[] {
    const lists = this.getLists();
    const targetList = lists.find((l) => l.id === listId);
    if (targetList) {
      targetList.targetSlugs = targetList.targetSlugs.filter((s) => s !== targetSlug);
      targetList.updatedAt = new Date().toISOString();
      this.saveLists(lists);
    }
    return lists;
  }

  public createList(name: string, description = "", initialSlugs: string[] = []): ObservingList {
    const lists = this.getLists();
    const newList: ObservingList = {
      id: `list-${Date.now()}`,
      name,
      description,
      targetSlugs: initialSlugs,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      constraints: {
        minAltitudeDeg: 15,
        twilightRequirement: "ASTRONOMICAL",
      },
    };
    lists.push(newList);
    this.saveLists(lists);
    return newList;
  }

  public deleteList(listId: string): ObservingList[] {
    let lists = this.getLists();
    lists = lists.filter((l) => l.id !== listId);
    this.saveLists(lists);
    return lists;
  }
}

export const observingListManager = ObservingListManager.getInstance();
