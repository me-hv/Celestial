import { SpaceWeatherObservation } from "@/domain/space-weather/types";
import { BASELINE_SPACE_WEATHER_OBSERVATION } from "./space-weather-data";
import { noaaSwpcAdapter } from "@/lib/live-data/adapters/noaa-swpc-adapter";

export class SpaceWeatherRepository {
  private static instance: SpaceWeatherRepository;
  private currentObservation: SpaceWeatherObservation = BASELINE_SPACE_WEATHER_OBSERVATION;

  private constructor() {}

  public static getInstance(): SpaceWeatherRepository {
    if (!SpaceWeatherRepository.instance) {
      SpaceWeatherRepository.instance = new SpaceWeatherRepository();
    }
    return SpaceWeatherRepository.instance;
  }

  public getCurrent(): SpaceWeatherObservation {
    return this.currentObservation;
  }

  public async refreshFromLiveSource(): Promise<SpaceWeatherObservation> {
    try {
      const raw = await noaaSwpcAdapter.fetch();
      const validation = noaaSwpcAdapter.validate(raw);
      if (validation.isValid) {
        const obs = noaaSwpcAdapter.normalize(raw);
        this.currentObservation = obs;
        return obs;
      }
    } catch {
      // Keep baseline with STALE marker
      this.currentObservation = {
        ...this.currentObservation,
        freshness: "STALE",
      };
    }
    return this.currentObservation;
  }
}

export const spaceWeatherRepo = SpaceWeatherRepository.getInstance();
