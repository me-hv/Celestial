# CELESTIAL — Observable Universe & CMB Architecture

## 1. Overview

The **Observable Universe & CMB Explorer** (Phase 9) represents the ultimate spatial and observational boundary of the CELESTIAL astronomical platform.

It addresses the fundamental question:

> _"How far can we observe, what are we seeing when we look farther away, and what does the observable universe actually mean?"_

---

## 2. Core Cosmological Principles & Horizons

### 2.1 Why the Observable Universe is ~46.5 Billion Light-Years in Radius (Not 13.8 Gly)

A frequent misconception in astronomy is assuming that because the Universe is 13.8 Billion years old, the observable universe must be a sphere of radius 13.8 Billion light-years ($c \times t_0$).

In the General Relativistic Friedmann-Lemaître-Robertson-Walker (FLRW) metric:

1. Photons emitted shortly after the Big Bang ($t \approx 380,000\text{ yr}, z \approx 1089$) traveled for $\approx 13.8\text{ Billion years}$ to reach Earth today.
2. While those photons were in transit, the underlying spacetime metric expanded continuously according to the cosmological scale factor $a(t)$.
3. The present-day **comoving distance** to the surface that emitted those photons is now $\approx 46.5\text{ Billion Light-Years}$ ($\approx 14.25\text{ Gpc}$).

$$\chi_{\text{particle\_horizon}} = D_H \int_0^\infty \frac{dz'}{E(z')} \approx 14,250\text{ Mpc} \approx 46.5\text{ Gly}$$

### 2.2 Cosmological Horizon Taxonomy

| Horizon                                    | Definition                                                                                         | Physical Comoving Radius                       | Status          |
| :----------------------------------------- | :------------------------------------------------------------------------------------------------- | :--------------------------------------------- | :-------------- |
| **Particle Horizon**                       | Maximum distance from which light signals could have traveled to us since $t=0$.                   | $\approx 46.5\text{ Gly}$ ($14.25\text{ Gpc}$) | `MODEL_DERIVED` |
| **CMB Last-Scattering Surface**            | Spherical optical boundary at $z \approx 1089$ where neutral atoms formed and photons decoupled.   | $\approx 45.7\text{ Gly}$ ($14.0\text{ Gpc}$)  | `OBSERVED`      |
| **Cosmological Event Horizon**             | Greatest distance from which light emitted _now_ can ever reach us in the future ($t \to \infty$). | $\approx 17.0\text{ Gly}$ ($5.2\text{ Gpc}$)   | `MODEL_DERIVED` |
| **Hubble Sphere (Hubble Radius)**          | Distance where cosmological recession speed equals the speed of light: $v = H_0 \cdot d = c$.      | $\approx 13.97\text{ Gly}$ ($4.28\text{ Gpc}$) | `MODEL_DERIVED` |
| **Euclidean Light Travel ($c \cdot t_0$)** | Naive distance light travels in static, non-expanding flat Euclidean space.                        | $\approx 13.8\text{ Gly}$ ($4.23\text{ Gpc}$)  | `ILLUSTRATIVE`  |

---

## 3. Four Distance Measures in FLRW Cosmology

For any astronomical object observed at spectroscopic redshift $z$:

1. **Comoving Distance ($D_C$)**:
   The coordinate distance between two objects that remains constant in time if both are moving with the Hubble flow:
   $$D_C(z) = D_H \int_0^z \frac{dz'}{E(z')}$$
2. **Proper Distance at Emission ($D_{\text{proper}}$)**:
   The actual physical distance between the emitter and observer at the instant the photon was emitted:
   $$D_{\text{proper}}(t_{\text{emit}}) = a(z) \cdot D_C(z) = \frac{D_C(z)}{1+z} = D_A(z)$$
3. **Angular Diameter Distance ($D_A$)**:
   The ratio of an object's physical transverse diameter $d$ to its observed angular size $\theta$ in radians:
   $$D_A(z) = \frac{D_C(z)}{1+z}$$
   _Key Phenomenon:_ $D_A(z)$ reaches a maximum at $z \approx 1.6$ and then _decreases_ at higher redshift, meaning extremely distant galaxies appear _larger_ on the sky for a fixed physical size!
4. **Luminosity Distance ($D_L$)**:
   The distance relating intrinsic bolometric luminosity $L$ to observed flux $F$:
   $$D_L(z) = (1+z) \cdot D_C(z) = (1+z)^2 \cdot D_A(z)$$

---

## 4. The Cosmic Microwave Background (CMB) Model

- **Redshift**: $z = 1089.0 \pm 0.1$
- **Scale Factor**: $a = \frac{1}{1+z} \approx 0.000917$
- **Cosmic Age at Decoupling**: $t \approx 379,000\text{ years}$
- **Current Photon Bath Temperature**: $T_0 = 2.7255 \pm 0.0006\text{ K}$ (Fixsen 2009)
- **Temperature at Decoupling**: $T(z) = T_0 (1+z) \approx 2970\text{ K}$
- **Earth Dipole Motion**: $369.0 \pm 0.9\text{ km/s}$ towards $(l = 264.00^\circ \pm 0.03^\circ, b = +48.24^\circ \pm 0.02^\circ)$
- **Acoustic Peaks**:
  - Peak 1 ($\ell \approx 220, 0.8^\circ$): Maximum compression (confirms spatial flatness $\Omega_k \approx 0$).
  - Peak 2 ($\ell \approx 540, 0.33^\circ$): Maximum rarefaction (baryon density $\Omega_b$).
  - Peak 3 ($\ell \approx 800, 0.22^\circ$): Second compression (dark matter density $\Omega_c$).

---

## 5. Visual Scaling Architecture

Comoving distances span from $0\text{ Mpc}$ (Earth) to $14,250\text{ Mpc}$ (Particle Horizon). Linear scaling would render the inner $100\text{ Mpc}$ completely invisible.

The visualization engine utilizes a calibrated logarithmic non-linear mapping:
$$R_{\text{scene}} = 38.0 \cdot \ln(1 + 0.05 \cdot D_{\text{Mpc}})$$

The user interface explicitly displays the notice:

> **"Visualization scale is non-linear"**
