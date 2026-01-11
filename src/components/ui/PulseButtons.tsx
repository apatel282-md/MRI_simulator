import { motion } from "framer-motion";
import Tooltip from "./Tooltip";
import { useSimulationState } from "../../hooks/useSimulationState";

const PulseButtons = () => {
  const triggerPulse = useSimulationState((state) => state.triggerPulse);

  return (
    <section className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">RF Pulses</h2>
        <Tooltip label="Apply a 90° or 180° RF pulse over 300ms.">
          <span className="text-xs font-mono text-ocean/70">rf</span>
        </Tooltip>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[90, 180].map((angle) => (
          <motion.button
            key={angle}
            whileTap={{ scale: 0.96 }}
            onClick={() => triggerPulse(angle)}
            className="rounded-2xl bg-ink px-3 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow hover:bg-ink/90"
          >
            {angle}° Pulse
          </motion.button>
        ))}
      </div>
    </section>
  );
};

export default PulseButtons;
