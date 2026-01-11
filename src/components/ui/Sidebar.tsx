import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface SidebarProps {
  children: ReactNode;
}

const Sidebar = ({ children }: SidebarProps) => {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-4 rounded-3xl border border-white/60 bg-white/70 p-4 shadow-xl backdrop-blur"
    >
      {children}
    </motion.aside>
  );
};

export default Sidebar;
