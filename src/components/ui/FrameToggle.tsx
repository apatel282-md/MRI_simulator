import Tooltip from "./Tooltip";
import { useSimulationState } from "../../hooks/useSimulationState";

const options = [
  { value: "lab", label: "Lab Frame" },
  { value: "rotating", label: "Rotating" },
] as const;

const FrameToggle = () => {
  const frameMode = useSimulationState((state) => state.frameMode);
  const setFrameMode = useSimulationState((state) => state.setFrameMode);

  return (
    <section className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">Reference Frame</h2>
        <Tooltip label="Rotating frame removes the average precession to reveal chemical shift.">
          <span className="text-xs font-mono text-ocean/70">frame</span>
        </Tooltip>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => setFrameMode(option.value)}
            className={`rounded-2xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
              frameMode === option.value
                ? "bg-ocean text-white shadow"
                : "bg-white/70 text-ocean/70 hover:bg-white"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
};

export default FrameToggle;
