import { methods } from "../content/site";
import { Reveal, SectionHeading } from "./primitives";

function TagList({
  items,
  tone = "neutral",
}: {
  items: readonly string[];
  tone?: "neutral" | "primary" | "accent";
}) {
  const tones = {
    neutral: "border-border bg-white/70 text-slate",
    primary: "border-primary/30 bg-primary/10 text-primary-deep",
    accent: "border-accent/40 bg-accent/10 text-accent-deep",
  } as const;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className={`rounded-lg border px-3 py-1.5 font-mono text-xs ${tones[tone]}`}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export default function Methods() {
  return (
    <section id="methods" className="section-anchor py-24">
      <div className="mx-auto max-w-5xl px-5">
        <Reveal>
          <SectionHeading
            eyebrow="Methods & Skills"
            title="How I work"
            intro="Organized around research capabilities rather than tools — combining data analysis, evaluation, and lightweight building."
          />
        </Reveal>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <Reveal>
            <div className="rounded-2xl border border-border bg-white/60 p-7 shadow-soft">
              <h3 className="font-serif text-lg text-navy">Methods</h3>
              <div className="mt-4">
                <TagList items={methods.methods} tone="primary" />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
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
              <p className="mt-4 text-sm leading-relaxed text-slate">
                {methods.emergingNote}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="space-y-8">
              <div className="rounded-2xl border border-border bg-white/60 p-7 shadow-soft">
                <h3 className="font-serif text-lg text-navy">Technical</h3>
                <div className="mt-4">
                  <TagList items={methods.technical} />
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-white/60 p-7 shadow-soft">
                <h3 className="font-serif text-lg text-navy">Research areas</h3>
                <div className="mt-4">
                  <TagList items={methods.areas} tone="accent" />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
