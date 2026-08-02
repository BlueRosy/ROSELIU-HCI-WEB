import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import { useIsMobileViewport } from "../hooks/useEnable3D";

const SignalsToSupportDesktop = lazy(() => import("./SignalsToSupportDesktop"));

/**
 * Research World entry.
 * Phones never mount WebGL — redirect home Research section instead.
 */
export default function SignalsToSupportPage() {
  const mobile = useIsMobileViewport();

  if (mobile) {
    return <Navigate to="/" replace />;
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-bg text-slate">
          <p className="font-mono text-sm">Loading Research World…</p>
        </div>
      }
    >
      <SignalsToSupportDesktop />
    </Suspense>
  );
}
