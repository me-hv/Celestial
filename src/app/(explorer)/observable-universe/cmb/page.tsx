"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Radio, ArrowLeft, Info } from "lucide-react";
import { Container } from "@/components/ui/container";
import { observableUniverseRepo } from "@/lib/data/observable-universe-repository";
import { CMBSphereScene } from "@/features/visualization/cosmic-horizon/CMBSphereScene";
import { CMBTelemetryPanel } from "@/features/observable-universe/components/CMBTelemetryPanel";

export default function CMBExplorerPage() {
  const cmb = observableUniverseRepo.getCMB();

  const [includeGalacticMask, setIncludeGalacticMask] = useState<boolean>(false);
  const [showDipoleVector, setShowDipoleVector] = useState<boolean>(true);
  const [showEquatorialGrid, setShowEquatorialGrid] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 font-sans">
      {/* Header Bar */}
      <section className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <Container
          size="xl"
          className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-orange-400 font-bold uppercase tracking-wider mb-1">
              <Radio className="w-3.5 h-3.5" />
              <span>Cosmic Microwave Background • Surface of Last Scattering</span>
            </div>
            <h1 className="text-xl md:text-2xl font-mono font-bold tracking-tight text-white flex items-center gap-2.5">
              CMB Explorer &amp; Primordial Decoupling
            </h1>
            <p className="text-xs md:text-sm text-slate-400 font-mono mt-0.5">
              z ≈ 1089.0 • Cosmic Age ≈ 379,000 Years • Temperature T_0 = 2.7255 K (Fixsen 2009)
            </p>
          </div>

          <Link
            href="/observable-universe"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-800 text-xs font-mono transition-colors self-start md:self-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Observable Universe</span>
          </Link>
        </Container>
      </section>

      {/* Main Content Workspace */}
      <Container size="xl" className="py-6 flex flex-col gap-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 3D CMB Sphere Viewport (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Toggles Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs text-slate-300 backdrop-blur-md">
              <span className="font-bold text-slate-200">CMB Layers &amp; Overlays:</span>

              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeGalacticMask}
                    onChange={(e) => setIncludeGalacticMask(e.target.checked)}
                    className="rounded border-slate-700 text-orange-500 focus:ring-0"
                  />
                  <span>Galactic Plane Mask</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showDipoleVector}
                    onChange={(e) => setShowDipoleVector(e.target.checked)}
                    className="rounded border-slate-700 text-amber-500 focus:ring-0"
                  />
                  <span>Dipole Vector (369 km/s)</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showEquatorialGrid}
                    onChange={(e) => setShowEquatorialGrid(e.target.checked)}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span>Celestial Grid</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRotate}
                    onChange={(e) => setAutoRotate(e.target.checked)}
                    className="rounded border-slate-700 text-purple-500 focus:ring-0"
                  />
                  <span>Rotation</span>
                </label>
              </div>
            </div>

            {/* 3D Sphere Container */}
            <div className="relative w-full h-[520px] rounded-xl border border-slate-800 overflow-hidden shadow-2xl bg-slate-950">
              <CMBSphereScene
                cmbData={cmb}
                includeGalacticMask={includeGalacticMask}
                showDipoleVector={showDipoleVector}
                showEquatorialGrid={showEquatorialGrid}
                autoRotate={autoRotate}
              />
            </div>

            {/* Educational Deep Dive */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed flex flex-col gap-2">
              <div className="flex items-center gap-2 text-cyan-300 font-bold">
                <Info className="w-4 h-4" />
                <span>Physical Meaning of the Last-Scattering Surface</span>
              </div>
              <p>{cmb.physicalProcesses}</p>
              <p className="text-slate-400 text-[11px]">
                The observed dipole anisotropy is caused by the kinematic Doppler shift of our Solar
                System moving at 369 km/s relative to the CMB rest frame toward Galactic coordinates
                l = 264.0°, b = +48.2°.
              </p>
            </div>
          </div>

          {/* Telemetry & Missions Dossier (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <CMBTelemetryPanel cmb={cmb} />
          </div>
        </div>
      </Container>
    </div>
  );
}
