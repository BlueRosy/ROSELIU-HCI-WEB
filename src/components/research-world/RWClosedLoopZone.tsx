import { Suspense, useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import ClosedLoop from "../ClosedLoop";
import { useEnable3D } from "../../hooks/useEnable3D";
import RWZoneFallback from "./RWZoneFallback";
import RWZonePanel from "./RWZonePanel";
import type { ResearchWorldZone } from "../../content/site";

export default function RWClosedLoopZone({
  zone,
  onVisible,
}: {
  zone: ResearchWorldZone;
  onVisible?: (id: string) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-30% 0px -30% 0px" });
  const enable3D = useEnable3D();

  useEffect(() => {
    if (inView) onVisible?.(zone.id);
  }, [inView, onVisible, zone.id]);

  return (
    <section ref={ref} id={`rw-${zone.id}`} className="relative min-h-screen py-24">
      <div className="mx-auto max-w-5xl px-5">
        <div className="mb-10">
          <RWZonePanel zone={zone} />
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-2xl">
          {!enable3D && <RWZoneFallback zoneId="loop" />}
          <Suspense fallback={<RWZoneFallback zoneId="loop" />}>
            <ClosedLoop enable3D={enable3D} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
