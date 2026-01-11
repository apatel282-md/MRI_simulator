import { useRef } from "react";
import * as THREE from "three";
import TopBar from "./components/ui/TopBar";
import Sidebar from "./components/ui/Sidebar";
import TissueSelector from "./components/ui/TissueSelector";
import ViewModeToggle from "./components/ui/ViewModeToggle";
import FrameToggle from "./components/ui/FrameToggle";
import CameraViewToggle from "./components/ui/CameraViewToggle";
import FieldControls from "./components/ui/FieldControls";
import PulseButtons from "./components/ui/PulseButtons";
import ResetButton from "./components/ui/ResetButton";
import ContrastPanel from "./components/ui/ContrastPanel";
import ScannerScene from "./components/scene/ScannerScene";
import MagnetizationChart from "./components/chart/MagnetizationChart";

const App = () => {
  const nmvRef = useRef(new THREE.Vector3(0, 0, 1));
  const nmvWaterRef = useRef(new THREE.Vector3(0, 0, 1));
  const nmvFatRef = useRef(new THREE.Vector3(0, 0, 1));

  return (
    <div className="min-h-screen flex flex-col text-ink">
      <TopBar />
      <div className="flex-1 px-4 pb-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
          <div className="relative min-h-[420px] overflow-hidden rounded-3xl border border-white/60 bg-white/60 shadow-xl backdrop-blur">
            <ScannerScene
              nmvRef={nmvRef}
              nmvWaterRef={nmvWaterRef}
              nmvFatRef={nmvFatRef}
            />
            <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-ocean shadow">
              3D Spin Lab
            </div>
          </div>
          <Sidebar>
            <TissueSelector />
            <ViewModeToggle />
            <FrameToggle />
            <CameraViewToggle />
            <FieldControls />
            <PulseButtons />
            <ContrastPanel />
            <ResetButton />
          </Sidebar>
        </div>
        <div className="mt-4 rounded-3xl border border-white/70 bg-white/70 p-4 shadow-lg backdrop-blur">
          <MagnetizationChart nmvRef={nmvRef} />
        </div>
      </div>
    </div>
  );
};

export default App;
