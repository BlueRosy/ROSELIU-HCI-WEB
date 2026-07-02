/** Ivory Wonderland palette — Research World subpage only. */
export const rwWonderland = {
  background: "#FFFDF8",
  fog: "#F5EFE8",
  fogNear: 28,
  fogFar: 70,
  ground: "#F8F1E8",
  groundEmissive: "#EDE4DA",
  groundOverlayOpacity: 0.06,
  grid: "#B9786F",
  gridOpacity: 0.1,
  pathGlow: "#D4A59E",
  pathGlowBright: "#B9786F",
  pathRibbon: "#E8C4BC",
  panelGlass: "#FFFCF8",
  panelBorder: "#B9786F",
  panelEmissive: "#D4A59E",
  rim: "#8A9275",
  hudBg: "rgba(255, 253, 248, 0.88)",
  hudBorder: "rgba(185, 120, 111, 0.35)",
  text: "#2C2825",
  textMuted: "#6B5F58",
} as const;

/** @deprecated Use rwWonderland */
export const rwMetaverse = rwWonderland;
