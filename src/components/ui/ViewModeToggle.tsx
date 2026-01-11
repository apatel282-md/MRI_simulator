import Tooltip from "./Tooltip";
import { useSimulationState } from "../../hooks/useSimulationState";

const options = [
  { value: "nmv", label: "Net Vector" },
  { value: "spins", label: "Spins" },
] as const;

const ViewModeToggle = () => {
  const viewMode = useSimulationState((state) => state.viewMode);
  const setViewMode = useSimulationState((state) => state.setViewMode);

  return (
    <section className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">View Mode</h2>
        <Tooltip label="Toggle between the net magnetization vector and individual spins.">
          <span className="text-xs font-mono text-ocean/70">mode</span>
        </Tooltip>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => setViewMode(option.value)}
            className={`rounded-2xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
              viewMode === option.value
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

export default ViewModeToggle;
