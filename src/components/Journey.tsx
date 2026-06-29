import { journey } from "../content/site";
import { Reveal, SectionHeading } from "./primitives";

export default function Journey() {
  return (
    <section id="journey" className="section-anchor py-24">
      <div className="mx-auto max-w-5xl px-5">
        <Reveal>
          <SectionHeading
            eyebrow="My Journey"
            title="Where I've been"
            intro="Education, research, and work across Macau, New York, Sydney, Beijing, Kunshan, and Hong Kong."
          />
        </Reveal>

        <ol className="relative ml-2 mt-10 border-l border-border pl-8">
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
                <h3 className="mt-1 font-serif text-lg text-navy">{stop.title}</h3>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate">
                  {stop.detail}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
