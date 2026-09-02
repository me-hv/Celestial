import {
  ScientificDataset,
  ScientificDiscipline,
  WavelengthBand,
  DatasetDataType,
} from "@/domain/data-provider/types";
import { SCIENTIFIC_DATASETS } from "./dataset-data";

export interface DatasetFilterOptions {
  organizationSlug?: string;
  providerSlug?: string;
  missionSlug?: string;
  targetSlug?: string;
  discipline?: ScientificDiscipline;
  wavelengthBand?: WavelengthBand;
  dataType?: DatasetDataType;
  search?: string;
}

export class DatasetRepository {
  private readonly datasets: Map<string, ScientificDataset> = new Map();

  constructor(initialDatasets: ScientificDataset[] = SCIENTIFIC_DATASETS) {
    initialDatasets.forEach((ds) => {
      this.datasets.set(ds.id, ds);
      this.datasets.set(ds.slug, ds);
    });
  }

  public getAll(): ScientificDataset[] {
    const uniqueMap = new Map<string, ScientificDataset>();
    this.datasets.forEach((ds) => uniqueMap.set(ds.id, ds));
    return Array.from(uniqueMap.values());
  }

  public getById(id: string): ScientificDataset | undefined {
    return this.datasets.get(id);
  }

  public getBySlug(slug: string): ScientificDataset | undefined {
    return this.datasets.get(slug);
  }

  public getByOrganization(orgSlugOrId: string): ScientificDataset[] {
    const slug = orgSlugOrId.toLowerCase();
    return this.getAll().filter(
      (ds) => ds.organizationSlug.toLowerCase() === slug || ds.organizationId.toLowerCase() === slug
    );
  }

  public getByProvider(providerSlugOrId: string): ScientificDataset[] {
    const slug = providerSlugOrId.toLowerCase();
    return this.getAll().filter(
      (ds) => ds.providerSlug.toLowerCase() === slug || ds.providerId.toLowerCase() === slug
    );
  }

  public getByMission(missionSlugOrId: string): ScientificDataset[] {
    const slug = missionSlugOrId.toLowerCase();
    return this.getAll().filter(
      (ds) => ds.missionSlug?.toLowerCase() === slug || ds.missionId?.toLowerCase() === slug
    );
  }

  public getByTarget(targetSlug: string): ScientificDataset[] {
    const slug = targetSlug.toLowerCase();
    return this.getAll().filter((ds) =>
      ds.targetSlugs.some((t) => t.toLowerCase() === slug || t.toLowerCase().includes(slug))
    );
  }

  public getByDiscipline(discipline: ScientificDiscipline): ScientificDataset[] {
    return this.getAll().filter((ds) => ds.discipline === discipline);
  }

  public getByWavelength(wavelength: WavelengthBand): ScientificDataset[] {
    return this.getAll().filter((ds) => ds.wavelengthBand === wavelength);
  }

  public filter(options: DatasetFilterOptions): ScientificDataset[] {
    return this.getAll().filter((ds) => {
      if (
        options.organizationSlug &&
        ds.organizationSlug.toLowerCase() !== options.organizationSlug.toLowerCase()
      ) {
        return false;
      }
      if (
        options.providerSlug &&
        ds.providerSlug.toLowerCase() !== options.providerSlug.toLowerCase()
      ) {
        return false;
      }
      if (
        options.missionSlug &&
        ds.missionSlug?.toLowerCase() !== options.missionSlug.toLowerCase()
      ) {
        return false;
      }
      if (
        options.targetSlug &&
        !ds.targetSlugs.some((t) => t.toLowerCase() === options.targetSlug?.toLowerCase())
      ) {
        return false;
      }
      if (options.discipline && ds.discipline !== options.discipline) {
        return false;
      }
      if (options.wavelengthBand && ds.wavelengthBand !== options.wavelengthBand) {
        return false;
      }
      if (options.dataType && ds.dataType !== options.dataType) {
        return false;
      }
      if (options.search && options.search.trim()) {
        const query = options.search.toLowerCase();
        const matchesTitle = ds.title.toLowerCase().includes(query);
        const matchesDesc = ds.description.toLowerCase().includes(query);
        const matchesOrg = ds.organizationName.toLowerCase().includes(query);
        const matchesTarget = ds.primaryTargetName.toLowerCase().includes(query);
        const matchesTags = ds.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesOrg && !matchesTarget && !matchesTags) {
          return false;
        }
      }
      return true;
    });
  }
}

export const datasetRepo = new DatasetRepository();
