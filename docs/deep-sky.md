# CELESTIAL — Deep Sky & Galactic Explorer Specification

This document specifies the scientific taxonomy, observational architecture, multi-catalog resolution, coordinate transformations, and visualization methodology for **CELESTIAL (Phase 4)**.

---

## 1. Scientific Taxonomy & Category Mapping

CELESTIAL categorizes deep-sky objects into a structured, scientifically defensible taxonomy:

```
DEEP_SKY
├── GALAXY (Spiral, Elliptical, Lenticular, Irregular, Dwarf)
├── NEBULA (Emission, Reflection, Dark, Diffuse, Star-Forming)
├── STAR_CLUSTER (Open Cluster, Globular Cluster, Stellar Association)
├── PLANETARY_NEBULA (Ionized gas shell around dying white dwarf)
└── SUPERNOVA_REMNANT (Expanding shockwave & compact core remnant)
```

---

## 2. Intrinsic Physical Properties vs. Observational Records

A core architectural principle in Phase 4 is the clear separation between an object's **intrinsic physical characteristics** and its **observational records**:

- **Intrinsic Properties (`DeepSkyProperties`)**: Morphological classification (Hubble type), redshift $z$, true physical dimensions, estimated stellar mass, star cluster age, expansion velocity.
- **Observational Records (`MultiWavelengthObservation`)**: Measured quantities tied to specific instruments, filters, and electromagnetic bands:
  - `OPTICAL` ($B, V, R$, H-$\alpha$, [O III])
  - `INFRARED` (2MASS $J, H, K_s$, Spitzer, JWST MIRI/NIRCam)
  - `RADIO` (VLA, ALMA 21cm H I emission)
  - `X_RAY` (Chandra, XMM-Newton $0.5\text{--}7.0\text{ keV}$)
  - `ULTRAVIOLET` (GALEX NUV/FUV)

---

## 3. Authoritative Deep-Sky Catalogs

| Catalog         | Full Name / Maintainer                   | Primary Scope & Role                                                                                       |
| :-------------- | :--------------------------------------- | :--------------------------------------------------------------------------------------------------------- |
| **Messier (M)** | Charles Messier (1771 / 1784)            | 110 prominent deep-sky objects (galaxies, nebulae, clusters).                                              |
| **NGC / IC**    | J.L.E. Dreyer / OpenNGC                  | New General Catalogue (7,840 objects) & Index Catalogue (5,386 objects).                                   |
| **SIMBAD**      | CDS Strasbourg (CNRS / Univ. Strasbourg) | Authoritative cross-identifications, bibliographies, and coordinates.                                      |
| **NASA NED**    | NASA/IPAC Extragalactic Database         | Spectroscopic redshifts ($z$), morphological types, multi-wavelength photometry for extragalactic objects. |

---

## 4. Multi-Catalog Identifier Hierarchy

A single deep-sky object has numerous designations across historical and modern surveys:

- **Example**: Andromeda Galaxy $\longleftrightarrow$ `M31` $\longleftrightarrow$ `NGC 224` $\longleftrightarrow$ `PGC 2557` $\longleftrightarrow$ `UGC 454`.
- **Example**: Orion Nebula $\longleftrightarrow$ `M42` $\longleftrightarrow$ `NGC 1976` $\longleftrightarrow$ `LBN 974`.
- **Example**: Crab Nebula $\longleftrightarrow$ `M1` $\longleftrightarrow$ `NGC 1952` $\longleftrightarrow$ `Taurus A` $\longleftrightarrow$ `3C 144`.

CELESTIAL unifies all designations into `CatalogIdentifiers`, guaranteeing that search queries for any identifier return the exact same canonical entity.

---

## 5. Distance Measurement Methods & Scientific Uncertainty

Distances beyond our local stellar neighborhood exhibit significantly higher uncertainties than trigonometric stellar parallax:

- **Trigonometric Parallax**: For nearby Milky Way clusters and nebulae ($< 3\text{ kpc}$, e.g. Pleiades, Orion Nebula, Helix Nebula).
- **Standard Candles (Cepheid Variables & TRGB)**: For Local Group galaxies ($100\text{ kpc} \text{--} 4\text{ Mpc}$, e.g. M31, M33, LMC, SMC, M81).
- **Surface Brightness Fluctuations (SBF) & Type Ia Supernovae**: For intermediate and distant galaxies ($> 5\text{ Mpc}$, e.g. Sombrero Galaxy M104).
- **Cosmological Redshift ($z$) / Hubble Flow**: Stored as measured spectroscopic redshift ($z = \Delta\lambda/\lambda_0$) separate from derived distance assumptions.
