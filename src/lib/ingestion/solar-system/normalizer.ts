import { CelestialObject } from "@/domain/celestial-object/types";
import { INormalizer, IValidator } from "../pipeline.interface";
import { CelestialObjectSchema } from "@/domain/celestial-object/schema";
import { ValidationError } from "@/lib/errors/app-error";

export interface RawSolarSystemRecord {
  name: string;
  designation?: string;
  type: string;
  semiMajorAxisAU?: number;
  eccentricity?: number;
  inclinationDeg?: number;
  longAscNodeDeg?: number;
  argPeriapsisDeg?: number;
  meanAnomalyDeg?: number;
  orbitalPeriodDays?: number;
  massKg?: number;
  radiusKm?: number;
  gravityMs2?: number;
  meanTempK?: number;
  parentSlug?: string;
  sourceCatalog?: string;
  sourceRecordId?: string;
}

export class SolarSystemNormalizer implements INormalizer<
  RawSolarSystemRecord,
  Partial<CelestialObject>
> {
  public normalize(raw: RawSolarSystemRecord): Partial<CelestialObject> {
    return {
      canonicalName: raw.name.trim(),
      standardDesignation: raw.designation?.trim(),
      physical: {
        massKg: raw.massKg,
        meanRadiusKm: raw.radiusKm,
        surfaceGravityMs2: raw.gravityMs2,
        meanTemperatureK: raw.meanTempK,
      },
      orbital: raw.semiMajorAxisAU
        ? {
            semiMajorAxisAu: raw.semiMajorAxisAU,
            eccentricity: raw.eccentricity,
            inclinationDeg: raw.inclinationDeg,
            longitudeAscendingNodeDeg: raw.longAscNodeDeg,
            argumentPeriapsisDeg: raw.argPeriapsisDeg,
            meanAnomalyDeg: raw.meanAnomalyDeg,
            orbitalPeriodDays: raw.orbitalPeriodDays,
          }
        : undefined,
    };
  }
}

export class SolarSystemValidator implements IValidator<CelestialObject, CelestialObject> {
  public validate(data: CelestialObject): CelestialObject {
    const parseResult = CelestialObjectSchema.safeParse(data);
    if (!parseResult.success) {
      throw new ValidationError(
        `Validation failed for celestial object '${data.canonicalName}': ${parseResult.error.message}`,
        parseResult.error.format()
      );
    }
    return parseResult.data as CelestialObject;
  }
}
