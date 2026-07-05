import * as THREE from "three";

export const CINEMATIC_DURATION = 4.4;
export const CINEMATIC_DURATION_REDUCED = 0.6;

/** Hero settle — inside garden, outside tripod ring, facing disc. */
export const HERO_CAM: [number, number, number] = [0, 4.8, 2.6];
export const HERO_LOOK: [number, number, number] = [0, 1.0, -8.2];

const CAM_KEYFRAMES: [number, number, number][] = [
  [0, 8.2, 24],
  [0, 5.6, 16],
  [0, 3.2, 10],
  [0, 1.75, 7.0],
  [0, 2.0, 4.5],
  HERO_CAM,
];

const LOOK_KEYFRAMES: [number, number, number][] = [
  [0, 2.0, 5.2],
  [0, 1.7, 5.0],
  [0, 1.35, 4.6],
  [0, 1.05, 3.0],
  [0, 0.75, -2.5],
  HERO_LOOK,
];

/** Linear segment durations (seconds) — K0→K1 … K4→K5, then hold. */
const SEGMENT_DURATIONS = [0.5, 0.8, 1.6, 0.5, 0.7, 0.3];

/** Phase boundaries (seconds). */
const T_WIDE = 0.5;
const T_APPROACH = 1.3;
const T_THROUGH = 2.9;
const T_INSIDE = 3.6;

export type EntryCinematicPhase =
  | "idle"
  | "framing"
  | "approach"
  | "through"
  | "inside"
  | "caption"
  | "done";

const _pos = new THREE.Vector3();
const _look = new THREE.Vector3();
const _a = new THREE.Vector3();
const _b = new THREE.Vector3();

function clamp01(t: number): number {
  return Math.max(0, Math.min(1, t));
}

function lerpAlongKeyframes(
  keyframes: [number, number, number][],
  elapsed: number,
  out: THREE.Vector3,
): void {
  let remaining = Math.max(0, elapsed);
  for (let i = 0; i < SEGMENT_DURATIONS.length; i++) {
    const dur = SEGMENT_DURATIONS[i];
    const from = keyframes[Math.min(i, keyframes.length - 1)];
    const to = keyframes[Math.min(i + 1, keyframes.length - 1)];
    if (remaining <= dur || i === SEGMENT_DURATIONS.length - 1) {
      const localT = dur > 0 ? clamp01(remaining / dur) : 1;
      _a.set(...from);
      _b.set(...to);
      out.lerpVectors(_a, _b, localT);
      return;
    }
    remaining -= dur;
  }
  out.set(...keyframes[keyframes.length - 1]);
}

export function entryCinematicPhase(
  elapsed: number,
  reduced: boolean,
): EntryCinematicPhase {
  if (elapsed <= 0) return "idle";
  if (reduced) {
    if (elapsed >= CINEMATIC_DURATION_REDUCED) return "done";
    return elapsed >= 0.25 ? "caption" : "framing";
  }
  if (elapsed >= CINEMATIC_DURATION) return "done";
  if (elapsed < T_WIDE) return "framing";
  if (elapsed < T_APPROACH) return "approach";
  if (elapsed < T_THROUGH) return "through";
  if (elapsed < T_INSIDE) return "inside";
  return "caption";
}

export function entryCinematicProgress(
  elapsed: number,
  reduced: boolean,
): number {
  const dur = reduced ? CINEMATIC_DURATION_REDUCED : CINEMATIC_DURATION;
  return Math.min(1, elapsed / dur);
}

export type EntryCinematicCameraSample = {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  phase: EntryCinematicPhase;
  /** 0–1 through the arch pass — for door cascade. */
  dollyT: number;
  /** Camera has passed the door plane (z ≈ 6.2). */
  crossedThreshold: boolean;
  /** 0–1 FOV pull-in during through segment. */
  fovT: number;
};

/** Door cascade driver — 0 at far exterior, 1 when fully lit. */
export function doorCascadeT(camZ: number): number {
  const CASCADE_START_Z = 14;
  const CASCADE_END_Z = 5.5;
  return clamp01((CASCADE_START_Z - camZ) / (CASCADE_START_Z - CASCADE_END_Z));
}

/** Rose path reveal — 0 before door cross, 1 deep on entry walkway. */
export function pathRevealT(camZ: number): number {
  const START_Z = 6.8;
  const END_Z = 0.8;
  return clamp01((START_Z - camZ) / (START_Z - END_Z));
}

export function sampleEntryCinematicCamera(
  elapsed: number,
  reduced: boolean,
): EntryCinematicCameraSample {
  const phase = entryCinematicPhase(elapsed, reduced);

  if (reduced) {
    _pos.set(...HERO_CAM);
    _look.set(...HERO_LOOK);
    return {
      position: _pos.clone(),
      lookAt: _look.clone(),
      phase,
      dollyT: 1,
      crossedThreshold: true,
      fovT: 0,
    };
  }

  lerpAlongKeyframes(CAM_KEYFRAMES, elapsed, _pos);
  lerpAlongKeyframes(LOOK_KEYFRAMES, elapsed, _look);

  let dollyT = 0;
  if (elapsed >= T_APPROACH && elapsed <= T_THROUGH) {
    dollyT = clamp01((elapsed - T_APPROACH) / (T_THROUGH - T_APPROACH));
  } else if (elapsed > T_THROUGH) {
    dollyT = 1;
  }

  let fovT = 0;
  if (phase === "through") {
    fovT = dollyT;
  } else if (phase === "inside" || phase === "caption") {
    fovT = Math.max(0, 1 - (elapsed - T_THROUGH) / 0.5);
  }

  return {
    position: _pos.clone(),
    lookAt: _look.clone(),
    phase,
    dollyT,
    crossedThreshold: _pos.z < 6.2,
    fovT,
  };
}
