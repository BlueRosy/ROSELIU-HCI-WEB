import { useEffect, type MutableRefObject } from "react";
import type { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  isCinematicLocked,
  isScrollTweenActive,
  nextSection,
  prevSection,
  scrollToSection,
  TRAIL_SECTION_SCROLL_DURATION,
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
      if (isScrollTweenActive() || isCinematicLocked()) return;

      const current = activeSectionRef.current;
      const target = forward ? nextSection(current) : prevSection(current);
      if (target === current) return;

      scrollToSection(target, scrollTriggerRef.current, {
        duration: TRAIL_SECTION_SCROLL_DURATION,
        ease: "power2.inOut",
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
