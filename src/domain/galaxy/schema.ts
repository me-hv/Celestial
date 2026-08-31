import { z } from "zod";
import { ProvenanceRecordSchema } from "../provenance/types";
import {
  ScientificMeasurementSchema,
  CatalogIdentifiersSchema,
  PositionalPropertiesSchema,
  MultiWavelengthObservationSchema,
} from "../celestial-object/schema";

export const GalaxyMorphologyClassSchema = z.enum([
  "SPIRAL",
  "BARRED_SPIRAL",
  "ELLIPTICAL",
  "LENTICULAR",
  "IRREGULAR",
  "DWARF_SPHEROIDAL",
  "DWARF_IRREGULAR",
  "DWARF_ELLIPTICAL",
]);

export const GalaxyMorphologySchema = z.object({
  class: GalaxyMorphologyClassSchema,
  hubbleDeVaucouleurs: z.string().min(1),
  isModelDerived: z.boolean().optional(),
  notes: z.string().optional(),
});

export const GalaxyPhysicalPropertiesSchema = z.object({
  diameterLy: ScientificMeasurementSchema,
  diameterKpc: ScientificMeasurementSchema,
  stellarMassSolar: ScientificMeasurementSchema.optional(),
  totalMassSolar: ScientificMeasurementSchema.optional(),
  neutralHydrogenMassSolar: ScientificMeasurementSchema.optional(),
  starFormationRateSolarMassPerYr: z.number().optional(),
  metallicityFeH: z.number().optional(),
  absoluteMagnitudeV: z.number().optional(),
  apparentMagnitudeV: z.number().optional(),
});

export const GalaxyKinematicsSchema = z.object({
  heliocentricRadialVelocityKmS: ScientificMeasurementSchema,
  galactocentricRadialVelocityKmS: ScientificMeasurementSchema.optional(),
  spectroscopicRedshiftZ: ScientificMeasurementSchema.optional(),
  rotationalVelocityKmS: ScientificMeasurementSchema.optional(),
  velocityDispersionKmS: z.number().optional(),
});

export const GalaxyOrientationSchema = z.object({
  inclinationDeg: z.number().min(0).max(90),
  positionAngleDeg: z.number().min(0).max(360),
  majorAxisArcmin: z.number().min(0),
  minorAxisArcmin: z.number().min(0),
  axisRatio: z.number().min(0).max(1),
});

export const GalaxyDistanceMethodSchema = z.enum([
  "TRGB",
  "CEPHEID",
  "SURFACE_BRIGHTNESS_FLUCTUATIONS",
  "TYPE_IA_SUPERNOVA",
  "TULLY_FISHER",
  "REDSHIFT_HUBBLE_FLOW",
  "LITERATURE_CONSENSUS",
]);

export const GalaxyDistanceSchema = z.object({
  distanceLy: ScientificMeasurementSchema,
  distanceKpc: ScientificMeasurementSchema,
  distanceMpc: ScientificMeasurementSchema,
  primaryMethod: GalaxyDistanceMethodSchema,
  derivedLookbackTimeYears: z.number().min(0),
  cosmologicalAssumptions: z
    .object({
      hubbleConstantKmSPerMpc: z.number().positive(),
      approximationModel: z.string(),
    })
    .optional(),
});

export const GroupMembershipTypeSchema = z.enum([
  "PRIMARY_MEMBER",
  "SATELLITE",
  "DWARF_MEMBER",
  "CANDIDATE",
]);

export const GalaxyGroupMembershipSchema = z.object({
  groupId: z.string().min(1),
  groupName: z.string().min(1),
  membershipType: GroupMembershipTypeSchema,
  subgroupId: z
    .enum([
      "MILKY_WAY_SUBGROUP",
      "ANDROMEDA_SUBGROUP",
      "TRIANGULUM_SUBGROUP",
      "LOCAL_GROUP_ISOLATED",
    ])
    .optional(),
  parentGalaxySlug: z.string().optional(),
});

export const GalaxyRelationshipTypeSchema = z.enum([
  "SATELLITE_OF",
  "HOST_TO",
  "INTERACTING_WITH",
  "APPROACHING",
  "PAIR_WITH",
  "GRAVITATIONAL_ASSOCIATION",
]);

export const GalaxyRelationshipSchema = z.object({
  targetGalaxySlug: z.string().min(1),
  targetGalaxyName: z.string().min(1),
  relationshipType: GalaxyRelationshipTypeSchema,
  relativeVelocityKmS: z.number().optional(),
  separationKpc: z.number().optional(),
  description: z.string(),
  isFutureInteraction: z.boolean().optional(),
});

export const GalaxySchema = z.object({
  id: z.string(),
  slug: z.string().min(1),
  name: z.string().min(1),
  standardDesignation: z.string().optional(),
  aliases: z.array(z.string()).optional(),
  summary: z.string(),

  morphology: GalaxyMorphologySchema,
  physical: GalaxyPhysicalPropertiesSchema,
  kinematics: GalaxyKinematicsSchema,
  orientation: GalaxyOrientationSchema,
  distance: GalaxyDistanceSchema,
  positional: PositionalPropertiesSchema,
  catalogIdentifiers: CatalogIdentifiersSchema.optional(),

  groupMembership: GalaxyGroupMembershipSchema.optional(),
  relationships: z.array(GalaxyRelationshipSchema).optional(),
  observations: z.array(MultiWavelengthObservationSchema).optional(),

  provenance: ProvenanceRecordSchema,
});
