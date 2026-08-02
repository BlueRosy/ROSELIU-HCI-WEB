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

function AboutMobileHeader() {
  return (
    <div className="about-mobile-profile text-left md:hidden">
      <div className="flex items-start gap-4">
        <div className="about-avatar about-avatar--calm about-avatar--mobile h-36 w-36 shrink-0">
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
        <div className="min-w-0 flex-1 pt-1">
          <MobileTypewriter
            lines={[about.greeting]}
            loop
            typeMs={70}
            className="about-desktop-typewriter about-desktop-typewriter--mobile"
          />
          <AboutContacts stacked />
        </div>
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
      <div className="relative mx-auto max-w-6xl px-5 md:px-6 lg:px-8">
        <div className="about-with-news xl:grid xl:grid-cols-[240px_minmax(0,1fr)] xl:items-start xl:gap-8 2xl:grid-cols-[260px_minmax(0,1fr)] 2xl:gap-10">
          {/* Left floating sidebar — not in the intro→projects flow */}
          <aside className="news-sidebar hidden xl:block" aria-label="Recent news">
            <div className="news-sidebar__float">
              <CompactNews />
            </div>
          </aside>

          {/* Main column: intro → rule → projects */}
          <div className="about-main min-w-0">
            <div className="max-w-3xl md:max-w-4xl">
              <div className="space-y-8 md:hidden">
                <Reveal>
                  <AboutMobileHeader />
                </Reveal>
                <Reveal delay={0.06}>
                  <div className="about-bio__body max-w-xl space-y-3.5">
                    {about.paragraphs.map((p, i) => (
                      <p
                        key={i}
                        className="font-sans text-[13.5px] leading-[1.7] text-ink/90"
                      >
                        {i === 0 ? highlightTopics(p, about.topics) : p}
                      </p>
                    ))}
                    {profile.seekingPhd && (
                      <p className="font-sans text-[13.5px] leading-[1.7] text-primary-deep">
                        {about.seekingLine}
                      </p>
                    )}
                  </div>
                </Reveal>
              </div>

              <div className="about-intro-grid hidden md:grid md:grid-cols-[minmax(0,1fr)_200px] md:items-start md:gap-8 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-10">
                <AboutBio />
                <Reveal delay={0.04} className="min-w-0">
                  <AboutIdentityCard />
                </Reveal>
              </div>
            </div>

            <Reveal>
              <hr className="mt-12 border-border/80 md:mt-14" />
            </Reveal>

            <Reveal delay={0.06} className="mt-8">
              <ResearchProjectRows showIntro />
            </Reveal>

            {/* Mobile / tablet: news after main content, never between intro & projects */}
            <Reveal delay={0.08} className="mt-10 xl:hidden">
              <CompactNews />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
