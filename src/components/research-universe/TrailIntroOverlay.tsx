import { useEffect, useState } from "react";

export default function TrailIntroOverlay() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hide = () => setVisible(false);
    window.addEventListener("wheel", hide, { once: true, passive: true });
    window.addEventListener("touchmove", hide, { once: true, passive: true });
    window.addEventListener("keydown", hide, { once: true });
    return () => {
      window.removeEventListener("wheel", hide);
      window.removeEventListener("touchmove", hide);
      window.removeEventListener("keydown", hide);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 flex items-end justify-center pb-36 transition-opacity duration-700"
      aria-hidden
    >
      <p className="trail-intro-hint font-mono text-[11px] uppercase tracking-[0.2em] text-slate/90">
        Scroll · ↑ ↓ · Space to walk the trail
      </p>
    </div>
  );
}
