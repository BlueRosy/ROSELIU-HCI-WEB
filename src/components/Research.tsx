import { research } from "../content/site";
import ClosedLoop from "./ClosedLoop";
import CardBotanicalAccent from "./botanical/CardBotanicalAccent";
import { Reveal, SectionHeading } from "./primitives";

export default function Research({ enable3D }: { enable3D: boolean }) {
  return (
    <section id="research" className="section-anchor section-alt py-24">
      <div className="mx-auto max-w-5xl px-5">
        <Reveal>
          <SectionHeading
            eyebrow="Research Vision"
            title="Closed-loop systems for everyday mental wellbeing"
            intro="I build and study systems that sense everyday stress from conversational and behavioral signals, interpret underlying mechanisms, select appropriate support strategies, and help users move from reflection to sustainable action."
          />
        </Reveal>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_0.8fr]">
          <Reveal>
            <div className="space-y-4">
              {research.vision.slice(1).map((p) => (
                <p key={p.slice(0, 24)} className="text-base leading-relaxed text-slate">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="glass relative overflow-hidden rounded-2xl p-6 shadow-soft">
              <CardBotanicalAccent position="top-right" className="opacity-[0.14]" />
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary-deep">
                Research Focus
              </p>
              <p className="mt-3 font-serif text-lg leading-snug text-ink">
                {research.focus}
              </p>
            </div>
          </Reveal>
        </div>

        {/* Core themes */}
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {research.themes.map((t, i) => (
            <Reveal key={t.index} delay={i * 0.08}>
              <article className="group h-full rounded-2xl border border-border bg-surface/70 p-7 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
                <span className="font-mono text-3xl text-primary/40">{t.index}</span>
                <h3 className="mt-3 font-serif text-xl leading-snug text-ink">
                  {t.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-slate">{t.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Closed-loop framework exhibit */}
        <div className="relative mt-20 overflow-hidden rounded-3xl border border-border bg-surface/40 p-6 sm:p-10">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(ellipse at 30% 50%, color-mix(in srgb, var(--color-primary) 12%, transparent), transparent 60%), radial-gradient(ellipse at 70% 50%, color-mix(in srgb, var(--color-accent) 10%, transparent), transparent 60%)",
            }}
          />
          <div className="relative">
            <Reveal>
              <div className="mb-8 max-w-2xl">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary-deep">
                  The Loop
                </p>
                <h3 className="mt-3 font-serif text-2xl text-ink sm:text-3xl">
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
