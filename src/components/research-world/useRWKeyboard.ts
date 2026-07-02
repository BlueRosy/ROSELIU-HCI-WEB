import { useEffect, useRef } from "react";
import type { KeyState } from "./rwWorldConfig";

const INITIAL: KeyState = {
  forward: false,
  back: false,
  left: false,
  right: false,
};

function applyKey(key: string, down: boolean, keys: KeyState) {
  switch (key) {
    case "w":
    case "W":
    case "ArrowUp":
      keys.forward = down;
      break;
    case "s":
    case "S":
    case "ArrowDown":
      keys.back = down;
      break;
    case "a":
    case "A":
    case "ArrowLeft":
      keys.left = down;
      break;
    case "d":
    case "D":
    case "ArrowRight":
      keys.right = down;
      break;
    default:
      break;
  }
}

export function useRWKeyboard(enabled: boolean) {
  const keysRef = useRef<KeyState>({ ...INITIAL });

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (["w", "a", "s", "d", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      applyKey(e.key, true, keysRef.current);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      applyKey(e.key, false, keysRef.current);
    };

    const onBlur = () => {
      keysRef.current = { ...INITIAL };
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, [enabled]);

  return keysRef;
}
