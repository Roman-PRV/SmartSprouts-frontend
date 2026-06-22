// mulberry32 — a tiny deterministic PRNG. The same seed always yields the same
// sequence, so board scatter and answer shuffle are reproducible per level (no
// flaky layouts, fully testable geometry). The constants below are the
// algorithm's fixed mixing values.
const INCREMENT = 0x6D_2B_79_F5;
const MIX_OR = 1;
const MIX_ADD_OR = 61;
const MIX_SHIFT_A = 15;
const MIX_SHIFT_B = 7;
const MIX_SHIFT_C = 14;
const UINT32_RANGE = 4_294_967_296;
const UINT32_SHIFT = 0;

const createRandom = (seed: number): (() => number) => {
	let state = seed >>> UINT32_SHIFT;

	return (): number => {
		state = (state + INCREMENT) >>> UINT32_SHIFT;
		let value = state;
		value = Math.imul(value ^ (value >>> MIX_SHIFT_A), value | MIX_OR);
		value ^= value + Math.imul(value ^ (value >>> MIX_SHIFT_B), value | MIX_ADD_OR);

		return ((value ^ (value >>> MIX_SHIFT_C)) >>> UINT32_SHIFT) / UINT32_RANGE;
	};
};

export { createRandom };
