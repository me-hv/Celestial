# Global Space Mission & Research Organization Registry

## 1. Architectural Overview

CELESTIAL Phase 11.5 elevates the platform from a Western-agency-centric catalog into a truly global, decentralized, and authoritative **Global Space Mission & Research Organization Registry**.

Space exploration is an international scientific endeavor. Major space programs and fundamental astronomical discoveries are distributed across planetary space agencies, national research institutes, university consortia, and international collaborations.

```
+-----------------------------------------------------------------------------------+
|                        GLOBAL SCIENTIFIC COLLABORATION HIERARCHY                  |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|   +---------------------------------------------------------------------------+   |
|   |                          ORGANIZATION REGISTRY                            |   |
|   |   ISRO • JAXA • CNSA • NASA • ESA • Roscosmos • KARI • UAESA • EHT • LVK  |   |
|   +---------------------------------------------------------------------------+   |
|                                       │                                           |
|                                       ▼                                           |
|   +---------------------------------------------------------------------------+   |
|   |                            SPACE PROGRAMMES                               |   |
|   |   Chandrayaan • Hayabusa • Chang'e • Artemis • Venera • Mars Exploration  |   |
|   +---------------------------------------------------------------------------+   |
|                                       │                                           |
|                                       ▼                                           |
|   +---------------------------------------------------------------------------+   |
|   |                             SPACE MISSIONS                                |   |
|   |   Chandrayaan-3 • Hayabusa2 • Tianwen-1 • JWST • Aditya-L1 • Hope Mars    |   |
|   +---------------------------------------------------------------------------+   |
|                                       │                                           |
|                                       ▼                                           |
|   +---------------------------------------------------------------------------+   |
|   |                     SPACECRAFT & SCIENTIFIC PAYLOADS                      |   |
|   |   Vikram Lander • Pragyan Rover • NIRSpec • ChaSTE • ShadowCam • EXI      |   |
|   +---------------------------------------------------------------------------+   |
|                                       │                                           |
|                                       ▼                                           |
|   +---------------------------------------------------------------------------+   |
|   |                   PUBLIC SCIENTIFIC DATA ARCHIVES & PORTALS               |   |
|   |   ISSDC • DARTS (ISAS) • NASA PDS / MAST • ESA PSA • EMM Science Portal   |   |
|   +---------------------------------------------------------------------------+   |
|                                       │                                           |
|                                       ▼                                           |
|   +---------------------------------------------------------------------------+   |
|   |                    PEER-REVIEWED SCIENTIFIC DISCOVERIES                   |   |
|   |   Polar Regolith Sulfur • Ryugu Amino Acids • Early Galaxy z=14.32        |   |
|   +---------------------------------------------------------------------------+   |
+-----------------------------------------------------------------------------------+
```

---

## 2. Global Organization Taxonomy

Organizations are classified by geographic region, governance structure, and primary exploration domains:

### Geographic Regions

- `SOUTH_ASIA`: India (ISRO, ISSDC, PRL)
- `ASIA_PACIFIC`: Japan (JAXA, ISAS), China (CNSA, CAS), South Korea (KARI), Australia (ASA, CSIRO)
- `EUROPE`: ESA, France (CNES), Germany (DLR), Italy (ASI), UK (UKSA), Soviet Space Program (Historical 1955-1991), Roscosmos, IKI RAS
- `NORTH_AMERICA`: USA (NASA, JPL, JHU APL, SwRI), Canada (CSA)
- `MIDDLE_EAST`: United Arab Emirates (UAESA, MBRSC), Israel (ISA)
- `LATIN_AMERICA`: Brazil (AEB/INPE), Argentina (CONAE)
- `AFRICA`: South Africa (SANSA, SARAO)
- `INTERNATIONAL`: Event Horizon Telescope (EHT), LIGO-Virgo-KAGRA (LVK), International Space Station (ISS)

### Organization Types

- `SPACE_AGENCY`: National government space agency with flight execution authority.
- `GOVERNMENT_RESEARCH_ORGANIZATION`: National research council or state laboratory.
- `NATIONAL_RESEARCH_INSTITUTE`: Dedicated astronomical or space physics research center.
- `UNIVERSITY`: Academic research institution developing scientific payloads.
- `OBSERVATORY`: Ground-based or space-based observatory operations facility.
- `INTERNATIONAL_ORGANIZATION`: Treaty-based intergovernmental space organization.
- `SCIENTIFIC_CONSORTIUM`: Multi-institutional scientific collaboration.

---

## 3. Multi-Agency Collaboration & Participation Roles

Space missions are modeled with explicit multi-agency participation matrixes rather than single-owner assumptions:

- `LEAD_AGENCY`: Primary commissioning agency and programme management.
- `MISSION_OPERATOR`: Flight dynamics, deep space communications, and stationkeeping.
- `SPACECRAFT_BUILDER`: Prime aerospace contractor or space laboratory.
- `INSTRUMENT_PROVIDER`: Scientific institution responsible for design and calibration of payload instruments.
- `SCIENCE_TEAM`: Principal investigators and science working groups.
- `LAUNCH_PROVIDER`: Launch vehicle manufacturer and launch range operator.
- `GROUND_SEGMENT`: Deep space tracking networks (e.g. ISTRAC, DSN, ESTRACK, Usuda).
- `DATA_ARCHIVE`: Long-term curation facility preserving raw and calibrated scientific datasets.
- `INTERNATIONAL_PARTNER`: Formal bilateral or multilateral partner agency.

---

## 4. Public Scientific Data Archives

CELESTIAL links directly to authoritative public data repositories:

- **ISSDC (Indian Space Science Data Centre)**: PDS4-compliant planetary datasets from Chandrayaan-1/2/3, Mars Orbiter Mission, and AstroSat.
- **DARTS (Data Archives and Transmission System)**: JAXA / ISAS astrophysics, lunar, and small-body data (Hayabusa, Hayabusa2, SLIM, XRISM).
- **NASA PDS & MAST**: Planetary Data System and Mikulski Archive for Space Telescopes.
- **ESA Planetary Science Archive (PSA)**: Public repositories for Rosetta, Mars Express, BepiColombo, Euclid, and Gaia.
- **EMM Science Data Center**: Emirates Mars Mission Hope probe atmospheric data.

---

## 5. Epistemic Status & Provenance Standards

In accordance with CELESTIAL's epistemic integrity principles:

- Historical missions (e.g. Soviet Space Program 1955-1991) are faithfully categorized under their historical governing bodies rather than conflated with modern successors.
- Planned, developing, active, and completed missions are strictly segregated in lifecycle state.
- Every mission, spacecraft, instrument, and discovery carries an authoritative `ProvenanceRecord` with citation metadata.
