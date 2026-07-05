import type { ScrollSection } from "./worldTrailConfig";

export type LandmarkFocusState = {
  section: ScrollSection;
  /** Soft dwell while section is active (0–1). */
  strength: number;
  /** Brief ease-in when landing on a section (0–1, decays). */
  arrive: number;
};

export const LANDMARK_FOCUS_ARRIVE_DUR = 0.55;

export const landmarkFocus: { current: LandmarkFocusState } = {
  current: { section: "hero", strength: 0, arrive: 0 },
};

export function landmarkGlowBoost(zoneId: string, activeZone: string, strength: number, arrive: number): number {
  if (activeZone !== zoneId) return 0;
  return Math.min(1, strength * 0.55 + arrive * 0.35);
}
