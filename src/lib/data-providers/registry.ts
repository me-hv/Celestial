import { ScientificDataProvider } from "@/domain/data-provider/types";

export const SCIENTIFIC_DATA_PROVIDERS: ScientificDataProvider[] = [
  {
    id: "provider-isro-issdc",
    slug: "isro-issdc",
    name: "Indian Space Science Data Centre",
    acronym: "ISSDC",
    organizationId: "org-isro",
    organizationSlug: "isro",
    organizationName: "Indian Space Research Organisation",
    baseUrl: "https://www.issdc.gov.in",
    documentationUrl: "https://pradan.issdc.gov.in/ch3/",
    license: "ISRO Open Science Data Policy (CC BY 4.0 Equivalent)",
    updateFrequency: "WEEKLY",
    supportedDisciplines: ["PLANETARY_SCIENCE", "ASTROPHYSICS", "HELIOPHYSICS"],
    epistemicRating: "OFFICIAL_AUTHORITY",
    summary:
      "Primary nodal archive for planetary, space science, and astronomy missions of ISRO, hosting PDS4-compliant datasets for Chandrayaan-1/2/3, Mars Orbiter Mission, and AstroSat.",
    provenance: {
      sourceId: "src-issdc-authority-01",
      recordIdentifier: "REC-src-issdc-authority-01",
      authoritativeBody: "ISRO",
      catalogName: "ISSDC Planetary Data Archive (PRADAN)",
      citationUrl: "https://pradan.issdc.gov.in",
      confidenceScore: 0.999,
      retrievedAt: "2026-08-28T00:00:00.000Z",
    },
  },
  {
    id: "provider-nasa-pds",
    slug: "nasa-pds",
    name: "NASA Planetary Data System",
    acronym: "PDS",
    organizationId: "org-nasa",
    organizationSlug: "nasa",
    organizationName: "National Aeronautics and Space Administration",
    baseUrl: "https://pds.nasa.gov",
    documentationUrl: "https://pds-geosciences.wustl.edu",
    license: "Public Domain / NASA Open Data",
    updateFrequency: "CONTINUOUS",
    supportedDisciplines: ["PLANETARY_SCIENCE", "ASTROPHYSICS", "HELIOPHYSICS"],
    epistemicRating: "OFFICIAL_AUTHORITY",
    summary:
      "NASA's primary repository for planetary science data returned from robotic missions to the Solar System, organized into specialized discipline nodes (Geosciences, Imaging, Atmospheres, Small Bodies).",
    provenance: {
      sourceId: "src-nasa-pds-01",
      recordIdentifier: "REC-src-nasa-pds-01",
      authoritativeBody: "NASA",
      catalogName: "NASA Planetary Data System (PDS4)",
      citationUrl: "https://pds.nasa.gov",
      confidenceScore: 0.999,
      retrievedAt: "2026-08-28T00:00:00.000Z",
    },
  },
  {
    id: "provider-esa-psa",
    slug: "esa-psa",
    name: "ESA Planetary Science Archive",
    acronym: "PSA",
    organizationId: "org-esa",
    organizationSlug: "esa",
    organizationName: "European Space Agency",
    baseUrl: "https://psa.esac.esa.int",
    documentationUrl: "https://www.cosmos.esa.int/web/psa",
    license: "ESA Open Access Policy (CC BY-SA 3.0 IGO)",
    updateFrequency: "MONTHLY",
    supportedDisciplines: ["PLANETARY_SCIENCE", "ASTROPHYSICS", "COSMOLOGY"],
    epistemicRating: "OFFICIAL_AUTHORITY",
    summary:
      "European Space Agency's online repository for all scientific datasets returned by Solar System exploration missions (Rosetta, Mars Express, Venus Express, BepiColombo, ExoMars).",
    provenance: {
      sourceId: "src-esa-psa-01",
      recordIdentifier: "REC-src-esa-psa-01",
      authoritativeBody: "ESA",
      catalogName: "ESA Planetary Science Archive",
      citationUrl: "https://psa.esac.esa.int",
      confidenceScore: 0.999,
      retrievedAt: "2026-08-28T00:00:00.000Z",
    },
  },
  {
    id: "provider-jaxa-darts",
    slug: "jaxa-darts",
    name: "JAXA Data Archives and Transmission System",
    acronym: "DARTS",
    organizationId: "org-jaxa",
    organizationSlug: "jaxa",
    organizationName: "Japan Aerospace Exploration Agency",
    baseUrl: "https://darts.isas.jaxa.jp",
    documentationUrl: "https://darts.isas.jaxa.jp/planet/project/hayabusa2/",
    license: "JAXA Open Data Policy",
    updateFrequency: "MONTHLY",
    supportedDisciplines: ["PLANETARY_SCIENCE", "ASTROPHYSICS", "SOLAR_PHYSICS"],
    epistemicRating: "OFFICIAL_AUTHORITY",
    summary:
      "Multidisciplinary scientific data archive operated by ISAS/JAXA, housing datasets for Hayabusa, Hayabusa2, Akatsuki, Kaguya, XRISM, and Hinode.",
    provenance: {
      sourceId: "src-jaxa-darts-01",
      recordIdentifier: "REC-src-jaxa-darts-01",
      authoritativeBody: "JAXA",
      catalogName: "ISAS/JAXA DARTS Portal",
      citationUrl: "https://darts.isas.jaxa.jp",
      confidenceScore: 0.999,
      retrievedAt: "2026-08-28T00:00:00.000Z",
    },
  },
  {
    id: "provider-cnsa-clep",
    slug: "cnsa-clep",
    name: "China Lunar & Deep Space Exploration Data Center",
    acronym: "CLEP Data Center",
    organizationId: "org-cnsa",
    organizationSlug: "cnsa",
    organizationName: "China National Space Administration",
    baseUrl: "https://moon.bao.ac.cn",
    documentationUrl: "https://moon.bao.ac.cn/ce5/scientificData.search",
    license: "CNSA Science Data Release Regulations",
    updateFrequency: "STATIC_RELEASE",
    supportedDisciplines: ["PLANETARY_SCIENCE", "ASTROBIOLOGY"],
    epistemicRating: "OFFICIAL_AUTHORITY",
    summary:
      "Official archive operated under National Astronomical Observatories of CAS (NAOC) for data from Chang'e-4, Chang'e-5, Chang'e-6 lunar missions and Tianwen-1 Mars mission.",
    provenance: {
      sourceId: "src-cnsa-naoc-01",
      recordIdentifier: "REC-src-cnsa-naoc-01",
      authoritativeBody: "CNSA / NAOC",
      catalogName: "China Lunar and Deep Space Science Data Center",
      citationUrl: "https://moon.bao.ac.cn",
      confidenceScore: 0.999,
      retrievedAt: "2026-08-28T00:00:00.000Z",
    },
  },
  {
    id: "provider-eso-saf",
    slug: "eso-saf",
    name: "ESO Science Archive Facility",
    acronym: "ESO SAF",
    organizationId: "org-eso",
    organizationSlug: "eso",
    organizationName: "European Southern Observatory",
    baseUrl: "https://archive.eso.org",
    documentationUrl: "https://archive.eso.org/cms.html",
    license: "ESO Open Science Policy",
    updateFrequency: "DAILY",
    supportedDisciplines: ["ASTROPHYSICS", "COSMOLOGY", "EXOPLANETARY_SCIENCE"],
    epistemicRating: "OFFICIAL_AUTHORITY",
    summary:
      "Comprehensive astronomical archive serving raw and calibrated observations from VLT, VLTI, ALMA (European share), and La Silla telescopes.",
    provenance: {
      sourceId: "src-eso-saf-01",
      recordIdentifier: "REC-src-eso-saf-01",
      authoritativeBody: "ESO",
      catalogName: "ESO Science Archive Facility",
      citationUrl: "https://archive.eso.org",
      confidenceScore: 0.999,
      retrievedAt: "2026-08-28T00:00:00.000Z",
    },
  },
  {
    id: "provider-noaa-swpc",
    slug: "noaa-swpc",
    name: "NOAA Space Weather Prediction Center Data Access",
    acronym: "NOAA SWPC",
    organizationId: "org-noaa",
    organizationSlug: "noaa",
    organizationName: "National Oceanic and Atmospheric Administration",
    baseUrl: "https://www.swpc.noaa.gov",
    documentationUrl: "https://services.swpc.noaa.gov",
    license: "US Government Work / Public Domain",
    updateFrequency: "CONTINUOUS",
    supportedDisciplines: ["SOLAR_PHYSICS", "HELIOPHYSICS"],
    epistemicRating: "OFFICIAL_AUTHORITY",
    summary:
      "Real-time and archival space weather datasets, solar X-ray flux, geomagnetic planetary K-indices, and interplanetary coronal mass ejection shock monitors.",
    provenance: {
      sourceId: "src-noaa-swpc-01",
      recordIdentifier: "REC-src-noaa-swpc-01",
      authoritativeBody: "NOAA",
      catalogName: "Space Weather Prediction Center Archive",
      citationUrl: "https://www.swpc.noaa.gov",
      confidenceScore: 0.999,
      retrievedAt: "2026-08-28T00:00:00.000Z",
    },
  },
];

