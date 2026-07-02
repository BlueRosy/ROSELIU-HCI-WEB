import { useEffect } from "react";
import ResearchUniverseView from "../components/research-universe/ResearchUniverseView";
import RWLayout from "../components/research-world/RWLayout";

export default function SignalsToSupportPage() {
  useEffect(() => {
    document.title = "Signals to Support — 3D Research Universe";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "A cinematic 3D research universe exploring how everyday digital traces become emotional states and safe empathic support.",
      );
    }
    return () => {
      document.title = "Yanqing (Rose) Liu — HCI Researcher";
    };
  }, []);

  return (
    <RWLayout>
      <ResearchUniverseView />
    </RWLayout>
  );
}
