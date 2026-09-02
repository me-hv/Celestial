"use client";

import React from "react";
import { CelestialSkyScene3D, CelestialSkyScene3DProps } from "./CelestialSkyScene3D";

export type ObserverSkySceneProps = CelestialSkyScene3DProps;

/**
 * ObserverSkyScene — Observer-Centered 3D Celestial Sphere Visualization
 *
 * Renders an interactive Three.js planetarium centered on the ground observer with:
 * - Local ground horizon plane & cardinal compass beacons (N, E, S, W)
 * - Alt/Az coordinate dome rings and Zenith indicator
 * - 3D Celestial Sphere with magnitude-scaled stars, colored by spectral class
 * - Real-time planetary and lunar ephemerides
 * - IAU Constellation stick figures and boundaries
 * - Continuous target tracking mode and selection reticle
 */
export function ObserverSkyScene(props: ObserverSkySceneProps) {
  return <CelestialSkyScene3D {...props} />;
}

export default ObserverSkyScene;
