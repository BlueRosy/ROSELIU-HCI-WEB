import { Repeat } from "lucide-react";

/**
 * Floating control to compare the two design versions.
 * Original lives at "/", the new Editorial version at "/new".
 * Uses full-page links so each version loads cleanly without
 * shared animation / 3D state leaking between them.
 */
export default function VersionSwitch({ isNew }: { isNew: boolean }) {
  return (
    <div className="fixed bottom-4 right-4 z-[70] flex items-center gap-3 rounded-full border border-border bg-white/85 px-4 py-2 shadow-lift backdrop-blur">
      <span className="hidden font-mono text-xs text-slate sm:inline">
        {isNew ? "New · Editorial" : "Original"}
      </span>
      <a
        href={isNew ? "/" : "/new"}
        className="inline-flex items-center gap-1.5 rounded-full bg-navy px-3.5 py-1.5 text-xs font-medium text-white transition hover:translate-y-[-1px] hover:shadow-lift"
      >
        <Repeat size={13} />
        {isNew ? "View Original" : "View New"}
      </a>
    </div>
  );
}
