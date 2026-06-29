import { research } from "../content/site";
import ClosedLoop from "./ClosedLoop";
import { Reveal, SectionHeading } from "./primitives";

export default function Research({ enable3D }: { enable3D: boolean }) {
  return (
    <section id="research" className="section-anchor py-24">
      <div className="mx-auto max-w-5xl px-5">
        <Reveal>
          <SectionHeading eyebrow="Research Vision" title="Closed-loop systems for everyday mental wellbeing" />
        </Reveal>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_0.8fr]">
          <Reveal>
            <div className="space-y-4">
              {research.vision.map((p) => (
                <p key={p.slice(0, 24)} className="text-base leading-relaxed text-slate">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="glass rounded-2xl p-6 shadow-soft">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary-deep">
                Research Focus
              </p>
              <p className="mt-3 font-serif text-lg leading-snug text-navy">
                {research.focus}
              </p>
            </div>
          </Reveal>
        </div>

        {/* Core themes */}
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {research.themes.map((t, i) => (
            <Reveal key={t.index} delay={i * 0.08}>
              <article className="group h-full rounded-2xl border border-border bg-white/70 p-7 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
                <span className="font-mono text-3xl text-primary/40">{t.index}</span>
                <h3 className="mt-3 font-serif text-xl leading-snug text-navy">
                  {t.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-slate">{t.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Closed-loop framework */}
        <div className="mt-20">
          <Reveal>
            <div className="mb-8 max-w-2xl">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-deep">
                The Loop
              </p>
              <h3 className="mt-3 font-serif text-2xl text-navy sm:text-3xl">
                Sensing &rarr; Interpretation &rarr; Intervention &rarr; Action &rarr; Sustainability &amp; Safety
              </h3>
              <p className="mt-3 text-base leading-relaxed text-slate">
                Hover or select a stage to explore how signals become safe,
                sustainable support.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <ClosedLoop enable3D={enable3D} />
          </Reveal>
        </div>

        <Reveal>
          <p className="mt-16 max-w-3xl text-sm leading-relaxed text-slate">
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-accent-deep">
              Intellectual grounding —{" "}
            </span>
            {research.grounding}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
