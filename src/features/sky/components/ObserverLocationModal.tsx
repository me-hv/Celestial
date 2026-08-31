"use client";

import React, { useState } from "react";
import { ObserverLocation, PRESET_OBSERVER_LOCATIONS } from "@/domain/observer/types";
import { MapPin, Navigation, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ObserverLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: ObserverLocation;
  onSelectLocation: (location: ObserverLocation) => void;
}

export function ObserverLocationModal({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}: ObserverLocationModalProps) {
  const [manualName, setManualName] = useState("");
  const [manualLat, setManualLat] = useState("0.0");
  const [manualLon, setManualLon] = useState("0.0");
  const [geoError, setGeoError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const customLoc: ObserverLocation = {
          id: "loc-browser-gps",
          name: `My GPS Coordinates (${pos.coords.latitude.toFixed(2)}°, ${pos.coords.longitude.toFixed(2)}°)`,
          latitudeDeg: Number(pos.coords.latitude.toFixed(4)),
          longitudeDeg: Number(pos.coords.longitude.toFixed(4)),
          elevationMeters: Math.round(pos.coords.altitude ?? 0),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
          isCustom: true,
        };
        onSelectLocation(customLoc);
        onClose();
      },
      (err) => {
        setGeoError(`Geolocation error: ${err.message}`);
      }
    );
  };

  const handleApplyManual = () => {
    const lat = parseFloat(manualLat);
    const lon = parseFloat(manualLon);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      setGeoError("Latitude must be between -90° and +90°.");
      return;
    }
    if (isNaN(lon) || lon < -180 || lon > 180) {
      setGeoError("Longitude must be between -180° and +180°.");
      return;
    }

    const customLoc: ObserverLocation = {
      id: "loc-manual-entry",
      name: manualName.trim() || `Custom Location (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`,
      latitudeDeg: lat,
      longitudeDeg: lon,
      elevationMeters: 0,
      timezone: "UTC",
      isCustom: true,
    };
    onSelectLocation(customLoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-celestial-surface border border-celestial-muted/80 p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-celestial-muted/60 pb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-celestial-cyan" />
            <h2 className="text-lg font-bold font-mono text-celestial-starlight uppercase">
              Observer Location Setup
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 h-8 w-8 text-celestial-subtle hover:text-celestial-starlight"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* 1. Quick Action: Use My GPS Location */}
        <div className="p-3.5 rounded-xl bg-celestial-void border border-celestial-muted/60 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-celestial-starlight">
                Device Geolocation
              </div>
              <div className="text-xs text-celestial-subtle">
                Compute sky coordinates from your current geographic position
              </div>
            </div>
            <Button
              onClick={handleUseMyLocation}
              variant="outline"
              size="sm"
              className="gap-1.5 font-mono text-xs text-celestial-cyan border-celestial-cyan/40 hover:bg-celestial-cyan/10"
            >
              <Navigation className="w-3.5 h-3.5" />
              Use My Location
            </Button>
          </div>
          {geoError && <div className="text-xs text-red-400 font-mono">{geoError}</div>}
        </div>

        {/* 2. Standard Preset Observatories & Global Cities */}
        <div className="space-y-2">
          <div className="text-xs font-mono text-celestial-subtle uppercase tracking-wider">
            Major Observatories & Cities
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {PRESET_OBSERVER_LOCATIONS.map((loc) => {
              const isSelected = loc.id === currentLocation.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => {
                    onSelectLocation(loc);
                    onClose();
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-lg text-left text-xs transition border ${
                    isSelected
                      ? "bg-celestial-cyan/10 border-celestial-cyan text-celestial-cyan font-semibold"
                      : "bg-celestial-void/60 border-celestial-muted/50 text-celestial-starlight hover:bg-celestial-surface"
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="truncate font-medium">{loc.name}</div>
                    <div className="text-[10px] text-celestial-subtle font-mono">
                      {loc.latitudeDeg > 0 ? `+${loc.latitudeDeg}°` : `${loc.latitudeDeg}°`},{" "}
                      {loc.longitudeDeg > 0 ? `+${loc.longitudeDeg}°` : `${loc.longitudeDeg}°`}
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 shrink-0 text-celestial-cyan" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Manual Coordinate Input */}
        <div className="space-y-3 border-t border-celestial-muted/60 pt-4">
          <div className="text-xs font-mono text-celestial-subtle uppercase tracking-wider">
            Manual Coordinate Entry
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Location Label"
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-celestial-void border border-celestial-muted/70 text-xs font-mono text-celestial-starlight focus:outline-none focus:border-celestial-cyan"
            />
            <input
              type="number"
              step="0.0001"
              placeholder="Latitude (-90 to +90)"
              value={manualLat}
              onChange={(e) => setManualLat(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-celestial-void border border-celestial-muted/70 text-xs font-mono text-celestial-starlight focus:outline-none focus:border-celestial-cyan"
            />
            <input
              type="number"
              step="0.0001"
              placeholder="Longitude (-180 to +180)"
              value={manualLon}
              onChange={(e) => setManualLon(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-celestial-void border border-celestial-muted/70 text-xs font-mono text-celestial-starlight focus:outline-none focus:border-celestial-cyan"
            />
          </div>
          <Button
            onClick={handleApplyManual}
            size="sm"
            className="w-full bg-celestial-cyan text-celestial-void hover:bg-celestial-cyan/90 font-mono text-xs"
          >
            Apply Coordinates
          </Button>
        </div>
      </div>
    </div>
  );
}
