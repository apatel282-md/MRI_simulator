import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { AVERAGE_FREQ, TWO_PI } from "../../constants/physics";
import type { CameraView, FrameMode } from "../../types/simulation";

interface CameraRigProps {
  frameMode: FrameMode;
  cameraView: CameraView;
}

const VIEW_DISTANCE_FALLBACK = 2.8;

const getViewConfig = (
  view: CameraView,
  distance: number,
  isoPosition: THREE.Vector3,
  isoUp: THREE.Vector3
) => {
  switch (view) {
    case "xy":
      return {
        position: new THREE.Vector3(0, 0, distance),
        up: new THREE.Vector3(0, 1, 0),
      };
    case "xz":
      return {
        position: new THREE.Vector3(0, distance, 0),
        up: new THREE.Vector3(0, 0, 1),
      };
    case "yz":
      return {
        position: new THREE.Vector3(distance, 0, 0),
        up: new THREE.Vector3(0, 0, 1),
      };
    default:
      return {
        position: isoPosition.clone(),
        up: isoUp.clone(),
      };
  }
};

const CameraRig = ({ frameMode, cameraView }: CameraRigProps) => {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const basePosition = useRef(new THREE.Vector3());
  const isoPosition = useRef(new THREE.Vector3());
  const isoUp = useRef(new THREE.Vector3(0, 1, 0));
  const viewDistance = useRef(VIEW_DISTANCE_FALLBACK);
  const angleRef = useRef(0);
  const axis = useMemo(() => new THREE.Vector3(0, 0, 1), []);

  useEffect(() => {
    isoPosition.current.copy(camera.position);
    isoUp.current.copy(camera.up);
    viewDistance.current = camera.position.length() || VIEW_DISTANCE_FALLBACK;
    basePosition.current.copy(camera.position);
  }, [camera]);

  useEffect(() => {
    const { position, up } = getViewConfig(
      cameraView,
      viewDistance.current,
      isoPosition.current,
      isoUp.current
    );
    camera.up.copy(up);
    camera.position.copy(position);
    camera.lookAt(0, 0, 0);
    basePosition.current.copy(position);
    angleRef.current = 0;
    controlsRef.current?.update();
  }, [camera, cameraView]);

  useEffect(() => {
    if (frameMode === "lab") {
      angleRef.current = 0;
      camera.position.copy(basePosition.current);
      camera.lookAt(0, 0, 0);
      controlsRef.current?.update();
      return;
    }
    basePosition.current.copy(camera.position);
  }, [camera, frameMode]);

  useFrame((_, delta) => {
    if (frameMode !== "rotating") {
      return;
    }
    angleRef.current += TWO_PI * AVERAGE_FREQ * delta;
    const rotated = basePosition.current.clone().applyAxisAngle(axis, angleRef.current);
    camera.position.copy(rotated);
    camera.lookAt(0, 0, 0);
    controlsRef.current?.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableRotate={frameMode === "lab"}
      enableZoom
    />
  );
};

export default CameraRig;
