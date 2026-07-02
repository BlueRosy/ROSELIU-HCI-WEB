import { useCallback, useEffect, useState } from "react";
import { hero, researchWorld } from "../content/site";
import RWClosedLoopZone from "../components/research-world/RWClosedLoopZone";
import RWLayout from "../components/research-world/RWLayout";
import RWProgressNav from "../components/research-world/RWProgressNav";
import RWZone from "../components/research-world/RWZone";

export default function SignalsToSupportPage() {
  const [activeZone, setActiveZone] = useState(researchWorld.zones[0].id);

  useEffect(() => {
    document.title = "Signals to Support — Interactive Research Map";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "An interactive research map exploring how everyday digital traces become emotional states and safe empathic support.",
      );
    }
    return () => {
      document.title = "Yanqing (Rose) Liu — HCI Researcher";
    };
  }, []);

  const handleVisible = useCallback((id: string) => {
    setActiveZone(id);
  }, []);

  const scrollToZone = (id: string) => {
    document.getElementById(`rw-${id}`)?.scrollIntoView({ behavior: "smooth" });
  };

  const entryZone = researchWorld.zones[0];
  const contentZones = researchWorld.zones.slice(1, -1);
  const loopZone = researchWorld.zones[researchWorld.zones.length - 1];

  return (
    <RWLayout>
      <RWProgressNav
        zones={researchWorld.zones}
        activeId={activeZone}
        onSelect={scrollToZone}
      />

      <RWZone zone={entryZone} onVisible={handleVisible} isEntry>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gradient-static">
            {researchWorld.subtitle}
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-ink sm:text-5xl">
            {researchWorld.title}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate">
            {researchWorld.intro}
          </p>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-slate/90">
            {researchWorld.entryBody}
          </p>
          <p className="mt-3 font-serif text-lg text-primary-deep">{hero.headlineSub}</p>
          <button
            type="button"
            onClick={() => scrollToZone("signals")}
            className="mt-8 inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-soft transition hover:bg-primary-deep"
          >
            {researchWorld.entryCta}
          </button>
        </div>
      </RWZone>

      {contentZones.map((zone) => (
        <RWZone
          key={zone.id}
          zone={zone}
          onVisible={handleVisible}
          showItems={zone.id !== "entry"}
        />
      ))}

      <RWClosedLoopZone zone={loopZone} onVisible={handleVisible} />
    </RWLayout>
  );
}
