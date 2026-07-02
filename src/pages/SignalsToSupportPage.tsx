import { useEffect } from "react";
import ResearchAtlasView from "../components/research-atlas/ResearchAtlasView";
import RWLayout from "../components/research-world/RWLayout";

export default function SignalsToSupportPage() {
  useEffect(() => {
    document.title = "Signals to Support — Interactive Research Atlas";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "An interactive research atlas exploring how everyday digital traces become emotional states and safe empathic support.",
      );
    }
    return () => {
      document.title = "Yanqing (Rose) Liu — HCI Researcher";
    };
  }, []);

  return (
    <RWLayout>
      <ResearchAtlasView />
    </RWLayout>
  );
}
