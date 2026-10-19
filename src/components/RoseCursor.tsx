import { useEffect, useRef, useState, type CSSProperties } from "react";

/** Compact blue crescent — matches favicon, calmer than a heart. */
const DISPLAY_PX = 17;
const OFFSET_X = 2;
const OFFSET_Y = 3;

const TEXT_INPUT =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="submit"]):not([type="button"]):not([type="reset"]), textarea, [contenteditable="true"]';

const MAX_DOTS = 16;
const DOT_SPAWN_EVERY_PX = 32;
const DOT_CHANCE = 0.75;
const DOT_LIFE_MS = 800;

type Dot = {
  id: number;
  x: number;
  y: number;
  size: number;
};

function isTextTarget(el: Element | null): boolean {
  return Boolean(el?.closest(TEXT_INPUT));
}

/**
 * Blue crescent pointer + soft signal-dot trail.
 */
export default function RoseCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [dots, setDots] = useState<Dot[]>([]);
  const dotId = useRef(0);

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
    let travelSinceDot = DOT_SPAWN_EVERY_PX;

    const paint = () => {
      raf = 0;
      node.style.transform = `translate3d(${x - OFFSET_X}px, ${y - OFFSET_Y}px, 0)`;
      node.style.opacity = hidden || overText ? "0" : "1";
      root.classList.toggle("rose-cursor-on--text", overText);
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const spawnDot = (px: number, py: number) => {
      const id = ++dotId.current;
      const dot: Dot = {
        id,
        x: px + (Math.random() - 0.5) * 14,
        y: py + (Math.random() - 0.5) * 14,
        size: 2.5 + Math.random() * 3.5,
      };
      setDots((prev) => [...prev.slice(-(MAX_DOTS - 1)), dot]);
      window.setTimeout(() => {
        setDots((prev) => prev.filter((d) => d.id !== id));
      }, DOT_LIFE_MS);
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
        travelSinceDot += dist;
        if (travelSinceDot >= DOT_SPAWN_EVERY_PX) {
          travelSinceDot = 0;
          if (Math.random() < DOT_CHANCE) spawnDot(x, y);
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
        className="rose-cursor rose-cursor--moon"
        aria-hidden="true"
        style={{ width: DISPLAY_PX, height: DISPLAY_PX }}
      >
        <svg
          className="rose-cursor__moon"
          viewBox="0 0 24 24"
          width={DISPLAY_PX}
          height={DISPLAY_PX}
          aria-hidden="true"
        >
          {/* Thick crescent — same language as favicon */}
          <path
            fill="currentColor"
            d="M14.2 3.1a9.2 9.2 0 1 0 6.7 15.7A8.1 8.1 0 1 1 14.2 3.1Z"
          />
        </svg>
      </div>
      {dots.map((dot) => (
        <span
          key={dot.id}
          className="rose-cursor-dot"
          aria-hidden="true"
          style={
            {
              left: dot.x,
              top: dot.y,
              width: dot.size,
              height: dot.size,
            } as CSSProperties
          }
        />
      ))}
    </>
  );
}
