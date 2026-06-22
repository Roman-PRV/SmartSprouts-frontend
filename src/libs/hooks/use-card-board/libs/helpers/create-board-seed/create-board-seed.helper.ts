import { type ArithmeticEquationDto } from "~/games/arithmetic/arithmetic";

// FNV-1a-style fold of a level's equations into a 32-bit seed. The same
// equations always produce the same seed (so the same board); folding every
// operand means different levels — and different operations — scatter
// differently.
const SEED_OFFSET = 0x81_1C_9D_C5;
const SEED_PRIME = 0x01_00_01_93;
const UINT32_SHIFT = 0;

const createBoardSeed = (equations: ArithmeticEquationDto[]): number => {
	let seed = SEED_OFFSET;

	for (const equation of equations) {
		seed = Math.imul(seed ^ equation.id, SEED_PRIME);
		seed = Math.imul(seed ^ equation.operand_a, SEED_PRIME);
		seed = Math.imul(seed ^ equation.operand_b, SEED_PRIME);
	}

	return seed >>> UINT32_SHIFT;
};

export { createBoardSeed };
