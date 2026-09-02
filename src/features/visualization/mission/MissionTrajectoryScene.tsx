"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Radio,
  Crosshair,
  Gauge,
} from "lucide-react";
import { MissionTrajectory, SpaceMission, TrajectoryWaypoint } from "@/domain/mission/types";
import {
  TrajectoryMath,
  TrajectoryInterpolationResult,
} from "@/lib/astronomy/mission/trajectory-math";
import { CameraController } from "../scene/camera-controller";
import { createStarfield } from "../scene/starfield-factory";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface MissionTrajectorySceneProps {
  mission: SpaceMission;
  trajectory: MissionTrajectory;
  className?: string;
  onWaypointSelect?: (waypoint: TrajectoryWaypoint) => void;
}

export function MissionTrajectoryScene({
  mission,
  trajectory,
  className = "",
  onWaypointSelect,
}: MissionTrajectorySceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraControllerRef = useRef<CameraController | null>(null);

  const [progress, setProgress] = useState(0.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 5 | 20>(5);
  const [followSpacecraft, setFollowSpacecraft] = useState(false);

  const [telemetry, setTelemetry] = useState<TrajectoryInterpolationResult>(() =>
    TrajectoryMath.interpolateProgress(trajectory, 0.0)
  );

  const spacecraftMeshRef = useRef<THREE.Group | null>(null);
  const splinePointsRef = useRef<THREE.Vector3[]>([]);

  const handleProgressChange = useCallback(
    (newProgress: number) => {
      const clamped = Math.max(0, Math.min(1, newProgress));
      setProgress(clamped);
      const res = TrajectoryMath.interpolateProgress(trajectory, clamped);
      setTelemetry(res);

      if (spacecraftMeshRef.current) {
        spacecraftMeshRef.current.position.copy(res.position);
      }

      if (followSpacecraft && cameraControllerRef.current) {
        cameraControllerRef.current.focusOnObject(res.position, 8);
      }

      if (onWaypointSelect && res.currentWaypoint) {
        onWaypointSelect(res.currentWaypoint);
      }
    },
    [trajectory, followSpacecraft, onWaypointSelect]
  );

  const handlePrevMilestone = () => {
    const totalWaypoints = trajectory.waypoints.length;
    if (totalWaypoints <= 1) return;
    const currentWpIdx = telemetry.currentWaypointIndex;
    const targetIdx = Math.max(0, currentWpIdx - 1);
    const targetT = targetIdx / (totalWaypoints - 1);
    handleProgressChange(targetT);
  };

  const handleNextMilestone = () => {
    const totalWaypoints = trajectory.waypoints.length;
    if (totalWaypoints <= 1) return;
    const currentWpIdx = telemetry.currentWaypointIndex;
    const targetIdx = Math.min(totalWaypoints - 1, currentWpIdx + 1);
    const targetT = targetIdx / (totalWaypoints - 1);
    handleProgressChange(targetT);
  };

  const handleResetCamera = () => {
    if (cameraControllerRef.current) {
      cameraControllerRef.current.resetView();
    }
  };

  useEffect(() => {
    if (!isPlaying) return;

    let animFrame: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      setProgress((prev) => {
        const rate = 0.02 * playbackSpeed * dt;
        const next = prev + rate;
        if (next >= 1.0) {
          setIsPlaying(false);
          return 1.0;
        }
        return next;
      });

      animFrame = requestAnimationFrame(loop);
    };

    animFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrame);
  }, [isPlaying, playbackSpeed]);

  useEffect(() => {
    const res = TrajectoryMath.interpolateProgress(trajectory, progress);
    setTelemetry(res);

    if (spacecraftMeshRef.current) {
      spacecraftMeshRef.current.position.copy(res.position);
    }

    if (followSpacecraft && cameraControllerRef.current) {
      cameraControllerRef.current.focusOnObject(res.position, 8);
    }
  }, [progress, trajectory, followSpacecraft]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#030712");

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 4000);
    camera.position.set(0, 120, 220);
    camera.lookAt(0, 0, 0);

    const cameraController = new CameraController(camera, container);
    cameraControllerRef.current = cameraController;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);
    } catch {
      return () => {
        cameraController.dispose();
      };
    }

    const ambient = new THREE.AmbientLight("#475569", 0.6);
    scene.add(ambient);

    const sunLight = new THREE.PointLight("#FFF8E7", 2.5, 3000, 0.1);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    const starfield = createStarfield();
    scene.add(starfield);

    const sunGeo = new THREE.SphereGeometry(3.5, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: "#FDB813" });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sunMesh);

    const coronaGeo = new THREE.SphereGeometry(4.8, 24, 24);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: "#FF8C00",
      transparent: true,
      opacity: 0.25,
      side: THREE.BackSide,
    });
    scene.add(new THREE.Mesh(coronaGeo, coronaMat));

    const orbitRadii = [
      { name: "Mercury", r: 0.387 * 10, color: "#9ca3af" },
      { name: "Venus", r: 0.723 * 10, color: "#fbbf24" },
      { name: "Earth", r: 1.0 * 10, color: "#38bdf8" },
      { name: "Mars", r: 1.524 * 10, color: "#f87171" },
      { name: "Jupiter", r: 5.204 * 10, color: "#fb923c" },
      { name: "Saturn", r: 9.582 * 10, color: "#e2d4a8" },
      { name: "Uranus", r: 19.2 * 10, color: "#22d3ee" },
      { name: "Neptune", r: 30.05 * 10, color: "#60a5fa" },
      { name: "Pluto", r: 39.48 * 10, color: "#cbd5e1" },
    ];

    orbitRadii.forEach((orb) => {
      const circleGeo = new THREE.BufferGeometry();
      const pts: THREE.Vector3[] = [];
      const segs = 128;
      for (let i = 0; i <= segs; i++) {
        const theta = (i / segs) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(theta) * orb.r, 0, Math.sin(theta) * orb.r));
      }
      circleGeo.setFromPoints(pts);
      const circleMat = new THREE.LineBasicMaterial({
        color: orb.color,
        transparent: true,
        opacity: 0.12,
      });
      scene.add(new THREE.LineLoop(circleGeo, circleMat));
    });

    const splineCurve = TrajectoryMath.createSplineCurve(trajectory.waypoints, 10.0);
    const splinePoints = splineCurve.getPoints(300);
    splinePointsRef.current = splinePoints;

    const fullLineGeo = new THREE.BufferGeometry().setFromPoints(splinePoints);
    const fullLineMat = new THREE.LineBasicMaterial({
      color: "#06b6d4",
      transparent: true,
      opacity: 0.75,
      linewidth: 2,
    });
    const fullLine = new THREE.Line(fullLineGeo, fullLineMat);
    scene.add(fullLine);

    const markerGeo = new THREE.SphereGeometry(1.0, 16, 16);
    trajectory.waypoints.forEach((wp) => {
      const isEncounter = !!wp.targetEncounter;
      const isMilestone = wp.isKeyMilestone;

      const markerMat = new THREE.MeshBasicMaterial({
        color: isEncounter ? "#F43F5E" : isMilestone ? "#F59E0B" : "#06B6D4",
      });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.set(
        wp.positionAu[0] * 10.0,
        wp.positionAu[2] * 10.0,
        wp.positionAu[1] * 10.0
      );
      marker.scale.setScalar(isEncounter ? 1.6 : isMilestone ? 1.2 : 0.7);
      scene.add(marker);
    });

    const scGroup = new THREE.Group();
    const probeGeo = new THREE.SphereGeometry(1.6, 24, 24);
    const probeMat = new THREE.MeshBasicMaterial({ color: "#22D3EE" });
    const probeMesh = new THREE.Mesh(probeGeo, probeMat);
    scGroup.add(probeMesh);

    const haloGeo = new THREE.SphereGeometry(2.8, 16, 16);
    const haloMat = new THREE.MeshBasicMaterial({
      color: "#06B6D4",
      transparent: true,
      opacity: 0.35,
      wireframe: true,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    scGroup.add(haloMesh);

    const initTelemetry = TrajectoryMath.interpolateProgress(trajectory, progress);
    scGroup.position.copy(initTelemetry.position);
    scene.add(scGroup);
    spacecraftMeshRef.current = scGroup;

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    let animId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      sunMesh.rotation.y += 0.05 * dt;
      haloMesh.rotation.y += 0.8 * dt;
      haloMesh.rotation.x += 0.4 * dt;

      cameraController.update(dt);

      if (renderer) {
        renderer.render(scene, camera);
      }
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      cameraController.dispose();
      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer?.dispose();
    };
  }, [trajectory]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[500px] overflow-hidden rounded-2xl bg-celestial-void select-none ${className}`}
      role="region"
      aria-label="3D Interactive Mission Trajectory Viewport"
    >
      {/* Top Floating Telemetry & Provenance Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-celestial-surface/85 backdrop-blur-xl border border-celestial-muted/80 p-2.5 rounded-xl shadow-lg">
          <Radio className="w-4 h-4 text-celestial-cyan animate-pulse" />
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-celestial-starlight uppercase">
                {mission.name}
              </span>
              <Badge variant="cyan" className="text-[10px] py-0 px-1.5 uppercase font-mono">
                {trajectory.accuracy.replace(/_/g, " ")}
              </Badge>
            </div>
            <div className="text-[11px] font-mono text-celestial-subtle">
              Date:{" "}
              <span className="text-celestial-cyan">
                {telemetry.currentWaypoint.timestamp.slice(0, 10)}
              </span>
              {telemetry.currentWaypoint.eventDescription && (
                <span className="text-celestial-amber ml-2 font-medium">
                  • {telemetry.currentWaypoint.eventDescription}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-3 bg-celestial-surface/85 backdrop-blur-xl border border-celestial-muted/80 px-3 py-2 rounded-xl text-xs font-mono shadow-lg">
          <div className="flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-celestial-cyan" />
            <span className="text-celestial-subtle">Heliocentric:</span>
            <span className="text-celestial-starlight font-bold">
              {telemetry.currentDistanceAu.toFixed(2)} AU
            </span>
          </div>
          {telemetry.currentSpeedKmS !== undefined && (
            <div className="flex items-center gap-1.5 border-l border-celestial-muted/80 pl-3">
              <span className="text-celestial-subtle">Speed:</span>
              <span className="text-celestial-emerald font-bold">
                {telemetry.currentSpeedKmS.toFixed(1)} km/s
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Floating Interactive Mission Playback Controller */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-center pointer-events-none">
        <div className="pointer-events-auto w-full max-w-4xl p-3 rounded-2xl border border-celestial-muted/80 bg-celestial-surface/90 backdrop-blur-xl shadow-2xl space-y-2.5">
          {/* Progress Slider and Milestone Markers */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-celestial-subtle">
              <span>{trajectory.waypoints[0]?.timestamp.slice(0, 10)} (Launch)</span>
              <span className="text-celestial-cyan font-bold">
                {Math.round(progress * 100)}% REPLAY
              </span>
              <span>
                {trajectory.waypoints[trajectory.waypoints.length - 1]?.timestamp.slice(0, 10)}
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="1"
              step="0.001"
              value={progress}
              onChange={(e) => handleProgressChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-celestial-muted rounded-lg appearance-none cursor-pointer accent-celestial-cyan"
              aria-label="Mission Trajectory Timeline Scrubber"
            />
          </div>

          {/* Action Buttons: Play/Pause, Step, Speed, Follow, Reset */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="font-mono text-xs gap-1.5 border-celestial-cyan/40 text-celestial-cyan hover:bg-celestial-cyan/15"
                title={isPlaying ? "Pause Replay" : "Play Trajectory Replay"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? "PAUSE" : "PLAY"}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevMilestone}
                className="font-mono text-xs px-2 text-celestial-subtle hover:text-celestial-starlight"
                title="Previous Milestone Event"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextMilestone}
                className="font-mono text-xs px-2 text-celestial-subtle hover:text-celestial-starlight"
                title="Next Milestone Event"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </Button>

              <div className="flex items-center border border-celestial-muted/80 rounded-lg overflow-hidden ml-1">
                {([1, 5, 20] as const).map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2 py-0.5 text-[11px] font-mono transition ${
                      playbackSpeed === spd
                        ? "bg-celestial-cyan text-celestial-void font-bold"
                        : "bg-celestial-surface text-celestial-subtle hover:text-celestial-starlight"
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={followSpacecraft ? "cyan" : "outline"}
                size="sm"
                onClick={() => setFollowSpacecraft(!followSpacecraft)}
                className="font-mono text-xs gap-1.5"
                title="Follow spacecraft with 3D camera"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>{followSpacecraft ? "TRACKING PROBE" : "FOLLOW"}</span>
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleResetCamera}
                className="font-mono text-xs gap-1"
                title="Reset Camera Overview"
              >
                <RotateCcw className="w-3 h-3" />
                <span>RESET</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
