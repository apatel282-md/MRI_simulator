import Tooltip from "./Tooltip";
import { useSimulationState } from "../../hooks/useSimulationState";

const options = [
  { value: "iso", label: "3D" },
  { value: "xy", label: "XY" },
  { value: "xz", label: "XZ" },
  { value: "yz", label: "YZ" },
] as const;

const CameraViewToggle = () => {
  const cameraView = useSimulationState((state) => state.cameraView);
  const setCameraView = useSimulationState((state) => state.setCameraView);

  return (
    <section className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">Camera View</h2>
        <Tooltip label="Switch between 3D and orthogonal plane views.">
          <span className="text-xs font-mono text-ocean/70">view</span>
        </Tooltip>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => setCameraView(option.value)}
            className={`rounded-2xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
              cameraView === option.value
                ? "bg-ink text-white shadow"
                : "bg-white/70 text-ink/60 hover:bg-white"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
};

export default CameraViewToggle;
