import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { hero, researchWorld } from "../../content/site";
import { rwWonderland } from "../../theme/rwWonderland";
import RWCardDetailOverlay from "./RWCardDetailOverlay";
import RWIntroOverlay from "./RWIntroOverlay";
import RWLoadingScreen from "./RWLoadingScreen";
import RWZoneContentOverlay from "./RWZoneContentOverlay";
import RWZoneProgressBar from "./RWZoneProgressBar";
import { getTeleportPosition, type PathNode, zoneById } from "./rwWorldConfig";
import { useRWInteraction } from "./useRWInteraction";
import { useRWKeyboard } from "./useRWKeyboard";

const RWWorldCanvas = lazy(() => import("./RWWorldCanvas"));

export default function RWExplorationView() {
  const [introDone, setIntroDone] = useState(
    () => typeof window !== "undefined" && !!localStorage.getItem("rw-intro-seen"),
  );
  const keysRef = useRWKeyboard(introDone);
  const playerPosRef = useRef(new THREE.Vector3(0, 0, 5));
  const teleportTargetRef = useRef<THREE.Vector3 | null>(null);
  const pathNodesRef = useRef<PathNode[]>([]);
  const [nearZoneId, setNearZoneId] = useState<string | null>(null);
  const [nearNodeId, setNearNodeId] = useState<string | null>(null);
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [navZoneId, setNavZoneId] = useState<string | null>("entry");
  const [showHints, setShowHints] = useState(true);
  const [moving, setMoving] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [loadingVisible, setLoadingVisible] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setShowHints(false), 5000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (sceneReady) {
      const t = window.setTimeout(() => setLoadingVisible(false), 900);
      return () => window.clearTimeout(t);
    }
  }, [sceneReady]);

  const handleOpenZone = useCallback((zoneId: string) => {
    setActiveCardId(null);
    setActiveZoneId(zoneId);
    setNavZoneId(zoneId);
  }, []);

  const handleOpenCard = useCallback((nodeId: string) => {
    setActiveZoneId(null);
    setActiveCardId(nodeId);
  }, []);

  const handleClose = useCallback(() => {
    setActiveZoneId(null);
    setActiveCardId(null);
  }, []);

  const handleNavSelect = useCallback((zoneId: string) => {
    const pos = getTeleportPosition(zoneId);
    if (!pos) return;
    teleportTargetRef.current = new THREE.Vector3(pos[0], pos[1], pos[2]);
    playerPosRef.current.set(pos[0], pos[1], pos[2]);
    setNavZoneId(zoneId);
    handleClose();
  }, [handleClose]);

  useRWInteraction({
    enabled: introDone,
    nearZoneId,
    nearNodeId,
    activeZoneId,
    activeCardId,
    onOpenZone: handleOpenZone,
    onOpenCard: handleOpenCard,
    onClose: handleClose,
  });

  const nearZone = nearZoneId ? zoneById(researchWorld.zones, nearZoneId) : null;
  const activeCard = activeCardId
    ? pathNodesRef.current.find((n) => n.id === activeCardId) ?? null
    : null;

  return (
    <div className="fixed inset-0 z-0" style={{ backgroundColor: rwWonderland.background }}>
      {loadingVisible && <RWLoadingScreen done={sceneReady} />}

      <Suspense fallback={null}>
        <RWWorldCanvas
          keysRef={keysRef}
          playerPosRef={playerPosRef}
          onNearZoneChange={setNearZoneId}
          onNearNodeChange={setNearNodeId}
          activeZoneId={activeZoneId}
          nearZoneId={nearZoneId}
          nearNodeId={nearNodeId}
          onMovingChange={setMoving}
          teleportTargetRef={teleportTargetRef}
          pathNodesRef={pathNodesRef}
          onSceneReady={() => setSceneReady(true)}
        />
      </Suspense>

      {!introDone && <RWIntroOverlay onStart={() => setIntroDone(true)} />}

      <div className="pointer-events-none fixed inset-0 z-10">
        <div className="absolute left-5 top-28 max-w-xs">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary-deep">
            {researchWorld.subtitle}
          </p>
          <h1 className="mt-1 font-serif text-2xl text-ink">{researchWorld.title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate">{hero.headlineSub}</p>
        </div>

        {introDone && nearZone && !activeZoneId && !activeCardId && (
          <div className="glass absolute left-1/2 top-24 -translate-x-1/2 rounded-full border border-primary/30 px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-primary-deep">
            Press E — {nearZone.label}
          </div>
        )}

        {introDone && nearNodeId && !nearZoneId && !activeZoneId && !activeCardId && (
          <div className="glass absolute left-1/2 top-24 -translate-x-1/2 rounded-full border border-primary/30 px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-primary-deep">
            Press E — read card
          </div>
        )}

        {introDone && (nearZoneId || moving) && (
          <p className="absolute bottom-24 left-5 font-mono text-[10px] uppercase tracking-[0.16em] text-slate/80">
            {nearZone ? `Near: ${nearZone.label}` : "Exploring"}
            {moving ? " · walking" : ""}
          </p>
        )}

        {introDone && (
          <div
            className={`glass absolute bottom-20 right-4 rounded-full border border-border/60 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate transition-opacity duration-700 md:bottom-24 ${
              showHints ? "opacity-100" : "opacity-0"
            }`}
          >
            WASD move · E interact · Esc close
          </div>
        )}
      </div>

      {introDone && (
        <RWZoneProgressBar activeZoneId={navZoneId} onSelect={handleNavSelect} />
      )}

      {activeZoneId && (
        <RWZoneContentOverlay zoneId={activeZoneId} onClose={handleClose} />
      )}
      {activeCard && (
        <RWCardDetailOverlay node={activeCard} onClose={handleClose} />
      )}
    </div>
  );
}
