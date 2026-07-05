import { useEffect, useRef, useState, type CSSProperties } from "react";

const CURSOR_SRC = "/Rose-PersonalImage/rose-cursor-128.png";
/** Rendered size on screen (px). Chromium CSS cursors cap at 32 DIP; DOM bypasses that. */
const DISPLAY_PX = 72;
const SRC_PX = 128;
/** Bloom tip in source image space — matches rose-cursor-128.png generation. */
const HOTSPOT_X = 78;
const HOTSPOT_Y = 4;
const HOTSPOT_SCALE = DISPLAY_PX / SRC_PX;
const OFFSET_X = HOTSPOT_X * HOTSPOT_SCALE;
const OFFSET_Y = HOTSPOT_Y * HOTSPOT_SCALE;

const TEXT_INPUT =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="submit"]):not([type="button"]):not([type="reset"]), textarea, [contenteditable="true"]';

const MAX_PETALS = 3;
const PETAL_SPAWN_EVERY_PX = 140;
const PETAL_CHANCE = 0.42;

type Petal = {
  id: number;
  x: number;
  y: number;
  drift: number;
  rot: number;
  size: number;
};

function isTextTarget(el: Element | null): boolean {
  return Boolean(el?.closest(TEXT_INPUT));
}

/**
 * Cross-browser rose cursor (Arc/Chrome/Safari/Firefox).
 * Chromium ignores CSS cursor images much larger than 32×32 DIP.
 */
export default function RoseCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [petals, setPetals] = useState<Petal[]>([]);
  const petalId = useRef(0);

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
    let travelSincePetal = PETAL_SPAWN_EVERY_PX;

    const paint = () => {
      raf = 0;
      node.style.transform = `translate3d(${x - OFFSET_X}px, ${y - OFFSET_Y}px, 0)`;
      node.style.opacity = hidden || overText ? "0" : "1";
      root.classList.toggle("rose-cursor-on--text", overText);
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const spawnPetal = (px: number, py: number) => {
      const id = ++petalId.current;
      const petal: Petal = {
        id,
        x: px + (Math.random() - 0.5) * 10,
        y: py + 6 + Math.random() * 8,
        drift: (Math.random() - 0.5) * 28,
        rot: Math.random() * 360,
        size: 4 + Math.random() * 2.5,
      };
      setPetals((prev) => [...prev.slice(-(MAX_PETALS - 1)), petal]);
      window.setTimeout(() => {
        setPetals((prev) => prev.filter((p) => p.id !== id));
      }, 2800);
    };

    const onPointerMove = (e: PointerEvent) => {
      const prevX = x;
      const prevY = y;
      x = e.clientX;
      y = e.clientY;
      hidden = false;
      overText = isTextTarget(e.target as Element);

      if (!hidden && !overText) {
        travelSincePetal += Math.hypot(x - prevX, y - prevY);
        if (travelSincePetal >= PETAL_SPAWN_EVERY_PX) {
          travelSincePetal = 0;
          if (Math.random() < PETAL_CHANCE) {
            spawnPetal(x, y);
          }
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
        className="rose-cursor"
        aria-hidden="true"
        style={{ width: DISPLAY_PX, height: DISPLAY_PX }}
      >
        <img
          src={CURSOR_SRC}
          alt=""
          width={DISPLAY_PX}
          height={DISPLAY_PX}
          draggable={false}
          decoding="async"
        />
      </div>
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="rose-cursor-petal"
          aria-hidden="true"
          style={
            {
              left: petal.x,
              top: petal.y,
              width: petal.size,
              height: petal.size * 1.35,
              "--petal-rot": `${petal.rot}deg`,
              "--petal-drift": `${petal.drift}px`,
            } as CSSProperties
          }
        />
      ))}
    </>
  );
}
