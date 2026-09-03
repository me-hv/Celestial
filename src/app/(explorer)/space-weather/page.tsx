"use client";

import React, { useState, useEffect } from "react";
import {
  Sun,
  Zap,
  Radio,
  ShieldAlert,
  Compass,
  Activity,
  AlertTriangle,
  Flame,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { spaceWeatherRepo } from "@/lib/data/space-weather-repository";
import { SpaceWeatherObservation } from "@/domain/space-weather/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SpaceWeatherPage() {
  const [obs, setObs] = useState<SpaceWeatherObservation>(() => spaceWeatherRepo.getCurrent());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const updated = await spaceWeatherRepo.refreshFromLiveSource();
    setObs(updated);
    setIsRefreshing(false);
  };

  useEffect(() => {
    spaceWeatherRepo.refreshFromLiveSource().then(setObs);
  }, []);

  return (
    <div className="w-full min-h-screen bg-celestial-void text-celestial-starlight p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-celestial-muted/60 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="amber" className="font-mono text-xs uppercase tracking-wider">
              <Sun className="w-3.5 h-3.5 mr-1" /> NOAA SWPC Real-Time Center
            </Badge>
            <span className="font-mono text-xs text-celestial-subtle">Phase 14</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Space Weather & Heliophysics Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-celestial-subtle">
            Continuous authoritative solar wind plasma, interplanetary magnetic field (Bz),
            planetary Kp indices, and GOES X-ray flares from NOAA SWPC & DSCOVR.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right font-mono text-xs text-celestial-subtle">
            <span className="text-emerald-400 font-bold block">● {obs.freshness}</span>
            <span>Observed: {new Date(obs.observedAt).toLocaleTimeString()}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 font-mono text-xs"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} /> Refresh
            Feed
          </Button>
        </div>
      </div>

      {/* Primary KPI Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Solar Activity */}
        <div className="p-5 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/60 backdrop-blur-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-celestial-subtle uppercase">
              Solar Activity
            </span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold font-mono text-celestial-starlight">
              {obs.solarActivity}
            </div>
            <p className="text-xs font-mono text-celestial-cyan">
              GOES Flux: {obs.solarXrayFluxWm2.toExponential(2)} W/m²
            </p>
          </div>
          <div className="pt-2 border-t border-celestial-muted/40 text-[11px] font-mono text-celestial-subtle">
            Radio Blackout: {obs.radioBlackoutScale}
          </div>
        </div>

        {/* Solar Wind */}
        <div className="p-5 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/60 backdrop-blur-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-celestial-subtle uppercase">
              Solar Wind Plasma
            </span>
            <Zap className="w-4 h-4 text-celestial-cyan" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold font-mono text-celestial-starlight">
              {obs.solarWind.speedKmS.toFixed(1)}{" "}
              <span className="text-sm font-normal text-celestial-subtle">km/s</span>
            </div>
            <p className="text-xs font-mono text-celestial-subtle">
              Density: {obs.solarWind.densityProtonsCm3.toFixed(2)} p/cm³
            </p>
          </div>
          <div className="pt-2 border-t border-celestial-muted/40 text-[11px] font-mono text-celestial-subtle">
            Temp: {obs.solarWind.temperatureKelvin.toLocaleString()} K
          </div>
        </div>

        {/* Geomagnetic Kp */}
        <div className="p-5 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/60 backdrop-blur-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-celestial-subtle uppercase">
              Geomagnetic Kp Index
            </span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold font-mono text-celestial-starlight">
              Kp {obs.geomagnetic.kpIndex.toFixed(1)}
            </div>
            <p className="text-xs font-mono text-emerald-400">
              Storm Scale: {obs.geomagnetic.stormScale.replace("_", " ")}
            </p>
          </div>
          <div className="pt-2 border-t border-celestial-muted/40 text-[11px] font-mono text-celestial-subtle">
            Auroral Boundary: &gt;{obs.geomagnetic.auroralBoundaryLatitudeDeg}° Geomagnetic
          </div>
        </div>

        {/* Interplanetary Magnetic Field */}
        <div className="p-5 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/60 backdrop-blur-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-celestial-subtle uppercase">
              IMF Magnetic Field
            </span>
            <Compass className="w-4 h-4 text-violet-400" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold font-mono text-celestial-starlight">
              Bz {obs.solarWind.imfBzNanotesla.toFixed(1)}{" "}
              <span className="text-sm font-normal text-celestial-subtle">nT</span>
            </div>
            <p className="text-xs font-mono text-celestial-subtle">
              Total Bt: {obs.solarWind.imfBtNanotesla.toFixed(1)} nT
            </p>
          </div>
          <div className="pt-2 border-t border-celestial-muted/40 text-[11px] font-mono text-celestial-subtle">
            Coupling:{" "}
            {obs.solarWind.imfBzNanotesla < -3.0
              ? "Southward (Active Coupling)"
              : "Northward (Stable)"}
          </div>
        </div>
      </div>

      {/* Observation Implications & Coupling Banner */}
      <div className="p-6 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/50 backdrop-blur-lg space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-celestial-starlight flex items-center gap-2">
            <Compass className="w-5 h-5 text-celestial-cyan" />
            Sun → Earth & Astronomical Observation Implications
          </h2>
          <Badge
            variant="outline"
            className="font-mono text-[10px] text-celestial-cyan border-celestial-cyan/40"
          >
            MODEL_DERIVED
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-celestial-void/60 border border-celestial-muted/60 space-y-2">
            <span className="text-amber-400 font-bold uppercase flex items-center gap-1.5">
              <Sun className="w-4 h-4" /> Auroral Visibility
            </span>
            <p className="text-celestial-subtle leading-relaxed">
              {obs.observationImplications.auroralVisibilityRecommendation}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-celestial-void/60 border border-celestial-muted/60 space-y-2">
            <span className="text-celestial-cyan font-bold uppercase flex items-center gap-1.5">
              <Radio className="w-4 h-4" /> Radio Propagation
            </span>
            <p className="text-celestial-subtle leading-relaxed">
              {obs.observationImplications.radioPropagationCondition}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-celestial-void/60 border border-celestial-muted/60 space-y-2">
            <span className="text-violet-400 font-bold uppercase flex items-center gap-1.5">
              <Activity className="w-4 h-4" /> Atmospheric Turbulence
            </span>
            <p className="text-celestial-subtle leading-relaxed">
              {obs.observationImplications.groundTelescopeAtmosphericTurbulence}
            </p>
          </div>
        </div>
      </div>

      {/* Active Alerts & Recent Flares */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Solar Flares */}
        <div className="p-6 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/50 backdrop-blur-lg space-y-4">
          <h2 className="text-lg font-bold text-celestial-starlight flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            Recent Solar Flares (GOES X-Ray)
          </h2>
          <div className="space-y-3">
            {obs.recentFlares.map((flare) => (
              <div
                key={flare.id}
                className="p-4 rounded-xl bg-celestial-void/60 border border-celestial-muted/60 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-base font-bold text-amber-400">
                      {flare.magnitude} Class Flare
                    </span>
                    {flare.activeRegionNumber && (
                      <Badge variant="outline" className="text-[10px]">
                        AR {flare.activeRegionNumber}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-celestial-subtle font-mono">
                    Peak: {new Date(flare.peakTimestamp).toUTCString()}
                  </p>
                </div>
                <div className="text-right font-mono text-xs text-celestial-subtle">
                  <span>Flux: {flare.peakFluxWm2.toExponential(1)} W/m²</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Space Weather Alerts */}
        <div className="p-6 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/50 backdrop-blur-lg space-y-4">
          <h2 className="text-lg font-bold text-celestial-starlight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            Active Space Weather Alerts & Watches
          </h2>
          <div className="space-y-3">
            {obs.activeAlerts.length === 0 ? (
              <p className="text-xs text-celestial-subtle font-mono p-4 rounded-xl bg-celestial-void/60 border border-celestial-muted/60">
                No active storm alerts or watches issued by NOAA SWPC.
              </p>
            ) : (
              obs.activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 rounded-xl bg-celestial-void/60 border border-celestial-muted/60 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-rose-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> {alert.headline}
                    </span>
                    <span className="font-mono text-[10px] text-celestial-subtle">
                      {new Date(alert.issuedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <pre className="text-[11px] font-mono text-celestial-subtle whitespace-pre-wrap leading-relaxed">
                    {alert.message}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Epistemic Provenance Footer */}
      <div className="p-6 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/40 backdrop-blur-md space-y-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-celestial-cyan">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-bold">Strict Provenance & Calibration Standard</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-celestial-subtle">
          <div>
            <span className="text-[10px] uppercase block">Authoritative Provider</span>
            <span className="text-celestial-starlight font-bold">
              {obs.provenance.authoritativeBody}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase block">Catalog / Feed Name</span>
            <span className="text-celestial-starlight">{obs.provenance.catalogName}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase block">Endpoint</span>
            <a
              href={obs.provenance.citationUrl}
              target="_blank"
              rel="noreferrer"
              className="text-celestial-cyan hover:underline"
            >
              {obs.provenance.citationUrl}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
