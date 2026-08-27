# CELESTIAL Domain Model & Taxonomy

This document outlines the astronomical domain model, taxonomy, naming/alias resolution strategy, and scientific provenance design for **CELESTIAL**.

## 1. The Generalized Celestial Object Paradigm

In traditional astronomy applications, planets, stars, moons, and galaxies are often modeled as disparate tables or disjointed classes. In CELESTIAL, every astronomical entity inherits from the canonical `CelestialObject` model.

### Core Entity Anatomy

```
CelestialObject
├── identity
│   ├── id (UUID v4 / canonical slug)
│   ├── canonicalName (e.g. "Earth")
│   ├── standardDesignation (e.g. "Sol III")
│   └── aliases (e.g. ["Terra", "The Blue Planet", "Gaia"])
├── classification
│   ├── category (PLANET, STAR, MOON, GALAXY, NEBULA, ASTEROID, COMET, BLACK_HOLE, etc.)
│   ├── subType (e.g. TERRESTRIAL_PLANET, MAIN_SEQUENCE_G_DWARF, SPIRAL_GALAXY)
│   └── spectralClass / morphology
├── physicalProperties
│   ├── mass (with scientific exponent & units: kg or solar/earth masses)
│   ├── meanRadius (km)
│   ├── surfaceGravity (m/s²)
│   ├── density (g/cm³)
│   ├── meanTemperature (Kelvin)
│   └── atmosphereComposition (mole fraction array)
├── positionalProperties
│   ├── referenceFrame (ICRF, ECLIPTIC_J2000, GALACTIC)
│   ├── rightAscension (deg / hms)
│   ├── declination (deg / dms)
│   └── distance (light-years / parsecs / AU / km)
├── orbitalProperties (if orbiting a parent object or barycenter)
│   ├── parentId (UUID)
│   ├── semiMajorAxis (AU / km)
│   ├── eccentricity
│   ├── orbitalPeriod (days / years)
│   ├── inclination (deg)
│   └── epoch (Julian date)
├── relationships
│   ├── parentObjectId (e.g. Sun for Earth, Milky Way for Sun)
│   ├── childObjectIds (e.g. Moon for Earth)
│   ├── hostSystemId (e.g. Solar System)
│   └── hostGalaxyId (e.g. Milky Way)
├── media
│   ├── primaryThumbnailUrl
│   ├── textureMapUrls (diffuse, normal, specular, elevation)
│   └── imageryCredits
├── discoveries
│   ├── discoveryYear
│   ├── discoveredBy
│   └── discoveryMethod (TRANSIT, RADIAL_VELOCITY, DIRECT_IMAGING, ANTIQUITY)
└── provenance
    ├── primaryCatalogSource (e.g. "SIMBAD", "NASA Exoplanet Archive", "GAIA DR3")
    ├── sourceUrl
    ├── bibcode / doi
    └── lastVerifiedAt
```

---

## 2. Hierarchical Relationships

The universe is inherently nested. CELESTIAL supports arbitrary tree depth via directed parent-child relationships and system containers:

```
Galaxy (e.g., Milky Way)
   │
   └── Star System (e.g., Solar System)
          │
          ├── Star (e.g., Sun [Sol])
          │     │
          │     ├── Planet (e.g., Earth)
          │     │     │
          │     │     ├── Moon (e.g., The Moon [Luna])
          │     │     │
          │     │     └── Artificial Satellite / Spacecraft (e.g., ISS, Hubble)
          │     │
          │     └── Planet (e.g., Jupiter)
          │           │
          │           ├── Moon (e.g., Europa)
          │           └── Moon (e.g., Ganymede)
          │
          └── Minor Planet / Asteroid (e.g., 1 Ceres)
```

Furthermore, space exploration missions and spacecraft cross-reference these targets:

```
Celestial Object (e.g., Saturn)
   ▲
   │ Target of
Space Mission (e.g., Cassini-Huygens)
   │
   └── Spacecraft / Lander (e.g., Cassini Orbiter, Huygens Probe)
```

---

## 3. Naming and Alias Resolution Strategy

Astronomical objects frequently possess dozens of catalog designations across international surveys.
For example, **Sirius**:

- Canonical Name: `Sirius`
- Designation: `Alpha Canis Majoris` (`α CMa`)
- Catalog Identifiers: `HD 48915`, `HIP 32349`, `HR 2491`, `SAO 151881`, `BD-16°1591`
- Common Names: `Dog Star`, `Aschere`

### Alias Resolution Rules:

1. **Canonical Identifier**: Every object has an immutable, URL-friendly kebab-case `slug` (e.g., `sirius`, `earth`, `proxima-centauri`).
2. **Designation Table**: All aliases, catalog codes, and historical identifiers map to the canonical object ID with an alias type (`COMMON_NAME`, `BAYER_DESIGNATION`, `FLAMSTEED`, `CATALOG_CODE`, `POPULAR_CULTURE`).
3. **Fuzzy Search Indexing**: Search queries evaluate against canonical names, designations, and aliases simultaneously with weighted relevance ranking.

---

## 4. Scientific Provenance & Source Auditing

Astronomical values are scientific approximations with known uncertainties. CELESTIAL records metadata for scientific verification:

```typescript
interface ProvenanceRecord {
  sourceId: string;
  authoritativeBody:
    "IAU" | "NASA" | "ESA" | "ESO" | "SIMBAD" | "MINOR_PLANET_CENTER" | "PEER_REVIEWED_PAPER";
  catalogName: string;
  catalogVersion?: string;
  recordIdentifier: string; // e.g. "SIMBAD:NAME Sirius" or "KIC 8462852"
  citationUrl?: string;
  doi?: string;
  bibcode?: string;
  confidenceScore: number; // 0.0 - 1.0
  retrievedAt: string; // ISO 8601
}
```
