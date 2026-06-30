/** Shared Rose botanical palette for CSS-adjacent JS (Three.js, SVG). */
export const palette = {
  bg: "#FFFDF8",
  surface: "#FFFCF7",
  section: "#F8F1E8",
  primary: "#B9786F",
  primaryDeep: "#8F514C",
  accent: "#B9786F",
  accentDeep: "#8F514C",
  sage: "#8A9275",
  ink: "#2F2A26",
  slate: "#6F6258",
  line: "#7A6658",
  border: "rgba(122, 102, 88, 0.18)",
  roseSoft: "#D4A59E",
  cream: "#F8F1E8",
} as const;

export const heroPetalPalette = [
  palette.primary,
  palette.roseSoft,
  palette.primaryDeep,
] as const;

export const closedLoopGradient = {
  start: palette.primaryDeep,
  end: palette.sage,
} as const;
