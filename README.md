# CELESTIAL

> **Interactive Astronomical Exploration Platform & Scientific Atlas**  
> *"Google Maps for the Universe."*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-yellow.svg)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## Overview

**CELESTIAL** is an astronomical exploration platform bridging the gap between a 3D planetarium, an astronomical atlas, and a rigorous scientific knowledge base.

It enables exploration of celestial entities from our solar neighborhood to deep space:
- **Solar System**: Sun, terrestrial planets, gas giants, dwarf planets, moons, asteroids, and comets.
- **Stellar Neighborhood & Exoplanets**: Multi-star systems, spectral classifications, habitable zones, and exoplanet transit data.
- **Deep Sky & Galaxies**: Star clusters, nebulae, supermassive black holes, and galactic structures.
- **Human Exploration**: Space missions, orbital spacecraft, robotic probes, and historical milestones.

---

## Current Status: Phase 10 (Live Sky & Astronomical Data Explorer) [COMPLETED]

CELESTIAL currently features:
- **Phase 1 — Solar System**: Keplerian orbit engine, NASA JPL ephemeris, 3D interactive Solar System, telemetry cards, and planetary routes.
- **Phase 2 — Exoplanet & Stellar Systems**: NASA Exoplanet Archive TAP integration, habitable zones, multi-star orbital hierarchy.
- **Phase 3 — Stellar Neighborhood & Star Catalog**: ESA Gaia DR3 astrometry, ICRS 3D positions, multi-catalog resolution.
- **Phase 4 — Deep Sky & Galactic Explorer**: Messier/NGC/IC multi-wavelength catalog, IAU Equatorial-Galactic transforms, 2D/3D sky maps.
- **Phase 5 — Milky Way & Galactic Structure**: Galactocentric coordinates, logarithmic spiral arms, Sagittarius A* SMBH.
- **Phase 6 — Local Group & Galaxy Explorer**: Morphological galaxy rendering, Megaparsec Cartesian coordinates, galaxy comparison workbench.
- **Phase 7 — Cosmic Web & Large-Scale Structure**: Supergalactic coordinates, 3D cosmic web filaments and voids, 15-350 Mpc maps.
- **Phase 8 — Cosmic Time Machine & Universe Timeline**: 4D spacetime exploration, 14 standard cosmological epochs (Planck to Modern), $\Lambda\text{CDM}$ FLRW expansion engine ($z \leftrightarrow a \leftrightarrow t_L$), 3D Past Light Cone, 2D spacetime expansion map, and multi-scale scrubbers.
- **Phase 9 — Observable Universe & CMB Explorer**: Comoving Particle Horizon (~46.5 Gly), Hubble Sphere (~14 Gly), Cosmological Event Horizon (~17 Gly), 9 Redshift Shells, 12 High-z Observational Landmarks (GN-z11, JADES-GS-z14-0), dedicated 3D CMB Last-Scattering Sphere ($z \approx 1089, T_0 = 2.7255\text{ K}$), 2D spacetime distance graphs ($D_A$ turnover), and Unified Cosmic Scale Hierarchy (Earth $\to$ Observable Universe).
- **Phase 10 — Live Sky & Astronomical Data Explorer**: Ground observer location model, Local Mean Sidereal Time (LMST), Equatorial $\leftrightarrow$ Horizontal (Alt/Az) transformations, real-time Keplerian planetary ephemerides, analytical lunar position & synodic phase engine, 88 IAU constellation asterisms, interactive 3D inner celestial sphere scene with ground horizon disc, 2D All-Sky Planisphere polar map, live observational telemetry, astronomical twilights (Civil, Nautical, Astronomical), night sky observation session planner, and search-to-sky navigation.

---

## Technology Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **UI & Language**: [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/)
- **Styling & Design System**: [Tailwind CSS](https://tailwindcss.com/) with bespoke astronomical tokens
- **Schema Validation**: [Zod](https://zod.dev/)
- **Persistence & Backend**: [PostgreSQL / Supabase](https://supabase.com/)
- **3D Visualization Boundary**: [Three.js](https://threejs.org/) (ready for Phase 1 scene mounting)
- **Testing**: [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/), [Playwright](https://playwright.dev/)
- **Code Quality**: ESLint, Prettier

---

## Quickstart

```bash
# 1. Clone repository
git clone https://github.com/me-hv/Celestial.git
cd Celestial

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local

# 4. Start local development server
npm run dev
```

Visit [`http://localhost:3000`](http://localhost:3000) to view the application shell.

---

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build production application
npm run start        # Start production server
npm run lint         # Run ESLint checks
npm run typecheck    # Run TypeScript compiler checks
npm run test         # Run unit & integration test suite
npm run test:watch   # Run unit tests in watch mode
npm run test:e2e     # Run Playwright end-to-end tests
npm run format       # Format code with Prettier
```

---

## Project Documentation

Detailed architectural and scientific design documentation is available in [`docs/`](docs/):

- 🏛️ [**System Architecture**](docs/architecture.md): Layer decomposition, 3D boundaries, and system interfaces.
- 🌌 [**Domain Model & Taxonomy**](docs/domain-model.md): Canonical `CelestialObject`, hierarchical relationships, and alias resolution.
- 🛰️ [**Data & Ingestion Architecture**](docs/data-architecture.md): 6-stage scientific ingestion pipeline and database ERD.
- 🗺️ [**Product Roadmap**](docs/roadmap.md): Phased roadmap from Solar System to deep sky exploration.
- 🛠️ [**Developer Guide**](docs/development.md): Development setup, testing guidelines, and conventions.

---

## License

This project is licensed under the MIT License.
