import { useMemo } from "react";
import * as THREE from "three";
import { NODE_POSITIONS } from "./universeConfig";

const NODE_ORDER = ["signals", "states", "support", "safety"] as const;

export function useLoopCurve() {
  return useMemo(() => {
    const points = NODE_ORDER.map((id) => {
      const [x, y, z] = NODE_POSITIONS[id];
      return new THREE.Vector3(x, y, z);
    });
    // Close the loop by repeating first point
    points.push(points[0].clone());
    const curve = new THREE.CatmullRomCurve3(points, true, "catmullrom", 0.5);
    return curve;
  }, []);
}

export function getNodePositions() {
  return NODE_ORDER.map((id) => ({
    id,
    position: new THREE.Vector3(...NODE_POSITIONS[id]),
  }));
}
