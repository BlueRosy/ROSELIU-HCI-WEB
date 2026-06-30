import { news, type NewsItem } from "../content/site";
import { Reveal, SectionHeading } from "./primitives";

const TAG_TONE: Record<NonNullable<NewsItem["tag"]>, string> = {
  Talk: "border-primary/40 bg-primary/10 text-primary-deep",
  Paper: "border-accent/40 bg-accent/10 text-accent-deep",
  Role: "border-border bg-slate/5 text-slate",
  Award: "border-primary/40 bg-primary/10 text-primary-deep",
  Manuscript: "border-accent/30 bg-accent/5 text-accent-deep",
};

export default function News() {
  const featured = news.filter((n) => n.featured);
  const timeline = news;

  return (
    <section id="news" className="section-anchor py-24">
      <div className="mx-auto max-w-5xl px-5">
        <Reveal>
          <SectionHeading
            eyebrow="News & Updates"
            title="What I've been building, writing, and presenting"
            intro="Recent talks, papers, roles, and milestones."
          />
        </Reveal>

        {/* Featured updates */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {featured.map((item, i) => (
            <Reveal key={`featured-${item.date}-${i}`} delay={i * 0.06}>
              <article className="glass flex h-full flex-col rounded-2xl p-6 shadow-soft">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-xs text-primary/70">{item.date}</span>
                  {item.tag && (
                    <span
                      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${TAG_TONE[item.tag]}`}
                    >
                      {item.tag}
                    </span>
                  )}
                </div>
                {item.title && (
                  <h3 className="mt-3 font-serif text-xl text-ink">{item.title}</h3>
                )}
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate">{item.text}</p>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Timeline */}
        {timeline.length > 0 && (
          <div className="mt-12">
            <Reveal>
              <h3 className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-slate">
                Full timeline
              </h3>
            </Reveal>
            <ol className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface/60">
              {timeline.map((item, i) => (
                <li key={`timeline-${item.date}-${i}`}>
                  <Reveal delay={i * 0.04}>
                    <div className="flex flex-col gap-2 px-5 py-4 transition hover:bg-primary/[0.03] sm:flex-row sm:items-baseline sm:gap-6">
                      <span className="w-28 shrink-0 font-mono text-sm text-primary/70">
                        {item.date}
                      </span>
                      <div className="flex flex-1 flex-wrap items-baseline gap-x-3 gap-y-2">
                        <p className="flex-1 text-[15px] leading-relaxed text-ink">
                          {item.text}
                        </p>
                        {item.tag && (
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${TAG_TONE[item.tag]}`}
                          >
                            {item.tag}
                          </span>
                        )}
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
