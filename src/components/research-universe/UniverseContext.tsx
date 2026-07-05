import { createContext, useContext, type MutableRefObject } from "react";
import type { TimeOfDay } from "../../hooks/useLocalTimeOfDay";
import type { EntryCinematicPhase } from "./entryCinematic";
import type { ScrollSection } from "./worldTrailConfig";

export type UniverseSceneState = {
  scrollProgress: MutableRefObject<number>;
  activeSection: MutableRefObject<ScrollSection>;
  activeZone: MutableRefObject<string>;
  showProjectCards: MutableRefObject<boolean>;
  parallax: MutableRefObject<{ x: number; y: number }>;
  invalidate: MutableRefObject<() => void>;
  isScrollingRef: MutableRefObject<boolean>;
  /** True once the trail loader has cleared — entry cinematic may start. */
  entryRevealArmed: MutableRefObject<boolean>;
  entryCinematicActive: MutableRefObject<boolean>;
  entryCinematicDone: MutableRefObject<boolean>;
  entryCinematicT: MutableRefObject<number>;
  entryCinematicElapsed: MutableRefObject<number>;
  entryCinematicPhase: MutableRefObject<EntryCinematicPhase>;
  heroCaptionVisible: MutableRefObject<boolean>;
  timeOfDay: MutableRefObject<TimeOfDay>;
  reducedMotion: MutableRefObject<boolean>;
  onProjectSelect: (projectId: string) => void;
  onCinematicComplete?: () => void;
  onCaptionReveal?: () => void;
};

const UniverseContext = createContext<UniverseSceneState | null>(null);

export function UniverseProvider({
  value,
  children,
}: {
  value: UniverseSceneState;
  children: React.ReactNode;
}) {
  return <UniverseContext.Provider value={value}>{children}</UniverseContext.Provider>;
}

export function useUniverse() {
  const ctx = useContext(UniverseContext);
  if (!ctx) throw new Error("useUniverse must be used within UniverseProvider");
  return ctx;
}
