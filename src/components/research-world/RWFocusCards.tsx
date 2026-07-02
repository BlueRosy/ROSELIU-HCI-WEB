import { useState } from "react";
import type { FocusCard } from "../../content/site";

export default function RWFocusCards({ cards }: { cards: FocusCard[] }) {
  const [open, setOpen] = useState<number | null>(null);

  if (!cards.length) return null;

  return (
    <ul className="mt-5 grid gap-2 sm:grid-cols-2">
      {cards.map((card, i) => {
        const isOpen = open === i;
        return (
          <li key={card.title}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className={`w-full rounded-xl border px-3 py-2.5 text-left transition ${
                isOpen
                  ? "border-primary/40 bg-primary/10 shadow-soft"
                  : "border-border/80 bg-surface/60 hover:border-primary/25 hover:bg-primary/5"
              }`}
            >
              <span className="font-medium text-sm text-ink">{card.title}</span>
              {isOpen && (
                <p className="mt-1.5 text-xs leading-relaxed text-slate">{card.body}</p>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
