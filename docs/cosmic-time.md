# CELESTIAL — Cosmic Time Machine & Universe Timeline

## 1. Overview

The **Cosmic Time Machine & Universe Timeline** extends CELESTIAL from a 3D spatial atlas into a 4D spacetime atlas.
In observational cosmology, space and time are inextricably linked:

$$\text{Observing an astronomical object at distance } d \iff \text{Observing that object at lookback time } t_L \text{ in the past}$$

CELESTIAL models the Universe from the initial quantum Planck singularity ($t = 0, z \to \infty, a \to 0$) to the present-day era of Dark Energy cosmic acceleration ($t_0 \approx 13.8\text{ Gyr}, z = 0, a = 1.0$).

---

## 2. Core Cosmological Mathematics

### 2.1 The Scale Factor $a(t)$ and Redshift $z$

The cosmological scale factor $a(t)$ parametrizes the isotropic relative expansion of the Friedmann–Lemaître–Robertson–Walker (FLRW) spacetime metric:
$$ds^2 = -c^2 dt^2 + a(t)^2 \left[ \frac{dr^2}{1 - k r^2} + r^2 (d\theta^2 + \sin^2\theta \, d\phi^2) \right]$$

The fundamental algebraic relationship between spectroscopic redshift $z$ and scale factor $a$ is:
$$a = \frac{1}{1 + z} \iff z = \frac{1}{a} - 1$$

- At $z = 0$ (Today): $a = 1.0$
- At $z = 1$ ($t_{\text{age}} \sim 5.9\text{ Gyr}$): $a = 0.5$ (The Universe was half its present linear size)
- At $z = 6$ (End of Reionization): $a = 0.143$
- At $z = 1089$ (CMB Decoupling): $a \approx 0.000917$

### 2.2 Numerical Quadrature of Spacetime Integrals

In a $\Lambda\text{CDM}$ universe, the dimensionless expansion rate $E(z)$ is:
$$E(z) = \sqrt{\Omega_m (1+z)^3 + \Omega_r (1+z)^4 + \Omega_k (1+z)^2 + \Omega_\Lambda}$$

1. **Hubble Time**:
   $$t_H = \frac{1}{H_0} \approx \frac{977.792}{H_0}\text{ Gyr}$$

