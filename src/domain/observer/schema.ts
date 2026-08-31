import { z } from "zod";
import { ProvenanceRecordSchema } from "../provenance/types";

export const ObserverLocationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  latitudeDeg: z.number().min(-90).max(90),
  longitudeDeg: z.number().min(-180).max(180),
  elevationMeters: z.number(),
  timezone: z.string().min(1),
  isCustom: z.boolean().optional(),
});

export const HorizontalCoordinatesSchema = z.object({
  altitudeDeg: z.number().min(-90).max(90),
  azimuthDeg: z.number().min(0).max(360),
  apparentAltitudeDeg: z.number().min(-90).max(90),
  hourAngleDeg: z.number(),
  hourAngleHours: z.number().min(0).max(24),
  isAboveHorizon: z.boolean(),
});

export const EclipticCoordinatesSchema = z.object({
  eclipticLongitudeDeg: z.number().min(0).max(360),
  eclipticLatitudeDeg: z.number().min(-90).max(90),
});

export const RiseTransitSetResultSchema = z.object({
  riseDate: z.date().nullable(),
  transitDate: z.date().nullable(),
  setDate: z.date().nullable(),
  transitAltitudeDeg: z.number(),
  status: z.enum(["NORMAL", "CIRCUMPOLAR", "NEVER_RISES"]),
  message: z.string().optional(),
});

export const SkyObjectObservationSchema = z.object({
  objectId: z.string().min(1),
  objectSlug: z.string().min(1),
  canonicalName: z.string().min(1),
  standardDesignation: z.string().optional(),
  category: z.string().min(1),
  type: z.string().min(1),
  apparentMagnitudeV: z.number().optional(),
  spectralClass: z.string().optional(),
  raDeg: z.number().min(0).max(360),
  decDeg: z.number().min(-90).max(90),
  galacticLongDeg: z.number().optional(),
  galacticLatDeg: z.number().optional(),
  horizontal: HorizontalCoordinatesSchema,
  constellation: z.string().min(1),
  state: z.enum(["ABOVE_HORIZON", "BELOW_HORIZON", "RISING", "SETTING", "CULMINATING"]),
  riseTransitSet: RiseTransitSetResultSchema,
  distanceLy: z.number().optional(),
  provenance: ProvenanceRecordSchema,
});
