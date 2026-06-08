const LOWER_BOUND = 0;
const UPPER_BOUND = 1;

const clamp01 = (value: number): number => Math.min(Math.max(value, LOWER_BOUND), UPPER_BOUND);

export { clamp01 };
