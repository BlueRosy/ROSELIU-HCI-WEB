import { useEffect, useState } from "react";
import { researchWorld } from "../../content/site";
import { rwWonderland } from "../../theme/rwWonderland";

const INTRO_KEY = "rw-intro-seen";

export default function RWIntroOverlay({ onStart }: { onStart: () => void }) {
  const [visible, setVisible] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(INTRO_KEY);
    setVisible(!seen);
  }, []);

  const handleStart = () => {
    localStorage.setItem(INTRO_KEY, "1");
    setFade(true);
    window.setTimeout(() => {
      setVisible(false);
      onStart();
    }, 400);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center p-6 transition-opacity duration-400 ${
        fade ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" />
      <div
        className="relative max-w-md rounded-2xl border p-8 shadow-2xl backdrop-blur-md"
        style={{
          backgroundColor: rwWonderland.hudBg,
          borderColor: rwWonderland.hudBorder,
        }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary-deep">
          {researchWorld.subtitle}
        </p>
        <h2 className="mt-2 font-serif text-3xl text-ink">{researchWorld.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate">{researchWorld.intro}</p>
        <p className="mt-4 text-sm leading-relaxed text-slate">
          Walk the research trail from everyday signals to safe, sustainable support.
        </p>
        <p className="mt-4 font-mono text-xs text-slate/90">
          Entry → Signals Garden → States Observatory → Support Sanctuary → Closed-loop
        </p>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-slate/70">
          WASD move · E interact · Esc close
        </p>
        <button
          type="button"
          onClick={handleStart}
          className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-soft transition hover:bg-primary-deep"
        >
          Start exploring
        </button>
      </div>
    </div>
  );
}
