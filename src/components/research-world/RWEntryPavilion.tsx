import { Text } from "@react-three/drei";
import { researchWorldAssets } from "../../content/site";
import { rwWonderland } from "../../theme/rwWonderland";
import RWGltfModel from "./RWGltfModel";

export default function RWEntryPavilion() {
  return (
    <group position={[0, 0, 3.2]}>
      {/* Garden door — the gate you pass through onto the trail. */}
      <RWGltfModel
        url={researchWorldAssets.gardenDoor}
        position={[0, 0, 1.9]}
        targetHeight={3.6}
      />
      {/* Scholar gazebo set behind the gate as the welcome pavilion. */}
      <RWGltfModel
        url={researchWorldAssets.scholarGazebo}
        position={[0, 0, -0.6]}
        targetHeight={2.6}
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
