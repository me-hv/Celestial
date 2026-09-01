import * as THREE from "three";

export interface CameraFocusOptions {
  visualRadius?: number;
  objectType?: "STAR" | "PLANET" | "MOON" | "GALAXY" | "OTHER";
  duration?: number;
  offsetDirection?: THREE.Vector3;
}

export class CameraController {
  private camera: THREE.PerspectiveCamera;
  private domElement: HTMLElement;

  // Spherical Coordinates for Orbiting relative to current target
  private spherical = new THREE.Spherical(120, Math.PI / 3, Math.PI / 4);
  private currentLookAt = new THREE.Vector3(0, 0, 0);
  private targetFocusLookAt = new THREE.Vector3(0, 0, 0);

  // Transition interpolation state
  private isTransitioning = false;
  private transitionAlpha = 0;
  private transitionSpeed = 1.6;
  private startCameraPos = new THREE.Vector3();
  private targetCameraPos = new THREE.Vector3();
  private startLookAt = new THREE.Vector3();

  // Pointer Interaction state
  private isDragging = false;
  private previousMousePosition = { x: 0, y: 0 };

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.updateCameraPosition();
    this.bindEvents();
  }

  private bindEvents(): void {
    this.domElement.addEventListener("pointerdown", this.onPointerDown);
    window.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerup", this.onPointerUp);
    this.domElement.addEventListener("wheel", this.onWheel, { passive: false });
  }

  public dispose(): void {
    this.domElement.removeEventListener("pointerdown", this.onPointerDown);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerup", this.onPointerUp);
    this.domElement.removeEventListener("wheel", this.onWheel);
  }

  private onPointerDown = (e: PointerEvent): void => {
    if (e.button !== 0) return; // Left mouse button only
    this.isDragging = true;
    // When user takes manual control during transition, finalize lookAt immediately
    if (this.isTransitioning) {
      this.isTransitioning = false;
      this.currentLookAt.copy(this.targetFocusLookAt);
      const offset = new THREE.Vector3().subVectors(this.camera.position, this.currentLookAt);
      this.spherical.setFromVector3(offset);
    }
    this.previousMousePosition = { x: e.clientX, y: e.clientY };
  };

  private onPointerMove = (e: PointerEvent): void => {
    if (!this.isDragging) return;

    const deltaX = e.clientX - this.previousMousePosition.x;
    const deltaY = e.clientY - this.previousMousePosition.y;
    this.previousMousePosition = { x: e.clientX, y: e.clientY };

    const rotateSpeed = 0.005;
    this.spherical.theta -= deltaX * rotateSpeed;
    this.spherical.phi -= deltaY * rotateSpeed;

    // Constrain phi to avoid camera flip at poles
    this.spherical.phi = Math.max(0.05, Math.min(Math.PI - 0.05, this.spherical.phi));
    this.updateCameraPosition();
  };

  private onPointerUp = (): void => {
    this.isDragging = false;
  };

  private onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    const zoomSpeed = 0.0015;
    const factor = 1 + e.deltaY * zoomSpeed;

    if (this.isTransitioning) {
      this.isTransitioning = false;
      this.currentLookAt.copy(this.targetFocusLookAt);
      const offset = new THREE.Vector3().subVectors(this.camera.position, this.currentLookAt);
      this.spherical.setFromVector3(offset);
    }

    this.spherical.radius = Math.max(1.5, Math.min(700, this.spherical.radius * factor));
    this.updateCameraPosition();
  };

  /**
   * Calculates optimal viewing distance calibrated to body size and type
   */
  public calculateFocusDistance(
    visualRadius: number,
    objectType?: "STAR" | "PLANET" | "MOON" | "GALAXY" | "OTHER"
  ): number {
    switch (objectType) {
      case "MOON":
        return Math.max(visualRadius * 4.0, 2.5);
      case "STAR":
        return Math.max(visualRadius * 4.5, 25.0);
      case "GALAXY":
        return Math.max(visualRadius * 3.5, 40.0);
      case "PLANET":
      default:
        if (visualRadius > 2.0) {
          // Gas giant (Jupiter/Saturn)
          return Math.max(visualRadius * 3.8, 12.0);
        }
        // Terrestrial planet (Earth/Mars/Venus/Mercury)
        return Math.max(visualRadius * 4.5, 4.5);
    }
  }

  /**
   * Smoothly focuses the camera and orbit center onto a target object position
   */
  public focusOnObject(
    objectPosition: THREE.Vector3,
    visualRadius = 1.0,
    options: CameraFocusOptions = {}
  ): void {
    const focusDistance = this.calculateFocusDistance(visualRadius, options.objectType || "PLANET");

    this.isTransitioning = true;
    this.transitionAlpha = 0;
    this.transitionSpeed = options.duration ? 1.0 / options.duration : 1.6;

    this.startCameraPos.copy(this.camera.position);
    this.startLookAt.copy(this.currentLookAt);

    this.targetFocusLookAt.copy(objectPosition);

    // Compute camera target position maintaining an elevated perspective
    const dir = options.offsetDirection || new THREE.Vector3(1, 0.55, 1).normalize();
    const offsetVector = dir.clone().multiplyScalar(focusDistance);
    this.targetCameraPos.copy(objectPosition).add(offsetVector);

    // Prepare spherical coordinates for subsequent orbit & zoom around target
    this.spherical.setFromVector3(offsetVector);
  }

  /**
   * Smoothly resets the camera back to system origin overview
   */
  public resetView(overviewDistance = 120): void {
    this.isTransitioning = true;
    this.transitionAlpha = 0;
    this.transitionSpeed = 1.5;

    this.startCameraPos.copy(this.camera.position);
    this.startLookAt.copy(this.currentLookAt);

    this.targetFocusLookAt.set(0, 0, 0);
    this.spherical.set(overviewDistance, Math.PI / 3, Math.PI / 4);

    const targetPos = new THREE.Vector3().setFromSpherical(this.spherical);
    this.targetCameraPos.copy(targetPos);
  }

  public update(deltaTime: number): void {
    if (this.isTransitioning) {
      // Smooth cubic ease out
      this.transitionAlpha += deltaTime * this.transitionSpeed;
      const t = Math.min(1.0, this.transitionAlpha);
      const easeT = 1 - Math.pow(1 - t, 3);

      this.camera.position.lerpVectors(this.startCameraPos, this.targetCameraPos, easeT);
      this.currentLookAt.lerpVectors(this.startLookAt, this.targetFocusLookAt, easeT);
      this.camera.lookAt(this.currentLookAt);

      if (t >= 1.0) {
        this.isTransitioning = false;
        this.currentLookAt.copy(this.targetFocusLookAt);
        const offset = new THREE.Vector3().subVectors(this.camera.position, this.currentLookAt);
        this.spherical.setFromVector3(offset);
      }
    }
  }

  public getTargetPosition(): THREE.Vector3 {
    return this.currentLookAt.clone();
  }

  private updateCameraPosition(): void {
    const offset = new THREE.Vector3().setFromSpherical(this.spherical);
    this.camera.position.copy(this.currentLookAt).add(offset);
    this.camera.lookAt(this.currentLookAt);
  }
}
