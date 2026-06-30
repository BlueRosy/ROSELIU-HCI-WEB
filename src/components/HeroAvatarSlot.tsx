import type { ReactNode } from "react";

export type HeroAvatarSlotState = "loading" | "idle" | "error";

export function HeroAvatarGlow() {
  return (
    <div
      className="pointer-events-none absolute inset-x-[8%] bottom-[6%] h-[24%] rounded-full blur-3xl"
      style={{
        background:
          "radial-gradient(ellipse, rgba(185,120,111,0.24) 0%, rgba(138,146,117,0.16) 45%, rgba(212,165,158,0.12) 75%, transparent 90%)",
      }}
      aria-hidden="true"
    />
  );
}

export default function HeroAvatarSlot({
  state,
  children,
  className = "",
}: {
  state: HeroAvatarSlotState;
  children?: ReactNode;
  className?: string;
}) {
  const showRing = state === "loading" || state === "idle";
  const showError = state === "error";

  return (
    <div className={`relative aspect-square w-full overflow-visible ${className}`}>
      {!children && <HeroAvatarGlow />}

      {showRing && (
        <div className="hero-avatar-slot__frame" aria-hidden={state === "loading"}>
          <div className="hero-avatar-slot__halo" />
          <div className="hero-avatar-slot__ring">
            <div className="hero-avatar-slot__inner">
              {state === "loading" && (
                <span className="sr-only">Loading 3D avatar</span>
              )}
              {state === "idle" && (
                <span className="font-serif text-4xl text-ink/15 sm:text-5xl">YL</span>
              )}
            </div>
          </div>
        </div>
      )}

      {showError && (
        <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-primary/12 to-accent/10">
          <span className="font-serif text-5xl text-ink/25">YL</span>
          <span className="sr-only">Avatar unavailable</span>
        </div>
      )}

      {children}
    </div>
  );
}
