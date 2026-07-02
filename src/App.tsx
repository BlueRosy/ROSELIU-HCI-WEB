import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";

const SignalsToSupportPage = lazy(() => import("./pages/SignalsToSupportPage"));

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg text-slate">
      <p className="font-mono text-sm">Loading…</p>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signals-to-support" element={<SignalsToSupportPage />} />
      </Routes>
    </Suspense>
  );
}
