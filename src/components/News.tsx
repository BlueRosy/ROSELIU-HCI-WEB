import { news, type NewsItem } from "../content/site";
import { Reveal, SectionHeading } from "./primitives";

const TAG_TONE: Record<NonNullable<NewsItem["tag"]>, string> = {
  Talk: "border-primary/40 bg-primary/10 text-primary-deep",
  Paper: "border-accent/40 bg-accent/10 text-accent-deep",
  Role: "border-border bg-slate/5 text-slate",
  Award: "border-primary/40 bg-primary/10 text-primary-deep",
};

export default function News() {
  return (
    <section id="news" className="section-anchor py-24">
      <div className="mx-auto max-w-5xl px-5">
        <Reveal>
          <SectionHeading
            eyebrow="News & Updates"
            title="What I've been up to"
            intro="Recent talks, papers, roles, and milestones."
          />
        </Reveal>

        <ol className="mt-10 space-y-1">
          {news.map((item, i) => (
            <li key={`${item.date}-${i}`}>
              <Reveal delay={i * 0.04}>
                <div className="flex flex-col gap-2 rounded-2xl px-4 py-4 transition hover:bg-primary/[0.03] sm:flex-row sm:items-baseline sm:gap-6">
                  <span className="w-24 shrink-0 font-mono text-sm text-primary/70">
                    {item.date}
                  </span>
                  <div className="flex flex-1 flex-wrap items-baseline gap-x-3 gap-y-2">
                    <p className="flex-1 text-[15px] leading-relaxed text-navy">
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
    </section>
  );
}
