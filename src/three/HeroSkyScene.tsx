import { useMemo } from "react";
import Starfield from "./Starfield";

export default function HeroSkyScene({
  parallax,
  starCount,
}: {
  parallax: { x: number; y: number };
  starCount: number;
}) {
  const px = useMemo(() => parallax, [parallax.x, parallax.y]);

  return <Starfield count={starCount} parallax={px} rotationSpeed={0.01} />;
}
