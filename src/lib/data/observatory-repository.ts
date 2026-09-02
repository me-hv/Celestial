import { GroundObservatory } from "@/domain/observatory/types";
import { OBSERVATORIES_DATA } from "./observatory-data";
import { skyObjectRepo } from "./sky-object-repository";
import { ObserverLocation, SkyObjectObservation } from "@/domain/observer/types";

export class ObservatoryRepository {
  private static instance: ObservatoryRepository;
  private observatories: GroundObservatory[];

  private constructor() {
    this.observatories = [...OBSERVATORIES_DATA];
  }

  public static getInstance(): ObservatoryRepository {
    if (!ObservatoryRepository.instance) {
      ObservatoryRepository.instance = new ObservatoryRepository();
    }
    return ObservatoryRepository.instance;
  }

  public getAll(): GroundObservatory[] {
    return this.observatories;
  }

  public getById(id: string): GroundObservatory | undefined {
    return this.observatories.find((obs) => obs.id === id);
  }

  public getBySlug(slug: string): GroundObservatory | undefined {
    return this.observatories.find((obs) => obs.slug === slug);
  }

  public getVisibleTargetsTonight(
    observatory: GroundObservatory,
    date = new Date(),
    maxMagnitudeV = 8.5
  ): SkyObjectObservation[] {
    const loc: ObserverLocation = {
      id: `loc-${observatory.slug}`,
      latitudeDeg: observatory.coordinates.latitudeDeg,
      longitudeDeg: observatory.coordinates.longitudeDeg,
      elevationMeters: observatory.coordinates.elevationMeters,
      name: observatory.name,
      timezone: observatory.timezone,
    };
    return skyObjectRepo.getVisibleSkyObjects(loc, date, { maxMagnitudeV });
  }
}

export const observatoryRepo = ObservatoryRepository.getInstance();
