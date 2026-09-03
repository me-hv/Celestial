import { LiveDataSource } from "@/domain/live-data/types";
import { LiveDataAdapter } from "./live-data-adapter";
import { noaaSwpcAdapter } from "./adapters/noaa-swpc-adapter";

export const LIVE_DATA_SOURCES: LiveDataSource[] = [
  {
    id: "src-noaa-swpc-live",
    providerId: "provider-noaa-swpc",
    name: "NOAA SWPC Real-Time Solar & Geomagnetic Stream",
    description:
      "Continuous real-time measurements of solar wind plasma, IMF magnetic field, planetary Kp index, and GOES X-ray primary flux.",
    sourceType: "JSON_FEED",
    endpointReference: "https://services.swpc.noaa.gov",
    updateFrequency: "MINUTELY",
    expectedLatencyMs: 60000,
    status: "LIVE",
    supportedDataTypes: [
      "SOLAR_WIND",
      "GEOMAGNETIC_INDEX",
      "SOLAR_XRAY_FLUX",
      "SPACE_WEATHER_ALERTS",
    ],
    authoritativeBody: "NOAA",
    epistemicStatus: "OBSERVED",
    freshnessPolicy: {
      maxAgeSec: 3600,
      staleThresholdSec: 900,
      expectedIntervalSec: 60,
    },
    provenance: {
      sourceId: "src-noaa-swpc-live",
      recordIdentifier: "REC-NOAA-SWPC-LIVE-01",
      authoritativeBody: "NOAA",
      catalogName: "Space Weather Prediction Center Real-Time Feeds",
      citationUrl: "https://services.swpc.noaa.gov",
      confidenceScore: 0.999,
      retrievedAt: "2026-09-03T05:50:00.000Z",
    },
  },
  {
    id: "src-nasa-dsn-telemetry",
    providerId: "provider-nasa-pds",
    name: "NASA Deep Space Network Real-Time Tracking Link",
    description:
      "Active antenna downlink status, carrier frequency lock, and distance estimates for Voyager 1, Voyager 2, and New Horizons.",
    sourceType: "API",
    endpointReference: "https://eyes.nasa.gov/dsn/data/dsn.xml",
    updateFrequency: "MINUTELY",
    expectedLatencyMs: 5000,
    status: "LIVE",
    supportedDataTypes: ["SPACECRAFT_TELEMETRY", "ANTENNA_CARRIER_LOCK"],
    authoritativeBody: "NASA",
    epistemicStatus: "OBSERVED",
    freshnessPolicy: {
      maxAgeSec: 1800,
      staleThresholdSec: 300,
      expectedIntervalSec: 5,
    },
    provenance: {
      sourceId: "src-nasa-dsn-telemetry",
      recordIdentifier: "REC-NASA-DSN-LIVE-01",
      authoritativeBody: "NASA",
      catalogName: "NASA Eyes on the Solar System / DSN Now",
      citationUrl: "https://eyes.nasa.gov/dsn/dsn.html",
      confidenceScore: 0.999,
      retrievedAt: "2026-09-03T05:50:00.000Z",
    },
  },
  {
    id: "src-isro-issdc-pradan",
    providerId: "provider-isro-issdc",
    name: "ISRO ISSDC PRADAN Planetary Data Archive",
    description:
      "Authoritative science repository for Chandrayaan-3, Aditya-L1, and MOM data. Available via scheduled authenticated batch releases rather than a public continuous live stream.",
    sourceType: "ARCHIVE",
    endpointReference: "https://pradan.issdc.gov.in",
    updateFrequency: "WEEKLY",
    expectedLatencyMs: 86400000,
    status: "AVAILABLE_BUT_NOT_LIVE",
    supportedDataTypes: ["PLANETARY_SPECTRA", "THERMOPHYSICS", "TELEMETRY_ARCHIVE"],
    authoritativeBody: "ISRO",
    epistemicStatus: "OBSERVED",
    freshnessPolicy: {
      maxAgeSec: 604800,
      staleThresholdSec: 604800,
      expectedIntervalSec: 86400,
    },
    provenance: {
      sourceId: "src-isro-issdc-pradan",
      recordIdentifier: "REC-ISRO-PRADAN-01",
      authoritativeBody: "ISRO",
      catalogName: "ISSDC PRADAN Scientific Archive",
      citationUrl: "https://pradan.issdc.gov.in",
      confidenceScore: 0.999,
      retrievedAt: "2026-09-03T05:50:00.000Z",
    },
  },
  {
    id: "src-esa-psa-archive",
    providerId: "provider-esa-psa",
    name: "ESA Planetary Science Archive & Gaia Portal",
    description:
      "Official European repository for Rosetta, BepiColombo, ExoMars, and Gaia astrometry. Data available in validated releases and TAP queries.",
    sourceType: "ARCHIVE",
    endpointReference: "https://psa.esac.esa.int",
    updateFrequency: "MONTHLY",
    expectedLatencyMs: 2592000000,
    status: "AVAILABLE_BUT_NOT_LIVE",
    supportedDataTypes: ["ASTROMETRIC_CATALOG", "PLANETARY_IMAGERY"],
    authoritativeBody: "ESA",
    epistemicStatus: "OBSERVED",
    freshnessPolicy: {
      maxAgeSec: 2592000,
      staleThresholdSec: 2592000,
      expectedIntervalSec: 604800,
    },
    provenance: {
      sourceId: "src-esa-psa-archive",
      recordIdentifier: "REC-ESA-PSA-01",
      authoritativeBody: "ESA",
      catalogName: "ESA Planetary Science Archive",
      citationUrl: "https://psa.esac.esa.int",
      confidenceScore: 0.999,
      retrievedAt: "2026-09-03T05:50:00.000Z",
    },
  },
  {
    id: "src-jaxa-darts-archive",
    providerId: "provider-jaxa-darts",
    name: "JAXA DARTS Multi-Mission Data Service",
    description: "Scientific data releases for Hayabusa2, Akatsuki, and XRISM missions.",
    sourceType: "ARCHIVE",
    endpointReference: "https://darts.isas.jaxa.jp",
    updateFrequency: "MONTHLY",
    expectedLatencyMs: 2592000000,
    status: "AVAILABLE_BUT_NOT_LIVE",
    supportedDataTypes: ["ASTEROID_SPECTRA", "SOLAR_OBSERVATIONS"],
    authoritativeBody: "JAXA",
    epistemicStatus: "OBSERVED",
    freshnessPolicy: {
      maxAgeSec: 2592000,
      staleThresholdSec: 2592000,
      expectedIntervalSec: 604800,
    },
    provenance: {
      sourceId: "src-jaxa-darts-archive",
      recordIdentifier: "REC-JAXA-DARTS-01",
      authoritativeBody: "JAXA",
      catalogName: "ISAS/JAXA DARTS Science Portal",
      citationUrl: "https://darts.isas.jaxa.jp",
      confidenceScore: 0.999,
      retrievedAt: "2026-09-03T05:50:00.000Z",
    },
  },
  {
    id: "src-cnsa-clep-archive",
    providerId: "provider-cnsa-clep",
    name: "China Lunar & Deep Space Exploration Data Center",
    description: "Official releases for Chang'e-5/6 and Tianwen-1 science products.",
    sourceType: "ARCHIVE",
    endpointReference: "https://moon.bao.ac.cn",
    updateFrequency: "STATIC_RELEASE",
    expectedLatencyMs: 7776000000,
    status: "AVAILABLE_BUT_NOT_LIVE",
    supportedDataTypes: ["LUNAR_MINERALOGY", "RADAR_GRAMS"],
    authoritativeBody: "CNSA / NAOC",
    epistemicStatus: "OBSERVED",
    freshnessPolicy: {
      maxAgeSec: 7776000,
      staleThresholdSec: 7776000,
      expectedIntervalSec: 2592000,
    },
    provenance: {
      sourceId: "src-cnsa-clep-archive",
      recordIdentifier: "REC-CNSA-NAOC-01",
      authoritativeBody: "CNSA / NAOC",
      catalogName: "China Lunar & Deep Space Science Data Center",
      citationUrl: "https://moon.bao.ac.cn",
      confidenceScore: 0.999,
      retrievedAt: "2026-09-03T05:50:00.000Z",
    },
  },
];

