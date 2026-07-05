import { createContext, useContext, type MutableRefObject } from "react";
import type { TimeOfDay } from "../../hooks/useLocalTimeOfDay";
import type { ScrollSection } from "./worldTrailConfig";

export type UniverseSceneState = {
  scrollProgress: MutableRefObject<number>;
  activeSection: MutableRefObject<ScrollSection>;
  activeZone: MutableRefObject<string>;
  showProjectCards: MutableRefObject<boolean>;
  parallax: MutableRefObject<{ x: number; y: number }>;
  invalidate: MutableRefObject<() => void>;
  isScrollingRef: MutableRefObject<boolean>;
  timeOfDay: MutableRefObject<TimeOfDay>;
  reducedMotion: MutableRefObject<boolean>;
  onProjectSelect: (projectId: string) => void;
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
