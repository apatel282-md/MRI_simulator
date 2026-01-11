import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  B0_NOISE_SCALE,
  EQUILIBRIUM_MZ,
  FAT_COUNT,
  FAT_PROPS,
  POST_PULSE_SLOWMO_DURATION,
  POST_PULSE_SLOWMO_SCALE,
  RF_PULSE_DURATION,
  SPIN_COUNT,
  TWO_PI,
  WATER_COUNT,
  WATER_PROPS,
} from "../constants/physics";
import type { Spin } from "../types/simulation";
import { useSimulationState } from "./useSimulationState";

interface PhysicsEngineConfig {
  spinsRef: MutableRefObject<Spin[]>;
  nmvRef: MutableRefObject<THREE.Vector3>;
  nmvWaterRef: MutableRefObject<THREE.Vector3>;
  nmvFatRef: MutableRefObject<THREE.Vector3>;
}

const pulseAxis = new THREE.Vector3(1, 0, 0);

const buildPositions = () => {
  const positions: THREE.Vector3[] = [];
  for (let i = 0; i < SPIN_COUNT; i += 1) {
    const angle = (i / SPIN_COUNT) * TWO_PI;
    const ring = 0.35 + (i % 5) * 0.12;
    positions.push(
      new THREE.Vector3(Math.cos(angle) * ring, Math.sin(angle) * ring, 0)
    );
  }
  return positions;
};

const createSpin = (
  id: number,
  tissue: "water" | "fat",
  position: THREE.Vector3
): Spin => {
  const props = tissue === "water" ? WATER_PROPS : FAT_PROPS;
  const spread = 0.04;
  const omega = TWO_PI * props.freq * (1 + (Math.random() - 0.5) * spread);
  return {
    id,
    tissue,
    position,
    magnetization: new THREE.Vector3(0, 0, EQUILIBRIUM_MZ),
    omega,
    t1: props.t1,
    t2: props.t2,
  };
};

export const usePhysicsEngine = ({
  spinsRef,
  nmvRef,
  nmvWaterRef,
  nmvFatRef,
}: PhysicsEngineConfig) => {
  const b0On = useSimulationState((state) => state.b0On);
  const pulseRequest = useSimulationState((state) => state.pulseRequest);
  const resetId = useSimulationState((state) => state.resetId);

  const pulseState = useRef({
    active: false,
    angle: 0,
    elapsed: 0,
    duration: RF_PULSE_DURATION,
  });
  const slowMoRef = useRef({ remaining: 0 });
  const lastPulseId = useRef(0);
  const totalRef = useRef(new THREE.Vector3());
  const waterRef = useRef(new THREE.Vector3());
  const fatRef = useRef(new THREE.Vector3());

  const initializeSpins = () => {
    const positions = buildPositions();
    const spins: Spin[] = [];
    for (let i = 0; i < SPIN_COUNT; i += 1) {
      const tissue = i < WATER_COUNT ? "water" : "fat";
      spins.push(createSpin(i, tissue, positions[i]));
    }
    spinsRef.current = spins;
  };

  useEffect(() => {
    if (spinsRef.current.length === 0) {
      initializeSpins();
    }
  }, [spinsRef]);

  useEffect(() => {
    initializeSpins();
    pulseState.current.active = false;
    slowMoRef.current.remaining = 0;
  }, [resetId]);

  useEffect(() => {
    if (!pulseRequest) {
      return;
    }
    if (pulseRequest.id === lastPulseId.current) {
      return;
    }
    lastPulseId.current = pulseRequest.id;
    pulseState.current = {
      active: true,
      angle: THREE.MathUtils.degToRad(pulseRequest.angle),
      elapsed: 0,
      duration: RF_PULSE_DURATION,
    };
  }, [pulseRequest]);

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.05);
    let physicsDelta = clampedDelta;
    if (slowMoRef.current.remaining > 0) {
      physicsDelta = clampedDelta * POST_PULSE_SLOWMO_SCALE;
      slowMoRef.current.remaining = Math.max(
        0,
        slowMoRef.current.remaining - clampedDelta
      );
    }
    const spins = spinsRef.current;

    if (spins.length === 0) {
      return;
    }

    if (pulseState.current.active) {
      const step =
        (pulseState.current.angle / pulseState.current.duration) * clampedDelta;
      spins.forEach((spin) => {
        spin.magnetization.applyAxisAngle(pulseAxis, step);
      });
      pulseState.current.elapsed += clampedDelta;
      if (pulseState.current.elapsed >= pulseState.current.duration) {
        pulseState.current.active = false;
        slowMoRef.current.remaining = POST_PULSE_SLOWMO_DURATION;
      }
    }

    spins.forEach((spin) => {
      if (!b0On) {
        spin.magnetization.x =
          spin.magnetization.x * 0.92 +
          (Math.random() - 0.5) * B0_NOISE_SCALE;
        spin.magnetization.y =
          spin.magnetization.y * 0.92 +
          (Math.random() - 0.5) * B0_NOISE_SCALE;
        spin.magnetization.z =
          spin.magnetization.z * 0.92 +
          (Math.random() - 0.5) * B0_NOISE_SCALE;
        return;
      }

      const phase = spin.omega * physicsDelta;
      const cos = Math.cos(phase);
      const sin = Math.sin(phase);
      const x = spin.magnetization.x;
      const y = spin.magnetization.y;
      spin.magnetization.x = x * cos - y * sin;
      spin.magnetization.y = x * sin + y * cos;

      const t2Decay = Math.exp(-physicsDelta / spin.t2);
      spin.magnetization.x *= t2Decay;
      spin.magnetization.y *= t2Decay;

      const t1Recovery = 1 - Math.exp(-physicsDelta / spin.t1);
      spin.magnetization.z +=
        (EQUILIBRIUM_MZ - spin.magnetization.z) * t1Recovery;
    });

    totalRef.current.set(0, 0, 0);
    waterRef.current.set(0, 0, 0);
    fatRef.current.set(0, 0, 0);

    spins.forEach((spin) => {
      totalRef.current.add(spin.magnetization);
      if (spin.tissue === "water") {
        waterRef.current.add(spin.magnetization);
      } else {
        fatRef.current.add(spin.magnetization);
      }
    });

    totalRef.current.divideScalar(spins.length);
    waterRef.current.divideScalar(WATER_COUNT);
    fatRef.current.divideScalar(FAT_COUNT);

    nmvRef.current.copy(totalRef.current);
    nmvWaterRef.current.copy(waterRef.current);
    nmvFatRef.current.copy(fatRef.current);

  });
};