export class LiveDataRegistry {
  private static instance: LiveDataRegistry;
  private readonly sources: Map<string, LiveDataSource> = new Map();
  private readonly adapters: Map<string, LiveDataAdapter<unknown>> = new Map();

  private constructor() {
    LIVE_DATA_SOURCES.forEach((s) => {
      this.sources.set(s.id, s);
    });

    // Register active adapters
    this.adapters.set(noaaSwpcAdapter.sourceId, noaaSwpcAdapter as LiveDataAdapter<unknown>);
  }

  public static getInstance(): LiveDataRegistry {
    if (!LiveDataRegistry.instance) {
      LiveDataRegistry.instance = new LiveDataRegistry();
    }
    return LiveDataRegistry.instance;
  }

  public getAllSources(): LiveDataSource[] {
    return Array.from(this.sources.values());
  }

  public getSourceById(id: string): LiveDataSource | undefined {
    return this.sources.get(id);
  }

  public getAdapter<T>(sourceId: string): LiveDataAdapter<T> | undefined {
    return this.adapters.get(sourceId) as LiveDataAdapter<T> | undefined;
  }

  public registerAdapter<T>(adapter: LiveDataAdapter<T>): void {
    this.adapters.set(adapter.sourceId, adapter as LiveDataAdapter<unknown>);
  }
}

export const liveDataRegistry = LiveDataRegistry.getInstance();
