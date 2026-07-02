import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SCROLL_SECTIONS, type ScrollSection } from "./worldTrailConfig";

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

export function scrollToSection(
  section: ScrollSection,
  scrollTrigger: ScrollTrigger | null,
  duration = 0.85,
) {
  if (!scrollTrigger) return;
  const target = progressForSection(section);
  const max = scrollTrigger.end - scrollTrigger.start;
  const y = scrollTrigger.start + target * max;

  gsap.to(window, {
    scrollTo: y,
    duration,
    ease: "power2.inOut",
    onUpdate: () => ScrollTrigger.update(),
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
