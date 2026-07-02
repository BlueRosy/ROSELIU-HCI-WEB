import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { ResearchWorldZone } from "../../content/site";
import RWZonePanel from "./RWZonePanel";

export default function RWZone({
  zone,
  onVisible,
  children,
  showItems = false,
  isEntry = false,
}: {
  zone: ResearchWorldZone;
  onVisible?: (id: string) => void;
  children?: React.ReactNode;
  showItems?: boolean;
  isEntry?: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { margin: "-35% 0px -35% 0px" });

  useEffect(() => {
    if (inView) onVisible?.(zone.id);
  }, [inView, onVisible, zone.id]);

  return (
    <section ref={sectionRef} id={`rw-${zone.id}`} className="relative h-[115vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-bg/85 via-bg/40 to-bg/10 lg:from-bg/75 lg:via-bg/30 lg:to-transparent" />
        </div>

        <div className="relative z-10 flex h-full items-center">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 lg:flex-row lg:items-center lg:justify-start">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={isEntry ? "max-w-2xl" : ""}
            >
              {isEntry || zone.id === "loop" ? children : (
                <RWZonePanel zone={zone} showItems={showItems} />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
