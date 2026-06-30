import { motion, useReducedMotion } from "framer-motion";
import { signalFlow } from "../content/site";
import { useHeroIllustration } from "../hooks/useHeroIllustration";
import { heroHasSignalVineGrowth } from "../heroVariants";
import { parallaxPx, useHeroParallax } from "../hooks/useHeroParallax.tsx";

const STAGE_ACCENT = ["border-l-sage", "border-l-primary", "border-l-primary-deep"] as const;

const DESKTOP_LAYOUT = [
  {
    className: "md:absolute md:-right-1 md:top-0 md:z-20 md:w-[9.5rem] md:rotate-2",
    depth: 0.5,
    float: {
      delay: 0,
      duration: 5.5,
      rotateY: [-7, 6, -7] as number[],
      rotateX: [4, -3, 4] as number[],
      y: [0, -9, -3, -10, 0] as number[],
    },
  },
  {
    className: "md:absolute md:-left-3 md:top-[22%] md:z-20 md:w-[9.5rem] md:-rotate-1",
    depth: 0.65,
    float: {
      delay: 0.8,
      duration: 6,
      rotateY: [6, -7, 6] as number[],
      rotateX: [-3, 4, -3] as number[],
      y: [0, -7, -2, -8, 0] as number[],
    },
  },
  {
    className: "md:absolute md:-right-1 md:top-[42%] md:z-20 md:w-[10rem] md:rotate-1",
    depth: 0.55,
    float: {
      delay: 1.6,
      duration: 5.8,
      rotateY: [-5, 8, -5] as number[],
      rotateX: [3, -4, 3] as number[],
      y: [0, -10, -4, -9, 0] as number[],
    },
  },
] as const;

function SignalCard({
  label,
  items,
  accentClass,
  index,
}: {
  label: string;
  items: readonly string[];
  accentClass: string;
  index: number;
}) {
  const reducedMotion = useReducedMotion();
  const layout = DESKTOP_LAYOUT[index];

  const card = (
    <div
      className={`signal-card signal-card--alive paper-card pointer-events-auto rounded-xl border-l-[3px] p-3 shadow-soft ${accentClass}`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-primary-deep">
        {label}
      </p>
      <p className="mt-1.5 text-[11px] leading-relaxed text-slate">
        {items.join(" · ")}
      </p>
    </div>
  );

  if (reducedMotion) return card;

  return (
    <motion.div
      className="signal-card-3d"
      style={{ transformStyle: "preserve-3d", perspective: 900 }}
      animate={{
        y: layout.float.y,
        rotateX: layout.float.rotateX,
        rotateY: layout.float.rotateY,
      }}
      transition={{
        duration: layout.float.duration,
        delay: layout.float.delay,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.35, 0.65, 0.85, 1],
      }}
      whileHover={{
        y: -10,
        rotateX: 0,
        rotateY: 0,
        scale: 1.02,
        transition: { duration: 0.3 },
      }}
    >
      {card}
    </motion.div>
  );
}

export default function HeroSignalCards() {
  const parallax = useHeroParallax();
  const illustration = useHeroIllustration();
  const showConnector = !heroHasSignalVineGrowth(illustration);

  return (
    <div className="signal-cards-stage relative w-full md:absolute md:inset-0 md:mt-0 md:pointer-events-none">
      {showConnector && (
        <svg
          className="pointer-events-none absolute inset-0 z-10 hidden md:block"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M88 10 C74 18, 58 26, 44 34 S26 44, 12 32 C24 46, 48 58, 82 52"
            fill="none"
            stroke="#B9786F"
            strokeWidth="0.35"
            strokeLinecap="round"
            strokeDasharray="1.2 1.8"
            opacity="0.4"
            className="signal-vine-path"
          />
        </svg>
      )}
      <p className="mb-2 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-primary-deep/80 md:sr-only">
        {signalFlow.pipeline.join(" → ")}
      </p>
      <div className="flex flex-col gap-2 md:block">
        {signalFlow.stages.map((stage, i) => {
          const layout = DESKTOP_LAYOUT[i];
          const offset = parallaxPx(parallax, layout.depth);
          return (
            <div key={stage.label} className={layout.className}>
              <div
                data-signal-anchor
                style={{
                  transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
                }}
              >
                <SignalCard
                  label={stage.label}
                  items={stage.items}
                  accentClass={STAGE_ACCENT[i]}
                  index={i}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
