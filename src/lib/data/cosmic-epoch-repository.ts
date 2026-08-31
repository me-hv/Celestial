import { CosmicEpoch, CosmicEpochType, MilestoneEvent } from "@/domain/cosmic-time/types";
import { COSMIC_EPOCHS_DATA } from "./cosmic-epoch-data";
import {
  COSMIC_MILESTONES,
  getEpochTypeForRedshift,
  getEpochTypeForCosmicAge,
} from "../astronomy/cosmology/cosmic-timeline";
import { defaultCosmology } from "../astronomy/cosmology/cosmology-calculator";

export class CosmicEpochRepository {
  private epochs: CosmicEpoch[];
  private slugIndex: Map<string, CosmicEpoch>;
  private typeIndex: Map<CosmicEpochType, CosmicEpoch>;

  constructor(epochs: CosmicEpoch[] = COSMIC_EPOCHS_DATA) {
    this.epochs = [...epochs].sort((a, b) => a.orderIndex - b.orderIndex);
    this.slugIndex = new Map();
    this.typeIndex = new Map();

    this.epochs.forEach((epoch) => {
      this.slugIndex.set(epoch.slug.toLowerCase(), epoch);
      this.typeIndex.set(epoch.type, epoch);
    });
  }

  public getAll(): CosmicEpoch[] {
    return [...this.epochs];
  }

  public getBySlug(slug: string): CosmicEpoch | undefined {
    return this.slugIndex.get(slug.toLowerCase().trim());
  }

  public getByType(type: CosmicEpochType): CosmicEpoch | undefined {
    return this.typeIndex.get(type);
  }

  public getEpochForRedshift(z: number): CosmicEpoch {
    const epochType = getEpochTypeForRedshift(z);
    const found = this.typeIndex.get(epochType);
    return found ?? this.epochs[this.epochs.length - 1];
  }

  public getEpochForCosmicAge(ageYears: number): CosmicEpoch {
    const epochType = getEpochTypeForCosmicAge(ageYears);
    const found = this.typeIndex.get(epochType);
    return found ?? this.epochs[this.epochs.length - 1];
  }

  public getEpochForLookbackTime(lookbackGyr: number): CosmicEpoch {
    const universeAgeGyr = defaultCosmology.calculateUniverseAgeGyr();
    const cosmicAgeGyr = Math.max(0, universeAgeGyr - lookbackGyr);
    return this.getEpochForCosmicAge(cosmicAgeGyr * 1e9);
  }

  public getMilestones(): MilestoneEvent[] {
    return [...COSMIC_MILESTONES];
  }

  public getSurroundingEpochs(slug: string): { prev?: CosmicEpoch; next?: CosmicEpoch } {
    const epoch = this.getBySlug(slug);
    if (!epoch) return {};

    const idx = this.epochs.findIndex((e) => e.slug === epoch.slug);
    return {
      prev: idx > 0 ? this.epochs[idx - 1] : undefined,
      next: idx < this.epochs.length - 1 ? this.epochs[idx + 1] : undefined,
    };
  }

  public search(query: string): CosmicEpoch[] {
    if (!query.trim()) return this.getAll();
    const q = query.toLowerCase().trim();

    return this.epochs.filter((epoch) => {
      return (
        epoch.name.toLowerCase().includes(q) ||
        epoch.tagline.toLowerCase().includes(q) ||
        epoch.summary.toLowerCase().includes(q) ||
        epoch.description.toLowerCase().includes(q) ||
        epoch.type.toLowerCase().includes(q) ||
        epoch.physicalProcesses.some(
          (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
        ) ||
        epoch.observationalEvidence.some(
          (e) =>
            e.primarySignature.toLowerCase().includes(q) ||
            e.technique.toLowerCase().includes(q) ||
            (e.observatoryOrMission && e.observatoryOrMission.toLowerCase().includes(q))
        ) ||
        epoch.keyMilestones.some(
          (m) => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
        )
      );
    });
  }
}

export const cosmicEpochRepo = new CosmicEpochRepository();
