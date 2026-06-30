/** Hero illustration A/B — h5 (interactive vines) vs h8 (static composite). */
export const HERO_VARIANTS = [
  { path: "/", label: "h5", src: "/Rose-PersonalImage/h5.png" },
  { path: "/v5", label: "h8", src: "/Rose-PersonalImage/h8.png" },
] as const;

export type HeroVariantPath = (typeof HERO_VARIANTS)[number]["path"];

const LEGACY_H5_PATHS = new Set(["/v3"]);

export function heroVariantForPath(pathname: string) {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  if (LEGACY_H5_PATHS.has(normalized)) {
    return HERO_VARIANTS[0];
  }
  return HERO_VARIANTS.find((v) => v.path === normalized) ?? HERO_VARIANTS[0];
}

export function heroIllustrationId(src: string): string {
  const file = src.split("/").pop()?.split("?")[0] ?? "h5.png";
  return file.replace(/\.png$/i, "") || "h5";
}

/** Per-asset horizontal nudge (px). Negative = shift figure left. */
export function heroFigureOffsetForSrc(_src: string): number {
  return 0;
}

/**
 * Two-layer hero exports (same canvas size, pixel-aligned):
 * - figure — character without vines
 * - vines — vines/flowers on transparent background
 */
export type HeroLayeredAssets = {
  figure: string;
  vines?: string;
};

/** h5: composite figure + SVG vine growth to signal cards. */
export const HERO_LAYERED_ASSETS: Partial<Record<string, HeroLayeredAssets>> = {
  h5: {
    figure: "/Rose-PersonalImage/h5.png",
  },
};

/** Illustrations with SVG vines growing from feet to signal cards. */
export const HERO_SIGNAL_VINE_GROWTH_IDS = new Set(["h5"]);

export function heroFigureSrc(src: string): string {
  const id = heroIllustrationId(src);
  return HERO_LAYERED_ASSETS[id]?.figure ?? src;
}

export function heroVineOverlaySrc(src: string): string | null {
  const id = heroIllustrationId(src);
  return HERO_LAYERED_ASSETS[id]?.vines ?? null;
}

export function heroHasSignalVineGrowth(src: string): boolean {
  return HERO_SIGNAL_VINE_GROWTH_IDS.has(heroIllustrationId(src));
}

export type HeroLayerAlign = {
  body: { x: number; y: number };
  vines: { x: number; y: number };
  refWidth: number;
};

export const HERO_LAYER_ALIGN: Partial<Record<string, HeroLayerAlign>> = {
  h5: {
    body: { x: 0, y: 0 },
    vines: { x: 0, y: 0 },
    refWidth: 1024,
  },
};

export function heroLayerAlign(id: string): HeroLayerAlign | null {
  return HERO_LAYER_ALIGN[id] ?? null;
}

export function heroHasVineOverlay(src: string): boolean {
  return heroVineOverlaySrc(src) !== null;
}

/** Fired when hero PNG finishes loading — layout hooks can remeasure. */
export const HERO_FIGURE_LOADED_EVENT = "hero-figure-loaded";
