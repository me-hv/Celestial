# Astronomical Data Providers & Offline Architecture

## 1. Provenance Classification

Every astronomical dataset in CELESTIAL carries an epistemic classification:

- **`CURATED_DATA`**: Hand-verified authoritative benchmark models (e.g. standard stellar neighborhood parameters, NASA SSD planetary physical constants).
- **`REFERENCE_DATA`**: Curated scientific catalogs (Gaia DR3, SIMBAD CDS, NASA NED, OpenNGC).
- **`LIVE_REMOTE_DATA`**: Live queries against remote astronomy endpoints (CDS Sesame, Gaia TAP, JPL Horizons).
- **`DERIVED_DATA`**: Coordinate transformations and analytical ephemeris models derived from fundamental physics.
- **`OFFLINE_FALLBACK`**: Self-contained catalog fallback activated when network or remote servers are unreachable.

---

## 2. Provider Abstraction

```typescript
export interface IAstronomyDataProvider {
  readonly providerId: string;
  readonly providerName: string;
  readonly defaultEndpointUrl: string;

  queryObject(query: AstronomicalObjectSearchQuery): Promise<ProviderResult<CelestialObject>>;
  isHealthy(): Promise<boolean>;
}
```

Concrete adapters include:

- `SimbadDataProvider` (`simbad-provider.ts`)
- `GaiaDataProvider` (`gaia-provider.ts`)
- `JplHorizonsProvider` (`jpl-horizons-provider.ts`)
