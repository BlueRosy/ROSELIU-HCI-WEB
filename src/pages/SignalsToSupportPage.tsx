import { useEffect } from "react";
import RWExplorationView from "../components/research-world/RWExplorationView";
import RWLayout from "../components/research-world/RWLayout";
import RWMobileFallback from "../components/research-world/RWMobileFallback";
import { useEnable3D } from "../hooks/useEnable3D";

export default function SignalsToSupportPage() {
  const enable3D = useEnable3D();

  useEffect(() => {
    document.title = "Signals to Support — Interactive Research Map";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "An interactive research map exploring how everyday digital traces become emotional states and safe empathic support.",
      );
    }
    return () => {
      document.title = "Yanqing (Rose) Liu — HCI Researcher";
    };
  }, []);

  return (
    <RWLayout variant={enable3D ? "exploration" : "default"}>
      {enable3D ? <RWExplorationView /> : <RWMobileFallback />}
    </RWLayout>
  );
}
