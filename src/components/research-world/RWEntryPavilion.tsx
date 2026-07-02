import { Text } from "@react-three/drei";
import { researchWorldAssets } from "../../content/site";
import { rwWonderland } from "../../theme/rwWonderland";
import RWGltfModel from "./RWGltfModel";

export default function RWEntryPavilion() {
  return (
    <group position={[0, 0, 3.2]}>
      <RWGltfModel
        url={researchWorldAssets.entryPavilion}
        position={[0, 0, 0]}
        targetHeight={2.8}
      />
      <Text
        position={[0, 2.2, 0.3]}
        fontSize={0.14}
        color={rwWonderland.text}
        anchorX="center"
        anchorY="middle"
        maxWidth={2.2}
      >
        Welcome
      </Text>
      <Text
        position={[0, 1.9, 0.3]}
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
