import { about, currentLens, interests } from "../content/site";
import { Chip, Reveal } from "./primitives";

export default function AboutBottomCards() {
  return (
    <div className="mt-12 grid gap-4 sm:grid-cols-3">
      <Reveal delay={0.1}>
        <div className="glass h-full rounded-2xl p-5 shadow-soft">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary-deep">
            Methods I use
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {about.methods.map((t) => (
              <Chip key={t} tone="neutral">
                {t}
              </Chip>
            ))}
          </div>
        </div>
      </Reveal>
      <Reveal delay={0.12}>
        <div className="glass h-full rounded-2xl p-5 shadow-soft">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary-deep">
            Current Lens
          </p>
          <ul className="mt-3 space-y-2">
            {currentLens.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-[14px] leading-relaxed text-ink"
              >
                <span className="accent-dot inline-block h-2 w-2 shrink-0 rounded-full" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
      <Reveal delay={0.14}>
        <div className="glass h-full rounded-2xl p-5 shadow-soft">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-primary-deep">
            Beyond research
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {interests.map((t) => (
              <Chip key={t} tone="accent">
                {t}
              </Chip>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
