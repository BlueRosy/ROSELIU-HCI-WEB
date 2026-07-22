import { useEffect } from "react";
import ResearchUniverseView from "../components/research-universe/ResearchUniverseView";
import RWLayout from "../components/research-world/RWLayout";

/** Desktop-only shell for the immersive 3D Research World. */
export default function SignalsToSupportDesktop() {
  useEffect(() => {
    document.title = "Signals to Support — 3D Research Universe";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "A cinematic 3D research universe exploring how everyday interaction signals become interpretable states, mechanisms, and safe adaptive support.",
      );
    }
    return () => {
      document.title = "Yanqing Liu";
    };
  }, []);

  return (
    <RWLayout hideFooter>
      <ResearchUniverseView />
    </RWLayout>
  );
}
