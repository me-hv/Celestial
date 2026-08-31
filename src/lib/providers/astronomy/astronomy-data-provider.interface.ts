import { ProviderResult, AstronomicalObjectSearchQuery } from "./types";
import { CelestialObject } from "@/domain/celestial-object/types";

export interface IAstronomyDataProvider {
  readonly providerId: string;
  readonly providerName: string;
  readonly defaultEndpointUrl: string;

  queryObject(query: AstronomicalObjectSearchQuery): Promise<ProviderResult<CelestialObject>>;
  isHealthy(): Promise<boolean>;
}
