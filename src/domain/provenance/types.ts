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

export interface ProvenanceRecord {
  sourceId: string;
  authoritativeBody: AuthoritativeBody;
  catalogName: string;
  catalogVersion?: string;
  recordIdentifier: string;
  citationUrl?: string;
  doi?: string;
  bibcode?: string;
  confidenceScore: number; // 0.0 to 1.0
  retrievedAt: string; // ISO 8601 string
}

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
