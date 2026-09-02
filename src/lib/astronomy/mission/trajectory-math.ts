import * as THREE from "three";
import { TrajectoryWaypoint, MissionTrajectory } from "@/domain/mission/types";

export interface TrajectoryInterpolationResult {
  position: THREE.Vector3;
  currentWaypointIndex: number;
  currentWaypoint: TrajectoryWaypoint;
  nextWaypoint?: TrajectoryWaypoint;
  segmentProgress: number; // 0.0 to 1.0 within the current segment
  currentDistanceAu: number;
  currentSpeedKmS?: number;
}

export class TrajectoryMath {
  /**
   * Generates a smooth 3D Catmull-Rom spline curve from an array of waypoints.
   * Scales heliocentric AU coordinates into 3D scene visual units.
   */
  public static createSplineCurve(
    waypoints: TrajectoryWaypoint[],
    scaleFactor = 10.0
  ): THREE.CatmullRomCurve3 {
    const points = waypoints.map(
      (wp) =>
        new THREE.Vector3(
          wp.positionAu[0] * scaleFactor,
          wp.positionAu[2] * scaleFactor, // map z to Y for 3D altitude/inclination
          wp.positionAu[1] * scaleFactor // map y to Z in Three.js horizontal plane
        )
    );

    return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.3);
  }

  /**
   * Interpolates the spacecraft state along the trajectory at progress t in [0, 1].
   */
  public static interpolateProgress(
    trajectory: MissionTrajectory,
    progress: number,
    scaleFactor = 10.0
  ): TrajectoryInterpolationResult {
    const waypoints = trajectory.waypoints;
    const clampedT = Math.max(0, Math.min(1, progress));

    if (waypoints.length === 0) {
      return {
        position: new THREE.Vector3(0, 0, 0),
        currentWaypointIndex: 0,
        currentWaypoint: {
          timestamp: new Date().toISOString(),
          positionAu: [0, 0, 0],
        },
        segmentProgress: 0,
        currentDistanceAu: 0,
      };
    }

    if (waypoints.length === 1) {
      const wp = waypoints[0];
      return {
        position: new THREE.Vector3(
          wp.positionAu[0] * scaleFactor,
          wp.positionAu[2] * scaleFactor,
          wp.positionAu[1] * scaleFactor
        ),
        currentWaypointIndex: 0,
        currentWaypoint: wp,
        segmentProgress: 0,
        currentDistanceAu: Math.sqrt(
          wp.positionAu[0] ** 2 + wp.positionAu[1] ** 2 + wp.positionAu[2] ** 2
        ),
        currentSpeedKmS: wp.velocityKmS,
      };
    }

    const totalSegments = waypoints.length - 1;
    const exactSegment = clampedT * totalSegments;
    const currentIndex = Math.min(Math.floor(exactSegment), totalSegments - 1);
    const segmentProgress = exactSegment - currentIndex;

    const currentWp = waypoints[currentIndex];
    const nextWp = waypoints[currentIndex + 1];

    // Linear/smooth interpolation between current and next waypoint position
    const p1 = new THREE.Vector3(
      currentWp.positionAu[0],
      currentWp.positionAu[2],
      currentWp.positionAu[1]
    );
    const p2 = new THREE.Vector3(nextWp.positionAu[0], nextWp.positionAu[2], nextWp.positionAu[1]);

    const interpolatedPosAu = new THREE.Vector3().lerpVectors(p1, p2, segmentProgress);
    const visualPos = new THREE.Vector3(
      interpolatedPosAu.x * scaleFactor,
      interpolatedPosAu.y * scaleFactor,
      interpolatedPosAu.z * scaleFactor
    );

    const currentDistanceAu = interpolatedPosAu.length();
    const currentSpeedKmS =
      currentWp.velocityKmS !== undefined && nextWp.velocityKmS !== undefined
        ? currentWp.velocityKmS + (nextWp.velocityKmS - currentWp.velocityKmS) * segmentProgress
        : currentWp.velocityKmS || nextWp.velocityKmS;

    return {
      position: visualPos,
      currentWaypointIndex: currentIndex,
      currentWaypoint: currentWp,
      nextWaypoint: nextWp,
      segmentProgress,
      currentDistanceAu,
      currentSpeedKmS,
    };
  }
}
