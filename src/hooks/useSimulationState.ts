import { create } from "zustand";
import type { SimulationState } from "../types/simulation";

export const useSimulationState = create<SimulationState>((set, get) => ({
  tissueMode: "both",
  viewMode: "nmv",
  frameMode: "lab",
  cameraView: "iso",
  b0On: true,
  trMs: 500,
  teMs: 15,
  pulseRequest: null,
  resetId: 0,
  setTissueMode: (mode) => set({ tissueMode: mode }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setFrameMode: (mode) => set({ frameMode: mode }),
  setCameraView: (mode) => set({ cameraView: mode }),
  toggleB0: () => set((state) => ({ b0On: !state.b0On })),
  setTrMs: (value) => set({ trMs: value }),
  setTeMs: (value) => set({ teMs: value }),
  triggerPulse: (angle) => {
    const nextId = (get().pulseRequest?.id ?? 0) + 1;
    set({ pulseRequest: { angle, id: nextId } });
  },
  resetSpins: () => set((state) => ({ resetId: state.resetId + 1 })),
}));
