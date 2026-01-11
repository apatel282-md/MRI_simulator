import type { ReactNode } from "react";

interface TooltipProps {
  label: string;
  children: ReactNode;
}

const Tooltip = ({ label, children }: TooltipProps) => {
  return (
    <div className="group relative inline-flex items-center">
      {children}
      <div className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-max -translate-x-1/2 rounded-full bg-ink/90 px-3 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100">
        {label}
      </div>
    </div>
  );
};

export default Tooltip;
