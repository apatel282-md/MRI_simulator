import { Text } from "@react-three/drei";

const CoordinateGrid = () => {
  return (
    <group>
      <gridHelper args={[2.6, 12, "#cbd5f5", "#e2e8f0"]} />
      <axesHelper args={[1.6]} />
      <Text position={[1.75, 0, 0]} fontSize={0.12} color="#0f4c5c">
        X
      </Text>
      <Text position={[0, 1.75, 0]} fontSize={0.12} color="#0f4c5c">
        Y
      </Text>
      <Text position={[0, 0, 1.75]} fontSize={0.12} color="#0f4c5c">
        Z / B0
      </Text>
    </group>
  );
};

export default CoordinateGrid;
