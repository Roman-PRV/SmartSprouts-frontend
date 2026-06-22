import { describe, expect, it } from "vitest";

import { findNearestFreeEquation } from "~/libs/hooks/use-card-board/libs/helpers/find-nearest-free-equation/find-nearest-free-equation.helper";
import { type EquationCard } from "~/libs/hooks/use-card-board/libs/types/card.type";

const THRESHOLD = 60;

const equationCards: EquationCard[] = [
	{ equationId: 1, key: "eq-1", operandA: 3, operandB: 1, type: "equation" },
	{ equationId: 2, key: "eq-2", operandA: 3, operandB: 2, type: "equation" },
];

const positions = {
	"eq-1": { x: 0, y: 0 },
	"eq-2": { x: 200, y: 0 },
};

const freePairs = { "eq-1": null, "eq-2": null };

describe("findNearestFreeEquation", () => {
	it("returns the equation when the answer is within the threshold", () => {
		const result = findNearestFreeEquation({
			answerPosition: { x: 10, y: 0 },
			equationCards,
			pairs: freePairs,
			positions,
			threshold: THRESHOLD,
		});

		expect(result).toBe("eq-1");
	});

	it("returns null when no equation is within the threshold", () => {
		const result = findNearestFreeEquation({
			answerPosition: { x: 100, y: 100 },
			equationCards,
			pairs: freePairs,
			positions,
			threshold: THRESHOLD,
		});

		expect(result).toBeNull();
	});

	it("picks the nearest of several free equations", () => {
		const result = findNearestFreeEquation({
			answerPosition: { x: 180, y: 0 },
			equationCards,
			pairs: freePairs,
			positions,
			threshold: THRESHOLD,
		});

		expect(result).toBe("eq-2");
	});

	it("ignores an occupied equation even when it is nearest", () => {
		const result = findNearestFreeEquation({
			answerPosition: { x: 10, y: 0 },
			equationCards,
			pairs: { "eq-1": "ans-0", "eq-2": null },
			positions,
			threshold: THRESHOLD,
		});

		expect(result).toBeNull();
	});
});
