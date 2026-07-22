import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { news, type NewsItem } from "../content/site";
import {
  compareDateDesc,
  isNearTermDate,
} from "../lib/contentDate";
import CardBotanicalAccent from "./botanical/CardBotanicalAccent";
import NewsVineTimeline from "./botanical/NewsVineTimeline";
import { Reveal, SectionHeading } from "./primitives";

const TAG_TONE: Record<NonNullable<NewsItem["tag"]>, string> = {
  Talk: "border-primary/40 bg-primary/10 text-primary-deep",
  Paper: "border-accent/40 bg-accent/10 text-accent-deep",
  Role: "border-border bg-slate/5 text-slate",
  Award: "border-primary/40 bg-primary/10 text-primary-deep",
  Manuscript: "border-accent/30 bg-accent/5 text-accent-deep",
};

function TimelineRow({ item }: { item: NewsItem }) {
  return (
    <div className="flex flex-col gap-2 px-5 py-4 transition hover:bg-primary/[0.03] sm:flex-row sm:items-baseline sm:gap-6">
      <span className="w-28 shrink-0 font-mono text-sm text-primary/70">
        {item.date}
      </span>
      <div className="flex flex-1 flex-wrap items-baseline gap-x-3 gap-y-2">
        <p className="flex-1 text-[15px] leading-relaxed text-ink">
          {item.title ? (
            <>
              <span className="font-medium text-ink">{item.title}. </span>
              {item.text}
            </>
          ) : (
            item.text
          )}
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
  );
}

export default function News() {
  const [expanded, setExpanded] = useState(false);

  const sorted = useMemo(
    () => [...news].sort((a, b) => compareDateDesc(a.date, b.date)),
    [],
  );

  const featured = useMemo(
    () => sorted.filter((n) => n.featured),
    [sorted],
  );

  const { nearTerm, older } = useMemo(() => {
    const near: NewsItem[] = [];
    const rest: NewsItem[] = [];
    for (const item of sorted) {
      if (isNearTermDate(item.date)) near.push(item);
      else rest.push(item);
    }
    return { nearTerm: near, older: rest };
  }, [sorted]);

  const visibleCount = nearTerm.length + (expanded ? older.length : 0);

  return (
    <section id="news" className="section-anchor pt-10 pb-24 sm:pt-12 lg:pt-14">
      <div className="mx-auto max-w-5xl px-5">
        <Reveal>
          <SectionHeading
            eyebrow="News & Updates"
            title="What I've been building, writing, and presenting"
            intro="Recent talks, papers, roles, and milestones."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((item, i) => (
            <Reveal key={`featured-${item.date}-${item.title ?? i}`} delay={i * 0.06}>
              <article className="glass relative flex h-full flex-col overflow-hidden rounded-2xl p-6 shadow-soft">
                <CardBotanicalAccent position="top-right" className="opacity-10" />
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
                  <h3 className="mt-3 font-serif text-xl leading-snug text-ink">
                    {item.title}
                  </h3>
                )}
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate">{item.text}</p>
              </article>
            </Reveal>
          ))}
        </div>

        {sorted.length > 0 && (
          <div className="mt-12">
            <Reveal>
              <div className="mb-6 flex items-center gap-2.5">
                <svg
                  className="h-4 w-6 shrink-0 opacity-50"
                  viewBox="0 0 24 16"
                  aria-hidden="true"
                >
                  <path
                    d="M2 14 C6 10, 10 6, 14 4 S20 2, 22 2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    className="text-sage"
                  />
                  <circle cx="22" cy="2" r="1.5" className="fill-primary/50" />
                </svg>
                <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-slate">
                  Full timeline
                </h3>
              </div>
            </Reveal>
            <div className="relative sm:pl-10">
              <NewsVineTimeline itemCount={Math.max(visibleCount, 1)} />
              <ol className="overflow-hidden rounded-2xl border border-border bg-surface/60">
                {nearTerm.map((item, i) => (
                  <li key={`near-${item.date}-${item.title ?? i}`}>
                    <Reveal delay={i * 0.04}>
                      <TimelineRow item={item} />
                    </Reveal>
                  </li>
                ))}
              </ol>

              {older.length > 0 && (
                <div className="mt-3">
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <ol
                        className={`overflow-y-auto rounded-2xl border border-border bg-surface/60 ${
                          expanded ? "max-h-[min(22rem,50vh)]" : "max-h-0 border-0"
                        }`}
                      >
                        {older.map((item, i) => (
                          <li key={`older-${item.date}-${item.title ?? i}`}>
                            <TimelineRow item={item} />
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setExpanded((v) => !v)}
                      aria-expanded={expanded}
                      className="glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm text-slate shadow-soft transition hover:text-primary-deep"
                    >
                      {expanded ? "Show less" : "Show earlier timeline"}
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-300 ${
                          expanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