2. **Lookback Time $t_L(z)$**:
   $$t_L(z) = t_H \int_0^z \frac{dz'}{(1+z') E(z')}$$

3. **Present Universe Age $t_0$**:
   $$t_0 = t_H \int_0^1 \frac{du}{u E((1-u)/u)} \quad \left(\text{where } u = \frac{1}{1+z'}\right)$$

4. **Cosmic Age at Redshift $z$**:
   $$t_{\text{age}}(z) = t_0 - t_L(z)$$

5. **Line-of-Sight Comoving Distance $D_C(z)$**:
   $$D_C(z) = D_H \int_0^z \frac{dz'}{E(z')} \quad \left(D_H = \frac{c}{H_0}\right)$$

6. **Luminosity & Angular Diameter Distances**:
   $$D_L(z) = (1+z) D_M(z), \quad D_A(z) = \frac{D_M(z)}{1+z}$$

---

## 3. Scientific Distinction: Light-Travel Time vs. Cosmological Lookback Time

> [!IMPORTANT]
> **Strict Physical Separation**
>
> - **Nearby Stars / Milky Way ($d < 1\text{ Mpc}$, $z \approx 0$)**: Light-travel time is Euclidean kinematics ($t = d/c$). Sirius is observed as it was 8.6 years ago; the Galactic Center is observed as it was ~26,000 years ago. Spacetime expansion is completely negligible in gravitationally bound systems.
> - **Extragalactic Objects ($z > 0.001$)**: Cosmological lookback time is derived from the non-static FLRW metric. Photons travel through expanding space and undergo cosmological redshift ($z$).

CELESTIAL encapsulates this in `ObservationTimeModel` (`src/domain/cosmic-time/observation.ts`), ensuring UI components never display cosmological expansion lookback calculations for nearby stars.

---

## 4. The 14 Standard Cosmological Epochs

| Order  | Epoch                             | Cosmic Age ($t$)                  | Redshift ($z$)               | Status      | Key Physics & Evidence                                                                              |
| :----- | :-------------------------------- | :-------------------------------- | :--------------------------- | :---------- | :-------------------------------------------------------------------------------------------------- |
| **1**  | **Planck Epoch**                  | $0 - 10^{-43}\text{ s}$           | $z \to \infty$               | THEORETICAL | Quantum gravity, spacetime foam ($E \sim 10^{19}\text{ GeV}$).                                      |
| **2**  | **Cosmic Inflation**              | $10^{-36} - 10^{-32}\text{ s}$    | $z \to \infty$               | INFERRED    | Exponential metric expansion ($e^{60}$ factor), seeds CMB acoustic fluctuations.                    |
| **3**  | **Electroweak Epoch**             | $10^{-32} - 10^{-12}\text{ s}$    | $z \to \infty$               | INFERRED    | Higgs vacuum condensation breaks electroweak symmetry; masses generated.                            |
| **4**  | **Quark Epoch**                   | $10^{-12} - 10^{-6}\text{ s}$     | $z \to \infty$               | INFERRED    | Relativistic Quark-Gluon Plasma (QGP); baryogenesis produces matter excess.                         |
| **5**  | **Hadron Epoch**                  | $10^{-6} - 1.0\text{ s}$          | $z \to \infty$               | INFERRED    | QCD color confinement binds quarks into protons and neutrons ($T_c \approx 156\text{ MeV}$).        |
| **6**  | **Lepton Epoch**                  | $1.0 - 10.0\text{ s}$             | $z \to \infty$               | INFERRED    | Cosmic Neutrino Background (CNB) decouples ($T_\nu \approx 1.95\text{ K}$); $e^+ e^-$ annihilation. |
| **7**  | **Nucleosynthesis (BBN)**         | $10\text{ s} - 20\text{ min}$     | $z \sim 10^7 - 4\times 10^8$ | OBSERVED    | Primordial light element fusion: 75% ¹H, 25% ⁴He, trace ²H, ³He, ⁷Li.                               |
| **8**  | **Recombination & CMB**           | $370 - 390\text{ kyr}$            | $z \approx 1050 - 1150$      | OBSERVED    | Protons capture electrons ($T \approx 3000\text{ K}$); photons decouple into 2.7255 K CMB.          |
| **9**  | **Cosmic Dark Ages**              | $380\text{ kyr} - 100\text{ Myr}$ | $z \approx 30 - 1050$        | INFERRED    | Neutral hydrogen gas cools; dark matter minihalos grow; 21-cm spin-flip radiation.                  |
| **10** | **First Stars (Cosmic Dawn)**     | $100 - 250\text{ Myr}$            | $z \approx 15 - 30$          | INFERRED    | Metal-free Population III stars ($50 - 300\text{ M}_\odot$) ignite and seed first metals.           |
| **11** | **Epoch of Reionization**         | $250\text{ Myr} - 1.0\text{ Gyr}$ | $z \approx 6 - 15$           | OBSERVED    | UV radiation from early galaxies ionizes intergalactic hydrogen bubbles; Gunn-Peterson clears.      |
| **12** | **Early Galaxy Formation**        | $1.0 - 3.5\text{ Gyr}$            | $z \approx 2 - 6$            | OBSERVED    | Turbulent protogalactic mergers; primeval disks and early supermassive black holes (JWST).          |
| **13** | **Galaxy Assembly (Cosmic Noon)** | $3.5 - 9.0\text{ Gyr}$            | $z \approx 0.4 - 2$          | OBSERVED    | Peak cosmic star formation rate density (Madau-Dickinson curve); mature spiral/elliptical disks.    |
| **14** | **Modern Universe**               | $9.0 - 13.8\text{ Gyr}$           | $z = 0 - 0.4$                | OBSERVED    | Dark Energy accelerates expansion; Solar System forms ($4.567\text{ Gyr}$ ago); Cosmic Web.         |

---

## 5. Visualizing Spacetime: The Past Light Cone

The 3D Past Light Cone (`CosmicTimeScene.tsx` & `cosmic-time-renderer.ts`) represents the observer's backward null-hypersurface in spacetime:

- **Cone Apex ($Y = 0, z = 0$)**: The observer at present day.
- **Cone Base ($Y = -350, z = 1089$)**: The Cosmic Microwave Background last scattering surface.
- **Concentric Lookback Rings**: Spacetime slices at $1, 3, 5, 8, 10, 12, 13.5\text{ Gyr}$.
- **Object Nodes**: Plotted according to Right Ascension $(\alpha)$, Declination $(\delta)$, and Lookback Time $(t_L)$.
