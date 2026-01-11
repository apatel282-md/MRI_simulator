import Tooltip from "./Tooltip";
import { useSimulationState } from "../../hooks/useSimulationState";

const FieldControls = () => {
  const b0On = useSimulationState((state) => state.b0On);
  const toggleB0 = useSimulationState((state) => state.toggleB0);

  return (
    <section className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">B0 Field</h2>
        <Tooltip label="Turn B0 off to randomize spins and collapse net magnetization.">
          <span className="text-xs font-mono text-ocean/70">field</span>
        </Tooltip>
      </div>
      <button
        onClick={toggleB0}
        className={`mt-3 flex w-full items-center justify-between rounded-2xl px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition ${
          b0On
            ? "bg-emerald-500 text-white shadow"
            : "bg-rose-500 text-white shadow"
        }`}
      >
        <span>{b0On ? "B0 On" : "B0 Off"}</span>
        <span className="text-lg">{b0On ? "▮▮" : "▮"}</span>
      </button>
    </section>
  );
};

export default FieldControls;
