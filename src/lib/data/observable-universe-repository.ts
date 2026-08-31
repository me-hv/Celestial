import {
  CosmicHorizon,
  RedshiftShell,
  ObservationalLandmark,
  CMBLastScatteringSurface,
} from "@/domain/observable-universe/types";
import {
  COSMIC_HORIZONS_DATA,
  REDSHIFT_SHELLS_DATA,
  OBSERVATIONAL_LANDMARKS_DATA,
  CMB_DETAILED_DATA,
} from "./observable-universe-data";

/**
 * Repository Provider for Observable Universe, Cosmic Horizons, and CMB
 */
export class ObservableUniverseRepository {
  private readonly horizons: CosmicHorizon[];
  private readonly shells: RedshiftShell[];
  private readonly landmarks: ObservationalLandmark[];
  private readonly cmb: CMBLastScatteringSurface;

  constructor(
    horizons: CosmicHorizon[] = COSMIC_HORIZONS_DATA,
    shells: RedshiftShell[] = REDSHIFT_SHELLS_DATA,
    landmarks: ObservationalLandmark[] = OBSERVATIONAL_LANDMARKS_DATA,
    cmb: CMBLastScatteringSurface = CMB_DETAILED_DATA
  ) {
    this.horizons = [...horizons];
    this.shells = [...shells].sort((a, b) => a.orderIndex - b.orderIndex);
    this.landmarks = [...landmarks].sort((a, b) => a.redshiftZ - b.redshiftZ);
    this.cmb = { ...cmb };
  }

  // --- Horizons ---
  public getAllHorizons(): CosmicHorizon[] {
    return [...this.horizons];
  }

  public getHorizonBySlug(slug: string): CosmicHorizon | undefined {
    return this.horizons.find((h) => h.slug === slug);
  }

  // --- Redshift Shells ---
  public getAllShells(): RedshiftShell[] {
    return [...this.shells];
  }

  public getShellBySlug(slug: string): RedshiftShell | undefined {
    return this.shells.find((s) => s.slug === slug);
  }

  public getShellForRedshift(z: number): RedshiftShell {
    const clampedZ = Math.max(0, z);
    const matched = this.shells.find(
      (s) => clampedZ >= s.minRedshiftZ && clampedZ < s.maxRedshiftZ
    );
    return matched || this.shells[this.shells.length - 1];
  }

  // --- Observational Landmarks ---
  public getAllLandmarks(): ObservationalLandmark[] {
    return [...this.landmarks];
  }

  public getLandmarkBySlug(slug: string): ObservationalLandmark | undefined {
    return this.landmarks.find((l) => l.slug === slug);
  }

  public getLandmarksByCategory(
    category: ObservationalLandmark["category"]
  ): ObservationalLandmark[] {
    return this.landmarks.filter((l) => l.category === category);
  }

  // --- CMB ---
  public getCMB(): CMBLastScatteringSurface {
    return this.cmb;
  }

  // --- Full-Text Search ---
  public search(query: string): (ObservationalLandmark | CosmicHorizon | RedshiftShell)[] {
    if (!query.trim()) return this.getAllLandmarks();
    const q = query.toLowerCase().trim();

    const matchedLandmarks = this.landmarks.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.slug.toLowerCase().includes(q) ||
        (l.standardDesignation && l.standardDesignation.toLowerCase().includes(q)) ||
        l.summary.toLowerCase().includes(q)
    );

    const matchedHorizons = this.horizons.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.slug.toLowerCase().includes(q) ||
        h.summary.toLowerCase().includes(q) ||
        h.physicalMeaning.toLowerCase().includes(q)
    );

    const matchedShells = this.shells.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.representativeObjects.some((obj) => obj.toLowerCase().includes(q))
    );

    return [...matchedLandmarks, ...matchedHorizons, ...matchedShells];
  }
}

export const observableUniverseRepo = new ObservableUniverseRepository();
