# Cosmic Web & Large-Scale Structure Explorer

## 1. Domain Overview

Phase 7 of CELESTIAL introduces the **Cosmic Web & Large-Scale Structure Explorer**, expanding our interactive astronomical model beyond the Local Group ($d \sim 1–3\text{ Mpc}$) into megaparsec-to-hundreds-of-megaparsec scales ($d \sim 10–500+\text{ Mpc}$).

This answers the fundamental spatial question:

> **"Where is our Local Group inside the larger cosmic structure of the Universe?"**

---

## 2. Structural Hierarchy

```
Earth
 └── Solar System
      └── Orion Spur
           └── Milky Way Galaxy
                └── Local Group (d ~ 3 Mpc)
                     └── Local Sheet (d ~ 14 Mpc)
                          └── Virgo Supercluster (d ~ 33 Mpc)
                               └── Laniakea Supercluster (d ~ 160 Mpc)
                                    └── Cosmic Web (Filaments, Walls & Voids)
```

---

## 3. Classification & Semantics

The domain model (`src/domain/cosmic-structure/types.ts`) classifies large-scale entities into strict categories:

| Type             | Description                                                                              | Representative Examples                                                                        |
| ---------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `GALAXY_GROUP`   | Bound aggregation of $<50$ galaxies ($d \sim 1–3\text{ Mpc}$)                            | Local Group, M81 Group, Sculptor Group, Maffei Group, Centaurus A Group                        |
| `GALAXY_CLUSTER` | Dense, virialized cluster of hundreds to thousands of galaxies ($d \sim 2–6\text{ Mpc}$) | Virgo Cluster, Fornax Cluster, Coma Cluster, Perseus Cluster, Centaurus Cluster, Hydra Cluster |
| `SUPERCLUSTER`   | Vast overdensity of clusters and filaments ($d \sim 30–160\text{ Mpc}$)                  | Virgo Supercluster, Laniakea Supercluster, Shapley Supercluster, Perseus-Pisces Supercluster   |
| `VOID`           | Extremely underdense spherical or irregular bubble ($\delta < -0.8$)                     | Local Void, Boötes Void (The Great Nothing)                                                    |
| `WALL` / `SHEET` | Flattened planar sheets of galaxy clusters and matter                                    | Local Sheet, CfA2 Great Wall, Sloan Great Wall                                                 |
| `FILAMENT`       | Thread-like bridge of dark matter and dwarf galaxies                                     | Virgo Filament                                                                                 |

### Scientific Observation Statuses

- **`OBSERVED`**: Direct spectroscopic/photometric cataloged overdensities (e.g. Coma Cluster, Virgo Cluster, Boötes Void).
- **`INFERRED`**: Reconstructed from peculiar velocity flows (e.g. Local Void).
- **`MODEL_DERIVED`**: Velocity watershed boundaries and stream basins (e.g. Laniakea Supercluster watershed boundary from Cosmicflows-2).
- **`ILLUSTRATIVE`**: Bounding conceptual geometries.

---

## 4. Coordinate Systems

1. **Galactocentric Megaparsec Cartesian $(X, Y, Z)_{CC}$**:
   - Origin: Milky Way Galactic Center $(0, 0, 0)$
   - $+X$: Towards Galactic Center ($l=0^\circ, b=0^\circ$)
   - $+Y$: Direction of Galactic Rotation ($l=90^\circ, b=0^\circ$)
   - $+Z$: Towards North Galactic Pole ($b=+90^\circ$)
2. **Supergalactic Coordinate System $(SGL, SGB, SGX, SGY, SGZ)$** (de Vaucouleurs 1953):
   - Supergalactic North Pole: Galactic $(l=47.37^\circ, b=+6.32^\circ)$
   - Supergalactic Origin ($SGL=0^\circ, SGB=0^\circ$): Galactic $(l=137.37^\circ, b=0^\circ)$
   - Orthonormal transformation:
     $$\mathbf{v}_{SG} = \mathbf{M}_{G \to SG} \mathbf{v}_G$$

---

## 5. Explorer User Interface

- **`/cosmic-web`**: Interactive 3D Three.js scene & 2D Extragalactic Map with layer toggles, distance shells ($10\dots 300\text{ Mpc}$), and structure focus.
- **`/cosmic-web/overview`**: Full searchable extragalactic directory and statistical census.
- **`/cosmic-web/[slug]`**: Detailed dossier profile with physical parameters, member galaxies, parent hierarchy, and scientific citation.
- **`/cosmic-web/compare`**: Comparative side-by-side analysis with 3D spatial separation vector, mass ratio, and size ratio.
