"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CMBLastScatteringSurface } from "@/domain/observable-universe/types";
import { generateProceduralCMBTexture } from "./cosmic-horizon-renderer";

interface CMBSphereSceneProps {
  cmbData: CMBLastScatteringSurface;
  includeGalacticMask?: boolean;
  showDipoleVector?: boolean;
  showEquatorialGrid?: boolean;
  autoRotate?: boolean;
}

export const CMBSphereScene: React.FC<CMBSphereSceneProps> = ({
  cmbData,
  includeGalacticMask = false,
  showDipoleVector = true,
  showEquatorialGrid = true,
  autoRotate = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const sphereMeshRef = useRef<THREE.Mesh | null>(null);
  const dipoleLineRef = useRef<THREE.Line | null>(null);
  const gridGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x02040a);
    sceneRef.current = scene;

    // 2. Camera (Inside-Looking or Outside-Looking: default outside-looking orbital sphere)
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 30, 160);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 60;
    controls.maxDistance = 300;
    controlsRef.current = controls;

    // 5. CMB Sphere Mesh
    const sphereGeo = new THREE.SphereGeometry(50, 64, 48);
    const texture = generateProceduralCMBTexture(includeGalacticMask, 1024, 512);
    const sphereMat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    sphereMeshRef.current = sphereMesh;
    scene.add(sphereMesh);

    // 6. Dipole Vector (+369 km/s towards Crater/Leo: RA 168°, Dec -7°)
    const dipoleDir = new THREE.Vector3(
      Math.cos((-7 * Math.PI) / 180) * Math.cos((168 * Math.PI) / 180),
      Math.sin((-7 * Math.PI) / 180),
      -Math.cos((-7 * Math.PI) / 180) * Math.sin((168 * Math.PI) / 180)
    ).normalize();

    const dipoleGeo = new THREE.BufferGeometry().setFromPoints([
      dipoleDir.clone().multiplyScalar(-58),
      dipoleDir.clone().multiplyScalar(58),
    ]);
    const dipoleMat = new THREE.LineDashedMaterial({
      color: 0xf59e0b,
      dashSize: 2,
      gapSize: 1.5,
      transparent: true,
      opacity: 0.8,
    });
    const dipoleLine = new THREE.Line(dipoleGeo, dipoleMat);
    dipoleLine.computeLineDistances();
    dipoleLineRef.current = dipoleLine;
    scene.add(dipoleLine);

    // 7. Celestial Equatorial & Galactic Reference Grid
    const gridGroup = new THREE.Group();
    gridGroupRef.current = gridGroup;

    // Equator ring
    const eqCurve = new THREE.EllipseCurve(0, 0, 50.2, 50.2, 0, 2 * Math.PI, false, 0);
    const eqPoints = eqCurve.getPoints(96);
    const eqGeo = new THREE.BufferGeometry().setFromPoints(
      eqPoints.map((p) => new THREE.Vector3(p.x, 0, p.y))
    );
    const eqMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.4,
    });
    gridGroup.add(new THREE.LineLoop(eqGeo, eqMat));

    // Prime meridian
    const merGeo = new THREE.BufferGeometry().setFromPoints(
      eqPoints.map((p) => new THREE.Vector3(p.x, p.y, 0))
    );
    const merMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25,
    });
    gridGroup.add(new THREE.LineLoop(merGeo, merMat));
    scene.add(gridGroup);

    // 8. Animation Loop
    let time = 0;
    const animate = () => {
      time += 0.003;
      controls.update();

      if (autoRotate && sphereMesh) {
        sphereMesh.rotation.y = time * 0.2;
        if (dipoleLine) dipoleLine.rotation.y = time * 0.2;
        if (gridGroup) gridGroup.rotation.y = time * 0.2;
      }

      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };
    animate();

    // 9. Resize Listener
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [cmbData, includeGalacticMask, autoRotate]);

  // Update Dynamic Visibility
  useEffect(() => {
    if (dipoleLineRef.current) dipoleLineRef.current.visible = showDipoleVector;
    if (gridGroupRef.current) gridGroupRef.current.visible = showEquatorialGrid;
  }, [showDipoleVector, showEquatorialGrid]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[500px] bg-slate-950 overflow-hidden select-none"
      data-testid="cmb-sphere-scene-container"
    >
      {/* Viewport UI Watermark */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-slate-200 font-mono font-bold tracking-wide">
            CMB LAST-SCATTERING SPHERE (z ≈ 1089)
          </span>
        </div>
        <span className="text-[11px] text-orange-400 font-mono px-1 font-semibold">
          Surface of Photon Decoupling • Cosmic Age: ~379,000 Years • T_0 = 2.7255 K
        </span>
      </div>

      {/* Scientific Honesty Notice */}
      <div className="absolute bottom-4 right-4 z-10 max-w-xs px-3 py-2 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-400 backdrop-blur-md">
        <span className="text-cyan-400 font-bold">Scientific Note:</span> Illustrative
        multi-frequency temperature anisotropy representation (Delta T / T ~ 10^-5) calibrated
        against Planck 2018 PR3 multipoles.
      </div>
    </div>
  );
};
