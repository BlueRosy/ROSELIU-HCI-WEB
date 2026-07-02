import { useEffect, type MutableRefObject } from "react";
import type { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  nextSection,
  prevSection,
  scrollToSection,
} from "./trailScrollUtils";
import type { ScrollSection } from "./worldTrailConfig";

export function useTrailKeyboard(
  currentSection: ScrollSection,
  scrollTriggerRef: MutableRefObject<ScrollTrigger | null>,
) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const forward =
        e.key === "ArrowDown" ||
        e.key === "ArrowRight" ||
        e.key === " " ||
        e.key === "PageDown";
      const back =
        e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "PageUp";

      if (!forward && !back) return;
      e.preventDefault();

      const target = forward
        ? nextSection(currentSection)
        : prevSection(currentSection);
      scrollToSection(target, scrollTriggerRef.current);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentSection, scrollTriggerRef]);
}
