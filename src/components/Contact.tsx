import { ArrowUp, Code2, Link, Mail } from "lucide-react";
import { profile } from "../content/site";
import { Reveal, SectionHeading } from "./primitives";

export default function Contact() {
  const socials = [
    { label: "Email", href: `mailto:${profile.email}`, icon: Mail },
    { label: "GitHub", href: profile.socials.github, icon: Code2 },
    { label: "LinkedIn", href: profile.socials.linkedin, icon: Link },
  ];

  return (
    <footer id="contact" className="section-anchor relative overflow-hidden py-24">
      <div className="page-mesh pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-5xl px-5">
        <Reveal>
          <SectionHeading
            eyebrow="Contact"
            title="Let's talk research"
            intro="I am always glad to discuss data-driven wellbeing systems, conversational support, and PhD collaboration."
          />
        </Reveal>

        <Reveal delay={0.08}>
          <a
            href={`mailto:${profile.email}`}
            className="mt-8 inline-block font-serif text-2xl text-ink underline decoration-primary/40 decoration-2 underline-offset-4 transition hover:decoration-accent sm:text-3xl"
          >
            {profile.email}
          </a>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-8 flex flex-wrap gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-4 py-2 text-sm font-medium text-ink transition hover:border-primary/40 hover:text-primary-deep"
              >
                <s.icon size={16} /> {s.label}
              </a>
            ))}
          </div>
        </Reveal>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-sm text-slate sm:flex-row sm:items-center">
          <p>
            &copy; {new Date().getFullYear()} {profile.name} · {profile.nameZh}
          </p>
          <a
            href="#top"
            className="inline-flex items-center gap-1.5 transition hover:text-primary-deep"
          >
            Back to top <ArrowUp size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
