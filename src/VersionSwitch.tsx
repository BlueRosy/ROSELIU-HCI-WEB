import { Repeat } from "lucide-react";

/**
 * Toggle between main hero (/) and h6 comparison (/new).
 */
export default function VersionSwitch({ isH6Compare }: { isH6Compare: boolean }) {
  return (
    <div className="fixed bottom-4 right-4 z-[70] flex items-center gap-3 rounded-full border border-border bg-surface/90 px-4 py-2 shadow-lift backdrop-blur">
      <span className="hidden font-mono text-xs text-slate sm:inline">
        {isH6Compare ? "Compare · h6 Hero" : "Main · h1 Hero"}
      </span>
      <a
        href={isH6Compare ? "/" : "/new"}
        className="inline-flex items-center gap-1.5 rounded-full bg-primary-deep px-3.5 py-1.5 text-xs font-medium text-white transition hover:translate-y-[-1px] hover:bg-primary hover:shadow-lift"
      >
        <Repeat size={13} />
        {isH6Compare ? "View Main (h1)" : "Compare h6"}
      </a>
    </div>
  );
}
