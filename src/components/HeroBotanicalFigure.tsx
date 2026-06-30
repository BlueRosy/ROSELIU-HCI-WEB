import { useState } from "react";
import { useHeroIllustration } from "../hooks/useHeroIllustration";

/** Static hero illustration — full column height, no motion. */
export default function HeroBotanicalFigure() {
  const [failed, setFailed] = useState(false);
  const heroIllustration = useHeroIllustration();
  const cacheKey =
    heroIllustration.split("/").pop()?.replace(".png", "") ?? "h1";

  if (failed) {
    return null;
  }

  return (
    <img
      src={`${heroIllustration}?v=${cacheKey}`}
      alt="Hand-drawn illustration of Rose among rose vines"
      onError={() => setFailed(true)}
      draggable={false}
      className="pointer-events-none absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 select-none object-contain object-bottom"
    />
  );
}
