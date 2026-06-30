import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { profile } from "./content/site";
import { HeroIllustrationProvider } from "./hooks/useHeroIllustration.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HeroIllustrationProvider src={profile.heroIllustration}>
      <App />
    </HeroIllustrationProvider>
  </StrictMode>,
);
