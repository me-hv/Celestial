import { CrossDomainIntelligenceResult, UnifiedScientificSnapshot } from "./types";
import { ObserverLocation } from "../observer/types";
import { spaceWeatherRepo } from "@/lib/data/space-weather-repository";
import { SkyIntelligenceEngine } from "../sky-intelligence/sky-intelligence-engine";
import { missionRepo } from "@/lib/data/mission-repository";

export class IntelligenceEngine {
  /**
   * Generates cross-domain synthesized scientific intelligence statements
   */
  public static evaluateCrossDomainInsights(
    observer?: ObserverLocation,
    date = new Date()
  ): UnifiedScientificSnapshot {
    const sw = spaceWeatherRepo.getCurrent();
    const activeMissions = missionRepo.getActiveMissions();
    const insights: CrossDomainIntelligenceResult[] = [];

    // 1. Sun -> Earth -> Observation Coupling Insight
    const kp = sw.geomagnetic.kpIndex;
    const auroralLat = sw.geomagnetic.auroralBoundaryLatitudeDeg;
    let swStatement = `Geomagnetic conditions are currently quiet (Kp ${kp.toFixed(1)}). Auroral activity remains confined to polar latitudes (> ${auroralLat}°).`;
    if (kp >= 5) {
      swStatement = `Geomagnetic storm active (${sw.geomagnetic.stormScale.replace("_", " ")}). High potential for auroral displays at geomagnetic latitudes above ${auroralLat}°.`;
    }

    insights.push({
      id: `intel-sw-coupling-${date.getTime()}`,
      topic: "SPACE_WEATHER_EARTH_COUPLING",
      statement: swStatement,
      basis: `Planetary Kp ${kp.toFixed(1)}, IMF Bz ${sw.solarWind.imfBzNanotesla} nT, solar wind velocity ${sw.solarWind.speedKmS} km/s.`,
      inputs: {
        kpIndex: kp,
        imfBz: sw.solarWind.imfBzNanotesla,
        windSpeed: sw.solarWind.speedKmS,
      },
      epistemicStatus: "MODEL_DERIVED",
      confidenceScore: 0.95,
      generatedAt: date.toISOString(),
      sourceReferences: ["NOAA Space Weather Prediction Center", "DSCOVR Real-Time Plasma"],
      limitations: ["Empirical auroral oval boundaries vary with dynamic magnetospheric pressure."],
      provenance: sw.provenance,
    });

    // 2. Active Deep-Space Fleet Insight
    insights.push({
      id: `intel-mission-fleet-${date.getTime()}`,
      topic: "MISSION_TARGET_EXPLORATION",
      statement: `Active deep space exploratory fleet currently tracking ${activeMissions.length} space missions across Solar System and interstellar trajectories.`,
      basis: `Authoritative tracking databases across NASA, ESA, ISRO, and JAXA.`,
      inputs: {
        activeMissionsCount: activeMissions.length,
      },
      epistemicStatus: "OBSERVED",
      confidenceScore: 0.999,
      generatedAt: date.toISOString(),
      sourceReferences: ["NASA PDS", "ISRO ISSDC", "ESA PSA", "JAXA DARTS"],
      limitations: ["Telemetry refresh cadences vary by mission communication pass schedules."],
      provenance: {
        authoritativeBody: "NASA",
        catalogName: "CELESTIAL Global Space Missions Archive",
        citationUrl: "https://eyes.nasa.gov",
        confidenceScore: 0.999,
        recordIdentifier: "CELESTIAL-FLEET-INTEL",
        retrievedAt: date.toISOString(),
      },
    });

    // 3. Ground Observer Conditions (if observer provided)
    if (observer) {
      const skySummary = SkyIntelligenceEngine.getCurrentSkySummary(observer, date);
      const topTarget = skySummary.topTargetsRightNow[0];

      if (topTarget) {
        insights.push({
          id: `intel-observer-quality-${date.getTime()}`,
          topic: "OBSERVATION_QUALITY_ASSESSMENT",
          statement: `${topTarget.name} is the optimal target for observation right now from latitude ${observer.latitudeDeg.toFixed(1)}° (Altitude: ${topTarget.altitudeDeg}°, Quality: ${topTarget.quality}).`,
          basis: `Target airmass ${topTarget.airmass}, twilight phase ${skySummary.twilightPhase.replace("_", " ")}, sky darkness index ${skySummary.skyDarknessScore}/100.`,
          inputs: {
            targetSlug: topTarget.targetSlug,
            altitudeDeg: topTarget.altitudeDeg,
            airmass: topTarget.airmass,
            darknessScore: skySummary.skyDarknessScore,
          },
          epistemicStatus: "MODEL_DERIVED",
          confidenceScore: 0.92,
          generatedAt: date.toISOString(),
          sourceReferences: ["IAU Ephemerides", "Young Airmass Approximation Model"],
          limitations: ["Calculations assume clear atmospheric seeing and unobstructed horizon."],
          provenance: skySummary.provenance,
        });
      }
    }

    return {
      timestamp: date.toISOString(),
      solarActivitySummary: `Solar Activity: ${sw.solarActivity} • GOES X-ray: ${sw.solarXrayFluxWm2.toExponential(2)} W/m²`,
      geomagneticStormScale: sw.geomagnetic.stormScale,
      activeDeepSpaceMissionsCount: activeMissions.length,
      topObservableTargetsCount: observer
        ? SkyIntelligenceEngine.getCurrentSkySummary(observer, date).topTargetsRightNow.length
        : 0,
      spaceWeatherAlertsActive: sw.activeAlerts.length,
      intelligenceInsights: insights,
      epistemicStatus: "MODEL_DERIVED",
      provenance: {
        authoritativeBody: "IAU",
        catalogName: "CELESTIAL Cross-Domain Intelligence Engine",
        citationUrl: "https://iau.org",
        confidenceScore: 0.98,
        recordIdentifier: "CROSS-DOMAIN-INTEL-SNAPSHOT",
        retrievedAt: date.toISOString(),
      },
    };
  }
}
