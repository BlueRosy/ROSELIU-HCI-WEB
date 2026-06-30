import { createContext, useContext, type ReactNode } from "react";
import { profile } from "../content/site";

const HeroIllustrationContext = createContext<string | null>(null);

export function HeroIllustrationProvider({
  src,
  children,
}: {
  src?: string;
  children: ReactNode;
}) {
  return (
    <HeroIllustrationContext.Provider value={src ?? null}>
      {children}
    </HeroIllustrationContext.Provider>
  );
}

export function useHeroIllustration(): string {
  const override = useContext(HeroIllustrationContext);
  return override ?? profile.heroIllustration;
}
