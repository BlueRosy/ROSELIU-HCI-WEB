/** Ivory Wonderland palette — Research World subpage only. */
export const rwWonderland = {
  background: "#FFFCF9",
  fog: "#FFE8E4",
  fogNear: 26,
  fogFar: 68,
  skyHorizon: "#FFE8E4",
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
} as const;

/** @deprecated Use rwWonderland */
export const rwMetaverse = rwWonderland;
