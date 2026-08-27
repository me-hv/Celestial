# CELESTIAL — Stellar Catalog & Local Neighborhood Specification

This document specifies the authoritative stellar data sources, astrometric schema mapping, catalog identifier resolution, and spatial querying architecture implemented in **CELESTIAL (Phase 3)**.

---

## 1. Primary Data Sources & Scientific Authority

| Catalog Source                    | Scientific Authority / Host                 | Primary Contribution                                                                                                                                             |
| :-------------------------------- | :------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Gaia DR3 (2022)**               | European Space Agency (ESA)                 | Ultra-precise trigonometric parallax ($\varpi$), positions ($\alpha, \delta$), proper motion ($\mu_\alpha, \mu_\delta$), and $G/\text{BP}/\text{RP}$ photometry. |
| **Hipparcos (1997)**              | European Space Agency (ESA)                 | Historical astrometric baseline ($V$ magnitudes, spectral classifications).                                                                                      |
| **SIMBAD Astronomical Database**  | CDS Strasbourg (CNRS / Univ. Strasbourg)    | Multi-catalog cross-identifications (Bayer, Flamsteed, HD, Gliese, SAO, HR).                                                                                     |
| **Catalog of Nearby Stars (CNS)** | Astronomisches Rechen-Institut (Heidelberg) | Curated stellar neighborhood parameters and multiplicity designations.                                                                                           |

---

## 2. Multi-Catalog Identifier Hierarchy

A star in CELESTIAL may have designations across historical and modern surveys. CELESTIAL unifies them into the `CatalogIdentifiers` model:

```typescript
export interface CatalogIdentifiers {
  gaiaDr3?: string; // e.g. "Gaia DR3 5853498713190525696"
  hip?: string; // e.g. "HIP 70890" (Hipparcos)
  hd?: string; // e.g. "HD 128620" (Henry Draper)
  gliese?: string; // e.g. "GJ 551" (Gliese-Jahreiss)
  bayer?: string; // e.g. "Alpha Centauri C"
  flamsteed?: string; // e.g. "61 Cygni"
  sao?: string; // e.g. "SAO 252838"
}
```

---

## 3. Spatial Scope of Local Stellar Neighborhood

The **Local Stellar Neighborhood** is defined as the sphere of radius $R = 25\text{ parsecs}$ ($~81.54\text{ light-years}$) centered on the Sun $(0, 0, 0)$:

- **Reference Origin**: The Sun at $(0, 0, 0)$ in ICRS Cartesian coordinates.
- **Distance Shells**:
  - $5\text{ pc}$ ($~16.3\text{ ly}$): Immediate solar neighborhood (Proxima, Alpha Cen, Sirius, Barnard's Star, Wolf 359, UV Ceti, Lalande 21185, Ross 128, Epsilon Eridani, 61 Cygni, Procyon).
  - $10\text{ pc}$ ($~32.6\text{ ly}$): Expanded local bubble (Vega, Fomalhaut, Altair, Tau Ceti, Kapteyn's Star, Teegarden's Star, Van Maanen's Star).
  - $20\text{ pc}$ ($~65.2\text{ ly}$): Intermediate neighborhood (TRAPPIST-1, 55 Cancri, Pollux, Arcturus).
  - $25\text{ pc}$ ($~81.5\text{ ly}$): Outer boundary for Phase 3 volume.

---

## 4. Bridge to Known Planetary Systems

When a catalog star hosts confirmed exoplanets, its domain profile references its `StellarSystem`:

$$\text{Star} \xrightarrow{\text{hostSystemId}} \text{StellarSystem} \xrightarrow{\text{planetaryBodyIds}} \text{Exoplanets}$$

### Scientific Honesty Guarantee:

When a star lacks confirmed planets (e.g. Sirius A, Vega), the UI explicitly communicates:

> _"No confirmed planetary system in the current catalog."_
> It **never** asserts that no planets exist around the star.
