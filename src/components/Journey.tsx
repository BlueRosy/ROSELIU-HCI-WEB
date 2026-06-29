import { journey } from "../content/site";
import { Reveal, SectionHeading } from "./primitives";

function JourneyEntry({
  stop,
  side,
}: {
  stop: (typeof journey)[number];
  side: "left" | "right";
}) {
  return (
    <div
      className={
        side === "left"
          ? "md:text-right"
          : "md:text-left"
      }
    >
      <div
        className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 ${
          side === "left" ? "md:justify-end" : "md:justify-start"
        } justify-center`}
      >
        <span className="font-mono text-xs text-slate">{stop.period}</span>
        <span className="font-mono text-xs text-slate/70">·</span>
        <span className="font-mono text-xs text-slate/70">{stop.place}</span>
      </div>
      <h4 className="mt-1 font-serif text-lg text-navy">{stop.title}</h4>
      <p className="mt-1 text-sm leading-relaxed text-slate">{stop.detail}</p>
    </div>
  );
}

export default function Journey() {
  return (
    <section id="journey" className="section-anchor py-24">
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

        <div className="relative mx-auto mt-14 max-w-4xl">
          <div
            className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-border"
            aria-hidden="true"
          />

          <ol>
            {journey.map((stop, i) => {
              const isLeft = i % 2 === 0;
              return (
                <li key={stop.title} className="relative pb-12 last:pb-0">
                  <Reveal delay={i * 0.05}>
                    {/* Mobile: centered stack */}
                    <div className="flex flex-col items-center text-center md:hidden">
                      <span
                        className="h-3 w-3 shrink-0 rounded-full ring-4 ring-bg"
                        style={{
                          background: "linear-gradient(120deg,#6BA6FF,#F3A6C8)",
                        }}
                      />
                      <div className="mt-4 max-w-md">
                        <JourneyEntry stop={stop} side="left" />
                      </div>
                    </div>

                    {/* Desktop: alternating sides around center axis */}
                    <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:items-start md:gap-x-8">
                      <div className={isLeft ? "pt-0.5" : ""}>
                        {isLeft && <JourneyEntry stop={stop} side="left" />}
                      </div>

                      <div className="relative flex justify-center pt-1.5">
                        <span
                          className="h-3 w-3 shrink-0 rounded-full ring-4 ring-bg"
                          style={{
                            background: "linear-gradient(120deg,#6BA6FF,#F3A6C8)",
                          }}
                        />
                      </div>

                      <div className={!isLeft ? "pt-0.5" : ""}>
                        {!isLeft && <JourneyEntry stop={stop} side="right" />}
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
