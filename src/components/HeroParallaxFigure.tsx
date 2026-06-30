import { useEffect, useRef, useState, type RefObject } from "react";
import { profile } from "../content/site";

const MAX_TILT = 14;
const MAX_LIFT = 12;

function usePointerTilt(containerRef: RefObject<HTMLElement | null>) {
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, lift: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const onMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) {
        target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
        target.current.y = (e.clientY / window.innerHeight) * 2 - 1;
        return;
      }
      const rect = el.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      target.current.x = Math.max(-1, Math.min(1, nx));
      target.current.y = Math.max(-1, Math.min(1, ny));
    };

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.08;
      current.current.y += (target.current.y - current.current.y) * 0.08;
      setTilt({
        rotateY: current.current.x * MAX_TILT,
        rotateX: -current.current.y * MAX_TILT * 0.65,
        lift: Math.hypot(current.current.x, current.current.y) * MAX_LIFT,
      });
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, [containerRef]);

  return tilt;
}

export default function HeroParallaxFigure() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const { rotateX, rotateY, lift } = usePointerTilt(containerRef);

  if (failed) {
    return (
      <div className="flex aspect-square w-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
        <span className="font-serif text-5xl text-ink/20">YL</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-square w-full overflow-visible bg-transparent"
      style={{ perspective: "900px" }}
    >
      {/* Soft glow under the bust — reads on the cerulean sky hero */}
      <div
        className="pointer-events-none absolute inset-x-[10%] bottom-[12%] h-[22%] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse, rgba(68,153,229,0.28) 0%, rgba(157,217,217,0.16) 50%, transparent 72%)",
          transform: `translate(${-rotateY * 0.8}px, ${rotateX * 0.5}px) scale(1.1)`,
        }}
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${lift}px)`,
        }}
      >
        <img
          src={profile.heroParallax}
          alt="Stylized 3D avatar portrait"
          onError={() => setFailed(true)}
          draggable={false}
          className="h-[118%] w-[118%] max-w-none select-none object-contain object-[center_58%] drop-shadow-[0_20px_40px_rgba(68,153,229,0.2)]"
          style={{ transform: "translateZ(28px)" }}
        />
      </div>
    </div>
  );
}
