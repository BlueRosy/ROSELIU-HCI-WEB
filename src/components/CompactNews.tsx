import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { news } from "../content/site";
import { compareDateDesc, isWithinRecentMonths } from "../lib/contentDate";

const MAX_ITEMS = 5;

export default function CompactNews() {
  const [open, setOpen] = useState(true);
  const panelId = useId();

  const items = [...news]
    .filter((item) => !item.hideFromRecent)
    .filter(
      (item) =>
        item.tag === "Planned" || isWithinRecentMonths(item.date, 2),
    )
    .sort((a, b) => {
      const rank = (tag?: string) =>
        tag === "Manuscript" ? 0 : tag === "Planned" ? 2 : 1;
      const rd = rank(a.tag) - rank(b.tag);
      if (rd !== 0) return rd;
      return compareDateDesc(a.date, b.date);
    })
    .slice(0, MAX_ITEMS);

  const list =
    items.length > 0
      ? items
      : [...news]
          .filter((item) => !item.hideFromRecent)
          .sort((a, b) => compareDateDesc(a.date, b.date))
          .slice(0, 4);

  return (
    <div className="compact-news rounded-xl border border-border bg-surface">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left transition hover:bg-primary/5 md:px-4"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate">
          Recent news
        </span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-slate transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      <div
        id={panelId}
        className={`compact-news__panel ${open ? "compact-news__panel--open" : ""}`}
      >
        <div className="compact-news__panel-inner px-3.5 pb-3.5 md:px-4 md:pb-4">
          <ol className="compact-news__timeline">
            {list.map((item) => {
              const planned = item.tag === "Planned";
              return (
                <li
                  key={`${item.date}-${item.title}`}
                  className={`compact-news__item${planned ? " compact-news__item--planned" : ""}`}
                >
                  <span className="compact-news__dot" aria-hidden />
                  <div className="compact-news__body min-w-0">
                    <p className="font-mono text-[10px] tabular-nums leading-none text-slate/80">
                      {item.date}
                      {item.tag ? (
                        <span className="text-slate/45"> · {item.tag}</span>
                      ) : null}
                    </p>
                    <p className="mt-1 text-[12px] font-medium leading-snug text-ink">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-slate">
                      {item.text}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
