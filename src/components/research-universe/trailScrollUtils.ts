import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SCROLL_SECTIONS, type ScrollSection } from "./worldTrailConfig";

let activeScrollTween: gsap.core.Tween | null = null;

export function isScrollTweenActive(): boolean {
  return activeScrollTween !== null;
}

export function sectionIndex(section: ScrollSection): number {
  return SCROLL_SECTIONS.indexOf(section);
}

export function progressForSection(section: ScrollSection): number {
  const idx = sectionIndex(section);
  if (idx < 0) return 0;
  return idx / (SCROLL_SECTIONS.length - 1);
}

export function sectionAtProgress(progress: number): ScrollSection {
  const idx = Math.min(
    SCROLL_SECTIONS.length - 1,
    Math.round(progress * (SCROLL_SECTIONS.length - 1)),
  );
  return SCROLL_SECTIONS[idx];
}

export type ScrollToSectionOptions = {
  duration?: number;
  invalidate?: () => void;
  isScrollingRef?: { current: boolean };
};

export function scrollToSection(
  section: ScrollSection,
  scrollTrigger: ScrollTrigger | null,
  options: ScrollToSectionOptions = {},
) {
  if (!scrollTrigger) return;

  activeScrollTween?.kill();
  activeScrollTween = null;

  const { duration = 0.45, invalidate, isScrollingRef } = options;
  const target = progressForSection(section);
  const max = scrollTrigger.end - scrollTrigger.start;
  const y = scrollTrigger.start + target * max;

  if (isScrollingRef) isScrollingRef.current = true;
  scrollTrigger.disable();

  const scrollObj = { y: window.scrollY };
  activeScrollTween = gsap.to(scrollObj, {
    y,
    duration,
    ease: "power3.out",
    onUpdate: () => {
      window.scrollTo(0, scrollObj.y);
      ScrollTrigger.update();
      invalidate?.();
    },
    onComplete: () => {
      scrollTrigger.enable();
      ScrollTrigger.refresh();
      if (isScrollingRef) isScrollingRef.current = false;
      invalidate?.();
      activeScrollTween = null;
    },
  });
}

export function nextSection(current: ScrollSection): ScrollSection {
  const idx = sectionIndex(current);
  return SCROLL_SECTIONS[Math.min(idx + 1, SCROLL_SECTIONS.length - 1)];
}

export function prevSection(current: ScrollSection): ScrollSection {
  const idx = sectionIndex(current);
  return SCROLL_SECTIONS[Math.max(idx - 1, 0)];
}
