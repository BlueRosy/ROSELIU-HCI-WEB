import { useEffect, type MutableRefObject } from "react";
import type { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  nextSection,
  prevSection,
  scrollToSection,
} from "./trailScrollUtils";
import type { ScrollSection } from "./worldTrailConfig";

export function useTrailKeyboard(
  activeSectionRef: MutableRefObject<ScrollSection>,
  scrollTriggerRef: MutableRefObject<ScrollTrigger | null>,
  invalidateRef: MutableRefObject<() => void>,
  isScrollingRef: MutableRefObject<boolean>,
  scrollProgressRef: MutableRefObject<number>,
  onSectionChange: (section: ScrollSection) => void,
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

      const current = activeSectionRef.current;
      const target = forward ? nextSection(current) : prevSection(current);
      scrollToSection(target, scrollTriggerRef.current, {
        duration: 0.5,
        invalidate: () => invalidateRef.current(),
        isScrollingRef,
        scrollProgressRef,
        activeSectionRef,
        onSectionChange,
      });
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    activeSectionRef,
    scrollTriggerRef,
    invalidateRef,
    isScrollingRef,
    scrollProgressRef,
    onSectionChange,
  ]);
}
