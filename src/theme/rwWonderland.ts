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

/** Moonlit rose garden — warm horizon, soft paths, firefly night. */
export const rwWonderlandNight: RwWonderlandPalette = {
  background: "#14111C",
  fog: "#3D2E42",
  fogNear: 20,
  fogFar: 52,
  skyHorizon: "#6B4558",
  skyTop: "#0E0C16",
  skyDusk: "#9A6A7A",
  ground: "#2A2228",
  groundEmissive: "#3A2E34",
  groundOverlayOpacity: 0.05,
  grid: "#A87888",
  gridOpacity: 0.1,
  pathGlow: "#E8B4BC",
  pathGlowBright: "#F0C4CC",
  pathRibbon: "#8A6068",
  panelGlass: "#1A1520",
  panelBorder: "#A87888",
  panelEmissive: "#8A6270",
  rim: "#D4A59E",
  hudBg: "rgba(20, 17, 28, 0.92)",
  hudBorder: "rgba(212, 165, 158, 0.28)",
  text: "#F5EFE8",
  textMuted: "#B8A8A0",
  campfire: "#F0A868",
  discStone: "#3A3038",
};

export function getRwWonderland(timeOfDay: TimeOfDay): RwWonderlandPalette {
  return timeOfDay === "night" ? rwWonderlandNight : rwWonderlandDay;
}

/** @deprecated Use getRwWonderland(timeOfDay) in research universe scenes. */
export const rwWonderland = rwWonderlandDay;

/** @deprecated Use getRwWonderland */
export const rwMetaverse = rwWonderlandDay;
