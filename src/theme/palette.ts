/** Shared palette for CSS-adjacent JS (Three.js, SVG). */
export const palette = {
  bg: "#FAFBFC",
  surface: "#FFFFFF",
  section: "#F3F7FB",
  primary: "#7BA7C9",
  primaryDeep: "#4A7FA3",
  accent: "#7BA7C9",
  accentDeep: "#4A7FA3",
  sage: "#8A9AAB",
  ink: "#1A1D21",
  slate: "#5A6570",
  line: "#8A9AAB",
  border: "rgba(74, 127, 163, 0.16)",
  roseSoft: "#A8C8DE", // legacy name → soft blue
  cream: "#F3F7FB",
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
