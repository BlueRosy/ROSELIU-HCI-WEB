import { useEffect } from "react";

export function useRWInteraction({
  enabled,
  nearZoneId,
  nearNodeId,
  activeZoneId,
  activeCardId,
  onOpenZone,
  onOpenCard,
  onClose,
}: {
  enabled: boolean;
  nearZoneId: string | null;
  nearNodeId: string | null;
  activeZoneId: string | null;
  activeCardId: string | null;
  onOpenZone: (zoneId: string) => void;
  onOpenCard: (nodeId: string) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "e" || e.key === "E") {
        if (!activeZoneId && !activeCardId) {
          if (nearZoneId) {
            e.preventDefault();
            onOpenZone(nearZoneId);
          } else if (nearNodeId) {
            e.preventDefault();
            onOpenCard(nearNodeId);
          }
        }
      }
      if (e.key === "Escape" && (activeZoneId || activeCardId)) {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    enabled,
    nearZoneId,
    nearNodeId,
    activeZoneId,
    activeCardId,
    onOpenZone,
    onOpenCard,
    onClose,
  ]);
}
