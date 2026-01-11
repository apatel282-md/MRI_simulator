import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MutableRefObject } from "react";
import type { Vector3 } from "three";
import { useChartData } from "../../hooks/useChartData";

interface MagnetizationChartProps {
  nmvRef: MutableRefObject<Vector3>;
}

const MagnetizationChart = ({ nmvRef }: MagnetizationChartProps) => {
  const data = useChartData(nmvRef);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">Magnetization History</h2>
        <span className="text-xs font-mono text-ink/60">
          Mz (T1) vs Mxy (T2)
        </span>
      </div>
      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
            <XAxis
              dataKey="time"
              type="number"
              domain={[0, 10]}
              tickCount={6}
              tickFormatter={(value) => `${value.toFixed(1)}s`}
              stroke="#64748b"
              fontSize={10}
            />
            <YAxis
              domain={[0, 1]}
              tickFormatter={(value) => value.toFixed(1)}
              stroke="#64748b"
              fontSize={10}
            />
            <RechartsTooltip
              formatter={(value: number) => value.toFixed(2)}
              labelFormatter={(label) => `t = ${label.toFixed(2)}s`}
            />
            <Legend verticalAlign="top" height={24} />
            <Line
              type="monotone"
              dataKey="mz"
              name="Mz (T1 Recovery)"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="mxy"
              name="Mxy (T2 Decay)"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid gap-2 text-xs text-ink/70 sm:grid-cols-2">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 px-3 py-2">
          <span className="font-semibold text-t1">T1 recovery:</span> Mz
          (longitudinal) regrows toward equilibrium after a pulse.
        </div>
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 px-3 py-2">
          <span className="font-semibold text-t2">T2 decay:</span> Mxy
          (transverse) loses phase coherence faster in fat than water.
        </div>
      </div>
    </div>
  );
};

export default MagnetizationChart;
