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
  | "PEER_REVIEWED_PAPER";

export const AuthoritativeBodySchema = z.enum([
  "IAU",
  "NASA",
  "ESA",
  "ESO",
  "SIMBAD",
  "MINOR_PLANET_CENTER",
  "GAIA",
  "PEER_REVIEWED_PAPER",
]);

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
