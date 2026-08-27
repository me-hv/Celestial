import * as THREE from "three";

export interface CameraTarget {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  distance: number;
}

export class CameraController {
  private camera: THREE.PerspectiveCamera;
  private domElement: HTMLElement;

  // Spherical Coordinates for Free Orbit
  private spherical = new THREE.Spherical(120, Math.PI / 3, Math.PI / 4);
  private targetLookAt = new THREE.Vector3(0, 0, 0);
  private currentLookAt = new THREE.Vector3(0, 0, 0);

  // Transition interpolation
  private isTransitioning = false;
  private transitionAlpha = 0;
  private startCameraPos = new THREE.Vector3();
  private targetCameraPos = new THREE.Vector3();
  private startLookAt = new THREE.Vector3();
  private targetFocusLookAt = new THREE.Vector3();

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
    this.isTransitioning = false; // User manual control interrupts transition
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
    this.spherical.radius = Math.max(8, Math.min(600, this.spherical.radius * factor));
    this.isTransitioning = false;
    this.updateCameraPosition();
  };

  public focusOnObject(objectPosition: THREE.Vector3, visualRadius: number, _duration = 1.2): void {
    this.isTransitioning = true;
    this.transitionAlpha = 0;

    this.startCameraPos.copy(this.camera.position);
    this.startLookAt.copy(this.currentLookAt);

    this.targetFocusLookAt.copy(objectPosition);

    // Compute ideal camera offset based on body radius
    const distanceOffset = Math.max(visualRadius * 4.5, 6.0);
    const offsetDir = new THREE.Vector3(1, 0.6, 1).normalize().multiplyScalar(distanceOffset);
    this.targetCameraPos.copy(objectPosition).add(offsetDir);
  }

  public resetView(): void {
    this.isTransitioning = true;
    this.transitionAlpha = 0;
    this.startCameraPos.copy(this.camera.position);
    this.startLookAt.copy(this.currentLookAt);

    this.targetFocusLookAt.set(0, 0, 0);
    this.spherical.set(130, Math.PI / 3, Math.PI / 4);

    const targetPos = new THREE.Vector3().setFromSpherical(this.spherical);
    this.targetCameraPos.copy(targetPos);
  }

  public update(deltaTime: number): void {
    if (this.isTransitioning) {
      // Smooth cubic ease out
      this.transitionAlpha += deltaTime * 1.5;
      const t = Math.min(1.0, this.transitionAlpha);
      const easeT = 1 - Math.pow(1 - t, 3);

      this.camera.position.lerpVectors(this.startCameraPos, this.targetCameraPos, easeT);
      this.currentLookAt.lerpVectors(this.startLookAt, this.targetFocusLookAt, easeT);
      this.camera.lookAt(this.currentLookAt);

      if (t >= 1.0) {
        this.isTransitioning = false;
        // Sync spherical coordinates to final transition state
        const offset = new THREE.Vector3().subVectors(this.camera.position, this.currentLookAt);
        this.spherical.setFromVector3(offset);
        this.targetLookAt.copy(this.currentLookAt);
      }
    }
  }

  private updateCameraPosition(): void {
    const offset = new THREE.Vector3().setFromSpherical(this.spherical);
    this.camera.position.copy(this.currentLookAt).add(offset);
    this.camera.lookAt(this.currentLookAt);
  }
}