export class DataProviderRegistry {
  private static instance: DataProviderRegistry;
  private readonly providers: Map<string, ScientificDataProvider> = new Map();

  private constructor() {
    SCIENTIFIC_DATA_PROVIDERS.forEach((p) => {
      this.providers.set(p.id, p);
      this.providers.set(p.slug, p);
    });
  }

  public static getInstance(): DataProviderRegistry {
    if (!DataProviderRegistry.instance) {
      DataProviderRegistry.instance = new DataProviderRegistry();
    }
    return DataProviderRegistry.instance;
  }

  public getAll(): ScientificDataProvider[] {
    const unique = new Map<string, ScientificDataProvider>();
    this.providers.forEach((p) => unique.set(p.id, p));
    return Array.from(unique.values());
  }

  public getById(id: string): ScientificDataProvider | undefined {
    return this.providers.get(id);
  }

  public getBySlug(slug: string): ScientificDataProvider | undefined {
    return this.providers.get(slug);
  }

  public getByOrganization(orgSlugOrId: string): ScientificDataProvider[] {
    const slug = orgSlugOrId.toLowerCase();
    return this.getAll().filter(
      (p) => p.organizationSlug.toLowerCase() === slug || p.organizationId.toLowerCase() === slug
    );
  }
}

export const dataProviderRegistry = DataProviderRegistry.getInstance();
