import { HERO_VARIANTS, type HeroVariantPath } from "./heroVariants";

export default function VersionSwitch({
  currentPath,
}: {
  currentPath: HeroVariantPath;
}) {
  const current = HERO_VARIANTS.find((v) => v.path === currentPath) ?? HERO_VARIANTS[0];

  return (
    <div className="fixed bottom-4 right-4 z-[70] max-w-[min(100vw-2rem,28rem)] rounded-2xl border border-border bg-surface/92 p-2 shadow-lift backdrop-blur">
      <p className="mb-1.5 px-2 font-mono text-[10px] uppercase tracking-[0.12em] text-slate">
        Hero compare · {current.label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {HERO_VARIANTS.map((v) => {
          const active = v.path === currentPath;
          return (
            <a
              key={v.path}
              href={v.path}
              className={`rounded-full px-3 py-1 font-mono text-xs transition ${
                active
                  ? "bg-primary-deep text-white shadow-soft"
                  : "border border-border bg-surface/80 text-slate hover:border-primary/40 hover:text-primary-deep"
              }`}
            >
              {v.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}
