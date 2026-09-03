import { z } from "zod";
import { ProvenanceRecordSchema } from "../provenance/types";
import { EpistemicStatusSchema } from "../mission/schema";

export const CrossDomainIntelligenceResultSchema = z.object({
  id: z.string().min(1),
  topic: z.enum([
    "SPACE_WEATHER_EARTH_COUPLING",
    "MISSION_TARGET_EXPLORATION",
    "OBSERVATION_QUALITY_ASSESSMENT",
    "SOLAR_ACTIVITY_FORECAST",
  ]),
  statement: z.string().min(1),
  basis: z.string().min(1),
  inputs: z.record(z.unknown()),
  epistemicStatus: EpistemicStatusSchema,
  confidenceScore: z.number().min(0).max(1),
  generatedAt: z.string().min(1),
  sourceReferences: z.array(z.string()),
  limitations: z.array(z.string()),
  provenance: ProvenanceRecordSchema,
});
