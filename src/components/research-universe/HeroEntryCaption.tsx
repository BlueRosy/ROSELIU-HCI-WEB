import { useEffect, useRef } from "react";
import gsap from "gsap";
import { researchAtlas, researchWorld } from "../../content/site";

type HeroEntryCaptionProps = {
  visible: boolean;
};

export default function HeroEntryCaption({ visible }: HeroEntryCaptionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    if (!visible || animated.current || !rootRef.current) return;
    animated.current = true;

    const els = rootRef.current.querySelectorAll("[data-hero-part]");
    gsap.fromTo(
      els,
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.18,
        ease: "sine.out",
      },
    );
  }, [visible]);

  return (
    <div
      ref={rootRef}
      className={`pointer-events-auto glass-hero trail-caption--hero mx-auto max-w-2xl rounded-2xl border border-primary/15 p-8 text-center shadow-lift ring-1 ring-primary/10 ${
        visible ? "trail-caption--hero-visible" : "trail-caption--hero-hidden"
      }`}
    >
      <p
        data-hero-part
        className="font-mono text-xs uppercase tracking-[0.2em] text-gradient-static"
      >
        {researchWorld.subtitle}
      </p>
      <h1
        data-hero-part
        className="mt-4 font-serif text-4xl leading-tight text-ink sm:text-5xl"
      >
        {researchWorld.title}
      </h1>
      <p
        data-hero-part
        className="mt-4 text-base leading-relaxed text-slate sm:text-lg"
      >
        {researchWorld.intro}
      </p>
      <p
        data-hero-part
        className="mx-auto mt-6 max-w-lg rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 font-serif text-lg italic text-ink"
      >
        {researchAtlas.researchQuestion}
      </p>
    </div>
  );
}
