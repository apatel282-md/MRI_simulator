import type { Vector3 } from "three";

export type TissueType = "water" | "fat";
export type TissueMode = "water" | "fat" | "both";
export type ViewMode = "nmv" | "spins";
export type FrameMode = "lab" | "rotating";
export type CameraView = "iso" | "xy" | "xz" | "yz";

export interface Spin {
  id: number;
  tissue: TissueType;
  position: Vector3;
  magnetization: Vector3;
  omega: number;
  t1: number;
  t2: number;
}

export interface PulseRequest {
  angle: number;
  id: number;
}

export interface SimulationState {
  tissueMode: TissueMode;
  viewMode: ViewMode;
  frameMode: FrameMode;
  cameraView: CameraView;
  b0On: boolean;
  trMs: number;
  teMs: number;
  pulseRequest: PulseRequest | null;
  resetId: number;
  setTissueMode: (mode: TissueMode) => void;
  setViewMode: (mode: ViewMode) => void;
  setFrameMode: (mode: FrameMode) => void;
  setCameraView: (mode: CameraView) => void;
  toggleB0: () => void;
  setTrMs: (value: number) => void;
  setTeMs: (value: number) => void;
  triggerPulse: (angle: number) => void;
  resetSpins: () => void;
}

export interface ChartDataPoint {
  time: number;
  mz: number;
  mxy: number;
}
