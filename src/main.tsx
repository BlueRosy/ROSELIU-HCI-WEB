import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import VersionSwitch from "./VersionSwitch.tsx";
import { HeroIllustrationProvider } from "./hooks/useHeroIllustration.tsx";

// "/"     -> main Rose editorial site (hero from site.ts, currently h1)
// "/new"  -> same site with h6 hero for A/B comparison
const path = window.location.pathname.replace(/\/+$/, "") || "/";
const isH6Compare = path === "/new";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HeroIllustrationProvider
      src={isH6Compare ? "/Rose-PersonalImage/h6.png" : undefined}
    >
      <App />
    </HeroIllustrationProvider>
    <VersionSwitch isH6Compare={isH6Compare} />
  </StrictMode>,
);
