import { methods } from "../content/site";
import CardBotanicalAccent from "./botanical/CardBotanicalAccent";
import { Reveal, SectionHeading } from "./primitives";

const GROUP_ACCENT = [
  "border-l-sage",
  "border-l-primary",
  "border-l-primary-deep",
  "border-l-sage",
] as const;

function LeafBullet() {
  return (
    <svg className="mt-0.5 h-3 w-3 shrink-0 opacity-55" viewBox="0 0 12 12" aria-hidden="true">
      <path
        d="M6 11 C 4 8, 2 5, 6 1 C 10 5, 8 8, 6 11"
        fill="currentColor"
        className="text-sage"
      />
    </svg>
  );
}

export default function Methods() {
  return (
    <section id="methods" className="section-anchor section-alt py-24">
      <div className="mx-auto max-w-5xl px-5">
        <Reveal>
          <SectionHeading
            eyebrow="Methods"
            title="How I connect data, design, and evaluation"
            intro="Organized around research capabilities — combining data analysis, evaluation, and lightweight building."
          />
        </Reveal>

        <div className="relative mt-10 grid gap-5 sm:grid-cols-2">
          {/* faint connector on desktop */}
          <svg
            className="pointer-events-none absolute left-1/2 top-8 hidden h-[calc(100%-4rem)] w-8 -translate-x-1/2 sm:block"
            viewBox="0 0 32 200"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M16 0 C 10 50, 22 100, 16 150 S 16 180, 16 200"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-sage/30"
            />
          </svg>

          {methods.groups.map((group, i) => (
            <Reveal key={group.title} delay={i * 0.06}>
              <div
                className={`paper-card relative h-full overflow-hidden rounded-2xl border-l-[3px] p-7 shadow-soft ${GROUP_ACCENT[i % GROUP_ACCENT.length]}`}
              >
                <CardBotanicalAccent
                  position={i % 2 === 0 ? "top-right" : "bottom-left"}
                  className="opacity-[0.12]"
                />
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary-deep/80">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1 font-serif text-lg text-ink">{group.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate">
                      <LeafBullet />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="glass relative mt-8 overflow-hidden rounded-2xl border border-primary/15 p-6 shadow-soft">
            <CardBotanicalAccent position="top-right" className="opacity-10" />
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary-deep">
              Emerging methods
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {methods.emerging.map((m) => (
                <span
                  key={m}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/5 px-3 py-1.5 font-mono text-xs text-primary-deep"
                >
                  {m}
                  <span className="rounded-full bg-sage/15 px-1.5 py-0.5 text-[10px] text-sage">
                    emerging
                  </span>
                </span>
              ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate">{methods.emergingNote}</p>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="relative mt-8 overflow-hidden rounded-2xl border border-border/80 bg-surface/50 p-6">
            <CardBotanicalAccent position="bottom-left" className="opacity-[0.1]" />
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-slate">
              Technical
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {methods.technical.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-bg/80 px-3 py-1 font-mono text-xs text-slate"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
