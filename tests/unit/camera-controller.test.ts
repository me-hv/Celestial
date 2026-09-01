import { describe, it, expect, vi, beforeEach } from "vitest";
import * as THREE from "three";
import { CameraController } from "@/features/visualization/scene/camera-controller";

describe("CameraController Physics & Dynamic Target Focus", () => {
  let camera: THREE.PerspectiveCamera;
  let domElement: HTMLDivElement;
  let controller: CameraController;

  beforeEach(() => {
    camera = new THREE.PerspectiveCamera(45, 1.0, 0.1, 1000);
    camera.position.set(0, 50, 100);
    camera.lookAt(0, 0, 0);

    domElement = document.createElement("div");
    // Mock getBoundingClientRect
    domElement.getBoundingClientRect = vi.fn().mockReturnValue({
      left: 0,
      top: 0,
      width: 800,
      height: 600,
    });

    controller = new CameraController(camera, domElement);
  });

  it("calculates calibrated focus distances based on body radius and object type", () => {
    // Moon: compact framing
    const moonDist = controller.calculateFocusDistance(0.35, "MOON");
    expect(moonDist).toBeGreaterThanOrEqual(2.5);
    expect(moonDist).toBeLessThan(10);

    // Terrestrial Planet (Earth/Mars): medium framing
    const earthDist = controller.calculateFocusDistance(0.9, "PLANET");
    expect(earthDist).toBeGreaterThanOrEqual(4.5);
    expect(earthDist).toBeLessThan(15);

    // Gas Giant (Jupiter): wide planetary framing
    const jupiterDist = controller.calculateFocusDistance(3.2, "PLANET");
    expect(jupiterDist).toBeGreaterThanOrEqual(12.0);

    // Star (Sun): distant stellar framing
    const starDist = controller.calculateFocusDistance(6.0, "STAR");
    expect(starDist).toBeGreaterThanOrEqual(25.0);
  });

  it("initiates transition toward target object position", () => {
    const targetPos = new THREE.Vector3(25, 0, -10);
    controller.focusOnObject(targetPos, 0.9, { objectType: "PLANET" });

    // Step transition forward
    controller.update(0.5);

    // Camera lookAt should be interpolating towards target
    const currentTarget = controller.getTargetPosition();
    expect(currentTarget.x).toBeGreaterThan(0);
  });

  it("finalizes lookAt and reaches exact target position upon transition completion", () => {
    const targetPos = new THREE.Vector3(40, 0, 0);
    controller.focusOnObject(targetPos, 1.5, { objectType: "PLANET", duration: 0.5 });

    // Simulate enough time to finish transition
    controller.update(1.0);

    const currentTarget = controller.getTargetPosition();
    expect(currentTarget.x).toBeCloseTo(40, 0.01);
    expect(currentTarget.y).toBeCloseTo(0, 0.01);
    expect(currentTarget.z).toBeCloseTo(0, 0.01);
  });

  it("resets camera target back to origin on resetView", () => {
    const targetPos = new THREE.Vector3(50, 20, -30);
    controller.focusOnObject(targetPos, 1.0);
    controller.update(2.0);

    controller.resetView(100);
    controller.update(2.0);

    const currentTarget = controller.getTargetPosition();
    expect(currentTarget.x).toBeCloseTo(0, 0.01);
    expect(currentTarget.y).toBeCloseTo(0, 0.01);
    expect(currentTarget.z).toBeCloseTo(0, 0.01);
  });

  it("cleans up event listeners on dispose", () => {
    expect(() => controller.dispose()).not.toThrow();
  });
});
