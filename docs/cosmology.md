# Cosmological Distance & Spacetime Engine Architecture

## 1. Cosmological Framework

CELESTIAL models the Universe on megaparsec-to-hundreds-of-megaparsec scales ($d \sim 10–500+\text{ Mpc}$) using the standard $\Lambda\text{CDM}$ (Lambda Cold Dark Matter) Concordance Model of Cosmology.

### Baseline Parameters ($\text{Planck 2018}$)

- **Hubble Constant**: $H_0 = 70.0\text{ km s}^{-1}\text{ Mpc}^{-1}$ ($h = 0.70$)
- **Matter Density Parameter**: $\Omega_m = 0.315$ (Dark Matter + Baryonic Matter)
- **Dark Energy Density Parameter**: $\Omega_\Lambda = 0.685$ (Cosmological Constant)
- **Radiation Density Parameter**: $\Omega_r \approx 0.0$ (Negligible at low redshifts $z < 1$)
- **Curvature Parameter**: $\Omega_k = 1 - \Omega_m - \Omega_\Lambda - \Omega_r = 0.0$ (Flat FLRW metric)
- **Speed of Light**: $c = 299,792.458\text{ km/s}$

---

## 2. Mathematical Formulations

### 2.1 Hubble Distance and Expansion Rate

The Hubble distance is defined as:
$$D_H = \frac{c}{H_0} \approx 4,282.75\text{ Mpc} \approx 13.97\text{ Gly}$$

The dimensionless expansion rate $E(z)$ is given by the Friedmann equation:
$$E(z) = \sqrt{\Omega_m (1+z)^3 + \Omega_r (1+z)^4 + \Omega_k (1+z)^2 + \Omega_\Lambda}$$

### 2.2 Line-of-Sight Comoving Distance $D_C(z)$

The total line-of-sight comoving distance integrates the spacetime expansion history:
$$D_C(z) = D_H \int_0^z \frac{dz'}{E(z')}$$

### 2.3 Transverse Comoving Distance $D_M(z)$

For a flat Universe ($\Omega_k = 0$):
$$D_M(z) = D_C(z)$$

### 2.4 Luminosity Distance $D_L(z)$

Accounts for photon energy redshift and time dilation:
$$D_L(z) = (1+z) D_M(z)$$

### 2.5 Angular Diameter Distance $D_A(z)$

Relates angular size $\theta$ on the sky to physical transverse size $D$:
$$D_A(z) = \frac{D_M(z)}{1+z}$$
$$\theta = \frac{D}{D_A(z)}$$

### 2.6 Lookback Time $t_L(z)$

The light travel time elapsed between the emission of photons at redshift $z$ and the present epoch $z=0$:
$$t_L(z) = t_H \int_0^z \frac{dz'}{(1+z') E(z')}$$
where $t_H = \frac{1}{H_0} \approx 13.97\text{ Gyr}$.

---

## 3. Peculiar Velocity & Gravitational Infall

Observed radial velocities $cz_{\text{obs}}$ are a combination of the cosmological Hubble flow $H_0 d$ and the local gravitational peculiar velocity $v_{\text{pec}}$:
$$cz_{\text{obs}} = H_0 d_{\text{true}} + v_{\text{pec}}$$

### Important Astrophysical Regimes

1. **Gravitationally Bound Regime ($z \le 0.001$, $d < 3\text{ Mpc}$)**:
   - Within the Local Group, internal gravitational binding overcomes the cosmic expansion. Andromeda (M31) has a blueshift of $v_r \approx -110\text{ km/s}$.
2. **Virgocentric Infall ($d \approx 16.5\text{ Mpc}$)**:
   - The Local Group experiences a coherent gravitational infall velocity of $\sim 220\text{ km/s}$ towards the center of the Virgo Cluster.
3. **Local Void Repulsion ($d \approx 20\text{ Mpc}$)**:
   - The matter deficit in the Local Void induces an effective kinematic repulsion of $\sim 260\text{ km/s}$ on the Local Sheet.
4. **Great Attractor & Shapley Concentration**:
   - The bulk flow of Laniakea is directed towards the Great Attractor (Centaurus/Norma region) and the distant Shapley Supercluster ($d \approx 200\text{ Mpc}$).

---

## 4. Software Implementation

The module `src/lib/astronomy/cosmology/cosmology-calculator.ts` encapsulates the $\Lambda\text{CDM}$ calculations with numerical quadrature using Simpson's 3/8 rule, parameterized configurations, and zero hardcoded magic numbers.
