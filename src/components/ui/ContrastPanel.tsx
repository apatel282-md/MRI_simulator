import Tooltip from "./Tooltip";
import { useSimulationState } from "../../hooks/useSimulationState";
import { FAT_PROPS, WATER_PROPS } from "../../constants/physics";

const PRESETS = {
  t1: { tr: 500, te: 15, label: "T1" },
  t2: { tr: 3000, te: 80, label: "T2" },
  pd: { tr: 3000, te: 15, label: "PD" },
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

const calcSignal = (trMs: number, teMs: number, t1: number, t2: number) => {
  const tr = trMs / 1000;
  const te = teMs / 1000;
  const longitudinal = 1 - Math.exp(-tr / t1);
  const transverse = Math.exp(-te / t2);
  return clamp01(longitudinal * transverse);
};

const tone = (value: number) => Math.round(30 + value * 210);

const ContrastPanel = () => {
  const trMs = useSimulationState((state) => state.trMs);
  const teMs = useSimulationState((state) => state.teMs);
  const setTrMs = useSimulationState((state) => state.setTrMs);
  const setTeMs = useSimulationState((state) => state.setTeMs);

  const waterSignal = calcSignal(trMs, teMs, WATER_PROPS.t1, WATER_PROPS.t2);
  const fatSignal = calcSignal(trMs, teMs, FAT_PROPS.t1, FAT_PROPS.t2);

  const waterTone = tone(waterSignal);
  const fatTone = tone(fatSignal);
  const waterText = waterTone < 120 ? "#f8fafc" : "#0b1b2b";
  const fatText = fatTone < 120 ? "#f8fafc" : "#0b1b2b";

  return (
    <section className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">Image Contrast</h2>
        <Tooltip label="Signal ~ (1 - exp(-TR/T1)) * exp(-TE/T2)">
          <span className="text-xs font-mono text-ocean/70">T1/T2</span>
        </Tooltip>
      </div>

      <div className="mt-3 space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-ink/70">
            <span className="font-semibold">TR (ms)</span>
            <span className="font-mono">{trMs} ms</span>
          </div>
          <input
            type="range"
            min={200}
            max={5000}
            step={50}
            value={trMs}
            onChange={(event) => setTrMs(Number(event.target.value))}
            className="mt-2 w-full accent-emerald-500"
          />
        </div>
        <div>
          <div className="flex items-center justify-between text-xs text-ink/70">
            <span className="font-semibold">TE (ms)</span>
            <span className="font-mono">{teMs} ms</span>
          </div>
          <input
            type="range"
            min={10}
            max={200}
            step={5}
            value={teMs}
            onChange={(event) => setTeMs(Number(event.target.value))}
            className="mt-2 w-full accent-rose-500"
          />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {Object.values(PRESETS).map((preset) => (
          <button
            key={preset.label}
            onClick={() => {
              setTrMs(preset.tr);
              setTeMs(preset.te);
            }}
            className="rounded-2xl border border-white/70 bg-white/70 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/70 transition hover:bg-white"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="mt-3 text-[11px] text-ink/60">
        Reference: T1 (TR 500, TE 15), T2 (TR 3000, TE 80), PD (TR 3000, TE 15)
      </div>
      <div className="mt-2 text-[11px] text-ink/60">
        Short TR emphasizes T1 recovery (fat bright). Long TE emphasizes T2 decay
        (fluid bright).
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div
          className="rounded-2xl border border-water/60 p-3"
          style={{
            backgroundColor: `rgb(${waterTone}, ${waterTone}, ${waterTone})`,
            color: waterText,
          }}
        >
          <div className="text-xs font-semibold">Water</div>
          <div className="text-[11px]" style={{ color: waterText }}>
            Signal {waterSignal.toFixed(2)}
          </div>
        </div>
        <div
          className="rounded-2xl border border-fat/70 p-3"
          style={{
            backgroundColor: `rgb(${fatTone}, ${fatTone}, ${fatTone})`,
            color: fatText,
          }}
        >
          <div className="text-xs font-semibold">Fat</div>
          <div className="text-[11px]" style={{ color: fatText }}>
            Signal {fatSignal.toFixed(2)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContrastPanel;
