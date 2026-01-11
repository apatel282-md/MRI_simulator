import { motion } from "framer-motion";
import Tooltip from "./Tooltip";

const TopBar = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between px-6 py-4"
    >
      <div>
        <p className="text-xs font-mono uppercase tracking-[0.35em] text-ocean/70">
          MRI Physics Simulator
        </p>
        <h1 className="text-3xl font-semibold text-ink">
          Proton Spin Dynamics Playground
        </h1>
      </div>
      <Tooltip label="Explore how water and fat spins precess, relax, and respond to RF pulses.">
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/80 text-lg font-semibold text-ocean shadow-sm transition hover:-translate-y-0.5 hover:bg-white">
          ?
        </button>
      </Tooltip>
    </motion.header>
  );
};

export default TopBar;
