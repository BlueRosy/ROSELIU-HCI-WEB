import { publications, type PubStatus } from "../content/site";
import { publicationSortKey } from "../lib/contentDate";
import { StatusBadge } from "./primitives";

const STATUS_RANK: Record<PubStatus, number> = {
  Accepted: 0,
  Presentation: 1,
  "Under Review": 2,
  "In Revision": 3,
  "In Preparation": 4,
  "Target Venue": 5,
};

/** Compact pubs list for the About page (CV-aligned highlights). */
export default function CompactPublications() {
  const list = [...publications].sort((a, b) => {
    const highlight = Number(Boolean(b.highlight)) - Number(Boolean(a.highlight));
    if (highlight !== 0) return highlight;
    const status = STATUS_RANK[a.status] - STATUS_RANK[b.status];
    if (status !== 0) return status;
    return publicationSortKey(b) - publicationSortKey(a);
  });

  return (
    <section className="compact-pubs" aria-labelledby="compact-pubs-heading">
      <h2
        id="compact-pubs-heading"
        className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate"
      >
        Publications & presentations
      </h2>
      <ul className="mt-4 divide-y divide-border/70">
        {list.map((pub) => (
          <li key={pub.title} className="py-3.5 first:pt-0">
            <p className="text-[13.5px] font-medium leading-snug text-ink sm:text-[14px]">
              {pub.title}
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-slate">
              {pub.authors}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-[12px] font-medium text-primary-deep">
                {pub.venue}
              </span>
              <StatusBadge status={pub.status} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
