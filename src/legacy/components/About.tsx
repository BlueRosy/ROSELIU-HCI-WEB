import { useState } from "react";
import { about, profile } from "../content/site";
import { Reveal, SectionHeading } from "./primitives";

function Photo() {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20">
        <span className="font-serif text-5xl text-navy/40">YL</span>
        <span className="sr-only">Profile photo placeholder</span>
      </div>
    );
  }
  return (
    <img
      src={profile.photo}
      alt={profile.name}
      onError={() => setFailed(true)}
      className="aspect-[4/5] w-full rounded-2xl object-cover shadow-soft"
    />
  );
}

export default function About() {
  return (
    <section id="about" className="section-anchor py-24">
      <div className="mx-auto max-w-5xl px-5">
        <div className="grid gap-10 md:grid-cols-[0.7fr_1fr] md:items-start">
          <Reveal>
            <div className="mx-auto w-full max-w-xs md:sticky md:top-28">
              <Photo />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
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
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
