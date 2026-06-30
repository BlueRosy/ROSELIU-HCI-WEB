import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import VersionSwitch from "./VersionSwitch.tsx";
import { HeroIllustrationProvider } from "./hooks/useHeroIllustration.tsx";
import { heroVariantForPath } from "./heroVariants.ts";

const variant = heroVariantForPath(window.location.pathname);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HeroIllustrationProvider src={variant.src ?? undefined}>
      <App />
    </HeroIllustrationProvider>
    <VersionSwitch currentPath={variant.path} />
  </StrictMode>,
);
