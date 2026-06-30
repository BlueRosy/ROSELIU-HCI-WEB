import { useLayoutEffect, useRef, useState } from "react";
import { journey } from "../content/site";
import CardBotanicalAccent from "./botanical/CardBotanicalAccent";
import JourneyVineAxis from "./botanical/JourneyVineAxis";
import { Reveal, SectionHeading } from "./primitives";

function JourneyEntry({
  stop,
  side,
}: {
  stop: (typeof journey)[number];
  side: "left" | "right";
}) {
  return (
    <div className={side === "left" ? "md:text-right" : "md:text-left"}>
      <div
        className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 ${
          side === "left" ? "md:justify-end" : "md:justify-start"
        } justify-center`}
      >
        <span className="font-mono text-xs text-slate">{stop.period}</span>
        <span className="font-mono text-xs text-slate/70">·</span>
        <span className="font-mono text-xs text-slate/70">{stop.place}</span>
      </div>
      <h4 className="mt-1 font-serif text-lg text-ink">{stop.title}</h4>
      <p className="mt-1 text-sm leading-relaxed text-slate">{stop.detail}</p>
    </div>
  );
}

function JourneyNode() {
  return (
    <div className="relative flex w-10 shrink-0 justify-center pt-1.5">
      <span
        data-journey-node
        className="accent-dot relative z-10 h-3 w-3 shrink-0 rounded-full ring-4 ring-bg"
      />
    </div>
  );
}

export default function Journey() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [axis, setAxis] = useState({ nodeYs: [] as number[], width: 0, height: 0 });

  useLayoutEffect(() => {
    const root = timelineRef.current;
    if (!root) return;

    const measure = () => {
      const rect = root.getBoundingClientRect();
      const nodes = root.querySelectorAll<HTMLElement>("[data-journey-node]");
      const nodeYs = Array.from(nodes)
        .filter((node) => node.offsetParent !== null)
        .map((node) => {
        const n = node.getBoundingClientRect();
        return n.top + n.height / 2 - rect.top;
      });
      setAxis({
        nodeYs,
        width: rect.width,
        height: rect.height,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section id="journey" className="section-anchor section-alt py-24">
      <div className="mx-auto max-w-5xl px-5">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <SectionHeading
              eyebrow="Journey"
              title="Where I've been"
              intro="A longer timeline of how my path moved across economics, data engineering, front-end systems, and eventually HCI research on everyday wellbeing."
            />
          </div>
        </Reveal>

        <div ref={timelineRef} className="relative mx-auto mt-14 max-w-4xl">
          <JourneyVineAxis
            nodeYs={axis.nodeYs}
            width={axis.width}
            height={axis.height}
          />

          <ol>
            {journey.map((stop, i) => {
              const isLeft = i % 2 === 0;
              return (
                <li key={stop.title} className="relative pb-12 last:pb-0">
                  <Reveal delay={i * 0.05}>
                    <div className="flex flex-col items-center text-center md:hidden">
                      <JourneyNode />
                      <div className="relative mt-4 max-w-md overflow-hidden rounded-xl border border-border/60 bg-surface/50 p-4">
                        <CardBotanicalAccent position="top-right" className="opacity-[0.12]" />
                        <JourneyEntry stop={stop} side="left" />
                      </div>
                    </div>

                    <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:items-start md:gap-x-8">
                      <div className={isLeft ? "pt-0.5" : ""}>
                        {isLeft && (
                          <div className="relative overflow-hidden rounded-xl border border-border/60 bg-surface/50 p-4">
                            <CardBotanicalAccent position="top-right" className="opacity-[0.12]" />
                            <JourneyEntry stop={stop} side="left" />
                          </div>
                        )}
                      </div>

                      <JourneyNode />

                      <div className={!isLeft ? "pt-0.5" : ""}>
                        {!isLeft && (
                          <div className="relative overflow-hidden rounded-xl border border-border/60 bg-surface/50 p-4">
                            <CardBotanicalAccent position="bottom-left" className="opacity-[0.12]" />
                            <JourneyEntry stop={stop} side="right" />
                          </div>
                        )}
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
