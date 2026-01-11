import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";

interface NetMagnetizationVectorProps {
  nmvRef: MutableRefObject<THREE.Vector3>;
  color: string;
  visible?: boolean;
}

const NetMagnetizationVector = ({
  nmvRef,
  color,
  visible = true,
}: NetMagnetizationVectorProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const axis = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const quaternion = useMemo(() => new THREE.Quaternion(), []);
  const direction = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (!groupRef.current) {
      return;
    }
    const vec = nmvRef.current;
    const length = vec.length();
    const isVisible = visible && length > 0.001;
    groupRef.current.visible = isVisible;
    if (!isVisible) {
      return;
    }

    direction.copy(vec).normalize();
    quaternion.setFromUnitVectors(axis, direction);
    groupRef.current.quaternion.copy(quaternion);
    groupRef.current.scale.set(1, Math.max(0.001, length), 1);
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <coneGeometry args={[0.1, 0.2, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
};

export default NetMagnetizationVector;
