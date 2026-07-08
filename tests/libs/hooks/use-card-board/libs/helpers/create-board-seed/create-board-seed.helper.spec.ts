import { describe, expect, it } from "vitest";

import { type ArithmeticEquationDto } from "~/games/arithmetic/arithmetic";
import { createBoardSeed } from "~/libs/hooks/use-card-board/libs/helpers/create-board-seed/create-board-seed.helper";

const EQUATIONS: ArithmeticEquationDto[] = [
	{ id: 1, operand_a: 3, operand_b: 1, result: 3 },
	{ id: 2, operand_a: 3, operand_b: 2, result: 6 },
];

const single = (overrides: Partial<ArithmeticEquationDto>): ArithmeticEquationDto[] => [
	{ id: 1, operand_a: 2, operand_b: 3, result: 6, ...overrides },
];

describe("createBoardSeed", () => {
	it("returns the same seed for identical equations", () => {
		expect(createBoardSeed(EQUATIONS)).toBe(createBoardSeed(EQUATIONS));
	});

	it("changes when the equation id changes", () => {
		expect(createBoardSeed(single({ id: 9 }))).not.toBe(createBoardSeed(single({})));
	});

	it("changes when operand_a changes", () => {
		expect(createBoardSeed(single({ operand_a: 5 }))).not.toBe(createBoardSeed(single({})));
	});

	it("changes when operand_b changes", () => {
		expect(createBoardSeed(single({ operand_b: 5 }))).not.toBe(createBoardSeed(single({})));
	});

	it("returns a non-negative 32-bit integer", () => {
		const seed = createBoardSeed(EQUATIONS);

		expect(Number.isInteger(seed)).toBe(true);
		expect(seed).toBeGreaterThanOrEqual(0);
	});
});
