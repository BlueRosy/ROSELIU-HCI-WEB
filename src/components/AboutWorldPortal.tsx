import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { about } from "../content/site";

export default function AboutWorldPortal() {
  return (
    <Link
      to={about.researchWorldLink.href}
      title={about.researchWorldLink.hint}
      className="rw-portal-card group block rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/8 to-sage/10 p-5 shadow-soft transition hover:border-primary/50 hover:shadow-soft"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary-deep">
          <Sparkles size={16} />
        </span>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary-deep">
            ✦ {about.researchWorldLink.label} →
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-slate">
            {about.researchWorldLink.description}
          </p>
          <p className="mt-2 font-mono text-[10px] tracking-wide text-slate/80">
            {about.researchWorldLink.tags}
          </p>
        </div>
      </div>
    </Link>
  );
}
