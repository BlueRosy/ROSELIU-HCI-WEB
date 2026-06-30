import type { ReactNode } from "react";

export type HeroAvatarSlotState = "loading" | "idle" | "error";

export function HeroAvatarGlow() {
  return (
    <div
      className="pointer-events-none absolute inset-x-[8%] bottom-[6%] h-[24%] rounded-full blur-3xl"
      style={{
        background:
          "radial-gradient(ellipse, rgba(68,153,229,0.28) 0%, rgba(110,184,245,0.18) 45%, rgba(157,217,217,0.14) 75%, transparent 90%)",
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
                <span className="font-serif text-4xl text-navy/15 sm:text-5xl">YL</span>
              )}
            </div>
          </div>
        </div>
      )}

      {showError && (
        <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-primary/12 to-accent/10">
          <span className="font-serif text-5xl text-navy/25">YL</span>
          <span className="sr-only">Avatar unavailable</span>
        </div>
      )}

      {children}
    </div>
  );
}
