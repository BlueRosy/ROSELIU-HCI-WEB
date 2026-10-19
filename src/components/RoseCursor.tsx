import { useEffect, useRef, useState, type CSSProperties } from "react";

/** Compact blue heart pointer. */
const DISPLAY_PX = 16;
const OFFSET_X = 2;
const OFFSET_Y = 3;

const TEXT_INPUT =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="submit"]):not([type="button"]):not([type="reset"]), textarea, [contenteditable="true"]';

const MAX_STARS = 18;
const STAR_SPAWN_EVERY_PX = 28;
const STAR_CHANCE = 0.85;
const STAR_LIFE_MS = 900;

type Star = {
  id: number;
  x: number;
  y: number;
  size: number;
  rot: number;
};

function isTextTarget(el: Element | null): boolean {
  return Boolean(el?.closest(TEXT_INPUT));
}

/**
 * Blue heart pointer + light trail.
 */
export default function RoseCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const starId = useRef(0);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    root.classList.add("rose-cursor-on");

    const node = rootRef.current;
    if (!node) return;

    let raf = 0;
    let x = -200;
    let y = -200;
    let hidden = true;
    let overText = false;
    let travelSinceStar = STAR_SPAWN_EVERY_PX;

    const paint = () => {
      raf = 0;
      node.style.transform = `translate3d(${x - OFFSET_X}px, ${y - OFFSET_Y}px, 0)`;
      node.style.opacity = hidden || overText ? "0" : "1";
      root.classList.toggle("rose-cursor-on--text", overText);
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const spawnStar = (px: number, py: number) => {
      const id = ++starId.current;
      const star: Star = {
        id,
        x: px + (Math.random() - 0.5) * 16,
        y: py + (Math.random() - 0.5) * 16,
        size: 3.5 + Math.random() * 4.5,
        rot: Math.random() * 60,
      };
      setStars((prev) => [...prev.slice(-(MAX_STARS - 1)), star]);
      window.setTimeout(() => {
        setStars((prev) => prev.filter((s) => s.id !== id));
      }, STAR_LIFE_MS);
    };

    const onPointerMove = (e: PointerEvent) => {
      const prevX = x;
      const prevY = y;
      x = e.clientX;
      y = e.clientY;
      hidden = false;
      overText = isTextTarget(e.target as Element);

      if (!hidden && !overText) {
        const dist = Math.hypot(x - prevX, y - prevY);
        travelSinceStar += dist;
        if (travelSinceStar >= STAR_SPAWN_EVERY_PX) {
          travelSinceStar = 0;
          if (Math.random() < STAR_CHANCE) spawnStar(x, y);
        }
      }

      schedule();
    };

    const onPointerLeave = (e: PointerEvent) => {
      if (e.relatedTarget) return;
      hidden = true;
      schedule();
    };

    const onVisibility = () => {
      if (document.hidden) {
        hidden = true;
        schedule();
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      root.classList.remove("rose-cursor-on", "rose-cursor-on--text");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={rootRef}
        className="rose-cursor rose-cursor--heart"
        aria-hidden="true"
        style={{ width: DISPLAY_PX, height: DISPLAY_PX }}
      >
        <svg
          className="rose-cursor__heart"
          viewBox="0 0 24 24"
          width={DISPLAY_PX}
          height={DISPLAY_PX}
          aria-hidden="true"
        >
          <path
            d="M12 20.4c-.4 0-.7-.1-1-.4C6.2 16.1 3 13.2 3 9.6 3 7 5 5 7.6 5c1.5 0 2.9.8 3.7 2 .8-1.2 2.2-2 3.7-2C17.6 5 19.6 7 19.6 9.6c0 3.6-3.2 6.5-8 10.4-.3.3-.6.4-1 .4Z"
            fill="currentColor"
          />
        </svg>
      </div>
      {stars.map((star) => (
        <span
          key={star.id}
          className="rose-cursor-star"
          aria-hidden="true"
          style={
            {
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              "--star-rot": `${star.rot}deg`,
            } as CSSProperties
          }
        />
      ))}
    </>
  );
}
