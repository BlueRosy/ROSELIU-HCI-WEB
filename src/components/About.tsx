import { about, currentLens, interests, journey, profile } from "../content/site";
import { Chip, Reveal, SectionHeading } from "./primitives";

export default function About() {
  return (
    <section id="about" className="section-anchor py-24">
      <div className="mx-auto max-w-5xl px-5">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.55fr] lg:items-start">
          <Reveal>
            <div>
              <SectionHeading eyebrow="About" title="A little about me" />
              <div className="mt-6 space-y-4">
                {about.bio.map((p) => (
                  <p key={p.slice(0, 24)} className="text-base leading-relaxed text-slate">
                    {p}
                  </p>
                ))}
                {profile.seekingPhd && (
                  <p className="rounded-xl border border-primary/25 bg-primary/[0.06] p-4 text-[15px] leading-relaxed text-navy">
                    {about.seekingLine}
                  </p>
                )}
              </div>

              <div className="mt-8">
                <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-slate">
                  Beyond research
                </p>
                <div className="flex flex-wrap gap-2">
                  {interests.map((t) => (
                    <Chip key={t} tone="accent">
                      {t}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="glass rounded-2xl p-6 shadow-soft lg:sticky lg:top-28">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary-deep">
                Current Lens
              </p>
              <ul className="mt-4 space-y-3">
                {currentLens.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-[15px] leading-relaxed text-navy"
                  >
                    <span
                      className="inline-block h-2 w-2 shrink-0 rounded-full"
                      style={{
                        background: "linear-gradient(120deg,#6BA6FF,#F3A6C8)",
                      }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-border pt-4 font-mono text-xs leading-relaxed text-slate">
                Looking for PhD opportunities in HCI · Human-Centered AI · Digital Wellbeing ·
                Emotional Computing
              </p>
            </div>
          </Reveal>
        </div>

        {/* Journey timeline */}
        <div className="mt-20">
          <Reveal>
            <h3 className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-primary-deep">
              My Journey
            </h3>
            <p className="mb-8 max-w-xl text-sm text-slate">
              A short timeline of how my interests converged around HCI, wellbeing, and
              human-centered AI.
            </p>
          </Reveal>
          <ol className="relative ml-2 border-l border-border pl-8">
            {journey.map((stop, i) => (
              <li key={stop.title} className="relative pb-10 last:pb-0">
                <Reveal delay={i * 0.05}>
                  <span
                    className="absolute -left-[2.30rem] top-1.5 h-3 w-3 rounded-full ring-4 ring-bg"
                    style={{ background: "linear-gradient(120deg,#6BA6FF,#F3A6C8)" }}
                  />
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-mono text-xs text-slate">{stop.period}</span>
                    <span className="font-mono text-xs text-slate/70">·</span>
                    <span className="font-mono text-xs text-slate/70">{stop.place}</span>
                  </div>
                  <h4 className="mt-1 font-serif text-lg text-navy">{stop.title}</h4>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate">
                    {stop.detail}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
