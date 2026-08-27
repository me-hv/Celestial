# CELESTIAL — Exoplanet Catalog & Uncertainty Specification

This document details the exoplanetary ingestion pipeline, measurement uncertainty representation, and NASA Exoplanet Archive mapping implemented in **CELESTIAL (Phase 2)**.

---

## 1. Primary Data Source: NASA Exoplanet Archive

All confirmed exoplanetary systems are ingested from the **NASA Exoplanet Archive** (Planetary Systems Composite Parameters table `pscomppars`):

- **Data Provider**: NASA Exoplanet Science Institute (NExScI) / Caltech / IPAC
- **TAP API Endpoint**: `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+pscomppars`
- **Reference Catalog**: Planetary Systems Composite Parameters (`PS_2026`)
- **Confidence Rating**: 0.995 (Authoritative Peer-Reviewed Exoplanet Dataset)

---

## 2. Measurement Uncertainty vs. Confidence

Exoplanet parameters (masses, radii, orbital periods, inclinations) are empirical astronomical determinations with explicit measurement uncertainties (error bars).

CELESTIAL enforces the `ScientificMeasurement<T>` representation:

```typescript
export interface ScientificMeasurement<T = number> {
  value: T;
  unit: string;
  uncertainty?: {
    upper?: number; // Positive offset (+Δ)
    lower?: number; // Negative offset (-Δ)
  };
  provenance?: ProvenanceRecord;
}
```

### Critical Rules:

1. **Never conflate confidence with uncertainty**: Confidence indicates source provenance and consensus; uncertainty indicates observational measurement precision.
2. **Missing data is NOT zero**: Unmeasured exoplanet radii (e.g. radial velocity discoveries without transit data) remain `undefined`/`null` and are never coerced to `0`.

---

## 3. Curated Exoplanetary Systems (Phase 2)

| System               | Host Star            | Confirmed Planets          | Notable Astronomical Features                                                        |
| :------------------- | :------------------- | :------------------------- | :----------------------------------------------------------------------------------- |
| **TRAPPIST-1**       | M8V Ultra-Cool Dwarf | 7 (b, c, d, e, f, g, h)    | Compact resonant chain; 3 planets in temperate Habitable Zone                        |
| **Proxima Centauri** | M5.5Ve Flare Star    | 2 (b, d)                   | Closest exoplanet system to Earth ($4.25\text{ ly}$); Proxima b in Habitable Zone    |
| **Alpha Centauri**   | G2V + K1V + M5.5Ve   | 2 (Proxima b, d)           | Triple star system with hierarchical binary barycenter approximation                 |
| **Kepler-90**        | G0V Yellow Dwarf     | 8 (b, c, i, d, e, f, g, h) | Tied with Solar System for highest number of confirmed planets                       |
| **55 Cancri**        | G8V (Copernicus)     | 5 (e, b, c, f, d)          | Ultra-short period lava Super-Earth (55 Cnc e) + Habitable Zone gas giant (55 Cnc f) |
| **WASP-12**          | G0 Yellow Dwarf      | 1 (WASP-12 b)              | Extreme Hot Jupiter undergoing tidal disruption                                      |
| **HD 209458**        | G0V Yellow Dwarf     | 1 (Osiris / HD 209458 b)   | First transiting exoplanet with evaporating comet-like hydrogen tail                 |
