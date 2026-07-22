import { Link } from "react-router-dom";
import { ArrowRight, Compass } from "lucide-react";
import { about } from "../content/site";

/** Looking forward + Research World. */
export default function AboutDirectionCard({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="about-mobile-direction border-t border-border/70 pt-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-primary-deep">
          Looking forward
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-slate">{about.lookingForward}</p>
        <Link
          to={about.researchWorldLink.href}
          state={{ from: "/#about" }}
          title={about.researchWorldLink.hint}
          className="group mt-3 inline-flex items-center gap-1.5 text-[14px] font-medium text-primary-deep"
        >
          {about.researchWorldLink.label}
          <ArrowRight size={14} className="transition group-hover:translate-x-0.5" aria-hidden />
        </Link>
      </div>
    );
  }

  return (
    <div className="glass relative overflow-hidden rounded-2xl border border-border/80 p-5 shadow-soft sm:p-6">
      <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-primary-deep">
        <Compass size={13} className="shrink-0" aria-hidden />
        Looking forward
      </p>
      <p className="mt-2.5 text-[13.5px] leading-relaxed text-slate">
        {about.lookingForward}
      </p>

      <Link
        to={about.researchWorldLink.href}
        state={{ from: "/#about" }}
        title={about.researchWorldLink.hint}
        className="group mt-5 block rounded-xl border border-primary/25 bg-gradient-to-br from-primary/[0.07] to-sage/10 p-4 transition hover:border-primary/45"
      >
        <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-primary-deep">
          {about.researchWorldLink.label}
          <ArrowRight
            size={13}
            className="transition group-hover:translate-x-0.5"
            aria-hidden
          />
        </p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-slate">
          {about.researchWorldLink.description}
        </p>
        <p className="mt-2 font-mono text-[10px] tracking-wide text-slate/75">
          {about.researchWorldLink.tags}
        </p>
      </Link>
    </div>
  );
}
