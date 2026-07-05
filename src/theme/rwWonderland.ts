import type { TimeOfDay } from "../hooks/useLocalTimeOfDay";

export type RwWonderlandPalette = {
  background: string;
  fog: string;
  fogNear: number;
  fogFar: number;
  skyHorizon: string;
  skyTop: string;
  skyDusk: string;
  ground: string;
  groundEmissive: string;
  groundOverlayOpacity: number;
  grid: string;
  gridOpacity: number;
  pathGlow: string;
  pathGlowBright: string;
  pathRibbon: string;
  panelGlass: string;
  panelBorder: string;
  panelEmissive: string;
  rim: string;
  hudBg: string;
  hudBorder: string;
  text: string;
  textMuted: string;
  campfire: string;
  discStone: string;
};

/** Ivory Wonderland palette — Research World subpage (day / golden hour). */
export const rwWonderlandDay: RwWonderlandPalette = {
  background: "#FFFCF9",
  fog: "#FFE8E4",
  fogNear: 26,
  fogFar: 68,
  skyHorizon: "#FFE8E4",
  skyTop: "#FFF5F8",
  skyDusk: "#FAD0DC",
  ground: "#FAF0E8",
  groundEmissive: "#F5E4DC",
  groundOverlayOpacity: 0.06,
  grid: "#C4848F",
  gridOpacity: 0.1,
  pathGlow: "#D4A59E",
  pathGlowBright: "#C4848F",
  pathRibbon: "#F0D0C8",
  panelGlass: "#FFFCF8",
  panelBorder: "#C4848F",
  panelEmissive: "#D4A59E",
  rim: "#C4848F",
  hudBg: "rgba(255, 252, 250, 0.88)",
  hudBorder: "rgba(196, 132, 143, 0.35)",
  text: "#2C2825",
  textMuted: "#6B5F58",
  campfire: "#E8A060",
  discStone: "#F0E8E4",
};

/** Moonlit rose garden — dark sky, bright landmarks, warm firelight. */
export const rwWonderlandNight: RwWonderlandPalette = {
  background: "#0A0810",
  fog: "#1A1420",
  fogNear: 38,
  fogFar: 78,
  skyHorizon: "#4A2838",
  skyTop: "#06050A",
  skyDusk: "#7A4860",
  ground: "#1E181C",
  groundEmissive: "#2E2228",
  groundOverlayOpacity: 0.04,
  grid: "#C4848F",
  gridOpacity: 0.12,
  pathGlow: "#F0C4CC",
  pathGlowBright: "#FFD0DC",
  pathRibbon: "#C49098",
  panelGlass: "#1A1520",
  panelBorder: "#C4848F",
  panelEmissive: "#A87888",
  rim: "#F0C4CC",
  hudBg: "rgba(20, 17, 28, 0.92)",
  hudBorder: "rgba(212, 165, 158, 0.28)",
  text: "#F5EFE8",
  textMuted: "#B8A8A0",
  campfire: "#FFB060",
  discStone: "#3A3038",
};

export function getRwWonderland(timeOfDay: TimeOfDay): RwWonderlandPalette {
  return timeOfDay === "night" ? rwWonderlandNight : rwWonderlandDay;
}

/** @deprecated Use getRwWonderland(timeOfDay) in research universe scenes. */
export const rwWonderland = rwWonderlandDay;

/** @deprecated Use getRwWonderland */
export const rwMetaverse = rwWonderlandDay;
