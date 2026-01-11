import { useEffect, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import type { Vector3 } from "three";
import type { ChartDataPoint } from "../types/simulation";

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const WINDOW_SECONDS = 10;

export const useChartData = (
  nmvRef: MutableRefObject<Vector3>
): ChartDataPoint[] => {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const startRef = useRef(performance.now());
  const baseTimeRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const vec = nmvRef.current;
      const mz = clamp01(vec.z);
      const mxy = clamp01(Math.sqrt(vec.x * vec.x + vec.y * vec.y));
      const rawTime = (performance.now() - startRef.current) / 1000;
      const nextBase = Math.max(0, rawTime - WINDOW_SECONDS);
      const baseDelta = nextBase - baseTimeRef.current;
      if (baseDelta > 0) {
        baseTimeRef.current = nextBase;
      }
      const time = rawTime - baseTimeRef.current;

      setData((prev) => {
        let next = prev;
        if (baseDelta > 0) {
          next = prev.map((point) => ({
            ...point,
            time: Math.max(0, point.time - baseDelta),
          }));
        } else {
          next = [...prev];
        }

        next = [...next, { time, mz, mxy }];
        if (next.length > 100) {
          next.shift();
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [nmvRef]);

  return data;
};
