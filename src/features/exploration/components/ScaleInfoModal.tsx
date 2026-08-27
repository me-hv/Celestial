"use client";

import React from "react";
import { X, Scale, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ScaleInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScaleInfoModal({ isOpen, onClose }: ScaleInfoModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-celestial-void/80 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-celestial-muted bg-celestial-surface/95 p-6 shadow-2xl space-y-4 text-celestial-starlight">
        <div className="flex items-center justify-between border-b border-celestial-muted/70 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-celestial-cyan" />
            <h3 className="text-lg font-bold font-mono">Visualization Scale Protocol</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close scale info modal"
            className="p-1 rounded-lg text-celestial-subtle hover:text-celestial-starlight hover:bg-celestial-muted"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-celestial-subtle leading-relaxed">
          <p>
            In reality, the Solar System is predominantly empty space. If the Sun were scaled to the
            size of a basketball (30 cm), Earth would be a 2.7 mm grain 32 meters away, and Neptune
            would be 1 kilometer away.
          </p>

          <div className="p-3 rounded-lg border border-celestial-amber/30 bg-celestial-amber/5 space-y-1 text-celestial-starlight">
            <div className="flex items-center gap-1.5 text-celestial-amber font-mono font-semibold">
              <ShieldAlert className="w-4 h-4" />
              <span>Dual-Scale Paradigm</span>
            </div>
            <p className="text-[11px] text-celestial-subtle">
              1. <strong>Physical Scale (Telemetry Panel)</strong>: True SI/IAU measurements from
              NASA JPL SSD (exact masses, radii, Keplerian periods, surface gravities).
            </p>
            <p className="text-[11px] text-celestial-subtle">
              2. <strong>Visual Scale (3D Canvas)</strong>: Calibrated non-linear distance curve
              (d_visual = d_AU^0.72 × 32) with logarithmic mesh radius scaling to ensure all bodies
              remain interactive.
            </p>
          </div>

          <div className="flex items-center gap-2 text-celestial-cyan text-xs font-mono">
            <CheckCircle2 className="w-4 h-4" />
            <span>Orbital eccentricities and relative alignments are preserved.</span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Understood
          </Button>
        </div>
      </div>
    </div>
  );
}
