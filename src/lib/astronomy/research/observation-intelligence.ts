import { ObserverLocation } from "@/domain/observer/types";
import {
  ObservationConstraint,
  ObservationWindow,
  ObservationQuality,
  EquatorialCoordinates,
} from "@/domain/research/types";
import {
  equatorialToHorizontal,
  calculateAirmass,
  calculateAngularSeparation,
  dateToJulianDate,
  calculateLocalMeanSiderealTimeHours,
  calculateSunPosition,
} from "../coordinates/horizontal";
import { calculateLunarEphemeris } from "../ephemeris/lunar-ephemeris";

export interface TargetObservationParams {
  equatorial: EquatorialCoordinates;
  observer: ObserverLocation;
  date?: Date;
  constraints?: ObservationConstraint;
}

export interface ObservationScheduleItem {
  targetSlug: string;
  targetName: string;
  recommendedTime: Date;
  window: ObservationWindow;
  transitAltitudeDeg: number;
  quality: ObservationQuality;
  score: number;
  reasoning: string;
}

export class ObservationIntelligenceEngine {
  public static calculateWindows(params: TargetObservationParams): ObservationWindow[] {
    const { equatorial, observer, date = new Date(), constraints = {} } = params;

    const minAlt = constraints.minAltitudeDeg ?? 15.0;
    const maxAirmass = constraints.maxAirmass ?? 2.8;
    const minMoonSep = constraints.minMoonSeparationDeg ?? 15.0;
    const maxMoonIllum = constraints.maxMoonIllumination ?? 1.0;
    const twilightReq = constraints.twilightRequirement ?? "ASTRONOMICAL";

    const baseDate = new Date(date);
    baseDate.setHours(12, 0, 0, 0);

    const samples: Array<{
      time: Date;
      alt: number;
      az: number;
      airmass: number;
      twilight: "DAYLIGHT" | "CIVIL" | "NAUTICAL" | "ASTRONOMICAL" | "NIGHT";
      moonSep: number;
      moonIllum: number;
      passesConstraints: boolean;
      limitingFactors: string[];
    }> = [];

    const lunar = calculateLunarEphemeris(date);
    const moonIllum = lunar.illuminationPercentage / 100.0;

    for (let step = 0; step < 96; step++) {
      const sampleTime = new Date(baseDate.getTime() + step * 15 * 60 * 1000);
      const jd = dateToJulianDate(sampleTime);
      const lmst = calculateLocalMeanSiderealTimeHours(jd, observer.longitudeDeg);

      const horiz = equatorialToHorizontal(
        equatorial.raDeg,
        equatorial.decDeg,
        observer.latitudeDeg,
        lmst
      );

      const alt = horiz.altitudeDeg;
      const az = horiz.azimuthDeg;
      const airmass = calculateAirmass(alt);

      const sunPos = calculateSunPosition(sampleTime);
      const sunHoriz = equatorialToHorizontal(
        sunPos.raDeg,
        sunPos.decDeg,
        observer.latitudeDeg,
        lmst
      );
      const sunAlt = sunHoriz.altitudeDeg;

      let twilight: "DAYLIGHT" | "CIVIL" | "NAUTICAL" | "ASTRONOMICAL" | "NIGHT" = "DAYLIGHT";
      if (sunAlt > 0) {
        twilight = "DAYLIGHT";
      } else if (sunAlt > -6) {
        twilight = "CIVIL";
      } else if (sunAlt > -12) {
        twilight = "NAUTICAL";
      } else if (sunAlt > -18) {
        twilight = "ASTRONOMICAL";
      } else {
        twilight = "NIGHT";
      }

      const moonSep = calculateAngularSeparation(
        equatorial.raDeg,
        equatorial.decDeg,
        lunar.raDeg,
        lunar.decDeg
      );

      const limitingFactors: string[] = [];
      let passes = true;

      if (alt < minAlt) {
        passes = false;
        limitingFactors.push(`Altitude (${alt.toFixed(1)}°) is below threshold of ${minAlt}°`);
      }
      if (airmass > maxAirmass) {
        passes = false;
        limitingFactors.push(`Airmass (${airmass.toFixed(2)}) exceeds maximum of ${maxAirmass}`);
      }
      if (moonSep < minMoonSep) {
        passes = false;
        limitingFactors.push(
          `Angular distance from Moon (${moonSep.toFixed(1)}°) is below threshold of ${minMoonSep}°`
        );
      }
      if (moonIllum > maxMoonIllum) {
        passes = false;
        limitingFactors.push(`Moon illumination (${(moonIllum * 100).toFixed(0)}%) exceeds limit`);
      }

      if (
        twilightReq === "ASTRONOMICAL" &&
        (twilight === "DAYLIGHT" || twilight === "CIVIL" || twilight === "NAUTICAL")
      ) {
        passes = false;
        limitingFactors.push(
          `Solar twilight (${twilight}) has not transitioned to true astronomical darkness`
        );
      } else if (twilightReq === "NAUTICAL" && (twilight === "DAYLIGHT" || twilight === "CIVIL")) {
        passes = false;
        limitingFactors.push(`Solar twilight (${twilight}) requires at least nautical darkness`);
      } else if (twilightReq === "CIVIL" && twilight === "DAYLIGHT") {
        passes = false;
        limitingFactors.push("Target is in daylight");
      }

      samples.push({
        time: sampleTime,
        alt,
        az,
        airmass,
        twilight,
        moonSep,
        moonIllum,
        passesConstraints: passes,
        limitingFactors,
      });
    }

    const windows: ObservationWindow[] = [];
    let currentWindowSamples: typeof samples = [];

    for (let i = 0; i < samples.length; i++) {
      const sample = samples[i];
      if (sample.passesConstraints) {
        currentWindowSamples.push(sample);
      } else {
        if (currentWindowSamples.length > 0) {
          windows.push(this.buildWindowFromSamples(currentWindowSamples));
          currentWindowSamples = [];
        }
      }
    }
    if (currentWindowSamples.length > 0) {
      windows.push(this.buildWindowFromSamples(currentWindowSamples));
    }

    if (windows.length === 0) {
      const peakSample = samples.reduce(
        (prev, curr) => (curr.alt > prev.alt ? curr : prev),
        samples[0]
      );
      windows.push({
        start: samples[0].time.toISOString(),
        end: samples[samples.length - 1].time.toISOString(),
        durationMinutes: 0,
        maxAltitudeDeg: Number(peakSample.alt.toFixed(1)),
        transitTime: null,
        minAirmass: Number(peakSample.airmass.toFixed(2)),
        twilightState: peakSample.twilight,
        moonSeparationDeg: Number(peakSample.moonSep.toFixed(1)),
        moonIlluminationFraction: Number(moonIllum.toFixed(2)),
        quality: "NOT_VISIBLE",
        visibilityScore: 0,
        limitingFactors:
          peakSample.limitingFactors.length > 0
            ? peakSample.limitingFactors
            : ["Target not visible under active constraints"],
      });
    }

    return windows;
  }

