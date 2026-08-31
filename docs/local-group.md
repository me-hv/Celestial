# CELESTIAL — Local Group & Extragalactic Spatial Model

## 1. Spatial Definition & Reference Frame

The **Local Group** is modeled in standard right-handed **Galactocentric Megaparsec Cartesian Coordinates** $(X, Y, Z)_{LG}$:

- **Origin $(0, 0, 0)$**: Barycenter of the Milky Way Galaxy.
- **$+X_{LG}$ Axis**: Vector pointing from the Sun toward the Galactic Center, projected onto the Galactic midplane.
- **$+Y_{LG}$ Axis**: Vector pointing in the direction of Galactic rotation ($l = 90^\circ, b = 0^\circ$).
- **$+Z_{LG}$ Axis**: Vector pointing toward the North Galactic Pole ($b = +90^\circ$).
- **Unit Scale**: Kiloparsecs ($\text{kpc}$) or Megaparsecs ($\text{Mpc}$).

### 1.1 Transformation Equations

Given Galactic coordinates $(l, b)$ and heliocentric distance $d$:

$$ \begin{aligned}
X_{LG} &= d \cos b \cos l - R_0 \\
Y_{LG} &= d \cos b \sin l \\
Z_{LG} &= d \sin b + z_0
\end{aligned}$$
where $R_0 = 8.178\text{ kpc}$ and $z_0 = +0.0208\text{ kpc}$ (Bennett & Bovy 2019).

---

## 2. Local Group Subgroups

1. **Milky Way Subgroup**:
   - Host: Milky Way ($M \approx 1.15 \times 10^{12} M_\odot$).
   - Satellites: Large Magellanic Cloud (LMC), Small Magellanic Cloud (SMC), Sagittarius dSph, Fornax, Sculptor, Draco, Ursa Minor.
2. **Andromeda Subgroup**:
   - Host: Andromeda (M31, $M \approx 1.5 \times 10^{12} M_\odot$).
   - Satellites: M32, M110, NGC 185, NGC 147, And I–XXX.
   - Associated Spiral: Triangulum Galaxy (M33, $M \approx 5 \times 10^{10} M_\odot$).
3. **Isolated / Outlying Dwarfs**:
   - IC 10 (starburst dwarf), WLM, Leo A, Pegasus Dwarf.

---

## 3. Milky Way ↔ Andromeda Dynamics

- **Current Separation**: $778 \pm 17\text{ kpc}$ ($2.54 \pm 0.05\text{ Mly}$).
- **Approach Velocity**: $-110 \pm 4\text{ km/s}$ radial approach.
- **Estimated Collision Epoch**: $\approx 4.5\text{ billion years}$ from the present epoch.
- **Merger Product**: Coalescence into a giant triaxial elliptical galaxy (*"Milkomeda"*).
$$
