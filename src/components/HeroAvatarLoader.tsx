import { Suspense, lazy, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { profile } from "../content/site";
import HeroAvatarSlot, { HeroAvatarGlow } from "./HeroAvatarSlot";

const Avatar3D = lazy(() => import("../three/Avatar3D"));

function HeroAvatarLoaded() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="relative aspect-square w-full overflow-visible">
      <HeroAvatarGlow />
      {!visible && (
        <div className="absolute inset-0 z-10">
          <HeroAvatarSlot state="loading" />
        </div>
      )}
      <div
        className="relative z-20 transition-opacity duration-500 ease-out"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <Suspense fallback={null}>
          <Avatar3D
            src={profile.avatar3d}
            fallback={<HeroAvatarSlot state="error" />}
          />
        </Suspense>
      </div>
    </div>
  );
}

export default function HeroAvatarLoader() {
  useEffect(() => {
    useGLTF.preload(profile.avatar3d, "/draco/gltf/");
  }, []);

  return (
    <Suspense fallback={<HeroAvatarSlot state="loading" />}>
      <HeroAvatarLoaded />
    </Suspense>
  );
}
