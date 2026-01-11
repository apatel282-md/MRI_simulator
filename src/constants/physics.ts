export const WATER_PROPS = {
  t1: 4.0,
  t2: 2.0,
  freq: 1.0,
  color: "#3b82f6",
};

export const FAT_PROPS = {
  t1: 1.5,
  t2: 0.4,
  freq: 0.93,
  color: "#facc15",
};

export const SPIN_COUNT = 30;
export const WATER_COUNT = 15;
export const FAT_COUNT = 15;
export const EQUILIBRIUM_MZ = 1;
export const RF_PULSE_DURATION = 0.3;
export const POST_PULSE_SLOWMO_DURATION = 4.0;
export const POST_PULSE_SLOWMO_SCALE = 0.35;
export const B0_NOISE_SCALE = 0.06;
export const TWO_PI = Math.PI * 2;
export const AVERAGE_FREQ = (WATER_PROPS.freq + FAT_PROPS.freq) / 2;
