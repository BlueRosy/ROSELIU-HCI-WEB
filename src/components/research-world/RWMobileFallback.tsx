import { researchWorld, researchWorldAssets } from "../../content/site";
import RWClosedLoopZone from "./RWClosedLoopZone";
import RWZonePanel from "./RWZonePanel";

function LandFallback() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      style={{
        backgroundColor: "#FFFDF8",
        backgroundImage: `url(${researchWorldAssets.land})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
}

export default function RWMobileFallback() {
  const contentZones = researchWorld.zones.slice(1, -1);
  const loopZone = researchWorld.zones[researchWorld.zones.length - 1];

  return (
    <div className="relative z-10">
      <LandFallback />
      <div className="relative mx-auto max-w-2xl space-y-16 px-5 py-28">
        <div className="glass rounded-2xl border border-border/50 p-6 shadow-soft backdrop-blur-md">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gradient-static">
            {researchWorld.subtitle}
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-ink">
            {researchWorld.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate">{researchWorld.intro}</p>
          <p className="mt-4 text-[15px] leading-relaxed text-slate/90">
            {researchWorld.entryBody}
          </p>
        </div>

        {contentZones.map((zone) => (
          <section key={zone.id} id={`rw-${zone.id}`}>
            <RWZonePanel zone={zone} showItems />
          </section>
        ))}

        <section id={`rw-${loopZone.id}`}>
          <RWClosedLoopZone zone={loopZone} />
        </section>
      </div>
    </div>
  );
}
