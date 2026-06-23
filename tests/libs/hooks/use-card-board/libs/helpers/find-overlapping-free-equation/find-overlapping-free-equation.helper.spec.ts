import { describe, expect, it } from "vitest";

import { findOverlappingFreeEquation } from "~/libs/hooks/use-card-board/libs/helpers/find-overlapping-free-equation/find-overlapping-free-equation.helper";
import { type EquationCard } from "~/libs/hooks/use-card-board/libs/types/card.type";

const equationCards: EquationCard[] = [
	{ equationId: 1, key: "eq-1", operandA: 3, operandB: 1, type: "equation" },
	{ equationId: 2, key: "eq-2", operandA: 3, operandB: 2, type: "equation" },
];

// Far apart (cards are 110 wide) so an answer overlaps at most one.
const positions = {
	"eq-1": { x: 0, y: 0 },
	"eq-2": { x: 300, y: 0 },
};

const freePairs = { "eq-1": null, "eq-2": null };

describe("findOverlappingFreeEquation", () => {
	it("returns the equation the answer box overlaps", () => {
		const result = findOverlappingFreeEquation({
			answerPosition: { x: 20, y: 0 },
			equationCards,
			pairs: freePairs,
			positions,
		});

		expect(result).toBe("eq-1");
	});

	it("returns null when the answer only touches (no real overlap)", () => {
		const result = findOverlappingFreeEquation({
			answerPosition: { x: 110, y: 0 },
			equationCards,
			pairs: freePairs,
			positions,
		});

		expect(result).toBeNull();
	});

	it("returns null when the answer overlaps nothing", () => {
		const result = findOverlappingFreeEquation({
			answerPosition: { x: 500, y: 500 },
			equationCards,
			pairs: freePairs,
			positions,
		});

		expect(result).toBeNull();
	});

	it("picks the equation it overlaps most", () => {
		const result = findOverlappingFreeEquation({
			answerPosition: { x: 260, y: 0 },
			equationCards,
			pairs: freePairs,
			positions,
		});

		expect(result).toBe("eq-2");
	});

	it("ignores an occupied equation even when it is the one overlapped", () => {
		const result = findOverlappingFreeEquation({
			answerPosition: { x: 20, y: 0 },
			equationCards,
			pairs: { "eq-1": "ans-0", "eq-2": null },
			positions,
		});

		expect(result).toBeNull();
	});
});
