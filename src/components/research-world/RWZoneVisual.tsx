import { Suspense, lazy } from "react";
import { useEnable3D } from "../../hooks/useEnable3D";
import RWZoneFallback from "./RWZoneFallback";

const EntryScene3D = lazy(() => import("./scenes/EntryScene3D"));
const SignalsScene3D = lazy(() => import("./scenes/SignalsScene3D"));
const StatesScene3D = lazy(() => import("./scenes/StatesScene3D"));
const SupportScene3D = lazy(() => import("./scenes/SupportScene3D"));

type ZoneId = "entry" | "signals" | "states" | "support";

export default function RWZoneVisual({
  zoneId,
  active,
  parallax = { x: 0, y: 0 },
}: {
  zoneId: ZoneId;
  active: boolean;
  parallax?: { x: number; y: number };
}) {
  const enable3D = useEnable3D();

  if (!enable3D) {
    return <RWZoneFallback zoneId={zoneId} />;
  }

  return (
    <Suspense fallback={<RWZoneFallback zoneId={zoneId} />}>
      <div className="absolute inset-0">
        {zoneId === "entry" && <EntryScene3D active={active} />}
        {zoneId === "signals" && <SignalsScene3D active={active} parallax={parallax} />}
        {zoneId === "states" && <StatesScene3D active={active} />}
        {zoneId === "support" && <SupportScene3D active={active} />}
      </div>
    </Suspense>
  );
}
