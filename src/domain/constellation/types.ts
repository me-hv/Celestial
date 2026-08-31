import { ProvenanceRecord } from "../provenance/types";

export type ConstellationFamily =
  | "ZODIAC"
  | "URSA_MAJOR_FAMILY"
  | "PERSEUS_FAMILY"
  | "HERCULES_FAMILY"
  | "ORION_FAMILY"
  | "HEAVENLY_WATERS"
  | "BAYER_GROUP"
  | "LACAILLE_FAMILY";

export interface ConstellationStarRef {
  name: string;
  bayer?: string;
  raDeg: number;
  decDeg: number;
  magnitudeV?: number;
  spectralClass?: string;
}

export interface ConstellationAsterismLine {
  startStar: string; // Star name / Bayer
  endStar: string;
  startCoords: { raDeg: number; decDeg: number };
  endCoords: { raDeg: number; decDeg: number };
}

export interface Constellation {
  id: string;
  slug: string;
  name: string;
  iauCode: string; // 3-letter IAU abbreviation (e.g. ORI, UMA, CAS)
  genitive: string; // e.g. Orionis, Ursae Majoris
  family: ConstellationFamily;
  areaSquareDegrees: number;
  quadrant: "NQ1" | "NQ2" | "NQ3" | "NQ4" | "SQ1" | "SQ2" | "SQ3" | "SQ4";
  centerCoordinates: {
    raDeg: number;
    decDeg: number;
  };
  brightestStar: {
    name: string;
    designation: string;
    magnitudeV: number;
    raDeg: number;
    decDeg: number;
  };
  asterismLines: ConstellationAsterismLine[];
  majorStars: ConstellationStarRef[];
  lore: string;
  summary: string;
  provenance: ProvenanceRecord;
}
