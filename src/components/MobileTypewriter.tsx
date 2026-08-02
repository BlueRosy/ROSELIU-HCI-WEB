import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type MobileTypewriterProps = {
  lines: readonly string[];
  className?: string;
  /** When false, type through once and keep the final lines. Default true = erase & retype. */
  loop?: boolean;
  /** ms per character while typing. */
  typeMs?: number;
};

type Phase = "typing" | "holding" | "erasing" | "gap";

/**
 * Waits until in view before typing. With loop, holds then erases and retypes.
 */
export default function MobileTypewriter({
  lines,
  className = "",
  loop = true,
  typeMs = 70,
}: MobileTypewriterProps) {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [completed, setCompleted] = useState<string[]>([]);

  const active = lines[lineIndex] ?? "";
  const canRun = Boolean(inView && !reduceMotion && lines.length > 0);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!canRun) return;

    let delay = typeMs;
    if (phase === "typing") delay = typeMs + (active[charIndex] === " " ? 40 : 0);
    if (phase === "holding") delay = lineIndex === lines.length - 1 ? 1400 : 480;
    if (phase === "erasing") delay = 32;
    if (phase === "gap") delay = 420;

    const id = window.setTimeout(() => {
      if (phase === "typing") {
        if (charIndex < active.length) {
          setCharIndex((c) => c + 1);
          return;
        }
        setPhase("holding");
        return;
      }

      if (phase === "holding") {
        if (lineIndex < lines.length - 1) {
          setCompleted((prev) => [...prev, active]);
          setLineIndex((i) => i + 1);
          setCharIndex(0);
          setPhase("typing");
          return;
        }
        if (!loop) {
          // Stay on final text (no erase)
          return;
        }
        setPhase("erasing");
        return;
      }

      if (phase === "erasing") {
        if (charIndex > 0) {
          setCharIndex((c) => c - 1);
          return;
        }
        if (completed.length > 0) {
          const prev = completed[completed.length - 1] ?? "";
          setCompleted((c) => c.slice(0, -1));
          setLineIndex((i) => Math.max(0, i - 1));
          setCharIndex(prev.length);
          return;
        }
        setPhase("gap");
        return;
      }

      // gap → restart
      setLineIndex(0);
      setCharIndex(0);
      setCompleted([]);
      setPhase("typing");
    }, delay);

    return () => window.clearTimeout(id);
  }, [canRun, lines, lineIndex, charIndex, phase, active, completed, loop, typeMs]);

  if (reduceMotion) {
    return (
      <div ref={rootRef} className={`about-mobile-typewriter ${className}`.trim()}>
        {lines.map((line) => (
          <p key={line} className="about-mobile-typewriter__line">
            {line}
          </p>
        ))}
      </div>
    );
  }

  const currentText = active.slice(0, charIndex);

  return (
    <div
      ref={rootRef}
      className={`about-mobile-typewriter ${className}`.trim()}
      aria-live="polite"
    >
      <span className="sr-only">{lines.join(" ")}</span>
      {completed.map((line) => (
        <p key={line} className="about-mobile-typewriter__line" aria-hidden>
          {line}
        </p>
      ))}
      <p
        className="about-mobile-typewriter__line about-mobile-typewriter__line--active"
        aria-hidden
      >
        {currentText}
        <span className="about-mobile-typewriter__cursor" />
      </p>
    </div>
  );
}
