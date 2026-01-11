import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";
import { FAT_COUNT, FAT_PROPS, WATER_COUNT, WATER_PROPS } from "../../constants/physics";
import type { Spin, TissueMode } from "../../types/simulation";

interface IndividualSpinsProps {
  spinsRef: MutableRefObject<Spin[]>;
  tissueMode: TissueMode;
}

const IndividualSpins = ({ spinsRef, tissueMode }: IndividualSpinsProps) => {
  const waterMesh = useRef<THREE.InstancedMesh>(null);
  const fatMesh = useRef<THREE.InstancedMesh>(null);
  const axis = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const quaternion = useMemo(() => new THREE.Quaternion(), []);
  const position = useMemo(() => new THREE.Vector3(), []);
  const scale = useMemo(() => new THREE.Vector3(1, 1, 1), []);
  const matrix = useMemo(() => new THREE.Matrix4(), []);

  useFrame(() => {
    if (!waterMesh.current || !fatMesh.current) {
      return;
    }
    let waterIndex = 0;
    let fatIndex = 0;

    spinsRef.current.forEach((spin) => {
      const length = Math.max(0.001, spin.magnetization.length());
      dir.copy(spin.magnetization);
      if (dir.lengthSq() < 1e-6) {
        dir.set(0, 1, 0);
      } else {
        dir.normalize();
      }
      quaternion.setFromUnitVectors(axis, dir);
      scale.set(1, length, 1);
      position.copy(spin.position).addScaledVector(dir, length * 0.5);
      matrix.compose(position, quaternion, scale);

      if (spin.tissue === "water") {
        waterMesh.current.setMatrixAt(waterIndex, matrix);
        waterIndex += 1;
      } else {
        fatMesh.current.setMatrixAt(fatIndex, matrix);
        fatIndex += 1;
      }
    });

    waterMesh.current.instanceMatrix.needsUpdate = true;
    fatMesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh
        ref={waterMesh}
        args={[undefined, undefined, WATER_COUNT]}
        visible={tissueMode !== "fat"}
      >
        <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
        <meshStandardMaterial color={WATER_PROPS.color} />
      </instancedMesh>
      <instancedMesh
        ref={fatMesh}
        args={[undefined, undefined, FAT_COUNT]}
        visible={tissueMode !== "water"}
      >
        <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
        <meshStandardMaterial color={FAT_PROPS.color} />
      </instancedMesh>
    </group>
  );
};

export default IndividualSpins;
