import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

type MobileTypewriterProps = {
  lines: readonly string[];
  className?: string;
};

type Phase = "typing" | "holding" | "erasing" | "gap";

/**
 * Cycles lines with a typewriter feel: type each line, hold, erase, repeat.
 * Falls back to static stacked lines when reduced motion is preferred.
 */
export default function MobileTypewriter({ lines, className = "" }: MobileTypewriterProps) {
  const reduceMotion = useReducedMotion();
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [completed, setCompleted] = useState<string[]>([]);

  const active = lines[lineIndex] ?? "";

  useEffect(() => {
    if (reduceMotion || lines.length === 0) return;

    let delay = 42;
    if (phase === "typing") delay = 38 + (active[charIndex] === " " ? 28 : 0);
    if (phase === "holding") delay = lineIndex === lines.length - 1 ? 1600 : 520;
    if (phase === "erasing") delay = 22;
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
  }, [reduceMotion, lines, lineIndex, charIndex, phase, active, completed]);

  if (reduceMotion) {
    return (
      <div className={`about-mobile-typewriter ${className}`.trim()}>
        {lines.map((line) => (
          <p key={line} className="about-mobile-typewriter__line">
            {line}
          </p>
        ))}
      </div>
    );
  }

  const currentText = active.slice(0, charIndex);
  const showCursor = phase === "typing" || phase === "holding" || phase === "erasing";

  return (
    <div className={`about-mobile-typewriter ${className}`.trim()} aria-live="polite">
      <span className="sr-only">{lines.join(" ")}</span>
      {completed.map((line) => (
        <p key={line} className="about-mobile-typewriter__line" aria-hidden>
          {line}
        </p>
      ))}
      <p className="about-mobile-typewriter__line about-mobile-typewriter__line--active" aria-hidden>
        {currentText}
        {showCursor && <span className="about-mobile-typewriter__cursor" />}
      </p>
    </div>
  );
}
