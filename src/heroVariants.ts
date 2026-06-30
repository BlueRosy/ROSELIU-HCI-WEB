/** Hero illustration A/B routes — path → asset + label. */
export const HERO_VARIANTS = [
  { path: "/", label: "h1 · Main", src: null as string | null },
  { path: "/v2", label: "h2", src: "/Rose-PersonalImage/h2.png" },
  { path: "/v7", label: "h3", src: "/Rose-PersonalImage/h3.png" },
  { path: "/v3", label: "h5", src: "/Rose-PersonalImage/h5.png" },
  { path: "/new", label: "h6", src: "/Rose-PersonalImage/h6.png" },
  { path: "/v4", label: "h7", src: "/Rose-PersonalImage/h7.png" },
  { path: "/v5", label: "h8", src: "/Rose-PersonalImage/h8.png" },
] as const;

export type HeroVariantPath = (typeof HERO_VARIANTS)[number]["path"];

export function heroVariantForPath(pathname: string) {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  return (
    HERO_VARIANTS.find((v) => v.path === normalized) ?? HERO_VARIANTS[0]
  );
}
