import { motion } from "framer-motion";
import Tooltip from "./Tooltip";
import { useSimulationState } from "../../hooks/useSimulationState";

const ResetButton = () => {
  const resetSpins = useSimulationState((state) => state.resetSpins);

  return (
    <section className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">Reset</h2>
        <Tooltip label="Return spins to equilibrium along +Z.">
          <span className="text-xs font-mono text-ocean/70">reset</span>
        </Tooltip>
      </div>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={resetSpins}
        className="mt-3 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink shadow hover:bg-ink hover:text-white"
      >
        Reset Spins
      </motion.button>
    </section>
  );
};

export default ResetButton;
