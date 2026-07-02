import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useMotionValueEvent, useSpring } from "framer-motion";
import type { ResearchWorldZone } from "../../content/site";
import RWZonePanel from "./RWZonePanel";
import RWZoneVisual from "./RWZoneVisual";

type ZoneId = "entry" | "signals" | "states" | "support";

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
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const parallaxX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const parallaxY = useSpring(mouseY, { stiffness: 80, damping: 20 });
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useMotionValueEvent(parallaxX, "change", (x) => {
    setParallax((p) => ({ ...p, x }));
  });
  useMotionValueEvent(parallaxY, "change", (y) => {
    setParallax((p) => ({ ...p, y }));
  });

  useEffect(() => {
    if (inView) onVisible?.(zone.id);
  }, [inView, onVisible, zone.id]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    mouseX.set(x * 0.4);
    mouseY.set(y * 0.3);
  };

  const visualZoneId = zone.id as ZoneId;

  return (
    <section
      ref={sectionRef}
      id={`rw-${zone.id}`}
      className="relative h-[115vh]"
      onMouseMove={zone.id === "signals" ? handleMouseMove : undefined}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-bg">
          {zone.id !== "loop" && (
            <RWZoneVisual zoneId={visualZoneId} active={inView} parallax={parallax} />
          )}
        </div>

        <div className="relative z-10 flex h-full items-center">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 lg:flex-row lg:items-center lg:justify-between">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={isEntry ? "max-w-2xl" : ""}
            >
              {isEntry ? (
                children
              ) : zone.id === "loop" ? (
                children
              ) : (
                <RWZonePanel zone={zone} showItems={showItems} />
              )}
            </motion.div>

            {isEntry && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 0.15 } : { opacity: 0 }}
                className="pointer-events-none hidden lg:block"
                aria-hidden="true"
              >
                <div className="h-64 w-64 rounded-full bg-gradient-to-br from-primary/20 to-sage/20 blur-3xl" />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
