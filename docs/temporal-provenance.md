# Temporal Provenance, Uncertainty & Conflict Handling

## Overview

CELESTIAL enforces strict epistemic standards across all historical and projected timestamps.

---

## Time Precision Classes

1. `EXACT`: Timestamp verified to second or minute (e.g. `2023-08-23T12:33:00Z`).
2. `DAY`: Calendar date without sub-day timing (e.g. `1969-07-20`).
3. `MONTH`: Month and year (e.g. `1977-09`).
4. `YEAR`: Year only (e.g. `1990`).
5. `APPROXIMATE`: Radiometric or cosmochemical estimate (e.g. `~4.567 Billion Years Ago`).
6. `COSMOLOGICAL`: Redshift / scale factor regime (e.g. $z = 1089.9$, lookback time $13.786$ Gyr).

---

## Conflicting Authoritative Claims

When official providers differ on timing, CELESTIAL preserves both claims in a `TemporalConflict` record rather than silently reconciling or manufacturing artificial agreement.
