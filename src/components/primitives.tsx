import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/** Subtle scroll-reveal wrapper (respects reduced motion; safe with overflow parents). */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08, margin: "120px 0px 120px 0px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-gradient-static">
        {eyebrow}
      </p>
      <h2 className="mt-2.5 font-serif text-[1.65rem] leading-tight text-ink sm:mt-3 sm:text-3xl lg:text-[2.15rem] xl:text-4xl">
        {title}
      </h2>
      {intro && (
        <p className="mt-3 text-sm leading-relaxed text-slate sm:mt-4 sm:text-[15px] lg:text-base">
          {intro}
        </p>
      )}
    </div>
  );
}

export function Chip({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: "neutral" | "primary" | "accent";
  className?: string;
}) {
  const tones = {
    neutral: "border-border bg-surface/70 text-slate",
    primary:
      "border-primary/30 bg-primary/10 text-primary-deep",
    accent: "border-accent/40 bg-accent/10 text-accent-deep",
  } as const;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 font-mono text-xs ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

const STATUS_TONE: Record<string, string> = {
  Presentation: "border-primary/40 bg-primary/10 text-primary-deep",
  "Under Review": "border-accent/40 bg-accent/10 text-accent-deep",
  "In Preparation": "border-border bg-slate/5 text-slate",
  "Target Venue": "border-border bg-slate/5 text-slate",
};

export function StatusBadge({ status }: { status: string }) {
  const tone = STATUS_TONE[status] ?? STATUS_TONE["In Preparation"];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${tone}`}
    >
      {status}
    </span>
  );
}
