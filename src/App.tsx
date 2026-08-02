import { lazy, Suspense } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import RoseCursor from "./components/RoseCursor";
import HomePage from "./pages/HomePage";
import SideProjectsPage from "./pages/SideProjectsPage";
import CVPage from "./pages/CVPage";
import JourneyPage from "./pages/JourneyPage";

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
    <>
      <RoseCursor />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/side-projects" element={<SideProjectsPage />} />
          <Route path="/cv" element={<CVPage />} />
          <Route path="/journey" element={<JourneyPage />} />
          <Route path="/rose-research-world" element={<SignalsToSupportPage />} />
          <Route
            path="/signals-to-support"
            element={<Navigate to="/rose-research-world" replace />}
          />
        </Routes>
      </Suspense>
    </>
  );
}
