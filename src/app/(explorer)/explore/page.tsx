"use client";

import React, { useState } from "react";
import { SolarSystemScene } from "@/features/visualization/scene/SolarSystemScene";
import { TelemetryPanel } from "@/features/exploration/components/TelemetryPanel";
import { ExplorerControls } from "@/features/exploration/components/ExplorerControls";
import { ExplorerSearchBar } from "@/features/exploration/components/ExplorerSearchBar";
import { ScaleInfoModal } from "@/features/exploration/components/ScaleInfoModal";
import { celestialRepo } from "@/lib/data/celestial-repository";
import { CelestialObject } from "@/domain/celestial-object/types";

export default function ExplorePage() {
  const allObjects = celestialRepo.getAll();
  const [selectedObject, setSelectedObject] = useState<CelestialObject | null>(
    celestialRepo.getBySlug("earth") || null
  );
  const [focusedObjectId, setFocusedObjectId] = useState<string | undefined>(undefined);
  const [showOrbits, setShowOrbits] = useState(true);
  const [isScaleModalOpen, setIsScaleModalOpen] = useState(false);

  const handleSelectObject = (object: CelestialObject) => {
    setSelectedObject(object);
  };

  const handleFocusCamera = (object: CelestialObject) => {
    setFocusedObjectId(object.id);
  };

  const handleResetView = () => {
    setFocusedObjectId(undefined);
    setSelectedObject(null);
  };

  return (
    <div className="relative flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-celestial-void">
      {/* Top Floating Explorer Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-none">
        <div className="pointer-events-auto w-full sm:w-auto">
          <ExplorerSearchBar
            onSelectObject={(obj) => {
              handleSelectObject(obj);
              handleFocusCamera(obj);
            }}
          />
        </div>
      </div>

      {/* Bottom Floating Orbit & Selector Controls */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-center pointer-events-none">
        <div className="pointer-events-auto w-full max-w-4xl p-2 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/85 backdrop-blur-xl shadow-2xl">
          <ExplorerControls
            objects={allObjects}
            selectedObjectId={selectedObject?.id}
            onSelectObject={(obj) => {
              handleSelectObject(obj);
              handleFocusCamera(obj);
            }}
            showOrbits={showOrbits}
            onToggleOrbits={() => setShowOrbits(!showOrbits)}
            onResetView={handleResetView}
            onOpenScaleInfo={() => setIsScaleModalOpen(true)}
          />
        </div>
      </div>

      {/* Main 3D Three.js Interactive Scene Viewport */}
      <div className="flex-1 w-full h-full">
        <SolarSystemScene
          selectedObjectId={selectedObject?.id}
          focusedObjectId={focusedObjectId}
          showOrbits={showOrbits}
          onObjectSelect={handleSelectObject}
          className="w-full h-full"
        />
      </div>

      {/* Floating Scientific Telemetry Data Card */}
      <TelemetryPanel
        object={selectedObject}
        onClose={() => setSelectedObject(null)}
        onFocusCamera={handleFocusCamera}
      />

      {/* Scale Information Modal */}
      <ScaleInfoModal isOpen={isScaleModalOpen} onClose={() => setIsScaleModalOpen(false)} />
    </div>
  );
}
