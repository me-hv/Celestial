# CELESTIAL — Milky Way & Galactic Structure Architecture

This document specifies the scientific coordinate systems, logarithmic spiral arm modeling, Galactocentric transformations, and architectural design for **CELESTIAL (Phase 5: Milky Way & Galactic Structure Explorer)**.

---

## 1. Core Scientific Principle: Observed vs. Model-Derived Knowledge

A founding principle in CELESTIAL is that **internal galactic geometry is observational and model-dependent**. Because the Solar System is embedded inside the dusty interstellar disk, we cannot capture a true external photographic view of our galaxy.

CELESTIAL enforces a strict scientific boundary:

- **Observed / Measured Quantities**:
  - Distance from Sun to Galactic Center $R_0 = 8,178\text{ pc} \pm 26\text{ pc}$ (GRAVITY Collaboration 2019).
  - Solar height above midplane $z_0 = +20.8\text{ pc} \pm 0.3\text{ pc}$ (Bennett & Bovy 2019).
  - Equatorial $(\alpha, \delta)$ and Galactic $(l, b)$ coordinates (IAU definition).
  - Proper motion and radial velocity of maser sources and stars (VLBI / Gaia DR3).
- **Model-Derived / Inferred Structures**:
  - Spiral arm pitch angles ($\psi$) and logarithmic tracks (Reid et al. 2019 / Vallée 2017).
  - Galactic central bar length ($2a \approx 10.0\text{ kpc}$) and pattern speed ($\Omega_p \approx 39\text{ km/s/kpc}$).
  - Thin vs. thick disk scale heights ($h_{z,thin} \approx 300\text{ pc}$, $h_{z,thick} \approx 900\text{ pc}$).
  - Dark matter halo mass and spatial extent ($M_{DM} \approx 1.3 \times 10^{12} M_\odot$, $R_{vir} \approx 100\text{ kpc}$).

---

## 2. Standard Galactocentric Coordinate Convention

CELESTIAL implements a standard right-handed Galactocentric Cartesian coordinate frame $(X, Y, Z)_{GC}$:

$$ \begin{aligned}
\text{Origin} &= \text{Galactic Center } (0, 0, 0) \\
\mathbf{x}_\odot &= (-R_0, 0, +z_0) = (-8,178\text{ pc}, 0, +20.8\text{ pc}) \\
+X \text{ Axis} &= \text{Vector from Sun to Galactic Center projected on Galactic Midplane} \\
+Y \text{ Axis} &= \text{Direction of Galactic rotation } (l = 90^\circ, b = 0^\circ) \\
+Z \text{ Axis} &= \text{Direction toward North Galactic Pole } (b = +90^\circ)
\end{aligned}$$

### Coordinate Transformations
Given Galactic Longitude $l$, Latitude $b$, and Heliocentric Distance $d$ in parsecs:

$$\begin{aligned}
x_{helio} &= d \cdot \cos b \cdot \cos l \\
y_{helio} &= d \cdot \cos b \cdot \sin l \\
z_{helio} &= d \cdot \sin b
\end{aligned}$$

Translating from Heliocentric to Galactocentric space:

$$\begin{aligned}
X_{GC} &= x_{helio} - R_0 \\
Y_{GC} &= y_{helio} \\
Z_{GC} &= z_{helio} + z_0
\end{aligned}$$

The total Galactocentric distance $R_{GC}$ is:

$$R_{GC} = \sqrt{X_{GC}^2 + Y_{GC}^2 + Z_{GC}^2}$$

---

## 3. Parametric Logarithmic Spiral Arm Equations

Spiral arms in the Milky Way are represented using logarithmic spirals calibrated to VLBI trigonometric maser parallaxes (Reid et al. 2019):

$$r(\theta) = r_0 \exp\left[(\theta - \theta_0) \tan\psi\right]$$

Where:
- $r_0$ is the reference radius in kiloparsecs at reference azimuth angle $\theta_0$.
- $\psi$ is the pitch angle (typically $9^\circ\dots 14^\circ$).
- $\theta$ is the Galactocentric in-plane azimuth angle in radians ($\theta = \text{atan2}(Y, X)$).

### Primary Calibrated Arm Definitions:
| Structure Name | Type | Reference $r_0$ | Reference $\theta_0$ | Pitch $\psi$ | Model Source |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Orion Spur (Local Arm)** | Branch / Spur | $8.2\text{ kpc}$ | $55^\circ$ | $12.0^\circ$ | Reid et al. (2019) / BeSSeL |
| **Perseus Arm** | Primary Arm | $9.9\text{ kpc}$ | $40^\circ$ | $10.0^\circ$ | Reid et al. (2019) |
| **Sagittarius-Carina Arm** | Primary Arm | $6.6\text{ kpc}$ | $25^\circ$ | $13.0^\circ$ | Reid et al. (2019) |
| **Scutum-Centaurus Arm** | Primary Arm | $5.0\text{ kpc}$ | $30^\circ$ | $12.5^\circ$ | Reid et al. (2019) |
| **Norma-Outer Arm** | Primary Arm | $12.2\text{ kpc}$ | $45^\circ$ | $9.0^\circ$ | Vallée (2017) |

---

## 4. Sagittarius A* vs. Galactic Center Distinction

CELESTIAL clearly distinguishes:
- **Galactic Center (`galactic-center`)**: The dynamical region, stellar bulge core, and barycenter of the galaxy spanning a spatial extent of $\sim 300\text{ pc}$.
- **Sagittarius A\* (`sagittarius-a-star`)**: The central supermassive black hole object ($M = 4.154 \times 10^6 M_\odot$), an individual celestial object with event horizon and multi-wavelength radio/X-ray observational records.
$$
