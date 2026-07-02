import { createContext, useContext, type MutableRefObject } from "react";
import type { ScrollSection } from "./worldTrailConfig";

export type UniverseSceneState = {
  scrollProgress: MutableRefObject<number>;
  activeSection: MutableRefObject<ScrollSection>;
  activeZone: MutableRefObject<string>;
  showProjectCards: MutableRefObject<boolean>;
  parallax: MutableRefObject<{ x: number; y: number }>;
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
