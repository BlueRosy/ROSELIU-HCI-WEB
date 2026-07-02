import { X } from "lucide-react";
import { rwWonderland } from "../../theme/rwWonderland";
import type { PathNode } from "./rwWorldConfig";

export default function RWCardDetailOverlay({
  node,
  onClose,
}: {
  node: PathNode;
  onClose: () => void;
}) {
  return (
    <div
      className="pointer-events-auto fixed bottom-20 left-4 z-40 w-full max-w-xs md:left-6"
      role="dialog"
      aria-modal="true"
      aria-label="Focus card detail"
    >
      <div
        className="relative rounded-2xl border p-4 shadow-xl backdrop-blur-md"
        style={{
          backgroundColor: rwWonderland.hudBg,
          borderColor: rwWonderland.hudBorder,
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-1 text-slate transition hover:bg-primary/10"
          aria-label="Close"
        >
          <X size={14} />
        </button>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary-deep">
          {node.zoneId}
        </p>
        <h3 className="mt-1 font-serif text-lg text-ink">{node.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate">{node.body}</p>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-slate/70">
          Esc to close
        </p>
      </div>
    </div>
  );
}
