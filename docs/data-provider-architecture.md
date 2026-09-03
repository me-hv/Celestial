# Global Data Provider Architecture

## Overview

Every scientific data provider in CELESTIAL plugs into the unified `DataProviderRegistry` and `LiveDataRegistry` architecture.

---

## Supported Providers

1. **NOAA SWPC** (`noaa-swpc`): `LIVE` — Real-time space weather feeds.
2. **NASA PDS / DSN** (`nasa-pds`): `LIVE` / `RECENT` — Planetary data & DSN link.
3. **ISRO ISSDC PRADAN** (`isro-issdc`): `AVAILABLE_BUT_NOT_LIVE` — Planetary science archive.
4. **ESA PSA** (`esa-psa`): `AVAILABLE_BUT_NOT_LIVE` — Planetary science archive & Gaia.
5. **JAXA DARTS** (`jaxa-darts`): `AVAILABLE_BUT_NOT_LIVE` — ISAS astrophysics & planetary science.
6. **CNSA CLEP** (`cnsa-clep`): `AVAILABLE_BUT_NOT_LIVE` — Lunar & deep space data center.
7. **ESO SAF** (`eso-saf`): `AVAILABLE_BUT_NOT_LIVE` — Science archive facility.
