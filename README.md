<div align="center">

# 🌌 CELESTIAL

### **Interactive Astronomical Exploration Platform & Scientific Atlas**
*Precision Astrometry · Keplerian & Cosmological Physics · Multi-Scale 3D Visualization · Ground-to-Cosmos Atlas*

[![Next.js](https://img.shields.io/badge/Next.js-15.5_(App_Router)-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.174-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-3.2-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

[**Explore Live Demo**](https://celestial-atlas.vercel.app) · [**System Architecture**](docs/architecture.md) · [**Mathematical References**](docs/coordinates.md) · [**Roadmap**](docs/roadmap.md)

</div>

---

## 📖 Executive Summary

**CELESTIAL** is an astronomical exploration platform and computational atlas designed to bridge the gap between interactive 3D planetariums, research-grade ephemeris calculators, and cosmological database systems. 

From an observer standing under a dark sky on Earth to the outer boundary of the Particle Horizon 46.5 billion light-years away, **CELESTIAL** enables fluid, scientifically grounded navigation across **spatial, temporal, and observational scales**.

```
  [ Ground Observer (Alt/Az) ] ──▶ [ Solar System (AU) ] ──▶ [ Stellar Neighborhood (pc) ]
                                                                       │
  [ Observable Universe (Gly) ] ◀── [ Cosmic Web (Mpc) ] ◀── [ Milky Way & Local Group (kpc) ]
```

---

## 🔭 The 10 Cosmic Exploration Realms

| Realm | Scale | Coordinates & Physics Engine | Key Highlights | Primary Route |
| :--- | :--- | :--- | :--- | :--- |
| **01. Live Sky & Ground Observatory** | $0 - 100\text{ km}$ | Local Mean Sidereal Time (LMST), Alt/Az, Bennett Refraction | 3D Celestial Sphere, 2D Planisphere, 88 IAU Constellations, Twilights & Session Planner | `/sky` |
| **02. Solar System** | $0.1 - 100\text{ AU}$ | Newton-Raphson Keplerian Solver, Dual-Scale Logarithmic Radii | NASA JPL SSD orbital parameters, Sun, 8 planets, dwarf planets, moons & telemetry | `/explore` |
| **03. Exoplanets & Stellar Systems** | $1 - 100\text{ AU}$ | Kopparapu Habitable Zone model, Barycentric orbital hierarchy | NASA Exoplanet Archive TAP integration, TRAPPIST-1, Proxima Centauri, Kepler systems | `/systems` |
| **04. Stellar Neighborhood** | $1 - 25\text{ pc}$ | ICRS J2000 Cartesian $(X,Y,Z)$, Parallax Distance Inversion | ESA Gaia DR3 & CNS catalog, spectral classification (OBAFGKM), distance shells | `/stars` |
| **05. Deep Sky Objects** | $10\text{ pc} - 10\text{ Mpc}$ | Vincenty Great-Circle Separation, Multi-Wavelength Indexing | Messier, NGC, IC catalogs, emission nebulae, globular clusters, supernova remnants | `/deep-sky` |
| **06. Milky Way & Galactic Structure** | $0.1 - 50\text{ kpc}$ | Galactocentric Cylindrical $(R, \theta, z)$, Logarithmic Spiral Arms | Sgr A* Supermassive Black Hole ($4.154 \times 10^6 M_\odot$), Thin/Thick disk, "You Are Here" | `/milky-way` |
| **07. Local Group of Galaxies** | $0.1 - 3\text{ Mpc}$ | Megaparsec Cartesian coordinates, Morphological classification | Milky Way, Andromeda (M31), Triangulum (M33), LMC/SMC dwarf satellites, galaxy comparator | `/local-group` |
| **08. Cosmic Web & Large-Scale Structure** | $1 - 500\text{ Mpc}$ | Supergalactic Coordinates $(SGL, SGB)$, Filament & Void Mesh | Laniakea, Virgo Cluster, Shapley Supercluster, Boötes Void, cosmic filament web | `/cosmic-web` |
| **09. Cosmic Time Machine** | $0 - 13.8\text{ Gyr}$ | $\Lambda\text{CDM}$ FLRW Cosmological Engine ($z \leftrightarrow a \leftrightarrow t_L$) | 14 Standard Cosmic Epochs (Planck to Dark Energy), 3D Light Cone, Spacetime expansion graph | `/cosmic-time` |
| **10. Observable Universe & CMB** | $0 - 46.5\text{ Gly}$ | Comoving Distance Integrals, Cosmological Horizon Limits | Particle Horizon, Hubble Sphere ($c/H_0$), Event Horizon, CMB Decoupling ($z=1089, T_0=2.7255\text{ K}$) | `/observable-universe` |

---

## 🧮 Mathematical & Computational Foundations

CELESTIAL does not use arbitrary visual coordinates; all scenes and telemetry derive from peer-reviewed physical equations.

### 1. Sidereal Time & Horizontal Coordinates
$$\text{GMST} = 280.46061837^\circ + 360.98564736629^\circ \cdot d + 0.000387933 \cdot T^2 - \frac{T^3}{38710000}$$
$$\text{LMST} = \text{GMST} + \frac{\lambda_{\text{observer}}}{15} \pmod{24},\quad H = \text{LMST} - \alpha$$
$$\sin(h) = \sin(\phi)\sin(\delta) + \cos(\phi)\cos(\delta)\cos(H)$$
$$A = \text{atan2}(-\cos(\delta)\sin(H),\; \sin(\delta)\cos(\phi) - \cos(\delta)\sin(\phi)\cos(H)) \pmod{360^\circ}$$

### 2. Keplerian Orbit Mechanics (Newton-Raphson Solver)
$$M = E - e\sin(E),\quad E_{n+1} = E_n - \frac{E_n - e\sin(E_n) - M}{1 - e\cos(E_n)}$$
$$\nu = 2 \arctan\left(\sqrt{\frac{1+e}{1-e}}\tan\frac{E}{2}\right),\quad r = \frac{a(1-e^2)}{1 + e\cos(\nu)}$$

### 3. Circumstellar Habitable Zone (Kopparapu et al.)
$$S_{\text{eff}} = S_{\text{eff}\odot} + a T_* + b T_*^2 + c T_*^3 + d T_*^4,\quad d = \sqrt{\frac{L / L_\odot}{S_{\text{eff}}}}$$

### 4. $\Lambda\text{CDM}$ FLRW Cosmological Expansion
$$E(z) = \sqrt{\Omega_{r,0}(1+z)^4 + \Omega_{m,0}(1+z)^3 + \Omega_{k,0}(1+z)^2 + \Omega_{\Lambda,0}}$$
$$D_C(z) = \frac{c}{H_0} \int_0^z \frac{dz'}{E(z')},\quad t_L(z) = \frac{1}{H_0} \int_0^z \frac{dz'}{(1+z')E(z')}$$
$$D_M(z) = D_C(z)\;(\text{for }\Omega_k=0),\quad D_A(z) = \frac{D_M(z)}{1+z},\quad D_L(z) = (1+z)D_M(z)$$

---

## 🏛️ System Architecture

CELESTIAL follows **Clean Architecture** principles to maintain absolute independence between domain logic, physical simulation, visualization engines, and presentation layers.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER                            │
│  Next.js 15 App Router · React 19 · Tailwind CSS · UI Shell & Dialogs  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                         VISUALIZATION BOUNDARY                         │
│  Three.js 3D Viewports · Shaders · 2D Canvas Maps · Raycast Pickers    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                        ASTRONOMY & PHYSICS CORE                        │
│  FLRW Cosmology · Keplerian Solvers · Ephemerides · Coordinate Transforms │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                     DOMAIN & REPOSITORY DATA LAYER                     │
│  Canonical Domain Models · Ingestion Pipelines · Zod Validation · Cache │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 💻 Tech Stack & Infrastructure

- **Framework**: [Next.js 15.5 (App Router)](https://nextjs.org/) with React Server Components & Static Site Generation (SSG)
- **UI Engine**: [React 19](https://react.dev/) + [Tailwind CSS 3.4](https://tailwindcss.com/)
- **3D Graphics**: [Three.js 0.174](https://threejs.org/) with customized interior/exterior orbit controls and particle point clouds
- **Data Validation & Typing**: [TypeScript 5.7](https://www.typescriptlang.org/) (strict mode) + [Zod 3](https://zod.dev/)
- **Testing**: [Vitest 3.2](https://vitest.dev/) + [React Testing Library](https://testing-library.com/) (249 unit and smoke tests)
- **Code Quality**: ESLint 9 + Prettier (Strict formatting checks)

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js `18.18.0` or higher
- npm `9.0.0` or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/me-hv/Celestial.git
cd Celestial

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local

# 4. Launch local development server
npm run dev
```

Visit [`http://localhost:3000`](http://localhost:3000) in your browser to launch the CELESTIAL atlas.

---

## 🛠️ Verification & Quality Commands

CELESTIAL enforces strict quality gates on every commit:

```bash
# Typecheck codebase (0 errors required)
npm run typecheck

# Lint all files with ESLint (0 errors, 0 warnings required)
npm run lint

# Check formatting with Prettier
npm run format:check

# Run full Vitest test suite (58 files, 249 tests)
npm run test

# Build production application (153 static SSG routes)
npm run build
```

---

## 📂 Repository Structure

```
Celestial/
├── docs/                             # Comprehensive Scientific & Architectural Documentation
│   ├── architecture.md               # Layer decomposition, 3D boundaries, and data flow
│   ├── coordinates.md                # Mathematical coordinate transformations
│   ├── live-sky.md                   # Phase 10 ground observatory reference
│   ├── observable-universe.md        # Cosmological horizons & CMB physics
│   ├── cosmic-time.md                # 4D Spacetime & FLRW expansion engine
│   └── roadmap.md                    # Completed roadmap across all 10 phases
├── src/
│   ├── app/                          # Next.js App Router (Explorer routes)
│   │   ├── (explorer)/
│   │   │   ├── sky/                  # Live Sky, Events, Planner & Heading
│   │   │   ├── explore/              # Solar System Explorer
│   │   │   ├── systems/              # Exoplanet & Stellar Systems
│   │   │   ├── stars/                # Stellar Neighborhood & Gaia Catalog
│   │   │   ├── deep-sky/             # Messier & NGC Deep Sky Atlas
│   │   │   ├── milky-way/            # Galactic Structure & Sgr A*
│   │   │   ├── local-group/          # Local Group of Galaxies
│   │   │   ├── cosmic-web/           # Superclusters & Cosmic Filaments
│   │   │   ├── cosmic-time/          # Universe Timeline & Light Cone
│   │   │   └── observable-universe/  # Observable Universe & CMB
│   ├── domain/                       # Canonical Domain Entities & Zod Schemas
│   │   ├── observer/                 # Location, Alt/Az, Sidereal time
│   │   ├── constellation/            # 88 IAU constellations & asterisms
│   │   ├── observable-universe/      # Horizons, Landmarks, CMB surface
│   │   ├── cosmic-time/              # Epochs, Timeline events, Expansion
│   │   └── celestial-object/         # Base CelestialObject schema & taxonomy
│   ├── features/                     # Feature UI Components & 3D/2D Visualizers
│   │   ├── sky/                      # Controls, Telemetry, Session Planner
│   │   └── visualization/            # Three.js Scenes & 2D Canvas Mappers
│   └── lib/
│       ├── astronomy/                # Pure Math & Physics Engines
│       │   ├── coordinates/          # Astrometric & Horizontal transforms
│       │   ├── cosmology/            # Lambda-CDM expansion & distance integrals
│       │   ├── ephemeris/            # Planetary & Lunar analytical theories
│       │   └── planner/              # Automated observation target scoring
│       └── data/                     # Authoritative Static Catalogs & Repositories
└── tests/
    ├── unit/                         # Unit tests for coordinate math & physics engines
    └── smoke/                        # React component & scene smoke tests
```

---

## 📚 Primary Scientific Datasets & Catalogs

- **Planetary Ephemeris**: NASA JPL Solar System Dynamics (SSD) Horizons
- **Stellar Astrometry**: ESA Gaia Mission (Data Release 3) / SIMBAD CDS Strasbourg
- **Exoplanets**: NASA Exoplanet Science Institute (NExScI) Archive (TAP API)
- **Deep Sky**: OpenNGC, Revised New General Catalogue (RNGC), Messier Catalog
- **Cosmology**: Planck Collaboration 2018 Cosmological Parameters ($\Omega_m = 0.315, \Omega_\Lambda = 0.685, H_0 = 67.4\text{ km/s/Mpc}$)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<div align="center">

*Ad astra per aspera · Dedicated to the exploration of the cosmos.*

</div>
