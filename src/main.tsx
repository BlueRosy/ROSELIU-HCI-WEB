import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import LegacyApp from "./legacy/App.tsx";
import VersionSwitch from "./VersionSwitch.tsx";

// Simple path-based version routing for side-by-side comparison.
// "/"     -> original version (LegacyApp)
// "/new"  -> new Editorial version (App)
const path = window.location.pathname.replace(/\/+$/, "");
const isNew = path === "/new";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {isNew ? <App /> : <LegacyApp />}
    <VersionSwitch isNew={isNew} />
  </StrictMode>,
);
