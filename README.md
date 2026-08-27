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

## Current Status: Phase 0 (Foundation & Architecture)

The repository currently contains the **Phase 0 Foundation**. The architectural boundaries, generalized domain model, database migration schema, ingestion pipeline abstractions, search architecture, design system tokens, and testing harness are established.

**Phase 1 (Solar System Explorer)** will introduce the 3D Keplerian orbital rendering engine, NASA JPL Horizons data integration, and object detail exploration cards.

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
