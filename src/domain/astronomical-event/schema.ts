import { z } from "zod";
import { EpistemicStatusSchema } from "../mission/schema";

export const AstronomicalEventTypeSchema = z.enum([
  "CONJUNCTION",
  "OPPOSITION",
  "OCCULTATION",
  "SOLAR_ECLIPSE",
  "LUNAR_ECLIPSE",
  "METEOR_SHOWER",
  "PLANETARY_TRANSIT",
  "LUNAR_PHASE",
  "COMET_APPROACH",
  "ASTEROID_CLOSE_APPROACH",
  "ROCKET_LAUNCH",
  "SPACECRAFT_ENCOUNTER",
  "SCIENTIFIC_DISCOVERY",
]);

export const AstronomicalEventSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  eventType: AstronomicalEventTypeSchema,
  description: z.string(),
  eventDate: z.string(),
  peakTime: z.string().optional(),
  durationHours: z.number().optional(),
  targetSlugs: z.array(z.string()),
  primaryTargetName: z.string(),
  secondaryTargetName: z.string().optional(),
  constellation: z.string().optional(),
  visibilityDescription: z.string(),
  nakedEyeVisible: z.boolean(),
  recommendedOptics: z.enum([
    "NAKED_EYE",
    "BINOCULARS",
    "SMALL_TELESCOPE",
    "LARGE_TELESCOPE",
    "PROFESSIONAL_OBSERVATORY",
  ]),
  observerLatitudeRange: z
    .object({
      minLatDeg: z.number(),
      maxLatDeg: z.number(),
      optimalRegion: z.string(),
    })
    .optional(),
  angularSeparationDeg: z.number().optional(),
  apparentMagnitudeV: z.number().optional(),
  lunarIlluminationFraction: z.number().optional(),
  missionSlug: z.string().optional(),
  observatorySlug: z.string().optional(),
  discoverySlug: z.string().optional(),
  scientificSignificance: z.string(),
  epistemicStatus: EpistemicStatusSchema,
  tags: z.array(z.string()),
});