  private static buildWindowFromSamples(
    samples: Array<{
      time: Date;
      alt: number;
      az: number;
      airmass: number;
      twilight: "DAYLIGHT" | "CIVIL" | "NAUTICAL" | "ASTRONOMICAL" | "NIGHT";
      moonSep: number;
      moonIllum: number;
      limitingFactors: string[];
    }>
  ): ObservationWindow {
    const start = samples[0].time;
    const end = new Date(samples[samples.length - 1].time.getTime() + 15 * 60 * 1000);
    const durationMinutes = (end.getTime() - start.getTime()) / (60 * 1000);

    const peakSample = samples.reduce(
      (prev, curr) => (curr.alt > prev.alt ? curr : prev),
      samples[0]
    );
    const minAirmass = Math.min(...samples.map((s) => s.airmass));
    const maxAlt = peakSample.alt;
    const avgMoonSep = samples.reduce((acc, s) => acc + s.moonSep, 0) / samples.length;
    const moonIllum = samples[0].moonIllum;

    let score = 0;
    score += Math.min(45, (maxAlt / 90) * 45);
    score += Math.max(0, 25 - (minAirmass - 1.0) * 15);
    score += Math.min(15, (avgMoonSep / 90) * 15);
    score += Math.min(15, (durationMinutes / 180) * 15);

    score = Math.max(0, Math.min(100, Math.round(score)));

    let quality: ObservationQuality = "NOT_VISIBLE";
    if (score >= 80) quality = "BEST";
    else if (score >= 60) quality = "GOOD";
    else if (score >= 40) quality = "FAIR";
    else quality = "POOR";

    return {
      start: start.toISOString(),
      end: end.toISOString(),
      durationMinutes: Math.round(durationMinutes),
      maxAltitudeDeg: Number(maxAlt.toFixed(1)),
      transitTime: peakSample.time.toISOString(),
      minAirmass: Number(minAirmass.toFixed(2)),
      twilightState: peakSample.twilight,
      moonSeparationDeg: Number(avgMoonSep.toFixed(1)),
      moonIlluminationFraction: Number(moonIllum.toFixed(2)),
      quality,
      visibilityScore: score,
      limitingFactors: [],
    };
  }

  public static scheduleTargets(
    targets: Array<{ slug: string; name: string; coordinates?: EquatorialCoordinates }>,
    observer: ObserverLocation,
    date = new Date(),
    constraints: ObservationConstraint = {}
  ): ObservationScheduleItem[] {
    const scheduled: ObservationScheduleItem[] = [];

    for (const target of targets) {
      if (!target.coordinates) continue;

      const windows = this.calculateWindows({
        equatorial: target.coordinates,
        observer,
        date,
        constraints,
      });

      const validWindow = windows.find((w) => w.quality !== "NOT_VISIBLE") || windows[0];
      const transitTime = validWindow.transitTime
        ? new Date(validWindow.transitTime)
        : new Date(validWindow.start);

      let reasoning = "";
      if (validWindow.quality === "BEST") {
        reasoning = `Optimal transit timing at ${validWindow.maxAltitudeDeg.toFixed(1)}° with pristine darkness and low airmass (${validWindow.minAirmass.toFixed(2)})`;
      } else if (validWindow.quality === "GOOD") {
        reasoning = `Good viewing window of ${validWindow.durationMinutes} minutes with peak altitude of ${validWindow.maxAltitudeDeg.toFixed(1)}°`;
      } else if (validWindow.quality === "FAIR") {
        reasoning = "Moderate visibility influenced by lower elevation or lunar brightness";
      } else {
        reasoning = `Constrained observing window; ${validWindow.limitingFactors.join("; ") || "check horizon limits"}`;
      }

      scheduled.push({
        targetSlug: target.slug,
        targetName: target.name,
        recommendedTime: transitTime,
        window: validWindow,
        transitAltitudeDeg: validWindow.maxAltitudeDeg,
        quality: validWindow.quality,
        score: validWindow.visibilityScore,
        reasoning,
      });
    }

    scheduled.sort((a, b) => a.recommendedTime.getTime() - b.recommendedTime.getTime());
    return scheduled;
  }
}
