import { Text } from "@react-three/drei";
import { researchWorldAssets } from "../../content/site";
import { rwWonderland } from "../../theme/rwWonderland";
import RWGltfModel from "./RWGltfModel";

export default function RWEntryPavilion() {
  return (
    <group position={[0, 0, 3.2]}>
      {/* Clean entry apron — keeps hero / title area readable */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 2.2]}>
        <circleGeometry args={[2.8, 48]} />
        <meshStandardMaterial
          color="#FFF5F0"
          emissive={rwWonderland.pathGlow}
          emissiveIntensity={0.08}
          roughness={0.35}
          metalness={0.04}
        />
      </mesh>
      <RWGltfModel
        url={researchWorldAssets.gardenDoor}
        position={[0, 0, 1.9]}
        targetHeight={3.6}
      />
      <RWGltfModel
        url={researchWorldAssets.scholarGazebo}
        position={[0, 0, -0.6]}
        targetHeight={2.6}
      />
      <RWGltfModel
        url={researchWorldAssets.trellisArch}
        position={[-2.4, 0, 1.4]}
        rotation={[0, 0.35, 0]}
        targetHeight={2.2}
      />
      <RWGltfModel
        url={researchWorldAssets.trellisArch}
        position={[2.4, 0, 1.4]}
        rotation={[0, -0.35, 0]}
        targetHeight={2.2}
      />
      <Text
        position={[0, 2.5, 1.95]}
        fontSize={0.14}
        color={rwWonderland.text}
        anchorX="center"
        anchorY="middle"
        maxWidth={2.2}
      >
        Welcome
      </Text>
      <Text
        position={[0, 2.2, 1.95]}
        fontSize={0.08}
        color={rwWonderland.textMuted}
        anchorX="center"
        anchorY="middle"
        maxWidth={2.4}
      >
        Follow the trail ahead
      </Text>
    </group>
  );
}
