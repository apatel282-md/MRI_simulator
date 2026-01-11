import Tooltip from "./Tooltip";
import { useSimulationState } from "../../hooks/useSimulationState";

const options = [
  { value: "water", label: "Water" },
  { value: "fat", label: "Fat" },
  { value: "both", label: "Both" },
] as const;

const TissueSelector = () => {
  const tissueMode = useSimulationState((state) => state.tissueMode);
  const setTissueMode = useSimulationState((state) => state.setTissueMode);

  return (
    <section className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">Tissue Type</h2>
        <Tooltip label="Compare water (slow T1/T2) and fat (fast T1/T2) spins.">
          <span className="text-xs font-mono text-ocean/70">info</span>
        </Tooltip>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => setTissueMode(option.value)}
            className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
              tissueMode === option.value
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

export default TissueSelector;
