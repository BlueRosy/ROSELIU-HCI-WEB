import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { researchWorldAssets } from "../../content/site";
import { rwWonderland } from "../../theme/rwWonderland";
import { LANDMARK_BY_ZONE } from "../research-world/rwWorldConfig";
import TrailModel from "./TrailModel";

const P = LANDMARK_BY_ZONE;

/** Entry: moon-gate portal (the "dome" you frame the trail through) + a flat
 * compass-plaza medallion on the ground. The plaza GLB is authored as a
 * vertical XY disc, so tiltX lays it flat before sizing. */
function EntryGate() {
  return (
    <group>
      <TrailModel
        url={researchWorldAssets.roseCompassPlaza}
        position={[0, 0.02, 4.5]}
        targetXZ={6}
        tiltX={-Math.PI / 2}
      />
      <TrailModel
        url={researchWorldAssets.moonGatePortal}
        position={[0, 0, 1.8]}
        targetY={3.4}
      />
    </group>
  );
}

/** Signals: a single glowing beacon. */
function SignalsBeacon() {
  const light = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (light.current)
      light.current.intensity = 0.7 + Math.sin(clock.elapsedTime * 1.6) * 0.25;
  });
  const p = P.signals.position;
  return (
    <group position={[p[0], 0, p[2]]}>
      <TrailModel
        url={researchWorldAssets.signalBeacon}
        position={[0, 0, 0]}
        targetY={3.6}
      />
      <pointLight
        ref={light}
        position={[0, 3.2, 0]}
        color={rwWonderland.pathGlow}
        intensity={0.8}
        distance={11}
      />
    </group>
  );
}

/** States: emotion prism tower. */
function StatesPrism() {
  const p = P.states.position;
  return (
    <TrailModel
      url={researchWorldAssets.emotionPrismTower}
      position={[p[0], 0, p[2]]}
      targetY={4.4}
      rotationY={Math.PI * 0.15}
    />
  );
}

/** Support: a single gazebo sanctuary. */
function SupportSanctuary() {
  const p = P.support.position;
  return (
    <TrailModel
      url={researchWorldAssets.gazebo}
      position={[p[0], 0, p[2]]}
      targetY={3.4}
      rotationY={-Math.PI * 0.15}
    />
  );
}

/** Loop: research lantern tower (culmination). */
function LoopCulmination() {
  const light = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (light.current)
      light.current.intensity = 1.0 + Math.sin(clock.elapsedTime * 0.9) * 0.2;
  });
  const p = P.loop.position;
  return (
    <group position={[p[0], 0, p[2]]}>
      <TrailModel
        url={researchWorldAssets.researchLanternTower}
        position={[0, 0, 0]}
        targetY={4.6}
      />
      <pointLight
        ref={light}
        position={[0, 4, 0]}
        color={rwWonderland.pathGlowBright}
        intensity={1.0}
        distance={16}
      />
    </group>
  );
}

export default function TrailZoneLandmarks() {
  return (
    <group>
      <EntryGate />
      <SignalsBeacon />
      <StatesPrism />
      <SupportSanctuary />
      <LoopCulmination />
    </group>
  );
}

useGLTF.preload(researchWorldAssets.moonGatePortal);
useGLTF.preload(researchWorldAssets.roseCompassPlaza);
useGLTF.preload(researchWorldAssets.signalBeacon);
useGLTF.preload(researchWorldAssets.emotionPrismTower);
useGLTF.preload(researchWorldAssets.gazebo);
useGLTF.preload(researchWorldAssets.researchLanternTower);
