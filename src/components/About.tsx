import type { ReactNode } from "react";
import { about, profile } from "../content/site";
import AboutIdentityCard from "./AboutIdentityCard";
import AboutContacts from "./AboutContacts";
import MobileTypewriter from "./MobileTypewriter";
import ResearchProjectRows from "./ResearchProjectRows";
import CompactNews from "./CompactNews";
import { Reveal } from "./primitives";

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
      <MobileTypewriter
        lines={[about.greeting]}
        loop
        typeMs={70}
        className="about-desktop-typewriter"
      />

      <Reveal delay={0.15}>
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

          <MobileTypewriter
            lines={[about.greeting]}
            loop
            typeMs={70}
            className="about-desktop-typewriter about-desktop-typewriter--mobile mt-5"
          />

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

export default function About() {
  return (
    <section
      id="about"
      className="about-section relative isolate pt-20 pb-14 sm:pt-24 sm:pb-16 md:pt-28 md:pb-20"
    >
      <div className="relative mx-auto max-w-6xl px-5 md:px-6 lg:px-8">
        <div className="about-with-news xl:grid xl:grid-cols-[240px_minmax(0,1fr)] xl:items-start xl:gap-8 2xl:grid-cols-[260px_minmax(0,1fr)] 2xl:gap-10">
          {/* Desktop-only left news sidebar */}
          <aside
            className="news-sidebar hidden xl:block"
            aria-label="Recent news"
          >
            <div className="news-sidebar__float">
              <CompactNews />
            </div>
          </aside>

          <div className="about-main min-w-0">
            <div className="max-w-3xl md:max-w-4xl">
              <AboutMobileStack />

              <div className="about-intro-grid hidden md:grid md:grid-cols-[minmax(0,1fr)_200px] md:items-start md:gap-8 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-10">
                <AboutBio />
                <Reveal delay={0.04} className="min-w-0">
                  <AboutIdentityCard />
                </Reveal>
              </div>
            </div>

            <Reveal>
              <hr className="about-section-rule mt-10 border-border/80 md:mt-14" />
            </Reveal>

            <Reveal delay={0.06} className="mt-7 md:mt-8">
              <ResearchProjectRows showIntro />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
