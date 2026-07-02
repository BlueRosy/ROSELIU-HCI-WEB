import { useEffect, useState } from "react";
import { rwWonderland } from "../../theme/rwWonderland";

export default function RWLoadingScreen({ done }: { done?: boolean }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const start = Date.now();
    const tick = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const target = done ? 100 : Math.min(92, elapsed / 18);
      setProgress(target);
      if (done && elapsed > 800) {
        setProgress(100);
        window.setTimeout(() => setVisible(false), 300);
        window.clearInterval(tick);
      }
    }, 40);
    return () => window.clearInterval(tick);
  }, [done]);

  if (!visible && done) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-300"
      style={{
        backgroundColor: rwWonderland.background,
        opacity: done && progress >= 100 ? 0 : 1,
        pointerEvents: done && progress >= 100 ? "none" : "auto",
      }}
    >
      <div className="relative mb-8 flex h-20 w-20 items-center justify-center">
        <div
          className="absolute inset-0 animate-spin rounded-full border-2 border-primary/20 border-t-primary"
          style={{ animationDuration: "2.5s" }}
        />
        <svg viewBox="0 0 48 48" className="h-10 w-10 text-primary" aria-hidden="true">
          <path
            fill="currentColor"
            d="M24 4c-2 8-8 12-8 18 0 4 3.5 8 8 8s8-4 8-8c0-6-6-10-8-18zm0 32a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"
            opacity={0.85}
          />
        </svg>
      </div>
      <p className="font-mono text-sm tracking-[0.2em] text-ink">Entering research world…</p>
      <p className="mt-2 text-xs text-slate">Signals → States → Support → Closed-loop</p>
      <div className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-primary/10">
        <div
          className="h-full rounded-full bg-primary transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
