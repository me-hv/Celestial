# CELESTIAL — Galaxy Domain Model

## 1. Executive Summary

Phase 6 introduces **`Galaxy`** as a first-class astronomical entity in CELESTIAL. A galaxy is a gravitationally bound, dynamic macroscopic system composed of stars, stellar remnants, interstellar medium (gas and dust), and a dark matter halo.

---

## 2. Galaxy Morphology Taxonomy

CELESTIAL models galaxy morphologies based on the classical **Hubble Sequence** and its modern extension, the **de Vaucouleurs Revised Classification**:

| Morphology Code    | Category     | Hubble-de Vaucouleurs Example | Physical Description                                                                                              |
| :----------------- | :----------- | :---------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| `BARRED_SPIRAL`    | Disk         | `SB(rs)bc`, `SBb`             | Central stellar bar with logarithmic spiral arms originating from the bar ends (e.g. Milky Way, Andromeda).       |
| `SPIRAL`           | Disk         | `SA(s)cd`, `Sc`               | Unbarred disk with rotating spiral arm patterns of young OB stars and H II regions (e.g. Triangulum M33).         |
| `ELLIPTICAL`       | Spheroid     | `E0` – `E7`                   | Smooth, ellipsoidal stellar distribution dominated by older, metal-poor Population II stars with low gas content. |
| `LENTICULAR`       | Intermediate | `S0`, `SB0`                   | Transition state with a prominent disk and large bulge, but lacking active spiral structure.                      |
| `IRREGULAR`        | Asymmetric   | `Irr`, `IB(s)m`               | Asymmetric, chaotic stellar and gas distribution often shaped by tidal interactions (e.g. LMC).                   |
| `DWARF_SPHEROIDAL` | Dwarf        | `dSph`                        | Low-luminosity, diffuse spheroidal satellite with low surface brightness (e.g. Fornax, Sagittarius dSph).         |
| `DWARF_IRREGULAR`  | Dwarf        | `dIrr`, `SB(s)m pec`          | Compact low-mass dwarf with active star formation and high gas fraction (e.g. SMC).                               |
| `DWARF_ELLIPTICAL` | Dwarf        | `dE`, `cE`                    | Compact, dense dwarf elliptical satellite (e.g. M32, M110).                                                       |

---

## 3. Physical & Kinematic Properties

```typescript
export interface Galaxy {
  id: string;
  slug: string;
  name: string;
  standardDesignation?: string;
  aliases?: string[];
  summary: string;

  morphology: GalaxyMorphology;
  physical: GalaxyPhysicalProperties;
  kinematics: GalaxyKinematics;
  orientation: GalaxyOrientation;
  distance: GalaxyDistance;
  positional: PositionalProperties;
  catalogIdentifiers?: CatalogIdentifiers;

  groupMembership?: GalaxyGroupMembership;
  relationships?: GalaxyRelationship[];
  observations?: MultiWavelengthObservation[];

  provenance: ProvenanceRecord;
}
```

### 3.1 Kinematics & Velocity Reference Frames

- **Heliocentric Radial Velocity ($v_r$)**: Direct Doppler velocity observed from Earth's solar system.
- **Galactocentric Radial Velocity ($v_{GC}$)**: Velocity corrected for the Sun's orbital motion around the Galactic Center ($V_0 \approx 234\text{ km/s}$).
- **Spectroscopic Redshift ($z$)**: Relativistic Doppler shift $z = \Delta\lambda / \lambda_0$.
  - Negative values (blueshift) indicate mutual orbital approach (e.g. M31 at $z = -0.001001$).
  - Positive values indicate recession.

### 3.2 Orientation Geometry

- **Inclination ($i$)**: Tilt angle of the galaxy's disk relative to the sky plane ($0^\circ = \text{face-on}$, $90^\circ = \text{edge-on}$).
- **Position Angle ($\theta_{PA}$)**: Major axis angle measured North through East on the celestial sphere ($0^\circ \le \theta_{PA} < 180^\circ$).
- **Axis Ratio ($b/a$)**: Ratio of minor to major axes ($0.0 \le b/a \le 1.0$).

---

## 4. Scientific Honesty & Measurement Uncertainty

All dimensional quantities (mass, diameter, distance, velocity) in the Galaxy domain utilize `ScientificMeasurement<T>`, retaining:

- Nominal value
- Upper & lower error bounds
- Physical units
- Measurement method
- Authoritative provenance catalog
