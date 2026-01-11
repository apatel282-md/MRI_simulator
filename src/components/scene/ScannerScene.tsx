import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import type { MutableRefObject } from "react";
import type { Vector3 } from "three";
import { useSimulationState } from "../../hooks/useSimulationState";
import CameraRig from "./CameraRig";
import CoordinateGrid from "./CoordinateGrid";
import Lighting from "./Lighting";
import ProtonSystem from "./ProtonSystem";

interface ScannerSceneProps {
  nmvRef: MutableRefObject<Vector3>;
  nmvWaterRef: MutableRefObject<Vector3>;
  nmvFatRef: MutableRefObject<Vector3>;
}

const ScannerScene = ({ nmvRef, nmvWaterRef, nmvFatRef }: ScannerSceneProps) => {
  const frameMode = useSimulationState((state) => state.frameMode);
  const cameraView = useSimulationState((state) => state.cameraView);

  return (
    <Canvas className="h-full w-full" camera={{ position: [2.6, 2.3, 2.4], fov: 50 }}>
      <Suspense fallback={null}>
        <Lighting />
        <CoordinateGrid />
        <ProtonSystem nmvRef={nmvRef} nmvWaterRef={nmvWaterRef} nmvFatRef={nmvFatRef} />
        <CameraRig frameMode={frameMode} cameraView={cameraView} />
      </Suspense>
    </Canvas>
  );
};

export default ScannerScene;
