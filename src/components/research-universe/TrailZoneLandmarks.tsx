import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { researchWorldAssets } from "../../content/site";
import { rwWonderland } from "../../theme/rwWonderland";
import { LANDMARK_BY_ZONE } from "../research-world/rwWorldConfig";
import TrailModel from "./TrailModel";

const P = LANDMARK_BY_ZONE;

/** Entry: moon-gate portal (the "dome" you fly through) + compass plaza medallion. */
function EntryGate() {
  return (
    <group>
      <TrailModel
        url={researchWorldAssets.roseCompassPlaza}
        position={[0, 0.02, 4]}
        targetXZ={7}
      />
      <TrailModel
        url={researchWorldAssets.moonGatePortal}
        position={[0, 0, 3.4]}
        targetY={4.4}
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

/** Support: reflection pond + a gazebo beside it. */
function SupportSanctuary() {
  const p = P.support.position;
  return (
    <group position={[p[0], 0, p[2]]}>
      <TrailModel
        url={researchWorldAssets.reflectionPond}
        position={[0, 0.02, 0]}
        targetXZ={5.5}
      />
      <TrailModel
        url={researchWorldAssets.gazebo}
        position={[1.9, 0, -1.4]}
        targetY={3.2}
        rotationY={-Math.PI * 0.25}
      />
    </group>
  );
}

/** Loop: research lantern tower (culmination) + thesis archive beside it. */
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
        targetY={4.8}
      />
      <TrailModel
        url={researchWorldAssets.thesisArchive}
        position={[-3.4, 0, -1.2]}
        targetY={3.0}
        rotationY={Math.PI * 0.2}
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
useGLTF.preload(researchWorldAssets.reflectionPond);
useGLTF.preload(researchWorldAssets.gazebo);
useGLTF.preload(researchWorldAssets.researchLanternTower);
useGLTF.preload(researchWorldAssets.thesisArchive);
