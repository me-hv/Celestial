import { z } from "zod";

/**
 * Scientific Data Provenance and Source Tracking Types
 */

export type AuthoritativeBody =
  | "IAU" // International Astronomical Union
  | "NASA" // National Aeronautics and Space Administration
  | "ESA" // European Space Agency
  | "ESO" // European Southern Observatory
  | "SIMBAD" // CDS Strasbourg astronomical database
  | "MINOR_PLANET_CENTER" // Minor Planet Center (MPC)
  | "GAIA" // ESA Gaia Mission Data Release
  | "ISRO" // Indian Space Research Organisation
  | "JAXA" // Japan Aerospace Exploration Agency
  | "CNSA" // China National Space Administration
  | "ROSKOSMOS" // Roscosmos State Space Corporation
  | "SOVIET_ACADEMY_OF_SCIENCES" // Historical Soviet Academy of Sciences
  | "KARI" // Korea Aerospace Research Institute
  | "UAESA" // United Arab Emirates Space Agency
  | "CNES" // Centre National d'Etudes Spatiales
  | "DLR" // German Aerospace Center
  | "ASI" // Italian Space Agency
  | "UKSA" // UK Space Agency
  | "CSA" // Canadian Space Agency
  | "CSIRO" // Commonwealth Scientific and Industrial Research Organisation
  | "EHT_COLLABORATION" // Event Horizon Telescope Collaboration
  | "LVK_COLLABORATION" // LIGO-Virgo-KAGRA Collaboration
  | "PEER_REVIEWED_PAPER"
  | "OTHER_OFFICIAL_AGENCY"
  | (string & {});

export const AuthoritativeBodySchema = z.string().min(1);

export interface ProvenanceRecord {
  sourceId?: string;
  authoritativeBody: AuthoritativeBody;
  catalogName: string;
  catalogVersion?: string;
  recordIdentifier: string;
  citationUrl?: string;
  doi?: string;
  bibcode?: string;
  confidenceScore: number; // 0.0 to 1.0
  retrievedAt?: string; // ISO 8601 string
  lastIngestedAt?: string;
}

export const ProvenanceRecordSchema = z.object({
  sourceId: z.string().optional(),
  authoritativeBody: AuthoritativeBodySchema,
  catalogName: z.string().min(1),
  catalogVersion: z.string().optional(),
  recordIdentifier: z.string().min(1),
  citationUrl: z.string().url().optional(),
  doi: z.string().optional(),
  bibcode: z.string().optional(),
  confidenceScore: z.number().min(0).max(1),
  retrievedAt: z.string().optional(),
  lastIngestedAt: z.string().optional(),
});

export interface DataSource {
  id: string;
  name: string;
  authoritativeBody: AuthoritativeBody;
  catalogName?: string;
  catalogVersion?: string;
  citationUrl?: string;
  doi?: string;
  bibcode?: string;
  description?: string;
}
