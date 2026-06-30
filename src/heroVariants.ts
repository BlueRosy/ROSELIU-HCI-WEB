/** Default hero illustration — h5 with SVG vine growth. */
export const HERO_ILLUSTRATION = "/Rose-PersonalImage/h5.png";

export function heroIllustrationId(src: string): string {
  const file = src.split("/").pop()?.split("?")[0] ?? "h5.png";
  return file.replace(/\.png$/i, "") || "h5";
}

/** Per-asset horizontal nudge (px). Negative = shift figure left. */
export function heroFigureOffsetForSrc(_src: string): number {
  return 0;
}

export type HeroLayeredAssets = {
  figure: string;
  vines?: string;
};

export const HERO_LAYERED_ASSETS: Partial<Record<string, HeroLayeredAssets>> = {
  h5: {
    figure: HERO_ILLUSTRATION,
  },
};

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

export const HERO_FIGURE_LOADED_EVENT = "hero-figure-loaded";
