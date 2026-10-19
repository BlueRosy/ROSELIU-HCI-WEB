import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { about, profile } from "../content/site";
import AboutIdentityCard from "./AboutIdentityCard";
import AboutContacts from "./AboutContacts";
import ResearchProjectRows from "./ResearchProjectRows";
import CompactNews from "./CompactNews";
import CompactPublications from "./CompactPublications";
import { Reveal } from "./primitives";

/** max-height = space down to viewport bottom minus margin; card itself scrolls. */
function NewsSidebarFloat() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const top = el.getBoundingClientRect().top;
      const maxH = window.innerHeight - top - 12;
      if (maxH > 0) el.style.maxHeight = `${maxH}px`;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={ref} className="news-sidebar__float">
      <CompactNews />
    </div>
  );
}

function highlightTopics(text: string, topics: readonly string[]) {
  let remaining = text;
  const nodes: ReactNode[] = [];
  let key = 0;

  while (remaining.length > 0) {
    let earliest = -1;
    let matched = "";
    for (const topic of topics) {
      const idx = remaining.toLowerCase().indexOf(topic.toLowerCase());
      if (idx >= 0 && (earliest < 0 || idx < earliest)) {
        earliest = idx;
        matched = remaining.slice(idx, idx + topic.length);
      }
    }
    if (earliest < 0) {
      nodes.push(remaining);
      break;
    }
    if (earliest > 0) nodes.push(remaining.slice(0, earliest));
    nodes.push(
      <strong key={key++} className="font-medium text-ink">
        {matched}
      </strong>,
    );
    remaining = remaining.slice(earliest + matched.length);
  }

  return nodes;
}

function AboutBio() {
  return (
    <div className="about-bio">
      <h1 className="about-greeting">{about.greeting}</h1>

      <Reveal delay={0.08}>
        <div className="about-bio__body mt-5 space-y-3.5">
          {about.paragraphs.map((p, i) => (
            <p
              key={i}
              className="font-sans text-[13.5px] leading-[1.7] text-ink/90 md:text-[14px]"
            >
              {i === 0 ? highlightTopics(p, about.topics) : p}
            </p>
          ))}
          {profile.seekingPhd && (
            <p className="font-sans text-[13.5px] leading-[1.7] text-primary-deep md:text-[14px]">
              {about.seekingLine}
            </p>
          )}
        </div>
      </Reveal>
    </div>
  );
}

/** Mobile: portrait on top → greeting → contacts → bio. */
function AboutMobileStack() {
  return (
    <div className="about-mobile-stack md:hidden">
      <Reveal>
        <div className="about-mobile-stack__hero">
          <div className="about-avatar about-avatar--calm about-avatar--mobile">
            <div className="about-avatar__ring">
              <div className="about-avatar__photo">
                <img
                  src={profile.aboutPhoto}
                  alt={`Portrait of ${profile.name}`}
                  className="about-avatar__img h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          <h1 className="about-greeting about-greeting--mobile mt-5">
            {about.greeting}
          </h1>

          <AboutContacts stacked centered />
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="about-mobile-stack__bio mt-7 space-y-3.5">
          {about.paragraphs.map((p, i) => (
            <p key={i} className="about-mobile-stack__p">
              {i === 0 ? highlightTopics(p, about.topics) : p}
            </p>
          ))}
          {profile.seekingPhd && (
            <p className="about-mobile-stack__p about-mobile-stack__p--seek">
              {about.seekingLine}
            </p>
          )}
        </div>
      </Reveal>
    </div>
  );
}

/** Phone / narrow: edge tab → left slide-out panel (sidebar shows from lg). */
function MobileNewsDrawer() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className={`news-drawer xl:hidden${open ? " news-drawer--open" : ""}`}>
      {!open ? (
        <button
          type="button"
          className="news-drawer__tab"
          aria-expanded={false}
          aria-controls={panelId}
          onClick={() => setOpen(true)}
        >
          News
        </button>
      ) : null}

      <div
        className="news-drawer__layer"
        role="presentation"
        aria-hidden={!open}
      >
        <button
          type="button"
          className="news-drawer__scrim"
          tabIndex={open ? 0 : -1}
          aria-label="Fold news"
          onClick={() => setOpen(false)}
        />
        <aside
          id={panelId}
          className="news-drawer__panel"
          role="dialog"
          aria-label="Recent news"
        >
          <div className="news-drawer__head">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate">
                Recent news
              </p>
              <p className="mt-0.5 text-[12px] text-slate/70">
                Highlights & updates
              </p>
            </div>
            <button
              type="button"
              className="news-drawer__fold"
              aria-label="Fold news panel"
              onClick={() => setOpen(false)}
            >
              <ChevronLeft size={16} aria-hidden />
              <span>Fold</span>
            </button>
          </div>
          <div className="news-drawer__body">
            <CompactNews bare />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section
      id="about"
      className="about-section relative isolate pt-20 pb-14 sm:pt-24 sm:pb-16 md:pt-28 md:pb-20"
    >
      {/* Same .site-shell as header (logo ↔ nav pill) */}
      <div className="site-shell relative">
        <div className="about-with-news xl:grid xl:grid-cols-[280px_minmax(0,1fr)] xl:items-start xl:gap-10">
          {/* xl+ (≥1280): left identity + news — same ratio through wide screens */}
          <div className="about-left-rail">
            <Reveal className="w-full min-w-0">
              <AboutIdentityCard />
            </Reveal>
            <aside className="news-sidebar" aria-label="Recent news">
              <NewsSidebarFloat />
            </aside>
          </div>

          <div className="about-main min-w-0">
            <AboutMobileStack />

            {/* md–lg: bio + profile right; news via drawer (no mid-width layout flip) */}
            <div className="about-intro-grid hidden md:grid md:grid-cols-[minmax(0,1fr)_17rem] md:items-start md:gap-8 xl:hidden">
              <AboutBio />
              <Reveal
                delay={0.04}
                className="about-profile-rail-wrap min-w-0 self-start"
              >
                <AboutIdentityCard />
              </Reveal>
            </div>

            {/* xl+: bio in main column beside left rail */}
            <div className="hidden xl:block">
              <AboutBio />
            </div>

            <Reveal>
              <hr className="about-section-rule mt-10 border-border/80 md:mt-14" />
            </Reveal>

            <Reveal delay={0.06} className="mt-7 md:mt-8">
              <ResearchProjectRows showIntro />
            </Reveal>

            <Reveal delay={0.08}>
              <hr className="about-section-rule mt-12 border-border/80 md:mt-14" />
            </Reveal>

            <Reveal delay={0.1} className="mt-7 md:mt-8">
              <CompactPublications />
            </Reveal>
          </div>
        </div>
      </div>

      <MobileNewsDrawer />
    </section>
  );
}
