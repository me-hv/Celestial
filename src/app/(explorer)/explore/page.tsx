"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { StellarSystemScene } from "@/features/visualization/scene/StellarSystemScene";
import { TelemetryPanel } from "@/features/exploration/components/TelemetryPanel";
import { ExplorerControls } from "@/features/exploration/components/ExplorerControls";
import { ExplorerSearchBar } from "@/features/exploration/components/ExplorerSearchBar";
import { SystemSelector } from "@/features/exploration/components/SystemSelector";
import { ScaleInfoModal } from "@/features/exploration/components/ScaleInfoModal";
import { stellarSystemRepo } from "@/lib/data/stellar-system-repository";
import { CelestialObject } from "@/domain/celestial-object/types";
import { StellarSystem } from "@/domain/stellar-system/types";

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialSystemSlug = searchParams.get("system") || "solar-system";

  const [currentSystem, setCurrentSystem] = useState<StellarSystem>(() => {
    return stellarSystemRepo.getBySlug(initialSystemSlug) || stellarSystemRepo.getAll()[0];
  });

  const [systemObjects, setSystemObjects] = useState<CelestialObject[]>(() => {
    return stellarSystemRepo.getAllObjectsForSystem(currentSystem.id);
  });

  const [selectedObject, setSelectedObject] = useState<CelestialObject | null>(() => {
    const planets = stellarSystemRepo.getPlanets(currentSystem.id);
    return planets[0] || systemObjects[0] || null;
  });

  const [focusedObjectId, setFocusedObjectId] = useState<string | undefined>(undefined);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showHabitableZone, setShowHabitableZone] = useState(false);
  const [isScaleModalOpen, setIsScaleModalOpen] = useState(false);

  // Sync URL search params change
  useEffect(() => {
    const systemParam = searchParams.get("system");
    if (systemParam && systemParam !== currentSystem.slug) {
      const targetSystem = stellarSystemRepo.getBySlug(systemParam);
      if (targetSystem) {
        handleSystemChange(targetSystem);
      }
    }
  }, [searchParams]);

  const handleSystemChange = (system: StellarSystem) => {
    setCurrentSystem(system);
    const objects = stellarSystemRepo.getAllObjectsForSystem(system.id);
    setSystemObjects(objects);
    const planets = stellarSystemRepo.getPlanets(system.id);
    const firstBody = planets[0] || objects[0] || null;
    setSelectedObject(firstBody);
    setFocusedObjectId(undefined);
  };

  const handleSelectObject = (object: CelestialObject) => {
    // If selected object belongs to another system, switch system
    if (
      object.hostSystemId &&
      object.hostSystemId !== currentSystem.id &&
      object.hostSystemId !== currentSystem.slug
    ) {
      const parentSys =
        stellarSystemRepo.getById(object.hostSystemId) ||
        stellarSystemRepo.getBySlug(object.hostSystemId);
      if (parentSys) {
        handleSystemChange(parentSys);
      }
    }
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
      {/* Top Floating Explorer Controls: Search + System Selector */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-none">
        <div className="pointer-events-auto w-full sm:w-auto">
          <ExplorerSearchBar
            onSelectObject={(obj) => {
              handleSelectObject(obj);
              handleFocusCamera(obj);
            }}
          />
        </div>

        <div className="pointer-events-auto">
          <SystemSelector
            currentSystemSlug={currentSystem.slug}
            onSelectSystem={handleSystemChange}
          />
        </div>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-center pointer-events-none">
        <div className="pointer-events-auto w-full max-w-5xl p-2 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/85 backdrop-blur-xl shadow-2xl">
          <ExplorerControls
            objects={systemObjects}
            selectedObjectId={selectedObject?.id}
            onSelectObject={(obj) => {
              handleSelectObject(obj);
              handleFocusCamera(obj);
            }}
            showOrbits={showOrbits}
            onToggleOrbits={() => setShowOrbits(!showOrbits)}
            showHabitableZone={showHabitableZone}
            onToggleHabitableZone={() => setShowHabitableZone(!showHabitableZone)}
            hasHabitableZone={!!currentSystem.habitableZone}
            onResetView={handleResetView}
            onOpenScaleInfo={() => setIsScaleModalOpen(true)}
          />
        </div>
      </div>

      {/* Main 3D Three.js Interactive Scene Viewport */}
      <div className="flex-1 w-full h-full">
        <StellarSystemScene
          key={currentSystem.slug}
          systemSlug={currentSystem.slug}
          selectedObjectId={selectedObject?.id}
          focusedObjectId={focusedObjectId}
          showOrbits={showOrbits}
          showHabitableZone={showHabitableZone}
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

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="flex-1 bg-celestial-void" />}>
      <ExploreContent />
    </Suspense>
  );
}
