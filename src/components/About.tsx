import { about, currentLens, interests, profile } from "../content/site";
import { Chip, Reveal, SectionHeading } from "./primitives";

export default function About() {
  return (
    <section id="about" className="section-anchor py-24">
      <div className="mx-auto max-w-5xl px-5">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.55fr] lg:items-start">
          <Reveal>
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

              <div className="mt-8">
                <p className="mb-2 font-mono text-xs uppercase tracking-[0.14em] text-slate">
                  Beyond research
                </p>
                <div className="flex flex-wrap gap-2">
                  {interests.map((t) => (
                    <Chip key={t} tone="accent">
                      {t}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="glass rounded-2xl p-6 shadow-soft lg:sticky lg:top-28">
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="about-avatar mb-4">
                  <div className="about-avatar__halo" aria-hidden="true" />
                  <div className="about-avatar__ring">
                    <div className="about-avatar__photo">
                      <img
                        src={profile.aboutPhoto}
                        alt={`Portrait of ${profile.name}`}
                        className="h-full w-full object-cover object-[center_22%]"
                      />
                    </div>
                  </div>
                </div>
                <p className="font-serif text-lg text-navy">{profile.name}</p>
                <p className="mt-0.5 font-mono text-xs text-slate">{profile.nameZh}</p>
              </div>

              <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary-deep">
                Current Lens
              </p>
              <ul className="mt-4 space-y-3">
                {currentLens.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-[15px] leading-relaxed text-navy"
                  >
                    <span className="accent-dot inline-block h-2 w-2 shrink-0 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-border pt-4 font-mono text-xs leading-relaxed text-slate">
                Looking for PhD opportunities in HCI · Human-Centered AI · Digital Wellbeing ·
                Emotional Computing
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
