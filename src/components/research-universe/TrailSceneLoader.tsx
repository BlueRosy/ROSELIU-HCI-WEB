import { useProgress } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { researchWorld } from "../../content/site";

/** Same palette as the sky-city intro so the hand-off reads as one continuous
 * scene rather than a cut to a different screen. */
const INTRO_GRADIENT =
  "linear-gradient(180deg, #F3D9E4 0%, #FBEFE6 45%, #F6E4D4 78%, #EFD6C4 100%)";

/**
 * Full-screen rose loader shown while the main trail scene's GLBs stream in.
 * The intro canvas unmounts before the main canvas mounts (so the two heavy
 * WebGL contexts never run at once), which used to leave a white flash while
 * the entry models loaded. This sits behind the fading intro and covers that
 * gap, then fades out once the loading manager settles and tells the parent to
 * unmount it.
 */
export default function TrailSceneLoader({ onReady }: { onReady: () => void }) {
  const { active, progress } = useProgress();
  const [hiding, setHiding] = useState(false);
  const started = useRef(false);
  const done = useRef(false);

  // Only trust "finished" after a fresh loading burst actually began — the
  // intro already drove the manager to 100%, so ignore that stale state.
  useEffect(() => {
    if (active) started.current = true;
  }, [active]);

  useEffect(() => {
    if (done.current) return;
    if (started.current && !active && progress >= 100) {
      done.current = true;
      // Small settle so the first frame is painted before we reveal it.
      const t = window.setTimeout(() => setHiding(true), 400);
      return () => window.clearTimeout(t);
    }
  }, [active, progress]);

  // Safety net: if every asset is already cached (no new load fires) reveal
  // anyway so we can never get stuck on the loader.
  useEffect(() => {
    const t = window.setTimeout(() => {
      if (!done.current) {
        done.current = true;
        setHiding(true);
      }
    }, 2600);
    return () => window.clearTimeout(t);
  }, []);

  const shown = Math.min(100, Math.round(progress));

  return (
    <div
      onTransitionEnd={() => {
        if (hiding) onReady();
      }}
      className={`fixed inset-0 z-30 flex flex-col items-center justify-center gap-6 transition-opacity duration-700 ${
        hiding ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{ background: INTRO_GRADIENT }}
      aria-hidden
    >
      <div className="relative h-12 w-12">
        <span className="absolute inset-0 rounded-full border-2 border-primary/20" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary/70" />
      </div>
      <div className="text-center">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-primary/80">
          {researchWorld.subtitle}
        </p>
        <p className="mt-2 text-sm text-primary/60">Entering the trail… {shown}%</p>
      </div>
      <div className="h-[3px] w-40 overflow-hidden rounded-full bg-primary/15">
        <div
          className="h-full rounded-full bg-primary/60 transition-[width] duration-300"
          style={{ width: `${Math.max(8, shown)}%` }}
        />
      </div>
    </div>
  );
}
