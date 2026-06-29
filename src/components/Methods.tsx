import { methods } from "../content/site";
import { Reveal, SectionHeading } from "./primitives";

export default function Methods() {
  return (
    <section id="methods" className="section-anchor py-24">
      <div className="mx-auto max-w-5xl px-5">
        <Reveal>
          <SectionHeading
            eyebrow="Methods"
            title="How I connect data, design, and evaluation"
            intro="Organized around research capabilities — combining data analysis, evaluation, and lightweight building."
          />
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {methods.groups.map((group, i) => (
            <Reveal key={group.title} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-border bg-white/60 p-7 shadow-soft">
                <h3 className="font-serif text-lg text-navy">{group.title}</h3>
                <ul className="mt-4 space-y-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-slate"
                    >
                      <span className="h-1 w-1 shrink-0 rounded-full bg-primary/50" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-8 rounded-2xl border border-accent/30 bg-accent/5 p-6">
            <div className="flex flex-wrap items-center gap-2">
              {methods.emerging.map((m) => (
                <span
                  key={m}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-xs text-accent-deep"
                >
                  {m}
                  <span className="rounded-full bg-accent/25 px-1.5 py-0.5 text-[10px]">
                    emerging
                  </span>
                </span>
              ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate">{methods.emergingNote}</p>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-8 border-t border-border pt-6">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-slate">
              Technical
            </p>
            <div className="flex flex-wrap gap-2">
              {methods.technical.map((item) => (
                <span
                  key={item}
                  className="rounded-lg border border-border bg-white/70 px-3 py-1 font-mono text-xs text-slate"
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
