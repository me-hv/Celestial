# CELESTIAL — Cosmological Distance & Lookback Time

## 1. Extragalactic Distance Ladder

Distance determination for galaxies outside the Milky Way requires distinct astrophysical methodologies:

1. **Tip of the Red Giant Branch (TRGB)**:
   - Primary standard candle for resolved stellar populations within $\sim 10\text{ Mpc}$ (e.g. Andromeda, M32, M110, Sgr dSph).
   - High accuracy ($\approx 2–5\%$).
2. **Classical Cepheid Variable Period-Luminosity (Leavitt Law)**:
   - Utilized for star-forming disk galaxies (e.g. Triangulum M33, SMC).
3. **Detached Eclipsing Binaries**:
   - Geometrical distance determination yielding $<1\%$ uncertainty for the Large Magellanic Cloud ($49.97 \pm 0.19\text{ kpc}$, Pietrzyński et al. 2019).
4. **Tully-Fisher Relation**:
   - Correlation between spiral galaxy luminosity and rotational velocity ($V_{max}$).
5. **Surface Brightness Fluctuations (SBF)**:
   - Statistical Poisson variation of unresolved red giants in elliptical galaxies.

---

## 2. Redshift vs. Cosmic Hubble Flow

### 2.1 Gravitational Bound Regimes (Local Group)

Within the Local Group ($d < 3\text{ Mpc}$), the cosmic expansion is overcome by local gravitational attraction:

- Peculiar velocities dominate over Hubble flow.
- Redshift cannot be directly converted to distance via $v = H_0 d$.
- Example: Andromeda exhibits a negative spectroscopic redshift ($z = -0.001001$) indicating mutual approach at $110\text{ km/s}$.

### 2.2 Cosmological Expansion ($z > 0.01$)

For distant galaxies in the Hubble flow:
$$v_{\text{recession}} = c \cdot z \approx H_0 \cdot d$$
CELESTIAL defaults to standard cosmological parameters:

- $H_0 = 70.0\text{ km/s/Mpc}$
- $\Omega_m = 0.315$, $\Omega_\Lambda = 0.685$

---

## 3. Lookback Time (Light Travel Time)

Because light travels at a finite velocity ($c \approx 299,792.458\text{ km/s}$):
$$t_{\text{lookback}} = \frac{d}{c}$$

- Observing Andromeda ($d = 2.54\text{ Mly}$) reveals the galaxy as it existed **2.54 million years in the past**.
- For Local Group scales, lookback time is derived directly from physical distance.
