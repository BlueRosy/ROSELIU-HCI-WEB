import { Compass } from "lucide-react";
import { about } from "../content/site";

/** Compact right-rail card — balances the About column without stacking more body text on the left. */
export default function AboutLookingForward() {
  return (
    <div className="glass relative overflow-hidden rounded-2xl border border-border/80 p-5 shadow-soft">
      <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-primary-deep">
        <Compass size={13} className="shrink-0" aria-hidden />
        Looking forward
      </p>
      <p className="mt-2.5 text-[13px] leading-relaxed text-slate">
        {about.lookingForward}
      </p>
    </div>
  );
}
